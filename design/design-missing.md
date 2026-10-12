# V1 screens and states with no mock (updated 2026-10-11, after Design's report)

Sent with `design-brief-next.md`. Each item says what is built today (if anything) and the conditions to design against.

**Scope** (`v1-status.md`): what Uryu needs to log his own coffee every day — mostly I made it, sometimes Packaged. Items tied to screens outside that scope are kept here, marked **[not at this stage]**: not "not needed", only not now. **This round asks Design for the items marked [this round].**

## Screens

1. **[this round] Cup edit** (2c's pencil)
   - **Editable**: the bag, the gear, the date and time, My words; Packaged's product name. (Barista's café and drink: not at this stage.)
   - **Shown but not editable**: the rating, the four axes, the flavours (Taste DNA's input: if they changed while each cup's stored change stayed, the history would become false). **Decided look: 2c's read-only display** — the entered (brown) AxisReadout, flavour Badges with no frame, stars that do not press. **Not** the disabled look, which is only for options in a set (§1 "Values that cannot be edited are displayed").
   - **Date limits**: not in the future; not before the bag's roast date (when it has one).
   - **Date wins over bag (decided 2026-10-11)**: a bag whose roast date is after the cup's date cannot be chosen. **Please design how the picker shows such a bag** (present but not selectable, and why).
   - **"Delete this cup" (decided, in V1)**: on this screen only, never from the list. Confirmed in a **bottom sheet** (this design has no dialogs). The words say what is lost — this cup and its axes, flavours and My words — and that it cannot be undone. They also say ahead that **Taste DNA is recalculated without this cup** (its values will change; no notice afterwards).
   - Reuse 5a / 5b, or a screen of its own?
   - Leaving with unsaved changes (`gaps.md` 20) applies here too.
2. **2c for Packaged and Barista cups**: 2c is drawn for I made it only (bag + method).
   - **[this round] Packaged**: what replaces "What I logged" for a packaged cup, which records only a product name (item 6)?
   - **[not at this stage] Barista** (café, drink).
