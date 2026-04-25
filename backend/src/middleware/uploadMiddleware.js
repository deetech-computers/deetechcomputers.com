import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

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
    files: 5,
  },
  fileFilter: (req, file, cb) => checkFileType(file, cb),
});
