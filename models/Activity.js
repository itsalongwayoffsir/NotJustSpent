const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  username: { type: String, required: true },
  action:   { type: String, required: true }, // e.g. "login", "logout", "add_expense"
  detail:   { type: String, default: "" },    // extra info
  ip:       { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("Activity", activitySchema);
