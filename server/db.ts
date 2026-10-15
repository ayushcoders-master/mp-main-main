import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import { MongoClient, Collection, Db } from 'mongodb';
import { SEED_EMERGENCY_SERVICES, SEED_REVIEWS } from './seed.js';
import { ICrimeStat, loadNcrbStats } from './crimeStats.js';
import { FeedbackCategory, FeedbackStatus } from '../shared/feedback.js';
   import dns from 'dns';
// ---------------------------------------------------------------------------
// Document shapes (one MongoDB collection each). `_id` is a string id such as
// "usr_<uuid>", so the API responses look the same as before.
// ---------------------------------------------------------------------------
export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string; // bcrypt hash
  touristCategory: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface ICrimeData {
  _id: string;
  location: string;
  latitude: number;
  longitude: number;
  crimeType: string;
  severity: number; // 1 to 10
  date: string;
  time: string;
  description: string;
}

export interface IPredictionFactor {
  factor: string;
  impact: 'Low' | 'Moderate' | 'High';
  scoreContribution: number;
  explanation: string;
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
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  factors: IPredictionFactor[];
  recommendations: string[];
  createdAt: string;
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
  mapQuery?: string;
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

export interface FeedbackFilters {
  status?: FeedbackStatus;
  category?: FeedbackCategory;
  rating?: number;
  sort?: 'oldest' | 'newest';
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const newId = (prefix: string) => `${prefix}_${randomUUID().replace(/-/g, '').slice(0, 12)}`;

/** Escape user text so it can be used safely inside a MongoDB $regex. */
const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** True when a MongoDB error is a duplicate-key (unique index) violation. */
export function isDuplicateKeyError(err: unknown): boolean {
  return typeof err === 'object' && err !== null && (err as { code?: number }).code === 11000;
}

// ---------------------------------------------------------------------------
// Connection
// ---------------------------------------------------------------------------
let client: MongoClient | null = null;
let database: Db | null = null;

function col<T extends { _id: string }>(name: string): Collection<T> {
  if (!database) {
    throw new Error('Database is not connected. Call connectDB() before using db.');
  }
  return database.collection<T>(name);
}

/**
 * Connects to MongoDB, creates indexes, inserts demo seed data once and
 * (optionally) creates the first admin account from ADMIN_EMAIL / ADMIN_PASSWORD.
 * Reads env vars at call time, so it must run after dotenv has loaded.
 */
export async function connectDB(): Promise<void> {
  if (database) return;

   const dnsServers = (process.env.MONGODB_DNS_SERVERS || '').split(',').map((x) => x.trim()).filter(Boolean);
     if (dnsServers.length) dns.setServers(dnsServers);
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
  const dbName = process.env.MONGODB_DB || 'tourist_safety';

  client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });
  try {
    await client.connect();
    database = client.db(dbName);
    await database.command({ ping: 1 });
  } catch (err) {
    client = null;
    database = null;
    const safeUri = uri.replace(/\/\/[^@/]*@/, '//***@'); // never log credentials
    throw new Error(
      `Could not connect to MongoDB at ${safeUri} (${(err as Error).message}). ` +
        'Start MongoDB or set MONGODB_URI in .env.local (see .env.example).'
    );
  }

  await Promise.all([
    col<IUser>('users').createIndex({ email: 1 }, { unique: true }),
    col<ICrimeData>('crime_data').createIndex({ location: 1 }),
    col<IPrediction>('predictions').createIndex({ userId: 1, createdAt: -1 }),
    col<IEmergencyService>('emergency_services').createIndex({ location: 1 }),
    col<IReview>('reviews').createIndex({ destination: 1 }),
    col<IFeedback>('feedback').createIndex({ userId: 1, createdAt: -1 }),
    col<IFeedback>('feedback').createIndex({ status: 1, category: 1, createdAt: -1 })
  ]);

  await seedIfNeeded();
  await importCrimeStatsIfNeeded();
  await ensureAdminFromEnv();
  console.log(`MongoDB connected (database "${dbName}")`);
}

