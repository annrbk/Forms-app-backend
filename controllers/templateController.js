const Template = require("../models/template");
const Question = require("../models/question");
const Tag = require("../models/tag");
const Checkbox = require("../models/checkbox");
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

        if (question.type === "checkbox") {
          const savedCheckboxes = await Promise.all(
            question.checkboxList.map(async (checkbox) => {
              const newCheckbox = new Checkbox({
                value: checkbox.value,
              });
              const savedCheckbox = await newCheckbox.save();
              return savedCheckbox._id;
            })
          );

          newQuestion.checkboxList = savedCheckboxes;
        }
        return await newQuestion.save();
      })
    );

    const saveTags = await Promise.all(
      tags.map(async (tagName) => {
        let tag = await Tag.findOne({ name: tagName });
        if (!tag) {
          tag = new Tag({
            name: tagName,
            templateId: saveTemplate._id,
          });
          await tag.save();
        }
        return tag._id;
      })
    );

    await Promise.all(
      saveTags.map(async (tagId) => {
        await Tag.findByIdAndUpdate(tagId, { $inc: { usageCount: 1 } });
      })
    );

    saveTemplate.questions = saveQuestions.map((question) => question._id);
    saveTemplate.tags = saveTags;

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
      .populate({ path: "questions", populate: { path: "checkboxList" } })
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
      tags: req.params.tagId,
    });
    return res.status(200).json(templates);
  } catch (error) {
    console.error("Error fetching templates:", error);
    return res.status(500).json({ message: "Error fetching templates" });
  }
};
