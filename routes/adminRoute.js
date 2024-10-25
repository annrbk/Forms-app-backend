const express = require("express");
const router = express.Router();
const cors = require("cors");
const {
  getUsers,
  blockUser,
  unBlockUser,
  deleteUser,
  roleChange,
} = require("../controllers/adminController");

const { authAndCheckAdmin } = require("../middleware/adminMiddleware");
const { corsOptions } = require("../middleware/corsMiddleware");

const middlewares = [cors(corsOptions), authAndCheckAdmin];

router.get("/users", middlewares, getUsers);
router.put("/users/:userId/role", middlewares, roleChange);
router.put("/users/:userId/block", middlewares, blockUser);
router.put("/users/:userId/unblock", middlewares, unBlockUser);
router.delete("/users/:userId", middlewares, deleteUser);

module.exports = router;
