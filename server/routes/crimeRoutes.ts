import { Router } from 'express';
import { db } from '../db.js';
import { resolveLocationMetadata } from '../ml.js';
import { asyncHandler } from '../asyncHandler.js';

export const crimeRouter = Router();

// GET /api/crime
crimeRouter.get('/', asyncHandler(async (req, res) => {
  const { location } = req.query;
  if (typeof location === 'string' && location.trim()) {
    const list = await db.getCrimeDataByLocation(location);
    return res.json({ crimeData: list });
  }
  const all = await db.getAllCrimeData();
  return res.json({ crimeData: all });
}));

// POST /api/crime
crimeRouter.post('/', async (req, res) => {
  try {
    const { location, latitude, longitude, crimeType, severity, date, time, description } = req.body;

    if (!location || !crimeType) {
      return res.status(400).json({ error: 'Location and crime type are required' });
    }

    let lat = Number(latitude);
    let lng = Number(longitude);
    if (isNaN(lat) || isNaN(lng)) {
      const locMeta = resolveLocationMetadata(location);
      lat = locMeta.lat + (Math.random() - 0.5) * 0.04;
      lng = locMeta.lng + (Math.random() - 0.5) * 0.04;
    }

    const created = await db.addCrimeData({
      location: location.trim(),
      latitude: lat,
      longitude: lng,
      crimeType: crimeType.trim(),
      severity: Number(severity) || 5,
      date: date || new Date().toISOString().split('T')[0],
      time: time || '18:00',
      description: description ? description.trim() : 'Incident recorded by local observer/police bulletin.'
    });

    return res.status(201).json({
      message: 'Crime incident record logged successfully',
      crimeRecord: created
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to add crime data' });
  }
});

// PUT /api/crime/:id
crimeRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { location, latitude, longitude, crimeType, severity, date, time, description } = req.body;

    const updated = await db.updateCrimeData(id, {
      ...(location && { location: location.trim() }),
      ...(latitude && { latitude: Number(latitude) }),
      ...(longitude && { longitude: Number(longitude) }),
      ...(crimeType && { crimeType: crimeType.trim() }),
      ...(severity !== undefined && { severity: Number(severity) }),
      ...(date && { date }),
      ...(time && { time }),
      ...(description && { description: description.trim() })
    });

    if (!updated) {
      return res.status(404).json({ error: 'Crime record not found' });
    }

    return res.json({
      message: 'Crime incident record updated',
      crimeRecord: updated
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to update crime data' });
  }
});

// DELETE /api/crime/:id
crimeRouter.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleted = await db.deleteCrimeData(id);
  if (!deleted) {
    return res.status(404).json({ error: 'Crime record not found' });
  }
  return res.json({ message: 'Crime incident record deleted successfully' });
}));
