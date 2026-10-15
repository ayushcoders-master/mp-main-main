import { Router } from 'express';
import { db, IPrediction } from '../db.js';
import { optionalAuthMiddleware, AuthRequest } from '../auth.js';
import { asyncHandler } from '../asyncHandler.js';
import { runPythonMLPrediction, resolveLocationMetadata, IMLInputFeatures } from '../ml.js';
import { getCrimeBaseline } from '../crimeBaseline.js';

export const predictionRouter = Router();

// POST /api/prediction/predict
predictionRouter.post('/predict', optionalAuthMiddleware, async (req: AuthRequest, res) => {
  try {
    const {
      destination,
      date,
      time,
      weather,
      touristCategory,
      startDate,
      endDate,
      travelWindow,
      travelParty,
      travellerCount,
      travellerCategory,
      travelPurpose,
      plannedTransport,
      accommodationType,
      approxBudget,
      intendedPlaces,
      accessibilityNeeds
    } = req.body;

    if (!destination || !destination.trim()) {
      return res.status(400).json({ error: 'Destination / location is required' });
    }

    const locMeta = resolveLocationMetadata(destination.trim());
    const existingCrimeRecords = await db.getCrimeDataByLocation(destination.trim());

    // Crime baseline from NCRB "Crime in India 2022" (city table, else state-level proxy, else neutral)
    const baseline = await getCrimeBaseline(destination.trim());
    const crimeFrequency = baseline.frequency;
    const crimeSeverity = baseline.severity;

    const effectiveCategory = touristCategory || (travelParty === 'solo' ? 'Solo Traveler' : (req.user?.touristCategory || 'Solo Traveler'));

    const mlFeatures: IMLInputFeatures = {
      location: destination.trim(),
      date: startDate || date || new Date().toISOString().split('T')[0],
      time: time || '14:00',
      weather: weather || 'Clear',
      touristCategory: effectiveCategory,
      crimeFrequency,
      crimeSeverity,
      crowdDensity: 'Moderate',
      recentIncidents: existingCrimeRecords.length,
      baselineNote: baseline.label,
      startDate: startDate || date,
      endDate,
      travelWindow,
      travelParty,
      travellerCount: Number(travellerCount) || 1,
      travelPurpose,
      plannedTransport,
      accommodationType,
      approxBudget,
      intendedPlaces,
      accessibilityNeeds
    };

    // Run ML Evaluation Engine
    const mlResult = await runPythonMLPrediction(mlFeatures);

    // Save prediction in DB
    const savedPrediction = await db.createPrediction({
      userId: req.user?._id || 'guest_user',
      userName: req.user?.name || 'Guest Explorer',
      location: destination.trim(),
      latitude: locMeta.lat,
      longitude: locMeta.lng,
      date: mlFeatures.date || new Date().toISOString().split('T')[0],
      time: mlFeatures.time || '14:00',
      weather: mlFeatures.weather || 'Clear',
      touristCategory: effectiveCategory,
      riskScore: mlResult.riskScore,
      riskLevel: mlResult.riskLevel,
      factors: mlResult.factors,
      recommendations: mlResult.recommendations
    });

    const predictionWithDetails = {
      ...savedPrediction,
      dayNightConsiderations: mlResult.dayNightConsiderations,
      practicalPrecautions: mlResult.practicalPrecautions,
      saferTransportSuggestions: mlResult.saferTransportSuggestions,
      dataFreshnessDisclaimer: mlResult.dataFreshnessDisclaimer
    };

    const nearbyCrimes = existingCrimeRecords.slice(0, 5);
    const nearbyServices = await db.getEmergencyServicesByLocation(destination.trim());

    return res.status(200).json({
      success: true,
      prediction: predictionWithDetails,
      modelUsed: mlResult.modelUsed,
      dayNightConsiderations: mlResult.dayNightConsiderations,
      practicalPrecautions: mlResult.practicalPrecautions,
      saferTransportSuggestions: mlResult.saferTransportSuggestions,
      dataFreshnessDisclaimer: mlResult.dataFreshnessDisclaimer,

      dataQuality: {
        status: `ncrb-2022-${baseline.scope}`,
        crimeRecordCount: existingCrimeRecords.length,
        message: baseline.message
      },
      crimeStats: baseline.stat,
      crimeTrend: [],
      nearbyCrimes,
      nearbyEmergencyCount: nearbyServices.length,
      coordinates: {
        lat: locMeta.lat,
        lng: locMeta.lng
      }
    });
  } catch (err: any) {
    console.error('Prediction API error:', err);
    return res.status(500).json({ error: err.message || 'Error processing safety prediction' });
  }
});

// GET /api/prediction/history
predictionRouter.get('/history', optionalAuthMiddleware, asyncHandler<AuthRequest>(async (req, res) => {
  const userId = req.user?._id;
  if (userId) {
    const list = await db.getPredictionsByUserId(userId);
    return res.json({ predictions: list });
  } else {
    // If not authenticated, return all sample / demo predictions so guests can explore
    const all = await db.getAllPredictions();
    return res.json({ predictions: all });
  }
}));

// GET /api/prediction/:id
predictionRouter.get('/:id', asyncHandler(async (req, res) => {
  const pred = await db.getPredictionById(req.params.id);
  if (!pred) {
    return res.status(404).json({ error: 'Prediction record not found' });
  }

  const locMeta = resolveLocationMetadata(pred.location);
  const nearbyCrimes = await db.getCrimeDataByLocation(pred.location);
  const baseline = await getCrimeBaseline(pred.location);

  return res.json({
    prediction: pred,
    dataQuality: {
      status: `ncrb-2022-${baseline.scope}`,
      crimeRecordCount: nearbyCrimes.length,
      message: baseline.message
    },
    crimeStats: baseline.stat,
    crimeTrend: [],
    nearbyCrimes,
    coordinates: {
      lat: pred.latitude || locMeta.lat,
      lng: pred.longitude || locMeta.lng
    }
  });
}));

// DELETE /api/prediction/:id
predictionRouter.delete('/:id', asyncHandler(async (req, res) => {
  const success = await db.deletePrediction(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Prediction not found' });
  }
  return res.json({ message: 'Prediction successfully deleted' });
}));
