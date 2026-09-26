const User = require("../models/User");
const generateToken = require("../config/generateToken");
const crypto = require("crypto");

const RESET_TOKEN_TTL_MS = 15 * 60 * 1000;

function hashResetToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

// Defense-in-depth: even with the sanitize middleware already stripping
// $-operators, this refuses anything that isn't a plain string outright.
// Belt and suspenders against NoSQL injection.
function isPlainString(value) {
  return typeof value === "string" && value.length > 0;
}

function publicUser(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone || "",
    address: user.address || {},
  };
}

// @route  POST /api/auth/register
// @access Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!isPlainString(name) || !isPlainString(email) || !isPlainString(password)) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // password gets hashed automatically by the pre-save hook in User.js
    const user = await User.create({ name, email, password });

    res.status(201).json({ ...publicUser(user), token: generateToken(user._id) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  POST /api/auth/login
// @access Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!isPlainString(email) || !isPlainString(password)) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (user && (await user.matchPassword(password))) {
      res.json({ ...publicUser(user), token: generateToken(user._id) });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/auth/me
// @access Private (requires valid token - see authMiddleware.js)
const getMe = async (req, res) => {
  // req.user is attached by the protect middleware
  res.json(publicUser(req.user));
};

// @route  PUT /api/auth/me
// @access Private
const updateMe = async (req, res) => {
  try {
    const { name, email, phone, address = {}, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (name !== undefined) {
      if (!isPlainString(name)) return res.status(400).json({ message: "Name is required" });
      user.name = name.trim();
    }

    if (email !== undefined) {
      if (!isPlainString(email)) return res.status(400).json({ message: "A valid email is required" });
      const normalizedEmail = email.toLowerCase().trim();
      const emailTaken = await User.exists({ email: normalizedEmail, _id: { $ne: user._id } });
      if (emailTaken) return res.status(400).json({ message: "That email address is already in use" });
      user.email = normalizedEmail;
    }

    if (phone !== undefined) {
      if (typeof phone !== "string") return res.status(400).json({ message: "Phone number must be text" });
      const normalizedPhone = phone.replace(/[\s()-]/g, "");
      if (normalizedPhone && !/^\+\d{1,3}\d{10}$/.test(normalizedPhone)) {
        return res.status(400).json({ message: "Mobile number must contain a country code followed by exactly 10 digits" });
      }
      user.phone = normalizedPhone;
    }

    if (address && typeof address === "object" && !Array.isArray(address)) {
      const allowedAddressFields = ["line1", "line2", "city", "state", "postalCode", "country"];
      for (const field of allowedAddressFields) {
        if (address[field] !== undefined) {
          if (typeof address[field] !== "string") return res.status(400).json({ message: "Address fields must be text" });
          user.address[field] = address[field].trim();
        }
      }
    }

    if (newPassword) {
      if (!isPlainString(currentPassword) || !(await user.matchPassword(currentPassword))) {
        return res.status(400).json({ message: "Enter your current password to set a new password" });
      }
      if (!isPlainString(newPassword) || newPassword.length < 6) {
        return res.status(400).json({ message: "New password must be at least 6 characters" });
      }
      user.password = newPassword;
    }

    await user.save();
    res.json({ ...publicUser(user), token: generateToken(user._id) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const email = typeof req.body.email === "string" ? req.body.email.toLowerCase().trim() : "";
    const user = await User.findOne({ email });
    // Keep the response generic so the endpoint cannot be used to enumerate accounts.
    if (!user) return res.json({ message: "If that email exists, a reset link has been created." });
    // The browser must never receive a password-reset credential. Keep only a
    // hash in the database so a database leak cannot be used to reset accounts.
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = hashResetToken(resetToken);
    user.passwordResetExpires = new Date(Date.now() + RESET_TOKEN_TTL_MS);
    await user.save();

    // A reset link is deliberately not returned by this API. Configure the
    // application's email provider to deliver the raw token to the account's
    // verified email address. Logging it is allowed only in local development.
    if (process.env.NODE_ENV === "development") {
      const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      console.info(`Password reset link for ${user.email}: ${baseUrl}/reset-password?token=${resetToken}`);
    }
    res.json({ message: "If that email exists, password reset instructions have been sent." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (typeof token !== "string" || typeof password !== "string" || password.length < 6) {
      return res.status(400).json({ message: "A valid reset token and 6-character password are required" });
    }
    const user = await User.findOne({
      passwordResetToken: hashResetToken(token),
      passwordResetExpires: { $gt: new Date() },
    });
    if (!user) return res.status(400).json({ message: "This reset link is invalid or expired" });
    user.password = password;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();
    res.json({ ...publicUser(user), token: generateToken(user._id) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/auth/users
// @desc   Get all users (admin)
// @access Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const { page, limit } = req.query;
    if (!page && !limit) {
      const users = await User.find({}).select("-password").sort({ createdAt: -1 });
      return res.json(users);
    }
    const currentPage = Math.max(1, Number.parseInt(page, 10) || 1);
    const pageSize = Math.min(100, Math.max(1, Number.parseInt(limit, 10) || 20));
    const [users, total] = await Promise.all([
      User.find({}).select("-password").sort({ createdAt: -1 }).skip((currentPage - 1) * pageSize).limit(pageSize),
      User.countDocuments({}),
    ]);
    res.json({ items: users, pagination: { page: currentPage, limit: pageSize, total, pages: Math.ceil(total / pageSize) } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, updateMe, getMe, forgotPassword, resetPassword, getAllUsers };
