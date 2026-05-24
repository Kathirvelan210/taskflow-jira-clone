const Task = require("../models/Task");
const Project = require("../models/Project");

const createTask = async (req, res) => {
  const { title, description, type, status, priority, project, sprint, assignedTo, dueDate, labels, storyPoints } = req.body;
  try {
    const proj = await Project.findOne({ _id: project, members: req.user._id });
    if (!proj) return res.status(403).json({ message: "Not a project member" });
    const task = await Task.create({ title, description, type, status, priority, project, sprint, assignedTo, dueDate, labels, storyPoints, createdBy: req.user._id });
    const populated = await task.populate([
      { path: "assignedTo", select: "name email" },
      { path: "createdBy", select: "name email" },
      { path: "sprint", select: "name status" },
    ]);
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getTasks = async (req, res) => {
  const { projectId, sprintId, status, priority, assignedTo, search, type } = req.query;
  try {
    const filter = {};
    if (projectId) filter.project = projectId;
    if (sprintId) filter.sprint = sprintId;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (type) filter.type = type;
    if (search) filter.title = { $regex: search, $options: "i" };

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .populate("sprint", "name status")
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .populate("sprint", "name status");
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.createdBy.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });
    await task.deleteOne();
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
