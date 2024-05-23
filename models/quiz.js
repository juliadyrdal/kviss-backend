const mongoose = require('mongoose');
const { Schema } = mongoose;

const optionSchema = new Schema({
    A: { type: String, required: true },
    B: { type: String, required: true },
    C: { type: String, required: true },
    D: { type: String, required: true }
}, { _id: false });

const questionSchema = new Schema({
    question: { type: String, required: true },
    options: { type: optionSchema, required: true },
    correctAnswer: { type: String, required: true }
}, { _id: false });

const quizSchema = new Schema({
    theme: { type: String, required: true },
    difficulty: { type: Number, required: true },
    questions: { type: [questionSchema], required: true }
});

module.exports = mongoose.model('Quiz', quizSchema);
