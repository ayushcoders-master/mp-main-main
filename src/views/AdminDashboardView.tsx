import React, { useState, useEffect } from 'react';
import { adminApi, crimeApi } from '../services/api.ts';
import { IAdminFeedback, ICrimeData, IFeedbackStats, FeedbackCategory, FeedbackStatus } from '../types.ts';
import { FEEDBACK_CATEGORIES, FEEDBACK_STATUSES } from '../../shared/feedback.js';
import { INDIAN_CITY_NAMES } from '../../shared/indianCities.ts';
import {
  Lock,
  Users,
  Activity,
  Database,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  AlertTriangle,
  Server,
  X,
  Loader2,
  MapPin,
  Calendar,
  Clock,
  MessageSquareText,
  Star
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [crimeList, setCrimeList] = useState<ICrimeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCityFilter, setSelectedCityFilter] = useState('All');
  const [feedback, setFeedback] = useState<IAdminFeedback[]>([]);
  const [feedbackStats, setFeedbackStats] = useState<IFeedbackStats | null>(null);
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const [feedbackError, setFeedbackError] = useState('');
  const [feedbackStatusFilter, setFeedbackStatusFilter] = useState<FeedbackStatus | ''>('');
  const [feedbackCategoryFilter, setFeedbackCategoryFilter] = useState<FeedbackCategory | ''>('');
  const [feedbackRatingFilter, setFeedbackRatingFilter] = useState('');
  const [feedbackSort, setFeedbackSort] = useState<'newest' | 'oldest'>('newest');
  const [updatingFeedbackId, setUpdatingFeedbackId] = useState<string | null>(null);

  // Modal State for Add / Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    city: 'Delhi',
    crimeType: 'Theft / Snatching',
    date: '2026-04-10',
    time: '21:30',
    locationName: 'Connaught Place Outer Circle',
    latitude: 28.6328,
    longitude: 77.2197,
    severity: 6,
    description: 'Bag snatching incident reported near transit interchange.'
  });

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [sRes, cRes] = await Promise.all([
        adminApi.getStats(),
        crimeApi.getAll()
      ]);
      setStats(sRes);
      setCrimeList(cRes.crimeData || []);
    } catch (e) {
      console.warn('Error fetching admin data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  useEffect(() => {
    const loadFeedback = async () => {
      try {
        setFeedbackLoading(true);
        setFeedbackError('');
        const result = await adminApi.getFeedback({
          status: feedbackStatusFilter || undefined,
          category: feedbackCategoryFilter || undefined,
          rating: feedbackRatingFilter ? Number(feedbackRatingFilter) : undefined,
          sort: feedbackSort
        });
        setFeedback(result.feedback);
        setFeedbackStats(result.stats);
      } catch {
        setFeedbackError('Feedback could not be loaded. Your administrator session may have expired.');
      } finally {
        setFeedbackLoading(false);
      }
    };
    void loadFeedback();
  }, [feedbackStatusFilter, feedbackCategoryFilter, feedbackRatingFilter, feedbackSort]);

  const updateFeedbackStatus = async (id: string, status: FeedbackStatus) => {
    setUpdatingFeedbackId(id);
    setFeedbackError('');
    try {
      await adminApi.updateFeedbackStatus(id, status);
      const refreshed = await adminApi.getFeedback({
        status: feedbackStatusFilter || undefined,
        category: feedbackCategoryFilter || undefined,
        rating: feedbackRatingFilter ? Number(feedbackRatingFilter) : undefined,
        sort: feedbackSort
      });
      setFeedback(refreshed.feedback);
      setFeedbackStats(refreshed.stats);
    } catch {
      setFeedbackError('Feedback status could not be updated. Please try again.');
    } finally {
      setUpdatingFeedbackId(null);
    }
  };

  const deleteFeedback = async (item: IAdminFeedback) => {
    if (!window.confirm('Permanently delete this feedback submission?')) return;
    setFeedbackError('');
    try {
      await adminApi.deleteFeedback(item._id);
      const refreshed = await adminApi.getFeedback({
        status: feedbackStatusFilter || undefined,
        category: feedbackCategoryFilter || undefined,
        rating: feedbackRatingFilter ? Number(feedbackRatingFilter) : undefined,
        sort: feedbackSort
      });
      setFeedback(refreshed.feedback);
      setFeedbackStats(refreshed.stats);
    } catch {
      setFeedbackError('Feedback could not be deleted. Please try again.');
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      city: 'Delhi',
      crimeType: 'Theft / Snatching',
      date: new Date().toISOString().split('T')[0],
      time: '20:00',
      locationName: 'Central Tourist District',
      latitude: 28.6139,
      longitude: 77.2090,
      severity: 5,
      description: 'Documented tourist incident area.'
    });
    setModalOpen(true);
  };

  const openEditModal = (item: ICrimeData) => {
    setIsEditing(true);
    setCurrentId(item._id);
    setFormData({
      city: item.city || item.location,
      crimeType: item.crimeType,
      date: item.date,
      time: item.time,
      locationName: item.locationName || item.location,
      latitude: item.latitude,
      longitude: item.longitude,
      severity: item.severity,
      description: item.description
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this crime incident record? This will update ML training weights.')) return;
    try {
      await adminApi.deleteCrime(id);
      setCrimeList((prev) => prev.filter((c) => c._id !== id));
      loadAdminData();
    } catch (e) {
      alert('Failed to delete crime entry.');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && currentId) {
        await adminApi.updateCrime(currentId, formData);
      } else {
        await adminApi.addCrime(formData);
      }
      setModalOpen(false);
      loadAdminData();
    } catch (e) {
      alert('Failed to save crime record.');
    }
  };

  const filteredCrimes = crimeList.filter((c) => {
    const loc = (c.locationName || c.location || '').toLowerCase();
    const city = (c.city || c.location || '').toLowerCase();
    const type = (c.crimeType || '').toLowerCase();
    const q = searchQuery.toLowerCase();

    const matchesSearch = loc.includes(q) || type.includes(q) || city.includes(q);
    const matchesCity = selectedCityFilter === 'All' || city === selectedCityFilter.toLowerCase();
    const isIndianCity = INDIAN_CITY_NAMES.includes((c.city || c.location) as typeof INDIAN_CITY_NAMES[number]);
    return isIndianCity && matchesSearch && matchesCity;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Lock className="w-5 h-5" />
            </div>
            <span>Admin Operational Control Hub</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage crime datasets, inspect machine learning microservice logs, and monitor live tourist safety queries.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Incident Record</span>
        </button>
      </div>

      {/* Stats Cards (Required in Section 15) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800/90 rounded-3xl p-6 border border-slate-700/80 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block mb-1">
              Total Users
            </span>
            <span className="text-2xl font-black text-white">
              {stats?.totalUsers || 2}
            </span>
            <span className="text-[11px] text-emerald-400 block mt-1">Authenticated profiles</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-800/90 rounded-3xl p-6 border border-slate-700/80 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block mb-1">
              Total Predictions
            </span>
            <span className="text-2xl font-black text-white">
              {stats?.totalPredictions || 0}
            </span>
            <span className="text-[11px] text-cyan-400 block mt-1">Risk queries evaluated</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-800/90 rounded-3xl p-6 border border-slate-700/80 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block mb-1">
              Documented Crimes
            </span>
            <span className="text-2xl font-black text-white">
              {stats?.totalCrimeRecords || crimeList.length}
            </span>
            <span className="text-[11px] text-amber-400 block mt-1">Geocoded incidents</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <Database className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-800/90 rounded-3xl p-6 border border-slate-700/80 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block mb-1">
              Python ML Service
            </span>
            <span className="text-2xl font-black text-emerald-400">ONLINE</span>
            <span className="text-[11px] text-slate-400 block mt-1">Port 5001 • XGBoost Daemon</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <Server className="w-6 h-6" />
          </div>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-700/80 bg-slate-800/90 p-5 sm:p-6 shadow-xl space-y-5" aria-labelledby="feedback-management-heading">
        <div className="flex flex-col gap-3 border-b border-slate-700/60 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 id="feedback-management-heading" className="flex items-center gap-2 text-lg font-bold text-white"><MessageSquareText className="h-5 w-5 text-cyan-700" />Feedback Management</h2>
            <p className="mt-1 text-xs text-slate-400">Review submissions from signed-in travellers and track resolution.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <select aria-label="Filter feedback by status" value={feedbackStatusFilter} onChange={(event) => setFeedbackStatusFilter(event.target.value as FeedbackStatus | '')} className="rounded-lg border border-slate-600 bg-slate-900 px-2.5 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30">
              <option value="">All statuses</option>
              {FEEDBACK_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
            <select aria-label="Filter feedback by category" value={feedbackCategoryFilter} onChange={(event) => setFeedbackCategoryFilter(event.target.value as FeedbackCategory | '')} className="rounded-lg border border-slate-600 bg-slate-900 px-2.5 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30">
              <option value="">All categories</option>
              {FEEDBACK_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
            <select aria-label="Filter feedback by rating" value={feedbackRatingFilter} onChange={(event) => setFeedbackRatingFilter(event.target.value)} className="rounded-lg border border-slate-600 bg-slate-900 px-2.5 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30">
              <option value="">All ratings</option>
              {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} stars</option>)}
            </select>
            <select aria-label="Sort feedback" value={feedbackSort} onChange={(event) => setFeedbackSort(event.target.value as 'newest' | 'oldest')} className="rounded-lg border border-slate-600 bg-slate-900 px-2.5 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30">
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4"><p className="text-[11px] font-bold uppercase text-slate-400">Total submissions</p><p className="mt-1 text-2xl font-black text-white">{feedbackStats?.total ?? 0}</p></div>
          <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4"><p className="text-[11px] font-bold uppercase text-slate-400">New</p><p className="mt-1 text-2xl font-black text-amber-700">{feedbackStats?.newCount ?? 0}</p></div>
          <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4"><p className="text-[11px] font-bold uppercase text-slate-400">Average rating</p><p className="mt-1 flex items-center gap-1 text-2xl font-black text-white">{feedbackStats?.averageRating.toFixed(1) ?? '0.0'} <Star className="h-4 w-4 fill-amber-500 text-amber-500" aria-label="stars" /></p></div>
          <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4"><p className="text-[11px] font-bold uppercase text-slate-400">Categories represented</p><p className="mt-1 text-2xl font-black text-white">{feedbackStats?.byCategory.length ?? 0}</p></div>
        </div>

        {feedbackStats?.byCategory.length ? (
          <div className="flex flex-wrap gap-2" aria-label="Feedback count by category">
            {feedbackStats.byCategory.map((item) => <span key={item.category} className="rounded-full border border-slate-600 bg-slate-900 px-3 py-1.5 text-xs text-slate-300">{item.category} <strong className="ml-1 text-cyan-700">{item.count}</strong></span>)}
          </div>
        ) : null}

        {feedbackError && <p role="alert" className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-700">{feedbackError}</p>}
        {feedbackLoading ? (
          <div className="py-8 text-center text-sm text-slate-400"><Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin text-cyan-700" />Loading feedback...</div>
        ) : feedback.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-600 px-4 py-10 text-center text-sm text-slate-400">No feedback matches these filters.</div>
        ) : (
          <ul className="space-y-3">
            {feedback.map((item) => (
              <li key={item._id} className="rounded-xl border border-slate-700 bg-slate-900/50 p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-slate-100">{item.category}</h3>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700"><Star className="h-3.5 w-3.5 fill-current" />{item.rating}/5</span>
                    </div>
                    <p className="mt-2 whitespace-pre-wrap wrap-break-word text-sm leading-relaxed text-slate-300">{item.message}</p>
                    <p className="mt-3 text-xs text-slate-400">{item.user.name}{item.user.email ? ` · ${item.user.email}` : ''} · {new Date(item.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <label className="sr-only" htmlFor={`feedback-status-${item._id}`}>Status for feedback from {item.user.name}</label>
                    <select id={`feedback-status-${item._id}`} value={item.status} disabled={updatingFeedbackId === item._id} onChange={(event) => void updateFeedbackStatus(item._id, event.target.value as FeedbackStatus)} className="rounded-lg border border-slate-600 bg-slate-800 px-2.5 py-2 text-xs font-semibold text-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 disabled:opacity-60">
                      {FEEDBACK_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                    <button type="button" onClick={() => void deleteFeedback(item)} aria-label={`Delete feedback from ${item.user.name}`} title="Delete feedback" className="rounded-lg p-2 text-slate-400 hover:bg-rose-500/10 hover:text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Crime Data Management Section */}
      <div className="bg-slate-800/90 rounded-3xl p-6 border border-slate-700/80 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-700/60">
          <div>
            <h3 className="text-lg font-bold text-white">Crime Incident Dataset Management</h3>
            <p className="text-xs text-slate-400">
              CRUD interface for feeding crime frequency and severity scores into the ML model.
            </p>
          </div>

          {/* Search & City Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search incidents..."
                className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            </div>

            <select
              value={selectedCityFilter}
              onChange={(e) => setSelectedCityFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Cities</option>
              {INDIAN_CITY_NAMES.map((city) => <option key={city} value={city}>{city}</option>)}
            </select>
          </div>
        </div>

        {/* Crime Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">City & Area</th>
                <th className="py-3 px-4">Crime Category</th>
                <th className="py-3 px-4">Date / Time</th>
                <th className="py-3 px-4 text-center">Severity</th>
                <th className="py-3 px-4">Coordinates</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredCrimes.map((c) => (
                <tr key={c._id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-200">
                    <div>{c.locationName}</div>
                    <span className="text-[10px] text-cyan-400 font-normal">{c.city}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    <span className="font-medium text-slate-200 block">{c.crimeType}</span>
                    <span className="text-[11px] text-slate-400 truncate max-w-xs block">{c.description}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-mono text-[11px]">
                    {c.date} <br />
                    <span className="text-slate-400">{c.time}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        c.severity >= 7
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : c.severity >= 4
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {c.severity} / 10
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                    {c.latitude?.toFixed(4)}, {c.longitude?.toFixed(4)}
                  </td>
                  <td className="py-3 px-4 text-right space-x-1">
                    <button
                      onClick={() => openEditModal(c)}
                      className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-cyan-400 hover:bg-slate-700 transition-colors"
                      title="Edit Record"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete Record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog for Add / Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-700 shadow-2xl space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="text-base font-bold text-white">
                {isEditing ? 'Edit Incident Record' : 'Log New Crime Incident'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">City</label>
                  <select
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:border-cyan-500"
                  >
                    {INDIAN_CITY_NAMES.map((city) => <option key={city} value={city}>{city}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Crime Type</label>
                  <input
                    type="text"
                    required
                    value={formData.crimeType}
                    onChange={(e) => setFormData({ ...formData, crimeType: e.target.value })}
                    placeholder="e.g. Theft, Pickpocketing"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Specific Location / Landmark</label>
                <input
                  type="text"
                  required
                  value={formData.locationName}
                  onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                  placeholder="e.g. Connaught Place Metro Gate 3"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Time</label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Severity (1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: parseInt(e.target.value, 10) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Incident Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-700 text-slate-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                >
                  {isEditing ? 'Save Changes' : 'Record Incident'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
