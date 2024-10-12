const express = require("express");
const router = express.Router();
const {
  createTemplate,
  getUserTemplates,
  getUserTemplate,
} = require("../controllers/templateController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.post("/create-template", authenticateToken, createTemplate);
router.get("/user-templates", authenticateToken, getUserTemplates);
router.get("/templates/:id", authenticateToken, getUserTemplate);

module.exports = router;
