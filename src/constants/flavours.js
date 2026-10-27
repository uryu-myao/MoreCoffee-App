/**
 * The bundled flavour list: the starting point for 5b's flavour tags, never a
 * whitelist (design/components.md "Bundled flavour list and its groups").
 * One concrete name per flavour-wheel family; mock words first.
 *
 * group (decided 2026-10-10): which suggestions 8n's "How do you take your
 * coffee?" favours — bright (acidity / origin) for "Black", round (body /
 * sweetness) for "With milk". Favouring puts that group first WITHOUT hiding
 * the other: the first five keep one or two of the rest (8n = "what you use
 * more, first", not "hide the rest"). Rule: design/components.md. The 8n
 * reordering is not built yet; the default order below is.
 */
export const BUNDLED_FLAVOURS = [
  // Default order interleaves the groups (decided 2026-10-10), so the first
  // five shown hold both directions (3 bright, 2 round) instead of five bright.
  { word: 'Jasmine', group: 'bright' },
  { word: 'Cocoa', group: 'round' },
  { word: 'Peach', group: 'bright' },
  { word: 'Walnut', group: 'round' },
  { word: 'Grapefruit', group: 'bright' },
  { word: 'Caramel', group: 'round' },
  { word: 'Blackcurrant', group: 'bright' },
  { word: 'Cinnamon', group: 'neutral' },
  { word: 'Black tea', group: 'bright' },
  { word: 'Smoke', group: 'neutral' },
];

/** At most this many flavours on a cup (5b "3 of 5"; cups.flavours enforces it). */
export const FLAVOUR_LIMIT = 5;

/**
 * A new word as stored (decided: stored with a capital first letter, shown in
 * caps): spaces trimmed and collapsed, first letter upper-cased, the rest as
 * typed ("black tea" → "Black tea", the bundled list's form).
 */
export const normalizeFlavour = (text) => {
  const t = text.trim().replace(/\s+/g, ' ');
  return t.charAt(0).toUpperCase() + t.slice(1);
};
