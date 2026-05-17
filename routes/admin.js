const express  = require("express");
const router   = express.Router();
const User     = require("../models/User");
const Activity = require("../models/Activity");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

// All admin routes require auth + admin role
router.use(authMiddleware, adminMiddleware);

// ── GET ALL USERS ─────────────────────────────
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── UPDATE USER ROLE ──────────────────────────
router.put("/users/:id", async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// ── DELETE USER ───────────────────────────────
router.delete("/users/:id", async (req, res) => {
  try {
    if (req.params.id === req.user.id)
      return res.status(400).json({ error: "Cannot delete yourself" });
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── GET ACTIVITY LOGS ─────────────────────────
router.get("/activities", async (req, res) => {
  try {
    const filter = {};
    if (req.query.userId) filter.userId = req.query.userId;
    const activities = await Activity.find(filter)
      .sort({ createdAt: -1 })
      .limit(200);
    res.json(activities);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
