# Design brief — next round (collecting; not sent yet)

Items for Design's next request, gathered as they come. Send together; group B items only as implementation reaches them.

## Decisions that override the mocks
- **5b's second button**: "Save without the note" while nothing is entered; **"Discard and save"** once any axis, flavour or word is (`design-system.md` §1 Saving a cup, 2026-10-10).
- **5b flavour suggestions, default order interleaved**: Jasmine, Cocoa, Peach, Walnut, Grapefruit, Caramel, Blackcurrant, Cinnamon, Black tea, Smoke. Five are shown (selected + suggestions) plus Search (`components.md`).
- **5a with an empty shelf**: rows read "Add a bag" / "Add gear" in `text.secondary`, and "From my shelf" loses its required mark (§1 Required marks).

## Stage 2 screens to look at (built from existing parts; no mock draws them)
- **3c (minimal), "Add a bag"**: Bean name, Roaster, Roasted on (8o's set), "Open this bag", "N / 5 Bags open".
- **3a (minimal), "Add gear"**: 8c's four generic gear as a checkbox list, "N / 8 Selected", "Save N items", "N slots left".
- **Date sheet (Roasted on)**: iOS spinner in the bottom sheet. The spinner was the only realistic choice: compact (a rounded pill + popover) and inline (a month grid with a round selected day) both bring the OS's round shapes against the square-only rule. Text is set to `text.primary`; the OS still draws a light rounded selection band.
- **Flavour search sheet**: full height, from under the status bar to the keyboard.
  - **Constraint, please design within it. Measured on an SE (375 × 667) and confirmed on a device: about 270pt / 5 rows stay above the keyboard; 9.5 rows with it closed; rows are 53.5pt.** (The first estimate was 282pt.) Closing the keyboard moves only the sheet's bottom edge; nothing jumps.
  - The **Add "Word"** row (a dashed box with a plus) is undrawn.
  - "Done" beside the field: 8l says "Cancel", but picks apply as they are made.
  - The placeholder "Search flavors" is ours.

## Drift not yet sent
- D-7 to D-16 (never part of group A): see `drift.md`.
- D-43: 3g's caption still points at 3d's removed "Edit" → "From 3d → tap a card".

## Still waiting for Design's reports
- D-37 (dashed underline = optional?), D-38 (placeholder colour, and now the entered-text colour), D-39 (setup footer 38), and 6a's "My shelf" heading: see `design-brief-closing.md`.
