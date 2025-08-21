/**
 * validation.js
 * -------------
 * Middleware for validating request bodies and parameters.
 * 
 * This middleware uses Zod for validation.
 * 
 * Defines schemas and exports middleware functions.
 * 
 * Middleware functions are then used in the routes to validate the request bodies and parameters.
 * 
 */
const { z } = require('zod');

// Body schema: matches req.body
const generateQuizSchema = z.object({
  theme: z
    .string({ required_error: 'Theme is required' })
    .trim()
    .min(1, { message: 'Theme is required' })
    .max(50, { message: 'Theme must be at most 50 characters' })
    .regex(/^[\p{L}\p{N}\s\-_.,!?()]+$/u, {
      message: 'Theme can only include letters, numbers, spaces, and - _ . , ! ? ( )',
    }),
  numQuestions: z
    .number({ required_error: 'Number of questions is required' })
    .int({ message: 'Number of questions must be an integer' })
    .min(1, { message: 'Number of questions must be at least 1' })
    .max(20, { message: 'Cannot have more than 20 questions' }),
  difficulty: z
    .number({ required_error: 'Difficulty is required' })
    .int({ message: 'Difficulty must be an integer' })
    .min(1, { message: 'Difficulty must be between 1 and 10' })
    .max(10, { message: 'Difficulty must be between 1 and 10' }),
});

// Params schema: matches req.params
const quizIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, {
    message: 'Invalid quiz ID - must be a valid MongoDB ObjectId',
  }),
});

const validateQuizGeneration = (req, res, next) => {
  const result = generateQuizSchema.safeParse(req.body);
  if (!result.success) {
    // Only read result.error when success === false
    return res.status(400).json({
      error: 'Validation failed',
      details: result.error.issues.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }
  // Overwrite with sanitized values so controllers can use req.body
  req.body = result.data;
  next();
};

const validateQuizId = (req, res, next) => {
  const result = quizIdSchema.safeParse(req.params);
  if (!result.success) {
    // Only read result.error when success === false
    return res.status(400).json({
      error: 'Validation failed',
      details: result.error.issues.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }
  // Overwrite with sanitized values so controllers can use req.params
  req.params = result.data;
  next();
};

module.exports = {
  validateQuizGeneration,
  validateQuizId,
};