import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { POPULAR_INDIAN_CITIES } from '../../shared/indianCities.ts';
import {
  Shield,
  ShieldAlert,
  Route,
  PhoneCall,
  Sparkles,
  ArrowRight,
  MapPin,
  CheckCircle2,
  TrendingDown,
  Lock,
  Compass,
  AlertTriangle,
  Zap,
  Activity
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [quickDestination, setQuickDestination] = useState('Delhi');

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickDestination.trim()) {
      navigate(`/dashboard?dest=${encodeURIComponent(quickDestination.trim())}`);
    }
  };

  const featureCards = [
    {
      title: 'AI Risk Prediction',
      icon: Activity,
      color: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30',
      description:
        'Ensemble XGBoost and Random Forest algorithms predict comprehensive risk score (0-100) and discrete risk tier for any target city.'
    },
    {
      title: 'Safer Route Recommendation',
      icon: Route,
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
      description:
        'Computes safest transit alternatives bypassing documented incident clusters, favoring CCTV coverage and police patrol presence.'
    },
    {
      title: 'Emergency Services',
      icon: PhoneCall,
      color: 'from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30',
      description:
        'Instant geocoded mapping of nearest police stations, 24/7 trauma emergency hospitals, and country-specific tourist helplines.'
    },
    {
      title: 'Personalized Safety Advice',
      icon: Sparkles,
      color: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30',
      description:
        'Context-aware recommendations customized for Solo Travelers, Families, Seniors, Students, and Business visitors.'
    }
  ];

  const processSteps = [
    { step: '01', title: 'Enter Destination', desc: 'Select target city, travel date, arrival time, and traveler profile.' },
    { step: '02', title: 'Analyze Risk', desc: 'Python ML service aggregates crime logs, weather, and time vulnerability.' },
    { step: '03', title: 'Get Recommendations', desc: 'Review Explainable AI breakdown, safe corridors, and emergency stations.' },
    { step: '04', title: 'Travel Safer', desc: 'Depart with verified situational awareness and active safety routing.' }
  ];

  const popularCities = POPULAR_INDIAN_CITIES;

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-800">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/90 border border-slate-700/80 text-xs text-cyan-300 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>Explainable AI Machine Learning Safety Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Know the Risk. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500">
                  Travel Safer.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed mx-auto lg:mx-0">
                AI-powered tourist safety prediction before you travel. Evaluate destination crime history, temporal risk, weather impact, emergency hubs, and verified safer routes.
              </p>

              {/* Primary & Secondary Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5"
                >
                  <Shield className="w-4 h-4" />
                  <span>Check Destination Safety</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/map"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700/80 text-slate-100 border border-slate-700 shadow-md transition-all"
                >
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span>Explore Safety Map</span>
                </Link>
              </div>

              {/* Instant City Quick Jump */}
              <div className="pt-4 text-xs text-slate-400 flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <span className="text-slate-400 font-medium">Popular Destinations:</span>
                {popularCities.map((city) => (
                  <button
                    key={city}
                    onClick={() => navigate(`/dashboard?dest=${encodeURIComponent(city)}`)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* Hero Right Column: Modern Travel + AI + Location Safety Illustration */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md bg-gradient-to-b from-slate-800/90 to-slate-900/90 rounded-3xl p-6 border border-slate-700/80 shadow-2xl backdrop-blur-xl">
                {/* Floating Top Pill */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-700/70">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-[11px] font-mono text-cyan-400 font-medium">
                    LIVE ML PREDICTOR
                  </span>
                </div>

                {/* Simulated Target Card */}
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-rose-400" />
                        Target: Delhi, India
                      </span>
                      <span className="text-slate-400">Time: 21:30 (Night)</span>
                    </div>

                    <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800/80">
                      <div>
                        <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                          Composite Safety Risk
                        </span>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className="text-3xl font-extrabold text-orange-400">72</span>
                          <span className="text-xs text-slate-400 font-medium">/ 100</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-500/15 text-orange-400 border border-orange-500/30">
                          <AlertTriangle className="w-3 h-3" />
                          HIGH RISK
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-1">Solo Traveler Profile</span>
                      </div>
                    </div>
                  </div>

                  {/* Explainable Factor Pills */}
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/60 flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-400" />
                        Historical Crime Density
                      </span>
                      <span className="text-rose-400 font-semibold">High Impact (+32)</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/60 flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        Post-Sunset Transit
                      </span>
                      <span className="text-amber-400 font-semibold">Moderate Impact (+18)</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/60 flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        Emergency Police Proximity
                      </span>
                      <span className="text-emerald-400 font-semibold">400m Active Station</span>
                    </div>
                  </div>

                  {/* Action Link inside graphic */}
                  <button
                    onClick={() => navigate('/dashboard?dest=Delhi')}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-xs font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Run Full Safety Simulation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Major Feature Cards */}
      <section className="py-16 bg-slate-950/70 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs uppercase font-bold tracking-widest text-cyan-400 mb-2">
              Comprehensive Safety Architecture
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Engineered for Complete Situational Awareness
            </h3>
            <p className="text-sm text-slate-400 mt-2">
              Combining predictive machine learning with geospatial safety parameters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featureCards.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-all hover:-translate-y-1 group shadow-lg"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.color} border flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-slate-100 mb-2">
                    {feat.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Simple 4-Step Process Section */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs uppercase font-bold tracking-widest text-cyan-400 mb-2">
              Simple 4-Step Journey
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Enter Destination → Analyze Risk → Get Safety Recommendations → Travel Safer
            </h3>
            <p className="text-sm text-slate-400 mt-2">
              Get an instant safety evaluation before stepping out of your hotel or airport.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {processSteps.map((item, idx) => (
              <div
                key={idx}
                className="relative bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 flex flex-col justify-between"
              >
                <div>
                  <span className="text-3xl font-black text-cyan-400/40 font-mono block mb-2">
                    {item.step}
                  </span>
                  <h4 className="text-base font-bold text-slate-100 mb-2">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center text-xs font-semibold text-cyan-400">
                  <span>Step {idx + 1} of 4</span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Call to action */}
          <div className="mt-14 text-center">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-xl shadow-cyan-500/20 transition-all transform hover:-translate-y-0.5"
            >
              <Shield className="w-5 h-5" />
              <span>Launch Tourist Risk Predictor Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
