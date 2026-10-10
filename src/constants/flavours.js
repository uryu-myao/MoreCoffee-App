/**
 * The bundled flavour list: the starting point for 5b's flavour tags, never a
 * whitelist (design/components.md "Bundled flavour list and its groups").
 * One concrete name per flavour-wheel family; mock words first.
 *
 * group (decided 2026-10-10): which suggestions 8n's "How do you take your
 * coffee?" puts first — bright (acidity / origin) for "Black", round (body /
 * sweetness) for "With milk"; neutral words are never reordered. The ordering
 * itself is not built yet (stage 1 shows the list as is).
 */
export const BUNDLED_FLAVOURS = [
  { word: 'Jasmine', group: 'bright' },
  { word: 'Peach', group: 'bright' },
  { word: 'Grapefruit', group: 'bright' },
  { word: 'Blackcurrant', group: 'bright' },
  { word: 'Black tea', group: 'bright' },
  { word: 'Cocoa', group: 'round' },
  { word: 'Walnut', group: 'round' },
  { word: 'Caramel', group: 'round' },
  { word: 'Cinnamon', group: 'neutral' },
  { word: 'Smoke', group: 'neutral' },
];

/** At most this many flavours on a cup (5b "3 of 5"; cups.flavours enforces it). */
export const FLAVOUR_LIMIT = 5;
