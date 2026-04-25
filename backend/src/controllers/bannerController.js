// backend/controllers/bannerController.js
import Banner from "../models/Banner.js";
import { deleteStoredMedia, storeImageFile } from "../utils/mediaStorage.js";

async function resolveBannerImageUrl(req, fallback = "") {
  const uploadedFile = req?.file;
  if (uploadedFile?.buffer) {
    const stored = await storeImageFile(uploadedFile, "deetech/banners");
    return String(stored?.url || "").trim();
  }
  const bodyUrl = String(req?.body?.imageUrl || "").trim();
  if (bodyUrl) return bodyUrl;
  return String(fallback || "").trim();
}

// Get all banners
export const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find({}).sort({ order: 1 });
    res.json(banners);
  } catch (err) {
    console.error("Banner fetch failed, returning empty list:", err?.message || err);
    res.set("x-deetech-fallback", "empty-banners");
    res.status(200).json([]);
  }
};

// Create a banner
export const createBanner = async (req, res) => {
  const { title, link, linkCategory, linkSubCategory, order } = req.body;
  try {
    const imageUrl = await resolveBannerImageUrl(req);
    if (!imageUrl) {
      return res.status(400).json({ message: "Banner image is required (URL or uploaded file)." });
    }
    const banner = new Banner({
      title: String(title || "").trim(),
      imageUrl,
      link: String(link || "").trim(),
      linkCategory: String(linkCategory || "").trim().toLowerCase(),
      linkSubCategory: String(linkSubCategory || "").trim().toLowerCase(),
      order: Number(order || 0),
    });
    await banner.save();
    res.status(201).json(banner);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a banner
export const updateBanner = async (req, res) => {
  const { title, link, linkCategory, linkSubCategory, order } = req.body;
  try {
    const existing = await Banner.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Banner not found" });

    const nextImageUrl = await resolveBannerImageUrl(req, existing.imageUrl);

    const banner = await Banner.findByIdAndUpdate(
      req.params.id,
      {
        title: String(title || "").trim(),
        imageUrl: nextImageUrl,
        link: String(link || "").trim(),
        linkCategory: String(linkCategory || "").trim().toLowerCase(),
        linkSubCategory: String(linkSubCategory || "").trim().toLowerCase(),
        order: Number(order || 0),
      },
      { new: true, runValidators: true }
    );
    if (!banner) return res.status(404).json({ message: "Banner not found" });

    if (req?.file?.buffer && existing.imageUrl && existing.imageUrl !== nextImageUrl) {
      await deleteStoredMedia(existing.imageUrl);
    }
    res.json(banner);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a banner
export const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });
    if (banner.imageUrl) {
      await deleteStoredMedia(banner.imageUrl);
    }
    res.json({ message: "Banner deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
