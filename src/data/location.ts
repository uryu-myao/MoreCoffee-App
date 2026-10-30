import type * as ExpoLocation from 'expo-location';

/**
 * Where the phone is, for the café sheet only (decided 2026-10-30): to put
 * nearby cafés first, show distances and list the cafés around. Never
 * stored, and never needed: MapKit's typed search works without it.
 *
 * Asked on the first tap on a Café row (5a / 11a), never on opening 5a or
 * choosing Barista: a later cup takes the last cup's mode, so 5a could open on
 * Barista and the system prompt would come with no reason in view.
 *
 * Results
 *   { here }                      a position
 *   { here: null, reason: 'off' }  the permission is denied or restricted
 *   { here: null, reason: 'unavailable' }  no fix in time, or no native
 *       module (a build made before expo-location was added)
 */
export type Here = { lat: number; lng: number };
export type Located = { here: Here } | { here: null; reason: 'off' | 'unavailable' };

/** A position up to this old is good enough to sort cafés by. */
const LAST_KNOWN_MAX_AGE = 10 * 60 * 1000;
/** A fresh fix is given this long; the sheet works without one. */
const FIX_TIMEOUT = 8000;

let Location: typeof ExpoLocation | null | undefined;

/** expo-location, loaded on first use: its import throws when the build has no native module. */
function locationModule(): typeof ExpoLocation | null {
  if (Location === undefined) {
    try {
      Location = require('expo-location') as typeof ExpoLocation;
    } catch {
      Location = null;
    }
  }
  return Location;
}

const timeout = (ms: number) => new Promise<null>((resolve) => setTimeout(() => resolve(null), ms));

export async function locate(): Promise<Located> {
  const L = locationModule();
  if (!L) return { here: null, reason: 'unavailable' };
  try {
    let permission = await L.getForegroundPermissionsAsync();
    if (permission.status === 'undetermined' && permission.canAskAgain) permission = await L.requestForegroundPermissionsAsync();
    if (permission.status !== 'granted') return { here: null, reason: 'off' };
    const position =
      (await L.getLastKnownPositionAsync({ maxAge: LAST_KNOWN_MAX_AGE })) ??
      (await Promise.race([L.getCurrentPositionAsync({ accuracy: L.Accuracy.Balanced }), timeout(FIX_TIMEOUT)]));
    if (!position) return { here: null, reason: 'unavailable' };
    return { here: { lat: position.coords.latitude, lng: position.coords.longitude } };
  } catch (error) {
    console.warn('[location] no position', error);
    return { here: null, reason: 'unavailable' };
  }
}
