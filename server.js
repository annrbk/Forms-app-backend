const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db");
const authRoutes = require("./routes/authRoute");
const templateRoute = require("./routes/templateRoute");

dotenv.config();

const PORT = 5000;
const app = express();

app.use(express.json());

const corsOptions = {
  origin: process.env.CORS_LINK,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api", templateRoute);

app.listen(PORT, () => {
  console.log(`Application listening on port ${PORT}!`);
});
