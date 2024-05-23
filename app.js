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

const clientUrl = process.env.CLIENT_URL || 'https://kviss.netlify.app';

// Use CORS
app.use(cors({
  origin: [clientUrl, "https://kviss.netlify.app"], 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Set up mongoose connection with Fixie proxy
const mongoDb = process.env.MONGO_URI;
const fixieUrl = process.env.FIXIE_URL;

// Use the Fixie proxy for the MongoDB connection
const fixieProxy = new URL(fixieUrl);
const proxyHost = fixieProxy.hostname;
const proxyPort = fixieProxy.port;
const proxyAuth = fixieProxy.username + ':' + fixieProxy.password;

mongoose.connect(mongoDb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  proxy: {
    host: proxyHost,
    port: proxyPort,
    auth: {
      username: fixieProxy.username,
      password: fixieProxy.password
    }
  }
});

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
