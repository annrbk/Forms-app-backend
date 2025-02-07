const Tag = require("../models/tag");

exports.getTags = async (req, res) => {
  try {
    const tags = await Tag.find().sort({ createdAt: -1 }).limit(10);
    return res.status(200).json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return res.status(500).json({ message: "Error fetching tags" });
  }
};
