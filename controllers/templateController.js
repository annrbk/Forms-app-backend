const Template = require("../models/template");
const Question = require("../models/question");
const Tag = require("../models/tag");
const mongoose = require("mongoose");

exports.createTemplate = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { title, description, isPublic, questions, tags } = req.body;

    const newTemplate = new Template({
      authorId: req.user._id,
      author: req.body.author || "No name",
      title,
      description,
      isPublic,
      questions: [],
      tags: [],
    });

    const saveTemplate = await newTemplate.save();

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

    const saveTags = await Promise.all(
      tags.map(async (tag) => {
        const newTag = new Tag({
          templateId: saveTemplate._id,
          name: tag,
        });
        return await newTag.save();
      })
    );

    const questionIds = saveQuestions.map((question) => question._id);
    saveTemplate.questions = questionIds;

    const tagIds = saveTags.map((tag) => tag._id);
    saveTemplate.tags = tagIds;

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

    const templates = await Template.find({
      authorId: req.user._id,
    });
    return res.status(200).json(templates);
  } catch (error) {
    console.error("Error fetching templates:", error);
    return res.status(500).json({ message: "Error fetching templates" });
  }
};

exports.getUserTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id)
      .populate("questions")
      .populate("tags");
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }
    return res.status(200).json(template);
  } catch (error) {
    console.error("Error fetching template:", error);
    return res.status(500).json({ message: "Error fetching template" });
  }
};

exports.getLatestTemplates = async (req, res) => {
  try {
    const templates = await Template.find({ isPublic: true })
      .sort({ date: -1 })
      .limit(5);
    return res.status(200).json(templates);
  } catch (error) {
    console.error("Error fetching latest templates", error);
    return res.status(500).json({ message: "Error fetching latest templates" });
  }
};

exports.editTemplate = async (req, res) => {
  const { id } = req.params;
  const { questions } = req.body;

  try {
    const template = await Template.findById(id).populate("questions");

    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    const updatedQuestions = await Promise.all(
      questions.map(async (question) => {
        if (question.id) {
          oldQuestion = Question.findById(question.id);
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
          return updatedQuestion;
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
    template.questions = updatedQuestions;
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

exports.getAllTemplates = async (req, res) => {
  const query = req.query.query;
  try {
    if (query) {
      const templates = await Template.find({
        title: { $regex: query, $options: "i" },
      });
      return res.json(templates);
    } else {
      const templates = await Template.find();
      res.json(templates);
    }
  } catch (error) {
    console.error("Error fetching templates", error);
    return res.status(500).json({ message: "Error fetching templates" });
  }
};

exports.getTemplatesByTag = async (req, res) => {
  try {
    const templates = await Template.find({
      tag: req.params.tagId,
    });
    return res.status(200).json(templates);
  } catch (error) {
    console.error("Error fetching templates:", error);
    return res.status(500).json({ message: "Error fetching templates" });
  }
};
