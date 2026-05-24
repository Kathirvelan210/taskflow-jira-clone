const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    type: {
      type: String,
      enum: ["Task", "Bug", "Story", "Epic", "Subtask"],
      default: "Task",
    },
    status: {
      type: String,
      enum: ["Backlog", "Todo", "In Progress", "Review", "Testing", "Done"],
      default: "Todo",
    },
    priority: {
      type: String,
      enum: ["Lowest", "Low", "Medium", "High", "Highest"],
      default: "Medium",
    },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    sprint: { type: mongoose.Schema.Types.ObjectId, ref: "Sprint", default: null },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    dueDate: { type: Date, default: null },
    labels: [{ type: String }],
    storyPoints: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
