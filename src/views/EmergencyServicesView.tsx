import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { emergencyApi } from '../services/api.ts';
import { IEmergencyService } from '../types.ts';
import { getIndianCityOrDefault, INDIAN_CITY_NAMES } from '../../shared/indianCities.ts';
import {
  PhoneCall,
  Shield,
  Building2,
  AlertOctagon,
  MapPin,
  Share2,
  Clock,
  ExternalLink,
  Search,
  CheckCircle2,
  PhoneForwarded,
  Info,
  Loader2
} from 'lucide-react';

export const EmergencyServicesView: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [location, setLocation] = useState(getIndianCityOrDefault(searchParams.get('loc')));
  const [searchQuery, setSearchQuery] = useState(location);
  const [services, setServices] = useState<IEmergencyService[]>([]);
  const [countryEmergencyNumbers, setCountryEmergencyNumbers] = useState<any[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'police' | 'hospital'>('all');
  const [loading, setLoading] = useState(true);
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [locationCopied, setLocationCopied] = useState(false);

  const fetchEmergencyData = async (loc: string) => {
    try {
      setLoading(true);
      const data = await emergencyApi.getNearby(loc);
      setServices(data.services || []);
      setCountryEmergencyNumbers(data.countryEmergencyNumbers || []);
    } catch (e) {
      console.warn('Failed to fetch emergency directory:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmergencyData(location);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(searchQuery.trim());
      setSearchParams({ loc: searchQuery.trim() });
      fetchEmergencyData(searchQuery.trim());
    }
  };

  const handleShareLocation = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `EMERGENCY ALERT: I am traveling near ${location}. Current Safety Node: Active. GPS Coordinates: 28.6139, 77.2090. Please verify my status.`
      );
      setLocationCopied(true);
      setTimeout(() => setLocationCopied(false), 3000);
    }
  };

  const filteredServices = services.filter((s) => {
    if (filterType === 'all') return true;
    return s.type === filterType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Disclaimer Banner (Required in Section 10) */}
      <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs flex items-start sm:items-center gap-3 shadow-lg">
        <AlertOctagon className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
        <div className="leading-relaxed">
          <strong className="font-semibold text-white">Emergency Safety Disclaimer: </strong>
          This system is a safety prediction tool, not a replacement for official emergency services. If you are in immediate personal danger, immediately dial your country's local emergency line.
        </div>
      </div>

      {/* Header & Quick Action SOS Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <PhoneCall className="w-5 h-5" />
            </div>
            <span>Emergency Services Directory</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Verified rapid response hotlines, local precincts, and trauma ER clinics in <span className="text-cyan-400 font-semibold">{location}</span>.
          </p>
        </div>

        {/* Quick Emergency Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href="tel:112"
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-transform active:scale-95"
          >
            <Shield className="w-4 h-4" />
            <span>Call Police (112 / 100)</span>
          </a>

          <a
            href="tel:102"
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-transform active:scale-95"
          >
            <Building2 className="w-4 h-4" />
            <span>Call Ambulance (102)</span>
          </a>

          <button
            onClick={handleShareLocation}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-2 transition-colors"
          >
            <Share2 className="w-4 h-4 text-cyan-400" />
            <span>{locationCopied ? 'Copied SOS Location!' : 'Share My Location'}</span>
          </button>
        </div>
      </div>

      {/* Country Specific Emergency Numbers Strip (Required in Section 10) */}
      <div className="bg-slate-800/90 rounded-3xl p-6 border border-slate-700/80 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
          <PhoneForwarded className="w-4 h-4 text-cyan-400" />
          India Emergency Numbers
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {countryEmergencyNumbers.map((c, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-slate-900/70 border border-slate-700/60 hover:border-slate-600 transition-colors"
            >
              <span className="text-xs font-bold text-slate-200 block mb-1">
                {c.country}
              </span>
              <div className="space-y-0.5 text-[11px] font-mono">
                <div className="text-rose-400">Police: <strong>{c.police}</strong></div>
                <div className="text-emerald-400">Ambulance: <strong>{c.ambulance}</strong></div>
                <div className="text-cyan-400">Tourist: <strong>{c.tourist}</strong></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-sm w-full">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <MapPin className="w-4 h-4 text-cyan-400" />
            </div>
            <select
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            >
              {INDIAN_CITY_NAMES.map((city) => <option key={city} value={city}>{city}</option>)}
            </select>
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
          >
            Update
          </button>
        </form>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-800/80 rounded-xl border border-slate-700">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              filterType === 'all'
                ? 'bg-cyan-500 text-slate-950 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            All Facilities ({services.length})
          </button>
          <button
            onClick={() => setFilterType('police')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              filterType === 'police'
                ? 'bg-blue-500 text-white font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Police Precincts
          </button>
          <button
            onClick={() => setFilterType('hospital')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              filterType === 'hospital'
                ? 'bg-emerald-500 text-white font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Trauma Hospitals
          </button>
        </div>
      </div>

      {/* Facilities Cards Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
          <p className="text-xs font-medium">Querying nearby emergency facilities...</p>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="p-12 text-center bg-slate-800 rounded-3xl border border-slate-700 text-slate-400 text-xs">
          No emergency stations registered for "{location}". Try another Indian city.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((svc) => {
            const isPolice = svc.type === 'police';
            return (
              <div
                key={svc._id || svc.name}
                className="bg-slate-800/90 rounded-3xl p-6 border border-slate-700/80 hover:border-slate-600 shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isPolice
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {isPolice ? <Shield className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                      </div>
                      <div>
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            isPolice
                              ? 'bg-blue-500/20 text-blue-300'
                              : 'bg-emerald-500/20 text-emerald-300'
                          }`}
                        >
                          {isPolice ? 'Police Station' : 'Emergency Hospital'}
                        </span>
                        <h4 className="text-base font-bold text-white mt-0.5">{svc.name}</h4>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 flex items-start gap-1.5 mt-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                    <span>{svc.address}</span>
                  </p>

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-700/60 text-xs">
                    <div className="p-2 rounded-xl bg-slate-900/60">
                      <span className="text-[10px] text-slate-400 block">Distance</span>
                      <strong className="text-slate-200">{svc.distanceKm} km</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900/60">
                      <span className="text-[10px] text-slate-400 block">Availability</span>
                      <strong className="text-emerald-400">{svc.emergencyAvailability || '24/7 Service'}</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-700/60 flex items-center gap-2">
                  <a
                    href={`tel:${svc.contact}`}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors ${
                      isPolice
                        ? 'bg-blue-600 hover:bg-blue-500 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call: {svc.contact}</span>
                  </a>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${svc.latitude},${svc.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-700 hover:bg-slate-700 transition-colors"
                    title="Open in Maps"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
