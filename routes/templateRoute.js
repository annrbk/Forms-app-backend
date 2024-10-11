const express = require("express");
const router = express.Router();
const { createTemplate } = require("../controllers/templateController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.post("/create-template", authenticateToken, createTemplate);

module.exports = router;