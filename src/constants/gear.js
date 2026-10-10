/**
 * Gear pick list (design/components.md "Adding a bag and gear…"): 8c's generic
 * gear, verbatim (names and hints), each with the category it fills. 8c's
 * "I mostly drink out" is a setting, not gear, so it is not here.
 */
export const GEAR_TYPES = [
  { name: 'Pour-over dripper', hint: 'V60, Kalita…', category: 'brewer' },
  { name: 'Hand grinder', hint: 'C40, 1Zpresso…', category: 'grinder' },
  { name: 'French press', category: 'brewer' },
  { name: 'Espresso machine', category: 'brewer' },
];

/** At most this much gear on the shelf (3a "3 / 8 Selected · 5 slots left"). */
export const GEAR_LIMIT = 8;
