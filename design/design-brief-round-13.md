# Design brief — Round 13 (sent 2026-10-23)

Round 13 · responds to design-response-next.md Round 12

**Status**: sent 2026-10-23; no reply yet.

Five groups, A–E. Reply under "Round 13" in `design-response-next.md`, numbered as in this brief. A1 and E ask for answers; B, C and D are reports.

**Scope reminder**: this is what Uryu needs to log his own coffee every day, not a version for other people.

## A. Round 12: what we built (2026-10-23)

1. **Question: 3e's category sits at the top of the body, not under the header title. Is that OK, or should the header take a second line?**
   - Why: 3e's header is the compact one (Back and the title on one row), and its collapse is measured from that one row, so there is no line under the title to put it in. A second line means changing the compact header, which every Record-flow and pushed screen shares (5a, 5b, 2c, 11a, 3a–3g, 8f).
   - What is built: "Grinder" / "Brewer" / "Kettle" / "Scale" in body.sm, `text.secondary`, as you said, just above the card. Checked on device by Uryu (2026-10-23).
2. **Built as you answered**:
   - 9: the default line reads "It's your default grinder. New cups start without one until you pick another."
   - 10: one wording at any count, grouped from 1,000, tabular numerals. Also on 3g's "Edits apply to the N cups already logged from this bag." and on the cup counts in 3e's remove sheet and 3g's delete sheet, so one screen never shows "1000" beside "1,000".
   - 13: written into §1 as "A sheet with a handle closes on a swipe down".
   - Home's Taste DNA card with nothing noted: no badge, and "Rate a cup and note one taste to start." under the axes.
