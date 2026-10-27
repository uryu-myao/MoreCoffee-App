/**
 * Gesture state log (debug, 2026-10-07): which handler reached which state,
 * and when, so a device reproduction says who won instead of us guessing.
 *
 * Turn on with GESTURE_LOG = true and reload. Lines appear in the Metro
 * terminal as:
 *   [gesture] +1234ms axis:Acid.pan ACTIVE x=52.0 step=1
 * Times are ms since the first logged event of the touch sequence.
 *
 * States, gesture-handler's names:
 *   BEGAN   touch down, recognising
 *   ACTIVE  recognised: this handler owns the gesture
 *   END     finished after ACTIVE (success)
 *   CANCELLED  taken away after ACTIVE
 *   FAILED  never activated (another handler won, or the touch did not qualify)
 *   AT_END  axis only: the value reached 0 or 100 while dragging
 * The sheet pager also logs UIKit's own scroll callbacks (DRAG_BEGIN / DRAG_END).
 */
export const GESTURE_LOG = false;

let t0 = 0;
let last = 0;

/** Call on the JS thread (from a worklet: scheduleOnRN(logGesture, …)). */
export function logGesture(who, state, extra = '') {
  if (!GESTURE_LOG) return;
  const now = Date.now();
  if (now - last > 1500) t0 = now; // a new touch sequence
  last = now;
  // eslint-disable-next-line no-console
  console.log(`[gesture] +${String(now - t0).padStart(4)}ms ${who} ${state}${extra ? ' ' + extra : ''}`);
}
