# MoreCoffee — Component catalog (Step 4)

Inventory only: what exists, where, how far it is built, and which states are known or missing. **No specs here.** Specs are written component by component, in the order chosen on review.

Source: `MoreCoffee design.dc.html`, the 30 in-scope screens. Compiled 2026-10-07.

**How it was gathered**
- Every `cursor:pointer` element: **150 in the 30 screens** (the figure used from here on). 191 file-wide; the other 41 sit on out-of-scope screens such as 9a / 9b / 8a / 8b / 8k / 6b / 6c / 2c / 1a.
- Chip-, toggle- and box-shaped elements **without** a cursor.
- Every `2px solid #273D22` raised container.
- **The cursor is not used to decide what is pressable.** Anything that should be pressable but is a bare `<span>` with no cursor is listed as pressable and flagged "tap affordance missing": 2a / 2b / 3a / 3c / 3e / 3f / 6d / 8j / 8l chips, 5b flavour chips, 8i weekday toggles, and the 8i / 8j / 8m switches.

**Status values**
- **component**: a base component in `src/components/base` (or the shell).
- **inline**: drawn directly in a screen, not yet a component.
- **not started**: in the mocks, not built.

Pressed, focus, tap affordance and the selection limit are not listed per row: §1 Hard Rules decide them for every component (Pressed 2026-10-04 / -06; Focus, Tap affordance and Selection limit 2026-10-07).

## Catalog

