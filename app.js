const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const OpenAI = require('openai');

dotenv.config();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const quizzesRouter = require('./routes/quizzes');

const app = express();

const clientUrl = process.env.CLIENT_URL || 'https://kviss.netlify.app'; // Default to your Netlify URL

// Use CORS
app.use(cors({
  origin: clientUrl,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow session cookie from browser to pass through
}));

// Set up mongoose connection
const mongoDb = process.env.MONGO_URI;
mongoose.connect(mongoDb, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/quiz', quizzesRouter);

module.exports = app;
