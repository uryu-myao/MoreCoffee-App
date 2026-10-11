# V1 screens and states with no mock (2026-10-11)

Sent with `design-brief-next.md`. Each item says what is built today (if anything) and the conditions to design against. Items added later come from `v1-status.md` once its "V1?" screens are decided.

## Screens

1. **Cup edit** (2c's pencil)
   - **Editable**: the bag, the gear, the date and time, My words; Barista / Packaged fields (café, drink, product, where bought).
   - **Shown but not editable**: the rating, the four axes, the flavours (they are Taste DNA's input; editing them would rewrite history the user has already seen). They need a look that says "not editable": does §1's disabled look fit, or is another treatment needed?
   - Reuse 5a / 5b, or a screen of its own?
   - Leaving with unsaved changes (`gaps.md` 20) applies here too.
   - Possibly "Delete this cup", with confirmation / undo (`gaps.md` 18, 34): not decided yet.
2. **2c for Barista and Packaged cups**: 2c is drawn for I made it only (bag + method). What replaces "What I logged" for a café cup (café, drink) and a packaged one (product, where bought)?
3. **Bag / gear picker** (built): a bottom sheet with §9's square radio rows; Method has "Brewer" / "Grinder" eyebrows under the sheet's "Method"; "Add a bag" / "Add gear" last.
4. **Flavour search sheet** (built), with a hard constraint: **on an SE, about 270pt / 5 rows stay above the keyboard** (measured, device-confirmed; rows 53.5pt; 9.5 rows with the keyboard closed). Also undrawn: the "Add \"Word\"" row; "Done" in place of 8l's "Cancel".
5. **Date sheet** (built): iOS spinner in the bottom sheet; the only option without OS round shapes.

## States

6. **Photo placeholder**, one visual for 2c's 210pt photo area and the small thumbnails (2a, the picker, 5a). There is no camera in V1, so this is what every cup and bag looks like. Square corners.
7. **Taste DNA card, axes with no value**: after a first cup, a new user has values on 1–2 of 4 axes. Today all four are shown, an empty one as a bare track with "Not noted" (four kept so the card's height never changes). How should three empty axes look?
8. **Taste DNA card with nothing noted**: no badge, a provisional line.

## Copy

9. **5a's intro line on an empty shelf** (it says "all of them start pre-filled" when nothing is).
10. **5d** (rating only in V1):
    - the reminder's second line, **promising no draft** (V1 has none): say why it can't be saved; input stays while on the screen; closing loses it;
    - the title for **one** missing item: don't count, don't repeat the star card's "Tap a star — this is the one thing the app can't guess.";
    - the footer line for one missing item (the mock: "Rating and café are still empty.").
11. **5c**:
    - an axis's **first** value: a start, not a movement;
    - the **summary sentence** ("This cup pushed you brighter and lighter."): 8 comparatives (Body and Roast both start "light"); not shown until written;
    - **nothing moved**.
12. **1b's "N more cups to lock it in"** (D-47): lock-in is 10, counted per axis; N counts the least-noted axis. Try next's 5 is separate (V2).
13. **Save failure** (today a plain alert with the technical error).
14. **3c's Bean name error** (built with 5d's vocabulary: "Bean name · required", error-coloured label and underline). Within the existing error set, or new?
