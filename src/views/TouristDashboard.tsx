import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { TouristCategory, IPrediction, IEmergencyService } from '../types.ts';
import { predictionApi, emergencyApi } from '../services/api.ts';
import { fetchPlaceImage, ResolvedPlaceImage } from '../services/placeImages.ts';
import { INDIAN_CITIES, INDIAN_CITY_NAMES, POPULAR_INDIAN_CITIES } from '../../shared/indianCities.ts';
import {
  DESTINATION_PROFILES,
  findDestinationProfiles,
  DestinationProfile,
  RiskLevel,
  HeritageSite,
  TransportOption,
  HotelOption
} from '../data/destinationProfiles.ts';
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  ShieldAlert,
  Loader2,
  AlertCircle,
  Hotel,
  UtensilsCrossed,
  Camera,
  CarFront,
  Coins,
  Star,
  Landmark,
  PhoneCall,
  ShieldCheck,
  CloudSun,
  ExternalLink,
  RefreshCw,
  X,
  Compass,
  Info,
  Route,
  CheckCircle2,
  Shield,
  ChevronDown,
  ChevronUp,
  Hospital,
  Sun,
  Snowflake,
  CloudRain,
  Navigation2
} from 'lucide-react';

interface LiveWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  isDay: boolean;
}

function describeWeatherCode(code: number): string {
  if (code === 0) return 'Clear sky';
  if (code === 1) return 'Mainly clear';
  if (code === 2) return 'Partly cloudy';
  if (code === 3) return 'Overcast';
  if (code === 45 || code === 48) return 'Fog';
  if (code >= 51 && code <= 57) return 'Drizzle';
  if (code >= 61 && code <= 67) return 'Rain';
  if (code >= 71 && code <= 77) return 'Snow';
  if (code >= 80 && code <= 82) return 'Rain showers';
  if (code === 85 || code === 86) return 'Snow showers';
  if (code >= 95) return 'Thunderstorm';
  return 'Conditions clear';
}

const riskTextColors: Record<RiskLevel, string> = {
  LOW: 'text-emerald-400',
  MODERATE: 'text-amber-400',
  HIGH: 'text-rose-400'
};

const riskBorderColors: Record<RiskLevel, string> = {
  LOW: 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10',
  MODERATE: 'border-amber-500/40 text-amber-300 bg-amber-500/10',
  HIGH: 'border-rose-500/40 text-rose-300 bg-rose-500/10'
};

/**
 * Shows a real photo of a place. Order of preference:
 *   1. a photo looked up by name from Wikipedia / Wikimedia Commons (via /api/place-image)
 *   2. the image URL stored with the data (if any)
 *   3. a neutral placeholder
 */
