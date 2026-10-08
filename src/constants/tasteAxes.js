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
 */
export const TASTE_AXES = [
  { key: 'acidity', from: 'Acid', to: 'Bitter', steps: ['Very bright', 'Bright', 'Balanced', 'Bitter', 'Very bitter'] },
  { key: 'body', from: 'Light body', to: 'Full body', steps: ['Very light-bodied', 'Light-bodied', 'Medium-bodied', 'Full-bodied', 'Very full-bodied'] },
  { key: 'roast', from: 'Light roast', to: 'Dark roast', steps: ['Very light roast', 'Light roast', 'Medium roast', 'Dark roast', 'Very dark roast'] },
  { key: 'sweetness', from: 'Low sweetness', to: 'High sweetness', steps: ['Barely sweet', 'Lightly sweet', 'Medium sweet', 'Sweet', 'Very sweet'] },
];
