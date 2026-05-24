const Sprint = require("../models/Sprint");

const getSprints = async (req, res) => {
  try {
    const sprints = await Sprint.find({ project: req.query.projectId }).sort({ createdAt: -1 });
    res.json(sprints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createSprint = async (req, res) => {
  const { name, project, startDate, endDate, goal } = req.body;
  try {
    const sprint = await Sprint.create({ name, project, startDate, endDate, goal, createdBy: req.user._id });
    res.status(201).json(sprint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateSprint = async (req, res) => {
  try {
    const sprint = await Sprint.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!sprint) return res.status(404).json({ message: "Sprint not found" });
    res.json(sprint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteSprint = async (req, res) => {
  try {
    await Sprint.findByIdAndDelete(req.params.id);
    res.json({ message: "Sprint deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getSprints, createSprint, updateSprint, deleteSprint };