export async function closeDB(): Promise<void> {
  if (client) await client.close();
  client = null;
  database = null;
}

/**
 * Loads the NCRB "Crime in India 2022" city / state statistics (server/data/ncrb2022.json) into the
 * `crime_stats` collection. Runs once per database; set REFRESH_CRIME_STATS=true to re-import.
 */
async function importCrimeStatsIfNeeded() {
  const meta = col<{ _id: string; at: string }>('meta');
  const refresh = process.env.REFRESH_CRIME_STATS === 'true';
  if (!refresh && (await meta.findOne({ _id: 'ncrb2022_v1' }))) return;

  const stats = loadNcrbStats();
  await col<ICrimeStat>('crime_stats').bulkWrite(
    stats.map((doc) => ({ replaceOne: { filter: { _id: doc._id }, replacement: doc, upsert: true } }))
  );
  await meta.updateOne(
    { _id: 'ncrb2022_v1' },
    { $set: { at: new Date().toISOString() } },
    { upsert: true }
  );
  console.log(`Imported NCRB 2022 crime statistics (${stats.length} cities / states).`);
}

/** Inserts the demo emergency-service and review data exactly once per database. */
async function seedIfNeeded() {
  if (process.env.SEED_DEMO_DATA === 'false') return;

  const meta = col<{ _id: string; at: string }>('meta');
  if (await meta.findOne({ _id: 'demo_seed_v1' })) return;

  await col<IEmergencyService>('emergency_services')
    .insertMany(SEED_EMERGENCY_SERVICES, { ordered: false })
    .catch(ignoreDuplicates);
  await col<IReview>('reviews').insertMany(SEED_REVIEWS, { ordered: false }).catch(ignoreDuplicates);

  await meta.updateOne({ _id: 'demo_seed_v1' }, { $setOnInsert: { at: new Date().toISOString() } }, { upsert: true });
  console.log('Seeded demo emergency-service and review data.');
}

function ignoreDuplicates(err: unknown) {
  if (!isDuplicateKeyError(err) && (err as { name?: string }).name !== 'MongoBulkWriteError') throw err;
  const writeErrors = (err as { writeErrors?: Array<{ code?: number }> }).writeErrors;
  if (Array.isArray(writeErrors) && writeErrors.some((e) => e.code !== 11000)) throw err;
}

/** Creates the first admin from env vars. No default / hardcoded accounts are created. */
async function ensureAdminFromEnv() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return;

  const users = col<IUser>('users');
  if (await users.findOne({ email })) return;

  if (password.length < 8) {
    console.warn('ADMIN_PASSWORD must be at least 8 characters; admin account was NOT created.');
    return;
  }
  await users.insertOne({
    _id: newId('usr'),
    name: process.env.ADMIN_NAME?.trim() || 'Administrator',
    email,
    password: bcrypt.hashSync(password, 10),
    touristCategory: 'Business Traveler',
    role: 'admin',
    createdAt: new Date().toISOString()
  });
  console.log(`Admin account created for ${email}`);
}

// ---------------------------------------------------------------------------
// Data access (all async). Method names match the old in-memory version.
// ---------------------------------------------------------------------------
class Database {
  // Users
  async getUsers(): Promise<IUser[]> {
    return col<IUser>('users').find({}).sort({ createdAt: 1 }).toArray();
  }

  async getFeedbackUserProfiles(userIds: string[]): Promise<Array<{ _id: string; name: string; email: string }>> {
    if (userIds.length === 0) return [];
    return col<{ _id: string; name: string; email: string }>('users')
      .find({ _id: { $in: userIds } }, { projection: { _id: 1, name: 1, email: 1 } })
      .toArray();
  }

  async getUserById(id: string): Promise<IUser | null> {
    if (typeof id !== 'string') return null;
    return col<IUser>('users').findOne({ _id: id });
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    if (typeof email !== 'string') return null;
    return col<IUser>('users').findOne({ email: email.trim().toLowerCase() });
  }

