const Question = require("../models/question");

exports.editQuestion = async (req, res) => {
  const { id } = req.params;
  const { label } = req.body;

  if (!label) {
    return res.status(400).json({ message: "Label is required" });
  }

  try {
    const updatedQuestion = await Question.findByIdAndUpdate(
      id,
      {
        label,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.status(200).json(updatedQuestion);
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({ message: "Error updating question" });
  }
};
