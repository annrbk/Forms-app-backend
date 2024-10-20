const User = require("../models/user");

exports.getUsers = async (req, res) => {
  console.log("getUsers function called");
  try {
    const users = await User.find();
    console.log(users);
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching users" });
  }
};

exports.roleChange = async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    user.role = role;
    await user.save();

    res.status(200).send("Role changed successfully");
  } catch (error) {
    console.error("Error role change:", error);
    res.status(500).send("Error role change");
  }
};

exports.blockUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    user.isBlocked = true;
    await user.save();

    res.status(200).send("User blocked successfully");
  } catch (error) {
    console.error("Error blocking user:", error);
    res.status(500).send("Error blocking user");
  }
};

exports.unBlockUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    user.isBlocked = false;
    await user.save();

    res.status(200).send("User unblocked successfully");
  } catch (error) {
    console.error("Error unblocking user:", error);
    res.status(500).send("Error unblocking user");
  }
};

exports.deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      console.log("User not found");
      return res.status(404).send("User not found");
    }
    console.log("User found, proceeding to remove");

    console.log("User removed successfully");
    res.status(200).send("User deleted successfully");
  } catch (error) {
    console.error("Error delete user:", error);
    res.status(500).send("Error delete user");
  }
};
