import multer from "multer";
import fs from "fs";
import path from "path";

const uploadDir = path.resolve("uploads");
fs.mkdirSync(uploadDir, { recursive: true });

// Save uploaded files in /uploads and keep original filename
const storage = multer.diskStorage({
  destination(req, file, cb) {
    try {
      fs.mkdirSync(uploadDir, { recursive: true });
    } catch (err) {
      return cb(err);
    }
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const safeName = String(file.originalname || "proof.png").replace(/[^\w.\-]/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

// File filter: accept only images
function checkFileType(file, cb) {
  const allowedExt = /\.(jpg|jpeg|png|gif|webp|bmp|heic|heif|jfif)$/i;
  const allowedMime = /^image\/(jpeg|png|gif|webp|bmp|heic|heif)$/i;
  const extname = allowedExt.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedMime.test(String(file.mimetype || "").toLowerCase());

  if (extname && mimetype) return cb(null, true);
  cb(new Error("Invalid image format. Use JPG, PNG, GIF, WEBP, BMP, or HEIC."));
}

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (req, file, cb) => checkFileType(file, cb),
});
