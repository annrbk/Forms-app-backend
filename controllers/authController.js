const User = require("../models/user");
const { hashPassword } = require("../utils/hashPassword");
const { generateToken } = require("../utils/token");

exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
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
      role,
    });

    await newUser.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error registering user" });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = hashPassword(password);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" }); //"Invalid email"
    }

    if (user.password !== hashedPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = generateToken(user._id, user.role);
    return res.status(200).json({
      message: "Login successful",
      token,
      userId: user._id,
      role: user.role,
      name: user.name,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
