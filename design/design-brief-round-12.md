# Design brief — Round 12 (sent 2026-10-23)

**Status**: sent; no reply yet.

Three groups, A–C. Reply under "Round 12" in `design-response-next.md`, numbered as in this brief.

**Rounds 10 and 11 are answered** (`design-response-next.md`, "Round 11"). Thank you; they are being built next.

**Still open from earlier rounds** (not repeated here; please answer them with this round): D-37 (dashed underline = optional?), D-38 (placeholder colour), D-39 (setup footer 38), in `design-brief-closing.md` §3. Its §4 (6a's "My shelf" heading) is answered by your Round 11, D1.

**Scope reminder**: this is what Uryu needs to log his own coffee every day, not a version for other people.

## A. Updates to earlier rounds (no answer needed)

1. **Round 10, B9: your switch has happened.** You said to use "Limit reached. All 8 gear slots are in use." until 3b / 3e ship, then switch to the "Remove gear…" line. They shipped together with your answer, so the app goes straight to "No slots left. Remove gear from My gear to free one." The V1 line was never built.
2. **Round 11, D4 has changed since you answered it.** Profile's My gear row now opens 3b, so it is a pressable row under your C (chevron at the end). Its count stays "N of 8", as you OK'd.
3. **D-43, a mock-side fix never sent**: 3g's caption still reads "From 3d → “Edit”", but 3d's "Edit" was removed (D-29). Please change it to "From 3d → tap a card".

## B. 3b My gear and 3e Edit gear (built 2026-10-22)

3b is built as drawn, with D-26 (the whole row opens 3e; no ⋮, no sheet). It is reached from Home's "Manage my gear" (4a) and Profile's My gear (6a). Its rows follow your Round 11 C: no frame, a chevron at the end, the pressed fill out to the screen; the chevron becomes the 16 `text.secondary` one together with the other places. 3e is minimal, built like 3g. Items 4–6 report what we decided; 7–12 need your answer ("OK" is a full answer).

4. **What 3e builds, and what it doesn't.**
   - Built: Name (required), Maker, the default switch (brewer and grinder only), "Remove from my gear", Save.
   - Not built: the photo (no camera yet, as in 3g), Category, Added on, My settings note.
5. **Category can't be changed.** A cup holds its gear as brewer or grinder. Changing a grinder to "Kettle" would break that link on every cup logged with it. 3a only adds brewers and grinders.
6. **My settings note waits for grind.** Its line promises "Prefills the grind field when you pick this grinder", and V1 has no grind field. It comes later together with the other grind parts (`todo.md` T-11): the grind input on 5a / 11a, and 2c's "22 clicks".
7. **Should 3e show the category at all?** With no Category chips, only "My default grinder" says what the gear is. A kettle or scale has no default row, so for those 3e doesn't say it at all. Show the category as plain text, or leave it?
8. **The default switch, and removing a default** (Uryu's decisions; please check the look).
   - The switch turns off as well as on. "No default" is a valid state: someone with one grinder doesn't need a default. A switch that won't move when pressed looks broken.
   - Removing the default gear doesn't pass the default to another piece of gear. Doing that would quietly change the next cup without the user choosing it. 5a's Method starts empty until the user picks again.
   - Built at `size.switch` (D-20): on is a `color.action.bg` track with ink frames; off is `surface.sunken` with `border.muted` frames.
9. **Remove asks first** (`gaps.md` 18; the 11b sheet, as 3g's delete). The copy is ours:
   - title: `Remove this grinder?`
   - body: `It's removed from My gear for good. Your 12 logged cups keep its name.` With no cups, only the first sentence.
   - for the default only: `It's your default grinder, so new cups start without one until you choose another.`
   - buttons: `Remove from my gear` / `Keep it`

   Then the app returns to 3b and shows 13b's notice with the verb **"removed"**: `Comandante C40 removed.` 13b draws "deleted", and 3f already uses "reopened". OK?
10. **"Edits apply to the N cups already logged with it."** A rename rewrites the name on every cup logged with that gear. Unlike a bag, gear stays in use for a long time, so one grinder can have 100 or more cups. The line fits at 3–4 digits (measured). Is it enough warning at 183 cups, or should a large N read differently?
11. **3e's header uses Back, not ×** (as 3g; 3e draws ×). A pushed edit screen leaves the way it came in. OK?
12. **Two small things we filled in.**
    - 3b's kettle or scale row: the second line is the category alone, as on 4a. These are never on a cup, so "not used yet" says nothing. 3b draws "Kettle · not used yet". V1 can't add either yet.
    - Name when emptied: the placeholder is the category ("Grinder"). Save then shows the "· required" error, as 3c's Bean name does.

## C. Every bottom sheet closes on a swipe down (built 2026-10-22; ours)

13. Every sheet draws the handle, so every sheet now follows a swipe down and closes. The tuning is 15b's (Round 8): past 25% of the sheet's height, or a 300pt/s flick.
    - New: the Bag / Method picker (5a, 11a), the date sheet, and the confirmation sheets (3g delete, 3e remove, 11a delete, Discard changes).
    - On a confirmation sheet, a swipe means Cancel, the same as tapping the dimmed page. It never deletes or discards.
    - Checked on device, the date sheet's wheels included.
    OK as a rule for all sheets?
