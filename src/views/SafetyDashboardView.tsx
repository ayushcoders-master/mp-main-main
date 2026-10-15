import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { IPrediction, ICrimeData } from '../types.ts';
import { predictionApi, emergencyApi } from '../services/api.ts';
import { RiskMeter } from '../components/RiskMeter.tsx';
import { ExplainableAI } from '../components/ExplainableAI.tsx';
import { CrimeTrendChart } from '../components/CrimeTrendChart.tsx';
import { SafetyMap } from '../components/SafetyMap.tsx';
import {
  MapPin,
  Calendar,
  Clock,
  CloudSun,
  Compass,
  ArrowLeft,
  Route,
  PhoneCall,
  Sparkles,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Share2,
  Download,
  Loader2,
  ChevronRight
} from 'lucide-react';

export const SafetyDashboardView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const [prediction, setPrediction] = useState<IPrediction | null>(() => {
    return location.state?.predictionData?.prediction || null;
  });

  const [crimeTrend, setCrimeTrend] = useState<Array<{ month: string; incidents: number; resolved: number }>>(() => {
    return location.state?.predictionData?.crimeTrend || [];
  });

  const [nearbyCrimes, setNearbyCrimes] = useState<ICrimeData[]>(() => {
    return location.state?.predictionData?.nearbyCrimes || [];
  });
  const [dataQualityMessage, setDataQualityMessage] = useState<string | null>(() => {
    return location.state?.predictionData?.dataQuality?.message || null;
  });

  const [emergencyServices, setEmergencyServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(!prediction);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPrediction = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await predictionApi.getById(id);
        setPrediction(data.prediction);
        setCrimeTrend(data.crimeTrend);
        setNearbyCrimes(data.nearbyCrimes);
        setDataQualityMessage(data.dataQuality.message);

        // Also fetch emergency services for map integration
        const emg = await emergencyApi.getNearby(data.prediction.location);
        setEmergencyServices(emg.services);
      } catch (err: any) {
        setError('Could not locate prediction record.');
      } finally {
        setLoading(false);
      }
    };

    if (!prediction && id) {
      loadPrediction();
    } else if (prediction) {
      // Load emergency services for destination
      emergencyApi.getNearby(prediction.location).then((emg) => {
        setEmergencyServices(emg.services);
      }).catch(() => {});
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
        <p className="text-sm font-medium">Loading Safety Risk Dashboard...</p>
      </div>
    );
  }

  if (error || !prediction) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-slate-800 rounded-3xl border border-slate-700 text-center">
        <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-white mb-2">Prediction Not Found</h2>
        <p className="text-xs text-slate-400 mb-6">
          The requested safety evaluation could not be loaded or has expired.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
        >
          Return to Tourist Dashboard
        </button>
      </div>
    );
  }

  const mapCenter: [number, number] = [
    prediction.latitude || 28.6139,
    prediction.longitude || 77.2090
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-colors"
            title="Back to Input"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Link to="/dashboard" className="hover:text-cyan-400">Dashboard</Link>
              <ChevronRight className="w-3 h-3 text-slate-600" />
              <span className="text-slate-200">Safety Analysis</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 mt-0.5">
              <span>Safety Assessment:</span>
              <span className="text-cyan-400">{prediction.location}</span>
            </h1>
          </div>
        </div>

        {/* Quick Action Navigation Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to={`/routes?dest=${encodeURIComponent(prediction.location)}`}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Route className="w-3.5 h-3.5 text-cyan-400" />
            <span>Safer Routes</span>
          </Link>

          <Link
            to={`/emergency?loc=${encodeURIComponent(prediction.location)}`}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
            <span>Emergency Services</span>
          </Link>

          <Link
            to={`/map?dest=${encodeURIComponent(prediction.location)}`}
            className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-cyan-500/20"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Open Safety Map</span>
          </Link>
        </div>
      </div>

      {dataQualityMessage && (
        <div role="status" className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-950">
          <strong>Unvalidated estimate:</strong> {dataQualityMessage}
        </div>
      )}

      {/* Main Grid: Risk Overview & Visual Meter */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Risk Meter & Trip Meta */}
        <div className="lg:col-span-5 space-y-6">
          <RiskMeter score={prediction.riskScore} level={prediction.riskLevel} size="lg" />

          {/* Trip Meta Card */}
          <div className="bg-slate-800/90 rounded-2xl border border-slate-700/80 p-5 space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Trip Assessment Parameters
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/50">
                <span className="text-slate-400 flex items-center gap-1.5 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  Planned Date
                </span>
                <span className="font-semibold text-slate-200">{prediction.date}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/50">
                <span className="text-slate-400 flex items-center gap-1.5 mb-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  Planned Time
                </span>
                <span className="font-semibold text-slate-200">{prediction.time}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/50">
                <span className="text-slate-400 flex items-center gap-1.5 mb-1">
                  <CloudSun className="w-3.5 h-3.5 text-cyan-400" />
                  Weather Status
                </span>
                <span className="font-semibold text-slate-200">{prediction.weather || 'Clear'}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/50">
                <span className="text-slate-400 flex items-center gap-1.5 mb-1">
                  <Compass className="w-3.5 h-3.5 text-cyan-400" />
                  Tourist Category
                </span>
                <span className="font-semibold text-slate-200">{prediction.touristCategory}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Explainable AI & AI Recommendations */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 7: Explainable AI */}
          <ExplainableAI
            factors={prediction.factors || []}
            destination={prediction.location}
          />

          {/* AI Tailored Safety Recommendations */}
          <div className="bg-slate-800/90 rounded-2xl border border-slate-700/80 p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-700/60">
              <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <Shield className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-100">
                  AI Safety Recommendations for {prediction.touristCategory}
                </h3>
                <p className="text-xs text-slate-400">
                  Adaptive precautions based on your selected travel window and destination severity.
                </p>
              </div>
            </div>

            <ul className="space-y-2.5">
              {prediction.recommendations.map((rec, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-700/50 text-xs text-slate-200 leading-relaxed"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Crime Trend Chart & Safety Factors */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <CrimeTrendChart data={crimeTrend} location={prediction.location} />
        </div>

        {/* Safety Factors Overview (Crime, Weather, Time, Location, Crowd Density) */}
        <div className="lg:col-span-5 bg-slate-800/90 rounded-2xl border border-slate-700/80 p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-700/60">
            <h3 className="text-base font-bold text-white">Safety Factor Index</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Crime History Factor</span>
                <span className="font-semibold text-rose-400">
                  {prediction.riskScore > 65 ? 'High (Elevated)' : 'Moderate'}
                </span>
              </div>
              <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full"
                  style={{ width: `${Math.min(100, prediction.riskScore * 0.9)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Time of Day Sensitivity</span>
                <span className="font-semibold text-amber-400">
                  {prediction.time >= '20:00' || prediction.time < '05:00' ? 'High (Night-time)' : 'Low (Daylight)'}
                </span>
              </div>
              <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{
                    width: prediction.time >= '20:00' || prediction.time < '05:00' ? '85%' : '25%'
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Weather Conditions</span>
                <span className="font-semibold text-cyan-400">{prediction.weather}</span>
              </div>
              <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-500 rounded-full"
                  style={{ width: prediction.weather === 'Clear' ? '20%' : '70%' }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Crowd & Transit Density</span>
                <span className="font-semibold text-emerald-400">Moderate / Monitored</span>
              </div>
              <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '45%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Police Response Proximity</span>
                <span className="font-semibold text-blue-400">
                  {emergencyServices.length > 0 ? `${emergencyServices.length} Active Precincts` : 'Standard Coverage'}
                </span>
              </div>
              <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '80%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Interactive Safety Map Preview */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-cyan-400" />
              Interactive Safety Map: {prediction.location}
            </h3>
            <p className="text-xs text-slate-400">
              Visualizing tourist location, crime incident zones, police stations, and medical trauma centers.
            </p>
          </div>
          <Link
            to={`/map?dest=${encodeURIComponent(prediction.location)}`}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>Expand Fullscreen Map</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <SafetyMap
          center={mapCenter}
          zoom={13}
          locationName={prediction.location}
          emergencyServices={emergencyServices}
          crimeData={nearbyCrimes}
          className="h-[420px]"
        />
      </div>
    </div>
  );
};
