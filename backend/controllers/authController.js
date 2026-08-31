const User = require("../models/User");
const generateToken = require("../config/generateToken");

// Defense-in-depth: even with the sanitize middleware already stripping
// $-operators, this refuses anything that isn't a plain string outright.
// Belt and suspenders against NoSQL injection.
function isPlainString(value) {
  return typeof value === "string" && value.length > 0;
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

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
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
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
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
  res.json(req.user);
};

// @route  GET /api/auth/users
// @desc   Get all users (admin)
// @access Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getMe, getAllUsers };
