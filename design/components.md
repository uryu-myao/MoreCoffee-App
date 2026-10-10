# MoreCoffee — Component catalog (Step 4)

Inventory only: what exists, where, how far it is built, and which states are known or missing. **No specs here.** Specs are written component by component, in the order chosen on review.

Source: `MoreCoffee design.dc.html`, the 30 in-scope screens. Compiled 2026-10-07.
**Screens added since** (read directly, 2026-10-09 / -10):
- **3g** Edit bag (see "3g Edit bag" below);
- **8n** First setup 1/3: a single choice with a sub-line per option ("Black · Acidity, origin" / "With milk · Body, sweetness" / "Depends on the day"), the radio-row form of #26;
- **8o** First setup 3/3: the first bag. Bean name (#23, single line), Roaster and Roasted on (optional); "Start logging" (primary); "I'll add beans later" (a text action).

8c / 8n / 8o share the setup chrome: "Setup · N of 3" + "Skip all", and a 52 × 56 back button beside a flex primary.

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
| 3 | Button | 14 primary (1b 2b 3a 3c 3e 4a 4b 5a–5e 7b 8e) · 7 secondary (1b 3b 5a 5b 5c 5e) · ~13 text-only (2b 5d 6d 7b 8c 8e 8f 8h 8l) · 9 compact 36–48 (3c 3d 3e 6a 6d 7a 8f 8h 8j) · 8c Next (56, not full width) · 8d in-card CTA (borderless blue) | component: primary and secondary only | primary · secondary · **tertiary (text) not built** · **compact (40) / small (36) not built** · 44-tall inline (3c "Use", 3d "Edit / Finish bag") · shadowed 48 (8f) | default, pressed, disabled (decided, Button only) | **destructive** (3b / 3e "Remove from my gear", 8g "Reset my taste DNA" have no distinct look); disabled for text / compact; secondary height is 52 in the mocks, 56 in code (`gaps.md` 4) **2026-10-09**: small (36) is used by 3e / 3g's photo pair *and* 7a's "Mark all read", so it is a Button variant rather than a photo-slot part (its 44pt touch area: `gaps.md` 19). Note the name clash: the text variant's `small` prop (taste axis Clear) is a different thing; rename one when the 36 is built. **Destructive: decided to have no look of its own for now** (ink like any action, §1); protection is confirm / undo (`gaps.md` 18); a warning colour, which the product has none of, is a separate, undecided call. |
| 4 | IconButton | ~20 (back / close on 3a–3f 5a 5b 5d 5e 6d 7a 7b 8e–8j 8m) + 2a filter opener + 8e muted icon | component (default look) | default (2px ink, raised) · accent fill (2a) · muted 1.5 border (8e) | default, pressed | disabled; **what 2a's accent fill means** (filters applied?) 2026-10-09: 2a's accent fill goes (drift D-24), so it is the default look. |
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
| 18 | Taste axis slider | 5b (3 entered, 1 empty). The display on 1b 4a 4b 5c 8f is AxisReadout (to build) | **component** (`AxisSlider`) | 5 steps; square handle on a solid track (spec: `design-system.md` §9, the one place) | **empty, entered** (two states; pressed = scale) | disabled |
| 19 | Card (padded container) | 13: 1b ×2 3c 3e 4a 4b 5b 5c 7b 8e 8f 8j 8m | pattern only (no component) | padding 20/18 ×8 · 16 ×4 · 18/16 ×1 | static | — |
| 20 | Grouped list (rows in one 2px frame, hairline-divided) | 13 screens: 5a 5d 5e 6a 7a 8c 8d 8g 8h 8i 8j 8l 8m | inline (5a's FieldRow groups) | — | static | **empty group** |
| 21 | Navigation / settings row | 6a (3) 8d (3) 8g 8i 8j 8m (3) 3b (3, in a sheet) | not started | plain · with value ("2 of 3") · selected ("In use", 8m) · destructive (3b, 8g) | default, selected | disabled; a destructive look that is distinct 2026-10-09: 3b's sheet goes (drift D-26); 3b's rows become rows that open 3e, with the chevron. |
| 22 | Notification row | 7a (5) | not started | unread (tinted `#FFF8F1`) · read; type badge | unread, read | **empty list** |
| 23 | Text input | 3c 3e 5b 6d 8j | inline (5b frame only) | single line · multi-line (8j, 5b `text.note`) · with counter (6d) | filled, focused (caret: 3e 6d 8j 8l) | **placeholder / empty** (only 5b has one); **inline error**; disabled; **at the length limit** (6d 7 / 24) 2026-10-09: 3g uses the single-line form too (Bean name, Roaster, Roasted on / Opened on / Size). |
| 24 | Search field | 2a 3a (placeholder) · 8l (typed, caret) | not started | idle · active | placeholder, typed | **no results**, loading, clear |
| 25 | Bottom sheet | 2b (sort / group), 3b (gear actions) | not started | options sheet · action sheet | open (page dimmed 0.45 + scrim) | drag / dismiss motion 2026-10-09: 3b's action sheet goes (drift D-26); 2b remains. |
| 26 | Radio option row | 2b (4) | not started | — | selected (check), unselected | — |
| 27 | Bag card | 3d (2) · 3f (archived) | not started | with actions (Edit / Finish bag) · archived (`state.archived`) | active, archived | — (see 28) 2026-10-09: the dashed rule splits the card: info area opens 3g (chevron), the strip holds "Finish bag" only, full width; "Edit" removed (drift D-29). |
| 28 | Bean freshness meter | 3d 4b | not started | — | drink now, past peak | **resting / too fresh** (`gaps.md` 8) |
| 29 | Shelf preview list (in a card) | 4a (gear) 4b (beans) | not started | gear · beans | default (with "Default" badge) | **empty** (1b's `{{ emptyCopy }}` card may be it; unconfirmed) |
| 30 | Weekday strip "This week" | 1b 4a 4b | not started | — | today by ink only | **today's underline** (`gaps.md` 9) |
| 31 | Try next teaser (dashed card) | 1b 4a 4b | not started | — | locked ("Opens at 5 cups") | progress toward the threshold (unconfirmed need) |
| 32 | Featured plan card (shadowed) | 8d (1) | not started | — | static + in-card CTA | — |
| 33 | Gear row icon tile | 3b (3) | not started | selected (accent fill) · unselected (muted border) | selected, unselected | — 2026-10-09: on a second look this is 3b's ⋮ row-menu button, not an icon tile (accent = this row's menu open, muted border = the others). It goes with the ⋮ (drift D-26). |
| 34 | Photo slot | 3c (76 empty) · 3e (filled + Replace / Remove) | not started | empty · filled | empty, filled | **uploading**, **failed** 2026-10-09: 3g has the same filled slot. |
| 35 | Suggested value row ("Use") | 3c (2) | not started | — | offered | **applied** |
| 36 | Stat tiles / profile header | 6a 8e | not started | — | static | — |
| 37 | Avatar edit button | 6d (1, 34×34 at the avatar's corner) | not started | — | default | — (read as a checkbox in the first pass; it is a small icon button) |
| 38 | Word tag (pressable) | 8f (4, word + count → 8l search) · 8h (11, tap to rename / merge) | not started | with count · without | default (8f's top word drawn 2px ink) | — (built at 44, §1 Tap affordance) 2026-10-09: the top word's 2px frame goes (drift D-23). |
| 39 | Attribute tag (display) | 6a (3, inside the pressable Taste DNA card) · 8d (2) | not started | — | static | — (never pressable on its own, §1 Tap affordance) |
| 40 | Destructive row button (framed) | 3e "Remove from my gear" / "Frees 1 slot" · 3g "Delete this bag" / "Not finish — erases it" | not started | glyph + label + note at right, 1.5 `border.muted` frame, below the form card | default | pressed; confirm / undo (`gaps.md` 18). Label ink, not brown (drift D-30). Added 2026-10-09 |

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

> **Historical: the mocks' axis as drawn, before the redesign.** The current component is in `design-system.md` §9 Taste axis slider. Do not draw from this section.

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

## Button: variant and size are mixed today (recorded 2026-10-09, proposal)

**Today (`Button.js`)**:
- `variant`: `primary` (blue fill) · `secondary` (ground fill, ink frame) · `text` (no surface, underlined).
- **`small`**, a boolean that only the text variant reads. It switches the label from `label.caps` to `meta` as written: the taste axis Clear.
- The filled variants have **one height**: `size.button.primary` (56; secondary is 52 in the mocks, `gaps.md` 4).

**So the two axes are mixed**. `small` sounds like a size but changes typography, and only on the variant that has no size. The real sizes in the mocks are not expressible:

| height | uses | look |
|---|---|---|
| 56, full width | 14 primary (1b 2b 3a 3c 3e 3g 4a 4b 5a–5e 7b 8e); 8c Next (not full width) | primary |
| 52, full width | 7 secondary (1b 3b 5a 5b 5c 5e) | secondary |
| 48 | 8f (shadowed) | — |
| 44 | 3c "Use" (blue); 3d "Edit" / "Finish bag" | primary · secondary |
| 40 | 6d "Save", 8j "Send" (blue); 8h "Add" (ink frame) | primary · secondary |
| 36 | 3e / 3g "Replace" (ink 1.5) and "Remove photo" (`border.muted` 1.5, no fill); 7a "Mark all read" (`border.muted`, no fill) | secondary · a muted-frame look |

**Proposal**, two axes, kept apart:
- **`variant`** = surface and role: `primary` · `secondary` · `text` (a `quiet` look was proposed and dropped, see below).
- **`size`** = height, for surfaced variants only: `full` (56, or 52 for secondary per `gaps.md` 4) · `row` (44) · `compact` (40) · `small` (36, touch area padded to 44 with `hitSlop`, `gaps.md` 19).
- **The text variant takes no size.** Its typography is its own prop, e.g. `type: 'caps' | 'inline'`: `inline` = `meta` as written, today's `small`. Rename `small` → `type="inline"`, so `small` is free for the 36 height.
- 48 (8f) is a single use; decide with 8f.

**Approved 2026-10-09**: the two axes (`variant` × `size`, surfaced variants only), and the text variant's `type="inline"` replacing `small`, so `small` is the 36 size. 48 is decided with 8f.
- **`quiet` is dropped (2026-10-09). The variants are `primary` · `secondary` · `text`.** A 1.5 `border.muted` frame with no fill is §1's look for an *unselected option*, so a button in it reads as a choice. 3e / 3g "Remove photo" and 7a "Mark all read" become `secondary` + `small` (36). That "Remove photo" was lighter than "Replace" no longer matters: destructive actions get no look of their own.
- **Secondary's full height is 52 by design** (every mock; it sits one step under the primary it usually stacks beneath). The code's 56 is drift D-32.
- Not built; the rename touches one call site (AxisSlider's Clear).

## Bag form: origin, region and process (decided 2026-10-09; not built)

- **Never required, never blocking**: §1's principle, "required fields start pre-filled and never block".
- **3c (new bag, the 15-second path)**: one optional line under Roast level, "Origin · Process", shown with any guess. Saving without touching it is fine.
- **3g (edit bag)**: full fields.
  - Under Roaster: a two-column row "Origin / Region", like 3e's "Maker / Added on".
  - Under Roast level: "Process".
- **Inputs**:
  - **Process**: an option set, Washed / Natural / Honey / Anaerobic. `anaerobic` is added to the table.
  - **Origin**: a country, from a bottom sheet with a search field. The bundled country list, with the user's history first.
    - **That sheet and search field are the flavour tags' Search.** Build them there first and reuse them here; do not build a second one.
  - **Region**: free text, with history as suggestions.
- **Guessing from the bean name**: proposal 2026-10-09, see the report. A guess must read as a guess, and an unconfirmed guess must not be saved as the user's input.

## Bundled flavour list and its groups (proposal, 2026-10-10)

The bundled list is the starting point for 5b's flavour tags (never a whitelist; new words go into history).
- **The list (proposed 2026-10-08, not yet confirmed)**: one concrete name per flavour-wheel family. Mock words first; ＊ = added to cover a missing family.
- **No group attribute exists yet.** 8n ("How do you take your coffee?") needs one to order the suggestions.
- 8n's own labels give the two groups:
  - Black → "Acidity, origin";
  - With milk → "Body, sweetness";
  - Depends on the day → no reordering.
- **Proposed groups** (the classification is to be decided):

| word | source | family | proposed group |
|---|---|---|---|
| Jasmine | 5b | floral | acidity / origin |
| Peach | 2a (White peach merged in) | stone fruit | acidity / origin |
| Grapefruit | 8d | citrus | acidity / origin |
| Blackcurrant | 8d | berry | acidity / origin |
| Black tea | 5b | tea | acidity / origin |
| Cocoa | 5b 2a | chocolate | body / sweetness |
| Walnut | 2a | nut | body / sweetness |
| ＊Caramel | added | sweet | body / sweetness |
| ＊Cinnamon | added | spice | body / sweetness (or neither: spice sits with roast) |
| ＊Smoke | added | roast | body / sweetness (or neither; alternative "Toast") |

- **C-1 answered (2026-10-10, confirmed)**: 8n orders **only the flavour-tag suggestions**. The order of the four axes is fixed; AxisSlider is not affected.
- **8n's sub-lines were written by Design**, not taken from a brief: "Acidity, origin" and "Body, sweetness". "Acidity" and "Body" overlap the axis names, which suggested 8n might reorder the axes. Whether to reword them is decided later.
- Five to five, if Cinnamon and Smoke stay in body / sweetness. If they are "neither", a third, unordered group is needed. Words added by the user from history carry no group; they follow history order.

## Single-select: can it be cleared? (recorded 2026-10-10)

**Today**: `SegmentedControl` cannot clear. Pressing the selected chip is a no-op (and gives no feedback: its ink fill has no darker tier, §1 Pressed). Once chosen, a value cannot return to empty.

**Spec addition**: a `clearable` flag. When set, pressing the selected chip clears it (value → empty). Needed wherever empty is a valid answer. Otherwise a pre-filled value cannot be removed, and the pre-fill becomes an imposition, against "required fields start pre-filled and never block".

| use | options | clearable? | why |
|---|---|---|---|
| 5a 5d 5e Who made it | I made it / Barista / Packaged | no | structural, never empty |
| 2a records filter | All / I made it / Barista / Ready-to-drink | no | "All" is the empty state |
| 2b Group by | Month / Brew method / Roaster / None | no | "None" is the empty state |
| 3a gear category | Brewer / Grinder / Kettle / Scale | no | tabs, one always shown |
| 3e gear Category | Brewer / Grinder / Kettle / Scale | no | a gear item has a category |
| 3f sort | Newest / Best rated / Most cups | no | one order always applies |
| 6d How I brew | Home brewer / Café goer / Barista / Just starting | no | "Just starting" covers the unsure case |
| 8j topic | An idea / Logging / Taste DNA / Something else | no | "Something else" covers the rest |
| 8l scope | Words / Beans / Gear | no | a search has a scope |
| **3c 3g Roast level** | Light / Medium / Medium-dark / Dark | **yes** | unset is valid, and a reused bag pre-fills it |
| **3c 3g Process** (planned) | Washed / Natural / Honey / Anaerobic | **yes** | unset means unknown (no "Unknown" option) |

- **Open**: the selected chip of a clearable set needs press feedback. Today it does not respond. Its ink fill has no darker tier, so it would take the scale, or a step lighter. To decide when built.

## 8h words: merges live in their own table (policy, 2026-10-10)

- Renaming or merging a word in 8h **never rewrites note text**. Notes stay as the user wrote them (`cups.note`).
- A separate table holds "this word merges into that one" (and renames). Matching and counting read it. Details are specced with 8h.

## Suggested value row (#35) when there is no guess (2026-10-10)

- When a guess cannot be made (a blend, a farm or station name, two countries in the name), **no suggestion row is shown**. #35 has only two states, offered and applied, and no empty one.
- The field itself stays (e.g. 3c's optional "Origin · Process" line), simply without a suggestion.
- An unconfirmed suggestion is never saved (decided 2026-10-09).

## Row menus: gear and words are built differently (recorded 2026-10-09)

- **Gear (3b)**: each item has a full page, 3e (Edit gear). The ⋮ sheet only repeated 3e's contents (default, edit, remove), so the ⋮ goes. The row opens 3e directly, with a chevron (drift D-26).
- **Words (8h)**: the ⋮ stays as drawn.
  - The menu's contents are not in the mocks.
  - There is no page behind a word: rename and merge happen in place ("Tap a word to rename it everywhere, or merge it into another").
  - So 8h cannot follow 3b. Its ⋮ is specced when 8h is built.
- **Beans (3d)**: no ⋮. "Edit" (→ 3g, added 2026-10-09) and "Finish bag" sit on each card. Whether bean cards should follow gear (card tap → 3g) is open (report 2026-10-09).

## 3g Edit bag — read against 3e Edit gear (added to the mocks 2026-10-09)

3g is the page behind 3d's "Edit". It is built like 3e, part for part:

| part | 3e Edit gear | 3g Edit bag | same? |
|---|---|---|---|
| header | back 44, "Edit gear" (serif 40), count "2 / Cups logged" | back 44, "Edit bag", "3 / Cups logged" | yes |
| photo | 76 thumbnail, caption, Replace (36, 1.5 ink) / Remove photo (36, 1.5 `border.muted`) | same; caption "This bag's thumbnail everywhere." | yes |
| form card | 2px ink on raised, padding 20 / 18, gap 20 | same | yes |
| first field | "Name", active, blue caret | "Bean name", active, caret, ellipsis on overflow | label differs |
| option set | Category: 4 options (ink fill = selected) | Roast level: Light / Medium / Dark | same look |
| field row | Maker · Added on (2 columns) | Roasted on · Opened on · Size (3 columns) | count differs |
| notes field | "My settings note" (min 78, 1.5 frame, `#F9F5F2`) | none | 3g has none |
| card foot (below 1.5 dashed) | "My default grinder" + switch (62 × 34 ink, drift D-20) | freshness meter (the 3d "drink now" bar, `beanFreshness`) + "Day 7 · drink now" + "Recounted from the roast date when you change it." | different by design |
| destructive row | "Remove from my gear" / "Frees 1 slot" | "Delete this bag" / "Not finish — erases it" | yes (both brown labels) |
| footer | Save changes (primary) + "Edits apply to the 2 cups already logged with it." | same, "…from this bag." | yes |

- **No new token, style or component.**
  - Its freshness track `#E8DCD3` was already folded into `surface.muted` (`beanFreshness.track`).
  - Its parts are the ones 3e already needs, several of them not built yet: the 36 compact button, the underlined form field, the destructive row.
- **Naming**: the mock's caption says "Edit beans", the screen title "Edit bag". The rest of the beans flow says "bag" ("Add a bag", "Finish bag").
- **Not in 3g**: "Finish bag". It stays on the 3d card; 3g's "Delete this bag" erases, which is a different act.
- Both destructive rows set their label in brown (#9E5202), an action in brown. The same open point as D-27: destructive actions have no look of their own yet.

## Estimate

| scope | items |
|---|---|
| missing states, by component (the table above) | **40** across 24 components → **32** across 19 after the 2026-10-07 rules (see `gaps.md`) |
| focus treatment: one rule, then applied to every pressable | 1 rule (+ 25 applications) |
| error flows (save failure, offline), reusing the 5d vocabulary | 2 |
| first-run empty states (My gear, My beans, Notifications, Try next, My words, Finished bags; Records has a minimal one) | 6 |
| **total** | **≈ 49 states** |

Drawn as one board per component plus three global boards (focus, errors, empties), that is **about 27 boards**. Not counted: unbuilt variants (Button tertiary / compact / small, the chip paddings), which are spec work rather than missing states.
