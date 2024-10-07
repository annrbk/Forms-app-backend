const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { hashPassword } = require("../utils/hashPassword");
const { generateToken } = require("../utils/token");

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = hashPassword(password);

  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error registering user" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = hashPassword(password);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    if (user.password !== hashedPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = generateToken(user._id);
    return res
      .status(200)
      .json({ message: "Login successful", token, userId: user.id });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
