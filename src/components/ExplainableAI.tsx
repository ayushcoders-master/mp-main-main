import React from 'react';
import { IPredictionFactor } from '../types.ts';
import {
  History,
  Moon,
  Users,
  AlertTriangle,
  CloudRain,
  MapPin,
  Sparkles,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

interface ExplainableAIProps {
  factors: IPredictionFactor[];
  modelUsed?: string;
  destination: string;
}

export const ExplainableAI: React.FC<ExplainableAIProps> = ({
  factors,
  modelUsed = 'Rule-based weighted risk model (NCRB 2022 baselines)',
  destination
}) => {
  const getFactorIcon = (factorName: string) => {
    const f = factorName.toLowerCase();
    if (f.includes('crime') || f.includes('history')) return History;
    if (f.includes('time') || f.includes('night') || f.includes('day')) return Moon;
    if (f.includes('crowd') || f.includes('density') || f.includes('pedestrian')) return Users;
    if (f.includes('incident') || f.includes('recent')) return AlertTriangle;
    if (f.includes('weather') || f.includes('rain') || f.includes('storm')) return CloudRain;
    return MapPin;
  };

  const getImpactBadge = (impact: 'Low' | 'Moderate' | 'High') => {
    switch (impact) {
      case 'High':
        return {
          bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          dot: 'bg-rose-500',
          label: 'High Impact'
        };
      case 'Moderate':
        return {
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          dot: 'bg-amber-500',
          label: 'Moderate Impact'
        };
      case 'Low':
      default:
        return {
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          dot: 'bg-emerald-500',
          label: 'Low Impact'
        };
    }
  };

  return (
    <div id="explainable-ai-section" className="bg-slate-800/90 rounded-2xl border border-slate-700/80 p-6 shadow-xl backdrop-blur-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-700/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-slate-100">
              Explainable AI (XAI): Why is this location risky?
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Machine Learning factor decomposition explaining predictive weights for {destination}.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-700/60 text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[11px] text-slate-300">{modelUsed}</span>
        </div>
      </div>

      {/* Factors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {factors.map((item, idx) => {
          const Icon = getFactorIcon(item.factor);
          const badge = getImpactBadge(item.impact);

          return (
            <div
              key={idx}
              id={`factor-card-${idx}`}
              className="group relative bg-slate-900/60 hover:bg-slate-900/90 rounded-xl p-4 border border-slate-700/50 hover:border-slate-600 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 group-hover:border-cyan-500/40 group-hover:text-cyan-400 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">
                      {item.factor}
                    </h4>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Weight contribution: +{item.scoreContribution} pts
                    </span>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${badge.bg}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                  {badge.label}
                </span>
              </div>

              <p className="text-xs text-slate-300/90 leading-relaxed pl-1 pt-1">
                “{item.explanation}”
              </p>
            </div>
          );
        })}
      </div>

      {/* XAI Methodology Note */}
      <div className="mt-5 p-3.5 rounded-xl bg-slate-900/50 border border-slate-700/40 flex items-start gap-3 text-xs text-slate-400">
        <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-300 font-medium">Explainable Machine Learning Transparency:</strong> Rather than a black-box risk rating, our model evaluates historical police databases, temporal crime spikes, meteorology, and localized vulnerability index to deliver actionable, transparent travel insights.
        </p>
      </div>
    </div>
  );
};
