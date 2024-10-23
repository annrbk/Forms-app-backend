const express = require("express");
const router = express.Router();
const {
  createTemplate,
  getUserTemplates,
  getUserTemplate,
  getLatestTemplates,
  editTemplate,
  deleteTemplate,
} = require("../controllers/templateController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.get("/latest-templates", getLatestTemplates);

router.post("/create-template", authenticateToken, createTemplate);
router.get("/user-templates", authenticateToken, getUserTemplates);
router.get("/:id", authenticateToken, getUserTemplate);
router.put("/:id", authenticateToken, editTemplate);
router.delete("/:templateId", authenticateToken, deleteTemplate);

module.exports = router;
