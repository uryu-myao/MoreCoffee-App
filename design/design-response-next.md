# Design response — design-missing.md

## Round 13 (2026-10-23)

### A. Round 12 build
1. **OK, the category stays at the top of the body.** Keep the shared compact header as it is. The category describes the item, not the screen, so it sits fine just above the card. The mock follows the build.
2–3. Noted.
4. **Noted.** The mock fixes (D-37, D-39, the › chevrons on 2c / 3d / Home's shelf) and D-7 to D-16 go into the next export.

### B. Items answered twice
All three are **agreed: keep what is built.**
- Empty axis: "Not noted yet" for a profile, "Not noted" for a cup. The two different words are right.
- 5c: "Starts at …", "-bodied", and the "Your Taste DNA stays where it was" line. My Round 12 versions are withdrawn.
- Lock-in: counted in notes. "Cups" was wrong.

### C. D-38
**Agreed.** Keep `text.placeholder` until D-44, and decide both at the final polish.

### D. Reports
Noted. Dropping 8l's matched tag is fine: the row's lines carry the match. 6a at `display.sm` is fine.

### E. 2a's category chips
1. **All OK as listed.**
   - Labels: All / I made it / Barista / Packaged.
   - `SegmentedControl`, 44 tall, the same row as 8l's.
   - One at a time. Each launch starts from All.
   - The chips and 2b combine. 8l doesn't take the chip.
   - One addition: when switching chips, keep the list's scroll position at the top. Each chip shows a different list.
2. **Your reading is right for both.**
   - 16: the filter button stays plain. The selected chip is the "in force" sign, and it sits in view on 2a. 2b still holds no filter.
   - 18: "Done" with no count. 2b still can't change how many cups there are.
3. **The cups shown.** "N Cups" counts the list under it, so the header and the list always agree. The label doesn't change. The chip above the list says what is counted.
4. **One line per type, stating the fact only.** No invitation: V1 can't fully log a Barista cup yet, and the + button already says how to log. "Yet" says the list will fill.
   - I made it: **"No home brews yet."**
   - Barista: **"No café cups yet."**
   - Packaged: **"No cans or bottles yet."**
   - Style: body, `text.secondary`, placed where the first row would be. The header shows "0 Cups".

## Round 12 (2026-10-23), with D-37–39 and earlier open items

Round 10 A, C10, D11–13 and all of Round 11 are answered above ("Round 11"). A1–A3: noted. D-43: OK, the 3g caption becomes "From 3d → tap a card".

### B. 3b / 3e
4–6. Noted, all OK. Bring back the settings note together with grind (T-11).
7. **Show the category, as plain text.** Put it under the header title as body.sm in `text.secondary`, reading "Grinder", "Brewer", "Kettle" or "Scale". It is not a field and not a chip: 3e has to say what the gear is even when there is no default row.
8. **OK, as built.**
   - The switch turns off as well as on.
   - Removing the default gear passes the default to nothing.
   - `size.switch`, with the on and off colours as listed.
9. **OK**, with "removed" as the verb in 13b's notice. Each verb matches its action: deleted, reopened, removed.
   - One copy change, for the default only: **"It's your default grinder. New cups start without one until you pick another."** That is two sentences, and "pick" matches 5a.
10. **The line is enough at any N.** The number is the warning, so keep one wording for every count. Use the grouping separator from 1,000 cups (tabular numerals).
11. **OK, Back.** It is a pushed screen. The × in 3e's mock is drift.
12. **Both OK.** 3b's "Kettle · not used yet" is drift.

### C. Sheets
13. **OK as the rule for every sheet.** On a confirmation sheet, a swipe always means Cancel. Add it to §1 next to the handle rule: if a sheet draws a handle, it closes on a swipe down.

### D-37 / D-38 / D-39 (report)
- **D-37: no. A dashed underline does not mean "optional".**
  - 8o is the only form that draws it, as `#C8BCB4` dashed under "Roaster" and "Roasted on".
  - The other forms say "optional" in words: 3c "Optional." / an "Optional" tag on the row, 5a and 6d "Optional", in label.caps or body.sm, `text.muted`. None of them change the line.
  - So the one consistent rule is the word "Optional". A field's underline is always solid 1.5 `border.muted`, whether the field is required or optional.
  - Fix 8o: draw a solid underline and keep its placeholder text "Optional" / "Optional — for freshness". Dashed keeps only its §8 uses.
- **D-38: one placeholder colour, `text.secondary`.**
  - `#A39389` on 8o is drift. It also fails 4.5:1 on paper.
  - 5b's "My words" has the same role as the other placeholders: empty-field text that goes away on input. An example sentence is still a placeholder. Move it from `text.muted` to `text.secondary`.
  - Text the user has entered is `text.primary` everywhere, so it reads differently from a placeholder by colour as well as by weight.
- **D-39: there is no reason for 38. Use 34.** 8c, 8n and 8o share one setup footer, and 38 was copied from screen to screen. The setup flow has no shared need for it, so use the same 34 as every other footer.

### Earlier open items (design-brief-next)
**Taste DNA card**
- **An axis with nothing noted:**
  - Keep all four rows, so the card's height stays the same.
  - An empty axis is drawn as a track only: no dot, no number, and its band name replaced by "—" in `text.muted`.
  - Leave out "Not noted" on every row. When three or more rows are empty, put one line under the axes in body.sm, `text.secondary`: **"Fills in as you note each taste."**
- **No cups noted at all: OK.** No badge. Use the 8f line from Round 11: **"Rate a cup and note one taste to start."**

**5c copy**
- **An axis's first value:** **"First reading: ‹band›"**, e.g. "First reading: Bright". It names a start, not a movement.
- **Summary sentence:** "This cup pushed you ‹c1› [and ‹c2›]." Use the two axes that moved most and leave out any that moved less than 1 point. If no axis moved, show no sentence.
  - Acidity: brighter / more bitter
  - Body: lighter in body / fuller in body
  - Sweetness: sweeter / less sweet
  - Roast: toward lighter roasts / toward darker roasts. "In body" and "toward … roasts" keep the two "light" poles apart.
  - Example: "This cup pushed you brighter and fuller in body."
- **Nothing moved:** **"Saved. This one didn't move your taste DNA."** No apology and no advice.

**5a and 5d** (answered in Round 9)
- **5a's intro line on an empty shelf** is replaced by the Required bar's sub-line: "Add a bag & gear once to pre-fill".
- **5d's second line:** "A cup can't be saved without one. What you've entered stays while you're here; closing loses it."
- **5d with one item missing:** "Still needs a rating" / "No rating yet."

**Please check**
- **3c's Bean name error: within the set.** The label suffix, the error colour on the underline and no new parts are all from 5d. OK.
- **Intro block: no, keep it on 5a and 5e only.** There the line ties to the Required bar. Other screens' opening lines stay plain text.
- **D-46's side effect:** fixed in Round 9. The Required bar now shows "required" through its labelled slots, so no square is needed. The section labels keep the plain "· required" suffix only when an error is shown.

**Taste DNA copy**
- **1b's lock-in line:** **"N more cups to lock it in"** is correct as the rule defines it, with N counted from the axis with the fewest records. When N = 1, write "1 more cup to lock it in".
- **6b's Reset line:** **"Counts from today. Older cups stay in Records."**

## Round 11 (2026-10-21), with Round 10 A–D

### Round 10 A. Drift
1–8 and D-56: **all OK as built.** The mock side follows the tokens.

### Round 10 B. 3a's full-shelf hint
9. **V1 line: "Limit reached. All 8 gear slots are in use."** It offers no way out, because V1 has none. Switch to the "Remove gear…" line when 3b / 3e ship.

### Round 10 C. 1b's line under the counts
10. **(b) Drop it for V1.** The counts and the strip already say how the week is going, and a line with no rule would only repeat them.

### Round 10 D. 8f
11. **"Medium sweet" is right.** The band comes from the value. The summary's "lightly sweet" was board drift.
12. **Summary rule (D12):**
    - The summary is built from band names only. Leave out flavour words and My words: "juicy" came from My words, which are not in V1.
    - Take the noted axes, drop any in the middle band (Medium …), and keep the two farthest from 50.
    - Order them by distance from 50. The first word is capitalised, the rest are lowercase, joined by ", ". Example: "Bright, light-bodied".
    - If one axis is left, show that one band. If none is left, or nothing is noted, show no line.
13. **They match.** 6a uses 8f's band names ("Bright · Light-bodied · Light roast"). One axis, one wording, everywhere.

### A. Round 10 follow-ups
- **14: OK.** For I made it cups that lack a roaster or a brewer, keep "No roaster" / "No brewer". Order: No roaster / No brewer, then Packaged, then Barista. The same order applies after Z.
- **19: both OK.** "Nothing matches “q” · 4★ and up" and "No cups rated 4★ and up".

### B. 8f follow-ups
- **"Flavours I pick most": yes, as its own block.**
  - Placement: right under the four axes, before "What you keep saying".
  - Content: heading "Flavours I pick most" (label.caps), then the top 4 tags with their counts. Use the same row style as "What you keep saying", e.g. "Peach 12".
  - The block is hidden until a tag has been picked.
  - Once 8h exists, both blocks show: picked words first, said words second. Each has a one-line sub-heading so they can't be read as one list: "From the flavour list" and "In my own words" (body.sm, `text.secondary`).
- **Last shift copy: OK.** Band names and the date only. The app never guesses a cause.
- **8f with nothing noted:** add one line under "From 0 cups": **"Rate a cup and note one taste to start."** No illustration.
- **Header stamp: OK at the card's size.** No new style.
- **Home → 8f: yes.** Add a pressable row at the foot of Home's Taste DNA card: **"Open my taste DNA ›"**. It uses the row treatment in C (chevron at the end, pressed fill out to the card's inner frame). The card itself stays not pressable, so the stamp is still the only other button in it. This is the same pattern as 3d's "Finished bags".

