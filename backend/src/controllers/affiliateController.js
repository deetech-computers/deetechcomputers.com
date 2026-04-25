import Affiliate from "../models/Affiliate.js";
import Referral from "../models/Referral.js";
import User from "../models/User.js";
import AffiliateProgramSettings from "../models/AffiliateProgramSettings.js";

function normalizeCode(raw) {
  return String(raw || "").trim().toUpperCase();
}

function buildCodeFromUser(user) {
  const baseName = String(
    user?.firstName || user?.name || user?.email || "AFFILIATE"
  )
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 6);
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${baseName || "DEE"}${rand}`;
}

async function generateUniqueCode(user) {
  let attempts = 0;
  while (attempts < 20) {
    attempts += 1;
    const code = buildCodeFromUser(user);
    const exists = await Affiliate.findOne({ code }).select("_id");
    if (!exists) return code;
  }
  return `DEE${Date.now().toString(36).toUpperCase()}`;
}

const DEFAULT_SETTINGS = {
  defaultCommissionRate: 5,
  tierThresholds: {
    bronze: 5,
    silver: 15,
    gold: 30,
  },
};

async function getProgramSettings() {
  let settings = await AffiliateProgramSettings.findOne({ singleton: "default" });
  if (!settings) {
    settings = await AffiliateProgramSettings.create({
      singleton: "default",
      defaultCommissionRate: DEFAULT_SETTINGS.defaultCommissionRate,
      tierThresholds: DEFAULT_SETTINGS.tierThresholds,
    });
  }
  return settings;
}

function tierFromDeliveredReferrals(count, thresholds = DEFAULT_SETTINGS.tierThresholds) {
  const delivered = Number(count || 0);
  const bronze = Number(thresholds?.bronze || DEFAULT_SETTINGS.tierThresholds.bronze);
  const silver = Number(thresholds?.silver || DEFAULT_SETTINGS.tierThresholds.silver);
  const gold = Number(thresholds?.gold || DEFAULT_SETTINGS.tierThresholds.gold);

  if (delivered >= gold) return "gold";
  if (delivered >= silver) return "silver";
  if (delivered >= bronze) return "bronze";
  return "starter";
}

async function buildAffiliateStats(affiliateId) {
  const [summary] = await Referral.aggregate([
    { $match: { affiliate: affiliateId } },
    {
      $group: {
        _id: "$affiliate",
        totalReferrals: { $sum: 1 },
        pendingReferrals: {
          $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
        },
        deliveredReferrals: {
          $sum: { $cond: [{ $eq: ["$status", "earned"] }, 1, 0] },
        },
        cancelledReferrals: {
          $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
        },
        pendingCommission: {
          $sum: {
            $cond: [{ $eq: ["$status", "pending"] }, "$commissionAmount", 0],
          },
        },
        earnedCommission: {
          $sum: {
            $cond: [{ $eq: ["$status", "earned"] }, "$commissionAmount", 0],
          },
        },
      },
    },
  ]);

  return {
    totalReferrals: Number(summary?.totalReferrals || 0),
    pendingReferrals: Number(summary?.pendingReferrals || 0),
    deliveredReferrals: Number(summary?.deliveredReferrals || 0),
    cancelledReferrals: Number(summary?.cancelledReferrals || 0),
    pendingCommission: Number(summary?.pendingCommission || 0),
    earnedCommission: Number(summary?.earnedCommission || 0),
  };
}

async function ensureTierUpToDate(affiliate) {
  const settings = await getProgramSettings();
  const stats = await buildAffiliateStats(affiliate._id);
  const nextTier = tierFromDeliveredReferrals(
    stats.deliveredReferrals,
    settings.tierThresholds
  );
  if (affiliate.tier !== nextTier) {
    affiliate.tier = nextTier;
    affiliate.promotedAt = new Date();
    await affiliate.save();
  }
  return { affiliate, stats, settings };
}

// @desc    Register current user as affiliate
// @route   POST /api/affiliates/register
// @access  Private
export async function registerAffiliate(req, res) {
  const existing = await Affiliate.findOne({ user: req.user._id });
  if (existing) {
    return res.status(200).json(existing);
  }
  const settings = await getProgramSettings();

  const user = await User.findById(req.user._id).select(
    "name firstName lastName email"
  );
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const code = await generateUniqueCode(user);
  const affiliate = await Affiliate.create({
    user: req.user._id,
    code: normalizeCode(code),
    commissionRate: Number(
      settings?.defaultCommissionRate ?? DEFAULT_SETTINGS.defaultCommissionRate
    ),
    isActive: true,
    tier: "starter",
  });

  return res.status(201).json(affiliate);
}

// @desc    Get logged-in affiliate profile + history
// @route   GET /api/affiliates/me
// @access  Private
export async function getMyAffiliateProfile(req, res) {
  const affiliate = await Affiliate.findOne({ user: req.user._id });
  const settings = await getProgramSettings();
  if (!affiliate) {
    return res.json({
      isAffiliate: false,
      settings: {
        defaultCommissionRate: Number(settings?.defaultCommissionRate || 0),
        tierThresholds: settings?.tierThresholds || DEFAULT_SETTINGS.tierThresholds,
      },
    });
  }

  const tiered = await ensureTierUpToDate(affiliate);
  const referrals = await Referral.find({ affiliate: affiliate._id })
    .sort({ createdAt: -1 })
    .limit(100)
    .populate("order", "_id orderStatus paymentStatus createdAt updatedAt");

  return res.json({
    isAffiliate: true,
    affiliate: tiered.affiliate,
    stats: tiered.stats,
    settings: {
      defaultCommissionRate: Number(settings?.defaultCommissionRate || 0),
      tierThresholds: tiered.settings?.tierThresholds || DEFAULT_SETTINGS.tierThresholds,
    },
    referrals,
  });
}

// @desc    Validate an affiliate code before checkout
// @route   POST /api/affiliates/validate-code
// @access  Public
export async function validateAffiliateCode(req, res) {
  const code = normalizeCode(req.body?.code);
  if (!code) {
    res.status(400);
    throw new Error("Affiliate code is required");
  }

  const affiliate = await Affiliate.findOne({
    isActive: true,
    $or: [{ code }, { affiliateCode: code }, { affiliate_code: code }],
  })
    .populate("user", "name firstName lastName");
  if (!affiliate) {
    res.status(404);
    throw new Error("Affiliate code not found");
  }

  const ownerName =
    affiliate.user?.firstName ||
    affiliate.user?.name ||
    affiliate.user?.lastName ||
    "Affiliate";

  return res.json({
    valid: true,
    code: affiliate.code,
    affiliateId: affiliate._id,
    ownerName,
    commissionRate: Number(affiliate.commissionRate || 5),
  });
}

// @desc    Admin: list all affiliates with stats
// @route   GET /api/affiliates/admin
// @access  Admin
export async function getAllAffiliatesAdmin(req, res) {
  const affiliates = await Affiliate.find({})
    .populate("user", "name firstName lastName email phone isActive createdAt")
    .sort({ createdAt: -1 });

  const affiliateIds = affiliates.map((a) => a._id);
  const summary = await Referral.aggregate([
    { $match: { affiliate: { $in: affiliateIds } } },
    {
      $group: {
        _id: "$affiliate",
        totalReferrals: { $sum: 1 },
        pendingReferrals: {
          $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
        },
        deliveredReferrals: {
          $sum: { $cond: [{ $eq: ["$status", "earned"] }, 1, 0] },
        },
        cancelledReferrals: {
          $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
        },
        pendingCommission: {
          $sum: {
            $cond: [{ $eq: ["$status", "pending"] }, "$commissionAmount", 0],
          },
        },
        earnedCommission: {
          $sum: {
            $cond: [{ $eq: ["$status", "earned"] }, "$commissionAmount", 0],
          },
        },
      },
    },
  ]);
  const summaryMap = new Map(summary.map((s) => [String(s._id), s]));

  const rows = affiliates.map((a) => {
    const s = summaryMap.get(String(a._id)) || {};
    return {
      ...a.toObject(),
      stats: {
        totalReferrals: Number(s.totalReferrals || 0),
        pendingReferrals: Number(s.pendingReferrals || 0),
        deliveredReferrals: Number(s.deliveredReferrals || 0),
        cancelledReferrals: Number(s.cancelledReferrals || 0),
        pendingCommission: Number(s.pendingCommission || 0),
        earnedCommission: Number(s.earnedCommission || 0),
      },
    };
  });

  const settings = await getProgramSettings();
  return res.json({
    affiliates: rows,
    settings: {
      defaultCommissionRate: Number(settings?.defaultCommissionRate || 0),
      tierThresholds: settings?.tierThresholds || DEFAULT_SETTINGS.tierThresholds,
    },
  });
}

// @desc    Admin: get one affiliate details + full history
// @route   GET /api/affiliates/admin/:id
// @access  Admin
export async function getAffiliateByIdAdmin(req, res) {
  const affiliate = await Affiliate.findById(req.params.id).populate(
    "user",
    "name firstName lastName email phone isActive createdAt"
  );
  if (!affiliate) {
    res.status(404);
    throw new Error("Affiliate not found");
  }

  const { stats, settings } = await ensureTierUpToDate(affiliate);
  const referrals = await Referral.find({ affiliate: affiliate._id })
    .sort({ createdAt: -1 })
    .populate("order", "_id orderStatus paymentStatus totalPrice createdAt updatedAt");

  return res.json({
    affiliate,
    stats,
    settings: {
      defaultCommissionRate: Number(settings?.defaultCommissionRate || 0),
      tierThresholds: settings?.tierThresholds || DEFAULT_SETTINGS.tierThresholds,
    },
    referrals,
  });
}

// @desc    Admin: delete affiliate profile and referral history
// @route   DELETE /api/affiliates/admin/:id
// @access  Admin
export async function deleteAffiliateAdmin(req, res) {
  const affiliate = await Affiliate.findById(req.params.id);
  if (!affiliate) {
    res.status(404);
    throw new Error("Affiliate not found");
  }

  await Referral.deleteMany({ affiliate: affiliate._id });
  await affiliate.deleteOne();

  return res.json({ message: "Affiliate deleted successfully" });
}

// @desc    Admin: activate/deactivate affiliate
// @route   PUT /api/affiliates/admin/:id/status
// @access  Admin
export async function updateAffiliateStatusAdmin(req, res) {
  const { isActive } = req.body;
  if (typeof isActive !== "boolean") {
    res.status(400);
    throw new Error("isActive must be boolean");
  }

  const affiliate = await Affiliate.findById(req.params.id);
  if (!affiliate) {
    res.status(404);
    throw new Error("Affiliate not found");
  }

  affiliate.isActive = isActive;
  await affiliate.save();

  return res.json({
    _id: affiliate._id,
    isActive: affiliate.isActive,
    updatedAt: affiliate.updatedAt,
  });
}

// @desc    Public/User: read affiliate program settings
// @route   GET /api/affiliates/settings
// @access  Public
export async function getAffiliateProgramSettings(req, res) {
  const settings = await getProgramSettings();
  return res.json({
    defaultCommissionRate: Number(
      settings?.defaultCommissionRate ?? DEFAULT_SETTINGS.defaultCommissionRate
    ),
    tierThresholds: settings?.tierThresholds || DEFAULT_SETTINGS.tierThresholds,
  });
}

// @desc    Admin: read settings
// @route   GET /api/affiliates/admin/settings
// @access  Admin
export async function getAffiliateProgramSettingsAdmin(req, res) {
  return getAffiliateProgramSettings(req, res);
}

// @desc    Admin: update settings
// @route   PUT /api/affiliates/admin/settings
// @access  Admin
export async function updateAffiliateProgramSettingsAdmin(req, res) {
  const rate = Number(req.body?.defaultCommissionRate);
  const bronze = Number(req.body?.tierThresholds?.bronze);
  const silver = Number(req.body?.tierThresholds?.silver);
  const gold = Number(req.body?.tierThresholds?.gold);

  if (!Number.isFinite(rate) || rate < 0 || rate > 100) {
    res.status(400);
    throw new Error("defaultCommissionRate must be a number between 0 and 100");
  }
  if (!Number.isInteger(bronze) || !Number.isInteger(silver) || !Number.isInteger(gold)) {
    res.status(400);
    throw new Error("Tier thresholds must be integers");
  }
  if (bronze < 1 || silver < bronze + 1 || gold < silver + 1) {
    res.status(400);
    throw new Error("Thresholds must follow: bronze < silver < gold");
  }

  const settings = await getProgramSettings();
  settings.defaultCommissionRate = rate;
  settings.tierThresholds = { bronze, silver, gold };
  await settings.save();

  // Keep all affiliates in sync with new commission rate and thresholds.
  await Affiliate.updateMany({}, { $set: { commissionRate: rate } });
  const affiliates = await Affiliate.find({}).select("_id tier");
  for (const affiliate of affiliates) {
    const stats = await buildAffiliateStats(affiliate._id);
    const nextTier = tierFromDeliveredReferrals(stats.deliveredReferrals, settings.tierThresholds);
    if (affiliate.tier !== nextTier) {
      affiliate.tier = nextTier;
      affiliate.promotedAt = new Date();
      await affiliate.save();
    }
  }

  return res.json({
    defaultCommissionRate: Number(settings.defaultCommissionRate),
    tierThresholds: settings.tierThresholds,
  });
}
