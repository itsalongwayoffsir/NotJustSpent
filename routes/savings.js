const express = require("express");
const router  = express.Router();
const mongoose = require("mongoose");

const savingsSchema = new mongoose.Schema({
  label:  { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0 },
  date:   { type: String, required: true },
}, { timestamps: true });

const Saving = mongoose.model("Saving", savingsSchema);

router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.month) filter.date = { $regex: `^${req.query.month}` };
    res.json(await Saving.find(filter).sort({ date: -1 }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const saving = new Saving(req.body);
    await saving.save();
    res.status(201).json(saving);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const saving = await Saving.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!saving) return res.status(404).json({ error: "Not found" });
    res.json(saving);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const saving = await Saving.findByIdAndDelete(req.params.id);
    if (!saving) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