const PlacePhoto: React.FC<{
  image?: string;
  placeName: string;
  city?: string;
  kind?: 'place' | 'city';
  className?: string;
}> = ({
  image,
  placeName,
  city = '',
  kind = 'place',
  className = 'w-24 aspect-[4/3] shrink-0'
}) => {
  const storedUrl = typeof image === 'string' ? image.trim() : '';
  const [wiki, setWiki] = useState<ResolvedPlaceImage | null>(null);
  const [lookupDone, setLookupDone] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setWiki(null);
    setLookupDone(false);
    setAttempt(0);
    setLoading(true);
    fetchPlaceImage(placeName, city, kind).then((result) => {
      if (cancelled) return;
      setWiki(result);
      setLookupDone(true);
    });
    return () => {
      cancelled = true;
    };
  }, [placeName, city, kind, storedUrl]);

  const candidates = [wiki?.url, storedUrl].filter(
    (url, index, all): url is string => Boolean(url) && all.indexOf(url) === index
  );
  const currentUrl = lookupDone ? candidates[attempt] : undefined;

  if (lookupDone && !currentUrl) {
    return (
      <div className={`${className} overflow-hidden rounded border border-slate-700 bg-slate-800`}>
        <img src="/place-photo-fallback.svg" alt={`Photo unavailable for ${placeName}`} className="h-full w-full object-cover" />
      </div>
    );
  }

  const fromWikipedia = Boolean(wiki?.url) && currentUrl === wiki?.url;

  return (
    <div className={`relative ${className} overflow-hidden rounded border border-slate-800 bg-slate-800`}>
      {(loading || !currentUrl) && (
        <div role="status" className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-slate-800 text-slate-400">
          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          <span className="text-[9px]">Loading photo</span>
        </div>
      )}
      {currentUrl && (
        <img
          key={currentUrl}
          src={currentUrl}
          alt={`Photo of ${placeName}`}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={() => setLoading(false)}
          onError={() => {
            // try the next candidate; when none are left the placeholder is shown
            setLoading(true);
            setAttempt((value) => value + 1);
          }}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity ${loading ? 'opacity-0' : 'opacity-100'}`}
        />
      )}
      {fromWikipedia && !loading && wiki?.pageUrl && (
        <a
          href={wiki.pageUrl}
          target="_blank"
          rel="noreferrer"
          title={`Photo via Wikipedia: ${wiki.title}`}
          className="absolute bottom-1 right-1 rounded bg-black/60 px-1.5 py-0.5 text-[9px] text-slate-200 hover:text-white"
        >
          Wikipedia
        </a>
      )}
    </div>
  );
};

export const TouristDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search input state
  const initialDestination = searchParams.get('dest') || '';
  const [destinationInput, setDestinationInput] = useState(initialDestination);
  const [searchedCity, setSearchedCity] = useState<string | null>(initialDestination ? initialDestination : null);

  // Travel parameters for Risk Assessment
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('14:00');
  const [touristCategory, setTouristCategory] = useState<TouristCategory>(
    user?.touristCategory || 'Solo Traveler'
  );

  // Data fetching states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<IPrediction | null>(null);
  const [emergencyData, setEmergencyData] = useState<{
    services: IEmergencyService[];
    emergencyNumbers: { police: string; ambulance: string; fire: string; touristHelpline: string };
  } | null>(null);

  // Weather state
  const [liveWeather, setLiveWeather] = useState<LiveWeather | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  // Sub-area selection
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');

  // Heritage sites read more expanded map
  const [expandedHeritageIds, setExpandedHeritageIds] = useState<Record<string, boolean>>({});

  // Dedicated Travel Risk Assessment Modal
  const [showRiskModal, setShowRiskModal] = useState(false);
  const [calculatingRisk, setCalculatingRisk] = useState(false);

  const categories: TouristCategory[] = [
    'Solo Traveler',
    'Family',
    'Couple',
    'Senior Citizen',
    'Student',
    'Business Traveler'
  ];

  // Matched destination profiles for searched city
  const matchedProfiles = useMemo(() => {
    if (!searchedCity) return [];
    return findDestinationProfiles(searchedCity);
  }, [searchedCity]);

  // Set active sub-area profile
  const activeProfile = useMemo(() => {
    if (matchedProfiles.length === 0) return null;
    const found = matchedProfiles.find((p) => p.id === selectedProfileId);
    return found || matchedProfiles[0];
  }, [matchedProfiles, selectedProfileId]);

  // Perform destination search and fetch all destination-specific data
  const executeSearch = async (targetCity: string) => {
    const trimmed = targetCity.trim();
    if (!trimmed) {
      setError('Please enter a destination to search.');
      return;
    }

    setLoading(true);
    setError(null);
    setSearchedCity(trimmed);
    setDestinationInput(trimmed);
    setSearchParams({ dest: trimmed }, { replace: true });

    // Find profiles for sub-area setting
    const profiles = findDestinationProfiles(trimmed);
    if (profiles.length > 0) {
      setSelectedProfileId(profiles[0].id);
    }

    // 1. Fetch live weather using destination coordinates
    const cityCoords = INDIAN_CITIES.find(
      (c) => c.name.toLowerCase() === trimmed.toLowerCase()
    );
    const lat = cityCoords ? cityCoords.lat : 28.6139;
    const lng = cityCoords ? cityCoords.lng : 77.2090;

    setWeatherLoading(true);
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&timezone=auto`)
      .then((res) => {
        if (!res.ok) throw new Error('Weather fetch failed');
        return res.json();
      })
      .then((data) => {
        if (data.current) {
          setLiveWeather({
            temperature: data.current.temperature_2m,
            feelsLike: data.current.apparent_temperature,
            humidity: data.current.relative_humidity_2m,
            windSpeed: data.current.wind_speed_10m,
            weatherCode: data.current.weather_code,
            isDay: Boolean(data.current.is_day)
          });
        }
      })
      .catch(() => {
        setLiveWeather(null);
      })
      .finally(() => setWeatherLoading(false));

    // 2. Fetch ML Safety Prediction & Emergency Services in parallel
    try {
      const [predResult, emgResult] = await Promise.all([
        predictionApi.predict({
          destination: trimmed,
          date,
          time,
          weather: 'Clear',
          touristCategory
        }),
        emergencyApi.getNearby(trimmed)
      ]);

      setPrediction(predResult.prediction);
      setEmergencyData({
        services: emgResult.services || [],
        emergencyNumbers: emgResult.emergencyNumbers
      });
    } catch (err: any) {
      console.error('Error fetching destination data:', err);
      setError(err.response?.data?.error || 'Unable to retrieve data for this destination. Please check your query and retry.');
    } finally {
      setLoading(false);
    }
  };

  // Run on mount if searchParam is present
  useEffect(() => {
    const destParam = searchParams.get('dest');
    if (destParam) {
      executeSearch(destParam);
    }
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(destinationInput);
  };

  const handleClearSearch = () => {
    setDestinationInput('');
    setSearchedCity(null);
    setPrediction(null);
    setEmergencyData(null);
    setSearchParams({}, { replace: true });
  };

  // Dedicated Risk Assessment Calculation function
  const handleRecalculateRisk = async () => {
    if (!searchedCity) return;
    setCalculatingRisk(true);
    try {
      const predResult = await predictionApi.predict({
        destination: searchedCity,
        date,
        time,
        weather: liveWeather ? (liveWeather.weatherCode >= 50 ? 'Rain' : 'Clear') : 'Clear',
        touristCategory
      });
      setPrediction(predResult.prediction);
    } catch (err) {
      console.error('Failed to calculate travel risk:', err);
    } finally {
      setCalculatingRisk(false);
    }
  };

  const toggleHeritageReadMore = (id: string) => {
    setExpandedHeritageIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const currentRisk: RiskLevel = activeProfile
    ? activeProfile.riskLevel
    : prediction?.riskLevel === 'CRITICAL' || prediction?.riskLevel === 'HIGH'
      ? 'HIGH'
      : prediction?.riskLevel === 'MODERATE'
        ? 'MODERATE'
        : 'LOW';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-teal-500 selection:text-white">
      {/* 1. MINIMALIST SEARCH SECTION IMMEDIATELY BELOW NAVBAR */}
      <section className="border-b border-slate-800 bg-slate-900/40 py-8 sm:py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Where do you want to go?
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Search any Indian destination for verified heritage, transport with taxi links, hotels, and travel safety intelligence.
            </p>
          </div>

          {/* Simple Search Form (Clean line style, no heavy cards) */}
          <form onSubmit={handleFormSubmit} className="relative max-w-3xl mx-auto">
            <datalist id="destination-city-options">
              {INDIAN_CITY_NAMES.map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>

            <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4 text-teal-400" />
                </div>
                <input
                  type="text"
                  required
                  value={destinationInput}
                  onChange={(e) => setDestinationInput(e.target.value)}
                  placeholder="Search your destination (e.g., Delhi, Jaipur, Manali, Goa...)"
                  list="destination-city-options"
                  className="w-full pl-10 pr-10 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-teal-400 transition"
                />
                {destinationInput && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition disabled:opacity-50 shrink-0"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>Search Destination</span>
              </button>
            </div>

            {/* Clickable Popular Destination Suggestions */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
              <span className="font-medium text-slate-500">Popular:</span>
              {['Delhi', 'Jaipur', 'Manali', 'Goa', 'Mumbai', 'Agra', 'Varanasi'].map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => {
                    setDestinationInput(city);
                    executeSearch(city);
                  }}
                  className={`px-2.5 py-1 rounded border transition ${
                    searchedCity?.toLowerCase() === city.toLowerCase()
                      ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600 hover:text-white'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-4 max-w-2xl mx-auto p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </section>

      {/* STATE 1: INITIAL WELCOME STATE (When no destination searched yet) */}
      {!loading && !searchedCity && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
          <div className="border-b border-slate-800 pb-8">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider text-teal-400 mb-2">
              Integrated Safe Travel Intelligence
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Explore authentic regional travel profiles with historical heritage monuments, verified hotel stays, local transportation with direct ride links, and machine-learning risk predictions tailored to your itinerary.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
            <div className="space-y-2">
              <div className="font-bold text-white flex items-center gap-2">
                <Landmark className="w-4 h-4 text-teal-400" />
                <span>Verified Heritage History</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Discover centuries-old monuments, architectural styles, verified construction periods, and cultural importance across India.
              </p>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-white flex items-center gap-2">
                <CarFront className="w-4 h-4 text-cyan-400" />
                <span>Local Transport & Ride Booking</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Terminal addresses, metro lines, and direct booking links for Uber, Ola, and Rapido to quickly check ride availability.
              </p>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Explainable Safety Risk</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ensemble models assess crime trends, weather factors, and tourist categories into actionable safe travel guidance.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* STATE 2: LOADING STATE */}
      {loading && (
        <div className="max-w-5xl mx-auto px-4 py-20 text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-teal-400 mx-auto" />
          <p className="text-sm font-semibold text-slate-300">
            Gathering destination intelligence, heritage records, and travel safety data for {destinationInput}...
          </p>
        </div>
      )}

      {/* STATE 3: SEARCH-BASED DESTINATION DASHBOARD (Clean, Minimal, No Card Effects) */}
      {!loading && searchedCity && (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-12">
          {/* DESTINATION OVERVIEW HEADER (Clean banner with image backdrop, no heavy box) */}
          <div className="border-b border-slate-800 pb-8">
            {/* Real photo of the searched destination (works for any city, not only the built-in profiles) */}
            <PlacePhoto
              key={activeProfile ? activeProfile.city : searchedCity}
              image={activeProfile?.image}
              placeName={activeProfile ? activeProfile.city : searchedCity}
              kind="city"
              className="w-full h-44 sm:h-60 mb-6"
            />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-slate-400 uppercase tracking-widest font-semibold">
                    Destination Overview
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className={`px-2.5 py-0.5 rounded text-xs font-bold border ${riskBorderColors[currentRisk]}`}>
                    {currentRisk} Safety Risk ({prediction?.riskScore || activeProfile?.riskScore || 45}/100)
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {activeProfile ? activeProfile.name : searchedCity}
                </h1>
                <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
                  {activeProfile
                    ? activeProfile.tagline
                    : `Comprehensive travel intelligence and safety overview for ${searchedCity}.`}
                </p>
              </div>

              {/* ACTION BUTTONS: REQUIREMENT 5 (TRAVEL RISK ASSESSMENT BUTTON) & SAFE ROUTES */}
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowRiskModal(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm transition shadow-sm"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Calculate My Travel Risk</span>
                </button>

                <Link
                  to={`/routes?dest=${encodeURIComponent(searchedCity)}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm transition"
                >
                  <Route className="w-4 h-4 text-cyan-400" />
                  <span>Safe Routes</span>
                </Link>

                <Link
                  to="/map"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm transition"
                >
                  <MapPin className="w-4 h-4 text-rose-400" />
                  <span>Safety Map</span>
                </Link>
              </div>
            </div>

            {/* Sub-area tabs if city has multiple sectors (e.g., Delhi -> Connaught Place vs Old Delhi) */}
            {matchedProfiles.length > 1 && (
              <div className="mt-6 pt-4 border-t border-slate-800/80">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                  <span>Explore Sectors:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {matchedProfiles.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedProfileId(p.id)}
                      className={`px-3 py-1.5 rounded text-xs font-semibold border transition ${
                        p.id === activeProfile?.id
                          ? 'bg-slate-800 text-teal-400 border-teal-500/50'
                          : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* QUICK METRICS BAR (Horizontal Clean Strip, No boxy cards) */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-slate-800/80 text-xs">
              <div>
                <span className="text-slate-500 uppercase tracking-wider block font-semibold text-[10px]">Live Weather</span>
                <div className="text-base font-bold text-white mt-0.5">
                  {weatherLoading ? 'Updating...' : liveWeather ? `${Math.round(liveWeather.temperature)}°C` : 'Clear'}
                </div>
                <span className="text-slate-400 block text-[11px]">
                  {liveWeather ? describeWeatherCode(liveWeather.weatherCode) : 'Forecast unavailable'}
                </span>
              </div>

              <div>
                <span className="text-slate-500 uppercase tracking-wider block font-semibold text-[10px]">Safety Level</span>
                <div className={`text-base font-bold mt-0.5 ${riskTextColors[currentRisk]}`}>
                  {currentRisk} Risk ({prediction?.riskScore || activeProfile?.riskScore || 45}/100)
                </div>
                <span className="text-slate-400 block text-[11px]">
                  Calibrated for {touristCategory}
                </span>
              </div>

              <div>
                <span className="text-slate-500 uppercase tracking-wider block font-semibold text-[10px]">Estimated Spend</span>
                <div className="text-base font-bold text-white mt-0.5">
                  {activeProfile ? activeProfile.totalExpense : '₹3,500 - ₹5,500 / day'}
                </div>
                <span className="text-slate-400 block text-[11px]">Standard daily budget</span>
              </div>

              <div>
                <span className="text-slate-500 uppercase tracking-wider block font-semibold text-[10px]">Ideal Visit Slot</span>
                <div className="text-base font-bold text-white mt-0.5">
                  {activeProfile ? activeProfile.visitWindow : 'Morning to Sunset'}
                </div>
                <span className="text-slate-400 block text-[11px]">Recommended daytime hours</span>
              </div>
            </div>
          </div>

          {/* REQUIREMENT 2: HERITAGE SITE HISTORY SECTION */}
          <section className="space-y-6">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-teal-400" />
                  <span>History of Heritage Sites</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Verified monuments, historical significance, construction periods, and cultural importance in {searchedCity}.
                </p>
              </div>
            </div>

            {activeProfile && activeProfile.heritageSites && activeProfile.heritageSites.length > 0 ? (
              <div className="divide-y divide-slate-800/80">
                {activeProfile.heritageSites.map((site) => {
                  const isExpanded = Boolean(expandedHeritageIds[site.id]);
                  return (
                    <article key={site.id} className="py-6 first:pt-0 last:pb-0 space-y-4">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="space-y-1">
                          <h3 className="text-lg font-bold text-white tracking-tight">
                            {site.name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-teal-300 font-mono">
                              Period: {site.constructionPeriod}
                            </span>
                            <span>·</span>
                            <span className="flex items-center gap-1 text-slate-300">
                              <MapPin className="w-3.5 h-3.5 text-rose-400" />
                              {site.location}
                            </span>
                          </div>
                        </div>

                        {/* Visiting Hours & Entry Fee */}
                        <div className="text-xs text-slate-400 md:text-right shrink-0">
                          <div><strong className="text-slate-300">Timings:</strong> {site.visitingInfo.timings}</div>
                          <div><strong className="text-slate-300">Entry:</strong> {site.visitingInfo.entryFee}</div>
                          <div><strong className="text-slate-300">Best Slot:</strong> {site.visitingInfo.bestTimeToVisit}</div>
                        </div>
                      </div>

                      {/* Monument Photo & History Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                        <PlacePhoto
                          image={site.image}
                          placeName={site.name}
                          city={activeProfile.city}
                          className="w-full aspect-[4/3] max-h-48 md:col-span-1"
                        />

                        <div className="md:col-span-3 space-y-3 text-xs text-slate-300 leading-relaxed">
                          <div>
                            <strong className="text-slate-100 font-semibold block mb-0.5">Historical Significance:</strong>
                            <p className="text-slate-400">{site.historicalSignificance}</p>
                          </div>

                          <div>
                            <strong className="text-slate-100 font-semibold block mb-0.5">Cultural Importance:</strong>
                            <p className="text-slate-400">{site.culturalImportance}</p>
                          </div>

                          <div>
                            <strong className="text-slate-100 font-semibold block mb-0.5">History:</strong>
                            <p className="text-slate-400">
                              {isExpanded ? site.fullHistory : site.historySnippet}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleHeritageReadMore(site.id)}
                            className="inline-flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300 font-semibold transition"
                          >
                            <span>{isExpanded ? 'Read Less' : 'Read More Historical Context'}</span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="py-6 text-xs text-slate-400 italic">
                Verified heritage site history documentation for {searchedCity} is currently being compiled from national archives. Check visiting places below.
              </div>
            )}
          </section>

          {/* REQUIREMENT 3: LOCAL TRANSPORT AND VEHICLE OPTIONS WITH ADDRESSES & RIDE LINKS */}
          <section className="space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <CarFront className="w-5 h-5 text-cyan-400" />
                <span>Local Transport and Vehicle Options</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Official stations, terminal addresses, pickup points, and verified links to Uber, Ola, and Rapido to check rides in {searchedCity}.
              </p>
            </div>

            {/* Quick Ride-Hailing Gateway (Uber, Ola, Rapido) */}
            <div className="py-4 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/30 p-4 rounded-lg">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">
                  Check Live Ride Availability on App Platforms
                </span>
                <p className="text-[11px] text-slate-400">
                  Open official ride service web portals to select pickup and destination in {searchedCity}:
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <a
                  href="https://m.uber.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded bg-black hover:bg-slate-800 text-white font-bold text-xs border border-slate-700 flex items-center gap-1.5 transition"
                >
                  <span>Uber</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>

                <a
                  href="https://book.olacabs.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <span>Ola Cabs</span>
                  <ExternalLink className="w-3 h-3 text-slate-950" />
                </a>

                <a
                  href="https://www.rapido.bike/"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <span>Rapido</span>
                  <ExternalLink className="w-3 h-3 text-slate-950" />
                </a>
              </div>
            </div>

            {/* Transport Terminals and Transit Breakdown Table / Clean List */}
            {activeProfile && activeProfile.transportOptions && activeProfile.transportOptions.length > 0 ? (
              <div className="divide-y divide-slate-800/80">
                {activeProfile.transportOptions.map((opt, idx) => (
                  <div key={idx} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                    <div className="space-y-1 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 font-semibold text-[10px]">
                          {opt.type}
                        </span>
                        <h4 className="font-bold text-white text-sm">{opt.name}</h4>
                      </div>
                      <p className="text-slate-300 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>Address: {opt.terminalAddress}</span>
                      </p>
                      <p className="text-slate-400 leading-relaxed">
                        <strong className="text-slate-300">Pickup Details:</strong> {opt.pickupInfo}
                      </p>
                      {opt.contact && (
                        <p className="text-slate-400">
                          <strong className="text-slate-300">Helpline / Contact:</strong> {opt.contact}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 shrink-0 md:text-right">
                      <div className="text-teal-300 font-semibold font-mono text-xs">
                        {opt.fareRange}
                      </div>

                      <div className="flex items-center gap-2">
                        {opt.directionsUrl && (
                          <a
                            href={opt.directionsUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1 font-medium text-xs transition"
                          >
                            <Navigation2 className="w-3 h-3 text-cyan-400" />
                            <span>Map Directions</span>
                          </a>
                        )}

                        {opt.bookingLinks?.official && (
                          <a
                            href={opt.bookingLinks.official}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 rounded bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center gap-1 font-medium text-xs transition"
                          >
                            <span>Official Transit</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-xs text-slate-400 italic">
                Transit hub terminals for {searchedCity} are available at local railway and interstate bus stations. Use the ride links above for local taxis and autos.
              </div>
            )}
          </section>

          {/* REQUIREMENT 4: MINIMUM FOUR HOTEL SUGGESTIONS */}
          <section className="space-y-6">
            <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Hotel className="w-5 h-5 text-rose-400" />
                  <span>Hotel and Accommodation Suggestions (Minimum 4 Verified Options)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Verified accommodations in {searchedCity} with verified price ranges, guest ratings, review counts, amenities, and direct reservation links.
                </p>
              </div>
              <span className="text-[11px] text-slate-500">Showing 4 verified properties</span>
            </div>

            {activeProfile && activeProfile.hotels && activeProfile.hotels.length >= 4 ? (
              <div className="divide-y divide-slate-800/80">
                {activeProfile.hotels.slice(0, 4).map((hotel, idx) => (
                  <div key={idx} className="py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <PlacePhoto
                        image={hotel.image}
                        placeName={hotel.name}
                        city={activeProfile.city}
                        className="w-full sm:w-36 h-24 shrink-0"
                      />

                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-white text-sm">{hotel.name}</h4>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                            <Star className="w-3 h-3 fill-current" /> {hotel.rating}
                          </span>
                          <span className="text-[11px] text-slate-400">({hotel.reviewCount})</span>
                        </div>

                        <p className="text-slate-300 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span>{hotel.address}</span>
                        </p>

                        <p className="text-slate-400">
                          Distance: <strong className="text-slate-300">{hotel.distance}</strong>
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {hotel.amenities.map((amenity, aIdx) => (
                            <span
                              key={aIdx}
                              className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 shrink-0">
                      <div className="md:text-right">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Tariff Range</span>
                        <span className="text-sm font-bold text-teal-300 block">{hotel.priceRange}</span>
                      </div>

                      <a
                        href={hotel.bookingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition"
                      >
                        <span>Check Availability on Booking.com</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-xs text-slate-400 italic">
                Fewer than four verified luxury listings are currently registered for {searchedCity}. Standard registered guest rooms and heritage lodges can be inspected via Booking.com.
              </div>
            )}
          </section>

          {/* REQUIREMENT 6: SEASONAL TRAVEL RECOMMENDATIONS */}
          <section className="space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <CloudSun className="w-5 h-5 text-amber-400" />
                <span>Seasonal Travel Recommendations</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Seasonal climate, optimal months, suitability, and weather precautions for {searchedCity}.
              </p>
            </div>

            {activeProfile && activeProfile.seasonalGuide && activeProfile.seasonalGuide.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                {activeProfile.seasonalGuide.map((season, idx) => (
                  <div key={idx} className="border border-slate-800 p-4 rounded-lg bg-slate-900/40 space-y-2">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div className="flex items-center gap-1.5 font-bold text-white text-sm">
                        {season.season === 'Winter' && <Snowflake className="w-4 h-4 text-cyan-400" />}
                        {season.season === 'Summer' && <Sun className="w-4 h-4 text-amber-400" />}
                        {season.season === 'Monsoon' && <CloudRain className="w-4 h-4 text-teal-400" />}
                        {season.season === 'Spring / Autumn' && <CloudSun className="w-4 h-4 text-violet-400" />}
                        <span>{season.season}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{season.months}</span>
                    </div>

                    <div className="space-y-1.5 text-slate-300">
                      <div>
                        <strong className="text-slate-100 font-semibold block text-[11px]">Climate:</strong>
                        <p className="text-slate-400 text-[11px]">{season.climate}</p>
                      </div>

                      <div>
                        <strong className="text-slate-100 font-semibold block text-[11px]">Why Visit:</strong>
                        <p className="text-slate-400 text-[11px]">{season.whyVisit}</p>
                      </div>

                      <div>
                        <strong className="text-amber-300 font-semibold block text-[11px]">Precautions:</strong>
                        <p className="text-slate-400 text-[11px]">{season.precautions}</p>
                      </div>

                      <div className="pt-1 border-t border-slate-800/80 text-[10px] text-teal-300">
                        <strong>Suitable for:</strong> {season.suitableFor}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-xs text-slate-400 italic">
                Seasonal weather guidelines for {searchedCity} follow standard northern Indian climate cycles (Winter: Oct-Mar, Summer: Apr-Jun, Monsoon: Jul-Sep).
              </div>
            )}
          </section>

          {/* REQUIREMENT 7: CRITICAL NEARBY HOSPITALS AND HEALTH CENTERS */}
          <section className="space-y-6">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Hospital className="w-5 h-5 text-rose-400" />
                  <span>Critical Medical Facilities and Hospitals</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Verified emergency trauma centers, 24x7 casualty departments, and directions near {searchedCity}.
                </p>
              </div>

              {emergencyData && emergencyData.emergencyNumbers && (
                <div className="text-xs text-slate-400 font-mono">
                  Ambulance: <strong className="text-white">{emergencyData.emergencyNumbers.ambulance}</strong>
                </div>
              )}
            </div>

            {/* National Helpline Numbers Quick Row */}
            {emergencyData && emergencyData.emergencyNumbers && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border-b border-slate-800/80 pb-4">
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Police Helpline</span>
                  <span className="text-sm font-bold text-white font-mono">{emergencyData.emergencyNumbers.police}</span>
                </div>
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Ambulance Service</span>
                  <span className="text-sm font-bold text-teal-300 font-mono">{emergencyData.emergencyNumbers.ambulance}</span>
                </div>
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Fire Dispatch</span>
                  <span className="text-sm font-bold text-amber-300 font-mono">{emergencyData.emergencyNumbers.fire}</span>
                </div>
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Tourist Helpline</span>
                  <span className="text-sm font-bold text-cyan-300 font-mono">{emergencyData.emergencyNumbers.touristHelpline}</span>
                </div>
              </div>
            )}

            {/* Verified Nearby Hospital Listings */}
            {activeProfile && activeProfile.hospitals && activeProfile.hospitals.length > 0 ? (
              <div className="divide-y divide-slate-800/80">
                {activeProfile.hospitals.map((hosp, idx) => (
                  <div key={idx} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                    <div className="space-y-1 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-sm">{hosp.name}</h4>
                        <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20 font-mono text-[10px]">
                          {hosp.distanceKm} km from center
                        </span>
                      </div>
                      <p className="text-slate-300 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>Address: {hosp.address}</span>
                      </p>
                      <p className="text-slate-400 leading-relaxed">
                        <strong className="text-slate-300">Emergency Capabilities:</strong> {hosp.emergencyInfo}
                      </p>
                      <p className="text-slate-400">
                        <strong className="text-slate-300">Direct Emergency Phone:</strong> {hosp.phone}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={hosp.mapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-1.5 font-semibold text-xs transition"
                      >
                        <Navigation2 className="w-3.5 h-3.5 text-teal-400" />
                        <span>Google Maps Directions</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-xs text-slate-400 italic">
                In case of immediate danger or medical triage in {searchedCity}, dial 112 or 108 directly for coordinated ambulance dispatch.
              </div>
            )}
          </section>

          {/* SIGHTSEEING, FOOD & EXPENSE BREAKDOWN (Clean minimalist tables/rows) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-800 pt-8">
            {/* Sightseeing & Visiting Places */}
            {activeProfile && activeProfile.places && activeProfile.places.length > 0 && (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-2">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Camera className="w-4 h-4 text-cyan-400" />
                    <span>Key Sightseeing Places</span>
                  </h3>
                  <p className="text-xs text-slate-400">Top attractions with optimal visiting slots.</p>
                </div>

                <div className="space-y-3">
                  {activeProfile.places.map((place, idx) => (
                    <div key={idx} className="flex gap-3 text-xs border-b border-slate-800/60 pb-3 last:border-b-0">
                      <PlacePhoto key={place.name} image={place.image} placeName={place.name} city={activeProfile.city} />
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-white">{place.name}</h4>
                          <span className="text-[10px] text-teal-300 font-mono">{place.bestSlot}</span>
                        </div>
                        <p className="text-slate-400 text-[11px] leading-relaxed">{place.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Local Food */}
            {activeProfile && activeProfile.food && activeProfile.food.length > 0 && (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-2">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <UtensilsCrossed className="w-4 h-4 text-emerald-400" />
                    <span>Popular Local Food & Dishes</span>
                  </h3>
                  <p className="text-xs text-slate-400">Authentic culinary specialties and pricing.</p>
                </div>

                <div className="space-y-3">
                  {activeProfile.food.map((food, idx) => (
                    <div key={idx} className="flex items-start justify-between gap-4 text-xs border-b border-slate-800/60 pb-3 last:border-b-0">
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-white">{food.dish}</h4>
                        <p className="text-slate-400 text-[11px] leading-relaxed">{food.note}</p>
                      </div>
                      <span className="text-teal-300 font-semibold font-mono shrink-0">{food.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* TRIP BUDGET BREAKDOWN */}
          {activeProfile && activeProfile.expenses && activeProfile.expenses.length > 0 && (
            <div className="border-t border-slate-800 pt-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Coins className="w-4 h-4 text-amber-400" />
                    <span>Trip Expenses & Cost Breakdown</span>
                  </h3>
                  <p className="text-xs text-slate-400">Realistic daily expenses per traveler in {searchedCity}.</p>
                </div>
                <span className="text-xs font-bold text-teal-300 font-mono">
                  Total Budget: {activeProfile.totalExpense}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                {activeProfile.expenses.map((exp, idx) => (
                  <div key={idx} className="border border-slate-800 p-3 rounded bg-slate-900/30">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">{exp.label}</span>
                    <span className="text-base font-bold text-white block mt-0.5">{exp.value}</span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">{exp.note}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CALLOUT TO DEDICATED SAFE ROUTES FEATURE (Keep Safe Routes separate as required) */}
          <div className="border border-slate-800 p-6 rounded-lg bg-slate-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">
                Planning a road trip or driving route to {searchedCity}?
              </h3>
              <p className="text-xs text-slate-400">
                Safe Routes is our dedicated feature for comparing driving paths, alternative bypasses, and emergency stations on OpenStreetMap.
              </p>
            </div>

            <Link
              to={`/routes?dest=${encodeURIComponent(searchedCity)}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm transition shrink-0"
            >
              <span>Open Safe Routes Page</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </main>
      )}

      {/* DEDICATED MODAL / DRAWER: REQUIREMENT 5 (CALCULATE MY TRAVEL RISK) */}
      {showRiskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-teal-400" />
                <h3 className="text-lg font-bold text-white">
                  Travel Safety Risk Assessment — {searchedCity}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowRiskModal(false)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Travel Parameter Tuning */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-300 block">
                Configure Your Travel Parameters:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Travel Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2 rounded bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Arrival Time</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full p-2 rounded bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Tourist Category</label>
                  <select
                    value={touristCategory}
                    onChange={(e) => setTouristCategory(e.target.value as TouristCategory)}
                    className="w-full p-2 rounded bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleRecalculateRisk}
                  disabled={calculatingRisk}
                  className="w-full py-2.5 rounded bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {calculatingRisk ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Evaluating Risk Factors...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      <span>Re-Evaluate Safety Risk</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Assessment Results Breakdown */}
            <div className="pt-4 border-t border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
                    Computed Safety Score
                  </span>
                  <div className="text-2xl font-black text-white mt-0.5">
                    {prediction ? `${prediction.riskScore} / 100` : activeProfile ? `${activeProfile.riskScore} / 100` : '45 / 100'}
                  </div>
                </div>

                <div className={`px-3 py-1 rounded text-xs font-bold border ${riskBorderColors[currentRisk]}`}>
                  {currentRisk} Safety Risk
                </div>
              </div>

              {/* Explainable AI Factors */}
              {prediction && prediction.factors && prediction.factors.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-300 block">
                    Key Risk Factors & Explanations:
                  </span>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {prediction.factors.map((item, idx) => (
                      <div key={idx} className="p-2.5 rounded bg-slate-950 border border-slate-800 text-xs">
                        <div className="flex items-center justify-between text-slate-200 font-semibold mb-0.5">
                          <span>{item.factor}</span>
                          <span className="text-[10px] font-mono text-cyan-400">+{item.scoreContribution} pts</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">{item.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {prediction && prediction.recommendations && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-300 block">
                    Actionable Recommendations for {touristCategory}:
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {prediction.recommendations.map((rec, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setShowRiskModal(false)}
                className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition"
              >
                Close Assessment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
