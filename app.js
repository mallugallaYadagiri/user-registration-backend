const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRoutes = require("./routes/UserRoutes");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

// Middleware
app.use(bodyParser.json());

const corsOptions = {
  origin: "https://user-registration-frontend.vercel.app",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // You might need to set this depending on your use case
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use("/api/user", userRoutes);

app.use(express.static(path.join(__dirname + "/public")));

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