  async createUser(user: Omit<IUser, '_id' | 'createdAt'>): Promise<IUser> {
    const newUser: IUser = {
      ...user,
      email: user.email.trim().toLowerCase(),
      _id: newId('usr'),
      createdAt: new Date().toISOString()
    };
    await col<IUser>('users').insertOne(newUser); // throws code 11000 if the email already exists
    return newUser;
  }

  async updateUser(id: string, updates: Partial<IUser>): Promise<IUser | null> {
    const { _id, ...fields } = updates;
    return col<IUser>('users').findOneAndUpdate({ _id: id }, { $set: fields }, { returnDocument: 'after' });
  }

  // Crime data
  async getAllCrimeData(): Promise<ICrimeData[]> {
    return col<ICrimeData>('crime_data').find({}).sort({ date: -1, time: -1 }).toArray();
  }

  async getCrimeDataByLocation(loc: string): Promise<ICrimeData[]> {
    const search = String(loc).trim();
    return col<ICrimeData>('crime_data')
      .find({ location: { $regex: escapeRegex(search), $options: 'i' } })
      .sort({ date: -1, time: -1 })
      .toArray();
  }

  async addCrimeData(crime: Omit<ICrimeData, '_id'>): Promise<ICrimeData> {
    const newCrime: ICrimeData = { ...crime, _id: newId('crm') };
    await col<ICrimeData>('crime_data').insertOne(newCrime);
    return newCrime;
  }

  async updateCrimeData(id: string, updates: Partial<ICrimeData>): Promise<ICrimeData | null> {
    const { _id, ...fields } = updates;
    if (Object.keys(fields).length === 0) return col<ICrimeData>('crime_data').findOne({ _id: id });
    return col<ICrimeData>('crime_data').findOneAndUpdate({ _id: id }, { $set: fields }, { returnDocument: 'after' });
  }

  async deleteCrimeData(id: string): Promise<boolean> {
    const res = await col<ICrimeData>('crime_data').deleteOne({ _id: id });
    return res.deletedCount > 0;
  }

  // NCRB crime statistics (city / state baselines)
  async getCrimeStat(id: string): Promise<ICrimeStat | null> {
    return col<ICrimeStat>('crime_stats').findOne({ _id: id });
  }

  async getAllCrimeStats(): Promise<ICrimeStat[]> {
    return col<ICrimeStat>('crime_stats').find({}).sort({ kind: 1, name: 1 }).toArray();
  }

  // Predictions
  async getAllPredictions(): Promise<IPrediction[]> {
    return col<IPrediction>('predictions').find({}).sort({ createdAt: -1 }).toArray();
  }

  async getPredictionById(id: string): Promise<IPrediction | null> {
    return col<IPrediction>('predictions').findOne({ _id: id });
  }

  async getPredictionsByUserId(userId: string): Promise<IPrediction[]> {
    return col<IPrediction>('predictions').find({ userId }).sort({ createdAt: -1 }).toArray();
  }

  async createPrediction(pred: Omit<IPrediction, '_id' | 'createdAt'>): Promise<IPrediction> {
    const newPred: IPrediction = { ...pred, _id: newId('pred'), createdAt: new Date().toISOString() };
    await col<IPrediction>('predictions').insertOne(newPred);
    return newPred;
  }

  async deletePrediction(id: string): Promise<boolean> {
    const res = await col<IPrediction>('predictions').deleteOne({ _id: id });
    return res.deletedCount > 0;
  }

  // Emergency services
  async getAllEmergencyServices(): Promise<IEmergencyService[]> {
    return col<IEmergencyService>('emergency_services').find({}).toArray();
  }

  async getEmergencyServicesByLocation(location: string): Promise<IEmergencyService[]> {
    const search = String(location).trim();
    return col<IEmergencyService>('emergency_services')
      .find({ location: { $regex: escapeRegex(search), $options: 'i' } })
      .toArray();
  }

