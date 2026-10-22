# Design brief — next round (collecting; not sent yet)

**About this round's scope**: it is what Uryu needs to log his own coffee every day, **not a version for other people**. Items marked **[not at this stage]** in `design-missing.md` are not "not needed", only not needed at this stage.

**Hard constraint, read before designing the search sheet's content: on an SE, about 270pt / 5 rows stay above the keyboard** (measured, device-confirmed).

**Already built without a mock — please check them against the system**: the bag / gear picker, the flavour search sheet, the date sheet.

**Design's hand-made work**: every icon, and the placeholder images. (Everything else is built from `design-system.md`.)

**`texture.rule` is retired** (2026-10-11): it drew the old display axis's rail lines, which AxisReadout replaced. Do not use it on new screens; existing boards still show it on 1b / 4a / 4b / 2c / 5c.

Screens and states V1 needs that no mock draws: `design-missing.md` (sent with this brief).

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
- **5c, an axis's first value**: when a cup gives an axis its first value, there is no "before", so "Moved N points toward …" cannot be written. It is the axis's first record: a start, not a movement. Please write that line.
- **5c's summary sentence** ("This cup pushed you brighter and lighter."): it needs comparatives per axis and direction (8 cases; Body and Roast both start "light"). Not shown until written. The per-axis lines use "Moved N points toward ‹pole›" (decided 2026-10-11).
- **5c when nothing moved** (no axis noted, or only words without a table entry): 5c still shows; we put a PROVISIONAL line.

- **5a's intro line on an empty shelf** (`gaps.md` 28): with no bag and no gear the line says "all of them start pre-filled" while Bag and Method read "Add a bag" / "Add gear". Please write the empty-shelf form.

- **5d's reminder card, second line**: it must not promise a draft. Conditions: say why the cup can't be saved yet; while on this screen, what was entered stays; it is not kept as a draft; closing loses it. (V1 has no drafts; see `gaps.md` 30.)
- **5d with one thing missing**: in V1's I made it, only the rating can be missing. The rating is "the one thing the app can't guess", and the star card already says "Tap a star — this is the one thing the app can't guess." Please write the reminder card's title and the footer line ("Rating and café are still empty." in the mock) for one missing item, **without counting** ("One answer is…" reads oddly) and **without repeating the star card's line**.

## Please check
- **3c's Bean name error**: pressed with no name, the field takes 5d's vocabulary (label "Bean name · required" and the underline in the error colour). No mock draws an inline input error. Is this within the existing error set, or did we invent something?
- **Intro block**: 5a's opening line now has a surface (`color.surface.raised`, no frame); other explanation lines have none. Should other screens' opening explanations get the same?
- **D-46's side effect**: the removed square was the example of "Marked". The section labels still carry the mark; you may want another way to show it.
- **3a's full-shelf hint** (Design 2026-10-20: "No slots left. Remove gear from My gear to free one."): V1 has no way to remove gear. 3b / 3e are not at this stage, and Home's My gear (4a) only lists. Keep the line for when 3b exists, or word it for V1?

- **Taste DNA copy (decided rules in brief)**:
  - **1b's "N more cups to lock it in" (D-47)**: lock-in is **10**, counted **per axis**; the profile locks in when every axis with a record has 10. "N more" counts the axis with the fewest records. Try next's 5 is a separate threshold (V2, not shown in V1).
  - **8f contradicts itself**: the summary says "lightly sweet", the Sweetness axis says "Medium sweet". Which is right?
  - **8f's summary sentence ("Bright, juicy, lightly sweet")**: from which axes and which words is it built? "juicy" is neither a band name nor a bundled word.
  - **6a's labels ("Acidity high", "Body light", "Roast light")** differ from the band names (Bright, Light-bodied, Light roast). Match them, or is 6a a summary that may differ?
  - **6b's Reset line ("Only the profile is rebuilt")**: Reset now means "count from this day"; the profile builds up again from that day, it is not rebuilt from the old cups.

