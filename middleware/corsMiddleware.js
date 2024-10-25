const cors = require("cors");

const corsOptions = {
  origin: process.env.CORS_LINK,
  optionsSuccessStatus: 200,
};

module.exports = { corsOptions };
