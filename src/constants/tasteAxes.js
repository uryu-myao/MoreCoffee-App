/**
 * The four Taste DNA axes (design-system.md §9 Taste axis slider): pole labels
 * as on 5b (low pole first), and the five step names read by the screen reader.
 *
 * Step names (decided 2026-10-08): adjectives per axis, not a template over
 * the pole labels ("Strongly light body" is not English). The middle step takes
 * the most natural word in each axis's domain, so it differs between axes.
 * Bright, not "Acidic" (negative in English; the mocks say Bright). Roast stays
 * a noun phrase. Sweetness is one-directional, so its weakest step is
 * "Barely sweet".
 *
 * name: the axis as one noun, for 1b's lock-in line ("Body needs 3 more notes
 * to lock in", Design 2026-10-11) — 6a's words (Acidity, Body, Roast).
 */
export const TASTE_AXES = [
  { key: 'acidity', name: 'Acidity', from: 'Acid', to: 'Bitter', steps: ['Very bright', 'Bright', 'Balanced', 'Bitter', 'Very bitter'] },
  { key: 'body', name: 'Body', from: 'Light body', to: 'Full body', steps: ['Very light-bodied', 'Light-bodied', 'Medium-bodied', 'Full-bodied', 'Very full-bodied'] },
  { key: 'roast', name: 'Roast', from: 'Light roast', to: 'Dark roast', steps: ['Very light roast', 'Light roast', 'Medium roast', 'Dark roast', 'Very dark roast'] },
  { key: 'sweetness', name: 'Sweetness', from: 'Low sweetness', to: 'High sweetness', steps: ['Barely sweet', 'Lightly sweet', 'Medium sweet', 'Sweet', 'Very sweet'] },
];
