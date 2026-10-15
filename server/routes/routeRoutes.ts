import { Router } from 'express';
import { INDIAN_CITIES } from '../../shared/indianCities.ts';

export const routeRouter = Router();

interface GeocodedPlace {
  lat: number;
  lon: number;
  displayName: string;
}

interface OsrmRoute {
  distance: number;
  duration: number;
  geometry: { coordinates: [number, number][] };
  legs: Array<{ steps: Array<{ name?: string }> }>;
}

class GeocodingMismatchError extends Error {}

const geocodeCache = new Map<string, GeocodedPlace>();
let geocodeQueue: Promise<void> = Promise.resolve();
let lastGeocodeRequestAt = 0;

function geocodeIndia(query: string): Promise<GeocodedPlace | null> {
  const geocoderUrl = process.env.NOMINATIM_URL || 'https://nominatim.openstreetmap.org/search';
  const cacheKey = `${geocoderUrl}:${query.trim().toLowerCase()}`;
  const cached = geocodeCache.get(cacheKey);
  if (cached) return Promise.resolve(cached);

  const request = geocodeQueue.catch(() => undefined).then(async () => {
    const delay = Math.max(0, 1000 - (Date.now() - lastGeocodeRequestAt));
    if (delay > 0) await new Promise((resolve) => setTimeout(resolve, delay));
    lastGeocodeRequestAt = Date.now();

    const url = new URL(geocoderUrl);
    url.search = new URLSearchParams({
      format: 'jsonv2',
      q: query,
      countrycodes: 'in',
      limit: '1'
    }).toString();

    const response = await fetch(url, {
      headers: {
        'User-Agent': process.env.NOMINATIM_USER_AGENT || 'TouristSafetyAI/1.0 (route planning app)',
        'Accept-Language': 'en'
      },
      signal: AbortSignal.timeout(12000)
    });
    if (!response.ok) throw new Error('India address lookup is temporarily unavailable. Please try again.');

    const results = await response.json() as Array<{ lat: string; lon: string; display_name: string }>;
    const result = results[0];
    if (!result) return null;

    const place = {
      lat: Number(result.lat),
      lon: Number(result.lon),
      displayName: result.display_name
    };
    if (!Number.isFinite(place.lat) || !Number.isFinite(place.lon)) return null;
    const expectedCity = INDIAN_CITIES.find(({ name }) =>
      new RegExp(`\\b${name.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}\\b`, 'i').test(query)
    );
    if (expectedCity && !new RegExp(`\\b${expectedCity.name.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}\\b`, 'i').test(place.displayName)) {
      throw new GeocodingMismatchError(`The address lookup did not match ${expectedCity.name}. Add a more specific ${expectedCity.name} landmark or address.`);
    }
    if (geocodeCache.size >= 5000) geocodeCache.delete(geocodeCache.keys().next().value!);
    geocodeCache.set(cacheKey, place);
    return place;
  });

  geocodeQueue = request.then(() => undefined, () => undefined);
  return request;
}

// POST /api/routes/safe-route
routeRouter.post('/safe-route', async (req, res) => {
  try {
    const startPoint = typeof req.body?.startPoint === 'string' ? req.body.startPoint.trim() : '';
    const destination = typeof req.body?.destination === 'string' ? req.body.destination.trim() : '';

    if (!startPoint || !destination) {
      return res.status(400).json({ error: 'Enter both a starting address and a destination in India.' });
    }
    if (startPoint.length > 200 || destination.length > 200) {
      return res.status(400).json({ error: 'Locations must be 200 characters or fewer.' });
    }

    const [start, destinationPlace] = await Promise.all([
      geocodeIndia(`${startPoint}, India`),
      geocodeIndia(`${destination}, India`)
    ]);
    if (!start) return res.status(422).json({ error: `Could not find "${startPoint}" in India. Try a more specific address or landmark.` });
    if (!destinationPlace) return res.status(422).json({ error: `Could not find "${destination}" in India. Try a full address or nearby landmark.` });

    const coordinates = `${start.lon},${start.lat};${destinationPlace.lon},${destinationPlace.lat}`;
    const routerBaseUrl = (process.env.OSRM_ROUTE_URL || 'https://router.project-osrm.org/route/v1/driving').replace(/\/+$/, '');
    const routerUrl = `${routerBaseUrl}/${coordinates}?alternatives=2&steps=true&geometries=geojson&overview=full`;
    const routeResponse = await fetch(routerUrl, { signal: AbortSignal.timeout(15000) });
    if (!routeResponse.ok) throw new Error('Road routing is temporarily unavailable. Please retry shortly.');

    const routeData = await routeResponse.json() as {
      code: string;
      routes?: OsrmRoute[];
      waypoints?: Array<{ location: [number, number] }>;
    };
    if (routeData.code !== 'Ok' || !routeData.routes?.length) {
      return res.status(422).json({ error: 'No drivable road route was found between those locations.' });
    }

    const routes = routeData.routes.map((route, index) => {
      const roadNames = [...new Set(route.legs.flatMap((leg) => leg.steps
        .map((step) => step.name?.trim())
        .filter((name): name is string => Boolean(name))))].slice(0, 8);
      return {
        id: `route_${index + 1}`,
        name: `Route ${index + 1}`,
        distanceKm: Math.round(route.distance / 100) / 10,
        durationMinutes: Math.ceil(route.duration / 60),
        roadNames,
        tag: index === 0 ? 'Top-ranked driving route' : 'Alternative driving route',
        waypoints: route.geometry.coordinates.map(([lng, lat]) => [lat, lng] as [number, number])
      };
    });

    const snappedStart = routeData.waypoints?.[0]?.location || [start.lon, start.lat];
    const snappedDestination = routeData.waypoints?.[1]?.location || [destinationPlace.lon, destinationPlace.lat];

    return res.json({
      startPoint: start.displayName,
      destination: destinationPlace.displayName,
      travelMode: 'Driving / Cab',
      routes,
      mapCenter: {
        lat: (snappedStart[1] + snappedDestination[1]) / 2,
        lng: (snappedStart[0] + snappedDestination[0]) / 2
      },
      startCoords: { lat: snappedStart[1], lng: snappedStart[0] },
      destCoords: { lat: snappedDestination[1], lng: snappedDestination[0] },
      dataSource: 'OpenStreetMap road network via OSRM',
      safetyDisclaimer: 'Routes are not safety-ranked. Verified current crime, lighting, CCTV, and patrol coverage data is not available.'
    });
  } catch (err: any) {
    const status = err instanceof GeocodingMismatchError ? 422 : 502;
    return res.status(status).json({ error: err.message || 'Could not calculate road routes. Please retry.' });
  }
});
