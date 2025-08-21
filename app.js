const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const OpenAI = require('openai');

dotenv.config();

const quizzesRouter = require('./routes/quizzes');

const app = express();

const clientUrl = process.env.CLIENT_URL;

// Use CORS
app.use(cors({
  origin: [clientUrl],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Handle preflight requests
app.options('*', cors({
  origin: [clientUrl],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Set up mongoose connection
const mongoDb = process.env.MONGO_URI;

const mongooseOptions = {
  ssl: true, // Ensure SSL is used
};

mongoose.connect(mongoDb, mongooseOptions);
const db = mongoose.connection;

// Add detailed error logging
db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
  if (error.name === 'MongoNetworkError') {
    console.error("Network error details:", error);
  }
});
db.once("open", () => {
  console.log("MongoDB connected successfully!");
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/quiz', quizzesRouter);

module.exports = app;
