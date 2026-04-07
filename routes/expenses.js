const express = require("express");
const router  = express.Router();
const mongoose = require("mongoose");

// ── Schema ──────────────────────────────────────────
const expenseSchema = new mongoose.Schema({
  title:    { type: String, required: true, trim: true },
  category: { type: String, required: true, enum: ["Food","Transport","Shopping","Entertainment","Study","Bills"] },
  amount:   { type: Number, required: true, min: 0 },
  date:     { type: String, required: true },   // stored as "YYYY-MM-DD"
  description: { type: String, default: "" },
  note:        { type: String, default: "" }, // kept for backwards compatibility
}, { timestamps: true });

const Expense = mongoose.model("Expense", expenseSchema);

// ── READ all (optionally filter by month: ?month=2026-04) ──
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.month) filter.date = { $regex: `^${req.query.month}` };
    const expenses = await Expense.find(filter).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── CREATE ──────────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── UPDATE ──────────────────────────────────────────
router.put("/:id", async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!expense) return res.status(404).json({ error: "Not found" });
    res.json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── DELETE ──────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
