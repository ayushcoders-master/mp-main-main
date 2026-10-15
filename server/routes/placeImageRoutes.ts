import { Router } from 'express';
import { asyncHandler } from '../asyncHandler.js';

/**
 * GET /api/place-image?q=<place name>&city=<city>&kind=place|city
 *
 * Resolves a real, freely-licensed photo of a place from Wikipedia / Wikimedia
 * Commons (no API key needed). The result is cached in memory so repeated
 * searches are instant and Wikipedia is not hit more than necessary.
 */
export const placeImageRouter = Router();

interface PlaceImage {
  url: string;
  title: string;
  pageUrl: string;
  source: 'wikipedia';
}

interface WikiPage {
  pageid: number;
  title: string;
  index?: number;
  fullurl?: string;
  thumbnail?: { source: string; width: number; height: number };
}

interface CacheEntry {
  value: PlaceImage | null;
  expiresAt: number;
}

const FOUND_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const MISS_TTL_MS = 60 * 60 * 1000;
const MAX_CACHE_ENTRIES = 2000;

const imageCache = new Map<string, CacheEntry>();
const inFlight = new Map<string, Promise<PlaceImage | null>>();

const STOP_WORDS = new Set([
  'the', 'of', 'and', 'in', 'at', 'a', 'an', 'to', 'for', 'near', 'new', 'old',
  'india', 'indian', 'city', 'area', 'zone', 'heritage'
]);

// Thumbnails that are clearly not a photo of the place (maps, flags, logos...)
const UNWANTED_IMAGE_HINTS = ['flag', 'map', 'logo', 'seal', 'emblem', 'coat_of_arms', 'locator', 'symbol', 'icon'];

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
}

/** "Red Fort (Lal Qila) & Chandni Chowk" -> "Red Fort Lal Qila Chandni Chowk" */
function cleanName(name: string): string {
  return name
    .replace(/[()]/g, ' ')
    .replace(/&/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function looksLikePhoto(url: string): boolean {
  const lower = url.toLowerCase();
  if (UNWANTED_IMAGE_HINTS.some((hint) => lower.includes(hint))) return false;
  return /\.(jpe?g|png|webp)(\?|$)/.test(lower);
}

async function searchWikipedia(searchTerm: string): Promise<WikiPage[]> {
  const url = new URL('https://en.wikipedia.org/w/api.php');
  url.search = new URLSearchParams({
    action: 'query',
    format: 'json',
    generator: 'search',
    gsrsearch: searchTerm,
    gsrnamespace: '0',
    gsrlimit: '6',
    prop: 'pageimages|info',
    piprop: 'thumbnail',
    pithumbsize: '900',
    pilimit: '6',
    inprop: 'url',
    redirects: '1'
  }).toString();

  const response = await fetch(url, {
    headers: {
      'User-Agent': process.env.WIKIMEDIA_USER_AGENT || 'TouristSafetyAI/1.0 (tourist safety app; place photos)',
      'Accept': 'application/json'
    },
    signal: AbortSignal.timeout(8000)
  });
  if (!response.ok) throw new Error(`Wikipedia lookup failed with status ${response.status}`);

  const data = await response.json() as { query?: { pages?: Record<string, WikiPage> } };
  const pages = Object.values(data.query?.pages ?? {});
  return pages.sort((a, b) => (a.index ?? 99) - (b.index ?? 99));
}

/**
 * Pick the best-ranked result that has a real photo AND whose title actually
 * relates to what we searched for, so we never show a random unrelated page.
 */
function pickBestPage(pages: WikiPage[], mustMatch: string[]): WikiPage | null {
  for (const page of pages) {
    const thumb = page.thumbnail?.source;
    if (!thumb || !looksLikePhoto(thumb)) continue;
    const titleTokens = new Set(tokenize(page.title));
    if (mustMatch.length === 0 || mustMatch.some((token) => titleTokens.has(token))) {
      return page;
    }
  }
  return null;
}

async function resolvePlaceImage(name: string, city: string, kind: 'place' | 'city'): Promise<PlaceImage | null> {
  const cleaned = cleanName(name);
  const cityClean = cleanName(city);
  const cityTokens = new Set(tokenize(cityClean));

  // Most specific search first, then progressively looser ones.
  const attempts: Array<{ term: string; mustMatch: string[] }> = [];
  if (kind === 'city') {
    attempts.push({ term: `${cleaned} India`, mustMatch: tokenize(cleaned) });
    attempts.push({ term: cleaned, mustMatch: tokenize(cleaned) });
  } else {
    // For a place, the match must come from the place's own words, not just the city name.
    const placeTokens = tokenize(cleaned).filter((token) => !cityTokens.has(token));
    const mustMatch = placeTokens.length > 0 ? placeTokens : tokenize(cleaned);
    if (cityClean) attempts.push({ term: `${cleaned} ${cityClean}`, mustMatch });
    attempts.push({ term: `${cleaned} India`, mustMatch });
  }

  for (const attempt of attempts) {
    const pages = await searchWikipedia(attempt.term);
    const best = pickBestPage(pages, attempt.mustMatch);
    if (best?.thumbnail) {
      return {
        url: best.thumbnail.source,
        title: best.title,
        pageUrl: best.fullurl || `https://en.wikipedia.org/?curid=${best.pageid}`,
        source: 'wikipedia'
      };
    }
  }
  return null;
}

function remember(key: string, value: PlaceImage | null) {
  if (imageCache.size >= MAX_CACHE_ENTRIES) {
    const oldest = imageCache.keys().next().value;
    if (oldest !== undefined) imageCache.delete(oldest);
  }
  imageCache.set(key, { value, expiresAt: Date.now() + (value ? FOUND_TTL_MS : MISS_TTL_MS) });
}

placeImageRouter.get('/', asyncHandler(async (req, res) => {
  const name = typeof req.query.q === 'string' ? req.query.q.trim() : '';
  const city = typeof req.query.city === 'string' ? req.query.city.trim() : '';
  const kind = req.query.kind === 'city' ? 'city' : 'place';

  if (name.length < 2 || name.length > 120 || city.length > 80) {
    return res.status(400).json({ error: 'Provide a place name (2-120 characters) in q.' });
  }

  const key = `${kind}|${name.toLowerCase()}|${city.toLowerCase()}`;
  const cached = imageCache.get(key);
  if (cached && cached.expiresAt > Date.now()) {
    res.set('Cache-Control', 'public, max-age=86400');
    return res.json({ url: cached.value?.url ?? null, image: cached.value });
  }

  let pending = inFlight.get(key);
  if (!pending) {
    pending = resolvePlaceImage(name, city, kind).finally(() => inFlight.delete(key));
    inFlight.set(key, pending);
  }

  try {
    const image = await pending;
    remember(key, image);
    if (image) res.set('Cache-Control', 'public, max-age=86400');
    return res.json({ url: image?.url ?? null, image });
  } catch (err) {
    // Wikipedia temporarily unreachable: do not cache, let the client fall back.
    console.warn('Place image lookup failed:', err instanceof Error ? err.message : err);
    return res.json({ url: null, image: null });
  }
}));
