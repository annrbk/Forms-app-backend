const express = require("express");
const router = express.Router();
const {
  getUsers,
  blockUser,
  unBlockUser,
  deleteUser,
  roleChange,
} = require("../controllers/adminController");

const { authAndCheckAdmin } = require("../middleware/adminMiddleware");

router.get("/users", authAndCheckAdmin, getUsers);
router.put("/users/:userId/role", authAndCheckAdmin, roleChange);
router.put("/users/:userId/block", authAndCheckAdmin, blockUser);
router.put("/users/:userId/unblock", authAndCheckAdmin, unBlockUser);
router.delete("/users/:userId", authAndCheckAdmin, deleteUser);

module.exports = router;