### C. Pressable blocks: one treatment
The rule: **the chevron is the only sign that a block opens something.** Frame and fill say "pressable" only on controls (Button, chips, slots), never on a block of content.

- **Pressable row or block**
  - Frame: no frame of its own.
  - Sign: a chevron › in `text.secondary`, 16, at the row's end. On a one-line row it is centred vertically. On a multi-line block it sits on the heading line.
  - Pressed: `state.pressed.row`, filled out to the container's edges (to the screen on a list, to the inner frame inside a card).
- **Framed block that is not pressable:** a 2px ink frame on `surface.raised`, with no chevron and no pressed state. Buttons inside it keep their own control look.
- **Framed block that is pressable** (only Profile's Taste DNA card): the same frame plus a chevron on its heading line, and the pressed fill inside the frame. The chevron is the only difference from a non-pressable card.
- Dashed lines never mean pressable (§8, unchanged).

The seven places:
1. 2a: no change; built is right.
2. Home Recently sipped: no change.
3. 2c "Feeds my taste DNA": **put the › on the heading line at the row's end** (Turn 16b). Keep no frame.
- Existing → arrows (2c, 3d "Finished bags", Home shelf) become the 16 `text.secondary` chevron. Mock: Turn 16.
4. 8l results: **drop the 2px frame** and use `RecordRow` exactly as 2a does. Per-row frames are the noise Round 9 removed.
5. 3d: no change.
6. Home shelf "Manage my beans": no change.
7. 5a / 5d / 5e field rows: no change.

Not pressable:
- 8f "Last shift" stays a plain section with no frame. #FFF8F1 is board drift.
- 2c "Where it sat" and Home's DNA card keep their frame with no chevron.

### D. 6a
1. **When 8h comes, My words gets its own heading, "My words".** It does not sit under "My shelf", which means gear and beans only.
2. OK.
3. OK.
4. **Week streak: OK as written.**
5. **Bags: OK**, counting every bag ever added.
6. **OK.**
   - Band names shown as Badges.
   - Add the summary line per D12 above.
   - The card follows C's "framed block that is pressable": chevron on the heading line.
7. OK, "N of 8".
8. OK, "N of 5" only.
9. **OK**, with the line "N cups as JSON, notes included".

## Round 10 — E. Records sort (2b) and search (8l) (2026-10-21)

**2b — Sort & group**

14. **Cups with no roaster or brewer: OK to put them last.**
    - Headings are named by what the cup is, not by what it lacks: **"Packaged"** and **"Barista"**, one group each, in that order after the real groups.
    - Barista cups do not group by café in V1, because café can't be entered yet. Revisit once it can.
    - Under the "Roaster A–Z" sort, the same cups go after Z: Packaged first, then Barista.
15. **Sort with group: OK as proposed.**
    - Inside a group, cups follow the sort.
    - Groups are ordered by their first cup under that sort.
    - Month groups follow the date direction.
    - With Group by Month, a rating sort orders cups inside each month; the months stay in date order.
16. **Filter icon: leave it unchanged in V1.** 2b always shows its current choice when opened, and 2a's section headings already show the grouping. Drop `gaps.md` 16 until a real filter exists.
17. **Marker: the square radio, as proposed.** All single-select rows use one marker. The board's check mark is drift.
18. **The button reads "Done".** With no filter the number gives no information. Use `Button` primary, full width. The count returns once a filter can change the result.

**8l — Search**

19. **Result headings.** body.sm, `text.secondary`, with the count in tabular numerals. "q" stands for the typed text, curly-quoted.
    - Words: `9 cups say “q”` (as drawn). With one result: `1 cup says “q”`.
    - Beans: `5 cups of “q”`.
    - Gear: `4 cups brewed with “q”`.
    - 4★ on, field empty: `12 cups rated 4★ and up`.
    - 4★ on, with text: add ` · 4★ and up` to the end of the line, e.g. `3 cups say “juicy” · 4★ and up`.
    - No results: `Nothing matches “q”`. Nothing goes under it: no illustration, no suggestions.
    - Field empty and 4★ off: no heading and no list. Show only the scope row.
20. **Words: search flavour tags as well, as proposed.** Words means "what I noted about the cup". A tag match counts the same as a match in the note, and each cup is counted once.
21. **Gear: hide the scope until 3b / 3e.** A scope that can never find anything reads as broken. Words and Beans stay. Add Gear back when gear can be renamed.
22. **Recent searches: leave them out of V1.** Session-only recents would be empty on every open, so the block would show up as empty most of the time.
23. **4★ and up: OK.** It is a switch that combines with any scope, and the test is rating ≥ 4. Rows show whole stars ("4"). The board's "4.5" is drift.

## T-6 pass 1 — reply (2026-10-20)

### A. Spec questions
1. **3a's count: (a).** The header stat is a running total, not a selection count, so the §1 rule doesn't apply to it. The rule still covers inline counts like "5 of 5" and "3 of 3 picked". On 3a, the light impact and the locked-row hint mark the limit.
2. **Ink wins.** §1 Tap affordance (2026-10-09) is the later rule. In §1 Colour roles, blue means "in force", not "pressable". Update §3 so `text.inlineAction` pairs with `color.text.primary` instead of `color.text.link`. 5d "Go to first" and 3f "Reopen bag" become ink and underlined.
   - `color.text.link` has no remaining text-action use; keep the token only if something else still uses it.
3. **Yes.** §1's line sets the meaning, not fixed copy. Each screen's hint must say two things: the limit is reached, and deselecting one frees a choice. 5b's line is OK.

### B. Built without a mock
4. **Rewrite as "No slots left. Remove gear from My gear to free one."** A screen-reader hint should give a way out, the same as §1's hint does. The footer's "0 slots left" stays.
5. **InlineAction: OK, added to components.md.**
   - Colour is ink, per item 2.
   - Off state: `inlineActionOff` in `text.muted`. Use it only where the screen says why.
   - Pressed: scale only. Touch area: 44pt via hitSlop.
6. Noted.

## Round 9 copy check — reply (2026-10-18)

### A. Required bar sub-line
1. I made it, shelf has a bag and gear: **OK**, "Pre-filled from your shelf".
2. I made it, empty shelf: **"Add a bag & gear once to pre-fill"**. Uses the "&" like 5e, and is shorter than the 40-character limit.
3. Barista: **"Café cups skip beans & brewing"**. This matches 5e's "Packaged cups…" opening.

### B. 5d with the product missing (Packaged)
4. **OK** as proposed. The body copy is the rating body, with "one" kept.
5. **OK** as proposed. The body copy is the rating body with "one" changed to "them".
- Star hint: **change it to "Tap a star — only you know how it tasted."** The old line ("the one thing the app can't guess") stops being true once the product is required too. Show it only while the rating is missing, as before.

### Not copy
Token names below follow `tokens.ts`. Every colour maps to an existing token; no new tokens.
- Bar ground: **confirmed, `surface.muted` (#E4D6CC).** `surface.mutedStrong` in Round 9 was my error.
  - Frame: 1.5 `border.muted` (#C8BCB4).
  - Empty slot: 1.5 dashed `border.muted`-weight frame in `text.muted` (#6B5D55), no fill; label `text.muted`.
  - Filled slot: #CFDCC8 ground with #4A6640 check and label (the bean-freshness `drinkNow` pair).
- Count: **confirmed, `text.muted` (#6B5D55) below full**, switching to #4A6640 only when every slot is filled. 5e mock updated to match (1/2 in `text.muted`).
- SEE ALL (4a / 4b, three places): it is now a text-and-arrow link with no fill or frame.
  - Text and arrow: `text.secondary` (#5C5049), Archivo 12/700, uppercase, tracking .08em.
  - Hit target: 44px high, with 8px left padding.
  - Do not use the blue `action` colour. Blue is only for primary actions and the active tab.

## Round 9 (2026-10-18): app lists drop item dividers

- **Item dividers are removed in every app list**: Records (2a), My beans (3d / 3f), My gear (3a / 4a), the Bag / Method pickers, and the Beans list on Home 4b. Items are separated by spacing only.
  - **Kept**: the one line between a list's header and its first item. The header row's `border-bottom` or the first item's `border-top` (1.5 `divider.soft`) stays.
  - **Removed**: the `border-top` / `border-bottom` (1.5 `divider.soft`) on the second item onwards, and the bottom line on the last item.
- **Row padding tightens** to make up for the lost line: vertical padding 16 → 12 and 14 → 11, with horizontal padding unchanged. Gear rows go 12 / 13 → 11.
  - Use the list's `gap: 0`. The padding alone sets the rhythm; don't add margin between rows.
- **Out of scope**:
  - dashed lines (`border.addSlot`, card-internal section breaks);
  - field dividers inside a card, such as 2c's "What I logged" rows and the FieldRows in 5a / 11a;
  - the bottom-sheet search list's 2px frame (§9).
- **5e Required bar** (same turn):
  - The bar sits on `surface.muted` (#E4D6CC) with a 1.5 `border.muted` (#C8BCB4) frame.
  - Header row: "Required" label, a sub-line, and a live count ("0/2" → "2/2").
  - One slot per required field. When filled, the slot is `#CFDCC8` with a `#4A6640` check and label. When empty, it is a 1.5 dashed frame with no fill.
  - These are the freshness status colours, not the active-tag ink, so the bar doesn't read as pressable.

## Round 8 (2026-10-17): Taste DNA status stamp → info sheet (drawn in Turn 15, applied everywhere)

- **The sub-line under "My taste DNA" is removed** everywhere: Home 4a/4b, Turn 10 states, DNA page. ("Three more cups to lock it in." / "Body and Roast need 9 more notes each to lock in.") Progress stays in the card footer ("3 of 5 cups" + cup glyphs).
  - Exception: the post-save card (Turn 5) keeps "This cup pushed you brighter and lighter." It's this cup's result, not an explanation.
- **The stamp becomes a button.** Inside it: a 14pt ⓘ glyph (stroke 2.4, the stamp's ink colour), then the label, gap 6. Stamp padding is unchanged, except the left side is 2 less to balance the glyph.
  - Hit area: a transparent wrapper, 44 tall, padding 0 / 6 and margin −6 on the top, right and bottom, so the stamp stays where it was. The header row is vertically centred.
  - **No rotation.** `rotation.sticker` is no longer applied to this Badge, which supersedes Round 2's "rotation.sticker kept". Other sticker uses are unchanged.
  - Same treatment for every status ("Early signs", "Locked in"). ⓘ is reserved for status words that need explaining; don't add it to labels.
  - The DNA page header's compact "Locked in" (9px, `surface.inverse` fill) gets it too: an 11pt glyph in `text.onInverse`, gap 5, and the same 44 wrapper.
  - **Exception:** a status chip inside a card that is itself a link (the Profile Taste DNA card, Turn 6) stays a plain chip with no ⓘ and no tap of its own. That avoids a nested button; the card leads to the DNA page.
- **Tap → info sheet** (§9 Bottom sheet, 15b):
  - Max height 78%; the body scrolls.
  - Order: eyebrow "My taste DNA" (Archivo 11/700, accent) → title = status (Instrument Serif 34) → body copy (Archivo 14/500, line height 21, `text.secondary`, free length; final copy TBD) → progress box → "Got it".
  - Progress box: `surface.base` with a 2px ink frame. "N of 5 cups" + glyphs, then the live sentence that used to sit on the card ("2 more cups to lock it in." / per-axis "Body and Roast need 9 more notes each.").
  - "Got it" is the 52 secondary. There's no primary.
  - Closes on Got it, a scrim tap, or swipe down.
- **Copy fix:** at 3 of 5 the line reads "2 more cups to lock it in." (the earlier "Three more" was wrong).
- **3c / 3d (unopened bag)**: 3c adds "Add without opening", a 48 secondary under "Open this bag". An unopened bag takes a slot.
  - The 3d card: dashed 2px ink frame, no freshness bar. Meta line "… · Not opened yet". Status row "Sealed · clock starts when opened". Primary 44 "Open this bag".
  - Header count label: "On the shelf" (per item 18).

---

## Round 7 (2026-10-14): reply to `design-brief-2026-10-14.md` (drawn in Turn 14)

### Freshness
39. **Resting**: elapsed `#C2B4AB`, marker `#8C7E76`, label `text.secondary`. These are pastPeak's neutral pair, not a warning, and need no new tokens. Green means only "drink now".
    **OQ-3: the band is the bag's.** The peak band stays `#CFDCC8` in all three states. pastPeak's `#E4D6CC` band was drift: set pastPeak.peakBand to drinkNow's. Resting and past peak share the same colours; the marker's position (before or after the band) and the label tell them apart.
40. **"The windows are a rough guide. Your own taste is the better judge."**
    - Where: once on 3d, under the last bag card and above "Finished bags".
    - Style: Archivo 12/500, `text.secondary`.
    - When: only if at least one bag has a roast date.
41. **3c's Roasted on line: "Add it to see when it's at its best."** It stays optional, with no required mark.
    - **No roast date**: 3d's card drops the freshness row and closes up; the opened line stays.
    - 5a's Bag row shows the roaster alone. With no roaster either, there is no meta line.
    - 2c shows nothing in place of "day N when brewed". All three read fine; nothing reads as missing.
42. **3g: "Freshness on My beans counts from this date."** Adopted as you proposed. It covers both an empty date and a filled one.
33. Noted.

### Still open
2 / 6. **Agreed: one line, no brand field.** I see no reason for one later.
    - The row closes up with no empty line 2. When Bought at returns, line 2 is the store.
    - **2c for Packaged**: the title is the product name, and "What I logged" is hidden (the same rule as 12a with no bag or gear).
16. **Confirmed**, with this split: Good morning before 12:00, Good afternoon 12:00–17:59, Good evening from 18:00 and through the night.
17. **Agreed**: not shown until there's a rule.
18. **Copy is fine.** In 3d and Home write it in sentence case: "Not opened yet". "Add without opening" and "Open this bag" stay.
    - **Rename "Bags open" to "On the shelf"** in 3c and 3d. It counts the bags you have, opened or not.
    - The slot line stays as it is: "3 of 5 slots free. Finish a bag to free one up."

---

## Round 6 (2026-10-14): 3f / 3g open points (28, 29, 34, 36, 38)

### 3f — Finished bags
28. **Reopen with 5 / 5 slots taken.** Say it once, above the list, instead of on every row:
    - Line under the header (Archivo 12/500, `text.secondary`, the same style as 3c's slot line): **"5 of 5 slots in use. Finish a bag in My beans to reopen one."**
    - Every row's Reopen: label `text.muted`, no underline, not pressable, still 44 tall. The row stays tappable if it opens 3g (37).
    - With a free slot, the line is hidden and Reopen looks the way 3f draws it.
29. **Confirmed**, with three details:
    - Line 2: **"Blue Bottle · Mar 2 → Apr 1"**. No "opened" / "finished" words: the arrow carries it and the line fits. With no roaster: "Mar 2 → Apr 1".
    - Cups and rating: "3 cups · ★ 4.4". A bag with no cups reads "No cups" and shows no rating.
    - No sort and no summary row in V1, but a fixed order: **latest finished first**.

### 3g — Edit bag
34. **Yes.** Opened on runs from the roast date to the day of the first cup from this bag. With no cups, up to today. A limit line under the field, the same as 11a's: "From Mar 30, the roast date, to Apr 6, your first cup from it." With no roast date: "Up to Apr 6, your first cup from it." With neither, no line (Round 4, 22).
38. **Yes, adopted as written:** "Your edits to this bag won't be saved. The bag stays as it was." Title and buttons as in Round 4 (19).
36. **Yes, put "Delete this bag" in V1's 3g.** Without it, a bag added by mistake can only be finished, and then it sits in 3f and skews "Finished bags".
    - **Confirmation**: 11b's sheet shape and buttons, with "cup" → "bag".
      - Title: "Delete this bag?"
      - Body: "It's removed from My beans for good. Your 3 logged cups keep its details." With no cups, the second sentence is dropped.
      - Third line, only for an open bag: "Drank it? Finish it instead. A finished bag can be reopened."
    - **Telling it apart from Finish**: they are on different screens. Finish is only on 3d's card, and Delete is only at the bottom of 3g, so the two never appear together. 3g has no Finish button.
      - Delete row's meta line: replace "Not finish — erases it" with **"For a bag added by mistake"**.
    - **Feedback**: yes, 13b's notice: "Ethiopia Guji deleted." It returns to where 3g was opened from (3d, or 3f).

---

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
