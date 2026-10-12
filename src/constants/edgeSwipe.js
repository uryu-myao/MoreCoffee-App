import { size } from '../theme/tokens';

/**
 * Swipe back from the left screen edge (iOS's convention), tuned on device
 * for the Record sheet (2026-10-08; design-system.md §9 Record sheet steps):
 *   EDGE           size.tapTarget (44): one tap target wide — 22 was too hard
 *                  to hit, and nothing inside a screen starts that far left.
 *   ACTIVE_OFFSET_X 10: horizontal travel before the swipe takes the touch.
 *   FAIL_OFFSET_Y  ±30: a thumb swipe drifts; horizontal 10 still decides first.
 *   BACK_*         25% of the width, or a 300pt/s flick.
 * Shared by the Record sheet and pushed screens (2c), so both feel the same.
 */
export const EDGE = size.tapTarget;
export const ACTIVE_OFFSET_X = 10;
export const FAIL_OFFSET_Y = 30;
export const BACK_DISTANCE = 0.25;
export const BACK_VELOCITY = 300;
