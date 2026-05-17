const express  = require("express");
const router   = express.Router();
const mongoose = require("mongoose");
const { authMiddleware } = require("../middleware/auth");
const { logActivity }    = require("./auth");

const incomeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name:   { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0 },
  date:   { type: String, required: true },
}, { timestamps: true });

const Income = mongoose.model("Income", incomeSchema);

router.use(authMiddleware);

router.get("/", async (req, res) => {
  try {
    const filter = { userId: req.user.id };
    if (req.query.month) filter.date = { $regex: `^${req.query.month}` };
    res.json(await Income.find(filter).sort({ date: -1 }));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/", async (req, res) => {
  try {
    const income = await Income.create({ ...req.body, userId: req.user.id });
    await logActivity(req.user.id, req.user.username, "add_income", income.name);
    res.status(201).json(income);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put("/:id", async (req, res) => {
  try {
    const income = await Income.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body, { new: true, runValidators: true }
    );
    if (!income) return res.status(404).json({ error: "Not found" });
    await logActivity(req.user.id, req.user.username, "edit_income", income.name);
    res.json(income);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete("/:id", async (req, res) => {
  try {
    const income = await Income.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!income) return res.status(404).json({ error: "Not found" });
    await logActivity(req.user.id, req.user.username, "delete_income", income.name);
    res.json({ message: "Deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
