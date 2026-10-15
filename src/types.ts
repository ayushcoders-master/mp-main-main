import type { FeedbackCategory, FeedbackStatus } from '../shared/feedback.js';

export type { FeedbackCategory, FeedbackStatus } from '../shared/feedback.js';

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type TouristCategory =
  | 'Solo Traveler'
  | 'Family'
  | 'Couple'
  | 'Senior Citizen'
  | 'Student'
  | 'Business Traveler';

export interface IUser {
  id: string;
  name: string;
  email: string;
  touristCategory: TouristCategory;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface IPredictionFactor {
  factor: string;
  impact: 'Low' | 'Moderate' | 'High';
  scoreContribution: number;
  explanation: string;
}

export interface IDayNightConsiderations {
  dayAdvice: string;
  nightAdvice: string;
  dayRiskLevel: 'LOW' | 'MODERATE' | 'HIGH';
  nightRiskLevel: 'LOW' | 'MODERATE' | 'HIGH';
}

export interface IPrediction {
  _id: string;
  userId?: string;
  userName?: string;
  location: string;
  latitude: number;
  longitude: number;
  date: string;
  time: string;
  weather: string;
  touristCategory: string;
  riskScore: number;
  riskLevel: RiskLevel;
  factors: IPredictionFactor[];
  recommendations: string[];
  dayNightConsiderations?: IDayNightConsiderations;
  practicalPrecautions?: string[];
  saferTransportSuggestions?: string[];
  dataFreshnessDisclaimer?: string;
  createdAt: string;
}

export interface ITravelDetailsForm {
  destination: string;
  intendedPlaces: string;
  startDate: string;
  endDate: string;
  travelWindow: 'day' | 'night' | 'both';
  travelParty: 'solo' | 'friends' | 'family' | 'group' | 'business';
  travellerCount: number;
  travellerCategory: 'student' | 'working_professional' | 'businessperson' | 'family_traveller' | 'senior' | 'other';
  travelPurpose: 'tourism' | 'education' | 'business' | 'pilgrimage' | 'other';
  plannedTransport: 'walking' | 'public_transport' | 'taxi' | 'bike_taxi' | 'rental' | 'private_vehicle';
  accommodationType: 'hostel' | 'budget_hotel' | 'luxury_resort' | 'homestay' | 'other';
  approxBudget: string;
  plannedItinerary?: string;
  accessibilityNeeds?: string;
  emergencyContact?: string;
}

export interface IReview {
  _id: string;
  destination: string;
  targetType: 'heritage' | 'hotel' | 'destination';
  targetName: string;
  authorName: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  verified?: boolean;
}

export interface IFeedback {
  _id: string;
  userId: string;
  rating: number;
  category: FeedbackCategory;
  message: string;
  status: FeedbackStatus;
  createdAt: string;
  updatedAt: string;
}

export interface IAdminFeedback extends IFeedback {
  user: { name: string; email: string };
}

export interface IFeedbackStats {
  total: number;
  newCount: number;
  averageRating: number;
  byCategory: Array<{ category: string; count: number }>;
}

export interface ICrimeData {
  _id: string;
  city?: string;
  location: string;
  locationName?: string;
  latitude: number;
  longitude: number;
  crimeType: string;
  severity: number;
  date: string;
  time: string;
  description: string;
}

export interface IEmergencyService {
  _id: string;
  name: string;
  type: 'police' | 'hospital' | 'fire_station' | 'tourist_help';
  location: string;
  latitude: number;
  longitude: number;
  contact: string;
  address: string;
  distanceKm?: number;
  emergencyAvailability?: string;
}

export interface IRouteAlternative {
  id: string;
  name: string;
  distanceKm: number;
  durationMinutes: number;
  tag: string;
  roadNames: string[];
  waypoints: [number, number][];
}

export interface IRouteComparison {
  startPoint: string;
  destination: string;
  travelMode: string;
  routes: IRouteAlternative[];
  mapCenter: { lat: number; lng: number };
  startCoords: { lat: number; lng: number };
  destCoords: { lat: number; lng: number };
  dataSource: string;
  safetyDisclaimer: string;
}

export interface IAdminStats {
  totalUsers: number;
  totalPredictions: number;
  highRiskPredictions: number;
  totalCrimeIncidents: number;
  mostSearchedLocations: Array<{ location: string; count: number }>;
  riskDistribution: {
    LOW: number;
    MODERATE: number;
    HIGH: number;
    CRITICAL: number;
  };
  crimeTypes: Array<{ type: string; count: number }>;
}

/** NCRB "Crime in India 2022" baseline for a metro city or state (rates are per lakh population). */
export interface ICrimeStat {
  _id: string;
  kind: 'metro' | 'state';
  name: string;
  year: number;
  source: string;
  ipcRate: number;
  ipcCases: number;
  murderRate: number;
  kidnappingRate: number;
  robberyRate: number;
  theftRate: number;
  populationLakh: number;
  chargesheetRatePct?: number;
  womenCrimeRate?: number;
  cyberCrimeRate?: number;
  frequencyScore: number;
  severityScore: number;
}
