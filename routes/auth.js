const express  = require("express");
const jwt      = require("jsonwebtoken");
const router   = express.Router();
const User     = require("../models/User");
const Activity = require("../models/Activity");
const { authMiddleware } = require("../middleware/auth");

// Helper: create JWT token
function signToken(user) {
  return jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// Helper: log activity
async function logActivity(userId, username, action, detail = "", ip = "") {
  try {
    await Activity.create({ userId, username, action, detail, ip });
  } catch (e) { /* non-critical, swallow error */ }
}

// ── REGISTER ─────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ error: "All fields are required" });

    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists)
      return res.status(400).json({ error: "Username or email already taken" });

    const user = await User.create({ username, email, password });
    const token = signToken(user);

    await logActivity(user._id, user.username, "register", "", req.ip);
    res.status(201).json({ token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── LOGIN ─────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: "Username and password required" });

    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ error: "Invalid username or password" });

    const token = signToken(user);
    await logActivity(user._id, user.username, "login", "", req.ip);
    res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── LOGOUT (log the event) ────────────────────
router.post("/logout", authMiddleware, async (req, res) => {
  await logActivity(req.user.id, req.user.username, "logout", "", req.ip);
  res.json({ message: "Logged out" });
});

// ── GET CURRENT USER ──────────────────────────
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = { router, logActivity };

// ── UPDATE PROFILE ────────────────────────────
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { username, email, avatar } = req.body;
    const userId = req.user.id;

    // Check username uniqueness (exclude current user)
    if (username) {
      const existing = await User.findOne({ username, _id: { $ne: userId } });
      if (existing) return res.status(400).json({ error: "Username already taken" });
    }

    const updated = await User.findByIdAndUpdate(
      userId,
      { ...(username && { username }), ...(email && { email }), ...(avatar && { avatar }) },
      { new: true }
    ).select("-password");

    res.json({ user: { id: updated._id, username: updated.username, role: updated.role, avatar: updated.avatar } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
