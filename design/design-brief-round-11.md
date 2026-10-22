# Design brief — Round 11 (sent 2026-10-21)

**Status**: sent; no reply yet. Uryu then decided the personal card is shown (D2): "Logging since" over Cups / Bags / Week streak, no identity row.

Four groups, A–D. Reply under "Round 11" in `design-response-next.md`, numbered as in this brief.

**Still open from Round 10**: groups A–D (drift ×8 and D-56, the 3a hint, the line under the counts, the three 8f contradictions with the summary-line rule D12). They are not repeated here; please answer them with this round.

**Scope reminder**: this is what Uryu needs to log his own coffee every day, not a version for other people.

## A. Round 10 follow-ups (built 2026-10-21)

- **14, I made it cups with no roaster / no brewer.** Your "Packaged" / "Barista" headings name the cup's type, but an I made it cup can lack both too: a bag may have no roaster (Round 7, 41), and a cup logged from an empty shelf requires no bag or gear. It is neither Packaged nor Barista. Built (Uryu): it keeps **"No roaster" / "No brewer"** and comes first of the three tail groups (then Packaged, then Barista); under "Roaster A–Z" the same order after Z. OK, or another heading?
- **19, two headings you didn't name.** Built as:
  - no results with 4★ on: `Nothing matches “q” · 4★ and up` (your " · 4★ and up" rule applied here too, since 4★ narrowed it);
  - 4★ on, field empty, no 4★ cups: `No cups rated 4★ and up`.
  OK?

## B. 8f follow-ups (built 2026-10-21)

- **"Flavours I pick most" as its own block?** 8f's "What you keep saying" counts My words (written; 8h), so it waits for 8h. How often each flavour tag is picked is worth seeing too, but it is a different thing (picked from a fixed set, not written). Should 8f show it under its own heading? If so: heading and copy, where it sits, and how it stands next to "What you keep saying" once 8h exists (both will show).
- **Last shift's copy**: band names with the date: "Sweetness moved from Lightly sweet to Medium sweet on Oct 17." The cause ("after three naturals in August") is not built: no rule, and the app doesn't guess. OK? (Its frame is in "Pressable blocks" below.)
- **8f with nothing noted.** The page is "From 0 cups" over four empty axes ("Not noted yet"), with no stamp (state none). Does it need a line, or is that enough?
- **Header stamp.** 8f draws a smaller stamp (9px on `surface.inverse`, Round 8). Built with the card's stamp size: there is no 9px style. OK, or a style for it?
- **Home's Taste DNA card does not lead to 8f** (1b / 4a / 4b draw it with no tap; only the stamp is a button, which opens 15b). Making the card a link would put a button (the stamp) inside a button, which Round 8 avoids on Profile's card. 8f is reached from Profile and 2c. Should Home lead there too, and how?

## C. Pressable blocks: one treatment across the app

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

## D. 6a, Profile's upper part (being built now)

We build 6a's upper part next. 6b and 6c are not built at this stage. Everything drawn is built as drawn, except the parts below. Items 1–2 are reports with a question for later; 3–6 say what we do, and "OK" is a full answer.

1. **"My shelf" over My words: settled for V1, still open for 8h** (asked in `design-brief-closing.md` item 4, not answered).
   - "shelf" means gear + beans (§1 Words), so the heading doesn't fit My words.
   - 8h is not in V1, so the My words row is not shown. My shelf then holds gear and beans only, which fits the heading.
   - When 8h comes, My words needs a place: another heading, or a new one. Please answer it for then.
2. **The personal card has almost nothing to show in V1.**
   - The name and avatar come from 6d (Edit profile), which is not built. There is no value and no way to enter one. "Edit" leads to 6d, so it isn't shown either.
   - The "Home brewer" badge has no rule on any board: we don't know what gives it.
   - What V1 can fill: "Logging since ‹month› · N weeks" (from the first cup), Cups and Bags. "Week streak" has no rule on the boards; if we show it, the rule is ours (Monday-first weeks with at least one cup, as Home's strip).
   - Whether the card shows at this stage is Uryu's call (reported separately). For later, please answer: what the card shows before a name is set, and what the role badge is based on.
3. **The Taste DNA card** leads to 8f. The stamp inside is a plain chip with no ⓘ and no tap of its own (Round 8, so there is no button in a button).
   - The summary line waits for Round 10, D12: not shown.
   - "Acidity high / Body light / Roast light" (Round 10, D13): until you answer, they show the band names 8f uses ("Bright · Light-bodied · Light roast"), one per noted axis, as Badges (fill, no frame). The board's outline chips would read as options (§1 Tap affordance) inside a card that is a button.
   - "Built from N cups · last shifted N days ago": built as drawn.
4. **My gear's row** leads to 3b, which comes right after 6a. Until then the row shows its count with no chevron and no tap. The count is "N of 8": 6a's "of 3" contradicts 3a / 3b / 4a (`gaps.md` 24).
5. **My beans' "1 stale"**: staleness (21+ days since opening, 8i) is not built anywhere. The row reads "N of 5" only. N counts every bag on the shelf, opened or not, as your Round 7 item 18 set ("On the shelf").
6. **The export moves under 6a**, out of the placeholder. 6b draws it under "My data" as "Export my cups — 147 cups as CSV, notes included". We build that one row of 6b's "My data" under My shelf, in 6b's form. Ours writes every table as JSON, so its second line reads "N cups as JSON, notes included". The rest of 6b comes later.