3. **D-37 / D-39**: recorded in `drift.md` as mock-side fixes (8o's solid underline; 34 for the setup footer). 8c, 8n and 8o are not in V1, so nothing changes in the app.
4. **Your three checks**:
   - D-46: matches what is built ("· required" only while an error shows).
   - D-37 / 38 / 39 unchanged in the mock: right; the last brief asked for a report only. Please make D-37 and D-39 now. D-38: see C.
   - The old → arrows on 2c, 3d's "Finished bags" and Home's shelf: the app has used the › chevron there since your Round 11, C. Please switch the mocks.

## B. Items you answered twice: our mistake

Round 12's "Earlier open items" came from our `design-brief-next.md`. Those items had been answered in Rounds 1 and 2 (2026-10-11 / 12) and built, but we never took them out of the file, so they read as open. **This was our mistake, not yours.** You answered what was in front of you.

Three of your new answers differ from the earlier ones that are built. Uryu decided each one on its merits, not on which answer came last: changing something already built needs a reason the new answer is better. We have since cleaned the file, and added a check to `ways-of-working.md` ("Before sending a brief") so it does not happen again.

1. **An axis with nothing noted: kept as built (Round 2, 10b).**
   - It stays the bare track with words centred on it. No "—" and no "Fills in as you note each taste." line.
   - The words differ on purpose, because these are two different states. "Yet" promises the gap will fill.
     - **A profile's empty axis** (Home, 8f, 5c): **"Not noted yet"**. Nothing noted so far; noting it on a later cup fills it.
     - **A cup's own empty axis** (2c, 11a): **"Not noted"**. That cup was logged without it, and a cup's axes can't be edited, so it never fills.
   - This is now written in §9 (Taste axis readout, Value null) so the two words aren't later "fixed" into one.
2. **5c's copy: three of the four parts are kept; the summary's length is adopted.**
   - **First value: kept, "Starts at Bright"** (your Round 1). "First reading: Bright" is the language of an observation log, not this product's voice. "Starts at" says where the value was placed on the axis, which is what happened.
   - **Phrases: kept, "lighter-bodied" / "fuller-bodied"** (your Round 1). You solved the two "light" poles with nouns then ("-bodied", "roasts"). "Lighter in body" solves the same problem another way. Nothing was wrong with the first solution, so we have no reason to solve it again.
   - **Which axes the summary names: adopted. Only the two that moved most.** This one is about how much the sentence says, not wording, and your answer is right: with four axes moved, "This cup pushed you brighter, lighter-bodied, toward darker roasts and sweeter" is too long to say anything. Two say what moved most. Built 2026-10-23.
     - The other axes are left unnamed. Each moved axis has its own line under the sentence ("Moved N points toward …"), so nothing is lost.
     - Ties keep the axes' order: Acidity, Body, Roast, Sweetness.
   - **Nothing moved: kept, "Your Taste DNA stays where it was — nothing on this cup moves it."** "Saved." repeats what 5c's title "Noted." already says: the cup is saved.
3. **Lock-in: kept in notes. Our brief said "cups"; that was our error coming back to us.**
   - Our stale item read "1b's 'N more cups to lock it in'", and your Round 12 answer used our word. The rule (your Round 1, item 13) counts **notes**: an axis's count grows only with cups that note that axis, and a cup that skips an axis does not count for it. So "N more cups" would be wrong whenever a cup skips an axis.
   - It stays in notes, as your Round 1 adopted copy has it: "Body needs 3 more notes to lock in." / "Body and Roast need 3 more notes each to lock in." / "1 more note".
   - **One correction on our side.** The app shows this line in 15b's progress box (Home shows no lock-in line in V1). Your Round 8 wrote it there without "to lock in" ("Body and Roast need 9 more notes each."), and we built it that way on 2026-10-18 without telling you it differed from the 2026-10-12 decision. Uryu put "to lock in" back (2026-10-23): the line should say what the count is for on its own, not lean on the sheet's paragraph above it, whose copy is still provisional. Please use this form on 15b's board too.

## C. D-38, the placeholder colour: kept, with the contrast gap recorded

- You asked for one colour, `text.secondary`, and noted that #9B8F87 is under 4.5:1. Uryu kept `color.text.placeholder` (#9B8F87).
- The reason: on device (2026-10-12, again 2026-10-23), a placeholder in `text.secondary` could not be told from an entered value. Your point that entered text is `text.primary` holds for colour; but a field's placeholder and its value share one text style (`title`, 16 / 700, drift D-44), so weight doesn't help.
- The contrast gap is recorded (`gaps.md` 36). Its root is D-44: with a 16 / 500 style for the field's text, a placeholder could take `text.secondary` and still read apart. Both are decided together at the final polish. Nothing changes now, in the app or the mock.
- 5b's "My words" placeholder already uses the shared placeholder colour in the app.

## D. Reports (no answer needed)

### Round 11 follow-ups (built 2026-10-23)
- **8l's matched text is not shown.** Your C4 moved 8l's results onto 2a's row, which has no place for the outline tag that shows what matched (Round 10, 19 / 20). We tried it after the mode badge on a Badge's fill; on device it read as a second badge, so Uryu dropped it (2026-10-23). The row's own lines (title, source, note) already hold most matches.
- **6a's summary line is `display.sm` (30).** 6a draws it 27, which has no style; `display.xs` (24) read too small on device (Uryu, 2026-10-23).

### Drift never sent: D-7 to D-16
Each is a mock-side fix; the token side already holds the right value. D-10 and D-11 are withdrawn and not asked.
- **D-7** · 4a / 4b: letter-spacing written `0.16em` → `.16em`. Same value; notation only, for diffing.
- **D-8** · 5d: body copy at `12.5px` (3 uses) → `body.sm` (12). No fractional size exists elsewhere.
- **D-9** · 8m: body copy at `13.5px` (3 uses) → `body` (14). Same.
- **D-12** · 5a / 5d / 5e: the "Optional" tag in the Add a photo slot is 11 / 600 / .06em caps → `label.caps` (12 / 700), as 3b / 3d's slot tags.
- **D-13** · 5a / 5d / 5e: space between form sections is 16 / 20 (5a, 5e) and 18 (5d) → `gap.section` (12). 20 is `gap.axis`, the taste axes' own rhythm.
- **D-14** · 5e: intro line says "Bottled cups…" → **"Packaged cups…"** (the 2026-10-04 rename; the sample is a can). Built that way.
- **D-15** · 5e: "Bought at" shows "¥180" → **store name only**. There is no price in the data model, on purpose. Built that way.
- **D-16** · 2a: every row's source line has the same density → **by mode**: I made it = roaster · process; Barista = place only; Packaged = brand only. Only what the data holds is shown. Built that way.

## E. 2a's category chips (we build them next)

The chips under 2a's search row (your 2a board: All / I made it / Barista / Ready-to-drink; see E1 for the last name) come next. They are the first real filter on 2a. Here is what we plan to build, and what we need from you.

1. **What we build. Tell us if any of it is wrong.**
   - **Labels**: All / I made it / Barista / **Packaged**. "Ready-to-drink" is the old name (the 2026-10-04 rename, as D-14).
   - **One at a time, All by default.** A chip shows only the cups of that type.
   - **Built with `SegmentedControl`**, as 8l's scope row (ink fill when selected, 44 tall), not the board's 25-tall outline chips. A control must be 44 tall (§1; `gaps.md` 3), and 8l already has this row.
   - **The chip and 2b combine**: the chip picks the cups, then 2b's sort and group arrange them.
   - **Each launch starts from All**, as 2b's sort starts from Newest first (not stored).
   - **8l doesn't take the chip.** Search has its own scopes and searches every cup.
   - **Barista stays.** A Barista cup can be logged today (with no café or drink yet), so the chip has cups to find.
2. **Your Round 10, 16 and 18, again.** When you answered them, no chips existed; you tied both to "until a real filter exists". The chips are a real filter. Here is where they go, then how we read 16 and 18.
   - **2a, top to bottom, as built today**: the header ("The archive" / "Records", the "N Cups" stat on the right) over its 2px ink rule; the search row (the "Search my cups" field, then the 44 filter button on the right, which opens 2b); then the list, grouped (month headings by default, the sort's name on the right of each).
   - **The chips go between the search row and the list**, as your 2a board draws them: one row, full width, All / I made it / Barista / Packaged, the same row 8l uses for Words / Beans / Gear (8l, under its search field, is the closest picture of it). The list under it shows only the chip's type.
   - **2b does not change**: it still holds Sort (Newest first, Oldest first, Highest rated, Roaster A–Z) and Group (Month, Brew method, Roaster, None), and opens over 2a as now. The chips are not in it.
   - We read:
     - 16: the filter button stays as it is. The reason: the filter lives in the chips on 2a, which show which one is on; the button opens 2b, which still holds no filter.
     - 18: 2b's button stays "Done", with no count. The reason: nothing in 2b changes how many cups there are; only the chips do, and they apply at once, with no button.
   - OK, or did you mean the count and the "in force" look for this case? If you need to see it drawn before answering, say so, and we will build the chips first and ask again.
3. **The header's "N Cups" with a chip on.** The total, or the cups shown under it? We would show the cups shown, so the number always matches the list. Which one?
4. **A chip with no cups: please write the line under it.** For example, Packaged with no Packaged cup logged yet.
   - **What it is**: not an error and not an empty search. It means "you haven't logged this type yet". Nothing is wrong.
   - **The four chips stay**: all four always show, so none of them moves when one has no cups. The line goes where the list would be.
   - **The reason differs by type**: no Barista cup means you haven't logged a café drink; no Packaged cup means you haven't logged a can or bottle; no I made it cup means you haven't logged a brew at home. One line for all, or one for each type: your call.
   - **Tone: please choose.** Either state the fact only (as 8l's "Nothing matches “q”"), or invite logging one. Note that V1 can't log a café or drink on a Barista cup yet (only the type), so an invitation for Barista promises less than it seems.
   - **Length**: one line at 390pt, in body.sm or body, `text.secondary`, as 8l's heading. No illustration and no button (as 8l's "Nothing matches").