3. **[this round, built — please check] Bag / gear picker**: a bottom sheet with §9's square radio rows; **the field's name is the sheet title in `display.sm`** (fixed 2026-10-11: as an eyebrow it stacked over Method's "Brewer" / "Grinder" eyebrows); "Add a bag" / "Add gear" last. A single-select row's **marker** shows selection (§1 Tap affordance, scope added 2026-10-11).
4. **[this round, built — please check] Flavour search sheet** (§9 Bottom sheet, `full` variant). **Hard constraint — measured on an SE (375 × 667):**
   - sheet top at 32; handle, search field (46) and Done take it to **125, where the list starts**;
   - rows: the first 52 (+ the list's 2px frame), each next one **53.5**; the **"Add \"Word\"" row is the same** (52 / 53.5);
   - with the keyboard up (260 incl. the predictive bar) the list has **270pt: 5 full rows** — the 270 is counted **from the list's top (below the search field) to 12 above the keyboard**, not from the sheet's top;
   - keyboard closed: about 9.5 rows. Confirmed on a device.
   - Also undrawn: the "Add \"Word\"" row; "Done" in place of 8l's "Cancel".
5. **[this round, built — please check] Date sheet**: iOS spinner in the bottom sheet; the only option without OS round shapes (compact and inline bring a pill and a round selected day).
6. **[this round] Packaged: the product name** (5a, Packaged selected)
   - **One FieldRow**, like 5a's Bag row: the product name only. No brand, container or where bought (there is no built-in brand table, and none is planned: the long tail is endless).
   - **Free text + completion from the user's own past products** (as the flavour Search sheet completes from history).
   - The rating, axes and flavours work as for any cup.
   - With no product yet, the row is an invitation, without a required mark (§1 Required marks: a mark promises "always filled").
   - **Brand stays empty at this stage**: 2a's list row has brand on line 2 for Packaged (§9 List row). **Please design how a row looks with line 2 empty.**
   - **Bought at: [not at this stage]** (§9 keeps the row, marked).

## States

7. **[drawn 2026-10-12 (10a), built] Photo placeholder**, one visual for 2c's 210pt photo area and the small thumbnails (2a, the picker, 5a's Bag row). There is no camera in V1, so this is what every cup and bag looks like. Square corners. (Design's hand-made work.)
   - **Photo slots are not shown at this stage** (decided 2026-10-11): 5a's "Add a photo" and 3c's 76px slot are gone, since nothing can be added. The placeholder is still needed: it is how "no photo" looks wherever a thumbnail is.
8. **[this round] Taste DNA card, axes with no value**: after a first cup, a new user has values on 1–2 of 4 axes. Today all four are shown, an empty one as a bare track with "Not noted" (four kept so the card's height never changes). How should three empty axes look? We propose nothing.
9. **[this round] Taste DNA card with nothing noted**: no badge, a provisional line.

## Copy

10. **[this round] 5a's intro lines that are no longer true**:
    - I made it on an empty shelf: it says "all of them start pre-filled" when nothing is;
    - Packaged and Barista: "— two fields left." while those fields cannot be filled yet (Packaged until its product-name row; Barista not at this stage).
11. **[this round] 5d** (rating only in V1):
    - the reminder's second line, **promising no draft** (V1 has none): say why it can't be saved; input stays while on the screen; closing loses it;
    - the title for **one** missing item: don't count, don't repeat the star card's "Tap a star — this is the one thing the app can't guess.";
    - the footer line for one missing item (the mock: "Rating and café are still empty.").
12. **[this round] 5c**:
    - an axis's **first** value: a start, not a movement. The provisional line "First note on Light roast / Dark roast." names the **axis** (both poles), not a **direction**: a first record has no direction. The line must say "this axis has begun", without pointing either way;
    - the **summary sentence** ("This cup pushed you brighter and lighter."): 8 comparatives (Body and Roast both start "light"); not shown until written;
    - **nothing moved**.
13. **[this round] 1b's "N more cups to lock it in"** (D-47): lock-in is 10, counted per axis; N counts the least-noted axis. **Once locked, it stays locked**: a first note on a new axis does not un-lock it (decided 2026-10-11). Try next's 5 is separate; 1b's "3 OF 5 CUPS" is not shown at this stage.
16. **[this round] 1b's greeting**: the mock says "Good morning". We show "Good afternoon" / "Good evening" (evening also at night) by part of day — ours, to confirm or replace.
17. **[this round] 1b's line under the counts** ("A slow start is still a start."): one sentence with no rule for when it applies (a slow week? always?). **Not shown** until there is a rule and a line for each case.
14. **[this round] Save failure** (today a plain alert with the technical error). What it cannot promise yet — a retry, and that closing loses the input — belongs with `gaps.md` 30 (no drafts).
15. **[this round] 3c's Bean name error** (built with 5d's vocabulary: "Bean name · required", error-coloured label and underline). Within the existing error set, or new?

## Copy: Design's proposals (report of 2026-10-11) — adopted, in the app

- **10 (5a, empty shelf)**: "Marked fields are required. Add a bag and your gear once — after that they start pre-filled."
- **11 (5d, rating only)**: title "Still needs a rating"; second line "A cup can't be saved without one. What you've entered stays while you're here; closing loses it."; footer "No rating yet."
- **12 (5c / 2c)**:
  - first value: "Starts at ‹step name›" (a position, not a direction);
  - summary: "This cup pushed you ‹phrases›." — moved axes only, joined with "and" (3–4: commas, then "and"). Phrases: Acid ↔ Bitter brighter / more bitter; Body lighter-bodied / fuller-bodied; Roast toward lighter roasts / toward darker roasts; Sweetness less sweet / sweeter;
  - nothing moved: "Your Taste DNA stays where it was — nothing on this cup moves it." **A move that rounds to 0 points is "nothing moved"**; no separate wording (such as "held").
- **13 (1b)**: "Body needs 3 more notes to lock in." / "Body and Roast need 3 more notes each." / "1 more note". Notes, not cups: a cup that skips an axis does not count for it. **Locked in, once reached, stays; it can return to early signs only if deleting cups means the condition was never met.** The delete confirmation says Taste DNA is recalculated, so it is announced.
- **14 (save failure)**: "Couldn't save this cup" / "Your phone couldn't store it. Everything you entered is still here — try again." / "Try again" (primary). Open points (retry any number of times; closing after a failure loses the input): `gaps.md` 30. Today an iOS alert, with iOS's own Cancel beside "Try again" so a lasting failure does not trap the user.
- **15 (3c's Bean name error)**: within the existing set — label and underline in `state.error.text` / `state.error.border`, the field's own 2px underline in colour only. New is where it applies: the first text input with an error (§9).
- **Still provisional (no copy yet)**: the Taste DNA card's lines for "nothing noted" and "Locked in" (item 9 and 8f's "From N cups").
