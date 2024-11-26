const Form = require("../models/form");
const Answer = require("../models/answer");
const Question = require("../models/question");
const Template = require("../models/template");
const User = require("../models/user");

exports.completedForm = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { templateId, answers } = req.body;

    const template = await Template.findById(templateId);
    const title = template.title;
    const userId = req.user._id;
    const user = await User.findById(userId);
    const author = user.name;

    const newForm = new Form({
      author: author,
      authorId: req.user._id,
      title,
      templateId: templateId,
      answers: [],
    });

    const saveForm = await newForm.save();

    const saveAnswers = await Promise.all(
      answers.map(async (answer) => {
        const newAnswer = new Answer({
          questionId: answer.questionId,
          title: answer.title,
          answer: answer.answer,
        });
        return await newAnswer.save();
      })
    );

    const answerIds = saveAnswers.map((answer) => answer._id);
    saveForm.answers = answerIds;
    await saveForm.save();

    return res.status(201).json({ message: "Form completed successfully " });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error completed form" });
  }
};

exports.getUserForms = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user._id;

    const templates = await Template.find({ authorId: userId });
    const templateIds = templates.map((template) => template._id);

    const forms = await Form.find({
      templateId: { $in: templateIds },
    }).populate("templateId", "title");

    return res.status(200).json(forms);
  } catch (error) {
    console.error("Error fetching forms:", error);
    return res.status(500).json({ message: "Error fetching forms" });
  }
};

exports.deleteForm = async (req, res) => {
  const { id } = req.params;

  try {
    const form = await Form.findById(id);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    await Answer.deleteMany({ _id: { $in: form.answers } });

    await Form.findByIdAndDelete(id);

    res.status(200).json({ message: "Form and answers deleted successfully" });
  } catch (error) {
    console.error("Error deleting form:", error);
    res.status(500).json({ message: "Error deleting form" });
  }
};

exports.getUserForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id)
      .populate({
        path: "answers",
        populate: {
          path: "questionId",
        },
      })
      .populate("templateId");
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    return res.status(200).json(form);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching form" });
  }
};
