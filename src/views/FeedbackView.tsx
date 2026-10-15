import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Loader2, MessageSquareText, Send, Star } from 'lucide-react';
import { FEEDBACK_CATEGORIES, FeedbackCategory, FeedbackStatus } from '../../shared/feedback.js';
import { useAuth } from '../context/AuthContext.tsx';
import { feedbackApi } from '../services/api.ts';
import { IFeedback } from '../types.ts';

const MAX_MESSAGE_LENGTH = 2000;

const statusClass: Record<FeedbackStatus, string> = {
  New: 'border-amber-500/30 bg-amber-500/10 text-amber-700',
  Reviewed: 'border-blue-500/30 bg-blue-500/10 text-blue-700',
  Resolved: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700'
};

export const FeedbackView: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState<FeedbackCategory>('General Feedback');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [feedback, setFeedback] = useState<IFeedback[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState('');
  const submissionInProgress = useRef(false);

  const loadHistory = useCallback(async () => {
    try {
      setHistoryError('');
      const result = await feedbackApi.getMine();
      setFeedback(result.feedback);
    } catch {
      setHistoryError('We could not load your feedback history. Please try again.');
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) void loadHistory();
    else setHistoryLoading(false);
  }, [user, loadHistory]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submissionInProgress.current) return;
    setSubmitError('');
    setSuccess('');
    if (!rating) {
      setSubmitError('Choose a star rating before submitting.');
      return;
    }
    const cleanMessage = message.trim();
    if (!cleanMessage) {
      setSubmitError('Enter a message before submitting.');
      return;
    }
    if (cleanMessage.length > MAX_MESSAGE_LENGTH) {
      setSubmitError(`Keep your message to ${MAX_MESSAGE_LENGTH} characters or fewer.`);
      return;
    }

    submissionInProgress.current = true;
    setSubmitting(true);
    try {
      const result = await feedbackApi.submit({ rating, category, message: cleanMessage });
      setFeedback((current) => [result.feedback, ...current]);
      setRating(0);
      setCategory('General Feedback');
      setMessage('');
      setSuccess('Thank you. Your feedback has been submitted.');
    } catch (error: any) {
      setSubmitError(error.response?.data?.error || 'Your feedback could not be submitted. Please try again.');
    } finally {
      submissionInProgress.current = false;
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return <div className="py-24 flex justify-center text-cyan-700"><Loader2 className="w-7 h-7 animate-spin" aria-label="Loading account" /></div>;
  }

  if (!user) {
    return (
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="rounded-2xl border border-slate-700 bg-slate-800/90 p-8 text-center shadow-xl">
          <MessageSquareText className="mx-auto mb-4 h-9 w-9 text-cyan-600" />
          <h1 className="text-2xl font-bold text-white">Share feedback</h1>
          <p className="mt-3 text-sm text-slate-400">Sign in so your feedback is securely linked to your account and you can follow its status.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/login" className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-400">Sign in</Link>
            <Link to="/register" className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400">Create account</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <header>
        <p className="text-xs font-bold uppercase tracking-wider text-cyan-700">Your voice matters</p>
        <h1 className="mt-1 text-3xl font-bold text-white">Feedback</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">Tell us what is working and what could make planning safer and easier.</p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <form onSubmit={handleSubmit} className="self-start rounded-2xl border border-slate-700 bg-slate-800/90 p-5 sm:p-7 shadow-xl space-y-5" aria-busy={submitting}>
          <div>
            <fieldset>
              <legend className="mb-2 text-sm font-semibold text-slate-200">Your rating <span className="text-rose-600" aria-hidden="true">*</span></legend>
              <div role="radiogroup" aria-label="Your rating" className="flex gap-1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={rating === value}
                    aria-label={`${value} ${value === 1 ? 'star' : 'stars'}`}
                    onClick={() => setRating(value)}
                    className="rounded-md p-1.5 text-amber-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <Star className={`h-7 w-7 ${value <= rating ? 'fill-current' : ''}`} />
                  </button>
                ))}
                <span className="self-center pl-2 text-xs text-slate-400">{rating ? `${rating} of 5` : 'Select a rating'}</span>
              </div>
            </fieldset>
          </div>

          <div>
            <label htmlFor="feedback-category" className="mb-2 block text-sm font-semibold text-slate-200">Category</label>
            <select
              id="feedback-category"
              value={category}
              onChange={(event) => setCategory(event.target.value as FeedbackCategory)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
            >
              {FEEDBACK_CATEGORIES.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="feedback-message" className="mb-2 block text-sm font-semibold text-slate-200">Your feedback <span className="text-rose-600" aria-hidden="true">*</span></label>
            <textarea
              id="feedback-message"
              required
              rows={6}
              maxLength={MAX_MESSAGE_LENGTH}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="What would you like us to know?"
              aria-describedby="feedback-counter"
              className="w-full resize-y rounded-lg border border-slate-600 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
            />
            <p id="feedback-counter" className="mt-1 text-right text-xs text-slate-400">{message.length} / {MAX_MESSAGE_LENGTH}</p>
          </div>

          {submitError && <p role="alert" className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-700">{submitError}</p>}
          {success && <p role="status" className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700">{success}</p>}

          <button type="submit" disabled={submitting} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-800">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>

        <section aria-labelledby="my-feedback-heading">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 id="my-feedback-heading" className="text-xl font-bold text-white">My Feedback</h2>
              <p className="mt-1 text-xs text-slate-400">Your submissions and their latest status.</p>
            </div>
            <MessageSquareText className="h-5 w-5 shrink-0 text-cyan-700" aria-hidden="true" />
          </div>

          {historyLoading ? (
            <div className="rounded-xl border border-slate-700 p-8 text-center text-slate-400"><Loader2 className="mx-auto h-6 w-6 animate-spin text-cyan-600" /><p className="mt-2 text-sm">Loading your feedback...</p></div>
          ) : historyError ? (
            <div role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-700">{historyError}<button onClick={() => { setHistoryLoading(true); void loadHistory(); }} className="ml-2 font-semibold underline focus:outline-none focus:ring-2 focus:ring-cyan-500">Try again</button></div>
          ) : feedback.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-600 bg-slate-800/40 p-8 text-center">
              <MessageSquareText className="mx-auto h-7 w-7 text-slate-500" />
              <p className="mt-3 text-sm font-semibold text-slate-200">No feedback submitted yet</p>
              <p className="mt-1 text-xs text-slate-400">Your feedback will appear here after you send it.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {feedback.map((entry) => (
                <li key={entry._id} className="rounded-xl border border-slate-700 bg-slate-800/80 p-4 sm:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-100">{entry.category}</p>
                      <div className="mt-1 flex items-center gap-1 text-amber-500" aria-label={`${entry.rating} out of 5 stars`}>
                        {Array.from({ length: entry.rating }, (_, index) => <Star key={index} className="h-3.5 w-3.5 fill-current" aria-hidden="true" />)}
                      </div>
                    </div>
                    <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClass[entry.status]}`}>{entry.status}</span>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap wrap-break-word text-sm leading-relaxed text-slate-300">{entry.message}</p>
                  <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-400"><CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />{new Date(entry.createdAt).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </section>
  );
};