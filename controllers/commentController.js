const Comment = require("../models/comment");
const Template = require("../models/template");
const mongoose = require("mongoose");

exports.createComment = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { text, templateId } = req.body;

    const newComment = new Comment({
      author: req.user._id,
      text: text,
      templateId: templateId,
    });

    await newComment.save();

    return res.status(201).json({ message: "Comment created successfully" });
  } catch (error) {
    console.error("Error creating comment:", error);
    return res.status(500).json({ message: "Error creating comment" });
  }
};

exports.getTemplateComments = async (req, res) => {
  try {
    const { templateId } = req.params;

    if (!templateId) {
      return res.status(400).json({ message: "Template ID is missing" });
    }

    const comments = await Comment.find({ templateId }).populate(
      "author",
      "email"
    );

    if (!comments) {
      return res.status(404).json({ message: "No comments found" });
    }

    return res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({ message: "Error fetching comments" });
  }
};
