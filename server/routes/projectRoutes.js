const express = require("express");
const {
  createProject, getProjects, getProjectById,
  updateProject, deleteProject, addMember, removeMember,
} = require("../controllers/projectController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.route("/").post(createProject).get(getProjects);
router.route("/:id").get(getProjectById).put(updateProject).delete(deleteProject);
router.post("/:id/members", addMember);
router.delete("/:id/members/:memberId", removeMember);

module.exports = router;
