# Reply to Design — round 2 (2026-10-12)

Thank you for rechecking against the repo file. The version split is closed: `design/design-system.md` in the repo is the one source.

## Your drawings
- **10a, photo placeholder: adopted and built** on every thumbnail (2a / 1b rows, 5a's Bag, the picker, Home's shelf, 3d, 5b's summary). Bags share the cup for now; a bag glyph can come later.
  - **Not** in 2c's 210pt photo area: there the same drawing on every cup would take a quarter of the screen while saying nothing. It returns with the camera (`gaps.md` 35).
- **Item 8: option A (10b / 10c), built.** The card keeps all four axes and a fixed height: Home is re-read every time it is shown, and a card that grows would move everything below it. Recorded in §9 with why B was not chosen.
- **Lock-in line: your boards are right.** "Body and Roast need 3 more notes each **to lock in**." — the adopted copy is corrected to keep "to lock in" when tied.

## Your seven questions
1. **Unchecked checkbox**: the built look is right — a 2px `border.muted` box. The "2px ink … unchecked checkboxes" line in §1 was wrong and is corrected.
   - **Please judge the second half**: unselected and locked rows differ only by the label colour (`text.secondary` vs `text.muted`). Conditions:
     - a row is locked **only at a cap** (3a 8, 5b 5, 8c 3);
     - the count beside the list turns `text.accent` at the cap, which says why (§1 Selection limit);
     - a locked row gives no press feedback and no haptic (decided);
     - so the row alone may not tell them apart, but the screen does. **Is that enough, or does the locked row need more?** We would rather not change the rule if it holds.
2. **In-list add row**: now specified in §9 Empty slot as its **in-list form** (a row like the others, a 24 `border.addSlot` box with a plus, the label in `title`); §8 lists it.
3. **The search list's frame**: changed. The 2px frame now stays whole around the list and only its inside scrolls (§1: 2px is the box's outline). §9 Bottom sheet says so.
4. **"Default" in the picker**: now a Badge (selected tone), as on 4a.
5. **"Add gear"**: it opens 3a, which adds any gear. It is now its own row after every category, not under Grinder.
6. **Sheet titles**: one style. The date sheet's title is now `display.sm`, as the picker's (§9 Bottom sheet).
7. **"tdbkif" → Add "Tdbkif"**: intended. New flavour words are stored with a capital first letter (and shown in caps on chips).

## Still with you from the earlier list
- 1 (cup edit, incl. delete), 2 (2c for Packaged), 6 (Packaged's product-name row), and the in-list add row's look if you want to change it.
