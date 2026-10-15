import { INDIAN_CITIES } from '../shared/indianCities.ts';

// Pre-configured coordinates and baselines for popular destinations
export const DESTINATION_COORDS: Record<string, { lat: number; lng: number; country: string; defaultFrequency: number; defaultSeverity: number }> =
  Object.fromEntries(INDIAN_CITIES.map(({ name, lat, lng }) => [name.toLowerCase(), {
    lat,
    lng,
    country: 'India',
    defaultFrequency: name === 'Delhi' ? 68 : 45,
    defaultSeverity: name === 'Delhi' ? 62 : 40
  }]));

export function resolveLocationMetadata(locationName: string) {
  const norm = locationName.toLowerCase().trim();
  if (!norm) return null;
  for (const [key, val] of Object.entries(DESTINATION_COORDS)) {
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (new RegExp(`\\b${escapedKey}\\b`, 'i').test(norm)) {
      return { name: locationName, ...val };
    }
  }
  return null;
}

export const RISK_WEIGHTS = {
  // Expert-judgment weight; this value was not learned from data.
  crimeFrequency: 0.40,
  // Expert-judgment weight; this value was not learned from data.
  crimeSeverity: 0.35,
  // Expert-judgment weight; this value was not learned from data.
  night: 17.5,
  // Expert-judgment weight; this value was not learned from data.
  evening: 9.0,
  // Expert-judgment weight; this value was not learned from data.
  earlyMorning: 4.0,
  // Expert-judgment weight; this value was not learned from data.
  storm: 13.0,
  // Expert-judgment weight; this value was not learned from data.
  rain: 6.5,
  // Expert-judgment weight; this value was not learned from data.
  heat: 4.0,
  // Expert-judgment weight; this value was not learned from data.
  walkingNight: 10.0,
  // Expert-judgment weight; this value was not learned from data.
  walkingDay: 4.0,
  // Expert-judgment weight; this value was not learned from data.
  bikeTaxi: 6.5,
  // Expert-judgment weight; this value was not learned from data.
  rental: 5.0,
  // Expert-judgment weight; this value was not learned from data.
  licensedTransit: 1.0,
  // Expert-judgment weight; this value was not learned from data.
  solo: 4.0,
  // Expert-judgment weight; this value was not learned from data.
  friendsGroup: -2.0,
  // Expert-judgment weight; this value was not learned from data.
  family: 1.5,
  // Expert-judgment weight; this value was not learned from data.
  group: -1.5,
  // Expert-judgment weight; this value was not learned from data.
  recentIncident: 2.5,
  // Expert-judgment weight; this value was not learned from data.
  recentIncidentCap: 12.0
} as const;

export interface RiskInputFeatures {
  location: string;
  date?: string;
  time?: string;
  weather?: string;
  touristCategory?: string;
  crimeFrequency?: number;
  crimeSeverity?: number;
  crowdDensity?: string;
  recentIncidents?: number;
  /** Human-readable description of where the crime baseline came from (shown in the explanation). */
  baselineNote?: string;
  // Enhanced travel details
  startDate?: string;
  endDate?: string;
  travelWindow?: 'day' | 'night' | 'both';
  travelParty?: 'solo' | 'friends' | 'family' | 'group' | 'business';
  travellerCount?: number;
  travelPurpose?: 'tourism' | 'education' | 'business' | 'pilgrimage' | 'other';
  plannedTransport?: 'walking' | 'public_transport' | 'taxi' | 'bike_taxi' | 'rental' | 'private_vehicle';
  accommodationType?: string;
  approxBudget?: string;
  intendedPlaces?: string;
  accessibilityNeeds?: string;
}

export interface RiskPredictionResult {
  riskScore: number;
  rawScore: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  modelUsed: string;
  features?: Record<string, any>;
  factors: Array<{
    factor: string;
    impact: 'Low' | 'Moderate' | 'High';
    scoreContribution: number;
    explanation: string;
  }>;
  recommendations: string[];
  dayNightConsiderations: {
    dayAdvice: string;
    nightAdvice: string;
    dayRiskLevel: 'LOW' | 'MODERATE' | 'HIGH';
    nightRiskLevel: 'LOW' | 'MODERATE' | 'HIGH';
  };
  practicalPrecautions: string[];
  saferTransportSuggestions: string[];
  dataFreshnessDisclaimer: string;
  modelMetrics?: any;
}