| # | component | screens / uses | status | variants | known states | undesigned states |
|---|---|---|---|---|---|---|
| 1 | Screen header (`ScreenFrame`) | 30 / 30 | component | standard · compact · eyebrow · stat · meta · footer | expanded, collapsed (2026-10-06) | — |
| 2 | Bottom bar (`FooterNav`) | 6 (1b 2a 4a 4b 6a 8d; 6a's three-way split counted once) | component | tab · add | active, inactive, pressed (scale), hidden | — |
| 3 | Button | 14 primary (1b 2b 3a 3c 3e 4a 4b 5a–5e 7b 8e) · 7 secondary (1b 3b 5a 5b 5c 5e) · ~13 text-only (2b 5d 6d 7b 8c 8e 8f 8h 8l) · 9 compact 36–48 (3c 3d 3e 6a 6d 7a 8f 8h 8j) · 8c Next (56, not full width) · 8d in-card CTA (borderless blue) | component: primary and secondary only | primary · secondary · **tertiary (text) not built** · **compact (40) / small (36) not built** · 44-tall inline (3c "Use", 3d "Edit / Finish bag") · shadowed 48 (8f) | default, pressed, disabled (decided, Button only) | **destructive** (3b / 3e "Remove from my gear", 8g "Reset my taste DNA" have no distinct look); disabled for text / compact; secondary height is 52 in the mocks, 56 in code (`gaps.md` 4) |
| 4 | IconButton | ~20 (back / close on 3a–3f 5a 5b 5d 5e 6d 7a 7b 8e–8j 8m) + 2a filter opener + 8e muted icon | component (default look) | default (2px ink, raised) · accent fill (2a) · muted 1.5 border (8e) | default, pressed | disabled; **what 2a's accent fill means** (filters applied?) |
| 5 | Single-select chip group (`SegmentedControl`) | 12 screens: 2a 2b 3a 3c 3e 3f 5a 5d 5e 6d 8j 8l | component for 5a / 5d / 5e only | padding 6/11 (2a) · 7/12 (3a) · 9/13–14 (2b 3c 3e 3f) · 9/11 (8l) · 11/15 (5a) · 2px-border 11/13 (6d 8j) | selected (ink), unselected; tap affordance by §1 (option form, 44, role radio) | disabled |
| 6 | Flavour chip, multi-select | 5b (6) | inline | selected · unselected · Search opener (`border.addSlot`) | selected, unselected; at the limit (§1 Selection limit) | disabled outside the limit |
| 7 | Checkbox list, multi-select | 3a (5 rows, cap 8: "3 / 8 Selected · 5 slots left") · 8c (5 rows, cap 3: "2 of 3 picked") | not started | row + 24px checkbox; 8c tints the selected row `#FFF8F1` | selected, unselected, count; at the limit (§1 Selection limit) | disabled outside the limit |
| 8 | Checkbox | 3a (5) · 8c (5); all 24 (`size.checkbox`) | not started | checked fill: **ink on 3a, action blue on 8c** (drift, `drift.md` D-19) | checked, unchecked | disabled |
| 9 | Toggle switch | 8 uses / 4 screens: 3e (1, 62×34, on = ink) · 8i (4) 8j (2) 8m (1), all 52×30, on = action blue | not started | one; 3e is drift in size and on-colour (`drift.md` D-20) | on, off; role switch (§1 Tap affordance) | disabled |
| 10 | Weekday selector | 8i (7) | not started | option form at 44 (§1; the mock is 39) | selected (ink), unselected; uncapped (no count) | disabled (when its reminder is off) |
| 11 | FieldRow | 5a 5d 5e (10 rows) | component | swatch · icon · plain · divided | default, pressed, error (5d) | disabled; **empty value** (no default to pre-fill); loading (MapKit lookup) |
| 12 | Star rating (`StarRating`) | 5a 5d 5e | component | — | unrated, rated, pressed (disc), error (5d), caption | disabled / read-only |
| 13 | List row (`RecordRow`) | 1b 2a 4a 4b (+ 2b skeleton backdrop) | component | with / without note | default | **loading / skeleton** (2b's is a dimmed backdrop, not a designed state) |
| 14 | Cup summary row | 5b (1) | inline | — | default | — |
| 15 | Badge | inline 30 / standalone 18 | component | tones neutral · accent · success · info · selected; sticker rotation (E-4) | static | — (not pressable) |
| 16 | Section heading (`SectionLabel`) | ~25 screens | component | marked · plain | set, pre-filled, required, missing, optional, count | — |
| 17 | Empty slot (`EmptySlot`) | 3a 3b 3d 5a 5d 5e | component | — | default, pressed, inert (5d) | — |
| 18 | Taste axis slider | 5b (4, entered) · 1b 4a 4b (derived) · 5c (derived + ghost + delta) | inline (5b) | rail entered / derived; needle set / not noted; ghost; delta | set, not noted, derived display, movement (5c) | **dragging**, **clearing a set axis** back to not noted, disabled |
| 19 | Card (padded container) | 13: 1b ×2 3c 3e 4a 4b 5b 5c 7b 8e 8f 8j 8m | pattern only (no component) | padding 20/18 ×8 · 16 ×4 · 18/16 ×1 | static | — |
| 20 | Grouped list (rows in one 2px frame, hairline-divided) | 13 screens: 5a 5d 5e 6a 7a 8c 8d 8g 8h 8i 8j 8l 8m | inline (5a's FieldRow groups) | — | static | **empty group** |
| 21 | Navigation / settings row | 6a (3) 8d (3) 8g 8i 8j 8m (3) 3b (3, in a sheet) | not started | plain · with value ("2 of 3") · selected ("In use", 8m) · destructive (3b, 8g) | default, selected | disabled; a destructive look that is distinct |
| 22 | Notification row | 7a (5) | not started | unread (tinted `#FFF8F1`) · read; type badge | unread, read | **empty list** |
| 23 | Text input | 3c 3e 5b 6d 8j | inline (5b frame only) | single line · multi-line (8j, 5b `text.note`) · with counter (6d) | filled, focused (caret: 3e 6d 8j 8l) | **placeholder / empty** (only 5b has one); **inline error**; disabled; **at the length limit** (6d 7 / 24) |
| 24 | Search field | 2a 3a (placeholder) · 8l (typed, caret) | not started | idle · active | placeholder, typed | **no results**, loading, clear |
| 25 | Bottom sheet | 2b (sort / group), 3b (gear actions) | not started | options sheet · action sheet | open (page dimmed 0.45 + scrim) | drag / dismiss motion |
| 26 | Radio option row | 2b (4) | not started | — | selected (check), unselected | — |
| 27 | Bag card | 3d (2) · 3f (archived) | not started | with actions (Edit / Finish bag) · archived (`state.archived`) | active, archived | — (see 28) |
| 28 | Bean freshness meter | 3d 4b | not started | — | drink now, past peak | **resting / too fresh** (`gaps.md` 8) |
| 29 | Shelf preview list (in a card) | 4a (gear) 4b (beans) | not started | gear · beans | default (with "Default" badge) | **empty** (1b's `{{ emptyCopy }}` card may be it; unconfirmed) |
| 30 | Weekday strip "This week" | 1b 4a 4b | not started | — | today by ink only | **today's underline** (`gaps.md` 9) |
| 31 | Try next teaser (dashed card) | 1b 4a 4b | not started | — | locked ("Opens at 5 cups") | progress toward the threshold (unconfirmed need) |
| 32 | Featured plan card (shadowed) | 8d (1) | not started | — | static + in-card CTA | — |
| 33 | Gear row icon tile | 3b (3) | not started | selected (accent fill) · unselected (muted border) | selected, unselected | — |
| 34 | Photo slot | 3c (76 empty) · 3e (filled + Replace / Remove) | not started | empty · filled | empty, filled | **uploading**, **failed** |
| 35 | Suggested value row ("Use") | 3c (2) | not started | — | offered | **applied** |
| 36 | Stat tiles / profile header | 6a 8e | not started | — | static | — |
| 37 | Avatar edit button | 6d (1, 34×34 at the avatar's corner) | not started | — | default | — (read as a checkbox in the first pass; it is a small icon button) |

Primitives, not counted: `Text`, `Glyph`, `HardShadow`, `DashedRule`, `DotTexture`.

## Notes for the consolidation calls

**Cup summary row (5b) vs `RecordRow` (2a)**

| | cup summary row (5b) | `RecordRow` (2a) |
|---|---|---|
| thumbnail | 40 (`size.thumbnail.summary`) | 66 (`size.thumbnail.list`) |
| title | bean name (`label` 15) | bean name (`title` 16) |
| second line | mode · brew method · **time** ("I made it · V60 · 08:20") | roaster · process ("Blue Bottle · Washed") |
| badges | none: the mode is plain text | category + mode badges |
| rating | star + numeral, right, centred | star + numeral **over the date**, right |
| date | none (a time instead) | yes |

- The mocks do not state why the same cup is shown two ways.
- What the screens imply:
  - 5b's row is a **context header** for the cup just logged ("this is the cup you are describing"). Today is implied, so a time replaces the date, and how it was made is the useful line.
  - 2a's row is a **list entry**: provenance and date matter when scanning many cups.
- Read: two components that share parts (thumbnail frame, the rating block), not one with a flag. To be confirmed when either is specced.

**Multi-select elsewhere?** Yes, on three more screens:
- 3a is a checkbox list against a live cap ("3 / 8 Selected · 5 slots left"). Corrected 2026-10-07; the first pass missed it.
- 8c is a checkbox list with a cap ("2 of 3 picked").
- 8i is the weekday selector: ink fill when selected, like the single-select chips.
- With 5b's flavour chips (cap 5) that makes four multi-selects, in three looks. Three of them have caps (3a 8, 5b 5, 8c 3) and none designs the at-cap state. The selection logic can be shared; the visuals are three different components (checkbox list on 3a / 8c, flavour chips, weekday selector).

**5b's dashed "Search" vs `axis.rail.derived`** — *resolved 2026-10-07: Search moves to `border.addSlot`, `border.track` is rails only (drift D-21)*
- They do **not** share a meaning. "Search" opens a way to add more, an action on something not there yet. That is the "nothing in it yet" use of dashed (§8), alongside the empty slot, not the "not a value the user entered" use.
- It does share a **token** with the derived rail: `border.track` (1.5px dashed `border.muted`) is documented as "a measuring rail or placeholder frame". By the 2026-10-06 naming rule, one token currently carries both dashed meanings.
- Flagged, not changed.

**Are the 13 framed cards one component?**
- The **container** is one: 2px ink on raised, square, no shadow.
- The **contents** are five kinds:
  - Taste DNA (1b 4a 4b 5c: title + badge + axes);
  - form (3c 3e);
  - message / explanation (7b 8e 8f 8j 8m);
  - empty state (1b);
  - the axis input (5b).
- The three paddings (20/18, 16, 18/16) do not follow the content kind cleanly, so they look like drift rather than variants. To check when the Card is specced.
- The shadowed 8d plan card and the grouped list (#20) are different containers, not Card variants.

## Estimate

| scope | items |
|---|---|
| missing states, by component (the table above) | **40** across 24 components → **37** after the 2026-10-07 rules (see `gaps.md`) |
| focus treatment: one rule, then applied to every pressable | 1 rule (+ 25 applications) |
| error flows (save failure, offline), reusing the 5d vocabulary | 2 |
| first-run empty states (My gear, My beans, Notifications, Try next, My words, Finished bags; Records has a minimal one) | 6 |
| **total** | **≈ 49 states** |

Drawn as one board per component plus three global boards (focus, errors, empties), that is **about 27 boards**. Not counted: unbuilt variants (Button tertiary / compact / small, the chip paddings), which are spec work rather than missing states.
