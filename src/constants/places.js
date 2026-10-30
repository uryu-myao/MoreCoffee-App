/**
 * Café lines: the distance and the visit count (5a's "250 m away · your 4th
 * visit"; the café sheet's meta lines).
 */

const EARTH_RADIUS_M = 6371000;
const rad = (deg) => (deg * Math.PI) / 180;

/** Metres between two { lat, lng } (haversine); null when either is unknown. */
export function distanceMetres(a, b) {
  if (!a || !b || a.lat == null || b.lat == null) return null;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h));
}

/** "250 m away" (to 10 m) / "1.2 km away" / "14 km away" (5a). */
export function distanceLine(metres) {
  if (metres == null) return undefined;
  if (metres < 1000) return `${Math.max(10, Math.round(metres / 10) * 10)} m away`;
  const km = metres / 1000;
  return `${km < 10 ? km.toFixed(1) : Math.round(km)} km away`;
}

const ordinal = (n) => {
  const tens = n % 100;
  if (tens >= 11 && tens <= 13) return `${n}th`;
  return `${n}${{ 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] ?? 'th'}`;
};

/** 5a's "your 4th visit", counting the cup being logged; nothing on a first visit. */
export const visitLine = (visitsBefore) => (visitsBefore > 0 ? `your ${ordinal(visitsBefore + 1)} visit` : undefined);

/** The café sheet's "4 visits" (ours; Design Round 16, B1: the rows confirmed). */
export const visitsHint = (visits) => (visits > 0 ? `${visits} ${visits === 1 ? 'visit' : 'visits'}` : undefined);
