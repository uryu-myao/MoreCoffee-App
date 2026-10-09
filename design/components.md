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

Pressed, focus, tap affordance, the selection limit and the disabled look of options are not listed per row: §1 Hard Rules decide them for every component (Pressed 2026-10-04 / -06; Focus, Tap affordance, Selection limit, Disabled options 2026-10-07). On iOS focus is delegated to the OS.

## Catalog

| # | component | screens / uses | status | variants | known states | undesigned states |
|---|---|---|---|---|---|---|
| 1 | Screen header (`ScreenFrame`) | 30 / 30 | component | standard · compact · eyebrow · stat · meta · footer | expanded, collapsed (2026-10-06) | — |
| 2 | Bottom bar (`FooterNav`) | 6 (1b 2a 4a 4b 6a 8d; 6a's three-way split counted once) | component | tab · add | active, inactive, pressed (scale), hidden | — |
| 3 | Button | 14 primary (1b 2b 3a 3c 3e 4a 4b 5a–5e 7b 8e) · 7 secondary (1b 3b 5a 5b 5c 5e) · ~13 text-only (2b 5d 6d 7b 8c 8e 8f 8h 8l) · 9 compact 36–48 (3c 3d 3e 6a 6d 7a 8f 8h 8j) · 8c Next (56, not full width) · 8d in-card CTA (borderless blue) | component: primary and secondary only | primary · secondary · **tertiary (text) not built** · **compact (40) / small (36) not built** · 44-tall inline (3c "Use", 3d "Edit / Finish bag") · shadowed 48 (8f) | default, pressed, disabled (decided, Button only) | **destructive** (3b / 3e "Remove from my gear", 8g "Reset my taste DNA" have no distinct look); disabled for text / compact; secondary height is 52 in the mocks, 56 in code (`gaps.md` 4) |
| 4 | IconButton | ~20 (back / close on 3a–3f 5a 5b 5d 5e 6d 7a 7b 8e–8j 8m) + 2a filter opener + 8e muted icon | component (default look) | default (2px ink, raised) · accent fill (2a) · muted 1.5 border (8e) | default, pressed | disabled; **what 2a's accent fill means** (filters applied?) |
| 5 | Single-select chip group (`SegmentedControl`) | 12 screens: 2a 2b 3a 3c 3e 3f 5a 5d 5e 6d 8j 8l | component for 5a / 5d / 5e only | padding 6/11 (2a) · 7/12 (3a) · 9/13–14 (2b 3c 3e 3f) · 9/11 (8l) · 11/15 (5a) · 2px-border 11/13 (6d 8j) | selected (ink), unselected; tap affordance (§1); disabled (§1 Disabled options) | — |
| 6 | Flavour chip, multi-select | 5b (6) | inline | selected · unselected · Search opener (`border.addSlot`) | selected, unselected; at the limit, disabled (§1) | — |
| 7 | Checkbox list, multi-select | 3a (5 rows, cap 8: "3 / 8 Selected · 5 slots left") · 8c (5 rows, cap 3: "2 of 3 picked") | not started | row + 24px checkbox; 8c tints the selected row `#FFF8F1` | selected, unselected, count; at the limit, disabled (§1) | — |
| 8 | Checkbox | 3a (5) · 8c (5); all 24 (`size.checkbox`) | not started | checked fill: **ink on 3a, action blue on 8c** (drift, `drift.md` D-19) | checked, unchecked; disabled (§1) | — |
| 9 | Toggle switch | 8 uses / 4 screens: 3e (1, 62×34, on = ink) · 8i (4) 8j (2) 8m (1), all 52×30, on = action blue | not started | one; 3e is drift in size and on-colour (`drift.md` D-20) | on, off; role switch (§1 Tap affordance) | disabled |
| 10 | Weekday selector | 8i (7) | not started | option form at 44 (§1; the mock is 39) | selected (ink), unselected; uncapped (no count); disabled (§1) | — |
| 11 | FieldRow | 5a 5d 5e (10 rows) | component | swatch · icon · plain · divided | default, pressed, error (5d) | disabled; **empty value** (no default to pre-fill); loading (MapKit lookup) |
| 12 | Star rating (`StarRating`) | 5a 5d 5e | component | — | unrated, rated, pressed (disc), error (5d), caption | disabled / read-only |
| 13 | List row (`RecordRow`) | 1b 2a 4a 4b (+ 2b skeleton backdrop) | component | with / without note | default | **loading / skeleton** (2b's is a dimmed backdrop, not a designed state) |
| 14 | Cup summary row | 5b (1) | inline | — | default | — |
| 15 | Badge | inline 30 / standalone 18 | component | tones neutral · accent · success · info · selected; sticker rotation (E-4) | static | — (not pressable) |
| 16 | Section heading (`SectionLabel`) | ~25 screens | component | marked · plain | set, pre-filled, required, missing, optional, count | — |
| 17 | Empty slot (`EmptySlot`) | 3a 3b 3d 5a 5d 5e | component | — | default, pressed, inert (5d) | — |
| 18 | Taste axis slider | 5b (3 entered, 1 empty) · 1b 4a 4b (derived) · 5c (derived + ghost + delta) | **component** (`AxisSlider`, 2026-10-07; 5b uses it) | 5 steps; needle empty · lit · entered on one rail; the display axis is AxisReadout (specced, to build) | empty, lit, entered, dragging, clearing | disabled |
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
| 38 | Word tag (pressable) | 8f (4, word + count → 8l search) · 8h (11, tap to rename / merge) | not started | with count · without | default (8f's top word drawn 2px ink) | — (built at 44, §1 Tap affordance) |
| 39 | Attribute tag (display) | 6a (3, inside the pressable Taste DNA card) · 8d (2) | not started | — | static | — (never pressable on its own, §1 Tap affordance) |

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

**Flavours and words are two kinds of data (corrected 2026-10-08)**. The earlier note here said 5b's flavour chips, 8h's word tags and 8f's word tags show the same data. They do not:
- **Flavours** (5b's chips): what the cup tasted of. Nouns, capitalised in the data (Jasmine, White peach, Black tea, Cocoa, Citrus). Also shown on 2a's record rows ("Floral, peach", "Cocoa, walnut").
- **Words** (8h, 8f, 8l): how the user described it. Free text, lowercase as typed (juicy, tea-like, too roasty, syrupy, papery).
- The two lists share only "cocoa" (and "peach" against 5b's "White peach").
- **Where words come from, read from the mocks**: 5b's **My words** field (the italic note), not the chips.
  - The field and 8h's screen share the name "My words".
  - 7a: "Taste DNA now reads your notes. Your own words feed the profile, not just the sliders."
  - 7b: "the words you write on a cup — juicy, too roasty, syrupy — count too".
  - 8g: "Your words are matched, not read" and "Read my words: Let notes shape the profile".
  - 8l's Words search lists cups by a word in their note ("9 cups say "juicy"").
- One sentence does not fit: 8h's "Words appear as chips when you log a cup". No logging screen shows words as chips; read here as "the words you write appear here as chips".
- So the three looks are not one component: the flavour chip is an input (§1 Colour roles: brown, entered); the word tag (#38) belongs to words. Flavours: capitalised in the data, uppercased on screen by `label.caps`. Words: stored and shown as typed.

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

## Axis slider — facts from the mocks (stage 1, confirmed 2026-10-07)

Every use, transcribed. The spec is not written yet; the behaviour the stills do not show is listed for decision first.

| screen | axes | rail | needle at | extras |
|---|---|---|---|---|
| 1b · 4a · 4b (Home, Taste DNA card, "Early signs", not pressable) | 4: Acid ↔ Bitter, Light body ↔ Full body, Light roast ↔ Dark roast, Low sweetness ↔ High sweetness | derived on all 4 | 58 · 66 · 72 · 47 (identical on all three screens) | — |
| 5b (Tasting note, the input) | the same 4 | entered ×3, **empty ×1** (drawn as derived in the mock; reclassified 2026-10-07) | 26 · 38 · 18 (set) · 50 (not noted) | "Not noted" under the unset axis |
| 5c (Saved, "What the cup changed") | 2 (Acid ↔ Bitter, Light roast ↔ Dark roast: only the axes that moved) | derived on both | 38 · 52 | ghost at the previous value (44 · 56; legend "Where it sat before"), delta bar between them, "Moved 6 points brighter" / "Moved 4 points lighter" |

- **Rail**: `axis.rail.derived` (1.5 dashed `#C8BCB4` on ground) and `axis.rail.entered` (2 solid ink on raised). **Entered appears only on 5b's set axes.** Every display axis is derived.
- **Reclassified on review (2026-10-07): 5b's unset axis is not derived; it is empty**: no value yet, one to be entered.
  - The mock draws it with the derived rail only because it did not tell the two apart.
  - They must differ: one look that is draggable on 5b and dead on 1b would read as broken on 1b.
  - Three rail states, so "dashed muted = cannot be operated" holds without context:
    - **derived**: computed or historical, not operable (1b 4a 4b 5c);
    - **empty**: not entered yet, operable (5b's unset axis);
    - **entered**: the user's own value, operable (5b's set axes).
  - The empty rail takes the add-slot form (`border.addSlot`, 2px dashed ink). Rendered beside entered: see the axis spec.
- **`texture.rule` sits on both rail kinds**, every use (25 / 50 / 75%).
- **Needle**:
  - not entered: `#DCD0C8` (folds to `surface.muted`) with a 1.5 `#B3A69E` border, 12 × 30;
  - entered: `#9E5202` with a 2 ink border, 12 × 32.
  - Both overhang the rail by about the same amount; the 2px taller entered needle matches its thicker rail border.
- **Ghost and delta: 5c only.** 5c is the one screen that shows a change: the profile just after a save, "This cup pushed you brighter and lighter". The ghost is the value before this cup and the delta the movement. No other screen compares two moments, so none needs them.
- **The value scale reads as 0–100 points** ("points" is the term, as in 5c's copy):
  - every value in the mocks is an integer per cent;
  - 5c's delta of 6% is "Moved 6 points", and 4% is "4 points";
  - direction words: toward Acid = "brighter", toward Light roast = "lighter".
- **Pole labels**: one form on every axis: "<low pole> ↔ <high pole>", both ends, `label.eyebrow` (11 / 700 / .1em folds in) `text.muted`, `gap.row` above the rail. The low pole is always on the left.
- **Axis count**: 4 on 1b / 4a / 4b / 5b; 2 on 5c (moved axes only).
- **Set needle as a token, for the decision**:
  - It is used on one screen (5b, 3 uses), below the rule of two.
  - But it is one of the axis component's two states, the same mechanism-bound case as `state.pressed`, which was promoted on that ground.
  - If promoted, the naming rule says the existing `component.axis.needle` (the not-entered needle) is misnamed too. The pair would read `needle.derived` / `needle.entered`, matching the rail.

## Switch and the axis handle share one geometry (recorded 2026-10-08)

The Switch is not built yet. The taste-axis handle is now derived from it, so this relation is also **the premise for building the Switch**.

**The Switch in the mocks** (8g, 8i ×3, 8j ×2, 8m; 3e's 62 × 34 ink switch is drift D-20):

| part | value |
|---|---|
| track | **52 × 30**, border **2** |
| padding (knob ↔ track) | **2** |
| knob | **22 × 22**, square, border **2** |
| off | track `border.muted` frame on `surface.sunken`; knob `surface.raised` with a `border.muted` frame |
| on | track `border.strong` frame on `action.bg` (blue); knob `surface.raised` with a `border.strong` frame |

**The relation**: knob = track height − 2 × border − 2 × padding (30 − 4 − 4 = 22). Border and padding are both 2. The knob is square.

**The axis handle** follows the same relation:
- border 2, inset 2, a square handle;
- handle = track height − 8;
- 260 wide, so a step is (252 − handle) / 4.

**Chosen: B**, 34 / 26, read off Uryu's screenshot (built 2026-10-08). A, 30 / 22 and identical to the Switch, was compared and not taken.

**Why**: a square handle belongs to the same family as the switch knob, so the app's shape vocabulary lines up (`design-system.md` §9 Taste axis slider).

## Row menus: gear and words are built differently (recorded 2026-10-09)

- **Gear (3b)**: each item has a full page, 3e (Edit gear). The ⋮ sheet only repeated 3e's contents (default, edit, remove), so the ⋮ goes. The row opens 3e directly, with a chevron (drift D-26).
- **Words (8h)**: the ⋮ stays as drawn.
  - The menu's contents are not in the mocks.
  - There is no page behind a word: rename and merge happen in place ("Tap a word to rename it everywhere, or merge it into another").
  - So 8h cannot follow 3b. Its ⋮ is specced when 8h is built.
- **Beans (3d)**: no ⋮. "Edit" and "Finish bag" sit on each card. Whether bean cards should follow gear (card tap → 3g) is open (report 2026-10-09).

## Estimate

| scope | items |
|---|---|
| missing states, by component (the table above) | **40** across 24 components → **32** across 19 after the 2026-10-07 rules (see `gaps.md`) |
| focus treatment: one rule, then applied to every pressable | 1 rule (+ 25 applications) |
| error flows (save failure, offline), reusing the 5d vocabulary | 2 |
| first-run empty states (My gear, My beans, Notifications, Try next, My words, Finished bags; Records has a minimal one) | 6 |
| **total** | **≈ 49 states** |

Drawn as one board per component plus three global boards (focus, errors, empties), that is **about 27 boards**. Not counted: unbuilt variants (Button tertiary / compact / small, the chip paddings), which are spec work rather than missing states.
