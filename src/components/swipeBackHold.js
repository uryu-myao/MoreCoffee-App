import { createContext, useMemo, useState } from 'react';

/**
 * While a bottom sheet is open on a screen that swipes back from its left
 * edge, the swipe is held (2026-10-14, on device: turning 3c's date spinner
 * near the left edge counted as a swipe, and the page slid away under the
 * open sheet). A sheet covers the screen; going back is the sheet's Done or
 * its scrim, not the edge.
 *
 * The swiping screen (PushedScreen, the Record sheet's second step) owns a
 * hold with useSwipeBackHold() and provides it; BottomSheet takes the hold
 * while it is mounted.
 */
export const SwipeBackHoldContext = createContext(null);

/** [held, value]: value goes in SwipeBackHoldContext.Provider; held disables the swipe. */
export function useSwipeBackHold() {
  const [holds, setHolds] = useState(0);
  const value = useMemo(
    () => ({
      hold: () => setHolds((n) => n + 1),
      release: () => setHolds((n) => Math.max(0, n - 1)),
    }),
    []
  );
  return [holds > 0, value];
}
