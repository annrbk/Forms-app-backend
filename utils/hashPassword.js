const crypto = require("crypto");

const hashPassword = (password) => {
  return crypto.createHash("sha3-256").update(password).digest("hex");
};

module.exports = { hashPassword };
