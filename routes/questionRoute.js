const express = require("express");
const router = express.Router();
const cors = require("cors");
const { editQuestion } = require("../controllers/questionController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { corsOptions } = require("../middleware/corsMiddleware");
const middlewares = [cors(corsOptions), authenticateToken];

router.put("/edit-question/:id", middlewares, editQuestion);

module.exports = router;
