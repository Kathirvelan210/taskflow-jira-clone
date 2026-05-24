const mongoose = require("mongoose");

const sprintSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    status: { type: String, enum: ["Planned", "Active", "Completed"], default: "Planned" },
    goal: { type: String, default: "" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sprint", sprintSchema);
