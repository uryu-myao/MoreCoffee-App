# MoreCoffee — State gaps to design

States and behaviours the React Native code will need that **do not exist anywhere in the 30 shipped screens**. Ordered by how directly each one causes a production failure.

Source: `MoreCoffee design.dc.html` · 30 screens · 2026-09-20

---

## By component (2026-10-07) — read this first

The cross-cutting items below (2 focus, 3 chips, 4 pressed / disabled / loading, 5 empty, 6 error) are broken down here by component, from the catalog in `components.md`. §1 Hard Rules now settle, for every component, pressed (2026-10-04 / -06), and focus (delegated to the OS on iOS), tap affordance, the selection limit and the disabled look of options (2026-10-07), so none of them is repeated per row. Rows 5–8 and 10 (the option sets) have nothing left and are gone from the table.

| component (catalog #) | missing states |
|---|---|
| Button (3) | destructive look; disabled for text and compact buttons |
| IconButton (4) | disabled; what the accent fill means (2a) |
| Toggle switch (9) | disabled |
| FieldRow (11) | disabled; empty value; loading (lookup) |
| Star rating (12) | disabled / read-only |
| List row (13) | loading / skeleton |
| Taste axis slider (18) | disabled (dragging and clearing: specced 2026-10-07, §9) |
| Grouped list (20) | empty group |
| Navigation / settings row (21) | disabled; destructive look |
| Notification row (22) | empty list |
| Text input (23) | placeholder / empty; inline error; disabled; at the length limit |
| Search field (24) | no results; loading; clear |
| Bottom sheet (25) | drag / dismiss motion |
| Bean freshness meter (28) | resting / too fresh (item 8) |
| Shelf preview list (29) | empty |
| Weekday strip (30) | today's underline (item 9) |
| Try next teaser (31) | progress toward the threshold (unconfirmed) |
| Photo slot (34) | uploading; failed |
| Suggested value row (35) | applied |

Plus, globally:
- ~~one focus rule~~ settled (§1 Focus, 2026-10-07);
- two error flows, save failure and offline (item 6);
- six first-run empty states (item 5).

**Estimate (recalculated 2026-10-07, second pass)**: **49 → 45 → 40 states**.

| | start | first pass | second pass | change |
|---|---|---|---|---|
| per-component states | 40 | 37 | **32** | −3 (limit ×2, tap affordance), then −5 (one disabled look for rows 5, 6, 7, 8, 10) |
| focus | 1 | 0 | 0 | settled in the first pass; now also delegated to the OS on iOS (no work) |
| error flows | 2 | 2 | 2 | — |
| first-run empty states | 6 | 6 | 6 | — |
| **total** | **49** | **45** | **40** | **−9** |

- 40 rather than about 39: focus was already taken out in the first pass, so delegating it to the OS removes nothing more from the count.
- **Boards**: about 21 (19 components with something missing, plus errors and empties).
- The two components added in the second pass (word tag, attribute tag) bring no missing states.
- **Not states, but work**: screen-reader roles (item 11).
- **After the axis spec (2026-10-07)**: 32 → **30** per-component states (dragging and clearing settled), **40 → 38** in total.

---

## 1. Long text from user input has no truncation anywhere — **highest risk**

**Parts affected**: every place a user-supplied string is rendered — bean name, roaster name, gear name, profile name, tasting note, "My words" entries, café name.

**Measured**: `text-overflow` **0 uses / 30 screens**. `-webkit-line-clamp` **0**. `overflow-x` / `overflow-y` **0**. The only clipping in the product is `overflow: hidden` on the screen root (15 screens), and the only wrap control is `white-space: nowrap` (5 screens / 40 uses) — **none of which is on user-supplied text**.

**What happens if left alone**: a long bean name wraps freely and pushes a list row taller, breaking the aligned right-hand meta column; inside any fixed-height row (`size.field.height` 46, `size.tapTarget` 44, `size.control.row` 52) it is clipped by the parent instead, silently hiding content. Neither outcome was designed, so RN engineers will each invent their own behaviour.

**Needs designing**: line count per surface (list-row title, card title, note preview, profile name), the truncation form (ellipsis vs clamp vs shrink), and the full-text affordance (tap to expand vs detail screen).

**Status: RESOLVED (2026-10-04)** — confirmed by design, and verified on device (ja long strings hold at 2 lines). See `design-system.md` §3.1: tail ellipsis; `name` 2 lines, `meta` 1, `note` 3; full text on the detail screen.

**Update (2026-10-06) — café and brand names**, the riskiest case: they come from the user or from MapKit (official names, often long). The DB stores the full name. Café and brand names display on **1 line with a tail ellipsis** (`meta`); drink and product names take **at most 2 lines** (`name`). See `design-system.md` §9 List row.

---

## 2. No focus state exists — **high risk for accessibility and TV/keyboard input**

**Parts affected**: every field, button and chip. By component: every pressable in `components.md` (25 of them); designed once as a rule, then applied.

**Measured**: `outline` **0 uses / 30 screens**. The only focus expression in the product is `color.caret` (a 2px text cursor, 4 screens).

**What happens if left alone**: keyboard and screen-reader users have no visible focus; RN's default focus ring (where it exists) will fight the square, hard-edged visual language.

**Needs designing**: a focus treatment consistent with the binary border system (a 2px outline is the obvious candidate, since a third border width is forbidden).

**Status: DELEGATED TO THE OS — no action (2026-10-07)**. On iOS (MoreCoffee's only platform) the OS draws focus for hardware keyboards, VoiceOver and Switch Control, so focus is not missing: the OS owns it. §1 Focus stays as the rule for Android and a future web build; a custom frame on iOS would need a native module (not in V1). Still to check once: iOS's own indicator on a device with an external keyboard, and whether it clashes with this design.

**Earlier status (2026-10-07, first pass)**: §1 Focus. One 2px `color.caret` frame outside the element, a `space.2` gap, non-touch focus only. **Platform limit**: Android can implement it as written (`focusable` + `onFocus` fire for keyboard / D-pad, not in touch mode). On iOS, RN 0.86 fires `onFocus` only on tvOS, so the frame cannot be drawn and the system draws its own focus effect for hardware-keyboard focus. Still to check on device: focus + pressed at once, 3.20:1 on `state.pressed.surface`.

---

## 3. Tappable chips are 39px tall and are not marked as tappable

**Parts affected**: `badge.standalone` used as a control — 5a's maker picker (3 uses, the only genuinely tappable chips in the product), 3f's sort chips ("Newest" / "Best rated" / "Most cups"), 2b's range chips.

**Measured**: the 3 tappable chips compute to **11 (v) × 2 + ~14 (line box) = 39px**, below `size.tapTarget` = 44. The 3f and 2b chips read as controls but are plain `<span>`s with **no `cursor: pointer` and no selected state**.

**What happens if left alone**: sub-44px hit areas fail platform guidance and feel unreliable under thumb; chips that look pressable but are not produce dead taps.

**Needs designing**: the tappable chip's height (padding or an invisible hit-slop), plus its pressed / selected / disabled states. Deciding which chips are interactive at all is OQ-13.

**First visible cost (2026-10-06)**: 5b's flavour chips at `inset.control` (44 tall) wrap to **3 rows** at 390pt where the mock's 39-tall chips take 2. This cannot be solved in implementation; it stays at 3 rows for now. To bring with the chip component: whether 44 can hold 2 rows (tighter horizontal padding, fewer chips per row, shorter labels); how much taller the whole screen gets; and whether the mock's 39 was deliberate or simply did not consider tap height.

**Resolved for the mock's chips (2026-10-08)**: horizontal padding back to the mock's 14 (`space.14`) keeps the five chips at 44 tall in **2 rows** at 390pt. Display rule decided with it: selected + unselected = 5 chips, plus Search. Longer words can still make 3 rows (item 15).

**Status (2026-10-04)** for the maker chips (`SegmentedControl`): height is resolved by `inset.control` (44px, no hit-slop). Selected is the 5a ink fill. Pressed follows the §1 Hard Rule. Disabled is still undesigned. The 3f / 2b chips remain open under OQ-13.

---

## 4. Pressed, disabled and loading states are undesigned for every component — broken down by component above (2026-10-07)

**Parts affected**: all buttons (primary / secondary / tertiary / icon), all chips, list rows, form fields, the tab bar.

**Measured**: `:active`, `:hover`, `:focus`, `cursor: not-allowed`, `pointer-events` — **0 uses each**. `opacity` appears **twice, both on the 2b sheet's dimmed backdrop** (0.45), not as a disabled treatment. The nearest thing to a disabled state in the whole product is `border.empty.inert` (formerly `border.empty.disabled`; `2px dashed` `color.border.muted`) on 5d's blocked add-button, and the greyed marker `marker.optional`.

**What happens if left alone**: hard shadows make press feedback especially conspicuous by its absence — the natural affordance is the shadow collapsing, and if nobody specifies it, each screen invents a different amount. Async actions ("Save this cup") have no in-flight state, so double submissions are invisible.

**Needs designing**: press (shadow offset → 0? translate?), disabled (which of ink/border/surface changes), loading (spinner vs skeleton vs label swap) for each component in the base set.

**Status (2026-10-04)**:
- **Pressed — decided.** System-wide Hard Rule, decided by whether the element has a surface: a surface darkens its fill (`state.pressed.surface` / `state.pressed.action`); a bare glyph scales to `state.pressed.scale` over `motion.press` (revised 2026-10-06). Never opacity. Border, label and shadow stay. See `design-system.md` §1. Darken: Button, SegmentedControl, FieldRow, StarRating, IconButton. Scale: the bottom-bar tab icons.
- **Disabled — decided for Button only** (§9). Still undesigned for chips, rows and fields.
- **Button secondary height (2026-10-06)**: the mocks draw every full-width secondary at 52 (primary 56). `Button` renders both at 56. Pending: which token the secondary takes (`size.control.row` is 52 but named for list rows), then the fix. `drift.md` D-17 was withdrawn for this.
- **Loading — deliberately not needed.** This is not deferred pending design. Saves write to local SQLite and are instant, so there is no in-flight state to show. Revisit only when Step 5 introduces real async (MapKit lookup, barcode lookup).

---

## 5. Empty states exist for only one surface

**Parts affected**: Records list, My gear, My beans, Notifications, Try next, My words, Finished bags. By component: Grouped list (20), Notification row (22), Shelf preview list (29), Search field "no results" (24).

**Measured**: exactly one empty treatment exists — 2a's `2px dashed` `color.border.muted` frame plus the `layout.empty.block` (100) spacer. 2b contains a skeleton row (`#DBCCC3` title bar + two `#E4D6CC` meta bars) but that is a dimmed backdrop, not a designed loading state.

**What happens if left alone**: a new user sees blank screens on first launch — the worst possible first impression for a logging app whose whole premise is accumulating records.

**Needs designing**: first-run empty state per list, and whether empty differs from loading.

---

## 6. Error states exist for one screen only

**Parts affected**: every form and every network action. By component: Text input inline error (23), Photo slot failed (34), FieldRow lookup (11); plus the save-failure and offline flows.

**Save failure, as built in stage 1 (2026-10-10)**:
- An alert, "This cup wasn't saved — Everything you entered is still here", followed by the raw technical error. The sheet stays open with every input kept (checked by forcing an insert failure).
- **The wording is undesigned**: the technical message is a stand-in so a failure is never silent.

**Measured**: the error system (`state.error.border` / `.surface` / `.shadow` / `.text` / `.dashed`) appears on **5d alone** — missing required fields in the log-a-cup form. There is no network error, no save failure, no offline state, no per-field inline error.

**What happens if left alone**: the vocabulary exists (brown border + brown hard shadow + tinted surface) but its scope is unproven; engineers will apply it to failures it was not designed for, or invent a red that does not exist in the palette.

**Needs designing**: save failure, offline, and per-field inline error, reusing the 5d vocabulary.

---

## 7. Nowrap chips will overflow once the UI is translated

**Parts affected**: the 40 `nowrap` uses — **all fixed copy, none user-supplied**: brew-method chips `Filter / Espresso / Cold brew` (12), maker chips `I made it / Barista / Packaged` (12; the mocks still say "Ready-to-drink"), dates `Apr 8 / Apr 7 / Apr 6` (12), status label `Early signs` (4).

**What happens if left alone**: safe in English. Once Japanese and Simplified Chinese ship (8m already lists three languages), `Best rated` and the brew-method chips grow while `nowrap` keeps them on one line — they will push out of the row or out of the card.

**Needs designing**: per-locale behaviour for chips — shorter strings, wrapping allowed, or horizontal scroll.

**Note (2026-10-06)**: user-supplied names (café, brand, drink, product) are never `nowrap`. They follow the truncation rule in item 1.

**Update (2026-10-04)**: the maker chip "Ready-to-drink" is renamed **"Packaged"** (ja 市販品, zh 市售) (decided 2026-10-04). The three maker chips now fit on one line at 390 / 393pt. Brew-method chips and `Best rated` are unchanged.

---

## 8. `beanFreshness` has no state for a freshly opened bag

**Decided 2026-10-14** (data-model.md "Freshness", `src/data/freshness.ts`): from the roast date, resting 0–6 / drink now 7–21 / past peak 22+, a 42-day bar; no roast date → nothing shown. The meter is built on 3d and 4b; **resting's look is provisional** (drinkNow's colours) until Design draws it (design-missing.md 39). ~~**At this stage (decided 2026-10-12)**: no freshness meter. 4b / 3d show the text "Day N" only, counted from the roast date like 5a's "day N", and nothing when the bag has no roast date. The meter returns when its rules are settled (base date, peak window, the resting state).~~

**Parts affected**: the bean freshness meter on 3d and 4b.

**Measured**: the peak band starts at 17% of the track, so days 0–4 (degassing) fall outside both defined states. Only `drinkNow` and `pastPeak` have colours.

**What happens if left alone**: a bag opened today renders with an empty elapsed bar and no explanatory label — it will look identical to a data error.

**Needs designing**: a third state (resting / too fresh), which also settles OQ-3 (whether `peakBand` is intentionally state-dependent).

**Exposed by 3g (noted 2026-10-09, not solved)**:
- 3g lets the user edit "Roasted on" and says freshness is "Recounted from the roast date when you change it".
- Set the roast date to today and the bag is at day 0. The elapsed bar is empty, before the peak band (17%), in exactly the undefined resting range. It has no colour and no label.
- Two more open points:
  - `beans` has only `opened_at` ("drives the freshness meter"); there is no roast-date column, though 3g counts from the roast date. Which date drives freshness is undecided.
  - The mocks' day counts do not agree on a base date. 3d / 3g say "opened Apr 6 · Day 7" with roasted Mar 30, while 5a's cup on Apr 8 shows "day 7".

**Read further 2026-10-09: two clocks.**
- **Today**:
  - `beanFreshness` exists only as tokens; the meter (`components.md` #28) is not built.
  - The data model stores only the opening date (`opened_at`, "drives the freshness meter").
- **What the mocks count from**:
  - "Day 7" fits **the roast date** best. 3g says so outright ("Recounted from the roast date").
  - The meter's shape is degassing: its peak band runs ~day 6–19 of a ~37-day track, and the elapsed fill at day 7 is 19%.
  - From the opening date the two bags on one screen would need different "todays": Ethiopia Apr 13, Fuglen Apr 19.
  - From the roast date, Day 7 means Apr 6. That agrees with Fuglen (roasted ~Mar 11, not shown) but not with 4b's cups dated Apr 7–8. The mocks are not fully consistent either way.
- **Opening is a second clock**: 8i "Bag going stale — around day 21 after opening" (oxidation), and 6a's "1 stale".
- **So both dates are needed**:
  - roast date → freshness day, the peak, and the resting state this item lacks;
  - opening date → staleness.
  - A roast date is missing from the model; adding it is planned.
- **With a roast date, a resting state is required**, not optional: a bag roasted today is day 0, before the peak band.

---

## 9. The weekday strip's active-day underline is unimplemented

**Parts affected**: the "This week" strip on 1b, 4a, 4b.

**Measured**: date numerals carry `border-bottom: 2px solid transparent`; the current day is distinguished only by ink (`color.text.primary` vs `color.text.muted`). The transparent border is a slot that was never filled.

**What happens if left alone**: minor — ink contrast alone is a weak "today" signal, and the placeholder invites someone to guess a colour.

**Needs designing**: whether the underline renders, and in which colour.

**Built 2026-10-12 from 1b's export**: the export draws today's underline in ink (2px), so the strip does: today's letter in ink and an ink underline under its date.


---

## 10. Brew category has no column — the 2a badge is not shown

**Parts affected**: the Records list (2a). Each row's first badge ("FILTER" / "ESPRESSO" / "COLD BREW", accent tone) is a brew category.

**Measured**: the data model has no brew category. `brew_method` holds the brewer ("V60") and exists only for `made_it`; barista and packaged cups have no brewing data at all.

**Decided (2026-10-05)**: the badge is **not shown**, and it is **not derived from `brew_method`**. A derivation needs a lookup table full of real judgement calls (is an AeroPress filter or espresso? a moka pot?), and it would only ever cover `made_it`. A derivation that is incomplete from day one is worse than an absent field.

**Records row (2026-10-06)**: I made it's line 2 stays "roaster · process". It moves to the brew method only once a brew-method input exists; revisit then.

**Needs designing**: a `brew_category` column with a deliberately settled taxonomy. **Fold this into the Try Next work**, which needs that dimension anyway; do not rush it into a screen.

---

## 11. Screen-reader roles and states — every component (added 2026-10-07)

**Parts affected**: every pressable, a separate axis from the visual states.

**Measured**: the mocks carry no roles (`role` / `aria-*` 0 uses). In code today:
- `Button`, `IconButton`, `FieldRow`, `EmptySlot`: button.
- `SegmentedControl`: radiogroup / radio + checked.
- `FooterNav`: tab + selected, and the + as a button.
- `SectionLabel`: header.
- **Fixed 2026-10-07**: `StarRating` was button + selected and is now radiogroup / radio + checked. 5b's flavour chips are now checkbox + checked, with the Search opener a button.

**Rule** (§1 Tap affordance): every pressable sets its role and state:
- roles: button, radio, checkbox, switch, tab;
- states: selected, checked, disabled;
- plus the selection limit's disabled hint.

**Needs doing**: each component spec lists its role and states; the not-started components (switch, checkbox list, settings row, …) take them from the start.

---

## 12. A disabled option has no visible reason — unless the limit caused it (added 2026-10-07) — CLOSED 2026-10-12 by rule

**Closed**: §1 now requires every disabled option to show its reason — a row in its own meta line, chips and tags through the set's count — and forbids a disabled option whose reason can't be shown. Markers also differ (unselected 2px ink, disabled `border.muted`).

**Parts affected**: every option set (§1 Disabled options).

**Measured**: the disabled look is shared. A limit-locked option is explained by its count. An option disabled for its own reason (not available now) has nothing on screen that explains why; only the screen-reader text can.

**Needs designing**: a visible way to give the reason. Not solved now.

**Disabled buttons too (added 2026-10-11) — CLOSED the same day**: the three below are no longer disabled. They follow 5d: pressable, and a press shows what is missing (5a / 5b: 5d's state, 5b going back to 5a; 3c: the field's error). The warning haptic is left on the three buttons whose reason is on screen: 5b's locked Search, 3c with no slot free, 3a "Save 0 items". As found:
- **5a "Save this cup" with no rating**. The mocks answer this differently: **5d ("Missing required fields — after tapping Save") keeps Save pressable** and, on a press, shows what is missing ("Tap a star — this is the one thing the app can't guess.", "Two answers are still missing", "Go to first"). The app disables Save instead (stage 1). To decide: build 5d's flow, or keep disabling and show a reason.
- **5b "Save this cup" / "Save without the note" with no rating**: 5b shows only "–" for the rating; nothing says it is required.
- **3c "Open this bag" with an empty name**: Bean name carries no required mark; only the other fields' "Optional" hints at it.

---

## 13. 5c's movement copy covers 2 of 8 directions, and has no threshold (added 2026-10-07)

**Parts affected**: 5c "What the cup changed": the line under each moved axis ("Moved 6 points brighter").

**Measured**: 4 axes × 2 directions = 8 phrasings; the mock has 2.

| axis | toward the low pole | toward the high pole |
|---|---|---|
| Acid ↔ Bitter | **brighter** (5c) | — |
| Light body ↔ Full body | — | — |
| Light roast ↔ Dark roast | **lighter** (5c) | — |
| Low sweetness ↔ High sweetness | — | — |

**Also undefined**: how many points an axis must move before 5c shows it. 6 and 4 are examples, not a threshold.

**Needs designing**: the 6 missing phrasings and the threshold. Copy, decided separately from the axis slider spec.

---

## 14. Taste axis: Clear's touch slop over the track's bottom right — accepted (added 2026-10-08, accepted 2026-10-09)

**Parts affected**: `AxisSlider` on 5b (entered axes, where Clear shows). Not a scrolling problem: the only text button outside the dev harness is this Clear.

**Status**: the visible problem, axis drags moving the Record sheet, is **resolved by design** (left-edge swipe only, device-confirmed). This item is what remained, and **its cause is now found**. The fix is not yet chosen.

**Evidence (device log 2026-10-08)**: in-band touches split cleanly by distance below the rail's top edge.
- **All 15 hits were 6.7–17.0pt down. All 10 misses were 19.3–35.6pt down**, and every miss was under the handle (within about 28pt of it horizontally).
- The guess that the band was logged stale after a scroll was wrong. On the simulator the logged y equals the live y; only x was stale, measured while the page was still sliding in.

**Cause**: Clear's touch slop reaches up into the rail.
- Clear is a text button with `hitSlop` top / bottom 16 (`Button.js` `TEXT_HIT_SLOP`). It sits in the 17pt slot under the rail and travels with the handle.
- In React Native's Fabric renderer a child's `hitSlop` widens its parents' overflow area (`YogaLayoutableShadowNode.cpp`). So iOS hit-testing reaches Clear 16pt above it: to about 13–17pt above the rail's bottom edge.
- The slot comes after the touch band, so it is drawn above it and wins the overlap. A touch there goes to Clear's Pressable, and the axis gets nothing. A drag cancels the press; **a tap there would clear the axis**.
- Confirmed on the simulator with the renderer's own point lookup (`findNodeAtPoint`): the slot wins from about 23pt below the rail's top edge.

**Re-measured after the 2026-10-08 revision** (Clear right-aligned under a 34pt track; simulator, `findNodeAtPoint` plus geometry):
- Clear's slop now reaches about **5pt into the bottom of the track**, from the track's x 209 to 268. That is the right ~51pt, plus 8pt beyond the end.
- No stop but the last is touched. At the last stop (handle x 230–256, y 4–30 of 34) only a **1pt strip at the handle's bottom** overlaps.
- What remains: a tap just under the track's right end clears the axis. That spot sits right above the Clear label.
- **Accepted (2026-10-09).**
  - Since Clear became `meta` with a 14pt slop, it reached about **6pt** into the track (simulator).
  - **Now (2026-10-09)**: the line moved to `gap.tight` (4) under the track and the slop to top 8 / bottom 20. Measured: **4pt** into the track, ending exactly at the next axis's labels below.
  - Horizontally it covers the track's x ~220–268.
  - At the last stop that is a 2pt strip of the handle's bottom.
  - No fix applied.

**Fix options** (none applied):
1. **Draw the touch band above the slot**: render order or `zIndex`. The band wins its whole area and Clear keeps its slop elsewhere. Clear's reachable height then runs from the band's bottom down, about 31pt instead of 44.
2. **Asymmetric slop for Clear**: top small, bottom larger, pushing its 44pt down into the 20pt gap before the next axis. Its slop must still not reach the next axis's labels.
3. Both.

---

## 15. Flavour tags: long words can make 3 rows — accepted, not solved (added 2026-10-08)

**Parts affected**: the flavour tags on 5b.

**Decided**: 5 chips are shown, selected + unselected (unselected = 5 − selected), plus Search. With the built-in words this keeps **2 rows** at 331–386pt widths: iPhone SE to Pro Max, at 14 padding and 44 tall.

**What remains**: no fixed count can guarantee the rows once the user's own words are long.
- Computed: with the five longest built-in words (Blackcurrant, White peach, Grapefruit, Black tea, Jasmine) the set takes **3 rows**.
- The only guarantee is to measure and show "as many as fit in 2 rows". That needs layout measurement and is not built.

**Status**: recorded, not solved now.

---

## 16. Records filter: no "filter on" look (added 2026-10-09)

**Parts affected**: 2a's filter icon button, the 2b filter sheet.

**Gap**: no mock shows the button while a filter is applied. 2a shows "All", with the button tinted brown; that tint is removed as stating nothing (drift D-24).

**Direction, not built**:
- A filter that is applied is a state in force now, so by §1 Colour roles it is **blue**.
- Whether a count goes with it (e.g. how many filters) is undecided.

**Status**: recorded, not designed or built. **Dropped until a real filter exists (Design Round 10, 16, 2026-10-21)**: V1 has no filter (2b is sort and group only), 2b shows its current choice when opened, and 2a's group headings show the grouping. It is drawn when a real filter comes.

---

## 17. "Finish bag" has no confirmation and no immediate undo (added 2026-10-09)

**Parts affected**: 3d's "Finish bag".

**What the mocks have**: finishing moves the bag to "Finished bags" (3f), which keeps its cups and notes. 3f offers **"Reopen bag"**, so the action can be reversed from the archive.

**What they do not have**: no confirmation before finishing, and no undo right after it (toast or similar). A slip has to be found and reversed in 3f. Reopening may also need a free slot (5 at most).

**Status**: recorded, not designed. The button itself becomes secondary (drift D-25).

**Settled 2026-10-09 (item 18)**: 3f's "Reopen bag" is the recovery; no confirmation or immediate undo is added.

**2026-10-14**: 3f wasn't built, so Finish had neither. 3f (minimal) is now in V1 ahead of 3g, restoring the settled recovery; Finish stays unconfirmed (design-missing.md 27–31).

**At this stage (2026-10-12)**: 3f is not built, so **a finished bag cannot be reopened**. Accepted for own use: a slip costs one of five slots; the cups and notes stay. Return here with 3f.

---

## 18. Destructive actions: confirmation and undo (added 2026-10-09)

**Rule (§1)**: destructive actions get no look of their own. They are protected by confirmation or undo, not colour.

| action | where | confirm? | undo / recovery? | what is lost |
|---|---|---|---|---|
| Discard | 6d footer, beside "Unsaved changes" | none drawn | none | unsaved profile edits |
| Remove photo | 6d, 3e, 3g | none drawn | effectively until Save (6d has Discard; 3e / 3g have only Back, and leaving with unsaved changes is undesigned) | the photo |
| Remove from my gear | 3b sheet, 3e | none drawn | none | the gear item. Its cups keep it, as the copy promises ("Your 2 logged cups keep this grinder"): cups store the grinder as text |
| Finish bag | 3d | none drawn | **yes: 3f "Reopen bag"** (may need a free slot) | nothing; see item 17 |
| Delete this bag | 3g | none drawn | none | **undefined for cups**, see below |

**Delete this bag: what happens to its cups** — ~~not settled; do not build it until it is~~. **Resolved for the data by the copy decision below (built)**; only the confirmation and its copy remain (design-missing.md 36, 2026-10-14). The analysis that led there:
- 3g says only "Not finish — erases it". There is no note like 3e's "Your 2 logged cups keep this grinder."
- The data model links a cup to its bag (`cups.bean_id → beans`, `ON DELETE SET NULL`).
  - So deleting a bag keeps the cups but **strips their bean**: name, roaster, origin and process.
  - Those are Try Next and Taste DNA inputs.
  - Gear differs: a cup stores the grinder as text, so removing gear loses nothing from cups.
- To decide:
  - whether delete keeps the cups' bean (keep a snapshot, or forbid delete while cups exist and point to Finish);
  - and the note 3g shows to say so.
- In a local-first app the records are the only asset, so this needs the same explicitness as 3e.

**Decided 2026-10-09: cups copy their bag's details when they are logged** (a planned data-model change).
- `bean_id` stays a reference, but display and Taste DNA read the cup's own copies. So deleting a bag no longer strips its cups.
- **Build order: the copy (a migration) lands before the delete feature.** Delete is not built on the reference model.

**3g needs a delete note like 3e's.** The wording is decided later with the other copy; **the note must cover all four points** (approved 2026-10-09):
1. the cups logged from this bag stay (with their count, as 3e does);
2. they keep the coffee's details: name, roaster, origin, process, roast level;
3. only the bag goes: off My beans (its slot is freed), with its photo, dates and size;
4. unlike Finish, it does not go to Finished bags and cannot be reopened. If the bag is simply used up, Finish is the right action.

**The five, once cups copy their details** (proposal, 2026-10-09):

| action | what is lost | needs |
|---|---|---|
| Discard (6d) | the unsaved edits only | **nothing**: it is the explicit answer to "Unsaved changes" |
| Remove photo (6d 3e 3g) | the photo, once saved | **nothing at removal**: it is staged until Save; covered by item 20 (leaving unsaved) |
| Remove from my gear (3e) | the gear item: settings note, photo, default flag; its slot is freed. Cups keep the grinder (text) | **confirm**: no archive or reopen exists for gear, and the settings note is the user's own writing |
| Finish bag (3d) | nothing; the bag moves to 3f | **nothing**: 3f's "Reopen bag" is the way back (item 17) |
| Delete this bag (3g) | the bag record: photo, dates, size, freshness. Cups and their copied details stay | **confirm**: irreversible, and easily confused with Finish |

- **Form of a confirmation: a bottom sheet** (`components.md` #25). The design has no dialog anywhere.
  - Anatomy as 3b's former action sheet: the item at the top (thumbnail, name, meta); then the consequence in plain words; then the destructive action as a row; then a 52 Cancel.
  - Only 2b's options sheet is drawn now, so this is a new use of the sheet, not a new component.
- **Approved 2026-10-09**: confirmation for **Remove from my gear** and **Delete this bag** only, as a bottom sheet built like 3b's former action sheet.
- **Status**: decided; nothing built. Item 17 is settled by the Finish row.

---

## 19. 36pt buttons fall short of the 44pt tap target (added 2026-10-09)

**Parts affected**: the 36-tall compact button. 3e and 3g photo "Replace" / "Remove photo" (1.5 frame, 11px caps); 7a "Mark all read" (1.5 `border.muted`, no fill).

**Gap**: 36 < 44 (`size.tapTarget`). Two ways:
- keep the drawn 36 and pad the touch area with `hitSlop` (4 above and below);
- or draw them at 44.

The photo pair sits beside a 76 thumbnail, so 44 would still fit its height.

**Status**: recorded, not decided. The button itself is a Button variant (`components.md` #3), not built.

---

## 20. Leaving a form with unsaved changes (added 2026-10-09)

**Parts affected**: every edit form. 3e (Edit gear), 3g (Edit bag), 6d (Edit profile).

**Gap**: only 6d draws a pattern: a footer with "Unsaved changes" and "Discard", Save in the header. 3e / 3g have Back and a footer "Save changes", and nothing says what Back does with unsaved edits: discard silently, ask, or keep a draft. Remove photo (item 18) depends on it, since a removal is only staged until Save.

**Status**: **decided (Design Round 4, 2026-10-13), built in 11a.** Back and the left-edge swipe both lead to a bottom sheet (the 11b shape): "Discard your changes?" / "Your edits to this cup won't be saved. The cup stays as it was." / primary "Keep editing", text action "Discard changes". With no changes, leave silently. The same applies to 3e / 3g / 6d.

**5a too (added 2026-10-11)**: with no drafts in V1, closing the Record sheet drops everything entered, including after 5d has said a rating is missing. Whether closing should warn is the same question. Recorded only; not built now.

---

## 21. Taste DNA is recomputed, so its history can move (added 2026-10-10) — CLOSED 2026-10-11

**Closed by decision**: the profile is computed on read, but 5c's change and 8f's shifts are **stored at save time** and never recomputed (`taste-dna.md`).

**What**: Taste DNA and its shifts are not stored; they are computed from cups as of a date (not stored). That is right for a local-first record. But anything that changes the inputs or the arithmetic changes past results too:
- 5c's "this cup pushed you brighter", 2c's "This cup pushed you brighter", 8f's "Last shift", "shifted 4 days ago".

The user sees the past rewritten.

**Triggers**:
- **"Read my words"** (8g) toggled. Out of V1: the setting screen is not in V1, so it cannot be toggled yet.
- **Editing a cup**: in the design. 2c has an edit button (pencil); its destination is not drawn. Changing a past cup's rating or axes moves every later shift.
- **Deleting a cup**: **not in the design.** No screen offers it (2c: back, edit, share only), so not in V1.
- A change to the arithmetic in a later release.

**Status**: recorded, not solved. When cup editing is built, decide whether past shifts may move or are kept as they were shown.

---

## 22. A first-setup choice that cannot be changed in V1 (added 2026-10-10)

**What**: 8n's "How do you take your coffee?" (Black / With milk / Depends on the day) is stored in V1 and read on every cup: it orders the tasting-note suggestions. **V1 has no settings screen**, so once chosen it cannot be changed. "Skip all" leaves it unset.

**Contrast**: 8c's "I mostly drink out" is read once (the first cup's default) and stops mattering after; it needs no editing.

**Status**: recorded, not solved. Options when the settings screen comes (V1.5): an entry for it there; or, before that, a way back into first setup.

---

## 23. Placeholder text has no colour token (added 2026-10-10) — RESOLVED 2026-10-12

**Resolved**: `color.text.placeholder` (#9B8F87) for every placeholder, decided on device. Entered text stays `text.primary`. The weight (16 / 700) is still `gaps.md` 26.

**Found by**: 8o's optional fields use `#A39389` (drift D-38), which is not in the palette.

**What the other inputs use**:

| screen | placeholder | colour |
|---|---|---|
| 2a | "Search my cups" | `#5C5049` (`text.secondary`) |
| 3a | "Search brewers" | `#5C5049` |
| 3c | "Type or pick a roaster" | `#5C5049` |
| 5b | My words ("Cooled down it turned into iced tea…") | `text.muted` (`text.note`'s colour) |
| 8o | "Optional", "Optional — for freshness" | **`#A39389`** (no token) |

- The majority is `text.secondary` (3 of 4 plain fields). 8o's lighter grey stands alone.
- Also seen: 8j's typed message text is `#3C332E`, not a token either.

**Needs deciding**: one placeholder colour, as part of the text input's empty state (`components.md` #23, "placeholder / empty" undesigned).

**Also undefined: the colour of entered text** (added 2026-10-10).
- 8j's typed message uses `#3C332E`, not a token.
- 8o's entered bean name ("Colombia Huila") uses `text.primary` (#273D22), and so does the app's 5b My words for now (stage 1). So `text.primary` already has two uses; 8j is the odd one.
- To be decided together with D-38.

---

## 24. Gear cap: 8 or 3 (added 2026-10-10; facts only, not decided)

- **8, a total across categories**:
  - 3a "3 / 8 Selected" over its Brewer / Grinder / Kettle / Scale tabs, with "5 slots left";
  - 3b "3 / 8 In my kit", listing a brewer, a grinder and a kettle;
  - 4a "Manage my gear 3 / 8".
- **3**:
  - 8c "This becomes your gear shelf — up to three", "2 of 3 picked". Its picks span categories (a dripper and a grinder), so it is not a per-category cap.
  - 6a "My gear 2 of 3": the whole shelf row, not per category.
- **No per-category cap appears anywhere.** So the 3 and the 8 are two totals, not a total and a per-category limit.
  - 8c's 3 could be a smaller cap for first setup only.
  - 6a's "of 3" then contradicts 3a / 3b / 4a.
- **Bags**: 5 open, everywhere: 3c, 3d, 4b, 6a "4 of 5", and 8j's "my five open bags". The mocks give no reason for 5 or for 8. Bags are consumables with a finish / archive cycle; gear is inventory.

---

## 25. Gear added from the generic list has generic names (added 2026-10-10) — RESOLVED 2026-10-22 by 3e

**What**: 3a (minimal) adds gear from 8c's generic list, so 5a's Method reads e.g. "Pour-over dripper · Hand grinder", not a model ("Hario V60 02 · Comandante C40"). Accepted for stage 2.

**Way out**: none yet. 3e (Edit gear), where a name could be changed, is **not built**. Models arrive with the full 3a or 3e.

**RESOLVED 2026-10-22**: 3e (minimal) renames gear, and the cups logged with it take the new name. Gear added from 3a still starts generic until renamed.

---

## 26. An empty field cannot be told from a filled one (added 2026-10-10; return at the final polish)

**What**: form fields set every value in `title` (16 / 700), because the idle 16 / 500 has no text style (drift D-44), and a field's placeholder takes the value's style. So "Optional" at 16 / 700 in `text.secondary` looks nearly like an entered value in ink.

**Why it matters**: it is functional, not cosmetic. **The user cannot see whether a field is filled.**

**Status**: deferred by decision (2026-10-10), to be settled at the final polish: a 16 / 500 style, or another placeholder treatment. **Must be returned to.**

---

## 27. Flavour words grow without limit, with no way to prune (added 2026-10-10)

**What**: Search's "Add \"xxx\"" adds a new flavour word without limit. 8h (rename / merge / clean up) is not in V1. So the user has no way to reduce the words that pile up; in half a year, words used once crowd the candidates.

**Now**: no limit (decided). Ordering by use count is expected to sink rarely used words (report 2026-10-10).

**Status**: recorded. 8h, or a limit, later.

---

## 28. Only one bag can be held for now (added 2026-10-10) — RESOLVED 2026-10-11 by the picker

**Resolved**: 5a's Bag and Method rows now open the picker (open bags; brewers and grinders), each with "Add a bag" / "Add gear" at the end. A second bag, a grinder after a dripper, and a non-default brewer for one cup all work. Still open below: the stat counts and the empty-shelf intro line.

**What**: 3c (minimal) is reachable only while no bag is open (T-4). With one bag, 5a pre-fills it and its row (a picker) does nothing yet, so a second bag cannot be added. **In practice a user holds one bag until stage 3's picker (or 3d) lands.**

**Status**: resolved by stage 3's selection panel.

**The same for gear (3a minimal, 2026-10-10)**: 5a's "Add gear" shows only while Method is empty (no default brewer and no default grinder). Pick only a dripper, and a grinder can no longer be added from the Record flow. Same fix: stage 3's gear picker (or 3b).

**5a's intro line is untrue on an empty shelf (found in the end-to-end run, 2026-10-11)**: a new user sees "Marked fields are required — all of them start pre-filled." while Bag and Method read "Add a bag" / "Add gear". The line needs an empty-shelf form (copy for Design; not invented here).

**Limit counts that are always accent (2026-10-10)**: §1 says the count turns accent at the limit ("8 / 8 Selected"). 3a's and 3c's counts are the header stat, which is accent at every value, so reaching the limit changes nothing there; only the "0 slots left" / "No slots free" line says so. 5b's flavour count ("5 of 5") does turn accent.

---

## 29. §1's "count turns accent at the limit" does nothing on 3a and 3c (added 2026-10-10; decide at the final polish)

**What**: 3a's "N / 8 Selected" and 3c's "N / 5 Bags open" are the header stat, which is `color.text.accent` at every value. Reaching the limit changes nothing, so §1 Selection limit's "the count explains it" does not work on these two screens. Only the line under the button ("0 slots left", "No slots free…") says so.

**To decide at the final polish**: change the rule, or give these two counts another resting colour.

---

## 30. 5d cannot keep its promise without drafts (added 2026-10-11)

**What**: 5d says "Nothing is lost — this cup is held as a draft until you finish." and offers "Keep as draft". V1 has no drafts, so V1's 5d is weaker than the mock: **close the sheet without a rating, and what was entered is gone.**

**In V1**: no "Keep as draft"; the reminder's second line promises no draft (copy from Design, with the conditions in `design-brief-next.md`). Closing without saving: `gaps.md` 20.

**When drafts arrive (V1.5)**: put 5d back to its own words and add "Keep as draft". `cups.rating` was made nullable for this.

**Save failure, from Design's report (2026-10-11)**: two points the copy cannot settle without drafts:
- can a failed save be retried any number of times? (Today: yes, "Try again" retries each time; iOS's Cancel ends it.)
- what happens when the sheet is closed after a failure? The input is lost — no drafts.

---

## 31. My words do not shape Taste DNA in V1 (added 2026-10-11)

**What**: only the ten bundled flavour words have a word → axis entry. My words (free text) and words users add are not matched in V1: matching free text needs normalising, synonyms and negation ("not too bitter"). "Read my words" (8g) does not exist in V1, which is the same as it being off.

**Copy to adjust when 8g is built**: 8g's "Your words are matched, not read — 'juicy' maps to acidity and sweetness" and 7a's "Taste DNA now reads your notes" describe more than V1 does. Even 8g's example word, "juicy", is not a bundled word, so it has no entry.

---

## 32. 2c's share button is not shown (added 2026-10-11)

**What**: 2c's header has a share button (an arrow out of a tray), but no mock says what it shares: text, an image, a file. Not shown in V1 (decided 2026-10-11).

---

## 33. 2c's method line drops "22 clicks" and "My default brewer" (added 2026-10-11)

**What**: 2c's Method meta reads "My default brewer, 22 clicks". Neither is shown in V1:
- **"22 clicks"** is the grind setting (`cups.grind_setting`, V1.5): there is no input, so it is always empty. **Return here when V1.5 adds the grind input.**
- **"My default brewer"**: whether the brewer was the default *when the cup was logged* is not stored. Judging it by today's default would not be history.

---

## 34. A wrong rating, axis or flavour cannot be removed (added 2026-10-11)

**What**: rating, axes and flavours are not editable (they are Taste DNA's input; `taste-dna.md`), and there is no way to delete a cup in V1 or in the mocks. A mistake in them stays in Taste DNA for good (Reset is V1.5 and drops every cup before it, not one).

**Decided 2026-10-11: "Delete this cup" is in V1.** On the cup edit screen only (never from the list), confirmed in a bottom sheet (no dialogs in this design) whose words say what is lost — the cup and its axes, flavours and My words — and that it cannot be undone. The cup's `dna_change` goes with it; other cups' history is untouched. Safe for the arithmetic: the profile is computed on read.

---

## 35. 2c's 210pt photo area is not shown (added 2026-10-12)

**What**: the photo placeholder (Design 10a) is on every thumbnail, but **not** in 2c's photo area. A list thumbnail is small and keeps the row's shape; 2c's area is a quarter of the screen, and the same drawing on every cup would take the largest space while saying nothing.

**Return**: show it when the camera arrives.

---

## Step 4 device verification — RESOLVED (2026-10-04)

The base component library (Step 4) was checked in the web harness during the build. These items needed a real device and were confirmed on device by the author under Expo SDK 57.

| item | component | status |
|---|---|---|
| Selection haptic on star tap | `StarRating` | **Resolved** — fires on device |
| Hard shadow renders blur-0 with the token offset on native (OQ-6 decision) | `HardShadow` — Button primary, 5d error cards | **Resolved** |
| Single-edge dashed line renders on iOS | `DashedRule` — StarRating caption divider | **Resolved** |
| ja long strings hold at the `name` preset's 2 lines with a tail ellipsis | `Text` (item 1 above) | **Resolved** |

Still open, and outside Step 4: CJK weight and CJK chip metrics (`design-system.md` OQ-14, scheduled for the V1.1 i18n pass).
