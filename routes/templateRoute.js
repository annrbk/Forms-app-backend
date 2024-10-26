const express = require("express");
const router = express.Router();
const cors = require("cors");
const {
  createTemplate,
  getUserTemplates,
  getUserTemplate,
  getLatestTemplates,
  editTemplate,
  deleteTemplate,
} = require("../controllers/templateController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { corsOptions } = require("../middleware/corsMiddleware");

const middlewares = [cors(corsOptions), authenticateToken];

router.get("/latest-templates", getLatestTemplates);

router.post("/create-template", middlewares, createTemplate);
router.get("/user-templates", middlewares, getUserTemplates);
router.get("/user-template/:id", middlewares, getUserTemplate);
router.put("/:id", middlewares, editTemplate);
router.delete("/:templateId", middlewares, deleteTemplate);

module.exports = router;
