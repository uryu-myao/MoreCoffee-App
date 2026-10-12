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

/** title and source line (2a's row; 2c's heading falls back the same way). */
export function cupTitle(cup) {
  if (cup.mode === 'made_it') {
    return {
      title: cup.bean_name ?? NONE,
      source: [cup.bean_roaster, cup.bean_process && capitalise(cup.bean_process)].filter(Boolean).join(' · ') || undefined,
    };
  }
  if (cup.mode === 'barista') return { title: cup.drink_type ?? NONE, source: cup.place_name ?? undefined };
  return { title: cup.product_name ?? NONE, source: cup.product_brand ?? undefined };
}
