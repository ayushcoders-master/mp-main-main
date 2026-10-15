import { Router } from 'express';
import { db } from '../db.js';
import { optionalAuthMiddleware, AuthRequest } from '../auth.js';
import { asyncHandler } from '../asyncHandler.js';

export const reviewRouter = Router();

// GET /api/reviews?destination=Delhi
reviewRouter.get('/', asyncHandler(async (req, res) => {
  const { destination } = req.query;
  if (typeof destination === 'string' && destination.trim()) {
    const list = await db.getReviewsByDestination(destination.trim());
    return res.json({ reviews: list });
  }
  const all = await db.getAllReviews();
  return res.json({ reviews: all });
}));

// POST /api/reviews
reviewRouter.post('/', optionalAuthMiddleware, async (req: AuthRequest, res) => {
  try {
    const { destination, targetType, targetName, authorName, rating, comment } = req.body;

    if (!destination || !targetName || !comment) {
      return res.status(400).json({ error: 'Destination, site/hotel name, and review text are required.' });
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({ error: 'Rating must be an integer between 1 and 5 stars.' });
    }

    const created = await db.addReview({
      destination: destination.trim(),
      targetType: targetType || 'destination',
      targetName: targetName.trim(),
      authorName: authorName ? authorName.trim() : (req.user?.name || 'Verified Explorer'),
      rating: Math.round(numRating),
      comment: comment.trim(),
      date: new Date().toISOString().split('T')[0],
      verified: true
    });

    return res.status(201).json({
      message: 'Review submitted successfully',
      review: created
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to submit review' });
  }
});