function parseTimeOfDay(timeStr?: string): { hour: number; phase: 'day' | 'evening' | 'late_night' | 'early_morning' } {
  if (!timeStr) return { hour: 14, phase: 'day' };
  const parts = timeStr.split(':');
  // const hour = parseInt(parts[0], 10) || 14;
  const parsedHour = parseInt(parts[0], 10);
const hour = Number.isNaN(parsedHour) ? 14 : parsedHour;
  if (hour >= 6 && hour < 18) return { hour, phase: 'day' };
  if (hour >= 18 && hour < 22) return { hour, phase: 'evening' };
  if (hour >= 22 || hour < 4) return { hour, phase: 'late_night' };
  return { hour, phase: 'early_morning' };
}

/**
 * Explainable rule-based risk scoring using NCRB baselines and selected context factors.
 */
function evaluateRiskInternal(features: RiskInputFeatures, compareDayNight: boolean): RiskPredictionResult {
  const locMeta = resolveLocationMetadata(features.location);
  if (!locMeta) throw new Error('Location not found in our supported destinations');
  const crimeFreq = features.crimeFrequency ?? locMeta.defaultFrequency;
  const crimeSev = features.crimeSeverity ?? locMeta.defaultSeverity;
  const timeStr = features.time || '14:00';
  const { hour, phase: timePhase } = parseTimeOfDay(timeStr);
  const weather = (features.weather || 'Clear').toLowerCase();
  const touristCat = features.touristCategory || 'Solo Traveler';
  const crowdDensity = (features.crowdDensity || 'Moderate').toLowerCase();
  const recentIncidents = features.recentIncidents ?? 3;

  const travelWindow = features.travelWindow || 'day';
  const travelParty = features.travelParty || (touristCat === 'Solo Traveler' ? 'solo' : 'family');
  const travellerCount = features.travellerCount ?? (travelParty === 'solo' ? 1 : 2);
  const plannedTransport = features.plannedTransport || 'public_transport';
  const travelPurpose = features.travelPurpose || 'tourism';

  // Baseline score from historical crime statistics
  const baseScore = (crimeFreq * RISK_WEIGHTS.crimeFrequency) + (crimeSev * RISK_WEIGHTS.crimeSeverity);

  // 1. Time / Night Exposure Factor
  let timeWeight = 0;
  let timeDesc = 'Daytime window benefits from active pedestrian density and regular municipal policing.';
  let timeImpact: 'Low' | 'Moderate' | 'High' = 'Low';

  if (travelWindow === 'night' || timePhase === 'late_night') {
    timeWeight = RISK_WEIGHTS.night;
    timeDesc = 'Night-time transit (after 10 PM) carries significantly higher exposure due to shuttered commercial storefronts and reduced transit frequency.';
    timeImpact = 'High';
  } else if (travelWindow === 'both' || timePhase === 'evening') {
    timeWeight = RISK_WEIGHTS.evening;
    timeDesc = 'Mixed day-and-evening schedule warrants vigilance in transit hubs and market areas during dusk transitions.';
    timeImpact = 'Moderate';
  } else if (timePhase === 'early_morning') {
    timeWeight = RISK_WEIGHTS.earlyMorning;
    timeDesc = 'Early morning travel before peak transit traffic; keep to arterial roadways.';
    timeImpact = 'Low';
  }

  // 2. Weather Factor
  let weatherWeight = 0;
  let weatherDesc = 'Optimal clear weather conditions; normal mobility and active emergency services.';
  let weatherImpact: 'Low' | 'Moderate' | 'High' = 'Low';

  if (weather.includes('storm') || weather.includes('cyclone') || weather.includes('heavy rain')) {
    weatherWeight = RISK_WEIGHTS.storm;
    weatherDesc = 'Severe weather slows emergency dispatch, reduces street visibility, and increases transit bottlenecks.';
    weatherImpact = 'High';
  } else if (weather.includes('rain') || weather.includes('fog')) {
    weatherWeight = RISK_WEIGHTS.rain;
    weatherDesc = 'Precipitation or mist impairs driving visibility and creates slippery walkways.';
    weatherImpact = 'Moderate';
  } else if (weather.includes('heat')) {
    weatherWeight = RISK_WEIGHTS.heat;
    weatherDesc = 'High heat advisory; risk of dehydration and lower public presence during afternoon hours.';
    weatherImpact = 'Low';
  }

  // 3. Planned Transport Mode Factor
  let transportWeight = 0;
  let transportDesc = 'Standard transportation selected.';
  let transportImpact: 'Low' | 'Moderate' | 'High' = 'Low';

  if (plannedTransport === 'walking') {
    transportWeight = travelWindow === 'night' ? RISK_WEIGHTS.walkingNight : RISK_WEIGHTS.walkingDay;
    transportDesc = 'Pedestrian walking increases exposure to isolated shortcuts and opportunistic pickpocketing.';
    transportImpact = travelWindow === 'night' ? 'High' : 'Low';
  } else if (plannedTransport === 'bike_taxi') {
    transportWeight = RISK_WEIGHTS.bikeTaxi;
    transportDesc = 'Two-wheeler bike taxi requires helmet compliance and careful route selection on high-speed arterial corridors.';
    transportImpact = 'Moderate';
  } else if (plannedTransport === 'rental') {
    transportWeight = RISK_WEIGHTS.rental;
    transportDesc = 'Self-drive rental vehicle requires familiarity with local traffic patterns and secure paid parking.';
    transportImpact = 'Moderate';
  } else if (plannedTransport === 'taxi' || plannedTransport === 'public_transport') {
    transportWeight = RISK_WEIGHTS.licensedTransit;
    transportDesc = 'Licensed app-based cabs or metro transit offer verified driver tracking and CCTV-monitored terminals.';
    transportImpact = 'Low';
  }

  // 4. Group Composition Modifier
  let partyWeight = 0;
  if (travelParty === 'solo') partyWeight = RISK_WEIGHTS.solo;
  else if (travelParty === 'friends' && travellerCount >= 3) partyWeight = RISK_WEIGHTS.friendsGroup;
  else if (travelParty === 'family') partyWeight = RISK_WEIGHTS.family;
  else if (travelParty === 'group') partyWeight = RISK_WEIGHTS.group;

  // 5. Recent Incident Weight
  const incidentWeight = Math.min(RISK_WEIGHTS.recentIncidentCap, recentIncidents * RISK_WEIGHTS.recentIncident);
  const incidentImpact: 'Low' | 'Moderate' | 'High' = recentIncidents >= 5 ? 'High' : (recentIncidents >= 2 ? 'Moderate' : 'Low');

  // Composite raw score
  const rawScore = baseScore + timeWeight + weatherWeight + transportWeight + partyWeight + incidentWeight;
  const riskScore = Math.max(8, Math.min(94, Math.round(rawScore)));

  // Risk Level
  let riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
  if (riskScore >= 85) riskLevel = 'CRITICAL';
  else if (riskScore >= 75) riskLevel = 'HIGH';
  else if (riskScore >= 42) riskLevel = 'MODERATE';
  else riskLevel = 'LOW';

  // Crime impact
  const crimeImpact: 'Low' | 'Moderate' | 'High' = (crimeFreq + crimeSev) > 85 ? 'High' : ((crimeFreq + crimeSev) > 50 ? 'Moderate' : 'Low');

  const factors = [
    {
      factor: 'Crime History & Baseline',
      impact: crimeImpact,
      scoreContribution: baseScore,
      explanation: `Baseline from ${features.baselineNote || 'default estimates'}: crime frequency ${Math.round(crimeFreq)}/100 and severity ${Math.round(crimeSev)}/100 (percentile ranks, higher = more crime relative to peers).`
    },
    {
      factor: 'Time Window & Night Exposure',
      impact: timeImpact,
      scoreContribution: timeWeight,
      explanation: timeDesc
    },
    {
      factor: 'Transit Mode Vulnerability',
      impact: transportImpact,
      scoreContribution: transportWeight,
      explanation: transportDesc
    },
    {
      factor: 'Weather Conditions',
      impact: weatherImpact,
      scoreContribution: weatherWeight,
      explanation: weatherDesc
    },
    {
      factor: 'Group & Crowd Density',
      impact: incidentImpact,
      scoreContribution: partyWeight + incidentWeight,
      explanation: `Evaluated for ${travelParty} travel (${travellerCount} traveller${travellerCount > 1 ? 's' : ''}) with ${recentIncidents} recent sector reports.`
    }
  ];

  // Tailored Precautions
  const practicalPrecautions: string[] = [];
  if (travelParty === 'solo') {
    practicalPrecautions.push('Share your live GPS location with an emergency contact whenever taking evening transit.');
    practicalPrecautions.push('Keep copies of government photo ID in digital cloud storage and separate from your wallet.');
  } else if (travelParty === 'family') {
    practicalPrecautions.push('Agree on an easy-to-spot meeting landmark in crowded markets or heritage courtyards.');
    practicalPrecautions.push('Ensure medical insurance cards and pediatric emergency numbers are pinned on mobile home screens.');
  }

  if (plannedTransport === 'walking') {
    practicalPrecautions.push('Avoid unlit pedestrian shortcuts after sunset; use main commercial roads with active storefronts.');
  } else if (plannedTransport === 'bike_taxi') {
    practicalPrecautions.push('Ensure the two-wheeler driver provides a functional helmet and matches the app license plate.');
  }

  if (travelWindow === 'night' || travelWindow === 'both') {
    practicalPrecautions.push('Book app-based rides (Uber/Ola) from well-lit hotel lobbies or official pickup booths rather than hailing unmetered street cabs.');
  }

  practicalPrecautions.push('Save local police (112) and ambulance (108) in your emergency speed-dial.');

  // Compare identical inputs under fixed day and night contexts.
  const dayEvaluation = compareDayNight
    ? evaluateRiskInternal({ ...features, travelWindow: 'day', time: '14:00' }, false)
    : null;
  const nightEvaluation = compareDayNight
    ? evaluateRiskInternal({ ...features, travelWindow: 'night', time: '23:00' }, false)
    : null;
  const toDayNightLevel = (level: RiskPredictionResult['riskLevel']): 'LOW' | 'MODERATE' | 'HIGH' =>
    level === 'CRITICAL' ? 'HIGH' : level;

  const dayNightConsiderations = {
    dayAdvice: `Daytime travel in ${features.location} is well-suited for monument visits and market walks with standard personal awareness of pickpocketing in crowded queues.`,
    nightAdvice: `Evening and night transit requires pre-booked cabs, avoiding isolated alleys, and staying along illuminated primary transit corridors.`,
    dayRiskLevel: toDayNightLevel(dayEvaluation?.riskLevel ?? riskLevel),
    nightRiskLevel: toDayNightLevel(nightEvaluation?.riskLevel ?? riskLevel)
  };

  // Safer Transport Suggestions
  const saferTransportSuggestions = [
    'Prefer Metro rail networks or licensed app-based cabs (Uber/Ola) for inter-district travel.',
    'For night commutes, choose pre-paid airport or railway station taxi booths with computerized slips.',
    'Avoid unmetered three-wheelers in unfamiliar localities without establishing the fare beforehand.'
  ];

  return {
    riskScore,
    rawScore,
    riskLevel,
    modelUsed: 'Rule-based weighted risk model (NCRB 2022 baselines)',
    features: {
      location: features.location,
      travelWindow,
      travelParty,
      travellerCount,
      plannedTransport,
      travelPurpose,
      crimeFrequency: crimeFreq,
      crimeSeverity: crimeSev
    },
    factors,
    recommendations: practicalPrecautions.slice(0, 3),
    dayNightConsiderations,
    practicalPrecautions,
    saferTransportSuggestions,
    dataFreshnessDisclaimer: 'Advisory estimate based on NCRB 2022 crime baselines and the travel-context factors submitted for this prediction. No live crime feed is included; this is not a guarantee of individual safety.'
  };
}

export function evaluateRisk(features: RiskInputFeatures): RiskPredictionResult {
  return evaluateRiskInternal(features, true);
}

export async function computeRiskScore(features: RiskInputFeatures): Promise<RiskPredictionResult> {
  return evaluateRisk(features);
}

