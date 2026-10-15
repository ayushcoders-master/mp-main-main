export const FEEDBACK_CATEGORIES = [
  'General Feedback',
  'Bug Report',
  'Suggestion',
  'User Experience',
  'Tourist Safety Information',
  'Other'
] as const;

export type FeedbackCategory = (typeof FEEDBACK_CATEGORIES)[number];

export const FEEDBACK_STATUSES = ['New', 'Reviewed', 'Resolved'] as const;

export type FeedbackStatus = (typeof FEEDBACK_STATUSES)[number];