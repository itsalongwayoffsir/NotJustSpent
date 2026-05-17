const express  = require("express");
const router   = express.Router();
const mongoose = require("mongoose");
const { authMiddleware } = require("../middleware/auth");
const { logActivity }    = require("./auth");

const savingsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  label:  { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0 },
  date:   { type: String, required: true },
}, { timestamps: true });

const Saving = mongoose.model("Saving", savingsSchema);

router.use(authMiddleware);

router.get("/", async (req, res) => {
  try {
    const filter = { userId: req.user.id };
    if (req.query.month) filter.date = { $regex: `^${req.query.month}` };
    res.json(await Saving.find(filter).sort({ date: -1 }));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/", async (req, res) => {
  try {
    const saving = await Saving.create({ ...req.body, userId: req.user.id });
    await logActivity(req.user.id, req.user.username, "add_saving", saving.label);
    res.status(201).json(saving);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put("/:id", async (req, res) => {
  try {
    const saving = await Saving.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body, { new: true, runValidators: true }
    );
    if (!saving) return res.status(404).json({ error: "Not found" });
    await logActivity(req.user.id, req.user.username, "edit_saving", saving.label);
    res.json(saving);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete("/:id", async (req, res) => {
  try {
    const saving = await Saving.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!saving) return res.status(404).json({ error: "Not found" });
    await logActivity(req.user.id, req.user.username, "delete_saving", saving.label);
    res.json({ message: "Deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
