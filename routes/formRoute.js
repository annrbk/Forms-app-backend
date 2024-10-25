const express = require("express");
const router = express.Router();
const cors = require("cors");
const { authenticateToken } = require("../middleware/authMiddleware");
const { corsOptions } = require("../middleware/corsMiddleware");

const {
  completedForm,
  getUserForms,
  deleteForm,
} = require("../controllers/formController");

const middlewares = [cors(corsOptions), authenticateToken];

router.post("/:id/forms", middlewares, completedForm);
router.get("/user-forms", middlewares, getUserForms);
router.delete("/:id/delete", middlewares, deleteForm);

module.exports = router;
