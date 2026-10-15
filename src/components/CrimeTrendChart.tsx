import React, { useState } from 'react';
import { TrendingUp, AlertCircle, ShieldCheck } from 'lucide-react';

interface CrimeTrendItem {
  month: string;
  incidents: number;
  resolved: number;
}

interface CrimeTrendChartProps {
  data: CrimeTrendItem[];
  location: string;
}

export const CrimeTrendChart: React.FC<CrimeTrendChartProps> = ({ data, location }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-6 text-center text-slate-400 text-sm">
        No historical crime trend data available for {location}.
      </div>
    );
  }

  const maxVal = Math.max(...data.map((d) => Math.max(d.incidents, d.resolved)), 30);
  const chartHeight = 160;

  const totalIncidents = data.reduce((acc, d) => acc + d.incidents, 0);
  const totalResolved = data.reduce((acc, d) => acc + d.resolved, 0);
  const clearanceRate = Math.round((totalResolved / (totalIncidents || 1)) * 100);

  return (
    <div id="crime-trend-chart-card" className="bg-slate-800/90 rounded-2xl border border-slate-700/80 p-6 shadow-xl backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-700/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-slate-100">
              Historical Incident Trend — {location}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            6-Month longitudinal monitoring of verified police records & resolutions.
          </p>
        </div>

        {/* Mini stats */}
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-rose-500/80" />
            <span className="text-slate-300">Reported Cases</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-cyan-500/80" />
            <span className="text-slate-300">Police Resolved</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="relative pt-6">
        <div className="flex items-end justify-between gap-2 sm:gap-4 h-44 px-2 border-b border-slate-700">
          {data.map((item, idx) => {
            const incHeight = (item.incidents / maxVal) * chartHeight;
            const resHeight = (item.resolved / maxVal) * chartHeight;
            const isHovered = hoveredIdx === idx;

            return (
              <div
                key={item.month}
                className="flex-1 flex flex-col items-center group cursor-pointer relative"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Floating tooltip */}
                {isHovered && (
                  <div className="absolute -top-14 z-20 bg-slate-900 text-white text-[11px] px-2.5 py-1.5 rounded-lg border border-slate-700 shadow-xl pointer-events-none whitespace-nowrap">
                    <span className="font-bold text-slate-200">{item.month}: </span>
                    <span className="text-rose-400 font-semibold">{item.incidents} Incidents</span> |{' '}
                    <span className="text-cyan-400 font-semibold">{item.resolved} Resolved</span>
                  </div>
                )}

                {/* Bars side by side */}
                <div className="w-full flex items-end justify-center gap-1 sm:gap-1.5 h-full">
                  <div
                    style={{ height: `${incHeight}px` }}
                    className={`w-3.5 sm:w-5 rounded-t-sm transition-all duration-300 ${
                      isHovered ? 'bg-rose-400 shadow-lg shadow-rose-500/30' : 'bg-rose-500/80'
                    }`}
                  />
                  <div
                    style={{ height: `${resHeight}px` }}
                    className={`w-3.5 sm:w-5 rounded-t-sm transition-all duration-300 ${
                      isHovered ? 'bg-cyan-400 shadow-lg shadow-cyan-500/30' : 'bg-cyan-500/70'
                    }`}
                  />
                </div>

                {/* Month label */}
                <span className="text-xs font-medium text-slate-400 mt-2 font-mono">
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Footer */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5 pt-3 border-t border-slate-700/50">
        <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800">
          <span className="text-[11px] text-slate-400 block">Total 6-Mo Reports</span>
          <span className="text-base font-bold text-slate-100">{totalIncidents} incidents</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800">
          <span className="text-[11px] text-slate-400 block">Police Clearance Rate</span>
          <span className="text-base font-bold text-emerald-400">{clearanceRate}% resolved</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800 col-span-2 sm:col-span-1">
          <span className="text-[11px] text-slate-400 block">Trend Trajectory</span>
          <span className="text-base font-bold text-cyan-400">Stable / Controlled</span>
        </div>
      </div>
    </div>
  );
};
