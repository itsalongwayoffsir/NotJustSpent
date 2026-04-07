const express = require("express");
const router  = express.Router();
const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema({
  name:   { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0 },
  date:   { type: String, required: true },
}, { timestamps: true });

const Income = mongoose.model("Income", incomeSchema);

router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.month) filter.date = { $regex: `^${req.query.month}` };
    res.json(await Income.find(filter).sort({ date: -1 }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const income = new Income(req.body);
    await income.save();
    res.status(201).json(income);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const income = await Income.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!income) return res.status(404).json({ error: "Not found" });
    res.json(income);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const income = await Income.findByIdAndDelete(req.params.id);
    if (!income) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
