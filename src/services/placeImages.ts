import api from './api.ts';

export interface ResolvedPlaceImage {
  url: string;
  title: string;
  pageUrl: string;
}

type PlaceKind = 'place' | 'city';

const STORAGE_PREFIX = 'placeImage:v1:';
const memoryCache = new Map<string, ResolvedPlaceImage | null>();
const inFlight = new Map<string, Promise<ResolvedPlaceImage | null>>();

function cacheKey(name: string, city: string, kind: PlaceKind) {
  return `${kind}|${name.trim().toLowerCase()}|${city.trim().toLowerCase()}`;
}

function readStored(key: string): ResolvedPlaceImage | undefined {
  try {
    const raw = sessionStorage.getItem(STORAGE_PREFIX + key);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as ResolvedPlaceImage | null;
    return parsed && typeof parsed.url === 'string' ? parsed : undefined;
  } catch {
    return undefined;
  }
}

function writeStored(key: string, value: ResolvedPlaceImage) {
  try {
    sessionStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch {
    // storage full or unavailable - the in-memory cache still works
  }
}

/**
 * Looks up a real photo for a place (via the server's /api/place-image, which
 * uses Wikipedia / Wikimedia Commons). Resolves to null when none is found.
 */
export function fetchPlaceImage(
  name: string,
  city = '',
  kind: PlaceKind = 'place'
): Promise<ResolvedPlaceImage | null> {
  const trimmed = name.trim();
  if (trimmed.length < 2) return Promise.resolve(null);

  const key = cacheKey(trimmed, city, kind);
  if (memoryCache.has(key)) return Promise.resolve(memoryCache.get(key) ?? null);

  const stored = readStored(key);
  if (stored) {
    memoryCache.set(key, stored);
    return Promise.resolve(stored);
  }

  const existing = inFlight.get(key);
  if (existing) return existing;

  const request = api
    .get<{ url: string | null; image: ResolvedPlaceImage | null }>('/place-image', {
      params: { q: trimmed, city: city || undefined, kind },
      timeout: 15000
    })
    .then((res) => {
      const image = res.data?.url
        ? {
            url: res.data.url,
            title: res.data.image?.title ?? trimmed,
            pageUrl: res.data.image?.pageUrl ?? ''
          }
        : null;
      // Only remember hits: a miss may just be a temporary network problem.
      if (image) {
        memoryCache.set(key, image);
        writeStored(key, image);
      }
      return image;
    })
    .catch(() => null)
    .finally(() => inFlight.delete(key));

  inFlight.set(key, request);
  return request;
}
