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

## Stage 3 screens to look at
- **Bag / Method picker** (no mock): a bottom sheet with §9's square radio rows; Method has "Brewer" / "Grinder" eyebrows under the sheet's own "Method" eyebrow; "Add a bag" / "Add gear" as the last row.

- **Taste DNA card (1b / 4a / 4b)**, built with AxisReadout. Please look at:
  - **An axis with nothing noted — please decide; we propose nothing.** Conditions:
    - A new user, after one cup, has values on only 1–2 of the 4 axes. That is the first Taste DNA they see.
    - Today all four axes are shown; an axis with no value is an empty track with "Not noted" under it.
    - Four are always shown because a changing number of axes changes the card's height.
    - How should three empty axes in a row look?
  - **No cups noted at all**: no badge, and a provisional line ("Note what you taste on a cup to start it.").
  - The sticker badge has no 1.5px border (a Badge never has one).

## Copy we need from Design (not written by us)
- **5a's intro line on an empty shelf** (`gaps.md` 28): with no bag and no gear the line says "all of them start pre-filled" while Bag and Method read "Add a bag" / "Add gear". Please write the empty-shelf form.

- **5d's reminder card, second line**: it must not promise a draft. Conditions: say why the cup can't be saved yet; while on this screen, what was entered stays; it is not kept as a draft; closing loses it. (V1 has no drafts; see `gaps.md` 30.)
- **5d with one thing missing**: in V1's I made it, only the rating can be missing. The rating is "the one thing the app can't guess", and the star card already says "Tap a star — this is the one thing the app can't guess." Please write the reminder card's title and the footer line ("Rating and café are still empty." in the mock) for one missing item, **without counting** ("One answer is…" reads oddly) and **without repeating the star card's line**.

## Please check
- **3c's Bean name error**: pressed with no name, the field takes 5d's vocabulary (label "Bean name · required" and the underline in the error colour). No mock draws an inline input error. Is this within the existing error set, or did we invent something?
- **Intro block**: 5a's opening line now has a surface (`color.surface.raised`, no frame); other explanation lines have none. Should other screens' opening explanations get the same?
- **D-46's side effect**: the removed square was the example of "Marked". The section labels still carry the mark; you may want another way to show it.

- **Taste DNA copy (decided rules in brief)**:
  - **1b's "N more cups to lock it in" (D-47)**: lock-in is **10**, counted **per axis**; the profile locks in when every axis with a record has 10. "N more" counts the axis with the fewest records. Try next's 5 is a separate threshold (V2, not shown in V1).
  - **8f contradicts itself**: the summary says "lightly sweet", the Sweetness axis says "Medium sweet". Which is right?
  - **8f's summary sentence ("Bright, juicy, lightly sweet")**: from which axes and which words is it built? "juicy" is neither a band name nor a bundled word.
  - **6a's labels ("Acidity high", "Body light", "Roast light")** differ from the band names (Bright, Light-bodied, Light roast). Match them, or is 6a a summary that may differ?
  - **6b's Reset line ("Only the profile is rebuilt")**: Reset now means "count from this day"; the profile builds up again from that day, it is not rebuilt from the old cups.

## Decisions that change mocked parts (2026-10-11)
- **5a / 5e intro line**: on `color.surface.raised`, no frame, no leading square (drift D-46).

## Drift not yet sent
- D-7 to D-16 (never part of group A): see `drift.md`.
- D-43: 3g's caption still points at 3d's removed "Edit" → "From 3d → tap a card".

## Still waiting for Design's reports
- D-37 (dashed underline = optional?), D-38 (placeholder colour, and now the entered-text colour), D-39 (setup footer 38), and 6a's "My shelf" heading: see `design-brief-closing.md`.
