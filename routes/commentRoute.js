const express = require("express");
const router = express.Router();
const cors = require("cors");

const {
  createComment,
  getTemplateComments,
} = require("../controllers/commentController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { corsOptions } = require("../middleware/corsMiddleware");

const middlewares = [cors(corsOptions), authenticateToken];

router.post("/create-comment", middlewares, createComment);
router.get("/:templateId/comments", middlewares, getTemplateComments);

module.exports = router;
