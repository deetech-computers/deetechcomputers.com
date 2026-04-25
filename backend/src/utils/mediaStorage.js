// src/utils/mediaStorage.js
import crypto from "crypto";
import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from "../config/env.js";

const LOCAL_UPLOAD_DIR = path.resolve("uploads");
fs.mkdirSync(LOCAL_UPLOAD_DIR, { recursive: true });

function safeBaseName(file = {}) {
  return String(file.originalname || "upload.png").replace(/[^\w.\-]/g, "_");
}

function resolveExtension(file = {}) {
  const ext = path.extname(safeBaseName(file));
  if (ext) return ext;
  const mime = String(file.mimetype || "").toLowerCase();
  if (mime.includes("jpeg")) return ".jpg";
  if (mime.includes("png")) return ".png";
  if (mime.includes("webp")) return ".webp";
  if (mime.includes("gif")) return ".gif";
  if (mime.includes("bmp")) return ".bmp";
  return ".bin";
}

function cloudinaryConfigured() {
  return Boolean(CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET);
}

function sha1(value) {
  return crypto.createHash("sha1").update(value).digest("hex");
}

function buildSignature(params) {
  const parts = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && String(value) !== "")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`);
  return sha1(`${parts.join("&")}${CLOUDINARY_API_SECRET}`);
}

async function uploadToCloudinary(file, folder) {
  const timestamp = Math.floor(Date.now() / 1000);
  const params = { folder, timestamp };
  const signature = buildSignature(params);
  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

  const form = new FormData();
  form.append("file", new Blob([file.buffer], { type: file.mimetype || "application/octet-stream" }), safeBaseName(file));
  form.append("api_key", CLOUDINARY_API_KEY);
  form.append("timestamp", String(timestamp));
  form.append("folder", folder);
  form.append("signature", signature);

  const response = await fetch(endpoint, {
    method: "POST",
    body: form,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.secure_url) {
    throw new Error(payload?.error?.message || "Cloudinary upload failed");
  }

  return {
    url: payload.secure_url,
    publicId: payload.public_id || "",
    storage: "cloudinary",
  };
}

async function saveLocally(file) {
  const ext = resolveExtension(file);
  const filename = `${Date.now()}-${path.basename(safeBaseName(file), path.extname(safeBaseName(file)))}${ext}`;
  const fullPath = path.join(LOCAL_UPLOAD_DIR, filename);
  await fsPromises.writeFile(fullPath, file.buffer);
  return {
    url: `/uploads/${filename}`,
    publicId: "",
    storage: "local",
  };
}

export async function storeImageFile(file, folder = "deetech/uploads") {
  if (!file?.buffer) {
    throw new Error("Image file buffer is required");
  }
  if (cloudinaryConfigured()) {
    return uploadToCloudinary(file, folder);
  }
  return saveLocally(file);
}

function deriveCloudinaryPublicId(rawUrl) {
  try {
    const parsed = new URL(String(rawUrl || ""));
    if (!/cloudinary\.com$/i.test(parsed.hostname)) return "";
    const marker = "/upload/";
    const idx = parsed.pathname.indexOf(marker);
    if (idx === -1) return "";
    let tail = parsed.pathname.slice(idx + marker.length);
    tail = tail.replace(/^v\d+\//, "");
    const withoutExt = tail.replace(/\.[a-z0-9]+$/i, "");
    return withoutExt;
  } catch {
    return "";
  }
}

async function deleteFromCloudinary(publicId) {
  if (!publicId || !cloudinaryConfigured()) return;
  const timestamp = Math.floor(Date.now() / 1000);
  const params = { public_id: publicId, timestamp };
  const signature = buildSignature(params);
  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/destroy`;

  const form = new FormData();
  form.append("public_id", publicId);
  form.append("api_key", CLOUDINARY_API_KEY);
  form.append("timestamp", String(timestamp));
  form.append("signature", signature);

  await fetch(endpoint, {
    method: "POST",
    body: form,
  }).catch(() => null);
}

export async function deleteStoredMedia(rawUrl) {
  const value = String(rawUrl || "").trim();
  if (!value) return;

  if (value.startsWith("/uploads/")) {
    const filename = path.basename(value.split("?")[0]);
    if (!filename || filename === "." || filename === "..") return;
    const fullPath = path.join(LOCAL_UPLOAD_DIR, filename);
    try {
      await fsPromises.unlink(fullPath);
    } catch (err) {
      if (err?.code !== "ENOENT") {
        console.warn("Local media cleanup skipped:", err?.message || err);
      }
    }
    return;
  }

  const publicId = deriveCloudinaryPublicId(value);
  if (publicId) {
    await deleteFromCloudinary(publicId);
  }
}

export function isCloudinaryEnabled() {
  return cloudinaryConfigured();
}
