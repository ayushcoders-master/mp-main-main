import { Router } from 'express';
import { FEEDBACK_CATEGORIES } from '../../shared/feedback.js';
import { asyncHandler } from '../asyncHandler.js';
import { AuthRequest, authMiddleware } from '../auth.js';
import { db } from '../db.js';

export const feedbackRouter = Router();
const MAX_MESSAGE_LENGTH = 2000;

feedbackRouter.use(authMiddleware);

feedbackRouter.post('/', asyncHandler<AuthRequest>(async (req, res) => {
  const rating = req.body?.rating;
  const category = req.body?.category;
  const message = typeof req.body?.message === 'string'
    ? req.body.message.replace(/\r\n?/g, '\n').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim()
    : '';

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Choose a rating from 1 to 5 stars.' });
  }
  if (!FEEDBACK_CATEGORIES.includes(category)) {
    return res.status(400).json({ error: 'Choose a valid feedback category.' });
  }
  if (!message) {
    return res.status(400).json({ error: 'Feedback message is required.' });
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({ error: `Feedback must be ${MAX_MESSAGE_LENGTH} characters or fewer.` });
  }

  const record = await db.addFeedback({
    userId: req.user!._id,
    rating,
    category,
    message
  });
  return res.status(201).json({ message: 'Feedback submitted successfully.', feedback: record });
}));

feedbackRouter.get('/mine', asyncHandler<AuthRequest>(async (req, res) => {
  const feedback = await db.getFeedbackByUserId(req.user!._id);
  return res.json({ feedback });
}));