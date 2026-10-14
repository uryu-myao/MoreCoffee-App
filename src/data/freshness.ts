import { daysSince } from '../constants/dates';

/**
 * Bean freshness (gaps.md 8, decided 2026-10-14). See data-model.md
 * "Freshness".
 *
 * These windows are a REFERENCE, not a prediction. The real window depends on
 * the roast level, the packaging (a valve or not), storage temperature, the
 * brew method and whole bean vs ground — none of which the app knows. They
 * are the industry's most-used ranges, and the app shows them as a guide.
 *
 * Counted from the ROAST date (degassing starts at the roast; 3g "Recounted
 * from the roast date"; two bags side by side share one "today"). One window
 * for every roast level: a per-level window is V1.5 (the level is the
 * roaster's own claim, coarse, and a second rule would look more precise
 * without being better founded).
 *
 *   resting    day 0 – 6     (drinkFrom − 1)
 *   drinkNow   day 7 – 21    the peak band, 7/42 – 21/42 of the bar
 *   pastPeak   day 22 +      the bar stays full past `span`
 *
 * "Stale" (8i, 6a) is a different signal: 21+ days since OPENING (oxidation
 * after opening). Not built at this stage.
 */
export const FRESHNESS_TUNING = {
  /** first day of the drinking window */
  drinkFrom: 7,
  /** last day of the drinking window */
  drinkUntil: 21,
  /** the bar's full length in days (twice the window; a display choice, not science) */
  span: 42,
} as const;

export type FreshnessState = 'resting' | 'drinkNow' | 'pastPeak';

export type Freshness = { day: number; state: FreshnessState; elapsed: number };

/** The bag's freshness today, or null without a roast date (nothing is shown then). */
export function freshnessOf(roastedAt: number | null): Freshness | null {
  if (roastedAt == null) return null;
  const day = Math.max(0, daysSince(roastedAt));
  const { drinkFrom, drinkUntil, span } = FRESHNESS_TUNING;
  const state: FreshnessState = day < drinkFrom ? 'resting' : day <= drinkUntil ? 'drinkNow' : 'pastPeak';
  return { day, state, elapsed: Math.min(day, span) / span };
}

/** The state as the label words it: "Day 7 · drink now". */
export const FRESHNESS_WORDS: Record<FreshnessState, string> = {
  resting: 'resting',
  drinkNow: 'drink now',
  pastPeak: 'past peak',
};
