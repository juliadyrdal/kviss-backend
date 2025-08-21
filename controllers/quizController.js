const asyncHandler = require('express-async-handler');
const OpenAI = require('openai');
const Quiz = require('../models/quiz');

// Initialize OpenAI configuration
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const request = require('request');

// Generate a new quiz
exports.generateQuiz = asyncHandler(async (req, res) => {
    const { theme, numQuestions, difficulty } = req.body;
    const prompt = `Create a quiz with ${numQuestions} multiple-choice questions on the theme of "${theme}" The quiz should have a difficulty of ${difficulty}, on a scale of 1 to 10. The response should be formatted as a JSON string containing an array of objects. Each object should have the following structure:
{
  "question": "Question text?",
  "options": {
    "A": "Option A",
    "B": "Option B",
    "C": "Option C",
    "D": "Option D"
  },
  "correctAnswer": "A"
}`;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 1000,
        });

        if (!response || !response.choices || !response.choices[0] || !response.choices[0].message) {
            console.error('Unexpected response from OpenAI:', response);
            return res.status(500).json({ error: 'Unexpected response from OpenAI' });
        }

        const rawOutput = response.choices[0].message.content.trim();
        console.log('Raw Output: ', rawOutput);

        let jsonString = rawOutput;
        // Attempt to extract the JSON part if there is any preamble
        const jsonStartIndex = rawOutput.indexOf('[');
        const jsonEndIndex = rawOutput.lastIndexOf(']');
        if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
            jsonString = rawOutput.substring(jsonStartIndex, jsonEndIndex + 1);
        }

        let questions;
        try {
            questions = JSON.parse(jsonString);
            console.log('Parsed questions: ', questions); // Log the parsed questions for debugging
        } catch (error) {
            console.error('Failed to parse the response from GPT as JSON:', error);
            return res.status(500).json({ error: 'Failed to parse the response from GPT as JSON.' });
        }

        // Validate the structure of the parsed questions
        const isValid = Array.isArray(questions) && questions.every(q => q.question && q.options && q.correctAnswer);
        if (!isValid) {
            console.error('Invalid questions structure:', questions);
            return res.status(500).json({ error: 'Invalid questions structure' });
        }

        const quiz = new Quiz({ theme, questions, difficulty });
        console.log('Quiz to be saved:', quiz); // Log the quiz object to be saved
        await quiz.save(); // Save quiz to database

        res.json({ quizId: quiz._id, questions });
    } catch (error) {
        console.error('Error during quiz generation:', error);
        res.status(500).json({ error: 'Error during quiz generation' });
    }
});

// Find quiz by ID
exports.findQuizById = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const quiz = await Quiz.findById(id);
    res.json(quiz);
});
