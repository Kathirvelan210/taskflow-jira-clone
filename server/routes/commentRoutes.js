const express = require("express");
const { getComments, addComment, deleteComment } = require("../controllers/commentController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router({ mergeParams: true });
router.use(protect);
router.route("/").get(getComments).post(addComment);
router.delete("/:id", deleteComment);

module.exports = router;
