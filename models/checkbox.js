const mongoose = require("mongoose");

const checkboxSchema = new mongoose.Schema({
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
});

module.exports = mongoose.model("Checkbox", checkboxSchema);
