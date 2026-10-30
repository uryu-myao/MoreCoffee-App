/**
 * The bundled drink list: the starting point for a Barista cup's drink,
 * NEVER a whitelist (Uryu, 2026-10-30) — any name can be typed, and what was
 * typed joins the history, as with the flavour list. The drink sheet shows
 * this café's drinks first, then every drink logged, then these.
 *
 * source
 *   mock   drawn in the mocks: 5a / 5d "Flat white", 2a / 1b "House espresso"
 *   added  ours, to give the list a start (Uryu, 2026-10-30)
 */
export const BUNDLED_DRINKS = [
  { name: 'Flat white', source: 'mock' },
  { name: 'House espresso', source: 'mock' },
  { name: 'Latte', source: 'added' },
  { name: 'Cappuccino', source: 'added' },
  { name: 'Americano', source: 'added' },
  { name: 'Pour-over', source: 'added' },
  { name: 'Cold brew', source: 'added' },
];

/**
 * The drink sheet's rows from listDrinkHistory: this café's drinks (the last
 * one first, "Last time here"), every drink logged, then the bundled list;
 * one row per name, ignoring case. "Last time here" is ours; Design Round 16
 * (B3) changed only the sheet's placeholder.
 */
export function drinkItems({ here, all }) {
  const seen = new Set();
  const items = [];
  const add = (name, hint) => {
    const key = name.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    items.push({ key: name, label: name, hint });
  };
  here.forEach((name, i) => add(name, i === 0 ? 'Last time here' : undefined));
  all.forEach((name) => add(name));
  BUNDLED_DRINKS.forEach((d) => add(d.name));
  return items;
}
