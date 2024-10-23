const jwt = require("jsonwebtoken");

const authAndCheckAdmin = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized: No token provided." });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden: Invalid token." });
    }

    req.user = user;

    if (req.user.role !== "admin") {
      return res.sendStatus(403);
    }
    next();
  });
};

module.exports = { authAndCheckAdmin };
