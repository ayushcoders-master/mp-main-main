import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SafetyMap } from '../components/SafetyMap.tsx';
import { emergencyApi, crimeApi } from '../services/api.ts';
import { IEmergencyService, ICrimeData } from '../types.ts';
import { getIndianCityOrDefault, INDIAN_CITIES, INDIAN_CITY_NAMES, POPULAR_INDIAN_CITIES } from '../../shared/indianCities.ts';
import {
  MapPin,
  Shield,
  Cross,
  AlertTriangle,
  Search,
  Layers,
  Compass,
  Building2,
  PhoneCall,
  Loader2
} from 'lucide-react';

export const SafetyMapView: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [destination, setDestination] = useState(getIndianCityOrDefault(searchParams.get('dest')));
  const [activeSearch, setActiveSearch] = useState(destination);
  const [coordinates, setCoordinates] = useState<[number, number]>([28.6139, 77.2090]);
  const [emergencyServices, setEmergencyServices] = useState<IEmergencyService[]>([]);
  const [crimeData, setCrimeData] = useState<ICrimeData[]>([]);
  const [loading, setLoading] = useState(true);

  // Common quick destinations
  const presetCities = Object.fromEntries(
    INDIAN_CITIES.map(({ name, lat, lng }) => [name, [lat, lng] as [number, number]])
  );

  const loadMapData = async (loc: string) => {
    try {
      setLoading(true);
      const [emgRes, crimeRes] = await Promise.all([
        emergencyApi.getNearby(loc),
        crimeApi.getAll(loc)
      ]);

      setEmergencyServices(emgRes.services);
      setCrimeData(crimeRes.crimeData);
      if (emgRes.coordinates) {
        setCoordinates([emgRes.coordinates.lat, emgRes.coordinates.lng]);
      } else if (presetCities[loc]) {
        setCoordinates(presetCities[loc]);
      }
    } catch (e) {
      console.warn('Error fetching map data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMapData(destination);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeSearch.trim()) {
      setDestination(activeSearch.trim());
      setSearchParams({ dest: activeSearch.trim() });
      loadMapData(activeSearch.trim());
    }
  };

  const handleQuickSelect = (city: string) => {
    setActiveSearch(city);
    setDestination(city);
    setSearchParams({ dest: city });
    loadMapData(city);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Compass className="w-5 h-5" />
            </div>
            <span>Interactive Safety Map</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time geospatial visualization of crime incidents, police outposts, and emergency trauma clinics.
          </p>
        </div>

        {/* Search input */}
        <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-md w-full">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <MapPin className="w-4 h-4 text-cyan-400" />
            </div>
            <select
              value={activeSearch}
              onChange={(e) => setActiveSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            >
              {INDIAN_CITY_NAMES.map((city) => <option key={city} value={city}>{city}</option>)}
            </select>
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>
        </form>
      </div>

      {/* Quick destination chips */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-slate-400 font-medium mr-1">Locations:</span>
        {POPULAR_INDIAN_CITIES.map((city) => (
          <button
            key={city}
            type="button"
            onClick={() => handleQuickSelect(city)}
            className={`px-3 py-1 rounded-lg font-medium border transition-colors ${
              destination.toLowerCase() === city.toLowerCase()
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      {/* Map Element */}
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 z-20 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center rounded-2xl">
            <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-xl border border-slate-700 text-xs text-cyan-300">
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
              <span>Updating destination markers...</span>
            </div>
          </div>
        )}

        <SafetyMap
          center={coordinates}
          zoom={13}
          locationName={destination}
          emergencyServices={emergencyServices}
          crimeData={crimeData}
          className="h-[600px]"
        />
      </div>

      {/* Map Legend & Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
              Police & Tourist Patrols
            </span>
            <span className="text-sm font-bold text-slate-100">
              {emergencyServices.filter((s) => s.type === 'police').length} Precincts in Range
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
              Medical Trauma Centers
            </span>
            <span className="text-sm font-bold text-slate-100">
              {emergencyServices.filter((s) => s.type === 'hospital').length} 24/7 ER Facilities
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
              Documented Crime Hotspots
            </span>
            <span className="text-sm font-bold text-rose-300">
              {crimeData.length} Incident Clusters Marked
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
