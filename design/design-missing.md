# V1 screens and states with no mock (updated 2026-10-11, scope decided)

Sent with `design-brief-next.md`. Each item says what is built today (if anything) and the conditions to design against.

**Scope** (`v1-status.md`): what Uryu needs to log his own coffee every day — mostly I made it, sometimes Packaged. Items tied to screens outside that scope are kept here, marked **[not at this stage]**: not "not needed", only not now. **This round asks Design for the items marked [this round].**

## Screens

1. **[this round] Cup edit** (2c's pencil)
   - **Editable**: the bag, the gear, the date and time, My words; Packaged's product name. (Barista's café and drink: not at this stage.)
   - **Shown but not editable**: the rating, the four axes, the flavours (Taste DNA's input; editing them would rewrite history the user has already seen). They need a look that says "not editable": does §1's disabled look fit, or is another treatment needed?
   - **Date limits**: not in the future; not before the bag's roast date (when it has one).
   - **"Delete this cup" (decided, in V1)**: on this screen only, never from the list. Confirmed in a **bottom sheet** (this design has no dialogs). The words say what is lost — this cup and its axes, flavours and My words — and that it cannot be undone. They also say ahead that **Taste DNA is recalculated without this cup** (its values will change; no notice afterwards).
   - Reuse 5a / 5b, or a screen of its own?
   - Leaving with unsaved changes (`gaps.md` 20) applies here too.
2. **2c for Packaged and Barista cups**: 2c is drawn for I made it only (bag + method).
   - **[this round] Packaged**: what replaces "What I logged" for a packaged cup, which records only a product name (item 15)?
   - **[not at this stage] Barista** (café, drink).
3. **[this round, built — please check] Bag / gear picker**: a bottom sheet with §9's square radio rows; Method has "Brewer" / "Grinder" eyebrows under the sheet's "Method"; "Add a bag" / "Add gear" last.
4. **[this round, built — please check] Flavour search sheet**, with a hard constraint: **on an SE, about 270pt / 5 rows stay above the keyboard** (measured, device-confirmed; rows 53.5pt; 9.5 rows with the keyboard closed). Also undrawn: the "Add \"Word\"" row; "Done" in place of 8l's "Cancel".
5. **[this round, built — please check] Date sheet**: iOS spinner in the bottom sheet; the only option without OS round shapes (compact and inline bring a pill and a round selected day).
6. **[this round] Packaged: the product name** (5a, Packaged selected)
   - **One FieldRow**, like 5a's Bag row: the product name only. No brand, container or where bought (there is no built-in brand table, and none is planned: the long tail is endless).
   - **Free text + completion from the user's own past products** (as the flavour Search sheet completes from history).
   - The rating, axes and flavours work as for any cup.
   - With no product yet, the row is an invitation, without a required mark (§1 Required marks: a mark promises "always filled").

## States

7. **[this round] Photo placeholder**, one visual for 2c's 210pt photo area and the small thumbnails (2a, the picker, 5a). There is no camera in V1, so this is what every cup and bag looks like. Square corners. (Design's hand-made work.)
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
13. **[this round] 1b's "N more cups to lock it in"** (D-47): lock-in is 10, counted per axis; N counts the least-noted axis. Try next's 5 is separate (V2).
14. **[this round] Save failure** (today a plain alert with the technical error).
15. **[this round] 3c's Bean name error** (built with 5d's vocabulary: "Bean name · required", error-coloured label and underline). Within the existing error set, or new?
