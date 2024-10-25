const express = require("express");
const router = express.Router();
const cors = require("cors");
const { corsOptions } = require("../middleware/corsMiddleware");
const { registerUser, loginUser } = require("../controllers/authController");

router.post("/register", cors(corsOptions), registerUser);

router.post("/login", cors(corsOptions), loginUser);

module.exports = router;
