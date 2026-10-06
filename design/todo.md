# MoreCoffee — Structural TODOs

Moves and follow-ups that are neither drift (a design value to correct) nor a design gap. Each item says what is temporary and what has to be re-checked when it is resolved.

## T-1 · Move Tasting note (5b) into the Record overlay — logged 2026-10-06

**Now**: `TastingNoteScreen` stands in for the Try next tab (`src/screens/index.js`), **for verification only**. In the tab pager its header collapse and the bottom bar's hide / reveal can both be checked.

**Target**: Record coffee → 5b inside the Record overlay, as step 2 of 2 (back returns to step 1).

**To revert the stand-in**: set `tryNext` back to `TryNextPlaceholder` in `src/screens/index.js` and drop the `TastingNoteScreen` import. Also drop `TastingNoteScreen`'s bottom padding for the bar (`layout.empty.block`): the overlay covers the bar, and 5b's own foot is `layout.screen.bottom`.

**Re-check after the move**: the header collapse inside the overlay. Everything verified so far was outside a modal: the overlay has no ScrollChromeContext, and its own slide-up transform sits above the collapse.
