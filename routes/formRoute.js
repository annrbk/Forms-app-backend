const express = require("express");
const router = express.Router();
const cors = require("cors");
const { authenticateToken } = require("../middleware/authMiddleware");
const {
  completedForm,
  getUserForms,
  deleteForm,
} = require("../controllers/formController");

const corsOptions = {
  origin: process.env.CORS_LINK,
  optionsSuccessStatus: 200,
};

const middlewares = [cors(corsOptions), authenticateToken];

router.post("/:id/forms", middlewares, completedForm);
router.get("/user-forms", middlewares, getUserForms);
router.delete("/:id/delete", middlewares, deleteForm);

module.exports = router;
