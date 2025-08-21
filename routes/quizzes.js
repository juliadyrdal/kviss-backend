const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { validateQuizGeneration, validateQuizId } = require('../middleware/validation');

// Create a new quiz
router.post('/generate-quiz', validateQuizGeneration, quizController.generateQuiz);

// Find quiz by ID
router.get('/:id', validateQuizId, quizController.findQuizById);

module.exports = router;