## Round 10 follow-ups (built 2026-10-21; please check)
- **14, I made it cups with no roaster / no brewer.** Your "Packaged" / "Barista" headings name the cup's type, but an I made it cup can lack both too: a bag may have no roaster (Round 7, 41), and a cup logged from an empty shelf requires no bag or gear. It is neither Packaged nor Barista. Built (Uryu): it keeps **"No roaster" / "No brewer"** and comes first of the three tail groups (then Packaged, then Barista); under "Roaster A–Z" the same order after Z. OK, or another heading?
- **19, two headings you didn't name.** Built as:
  - no results with 4★ on: `Nothing matches “q” · 4★ and up` (your " · 4★ and up" rule applied here too, since 4★ narrowed it);
  - 4★ on, field empty, no 4★ cups: `No cups rated 4★ and up`.
  OK?

## 8f follow-ups (built 2026-10-21; please answer)
- **"Flavours I pick most" as its own block?** 8f's "What you keep saying" counts My words (written; 8h), so it waits for 8h. How often each flavour tag is picked is worth seeing too, but it is a different thing (picked from a fixed set, not written). Should 8f show it under its own heading? If so: heading and copy, where it sits, and how it stands next to "What you keep saying" once 8h exists (both will show).
- **Last shift's copy**: band names with the date: "Sweetness moved from Lightly sweet to Medium sweet on Oct 17." The cause ("after three naturals in August") is not built: no rule, and the app doesn't guess. OK? (Its frame is in "Pressable blocks" below.)
- **8f with nothing noted.** The page is "From 0 cups" over four empty axes ("Not noted yet"), with no stamp (state none). Does it need a line, or is that enough?
- **Header stamp.** 8f draws a smaller stamp (9px on `surface.inverse`, Round 8). Built with the card's stamp size: there is no 9px style. OK, or a style for it?
- **Home's Taste DNA card does not lead to 8f** (1b / 4a / 4b draw it with no tap; only the stamp is a button, which opens 15b). Making the card a link would put a button (the stamp) inside a button, which Round 8 avoids on Profile's card. 8f is reached from Profile and 2c. Should Home lead there too, and how?

## Pressable blocks: one treatment across the app (to design; gathered 2026-10-21, Uryu)
Uryu wants pressable blocks designed together, not screen by screen. Today each one was settled on its own, from rules written after the boards were drawn, so the built app and the boards differ in several places. Please design **one treatment** for a pressable block or row, and the look of a **framed block that is not pressable** beside it, so the two can't be confused.

**Rules in force that the treatment must keep (or tell us which to change):**
- §1 Tap affordance: three means say "pressable", none of them colour: a whole row → a **chevron** at its end; text alone → an **underline**; a part with a surface → its **frame or fill**.
- §8 (2026-10-18): dashed means only an empty or not-started state (a frame), or two parts of one block (a line). **It never says "you can press this."** `border.addSlot` was removed for that reason.
- §1 Pressed (2026-10-18): a frameless whole row fills with `state.pressed.row` (ink 6%) out to its container's edges.
- Round 9 (2026-10-18): app lists have no item dividers; only the line under a list's header stays.

**Where they are, board vs built:**

| # | screen | block | board | built | note |
|---|---|---|---|---|---|
| 1 | 2a Records | each cup row (→ 2c) | no chevron, no sign it opens | chevron at the row's end; full-bleed pressed fill | D-49 |
| 2 | 1b / 4a / 4b Home | Recently sipped rows (→ 2c) | as 2a | the same row as 2a (`RecordRow`) | — |
| 3 | 2c Record | "Feeds my taste DNA" (→ 8f) | 1.5 dashed frame, → arrow on the right | no frame; › by the heading; full-bleed pressed fill | D-48: the dashed frame clashes with §8 |
| 4 | 8l Search | result rows (→ 2c) | in a 2px frame, no chevron | 2px frame kept; chevron added | as D-49 |
| 5 | 3d My beans | a bag card's upper half (→ 3g); "Finished bags" (→ 3f) | — | chevron; pressed fill to the card's frame | D-29 |
| 6 | Home shelf | "Manage my beans  2 / 5  ›" | — | chevron; pressed fill to the card's frame | — |
| 7 | 5a / 5d / 5e | field rows (Bag, Method… → pickers) | chevron | chevron | the board's own use |

**Framed, not pressable** (the treatment must read differently):
- 8f "Last shift": the board draws a 1.5 dashed `border.muted` box on #FFF8F1 (no token). Built as a plain section with no frame (§8).
- 2c "Where it sat", Home's Taste DNA card: 2px ink frame on `surface.raised`; only the Taste DNA stamp inside is a button (Round 8).

