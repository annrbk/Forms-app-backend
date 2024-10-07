const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  return jwt.sign({ _id: userId }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });
};

module.exports = { generateToken };
