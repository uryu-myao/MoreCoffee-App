/**
 * How a cup is named in lists and on its own page, degrading by mode (drift.md
 * D-16): made_it → bean name, barista → drink, packaged → product name.
 */
export const NONE = '—';

export const MODE_LABEL = { made_it: 'I made it', barista: 'Barista', packaged: 'Packaged' };

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
