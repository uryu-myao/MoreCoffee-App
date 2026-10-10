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
