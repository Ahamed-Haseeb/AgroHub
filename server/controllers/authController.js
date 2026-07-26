import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

const setTokenCookie = (res, token, remember = false) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  };

  if (remember) {
    cookieOptions.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
  }

  res.cookie("jwt", token, cookieOptions);
};

const sanitize = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  district: user.district,
});

// @route  POST /api/auth/register
// @access Public
const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, district } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    if (!["farmer", "buyer"].includes(role)) {
      return res.status(400).json({ message: "Role must be farmer or buyer" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const user = await User.create({ name, email, password, role, phone, district });

    const token = generateToken(user._id);
    setTokenCookie(res, token, true); // Always remember on register, or pass remember flag if added to form

    res.status(201).json({
      user: sanitize(user),
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Registration failed" });
  }
};

// @route  POST /api/auth/login
// @access Public
const login = async (req, res) => {
  try {
    const { email, password, remember } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);
    setTokenCookie(res, token, remember);

    res.json({
      user: sanitize(user),
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Login failed" });
  }
};

// @route  GET /api/auth/me
// @access Private
const getMe = async (req, res) => {
  res.json({ user: sanitize(req.user) });
};

// @route  POST /api/auth/logout
// @access Private
const logout = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

export { register, login, getMe, logout };
