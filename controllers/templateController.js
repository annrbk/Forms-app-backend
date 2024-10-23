const Template = require("../models/template");
const Question = require("../models/question");
const mongoose = require("mongoose");

exports.createTemplate = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { title, description, isPublic, questions } = req.body;

    const newTemplate = new Template({
      authorId: req.user._id,
      author: req.body.author || "No name",
      title,
      description,
      isPublic,
      questions: [],
    });

    const saveTemplate = await newTemplate.save();
    console.log("Template saved:", saveTemplate);

    const saveQuestions = await Promise.all(
      questions.map(async (question) => {
        const newQuestion = new Question({
          templateId: saveTemplate._id,
          type: question.type,
          label: question.label,
          required: question.required,
        });
        return await newQuestion.save();
      })
    );

    const questionIds = saveQuestions.map((question) => question._id);

    saveTemplate.questions = questionIds;
    await saveTemplate.save();

    return res.status(201).json({ message: "Template created successfully" });
  } catch (error) {
    console.error("Error creating template:", error);
    return res.status(500).json({ message: "Error creating template" });
  }
};

exports.getUserTemplates = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const templates = await Template.find({ authorId: req.user._id });
    return res.status(200).json(templates);
  } catch (error) {
    console.error("Error fetching templates:", error);
    return res.status(500).json({ message: "Error fetching templates" });
  }
};

exports.getUserTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id).populate(
      "questions"
    );
    // if (!template) {
    //   return res.status(404).json({ message: "Template not found" });
    // }
    return res.status(200).json(template);
  } catch (error) {
    console.error("Error fetching template:", error);
    return res.status(500).json({ message: "Error fetching template" });
  }
};

exports.getLatestTemplates = async (req, res) => {
  try {
    const templates = await Template.find().sort({ date: -1 }).limit(5);
    return res.status(200).json(templates);
  } catch (error) {
    console.error("Error fetching latest templates", error);
    return res.status(500).json({ message: "Error fetching latest templates" });
  }
};

exports.editTemplate = async (req, res) => {
  const { id } = req.params;
  const { questions } = req.body;
  console.log(questions);
  try {
    const template = await Template.findById(id).populate("questions");

    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    const updatedQuestions = await Promise.all(
      questions.map(async (question) => {
        if (question.id) {
          oldQuestion = Question.findById(question.id);
          console.log("Updated question:", oldQuestion, question);
          const updatedQuestion = await Question.findByIdAndUpdate(
            question.id,
            {
              label: question.label,
              type: oldQuestion.type,
            },
            {
              new: true,
              runValidators: true,
            }
          );
          console.log("Updated question:", updatedQuestion);
        } else {
          const newQuestion = new Question({
            templateId: id,
            type: question.type,
            label: question.label,
            required: question.required,
          });
          return await newQuestion.save();
        }
      })
    );

    await template.save();

    res.status(200).json(template);
  } catch (error) {
    console.error("Error updating template:", error);
    res.status(500).json({ message: "Error updating template" });
  }
};

exports.deleteTemplate = async (req, res) => {
  const { templateId } = req.params;

  try {
    const template = await Template.findByIdAndDelete(templateId);
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }
    res.status(200).json({ message: "Template deleted successfully" });
  } catch (error) {
    console.error("Error delete template:", error);
    res.status(500).json({ message: "Error delete template" });
  }
};
