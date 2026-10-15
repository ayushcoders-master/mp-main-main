import React from 'react';
import { RiskLevel } from '../types.ts';
import { ShieldAlert, ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';

interface RiskMeterProps {
  score: number; // 0 to 100
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export const RiskMeter: React.FC<RiskMeterProps> = ({ score, level, size = 'md', showDetails = true }) => {
  // Clamped score
  const safeScore = Math.max(0, Math.min(100, Math.round(score)));

  // Color mappings based on strict safety UX guidelines
  const getLevelDetails = () => {
    switch (level) {
      case 'LOW':
        return {
          label: 'LOW RISK',
          color: 'text-emerald-400',
          bgColor: 'bg-emerald-500/10',
          borderColor: 'border-emerald-500/30',
          strokeColor: '#10b981',
          gradientId: 'grad-low',
          icon: ShieldCheck,
          badge: 'Safe Travel Zone',
          advice: 'Standard vigilance is recommended. Area has low historical violent crime and reliable policing.'
        };
      case 'MODERATE':
        return {
          label: 'MODERATE RISK',
          color: 'text-amber-400',
          bgColor: 'bg-amber-500/10',
          borderColor: 'border-amber-500/30',
          strokeColor: '#f59e0b',
          gradientId: 'grad-mod',
          icon: AlertTriangle,
          badge: 'Caution Advised',
          advice: 'Stay aware of surroundings. Watch for petty scams, pickpocketing in crowded areas, and evening transit.'
        };
      case 'HIGH':
        return {
          label: 'HIGH RISK',
          color: 'text-orange-400',
          bgColor: 'bg-orange-500/10',
          borderColor: 'border-orange-500/30',
          strokeColor: '#f97316',
          gradientId: 'grad-high',
          icon: ShieldAlert,
          badge: 'High Vigilance Required',
          advice: 'Heightened risk detected. Avoid isolated alleys, avoid late-night travel alone, and stick to monitored corridors.'
        };
      case 'CRITICAL':
      default:
        return {
          label: 'CRITICAL RISK',
          color: 'text-rose-400',
          bgColor: 'bg-rose-500/15',
          borderColor: 'border-rose-500/40',
          strokeColor: '#f43f5e',
          gradientId: 'grad-crit',
          icon: AlertOctagon,
          badge: 'Emergency Alert Zone',
          advice: 'Substantial hazard. Active crime hotspots or severe weather alert. Consider rescheduling non-essential travel.'
        };
    }
  };

  const details = getLevelDetails();
  const IconComponent = details.icon;

  // Arc math for gauge
  const radius = size === 'lg' ? 78 : size === 'sm' ? 44 : 64;
  const stroke = size === 'lg' ? 12 : size === 'sm' ? 8 : 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  // Use a semi-gauge or 270 degree sweep
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (safeScore / 100) * arcLength;

  return (
    <div id="risk-meter-card" className="flex flex-col items-center text-center p-6 bg-slate-800/80 rounded-2xl border border-slate-700/80 shadow-xl backdrop-blur-sm">
      {/* Risk Badge */}
      <div className="flex items-center gap-2 mb-4">
        <span
          id="risk-level-badge"
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${details.bgColor} ${details.color} ${details.borderColor}`}
        >
          <IconComponent className="w-3.5 h-3.5" />
          {details.label}
        </span>
      </div>

      {/* SVG Radial Meter */}
      <div className="relative flex items-center justify-center my-2">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="rotate-135 transform transition-all duration-1000 ease-out"
        >
          {/* Background Track */}
          <circle
            stroke="#334155"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Animated Fill */}
          <circle
            stroke={details.strokeColor}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={`${arcLength} ${circumference}`}
            style={{
              strokeDashoffset,
              transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>

        {/* Center Score Display */}
        <div className="absolute flex flex-col items-center justify-center">
          <div className="flex items-baseline gap-0.5">
            <span id="risk-score-value" className={`text-4xl font-extrabold tracking-tight ${details.color}`}>
              {safeScore}
            </span>
            <span className="text-sm font-semibold text-slate-400">/100</span>
          </div>
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium mt-0.5">
            Risk Index
          </span>
        </div>
      </div>

      {/* Visual Indicator Bar */}
      <div className="w-full max-w-xs mt-3">
        <div className="h-2 w-full bg-slate-700/60 rounded-full overflow-hidden p-0.5 flex gap-1">
          <div className={`h-full rounded-full transition-all duration-700 ${safeScore < 35 ? 'bg-emerald-500' : 'bg-emerald-500/30'}`} style={{ width: '35%' }} title="Low Risk (0-35)" />
          <div className={`h-full rounded-full transition-all duration-700 ${safeScore >= 35 && safeScore < 65 ? 'bg-amber-500' : 'bg-amber-500/30'}`} style={{ width: '30%' }} title="Moderate Risk (35-65)" />
          <div className={`h-full rounded-full transition-all duration-700 ${safeScore >= 65 && safeScore < 85 ? 'bg-orange-500' : 'bg-orange-500/30'}`} style={{ width: '20%' }} title="High Risk (65-85)" />
          <div className={`h-full rounded-full transition-all duration-700 ${safeScore >= 85 ? 'bg-rose-500' : 'bg-rose-500/30'}`} style={{ width: '15%' }} title="Critical Risk (85-100)" />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
          <span>0 (Safe)</span>
          <span>35</span>
          <span>65</span>
          <span>85</span>
          <span>100 (Critical)</span>
        </div>
      </div>

      {showDetails && (
        <div className="mt-4 pt-3 border-t border-slate-700/50 w-full text-left">
          <div className="text-xs font-medium text-slate-300 flex items-center justify-between mb-1">
            <span>Assessment Summary</span>
            <span className={`text-xs font-semibold ${details.color}`}>{details.badge}</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {details.advice}
          </p>
        </div>
      )}
    </div>
  );
};
