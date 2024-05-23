const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

// Create a new quiz
router.post('/generate-quiz', quizController.generateQuiz);

// Find quiz by ID
router.get('/:id', quizController.findQuizById);

module.exports = router;

