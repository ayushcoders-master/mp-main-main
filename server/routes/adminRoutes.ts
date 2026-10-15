
import { Router } from 'express';

import { db } from '../db.js';
import { asyncHandler } from '../asyncHandler.js';
import { authMiddleware, adminMiddleware } from '../auth.js';
import { FEEDBACK_CATEGORIES, FEEDBACK_STATUSES } from '../../shared/feedback.js';
import { FeedbackFilters, IFeedback } from '../db.js';

export const adminRouter = Router();

// Apply authentication and admin authorization
// to every route defined in this router.
adminRouter.use(authMiddleware, adminMiddleware);

// GET /api/admin/stats
adminRouter.get(
  '/stats',
  asyncHandler(async (req, res) => {
    const [users, predictions, crimeRecords] = await Promise.all([
      db.getUsers(),
      db.getAllPredictions(),
      db.getAllCrimeData()
    ]);

    const totalUsers = users.length;
    const totalPredictions = predictions.length;

    const highRiskPredictions = predictions.filter(
      (p) =>
        p.riskLevel === 'HIGH' ||
        p.riskLevel === 'CRITICAL'
    ).length;

    // Aggregate actual destination searches.
    const locCounts: Record<string, number> = {};

    predictions.forEach((p) => {
      const location = p.location?.trim();

      if (location) {
        locCounts[location] = (locCounts[location] || 0) + 1;
      }
    });

    const mostSearchedLocations = Object.entries(locCounts)
      .map(([location, count]) => ({
        location,
        count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Actual risk distribution.
    const riskDistribution = {
      LOW: predictions.filter(
        (p) => p.riskLevel === 'LOW'
      ).length,

      MODERATE: predictions.filter(
        (p) => p.riskLevel === 'MODERATE'
      ).length,

      HIGH: predictions.filter(
        (p) => p.riskLevel === 'HIGH'
      ).length,

      CRITICAL: predictions.filter(
        (p) => p.riskLevel === 'CRITICAL'
      ).length
    };

    // Actual crime type distribution.
    const crimeTypeCounts: Record<string, number> = {};

    crimeRecords.forEach((crime) => {
      const crimeType = crime.crimeType?.trim();

      if (crimeType) {
        crimeTypeCounts[crimeType] =
          (crimeTypeCounts[crimeType] || 0) + 1;
      }
    });

    const crimeTypes = Object.entries(crimeTypeCounts).map(
      ([type, count]) => ({
        type,
        count
      })
    );

    return res.json({
      totalUsers,
      totalPredictions,
      highRiskPredictions,
      totalCrimeIncidents: crimeRecords.length,
      mostSearchedLocations,
      riskDistribution,
      crimeTypes
    });
  })
);

// GET /api/admin/users
adminRouter.get(
  '/users',
  asyncHandler(async (req, res) => {
    const users = (await db.getUsers()).map((user) => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      touristCategory: user.touristCategory,
      role: user.role,
      createdAt: user.createdAt
    }));

    return res.json({ users });
  })
);

// GET /api/admin/predictions
adminRouter.get(
  '/predictions',
  asyncHandler(async (req, res) => {
    const predictions = await db.getAllPredictions();

    return res.json({ predictions });
  })
);

// GET /api/admin/feedback
adminRouter.get(
  '/feedback',
  asyncHandler(async (req, res) => {
    const status = req.query.status;
    const category = req.query.category;
    const ratingValue = req.query.rating;
    const sortValue = req.query.sort;

    if (status !== undefined && (typeof status !== 'string' || !FEEDBACK_STATUSES.includes(status as typeof FEEDBACK_STATUSES[number]))) {
      return res.status(400).json({ error: 'Invalid feedback status filter.' });
    }
    if (category !== undefined && (typeof category !== 'string' || !FEEDBACK_CATEGORIES.includes(category as typeof FEEDBACK_CATEGORIES[number]))) {
      return res.status(400).json({ error: 'Invalid feedback category filter.' });
    }
    if (ratingValue !== undefined && (typeof ratingValue !== 'string' || !/^[1-5]$/.test(ratingValue))) {
      return res.status(400).json({ error: 'Rating filter must be between 1 and 5.' });
    }
    if (sortValue !== undefined && sortValue !== 'newest' && sortValue !== 'oldest') {
      return res.status(400).json({ error: 'Sort must be newest or oldest.' });
    }

    const filters: FeedbackFilters = {
      status: status as FeedbackFilters['status'],
      category: category as FeedbackFilters['category'],
      rating: ratingValue ? Number(ratingValue) : undefined,
      sort: sortValue === 'oldest' ? 'oldest' : 'newest'
    };
    const [records, stats] = await Promise.all([
      db.getAllFeedback(filters),
      db.getFeedbackStats()
    ]);
    const users = await db.getFeedbackUserProfiles([...new Set(records.map((record) => record.userId))]);
    const usersById = new Map(users.map((user) => [user._id, { name: user.name, email: user.email }]));
    const feedback = records.map((record: IFeedback) => ({
      ...record,
      user: usersById.get(record.userId) ?? { name: 'Deleted account', email: '' }
    }));

    return res.json({ feedback, stats });
  })
);

// PATCH /api/admin/feedback/:id/status
adminRouter.patch(
  '/feedback/:id/status',
  asyncHandler(async (req, res) => {
    const status = req.body?.status;
    if (typeof status !== 'string' || !FEEDBACK_STATUSES.includes(status as typeof FEEDBACK_STATUSES[number])) {
      return res.status(400).json({ error: 'Choose a valid feedback status.' });
    }
    const feedback = await db.updateFeedbackStatus(req.params.id, status as typeof FEEDBACK_STATUSES[number]);
    if (!feedback) return res.status(404).json({ error: 'Feedback not found.' });
    return res.json({ message: 'Feedback status updated.', feedback });
  })
);

// DELETE /api/admin/feedback/:id
adminRouter.delete(
  '/feedback/:id',
  asyncHandler(async (req, res) => {
    const deleted = await db.deleteFeedback(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Feedback not found.' });
    return res.json({ message: 'Feedback deleted.' });
  })
);

