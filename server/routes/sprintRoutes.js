const express = require("express");
const { getSprints, createSprint, updateSprint, deleteSprint } = require("../controllers/sprintController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
router.use(protect);
router.route("/").get(getSprints).post(createSprint);
router.route("/:id").put(updateSprint).delete(deleteSprint);

module.exports = router;
