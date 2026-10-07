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
| Taste axis slider (18) | dragging; clearing a set axis; disabled |
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

**Measured**: the error system (`state.error.border` / `.surface` / `.shadow` / `.text` / `.dashed`) appears on **5d alone** — missing required fields in the log-a-cup form. There is no network error, no save failure, no offline state, no per-field inline error.

**What happens if left alone**: the vocabulary exists (brown border + brown hard shadow + tinted surface) but its scope is unproven; engineers will apply it to failures it was not designed for, or invent a red that does not exist in the palette.

**Needs designing**: save failure, offline, and per-field inline error, reusing the 5d vocabulary.

---

## 7. Nowrap chips will overflow once the UI is translated

**Parts affected**: the 40 `nowrap` uses — **all fixed copy, none user-supplied**: brew-method chips `Filter / Espresso / Cold brew` (12), maker chips `I made it / Barista / Packaged` (12; the mocks still say "Ready-to-drink"), dates `Apr 8 / Apr 7 / Apr 6` (12), status label `Early signs` (4).

**What happens if left alone**: safe in English. Once Japanese and Simplified Chinese ship (8m already lists three languages), `Best rated` and the brew-method chips grow while `nowrap` keeps them on one line — they will push out of the row or out of the card.

**Needs designing**: per-locale behaviour for chips — shorter strings, wrapping allowed, or horizontal scroll.

**Note (2026-10-06)**: user-supplied names (café, brand, drink, product) are never `nowrap`. They follow the truncation rule in item 1.

**Update (2026-10-04)**: the maker chip "Ready-to-drink" is renamed **"Packaged"** (ja 市販品, zh 市售) — see `i18n-notes.md`. The three maker chips now fit on one line at 390 / 393pt. Brew-method chips and `Best rated` are unchanged.

---

## 8. `beanFreshness` has no state for a freshly opened bag

**Parts affected**: the bean freshness meter on 3d and 4b.

**Measured**: the peak band starts at 17% of the track, so days 0–4 (degassing) fall outside both defined states. Only `drinkNow` and `pastPeak` have colours.

**What happens if left alone**: a bag opened today renders with an empty elapsed bar and no explanatory label — it will look identical to a data error.

**Needs designing**: a third state (resting / too fresh), which also settles OQ-3 (whether `peakBand` is intentionally state-dependent).

---

## 9. The weekday strip's active-day underline is unimplemented

**Parts affected**: the "This week" strip on 1b, 4a, 4b.

**Measured**: date numerals carry `border-bottom: 2px solid transparent`; the current day is distinguished only by ink (`color.text.primary` vs `color.text.muted`). The transparent border is a slot that was never filled.

**What happens if left alone**: minor — ink contrast alone is a weak "today" signal, and the placeholder invites someone to guess a colour.

**Needs designing**: whether the underline renders, and in which colour.


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

## 12. A disabled option has no visible reason — unless the limit caused it (added 2026-10-07)

**Parts affected**: every option set (§1 Disabled options).

**Measured**: the disabled look is shared. A limit-locked option is explained by its count. An option disabled for its own reason (not available now) has nothing on screen that explains why; only the screen-reader text can.

**Needs designing**: a visible way to give the reason. Not solved now.

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
