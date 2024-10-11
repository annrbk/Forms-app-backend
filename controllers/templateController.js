const Template = require("../models/template");
const Question = require("../models/question");

exports.createTemplate = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { title, description, isPublic, questions } = req.body;
    console.log("Request body:", req.body);

    const newTemplate = new Template({
      authorId: req.user._id,
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
