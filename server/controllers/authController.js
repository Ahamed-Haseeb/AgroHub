import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

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

  res.status(201).json({
    token: generateToken(user._id),
    user: sanitize(user),
  });
};

// @route  POST /api/auth/login
// @access Public
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.json({
    token: generateToken(user._id),
    user: sanitize(user),
  });
};

// @route  GET /api/auth/me
// @access Private
const getMe = async (req, res) => {
  res.json({ user: sanitize(req.user) });
};

export { register, login, getMe };
