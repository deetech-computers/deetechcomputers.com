// backend/src/controllers/userController.js
import User from "../models/User.js";

function normalizeSearchTerm(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .slice(0, 80);
}

function normalizeCategory(value) {
  return String(value || "").trim().toLowerCase();
}

// @desc    Get logged in user profile
// @route   GET /api/users/profile
// @access  Private
export async function getUserProfile(req, res) {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json(user);
}

// @desc    Update logged in user profile
// @route   PUT /api/users/profile
// @access  Private
export async function updateUserProfile(req, res) {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // safely update fields (email not editable)
  if (req.body.firstName !== undefined) user.firstName = req.body.firstName;
  if (req.body.lastName !== undefined) user.lastName = req.body.lastName;
  if (req.body.phone !== undefined) user.phone = req.body.phone;
  if (req.body.address !== undefined) user.address = req.body.address;
  if (req.body.region !== undefined) user.region = req.body.region;
  if (req.body.city !== undefined) user.city = req.body.city;

  if (req.body.name) {
    user.name = req.body.name;
    const parts = req.body.name.trim().split(/\s+/);
    if (!user.firstName) user.firstName = parts[0] || user.firstName;
    if (!user.lastName && parts.length > 1) {
      user.lastName = parts.slice(1).join(" ");
    }
  } else if (req.body.firstName || req.body.lastName) {
    const nextFirst = req.body.firstName ?? user.firstName ?? "";
    const nextLast = req.body.lastName ?? user.lastName ?? "";
    const combined = `${nextFirst} ${nextLast}`.trim();
    if (combined) user.name = combined;
  }

  if (req.body.password) {
    user.password = req.body.password; // make sure schema has pre-save hook for hashing
  }

  const updatedUser = await user.save();

  // keep response aligned with frontend AuthContext & ProfilePage
  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    firstName: updatedUser.firstName,
    lastName: updatedUser.lastName,
    email: updatedUser.email,
    phone: updatedUser.phone,
    address: updatedUser.address,
    region: updatedUser.region,
    city: updatedUser.city,
    role: updatedUser.role,
    token: req.token || null, // preserve token in case frontend expects it
  });
}

// @desc    Delete current user (self-delete)
// @route   DELETE /api/users/profile
// @access  Private
export async function deleteUser(req, res) {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  await user.deleteOne();
  res.json({ message: "User deleted successfully" });
}

// @desc    Admin: list users
// @route   GET /api/users/admin/users
// @access  Admin
export async function getAllUsersAdmin(req, res) {
  const users = await User.find({})
    .select("-password -resetPasswordToken -resetPasswordExpires")
    .sort({ createdAt: -1 });
  res.json(users);
}

// @desc    Admin: get user details
// @route   GET /api/users/admin/users/:id
// @access  Admin
export async function getUserByIdAdmin(req, res) {
  const user = await User.findById(req.params.id).select(
    "-password -resetPasswordToken -resetPasswordExpires"
  );
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json(user);
}

// @desc    Admin: delete user
// @route   DELETE /api/users/admin/users/:id
// @access  Admin
export async function deleteUserAdmin(req, res) {
  if (String(req.user._id) === String(req.params.id)) {
    res.status(400);
    throw new Error("You cannot delete your own admin account");
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  await user.deleteOne();
  res.json({ message: "User deleted successfully" });
}

// @desc    Admin: reset user password
// @route   PUT /api/users/admin/users/:id/reset-password
// @access  Admin
export async function resetUserPasswordAdmin(req, res) {
  const { newPassword } = req.body;
  const password = String(newPassword || "");
  if (!password || password.length < 8) {
    res.status(400);
    throw new Error("New password must be at least 8 characters");
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: "Password reset successfully" });
}

// @desc    Admin: activate/deactivate user account
// @route   PUT /api/users/admin/users/:id/status
// @access  Admin
export async function updateUserStatusAdmin(req, res) {
  const { isActive } = req.body;
  if (typeof isActive !== "boolean") {
    res.status(400);
    throw new Error("isActive must be boolean");
  }

  if (String(req.user._id) === String(req.params.id) && !isActive) {
    res.status(400);
    throw new Error("You cannot deactivate your own admin account");
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.isActive = isActive;
  await user.save();

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    updatedAt: user.updatedAt,
  });
}

// @desc    Track logged-in user behavior (search/category interest)
// @route   POST /api/users/behavior
// @access  Private
export async function trackUserBehavior(req, res) {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const searchTerm = normalizeSearchTerm(req.body?.searchTerm);
  const category = normalizeCategory(req.body?.category);
  const now = new Date();

  if (!user.behavior) {
    user.behavior = { preferredCategory: "", categoryInterests: [], searchTerms: [] };
  }
  if (!Array.isArray(user.behavior.categoryInterests)) {
    user.behavior.categoryInterests = [];
  }
  if (!Array.isArray(user.behavior.searchTerms)) {
    user.behavior.searchTerms = [];
  }

  if (searchTerm) {
    const existing = user.behavior.searchTerms.find(
      (entry) => String(entry?.term || "").trim().toLowerCase() === searchTerm
    );
    if (existing) {
      existing.count = Number(existing.count || 0) + 1;
      existing.lastSearchedAt = now;
    } else {
      user.behavior.searchTerms.push({
        term: searchTerm,
        count: 1,
        lastSearchedAt: now,
      });
    }

    user.behavior.searchTerms = [...user.behavior.searchTerms]
      .sort(
        (a, b) =>
          Number(b?.count || 0) - Number(a?.count || 0) ||
          new Date(b?.lastSearchedAt || 0).getTime() - new Date(a?.lastSearchedAt || 0).getTime()
      )
      .slice(0, 25);
  }

  if (category) {
    user.behavior.preferredCategory = category;
    const existing = user.behavior.categoryInterests.find(
      (entry) => String(entry?.category || "").trim().toLowerCase() === category
    );
    if (existing) {
      existing.count = Number(existing.count || 0) + 1;
      existing.lastInteractedAt = now;
    } else {
      user.behavior.categoryInterests.push({
        category,
        count: 1,
        lastInteractedAt: now,
      });
    }

    user.behavior.categoryInterests = [...user.behavior.categoryInterests]
      .sort(
        (a, b) =>
          Number(b?.count || 0) - Number(a?.count || 0) ||
          new Date(b?.lastInteractedAt || 0).getTime() - new Date(a?.lastInteractedAt || 0).getTime()
      )
      .slice(0, 25);
  }

  if (!searchTerm && !category) {
    return res.json({ behavior: user.behavior });
  }

  await user.save();
  res.json({ behavior: user.behavior });
}
