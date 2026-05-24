const Project = require("../models/Project");
const User = require("../models/User");

const createProject = async (req, res) => {
  const { name, description, color, type, visibility } = req.body;
  try {
    const project = await Project.create({
      name, description, color, type, visibility,
      createdBy: req.user._id,
      members: [req.user._id],
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ members: req.user._id })
      .populate("createdBy", "name email")
      .populate("members", "name email")
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("members", "name email");
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.createdBy.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.createdBy.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });
    await project.deleteOne();
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addMember = async (req, res) => {
  const { email } = req.body;
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.createdBy.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });
    const userToAdd = await User.findOne({ email });
    if (!userToAdd) return res.status(404).json({ message: "User not found" });
    if (project.members.includes(userToAdd._id))
      return res.status(400).json({ message: "Already a member" });
    project.members.push(userToAdd._id);
    await project.save();
    const updated = await Project.findById(project._id).populate("members", "name email");
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const removeMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.createdBy.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });
    project.members = project.members.filter((m) => m.toString() !== req.params.memberId);
    await project.save();
    res.json({ message: "Member removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createProject, getProjects, getProjectById, updateProject, deleteProject, addMember, removeMember };
