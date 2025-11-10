import express from "express";
import dotenv from "dotenv";
import "express-async-errors";

// Create Express app
const app = express();

// Load environment variables from .env file
dotenv.config();
const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || 8000;

// Database connection
const { dbConnection } = require("./src/config/database");
dbConnection();

// Middleware to parse JSON bodies
app.use(express.json());

// Logging middleware
app.use(require("./src/middlewares/logger"));

app.all("/", (req, res) => {
  res.send({
    status: "success",
    message: "Hello, Express + TypeScript!",
    // user: req.user,
    documents: {
      swagger: "/documents/swagger",
      redoc: "/documents/redoc",
      json: "/documents/json",
    },
  });
});

// Import and use routes
app.use(require("./src/routes"));

// Error handling middleware
app.use(require("./src/middlewares/errorHandler"));

// Start the server
app.listen(PORT, () => {
  console.log(PORT, HOST, () => console.log(`http://${HOST}:${PORT}`));
});
