const express = require("express");
const router = express.Router();
const cors = require("cors");
const { registerUser, loginUser } = require("../controllers/authController");

const corsOptions = {
  origin: process.env.CORS_LINK,
  optionsSuccessStatus: 200,
};

router.post("/register", cors(corsOptions), registerUser);

router.post("/login", cors(corsOptions), loginUser);

module.exports = router;
