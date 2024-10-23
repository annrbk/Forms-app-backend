const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/authMiddleware");
const {
  completedForm,
  getUserForms,
  deleteForm,
} = require("../controllers/formController");

router.post("/:id/forms", authenticateToken, completedForm);
router.get("/user-forms", authenticateToken, getUserForms);
router.delete("/:id/delete", authenticateToken, deleteForm);

module.exports = router;
