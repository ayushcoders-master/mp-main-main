import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { routeApi } from '../services/api.ts';
import { IRouteComparison } from '../types.ts';
import { SafetyMap } from '../components/SafetyMap.tsx';
import { INDIAN_CITY_NAMES } from '../../shared/indianCities.ts';
import {
  Route,
  Navigation,
  MapPin,
  Sparkles,
  AlertTriangle,
  Info,
  Loader2
} from 'lucide-react';

export const SaferRoutesView: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [startPoint, setStartPoint] = useState(searchParams.get('start') || '');
  const [destination, setDestination] = useState(searchParams.get('dest') || 'Delhi');
  const [loading, setLoading] = useState(false);
  const [comparison, setComparison] = useState<IRouteComparison | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const calculateRoutes = async (start: string, dest: string) => {
    if (!dest.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await routeApi.getSafeRoute({
        startPoint: start.trim(),
        destination: dest.trim(),
        travelMode: 'Driving / Cab'
      });
      setComparison(data);
      setSelectedRouteId(data.routes[0]?.id || '');
    } catch (e: any) {
      setError(e.response?.data?.error || 'Could not calculate road routes. Please check the addresses and retry.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateRoutes(startPoint, destination);
  };

  const selectedRoute = comparison?.routes.find((r) => r.id === selectedRouteId) || comparison?.routes[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Route className="w-5 h-5" />
          </div>
          <span>Safer Route Planner</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Enter a starting point and destination to compare driving routes on the map.
        </p>
      </div>

      <div className="bg-slate-800/90 rounded-3xl p-6 border border-slate-700/80 shadow-xl">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <datalist id="indian-city-suggestions">
            {INDIAN_CITY_NAMES.map((city) => <option key={city} value={city} />)}
          </datalist>
          <div className="md:col-span-5">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Starting address or landmark *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Navigation className="w-4 h-4 text-cyan-400" />
              </div>
              <input
                type="text"
                required
                value={startPoint}
                onChange={(e) => setStartPoint(e.target.value)}
                list="indian-city-suggestions"
                maxLength={200}
                placeholder="e.g. Ghaziabad Railway Station, Ghaziabad"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div className="md:col-span-5">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Destination address, landmark, or city *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <MapPin className="w-4 h-4 text-teal-400" />
              </div>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                list="indian-city-suggestions"
                maxLength={200}
                placeholder="e.g. Connaught Place, Delhi"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-md shadow-teal-500/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Computing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Find Routes</span>
                </>
              )}
            </button>
          </div>
        </form>
        <p className="mt-4 text-[11px] text-slate-500">
          Driving routes are geocoded and routed using public OpenStreetMap services. Enter precise addresses for precise endpoints.
          <a className="ml-1 font-semibold underline" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap attribution</a>
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {comparison && (
        <div className="space-y-8">
          <div className="flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{comparison.safetyDisclaimer} Travel times are routing estimates and do not include live traffic.</p>
          </div>

          <div className="bg-slate-800/90 rounded-3xl p-6 border border-slate-700/80 shadow-xl overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-700/60">
              <div>
                <h3 className="text-base font-bold text-white">Available Driving Routes</h3>
                <p className="text-xs text-slate-400">
                  Distance and estimated duration come from {comparison.dataSource}.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-teal-800 px-3 py-1 rounded-full bg-teal-100 border border-teal-300 self-start sm:self-auto">
                {comparison.routes.length} route option{comparison.routes.length === 1 ? '' : 's'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Route Name</th>
                    <th className="py-3 px-4">Main Roads</th>
                    <th className="py-3 px-4 text-right">Distance</th>
                    <th className="py-3 px-4 text-right">Est. Time</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {comparison.routes.map((r) => {
                    const isSelected = r.id === selectedRouteId;
                    return (
                      <tr
                        key={r.id}
                        className={`transition-colors cursor-pointer ${isSelected ? 'bg-teal-50' : 'hover:bg-slate-700/20'}`}
                        onClick={() => setSelectedRouteId(r.id)}
                      >
                        <td className="py-3.5 px-4 font-semibold text-slate-200">
                          <div className="flex items-center gap-2">
                            <span>{r.name}</span>
                            {isSelected && <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-200 text-teal-900 font-bold">Selected</span>}
                          </div>
                          <span className="text-[11px] text-slate-400 block mt-0.5">{r.tag}</span>
                        </td>
                        <td className="max-w-sm px-4 py-3.5 text-slate-300" title={r.roadNames.join(', ')}>
                          <span className="line-clamp-2">{r.roadNames.length ? r.roadNames.join(' → ') : 'Street names unavailable'}</span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-slate-300">{r.distanceKm} km</td>
                        <td className="py-3.5 px-4 text-right font-mono text-slate-300">{r.durationMinutes} min</td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRouteId(r.id);
                            }}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                              isSelected ? 'bg-teal-500 text-slate-950' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                            }`}
                          >
                            {isSelected ? 'Selected' : 'Show'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8">
              <SafetyMap
                center={[comparison.mapCenter.lat, comparison.mapCenter.lng]}
                zoom={12}
                locationName={comparison.destination}
                routes={comparison.routes}
                selectedRouteId={selectedRouteId}
                onSelectRoute={(id) => setSelectedRouteId(id)}
                showLocationMarker={false}
                showSafeZones={false}
                className="h-[520px]"
              />
            </div>

            <div className="lg:col-span-4 space-y-4">
              {selectedRoute && (
                <div className="bg-slate-800/90 rounded-3xl p-6 border border-slate-700/80 shadow-xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Selected Route Profile</span>
                  </div>

                  <h4 className="text-base font-bold text-white">{selectedRoute.name}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Road-network route from {comparison.startPoint} to {comparison.destination}.
                  </p>

                  <div className="space-y-2.5 pt-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/50">
                      <span className="text-[11px] text-slate-400 block mb-0.5">Distance:</span>
                      <strong className="text-slate-200">{selectedRoute.distanceKm} km</strong>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/50">
                      <span className="text-[11px] text-slate-400 block mb-0.5">Estimated driving time:</span>
                      <strong className="text-slate-200">{selectedRoute.durationMinutes} min · not live traffic</strong>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/50">
                      <span className="text-[11px] text-slate-400 block mb-0.5">Road names:</span>
                      <strong className="text-slate-200">{selectedRoute.roadNames.length ? selectedRoute.roadNames.join(' → ') : 'Street names unavailable'}</strong>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                    <Info className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>Use local judgement. This route data does not include verified crime, lighting, or patrol coverage.</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
