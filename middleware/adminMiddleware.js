const jwt = require("jsonwebtoken");
const { createLogger } = require("winston");

const logger = createLogger();

const authAndCheckAdmin = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    logger.info("No token provided.");
    return res
      .status(401)
      .json({ message: "Unauthorized: No token provided." });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      logger.error("JWT verification error:", err.message);
      return res.status(403).json({ message: "Forbidden: Invalid token." });
    }

    logger.info("Decoded user:", JSON.stringify(user));

    req.user = user;

    if (req.user.role !== "admin") {
      console.log("User is not admin");
      return res.sendStatus(403);
    }
    next();
  });
};

module.exports = { authAndCheckAdmin };
