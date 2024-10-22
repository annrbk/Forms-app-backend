const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Template",
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["text", "textarea", "number", "checkbox"],
  },
  label: {
    type: String,
    required: true,
  },
  required: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Question", questionSchema);
