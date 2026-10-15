import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { predictionApi } from '../services/api.ts';
import { IPrediction } from '../types.ts';
import {
  History,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Search,
  ExternalLink,
  Loader2
} from 'lucide-react';

export const PredictionHistoryView: React.FC = () => {
  const [predictions, setPredictions] = useState<IPrediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await predictionApi.getHistory();
      setPredictions(data.predictions || []);
    } catch (e: any) {
      setError('Could not fetch travel prediction history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Delete this prediction from your history?')) return;
    try {
      await predictionApi.delete(id);
      setPredictions((prev) => prev.filter((p) => p._id !== id));
    } catch (e) {
      alert('Failed to delete prediction record.');
    }
  };

  const getBadgeStyle = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'HIGH':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'MODERATE':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'LOW':
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    }
  };

  const filtered = predictions.filter((p) =>
    p.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <History className="w-5 h-5" />
            </div>
            <span>My Safety Predictions</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Persisted travel evaluations computed by the XGBoost & Random Forest ensemble.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4 text-cyan-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by destination..."
            className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
          <p className="text-xs font-medium">Retrieving saved safety predictions...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center bg-slate-800/80 rounded-3xl border border-slate-700 space-y-4">
          <MapPin className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No Predictions Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You have not run any destination safety evaluations yet, or none matched your search query.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
          >
            <span>Run New Destination Risk Check</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item._id}
              onClick={() => navigate(`/safety-dashboard/${item._id}`)}
              className="bg-slate-800/90 rounded-3xl p-6 border border-slate-700/80 hover:border-slate-600 shadow-xl transition-all hover:-translate-y-1 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                      {item.touristCategory}
                    </span>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {item.location}
                    </h3>
                  </div>

                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getBadgeStyle(
                      item.riskLevel
                    )}`}
                  >
                    {item.riskLevel}
                  </span>
                </div>

                {/* Score badge */}
                <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-700/60 flex items-center justify-between mb-4">
                  <span className="text-xs text-slate-400">Risk Score:</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-white">{item.riskScore}</span>
                    <span className="text-xs text-slate-400 font-medium">/ 100</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>Travel Date: <strong className="text-slate-300">{item.date}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Arrival Time: <strong className="text-slate-300">{item.time}</strong></span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-700/60 flex items-center justify-between">
                <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1 group-hover:underline">
                  <span>View Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>

                <button
                  type="button"
                  onClick={(e) => handleDelete(item._id, e)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Delete Record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
