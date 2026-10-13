import { partOfDay } from './dates';

/**
 * How a cup is named in lists and on its own page, degrading by mode (drift.md
 * D-16): made_it → bean name, barista → drink, packaged → product name.
 */
export const NONE = '—';

export const MODE_LABEL = { made_it: 'I made it', barista: 'Barista', packaged: 'Packaged' };

/** The mode as a list row's Badge (2a, 1b's recently sipped). */
export const MODE_BADGE = {
  made_it: { label: 'I made it', tone: 'success' },
  barista: { label: 'Barista', tone: 'info' },
  packaged: { label: 'Packaged', tone: 'neutral' },
};

const capitalise = (word) => word.charAt(0).toUpperCase() + word.slice(1);

/**
 * title and source line (2a's row, 2c's heading, 1b's recent rows).
 * I made it with no bag (a legitimate cup) is named by what it was brewed
 * with (decided 2026-10-12; Design 12b, 2026-10-13):
 *   bag      bean name · "roaster · process"
 *   brewer   brewer · "No bag · ‹grinder›" (the brewer is not repeated)
 *   grinder  grinder · "No bag"
 *   neither  "Morning cup" (the daypart 2c shows) · "No bag or gear noted"
 * noBag: how 2c says the absence, once, under its title (12a).
 * Barista / Packaged stay "—" until they have inputs.
 */
export function cupTitle(cup) {
  if (cup.mode === 'made_it') {
    if (cup.bean_name) {
      return {
        title: cup.bean_name,
        source: [cup.bean_roaster, cup.bean_process && capitalise(cup.bean_process)].filter(Boolean).join(' · ') || undefined,
      };
    }
    if (cup.brew_method) return { title: cup.brew_method, source: ['No bag', cup.grinder].filter(Boolean).join(' · '), noBag: 'No bag noted' };
    if (cup.grinder) return { title: cup.grinder, source: 'No bag', noBag: 'No bag noted' };
    return { title: `${partOfDay(new Date(cup.logged_at))} cup`, source: 'No bag or gear noted', noBag: 'No bag or gear noted' };
  }
  if (cup.mode === 'barista') return { title: cup.drink_type ?? NONE, source: cup.place_name ?? undefined };
  return { title: cup.product_name ?? NONE, source: cup.product_brand ?? undefined };
}

/**
 * My words as 2c and 2a's rows show them (2026-10-13, on device): empty
 * lines at the start and line breaks at the end are dropped, and between
 * lines at most one empty line is kept. The stored text is not changed.
 */
export const tidyNote = (note) =>
  note
    ? note
        .replace(/^(?:[ \t]*\n)+/, '')
        .replace(/\s+$/, '')
        .replace(/\n[ \t]*(?:\n[ \t]*)+\n/g, '\n\n')
    : '';
