/**
 * Calendar days, in local time. A date the user picks (a roast date) is a day,
 * not an instant: it is stored as that day's local midnight, and day counts
 * are whole calendar days between local midnights (rounded, so a DST shift
 * never makes "day N" off by one).
 */
export const DAY_MS = 86400000;

/** Local midnight of the day `date` falls on, in ms. */
export const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

/** Whole calendar days from the day `ms` falls on to today. */
export const daysSince = (ms) => Math.round((startOfDay(new Date()) - startOfDay(new Date(ms))) / DAY_MS);

const short = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
const withYear = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

/** "Apr 1" (3c), with the year only when it is not this year. */
export const formatDay = (ms) => {
  const d = new Date(ms);
  return (d.getFullYear() === new Date().getFullYear() ? short : withYear).format(d);
};

/**
 * Part of day, as 5a / 5e / 2c word it ("Morning", "Afternoon"). Intl has no
 * equivalent of these words (its dayPeriod gives "in the morning"), so this is
 * copy. TODO(i18n): translate with the other strings; the hour boundaries are
 * an assumption, not from a mock.
 */
export function partOfDay(date) {
  const h = date.getHours();
  if (h >= 5 && h < 12) return 'Morning';
  if (h >= 12 && h < 17) return 'Afternoon';
  if (h >= 17 && h < 22) return 'Evening';
  return 'Night';
}

/** Whole calendar days from the day `fromMs` falls on to the day `toMs` falls on. */
export const daysBetween = (fromMs, toMs) => Math.round((startOfDay(new Date(toMs)) - startOfDay(new Date(fromMs))) / DAY_MS);