  async addEmergencyService(svc: Omit<IEmergencyService, '_id'>): Promise<IEmergencyService> {
    const newSvc: IEmergencyService = { ...svc, _id: newId('emg') };
    await col<IEmergencyService>('emergency_services').insertOne(newSvc);
    return newSvc;
  }

  // Reviews
  async getAllReviews(): Promise<IReview[]> {
    return col<IReview>('reviews').find({}).sort({ date: -1 }).toArray();
  }

  async getReviewsByDestination(destination: string): Promise<IReview[]> {
    const search = String(destination).trim();
    // Match when the stored destination contains the search text OR the search text contains the destination
    // (so "Delhi, India" still finds reviews saved under "Delhi").
    return col<IReview>('reviews')
      .find({
        $or: [
          { destination: { $regex: escapeRegex(search), $options: 'i' } },
          { $expr: { $gte: [{ $indexOfCP: [search.toLowerCase(), { $toLower: '$destination' }] }, 0] } }
        ]
      })
      .sort({ date: -1 })
      .toArray();
  }

  async addReview(review: Omit<IReview, '_id' | 'date'> & { date?: string }): Promise<IReview> {
    const newReview: IReview = {
      ...review,
      _id: newId('rev'),
      date: review.date || new Date().toISOString().split('T')[0],
      verified: review.verified ?? true
    };
    await col<IReview>('reviews').insertOne(newReview);
    return newReview;
  }

  // Feedback
  async addFeedback(feedback: Pick<IFeedback, 'userId' | 'rating' | 'category' | 'message'>): Promise<IFeedback> {
    const now = new Date().toISOString();
    const record: IFeedback = {
      ...feedback,
      _id: newId('fb'),
      status: 'New',
      createdAt: now,
      updatedAt: now
    };
    await col<IFeedback>('feedback').insertOne(record);
    return record;
  }

  async getFeedbackByUserId(userId: string): Promise<IFeedback[]> {
    return col<IFeedback>('feedback').find({ userId }).sort({ createdAt: -1 }).toArray();
  }

  async getAllFeedback(filters: FeedbackFilters = {}): Promise<IFeedback[]> {
    const query: Partial<Pick<IFeedback, 'status' | 'category' | 'rating'>> = {};
    if (filters.status) query.status = filters.status;
    if (filters.category) query.category = filters.category;
    if (filters.rating) query.rating = filters.rating;
    return col<IFeedback>('feedback')
      .find(query)
      .sort({ createdAt: filters.sort === 'oldest' ? 1 : -1 })
      .toArray();
  }

  async getFeedbackStats(): Promise<{
    total: number;
    newCount: number;
    averageRating: number;
    byCategory: Array<{ category: string; count: number }>;
  }> {
    const feedback = col<IFeedback>('feedback');
    const [total, newCount, averages, categories] = await Promise.all([
      feedback.countDocuments(),
      feedback.countDocuments({ status: 'New' }),
      feedback.aggregate<{ averageRating: number }>([
        { $group: { _id: null, averageRating: { $avg: '$rating' } } },
        { $project: { _id: 0, averageRating: 1 } }
      ]).toArray(),
      feedback.aggregate<{ _id: string; count: number }>([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1, _id: 1 } }
      ]).toArray()
    ]);
    return {
      total,
      newCount,
      averageRating: averages[0]?.averageRating ?? 0,
      byCategory: categories.map(({ _id, count }) => ({ category: _id, count }))
    };
  }

  async updateFeedbackStatus(id: string, status: FeedbackStatus): Promise<IFeedback | null> {
    return col<IFeedback>('feedback').findOneAndUpdate(
      { _id: id },
      { $set: { status, updatedAt: new Date().toISOString() } },
      { returnDocument: 'after' }
    );
  }

  async deleteFeedback(id: string): Promise<boolean> {
    const result = await col<IFeedback>('feedback').deleteOne({ _id: id });
    return result.deletedCount > 0;
  }
}

export const db = new Database();
