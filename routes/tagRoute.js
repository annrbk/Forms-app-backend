const express = require("express");
const router = express.Router();

const { getTags } = require("../controllers/tagController");

router.get("/all-tags", getTags);

module.exports = router;
