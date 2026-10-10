# MoreCoffee — Structural TODOs

Moves and follow-ups that are neither drift (a design value to correct) nor a design gap. Each item says what is temporary and what has to be re-checked when it is resolved.

## ~~T-1~~ · Move Tasting note (5b) into the Record overlay — logged 2026-10-06, **done 2026-10-07**

**Done**: Try next is its placeholder again. 5b is step 2 of the Record sheet, opened by "Add tasting note" (push from the right, `motion.expand`) with Back returning to step 1. The bar padding is gone (its foot is `max(safe area, layout.screen.bottom)`). Re-checked inside the sheet: the collapse behaves the same (`design-system.md` §9 Header collapse). The history below is kept.

**Now**: `TastingNoteScreen` stands in for the Try next tab (`src/screens/index.js`), **for verification only**. In the tab pager its header collapse and the bottom bar's hide / reveal can both be checked.

**Target**: Record coffee → 5b inside the Record overlay, as step 2 of 2 (back returns to step 1).

**To revert the stand-in**: set `tryNext` back to `TryNextPlaceholder` in `src/screens/index.js` and drop the `TastingNoteScreen` import. Also drop `TastingNoteScreen`'s bottom padding for the bar (`layout.empty.block`): the overlay covers the bar, and 5b's own foot is `layout.screen.bottom`.

**Re-check after the move**: the header collapse inside the overlay. Everything verified so far was outside a modal: the overlay has no ScrollChromeContext, and its own slide-up transform sits above the collapse.

## T-2 · Flavour tags: Search opens nothing yet — logged 2026-10-08

**Now**: when the flavour tags are built, their **Search** opener is pressable (button role, press feedback) but **does nothing**.

**Target** (decided 2026-10-08): Search opens a bottom sheet with a search field and a candidate list. A query with no match offers **Add "xxx"**, which adds a new flavour (the same way out as typing a café by hand when MapKit has no match).

**Why it waits**: the sheet (component #25) and the search field (#24) are not built. The order was changed for this:
1. flavour tags (the tags themselves; Search inert);
2. search field / bottom sheet;
3. wire Search to the sheet.

**Re-check when wired**: at the selection limit Search is locked with the options (§1 Selection limit).

## T-4 · 5a's "Add a bag" / "Add gear" lead nowhere yet — logged 2026-10-10

**Now (5a stage 1)**: with no bag or no gear, 5a's rows show "Add a bag" / "Add gear" without a required mark (§1 Required marks), and pressing them does nothing. 3c (add a bag) and 3a (add gear) are not built.

**Consequence**: someone with no bag (8o skipped) has no way to register one, so every cup they log has no bean details. Taste DNA's axes still work, but Try next and the bean side do not.

**Target**: the rows open 3c / 3a. Priority: see the 5a stage plan.

## V1 candidates

- **The bag's printed flavours as the first flavour suggestions** (2026-10-09).
  - When a cup is logged from a bag, offer that bag's `notes` (the flavours printed on it: Jasmine, White peach, Black tea) first among 5b's flavour suggestions, ahead of history and the bundled list.
  - They are the words on the bag being brewed right now, so the best guess; local, no backend.
  - Needs a notes field in 3c / 3g, not built until this is adopted (`data-model.md` `beans.notes`).
  - Decide once the flavour tags work.

## T-3 · 8j Send feedback: no sending path — logged 2026-10-10

8j's form (topic, message, screenshot, app version, reply email) has nowhere to send to. Mail composer, a form endpoint and a backend are all undecided. Outside the capture loop. **Do not build the screen until the path is defined.**

## V2 candidates

Out of V1's scope (the capture → Taste DNA loop only). Kept so the idea is not lost; treated like Try next and Atlas.

- **Filter Records by a taste attribute** (2026-10-07): tapping 6a's "Acidity high" or 8d's "Blackcurrant" would lead to the records with that attribute. No mock draws the destination, and 8l's search covers words / beans / gear / rating, not attributes. It would be a new screen, so it is not built in V1. The attribute tags stay display-only (`design-system.md` §1 Tap affordance).
