const express  = require("express");
const router   = express.Router();
const mongoose = require("mongoose");
const { authMiddleware } = require("../middleware/auth");
const { logActivity }    = require("./auth");

// ── Schema ──────────────────────────────────────────
const expenseSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title:       { type: String, required: true, trim: true },
  category:    { type: String, required: true, enum: ["Food","Transport","Shopping","Entertainment","Study","Bills"] },
  amount:      { type: Number, required: true, min: 0 },
  date:        { type: String, required: true },
  description: { type: String, default: "" },
  note:        { type: String, default: "" },
}, { timestamps: true });

const Expense = mongoose.model("Expense", expenseSchema);

// All routes require auth
router.use(authMiddleware);

// ── READ ──────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const filter = { userId: req.user.id };
    if (req.query.month) filter.date = { $regex: `^${req.query.month}` };
    const expenses = await Expense.find(filter).sort({ date: -1 });
    res.json(expenses);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── CREATE ────────────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const expense = await Expense.create({ ...req.body, userId: req.user.id });
    await logActivity(req.user.id, req.user.username, "add_expense", expense.title);
    res.status(201).json(expense);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// ── UPDATE ────────────────────────────────────────────
router.put("/:id", async (req, res) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body, { new: true, runValidators: true }
    );
    if (!expense) return res.status(404).json({ error: "Not found" });
    await logActivity(req.user.id, req.user.username, "edit_expense", expense.title);
    res.json(expense);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// ── DELETE ────────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!expense) return res.status(404).json({ error: "Not found" });
    await logActivity(req.user.id, req.user.username, "delete_expense", expense.title);
    res.json({ message: "Deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
