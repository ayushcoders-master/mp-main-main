import axios from 'axios';
import { IUser, IPrediction, ICrimeData, IEmergencyService, IRouteComparison, IAdminStats, ICrimeStat, IFeedback, IAdminFeedback, IFeedbackStats, FeedbackCategory, FeedbackStatus } from '../types.ts';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach token to request headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  getGoogleConfig: async () => {
    const res = await api.get<{ clientId: string | null }>('/auth/google/config');
    return res.data;
  },
  googleLogin: async (credential: string) => {
    const res = await api.post<{ message: string; token: string; user: IUser }>('/auth/google', { credential });
    return res.data;
  },
  register: async (data: { name: string; email: string; password: string; confirmPassword?: string; touristCategory?: string }) => {
    const res = await api.post<{ message: string; token: string; user: IUser }>('/auth/register', data);
    return res.data;
  },
  login: async (data: { email: string; password: string }) => {
    const res = await api.post<{ message: string; token: string; user: IUser }>('/auth/login', data);
    return res.data;
  },
  logout: async () => {
    const res = await api.post('/auth/logout');
    return res.data;
  },
  getMe: async () => {
    const res = await api.get<{ user: IUser }>('/auth/me');
    return res.data;
  },
  updateProfile: async (data: { name?: string; touristCategory?: string }) => {
    const res = await api.put<{ message: string; user: IUser }>('/auth/profile', data);
    return res.data;
  }
};

export const predictionApi = {
  predict: async (data: {
    destination: string;
    date?: string;
    time?: string;
    weather?: string;
    touristCategory?: string;
    startDate?: string;
    endDate?: string;
    travelWindow?: 'day' | 'night' | 'both';
    travelParty?: 'solo' | 'friends' | 'family' | 'group' | 'business';
    travellerCount?: number;
    travellerCategory?: string;
    travelPurpose?: string;
    plannedTransport?: string;
    accommodationType?: string;
    approxBudget?: string;
    intendedPlaces?: string;
    accessibilityNeeds?: string;
  }) => {
    const res = await api.post<{
      success: boolean;
      prediction: IPrediction;
      modelUsed: string;
      dayNightConsiderations?: any;
      practicalPrecautions?: string[];
      saferTransportSuggestions?: string[];
      dataFreshnessDisclaimer?: string;
      dataQuality: { status: string; crimeRecordCount: number; message: string };
      crimeStats?: ICrimeStat | null;
      crimeTrend: Array<{ month: string; incidents: number; resolved: number }>;
      nearbyCrimes: ICrimeData[];
      nearbyEmergencyCount: number;
      coordinates: { lat: number; lng: number };
    }>('/prediction/predict', data);
    return res.data;
  },
  getHistory: async () => {
    const res = await api.get<{ predictions: IPrediction[] }>('/prediction/history');
    return res.data;
  },
  getById: async (id: string) => {
    const res = await api.get<{
      prediction: IPrediction;
      dataQuality: { status: string; crimeRecordCount: number; message: string };
      crimeTrend: Array<{ month: string; incidents: number; resolved: number }>;
      nearbyCrimes: ICrimeData[];
      coordinates: { lat: number; lng: number };
    }>(`/prediction/${id}`);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await api.delete<{ message: string }>(`/prediction/${id}`);
    return res.data;
  }
};

export const crimeApi = {
  getAll: async (location?: string) => {
    const res = await api.get<{ crimeData: ICrimeData[] }>('/crime', {
      params: location ? { location } : undefined
    });
    return res.data;
  },
  create: async (data: Partial<ICrimeData>) => {
    const res = await api.post<{ message: string; crimeRecord: ICrimeData }>('/crime', data);
    return res.data;
  },
  update: async (id: string, data: Partial<ICrimeData>) => {
    const res = await api.put<{ message: string; crimeRecord: ICrimeData }>(`/crime/${id}`, data);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await api.delete<{ message: string }>(`/crime/${id}`);
    return res.data;
  }
};

export const emergencyApi = {
  getNearby: async (location: string) => {
    const res = await api.get<{
      location: string;
      country: string;
      coordinates: { lat: number; lng: number };
      services: IEmergencyService[];
      emergencyNumbers: { police: string; ambulance: string; fire: string; touristHelpline: string };
      countryEmergencyNumbers?: Array<{ country: string; police: string; ambulance: string; tourist: string }>;
      disclaimer: string;
    }>('/emergency/nearby', { params: { location } });
    return res.data;
  },
  create: async (data: Partial<IEmergencyService>) => {
    const res = await api.post<{ message: string; service: IEmergencyService }>('/emergency', data);
    return res.data;
  }
};

export const routeApi = {
  getSafeRoute: async (data: {
    startPoint?: string;
    destination: string;
    travelTime?: string;
    travelMode?: string;
  }) => {
    const res = await api.post<IRouteComparison>('/routes/safe-route', data);
    return res.data;
  }
};

export const adminApi = {
  getStats: async () => {
    const res = await api.get<IAdminStats>('/admin/stats');
    return res.data;
  },
  getUsers: async () => {
    const res = await api.get<{ users: IUser[] }>('/admin/users');
    return res.data;
  },
  getPredictions: async () => {
    const res = await api.get<{ predictions: IPrediction[] }>('/admin/predictions');
    return res.data;
  },
  getFeedback: async (filters: {
    status?: FeedbackStatus;
    category?: FeedbackCategory;
    rating?: number;
    sort?: 'newest' | 'oldest';
  } = {}) => {
    const res = await api.get<{ feedback: IAdminFeedback[]; stats: IFeedbackStats }>('/admin/feedback', { params: filters });
    return res.data;
  },
  updateFeedbackStatus: async (id: string, status: FeedbackStatus) => {
    const res = await api.patch<{ message: string; feedback: IFeedback }>(`/admin/feedback/${id}/status`, { status });
    return res.data;
  },
  deleteFeedback: async (id: string) => {
    const res = await api.delete<{ message: string }>(`/admin/feedback/${id}`);
    return res.data;
  },
  addCrime: async (data: Partial<ICrimeData>) => {
    const res = await api.post<{ message: string; crimeRecord: ICrimeData }>('/crime', data);
    return res.data;
  },
  updateCrime: async (id: string, data: Partial<ICrimeData>) => {
    const res = await api.put<{ message: string; crimeRecord: ICrimeData }>(`/crime/${id}`, data);
    return res.data;
  },
  deleteCrime: async (id: string) => {
    const res = await api.delete<{ message: string }>(`/crime/${id}`);
    return res.data;
  }
};

export const feedbackApi = {
  submit: async (data: { rating: number; category: FeedbackCategory; message: string }) => {
    const res = await api.post<{ message: string; feedback: IFeedback }>('/feedback', data);
    return res.data;
  },
  getMine: async () => {
    const res = await api.get<{ feedback: IFeedback[] }>('/feedback/mine');
    return res.data;
  }
};

export const reviewApi = {
  getAll: async (destination?: string) => {
    const res = await api.get<{ reviews: import('../types.ts').IReview[] }>('/reviews', {
      params: destination ? { destination } : undefined
    });
    return res.data;
  },
  create: async (data: {
    destination: string;
    targetType: 'heritage' | 'hotel' | 'destination';
    targetName: string;
    authorName?: string;
    rating: number;
    comment: string;
  }) => {
    const res = await api.post<{ message: string; review: import('../types.ts').IReview }>('/reviews', data);
    return res.data;
  }
};

export default api;