**What we need back**: the pressable block's frame (or none), its sign (chevron, arrow, or other) and where it sits, its pressed state; the not-pressable framed block; and which of the seven above change. Built as listed until then.

## 3b / 3e follow-ups (built 2026-10-22; please check)
- **3e is minimal.** Built: Name (required), Maker, the default switch (brewer / grinder only), Remove, Save. Not built: the photo (no camera yet, as 3g), Category, Added on, My settings note.
  - **Category is not editable**: a cup holds its gear as brewer or grinder, so moving a grinder to "Kettle" would break the cups logged with it. 3a adds only those two. Should 3e show the category at all (as text), or is "My default grinder" enough to say what it is?
  - **My settings note** promises "Prefills the grind field when you pick this grinder", and V1 has no grind field. It comes with the grind setting (`todo.md` T-11).
- **The default switch turns off** (Uryu): no default is a fair state, and a switch that won't move looks broken. Removing the default passes it to nothing: 5a's Method starts empty until the user picks another. Built at `size.switch` (D-20).
- **Remove asks first** (gaps.md 18, 11b's sheet as 3g's delete). Our copy:
  - title `Remove this grinder?`;
  - `It's removed from My gear for good. Your 12 logged cups keep its name.` (no cups: the first sentence alone);
  - for the default only: `It's your default grinder, so new cups start without one until you choose another.`;
  - `Remove from my gear` / `Keep it`.
  Then back to 3b with 13b's notice, verb **"removed"** (`Comandante C40 removed.`; 13b draws "deleted", 3f uses "reopened"). OK?
- **"Edits apply to the N cups already logged with it."** Gear is used for a long time: one grinder can carry 100+ cups, and a rename rewrites the name on all of them. The line fits at 3–4 digits. Is it warning enough at 183 cups, or should a large N read differently?
- **3e's header: Back, not ×** (as 3g; 3e draws ×). A pushed edit screen leaves the way it came.
- **3b's kettle / scale line** is the category alone, as 4a (never on a cup, so no "not used yet"). 3b draws "Kettle · not used yet". V1 can't add either yet.
- **Name's placeholder** when emptied is the category ("Grinder"), then the required error on Save. OK?

## Decisions that change mocked parts (2026-10-11)
- **5a / 5e intro line**: on `color.surface.raised`, no frame, no leading square (drift D-46).

## Drift not yet sent
- **D-7 to D-16** (never part of group A; written out 2026-10-20 so the brief stands alone). Each is a mock-side fix; the token side already holds the right value. D-10 and D-11 are withdrawn and not asked.
  - **D-7** · 4a / 4b: letter-spacing written `0.16em` → `.16em`. Same value; notation only, for diffing.
  - **D-8** · 5d: body copy at `12.5px` (3 uses) → `body.sm` (12). No fractional size exists elsewhere.
  - **D-9** · 8m: body copy at `13.5px` (3 uses) → `body` (14). Same.
  - **D-12** · 5a / 5d / 5e: the "Optional" tag in the Add a photo slot is 11 / 600 / .06em caps → `label.caps` (12 / 700), as 3b / 3d's slot tags.
  - **D-13** · 5a / 5d / 5e: space between form sections is 16 / 20 (5a, 5e) and 18 (5d) → `gap.section` (12). 20 is `gap.axis`, the taste axes' own rhythm.
  - **D-14** · 5e: intro line says "Bottled cups…" → **"Packaged cups…"** (the 2026-10-04 rename; the sample is a can). Built that way.
  - **D-15** · 5e: "Bought at" shows "¥180" → **store name only**. There is no price in the data model, on purpose. Built that way.
  - **D-16** · 2a: every row's source line has the same density → **by mode**: I made it = roaster · process; Barista = place only; Packaged = brand only. Only what the data holds is shown. Built that way.
- D-43: 3g's caption still points at 3d's removed "Edit" → "From 3d → tap a card".

## Still waiting for Design's reports
- D-37 (dashed underline = optional?), D-38 (placeholder colour, and now the entered-text colour), D-39 (setup footer 38), and 6a's "My shelf" heading: see `design-brief-closing.md`.
