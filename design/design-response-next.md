# Design response — design-missing.md

## Round 5 (2026-10-13): after deleting a cup, the notice (Turn 13)
- Confirming in 11b returns to Records (2a). A one-line notice sits 12 above the tab bar, inset 22pt left and right (the page margin, lined up with the full-width tab bar's icons). Updated to match the build; the earlier 90% came from the old floating tab bar.
- Look: `surface.inverse` + `text.onInverse`, square, no border and no shadow, min 48 tall, padding 13 / 16.
- Copy: "‹cup title› deleted." The title follows 2a's row-title rule. The name truncates; "deleted." never does.
- Timing: enters with `motion.expand` (fade + rise 8), holds 2s, fades out. Not tappable, no Undo (11b says it can't be undone).
- Accessibility: announce the sentence; with Reduce Motion on, fade only.

---

## Round 4 (2026-10-13): 11a open points (19–26)

19. **Leaving with unsaved changes**: a bottom sheet, the same shape as 11b. Back and the edge swipe both lead to it: catch the leave (navigation `beforeRemove`) instead of only the Back button. With no changes, leave silently.
    - Title: "Discard your changes?"
    - Body: "Your edits to this cup won't be saved. The cup stays as it was."
    - Primary: "Keep editing". Secondary text button: "Discard changes".
    - The same applies to 3e / 3g / 6d.
20. **Yes, offer "No bag"** in 11a's picker only: the first row, a square radio like the others. Label "No bag", meta "This cup wasn't from a bag." Choosing it puts the row back to "No bag noted".
21. **Confirmed: no "Add gear" in 11a.** Editing corrects a record; it doesn't stock the shelf. New gear is added from My gear (3a). Same rule as 20: the Brewer and Grinder pickers each get a first row, "No brewer" / "No grinder".
22. **No line.** The spinner can't pass today, so "Up to today" would only state the obvious. The second line shows only when there is a roast date.
23. **Yes, mark it.** The row stays selectable and keeps its look; its meta line starts with "Finished Apr 2 ·" in `text.muted`. Only this cup's own bag appears that way; other finished bags are not listed.
24. **Confirmed**: Packaged and Barista leave the block out (When, My words and As logged only) until item 6.
25. **Keep it always pressable** (§1, same as 5a). With nothing changed it returns to 2c without writing anything.
26. **No note.** The existing "Your Taste DNA counted these when you saved" covers it.

**Round 3 leftover: 2c with neither bag nor gear**: hide the Method row too, which leaves "What I logged" empty, so the whole section goes. The title ("Morning cup") and "No bag or gear noted" under it say what's missing (follows 12a).

---

## Round 3 (2026-10-13): reply to `design-reply-2026-10-13.md`

### 1. Unselected vs disabled — accepted
- 11c updated: Kenya Nyeri's marker is now a 2px ink frame; Colombia Huila keeps `border.muted` + `text.muted`. The "Depends on" note is removed.
- 11c otherwise stays as drawn.

### 2. 11a / 11b / 11c — noted as adopted
- 11b's caption marks "Your profile goes back to Early signs." as adopted.

### 3. The title of a cup with no bag — drawn in Turn 12
- **2c: hide the Bag row** (12a). A display row reading "—" looks like missing data. The absence is said once, under the title: **"No bag noted"**, in the roaster's slot.
- **2c: keep the repetition.** The title is the name; the Method row is the record (grinder, clicks). Removing it would leave the grinder nowhere. 11a keeps its Bag FieldRow, since it's an input there.
- **List rows** (12b): when the brewer is the title, line 3 reads "No bag · ‹grinder›", without repeating the brewer. When the grinder is the title: "No bag".
- **Neither bag nor gear: "Morning cup"** (Afternoon / Evening / Night), from the daypart 2c already shows. It reads as a name, needs no new data, and the date tells two apart. Second line: "No bag or gear noted". This applies to 2a, 2c, 5b and 1b.
- Barista / Packaged: not answered here. The same daypart rule would work if you want one rule.

---

## Round 2 (2026-10-12): rechecked against the repo design-system.md (2026-10-12)

This round uses `uploads/design-system-174ec2c3.md`, read end to end. The stale copies are deleted: the root copy, `uploads/design-system.md` and `-04f729b2`.

### Drawn: items 7, 8, 9
They're in `MoreCoffee design.dc.html`, Turn 10. Every value is a token.
- **10a, photo placeholder**:
  - fill `surface.mutedStrong`;
  - a hand-drawn cup in `icon.muted`, sized by the icon token for each size (38, 22, 18, 16), square caps, no frame.
  - Open: bags share the cup glyph. A bag glyph would be a second visual.
- **Item 8, two directions. I'm not picking: the deciding question is whether the card's fixed height is a condition.**
  - **10b (A), fixed height**: an empty axis keeps its bare `surface.muted` track, with "Not noted yet" centred on it on a `surface.raised` patch (`space.8` each side). The track is in a 17pt slot, the same as filled rows. This adds the label to §9 AxisReadout's "Value null: the track alone" (revised 2026-10-12, per Uryu).
  - **10d (B)**: only noted axes are drawn, with one closing line under `divider.soft` naming the rest. The card grows at most three times, each on the return to Home after a save.
- **Item 9**: 10c pairs with A, 10e with B. No badge; the line is the brief's.
- **Badge**: accent standalone, no frame, `rotation.sticker` kept. The lock-in line is item 13's adopted copy.

### The sheets, rechecked
Withdrawn, now that the file is current:
- **The eyebrow colour (old #7).** `SectionLabel` is `text.muted`, as built.
- **The full-height sheet (old #3, in part).** The **full** variant is now specified. SE top = inset 20 + 12 = 32 ✓.

Still open:
1. **design-system.md contradicts itself on the unchecked checkbox.**
   - §1 Tap affordance: an unselected option is "an outline (1.5 `border.muted`)".
   - §1 Tap affordance, a few lines later: "A 2px ink outline … unchecked checkboxes".
   - The search sheet follows the first.
   - Next to the Disabled look (label `text.muted`, box `border.muted`), the only difference is the label, `text.secondary` vs `text.muted` (ΔE00 4.84). So unselected and locked rows are nearly identical, as the screenshot shows.
   - Which is right?
2. **The in-list add row has no spec.**
   - §9 Bottom sheet makes "Add "Word"" "a row like the others". §8 lists "Add gear" as a `border.addSlot` use, and EmptySlot is a full dashed frame with a `label.caps` label.
   - Built, both add rows are list rows with a dashed 24 box around the plus and a `label` (sentence case). The dashed box keeps dashed's one meaning, an add entry, but no section describes it.
   - Either add it to §9 as EmptySlot's in-list form, or correct §8's "Add gear".
3. **The search list's 2px frame is open at the bottom** when the list scrolls past the sheet edge or the keyboard. The full variant doesn't say whether the frame closes.
4. **"Default" in the picker is plain text.** §1 calls 3b / 4a's "Default" a 9px Badge.
5. **"Add gear" sits only under Grinder.** Does it add any gear, or a grinder only?
6. **Sheet titles come in two styles:** `display.sm` on the picker, an eyebrow on the date sheet. Is that intended?
7. **"tdbkif" becomes "Add "Tdbkif""**, title-cased. Is that intended?

Date sheet: the spinner's text in `text.primary` matches §1 OS-drawn controls. Nothing to report.

---

# Round 1 (2026-10-11)

Source of truth used: `uploads/design-system.md` (updated 2026-10-10). The root `design-system.md` is the 2026-09-20 extraction and is out of date. Please confirm the uploads copy is the right one.

Nothing has been drawn yet. Six items have conditions that contradict each other or the system, and the rule for this round is to report those first. The items with no conflict (7, 8, 9, 15, and most of the copy) are answered below or ready to draw once you've read this.

---

## 0. Gaps in design-system.md itself

The brief and design-missing cite sections that aren't in the 2026-10-10 file:
- **§1 Saving a cup**: the brief cites it for "Discard and save".
- **§1 Required marks**: cited by items 6 and 10 and by the brief. §9 SectionLabel says the square marks *"a section of an input form"*, not *"always filled"*. That is a different rule from the one these items rely on.
- **§9 Radio marker** and **`size.switch`**: item 3 says "§9's square radio rows", but §9 has no entry for them. `components.md` #26 (Radio option row, 2b) has "selected (check)", not a square marker.
- **`texture.rule`**: §2 B still puts it on both `axis.rail.*` rows, and §2 Texture still lists it. The built AxisSlider and the AxisReadout spec don't use it, so the retirement matches what's built. The tables are what's stale.

Until these sections exist, I can't check items 3, 6 and 10 against a rule. I can only check them against the brief's description of the rule.

---

## 1. Contradictions — need your call

**Item 1, Cup edit**
- **a. Why the axes can't be edited vs what delete does.** The axes are locked because editing them "would rewrite history the user has already seen". But "Delete this cup" recalculates Taste DNA without the cup, which rewrites the same history, and with no notice afterwards. Either rewriting history is acceptable (then the reason for locking doesn't hold), or it isn't (then delete needs the same protection). I suspect the conditions are what's wrong.
- **b. The disabled look vs colour roles.** A saved cup's axes and flavours are values the user entered, so §1 Colour roles, step 1, makes them **brown**. §1 Disabled options mutes them (`text.muted`, `border.muted`), which erases the "I entered this" signal on the one screen built around the user's own entries. Also, §1 Disabled is defined only for *options in a set*. The rating card and the axes aren't that. The closest fit is a display form: AxisReadout (neutral), but neutral means *computed*, which these values aren't. No existing rule covers "entered, now read-only".
- **c. The date limit vs editing the bag.** "Not before the bag's roast date", but the bag is editable on the same screen. If the user switches to a bag roasted after the cup's date, the cup is suddenly out of range. Which wins: the date is clamped, the bag is refused, or an error is shown?

**Items 2 and 6, Packaged**
- **a. No brand vs §9 List row.** Item 6 says one field, product name only, no brand. §9 List row → Row order makes Packaged line 2 = **brand**. Does line 2 go empty, or does the table change?
- **b. No "where bought" vs §9 Bought at row.** Item 6 also says no "where bought", but §9 specifies and builds the 5e **Bought at** row, with a promotion rule. Is it removed?
- **c. A wrong cross-reference.** Item 2 says "(item 15)" for the product name. That should be item 6; item 15 is 3c's Bean name error.

**Item 7, Photo placeholder, vs "no camera in V1"**
- The photo slots are still specified: §9 Empty slot is anatomically 5a's camera "Add a photo", and 3c has a 76px photo slot. If V1 has no camera, these are pressable slots that lead nowhere. Are they removed in V1, or do they stay and open the photo library?

**Item 13, lock-in per axis**
- The profile "locks in when every axis with a record has 10". So a user who never notes Sweetness can lock in, and the first Sweetness note then **un-locks** the profile, because that axis now has a record and 1 < 10. Is that intended?
- The 1b mock's card foot reads "3 OF 5 CUPS" with five cup marks. That is Try next's threshold of 5, which the conditions say isn't shown in V1. Is the foot removed, or rewritten to 10 per axis?

**Item 3, picker sheet: two eyebrow levels**
- "Brewer" / "Grinder" eyebrows sit under the sheet's own "Method" eyebrow. Both are `label.eyebrow`, so the hierarchy has no token to tell them apart. The options are:
  - make the sheet title a `display.sm` title instead of an eyebrow;
  - drop the outer eyebrow;
  - accept a flat look.

  I'd take the first, but it's your call.

**Item 4, search sheet: what the 270pt contains**
- 270 / 53.5 = 5.05, so the five rows only fit if 270 is **list area only**. If the search field (`size.field.height` 46) and "Done" are inside the 270, about four rows remain. Was the 270 measured from the field's bottom edge, or from the sheet's top?
- The "Add "Word"" row: when it's present, does it take one of the five rows? As an EmptySlot it's about 50 tall, not 53.5 (`inset.control` + `icon.md` + 2 × 2 border). That's fine for the count, but the rows won't line up evenly.

---

## 2. Items 3–5, checked against design-system.md

I can't see the builds. The connected repo (`uryu-myao/MoreCoffee-App@main`) is at an old commit with 28 files and none of these sheets. The checks below are against the prose in design-missing and the brief. **Please send a screenshot of each sheet on an SE, keyboard up for item 4, and I'll check the pixels.**

**Item 3, Bag / Method picker**
- Within the system:
  - the bottom-sheet pattern (§9);
  - "Add a bag" / "Add gear" as an EmptySlot (`border.addSlot`).
- Can't be checked:
  - the square radio marker (see §0);
  - the selected state. §1 Tap affordance says a selected option is **ink-filled**, and "an outline with no fill never means selected". A marker-only selected state needs that rule written down first.
- Drift risk: none known.

**Item 4, Flavour search sheet**
- Within the system:
  - 53.5 = `size.control.row` 52 + the 1.5 hairline, so the rows sit on tokens;
  - "Done" without an underline. §1 Tap affordance allows it "beside a search field".
- "Search flavors" is correct. The product UI is US spelling (5b's heading "Flavors"; my earlier spelling flag is withdrawn).
- Drift: §9 Bottom sheet is "pinned bottom, padding 22 22 34". A full-height sheet ending at the keyboard isn't a variant the system describes. That's not a token violation, but it needs a §9 line, including what happens to the bottom 34 when the keyboard is up.

**Item 5, Date sheet (iOS spinner)**
- Two conflicts beyond the rounded band the brief already notes:
  - **Type**: the spinner draws its numerals in SF Pro, and they can't be restyled. That breaks "two families only" (§1 Type).
  - **Weight**: SF Pro is drawn at Regular (400), which breaks "400 does not exist".
- This is the OS's control, so I'd log it as an accepted platform exception, like §3.2's line boxes, rather than as drift. But it is a new class: the first OS control drawn inside the product's own surface. Your call whether that's acceptable.

---

## 3. Copy (items 10–13)

These are proposals.

**10. 5a intro line, empty shelf**
> Marked fields are required. Add a bag and your gear once — after that they start pre-filled.

**11. 5d, rating only**
- Title: **Still needs a rating**
- Second line: **A cup can't be saved without one. What you've entered stays while you're here; closing loses it.**
- Footer: **No rating yet.**

**12. 5c**
- **An axis's first value**: **Starts at ‹step name›**, using the axis's own step name, not its poles. For example:
  - Starts at Bright
  - Starts at Light-bodied
  - Starts at Light roast
  - Starts at Lightly sweet

  It's a position, not a direction, so it reads as a start. A one-cup profile *is* that cup's value, so a step name always exists.
- **Summary sentence**: "This cup pushed you ‹phrases›." Join with "and"; with three or four, use commas then "and". Only axes that moved are listed; first values are left out.

  | axis | toward low | toward high |
  |---|---|---|
  | Acid ↔ Bitter | brighter | more bitter |
  | Body | lighter-bodied | fuller-bodied |
  | Roast | toward lighter roasts | toward darker roasts |
  | Sweetness | less sweet | sweeter |

  Body and Roast both start with "light", so each needs its own noun ("-bodied" / "roasts"). Otherwise the sentence reads "lighter and lighter".
- **Nothing moved**: **Your Taste DNA stays where it was — nothing on this cup moves it.**
- **A case the conditions miss**: an axis is noted, but at the profile's current value, so 0 points moved. Is that "nothing moved", or is the axis listed as "held"?

**13. 1b lock-in**
"N more cups" isn't accurate: a cup that doesn't note the lagging axis doesn't count towards it. Proposal:
> **Body needs 3 more notes to lock in.**
- With a tie: "Body and Roast need 3 more notes each."
- At 1: "1 more note".

This depends on the un-lock question in §1.

**14. Save failure**: no conditions were given beyond today's alert. Proposal, using 5d's error vocabulary in place, with no new values:
- Title: **Couldn't save this cup**
- Line: **Your phone couldn't store it. Everything you entered is still here — try again.**
- Action: **Try again** (primary).

What's missing from the conditions: whether a failed save can be retried indefinitely, and what happens if the user closes the screen. With no drafts, the cup is lost.

---

## 4. Item 15, 3c's Bean name error

**Within the existing set.** The label and underline use `state.error.text` (#8A4602) and `state.error.border` (#9E5202) as 2px solid. These are the field's own underline weight, recoloured. No new value.
- What's new is the *application*. 5d marks errors on FieldRows and the rating card, never on an underlined text input. That's a new use, not a new token, and §9 should say so when it's written.

---

## 5. Ready to draw once §1 is answered
- **7**: the photo placeholder. One drawing on `surface.mutedStrong`, square, scaling from 40 to 210.
- **8**: the Taste DNA card with empty axes.
- **9**: the Taste DNA card with nothing noted.
- **1, 2, 6**: after the contradictions are settled.
- **Icons**: "all icons" is in scope, but there's no list. Please send which glyphs V1 needs, or I'll inventory them from the boards.
