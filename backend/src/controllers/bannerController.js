// backend/controllers/bannerController.js
import Banner from "../models/Banner.js";

// Get all banners
export const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find({}).sort({ order: 1 });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a banner
export const createBanner = async (req, res) => {
  const { title, imageUrl, link, order } = req.body;
  try {
    const banner = new Banner({ title, imageUrl, link, order });
    await banner.save();
    res.status(201).json(banner);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a banner
export const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });
    res.json({ message: "Banner deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
