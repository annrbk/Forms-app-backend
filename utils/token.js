const jwt = require("jsonwebtoken");

const generateToken = (userId, role) => {
  return jwt.sign({ _id: userId, role }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });
};

module.exports = { generateToken };
