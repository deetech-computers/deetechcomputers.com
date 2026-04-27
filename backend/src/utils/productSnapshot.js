import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import Product from "../models/Product.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SNAPSHOT_DIR = path.resolve(__dirname, "../../../frontend/assets/data");
const SNAPSHOT_FILE = path.join(SNAPSHOT_DIR, "products-snapshot.json");

function normalizeProduct(product) {
  const id = String(product._id || product.id || "");
  const imageList = Array.isArray(product.images)
    ? product.images.map((img) => String(img || "").trim()).filter(Boolean)
    : [];
  const mainImage = String(product.image_url || imageList[0] || "").trim();

  return {
    _id: id,
    id,
    name: String(product.name || "").trim(),
    short_description: String(product.short_description || "").trim(),
    description: String(product.description || "").trim(),
    specs: product.specs && typeof product.specs === "object"
      ? Object.fromEntries(
          Object.entries(
            typeof product.specs.toObject === "function"
              ? product.specs.toObject()
              : product.specs
          ).map(([k, v]) => [String(k || "").trim(), String(v || "").trim()])
        )
      : {},
    brand: String(product.brand || "").trim(),
    category: String(product.category || "").trim(),
    subCategory: String(product.subCategory || "").trim(),
    price: Number(product.price || 0),
    discountPrice: product.discountPrice == null ? null : Number(product.discountPrice || 0),
    discountMode: String(product.discountMode || "none").trim().toLowerCase(),
    discountStartsAt: product.discountStartsAt || null,
    discountEndsAt: product.discountEndsAt || null,
    countInStock: Number(product.countInStock || 0),
    isFeatured: Boolean(product.isFeatured),
    homeSections: Array.isArray(product.homeSections)
      ? product.homeSections.map((s) => String(s || "").trim().toLowerCase()).filter(Boolean)
      : [],
    image_url: mainImage,
    image: mainImage,
    images: imageList.length ? imageList : (mainImage ? [mainImage] : []),
    sold: Number(product.sold || 0),
    createdAt: product.createdAt || null,
    updatedAt: product.updatedAt || null,
  };
}

export async function buildProductSnapshotPayload() {
  const products = await Product.find({})
    .select(
      "_id name short_description description specs brand category subCategory price discountPrice discountMode discountStartsAt discountEndsAt countInStock isFeatured homeSections image_url images sold createdAt updatedAt"
    )
    .lean();

  const normalized = products.map((p) => normalizeProduct(p));
  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    total: normalized.length,
    products: normalized,
  };
}

export async function rebuildProductSnapshot() {
  const payload = await buildProductSnapshotPayload();
  await fs.mkdir(SNAPSHOT_DIR, { recursive: true });
  await fs.writeFile(SNAPSHOT_FILE, JSON.stringify(payload, null, 2), "utf-8");
  return payload;
}

export async function ensureProductSnapshotExists() {
  try {
    await fs.access(SNAPSHOT_FILE);
    return;
  } catch {
    await rebuildProductSnapshot();
  }
}

export async function readProductSnapshotPayload() {
  try {
    const raw = await fs.readFile(SNAPSHOT_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function readProductSnapshotProducts() {
  const payload = await readProductSnapshotPayload();
  return Array.isArray(payload?.products) ? payload.products : [];
}

export async function findProductInSnapshotById(id) {
  const products = await readProductSnapshotProducts();
  return products.find((p) => String(p?._id || p?.id) === String(id)) || null;
}
