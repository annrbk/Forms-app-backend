const express = require("express");
const router = express.Router();
const {
  createTemplate,
  getUserTemplates,
} = require("../controllers/templateController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.post("/create-template", authenticateToken, createTemplate);
router.get("/user-templates", authenticateToken, getUserTemplates);

module.exports = router;
