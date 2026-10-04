# MoreCoffee — Design System

Reverse-extracted from the shipped screen designs. Every value here is traceable to `process/evidence.md`.

- **Source**: `MoreCoffee design.dc.html`, inline styles, 32 frames → **30 unique screens**
- **Evidence base**: `process/evidence.md` (raw frequency), `process/roles.md` (role annotation), `process/step3-role-thresholds.md` (role-scoped threshold pass)
- **Date**: 2026-09-20
- **Out of scope**: `9a` `9b` `8a` (Welcome — designed separately), `1a` (rejected direction), `2c` (superseded by 5a), `8b` `8k` (sign-in / account, held with Welcome). `6b` `6c` are the same screen as `6a`, scrolled.
- **Screens covered (30)**: 1b · 2a · 2b · 3a · 3b · 3c · 3d · 3e · 3f · 4a · 4b · 5a · 5b · 5c · 5d · 5e · 6a · 6d · 7a · 7b · 8c · 8d · 8e · 8f · 8g · 8h · 8i · 8j · 8l · 8m

**Method**: values were tagged by role (the property they are declared on + the element type they land on), then judged **inside each role** against a ≥3-screen threshold. Merges required two gates — Gate A (two values both qualifying in one role AND ΔE00 ≥ 2.0 are parallel intent, never merged) and Gate B (ΔE00 ≤ 8 non-text / ≤ 5 text, plus a WCAG contrast check that must not drop). Mechanism-bound values (scrim, error state, caret, meters) are promoted regardless of frequency.

Companion documents: `drift.md` (values to correct), `gaps.md` (states never designed), `exceptions.md` (6 true one-offs), `tokens.ts` (React Native object).

---

## 1. Hard Rules

Non-negotiable, and each one is a measured fact rather than a preference.

### Shape
- **Containers are square-cornered.** `border-radius` appears **0 times across all 30 screens**: every card, sheet, field, chip, button and thumbnail has square corners. Do not round a container.
- **Press feedback follows the shape of the element it sits behind.** Rectangular controls get a square fill; radial controls get a circle (the StarRating star, §9 Star rating). A press fill is feedback, not a container, so the container rule above does not govern its shape.
- **Border width is binary: `1.5` or `2`.** Both appear on all 30 screens and they are role-separated — `2` is the outline of a box, `1.5` is an internal divider or a weak frame. No other width exists; do not introduce one.
- **Border style is binary: `solid` or `dashed`.** No dotted, no double.
- Shadows are **hard**: blur 0, isotropic offset (x = y), single ink colour. No soft or directional shadows exist.

### Type
- **Two families only**: `Archivo` (sans) and `Instrument Serif` (serif).
- **Three weights only: 500 / 600 / 700. Regular (400) does not exist in this design — 0 occurrences across 30 screens. The lightest weight is 500. Do not use 400 on new screens.** Body copy is set at 500 deliberately.
- **Instrument Serif is used for exactly three things**: screen titles (`display.lg`, `display.sm`), statistics and numerals (`numeral.hero` for the cup count, `numeral.inline` for ratings, times like "08:00", temperatures like "92°"), and the tasting-note input field (the single italic exception). **It is never used for** body copy, labels, buttons, chips/badges, list-row titles, form labels or navigation — all of those are Archivo.
- **`font-style: italic` appears once** in the whole product (the 5b tasting-note field). Do not use italics on new screens.

### Spacing
- The scale is **9 steps: 2 · 4 · 6 · 8 · 12 · 14 · 16 · 20 · 28**.
- **This is not a pure 4pt grid. `14` is a deliberate exception. Do not normalise it.** Reason: 14px is the exact midpoint of 12 and 16, so — unlike every other raw value — its nearest step is not uniquely determined. Snapping it to 16 would be an arbitrary tiebreak applied to 177 uses. Permitting 14 as a step reduced total shift cost from 1,232 to 914 px·uses (−26%).
- **About 60% of the scale's residual error comes from values that sit equidistant between two steps and were pushed to one side arbitrarily. Individual shifts of that kind have no design rationale.** Most of that error is absorbed by the two-axis semantic defaults below, because equidistant values cluster by axis (e.g. 15px is 76% vertical). **Only `3px` and `7px` (157 uses) remain genuinely arbitrary — they spread thinly across 5 and 7 axes respectively and belong to no role.** If a 2px discrepancy looks wrong in implementation, judge it locally rather than blaming the scale.
- **Do not add steps.** If a new spacing value seems necessary, first check whether an existing step works.

### Motion
- **The design defines exactly one motion**: `340ms cubic-bezier(0.22, 0.61, 0.36, 1)` (5a, height expand). `animation` is 0 occurrences. **Use this easing first for any new animation; discuss before introducing a second.**

### Pressed (added 2026-10-04 — not in the shipped screens, which have 0 `:active`)
- **Pressed darkens the fill. It never changes opacity.** One rule for every tappable component. Opacity would wash out the hard shadow and the 2px ink borders, and reads muddy against the warm ground.
- Light fills — `color.surface.raised`, `color.surface.ground`, or transparent over a raised card — go to **`state.pressed.surface`** (alias of `color.surface.muted`). The action fill `color.action.bg` goes to **`state.pressed.action`**.
- **Nothing else changes**: border, label/ink, glyph and `HardShadow` stay as they are. The change is instant (no motion).
- A fill that is already ink (the selected chip) has no darker tier and does not respond. Pressing it is a no-op anyway. Disabled controls do not respond.
- Applies to: Button, SegmentedControl options, FieldRow, StarRating stars, IconButton — and to any tappable component added later.

### Declarations that appear zero times in 30 screens
These absences are design facts, not oversights — but several of them are also why `gaps.md` exists.

`font-variant` · `font-stretch` · `text-underline-offset` · `rotate` · `overflow-x` · `overflow-y` · **`text-overflow`** · **`-webkit-line-clamp`** · `-webkit-box-orient` · `animation` · `backdrop-filter` · `aspect-ratio` · **`outline`** · `pointer-events` · `user-select` · `object-fit` · `mix-blend-mode` · `position: sticky` · `position: fixed`

Consequences worth stating out loud:
- **`outline` 0 → there is no focus ring in this design.** The only focus expression is the text caret.
- **`text-overflow` / `-webkit-line-clamp` / `overflow-x` / `overflow-y` all 0 → long-text behaviour is undefined everywhere.** See `gaps.md` item 1.
- `position: sticky`/`fixed` 0 → every pinned panel is `position: absolute` inside the screen frame.

---

## 2. Color Tokens

Grouped by role. Every hex is a value that qualified **inside that role** (≥3 screens), was merged into one under the two gates, or was promoted as mechanism-bound (marked **A**). Sub-roles with no qualifying value of their own are **aliases** — they point at a sibling token and introduce no new hex.

**Cross-role consistency: all 45 raw colors were checked for role-dependent merge targets. Two inconsistencies were found and both resolved** (`#DDD0C8` → `#E4D6CC` in both border and fill; `#C2B4AB` unified as one mechanism token). No further audit needed.

### Text
| token | value | evidence |
|---|---|---|
| `color.text.primary` | `#273D22` | 30 screens; the product's ink |
| `color.text.secondary` | `#5C5049` | body-text 18 screens / secondary-text 21 screens |
| `color.text.muted` | `#6B5D55` | secondary-text 29 screens / 237 uses — the most-used text colour |
| `color.text.accent` | `#9E5202` | 19 screens; section eyebrows, brand emphasis |
| `color.text.accentStrong` | `#8A4602` | 4 screens; paired with `accent`, used on tinted grounds |
| `color.text.link` | `#05639C` | 4 screens |
| `color.text.success` | `#4A6640` | 5 screens; "set", "done" confirmations |
| `color.text.onInverse` | `#F4EDEA` | text on `#273D22` grounds |
| `color.text.onAction` | `#FFFFFF` | text and icons on `#067BC2` buttons |

`#5C5049` / `#6B5D55` are **two deliberate tiers** (ΔE00 4.84, both qualifying in the same roles) — Gate A. Never merge them. Same for `#9E5202` / `#8A4602` (ΔE00 5.35).

### Surfaces
| token | value | evidence |
|---|---|---|
| `color.surface.ground` | `#F4EDEA` | 16 screens; the screen behind everything |
| `color.surface.raised` | `#FFFCFA` | 28 screens; cards, sheets, fields. Absorbed `#F9F5F2`, `#FFF8F1` |
| `color.surface.sunken` | `#EFE4DC` | 5 screens; recessed areas. Absorbed `#F0E7E1`, `#EFD9C2`→ see error |
| `color.surface.inverse` | `#273D22` | selected chips, inverted rows |
| `color.surface.muted` | `#E4D6CC` | 14 screens; thumbnails, tracks. Absorbed `#DCD0C8`, `#E8DCD3`, `#E0D2C8`, `#DDD0C8` |
| `color.surface.mutedStrong` | `#D9C7BB` | placeholder thumbs. Absorbed `#D8C9BF`(fill), `#CFC1B6` |
| `color.surface.mutedDark` | `#CBB6A8` | absorbed `#C2B4AB`(fill) where not mechanism-bound |

### Borders
| token | value | evidence |
|---|---|---|
| `color.border.strong` | `#273D22` | 30 screens / 234 uses; every `2px` box outline |
| `color.border.muted` | `#C8BCB4` | unselected frames, tracks |
| `color.border.soft` | `#D8C9BF` | 20 screens; hairlines inside cards |
| `color.border.subtle` | `#E4D6CC` | 18 screens; the weakest divider |
| `color.border.medium` | `#B3A69E` | 5 screens; axis needle, ghost marker |
| `color.border.accent` | `#8A4602` | tinted badges and brown-bordered chips |

`color.border.muted` / `soft` / `subtle` all qualify independently (Gate A, ΔE00 3.07–3.63). They are three real tiers.

### Dividers
Only one hairline tier exists in the whole product.
- `divider.hairline` — **alias of `color.border.subtle`** (`#E4D6CC`). `#D8C9BF` is used for the same purpose in 2a and is available as `color.border.soft`.
- There is **no second, stronger hairline tier**. This is consistent with border width being binary and border style being binary — a deliberate restraint. If a stronger separation is ever needed, use the `border` role (a `2px` box outline), do not add a hairline tier.

### Badges / chips
| token | value | used on |
|---|---|---|
| `color.badge.bg.neutral` | `#EDE4DF` | 6 screens |
| `color.badge.bg.accent` | `#F1E3D6` | 7 screens. Absorbed `#F2E4D2`, `#EFD9C2`(badge use) |
| `color.badge.bg.success` | `#E2EADC` | 4 screens ("I made it") |
| `color.badge.bg.info` | `#E6EFF5` | 4 screens ("Barista") |
| `color.badge.bg.raised` | `#FFFCFA` | 8 screens |
| `color.badge.bg.selected` | `#273D22` | 18 screens |
| `color.badge.fg.neutral` | `#5C5049` | absorbed `#6B5D55` (contrast improved 6.19 → 7.62 on `#FFFCFA`) |
| `color.badge.fg.accent` | `#8A4602` | |
| `color.badge.fg.success` | `#2F4A28` | |
| `color.badge.fg.info` | `#0A5E92` | |
| `color.badge.fg.selected` | `#F4EDEA` | on `#273D22` |

`#067BC2` / `#05639C` / `#0A5E92` are **three roles, not three shades**: action fill, link text, badge text. Never merge.

### Icons
| token | value | notes |
|---|---|---|
| `color.icon.default` | `#273D22` | stroke icons, 28 screens |
| `color.icon.muted` | `#6B5D55` | absorbed `#5C5049`(icon-stroke) |
| `color.icon.accent` | `#9E5202` | absorbed `#8A4602`(icon-stroke) |
| `color.icon.onAction` | `#FFFFFF` | absorbed `#F4EDEA`(icon-stroke) |
| `color.icon.rating` | `#C9821A` | 8 screens — **fill, not stroke**; rating stars only |

### Action
| token | value | notes |
|---|---|---|
| `color.action.bg` | `#067BC2` | primary buttons, 3 screens+ |
| `color.action.fg` | `#FFFFFF` | |

### Pressed (added 2026-10-04 — see Hard Rules)
Not in the shipped screens. Promoted because the pressed state appears in every tappable component. That is six uses in the base set (Button primary and secondary, SegmentedControl, FieldRow, StarRating, IconButton), with more on every screen, so it clears the rule of two.

| token | value | applies to | why this value |
|---|---|---|---|
| `state.pressed.surface` | alias of `color.surface.muted` (`#E4D6CC`) | raised, ground and transparent-over-raised fills | `surface.sunken` was the semantic first choice but sits only ΔE00 3.16 below ground, too faint for the secondary button. `surface.muted` reads clearly from both raised (ΔE00 9.40) and ground (6.18). Ink stays at 8.32:1 and `badge.fg.neutral` at 5.48:1. `text.muted` (FieldRow meta) drops to 4.45:1, just under AA for 12px, but only while a finger is down. No new hex |
| `state.pressed.action` | `#05639C` | the `color.action.bg` fill | No existing fill token is a darker action blue. Reuses the value of `color.text.link` as a separate role (fill vs link text), the same precedent as `border.subtle` / `texture` sharing `#E4D6CC`. ΔE00 9.19 below `#067BC2`; white label contrast rises from 4.55 to 6.42:1 |

### Texture — same value, two geometries
Colour was unified to `#E4D6CC`; the two textures differ in **geometry, not colour**. Two tokens sharing one value is intentional, so that texture density can be tuned without touching the border role.

| token | value | geometry (verbatim) | coverage |
|---|---|---|---|
| `texture.dot` | `#E4D6CC` | `radial-gradient(<color> 1px, transparent 1px)`, `background-size: 7px 7px`, default repeat | 16 screens |
| `texture.rule` | `#E4D6CC` | `repeating-linear-gradient(90deg, <color> 0 1.5px, transparent 1.5px 25%)` | 6 screens / 18 uses |

`texture.rule` sits on **two different bases** (`#FFFCFA` 3 uses, `#F4EDEA` 15 uses) — the base is a parameter passed at use time, not baked into the token.

### Mechanism-bound (class A)
Promoted regardless of frequency: a low count here means "only a few screens show this state", not "this state is unimportant.

| token | value | mechanism |
|---|---|---|
| `color.scrim` | `rgba(39, 61, 34, 0.42)` | modal sheet scrim (2b, 3b). The sheet also dims the page behind it with `opacity: 0.45` |
| `color.fade.stop` | `rgba(244, 237, 234, 0)` → `#F4EDEA` | scroll fade-out under floating bars (6a, 8d) |
| `state.error.border` | `#9E5202` | 5d |
| `state.error.shadow` | `#9E5202` | 5d, `4px 4px 0` |
| `state.error.surface` | `#EFD9C2` | 5d, the warning summary's ground. The other two error blocks use `#FFFCFA`, which is what makes this a distinct surface rather than drift |
| `state.error.text` | `#8A4602` | 5d (alias of `color.text.accentStrong`) |
| `state.archived` | `saturate(0.7)` | 3f archived bag thumbnails |
| `color.caret` | `#067BC2` | text cursor — 3e, 6d, 8j, 8l. `2px` wide, 18–22px tall, always directly after the last character of an editable field. **The only focus expression in the product** |
| `marker.required` | `#9E5202` | the square bullet on a required section heading |
| `marker.optional` | `#C8BCB4` | the same bullet for optional sections (5e) — completes the pair |

### Component-specific anatomies
Two meters exist. They look similar and are **not** one component: different anatomy, different semantics.

**A. `beanFreshness`** — elapsed time since a bag was opened. Track + peak band + elapsed fill + today marker, `4px` tall. Single-directional, has a notion of completion.

| part | drinkNow | pastPeak |
|---|---|---|
| `beanFreshness.track` | `#E4D6CC` (alias `color.surface.muted`) | same |
| `beanFreshness.peakBand` | `#CFDCC8` **A** | `#E4D6CC` — *unresolved, see OQ-3* |
| `beanFreshness.elapsed` | `#7E9675` **A** | `#C2B4AB` **A** |
| `beanFreshness.todayMarker` | `#4A6640` **A** | `#8C7E76` **A** |

The marker is intentionally one step darker than the fill it sits on — it is a `2px` line standing at the right edge of the bar, and matching the fill colour makes "today" unreadable. (4b currently matches them; see `drift.md`.)

**B. `axis`** — a taste axis slider. Rail + needle (+ ghost + delta), `20px` tall, bipolar with labelled ends, **no fill**. Appears on 1b, 4a, 4b, 5b, 5c.

| part | value | notes |
|---|---|---|
| `axis.rail.readonly` | `1.5px dashed` `#C8BCB4` on `#F4EDEA` + `texture.rule` | 1b, 4a, 4b, 5c |
| `axis.rail.editable` | `2px solid` `#273D22` on `#FFFCFA` + `texture.rule` | 5b only — the screen where the user sets values |
| `axis.needle` | fill `#E4D6CC`, border `#B3A69E`, `12 × 30` | |
| `axis.ghost` | border `#B3A69E`, `10 × 10`, transparent fill | previous value (5c) |
| `axis.delta` | `#B3A69E`, `2px` tall | movement since last value (5c) |

The readonly/editable split lines up exactly with the `dashed` semantics below.

**C. `tabBar`** — the bottom tab bar carried by the floating bar (§9). Four tab slots and one wider add slot, centred in the bar. Appears on 1b, 2a, 4a, 4b, 6a and 8d. *Added 2026-10-04.* The original extraction missed its two raw icon colours, which are written as lowercase hex in the source; they are the only lowercase hex values on the in-scope screens.

| part | value | notes |
|---|---|---|
| `tabBar.slot` | `60 × 40` | Visual box of each tab. The touch area stretches to the bar's inner height (56) to clear `size.tapTarget` |
| `tabBar.addSlot` | `68 × 40` | The centre add slot |
| `tabBar.icon.active` | alias `color.action.bg` (`#067BC2`) | the current tab's fill glyph |
| `tabBar.icon.inactive` | `#9B8F87` | 6 screens / 23 uses. No in-role sibling to merge into: the fill-icon role otherwise holds only the rating gold |
| `tabBar.icon.accentInactive` | `#C6BBD3` | 5 screens / 10 uses. The calendar glyph's two binding marks |
| `tabBar.icon.accentActive` | alias `color.text.primary` | the same marks when Try next is active (8d) |
| `tabBar.add` | `color.surface.inverse` square, `color.text.onInverse` plus | 44 × 34 glyph, square (no radius) |

**Review trigger — `tabBar.icon.accentInactive` (`#C6BBD3`)**: its only referent today is the calendar glyph's binding marks, and that calendar is a placeholder standing in for the Try next icon. When the Try next icon and its colours are designed, check whether anything still uses this token. If nothing does, remove it (and `accentActive` with it) rather than leaving it in the set.

---

## 3. Text Styles

Composite only — family, size, weight, line height and letter spacing are one unit. **No overrides.** If you want to patch one property of a style, that is the signal to define a new style instead.

React Native has no `em` and no unitless line height, so both are converted: `letterSpacing = em × fontSize` (2 dp), `lineHeight = multiplier × fontSize` (rounded). Authoring notation is normalised to `0.16em` form before conversion.

`lineHeight: 未找到` means no `line-height` was declared on any use of that style. No value is invented; RN falls back to the platform default.

**14 styles.** All 14 have ≥3 uses; 13 have ≥3 screens; `text.inlineAction` is promoted as mechanism-bound (class A).

### Serif (Instrument Serif)
| style | size | weight | lineHeight | replaces | reach |
|---|---|---|---|---|---|
| `display.lg` | 40 | 400 | 41 | 40/1, 40/1.02, 44/1.02, 44/0.8, 42/1.04, 38/1.06, 36/1.08, 34/1.08, 33/1.1 | 12 screens / 29 uses |
| `display.sm` | 30 | 400 | 31 | 30/1, 30/0.9, 30/1.1, 32/1, 31/1, 28/1, 27/1.1 | 14 screens / 25 uses |
| `numeral.hero` | 96 | 400 | 79 | 96/0.82 | 3 screens / 3 uses |
| `numeral.inline` | 22 | 400 | 22 | 22/1, 26/1, 24/1, 21/1, 19 | 10 screens / 33 uses |

The seven stray display sizes (27/31/33/34/36/38/42) collapse into two steps. Single-line numerals authored at 0.8–1.0 line height are folded to 1.02 — at one line there is no visual difference.

### Sans (Archivo)
| style | size | weight | lineHeight | letterSpacing | transform | replaces | reach |
|---|---|---|---|---|---|---|---|
| `title` | 16 | 700 | 未找到 | — | — | 16/700, 17/700, 19/700, 16/700/1.3 | 17 screens / 58 uses |
| `label` | 15 | 700 | 未找到 | — | — | 15/700, 13/700, 14/700, 12/700 | 17 screens / 106 uses |
| `body` | 14 | 500 | 21 | — | — | 14/500 (1.5/1.55/1.6), 13/500, 13.5/500, 15/500/1.6 | 12 screens / 26 uses |
| `body.sm` | 12 | 500 | 18 | — | — | 12/500 (1.4/1.5), 12.5/500/1.45 | 26 screens / 85 uses |
| `meta` | 12 | 600 | 17 | — | — | 12/600, 13/600, 11/600, 14/600, 16/600, 12.5/600 | 11 screens / 49 uses |
| `label.caps` | 12 | 700 | 未找到 | 0.96 | uppercase | 12/.06–.12em, 13/.06–.12em | 22 screens / 93 uses |
| `label.eyebrow` | 10 | 700 | 未找到 | 1.60 | uppercase | 10/.08–.16em, 11/.04–.22em, 9/.1–.12em | 28 screens / 235 uses |
| `button.caps` | 16 | 700 | 未找到 | 0.96 | uppercase | 16/.06em, 15/.06em, 14/.08em | 17 screens / 22 uses |
| `text.weekday` | 10 | 700 | 未找到 | 0.20 | — | 10/700/.02em | 3 screens / 21 uses |
| `text.inlineAction` | 11 | 700 | 未找到 | 0.88 | uppercase + underline | 11/700/.08em + underline | 2 screens / 5 uses **A** |

**`body` (14) and `label` (15) are kept separate on purpose.** 14 is the explanatory paragraph (1–2 per screen); 15 is the button label and inline emphasis (~4 per screen). They are different jobs at adjacent sizes.

**`text.weekday` shares family, size and weight with `label.eyebrow` but is a separate style**: its content is already a single uppercase letter so it carries no `text-transform`, and its letter spacing is 0.20 against 1.60 — an 8× difference — to keep a single glyph optically centred. Deliberately distinct, not a variant.

**`text.inlineAction`** is the only expression of "this word is tappable" (3f "Reopen bag", 5d "Go to first"). It pairs with `color.text.link`, which qualifies independently on 4 screens. Two screens is a reflection of how many screens have inline actions so far. In RN, `textDecorationLine: 'underline'` is supported; `textDecorationColor` is a separate property — confirm it inherits the text colour, and add it to the token if it does not.

### 3.1 Truncation policy (resolves `gaps.md` item 1 — confirmed by design 2026-10-04)

The shipped screens define no long-text behaviour (`text-overflow` / `line-clamp` 0 uses). This policy is set by the base `Text` component as a closed vocabulary — callers pick a preset, never a raw line count — so every surface showing the same kind of user string clips it the same way.

| preset | lines | applies to |
|---|---|---|
| `name` | 2 | user-supplied names: café, bean, roaster, gear, drink, profile name — list-row titles, field-row values, card titles |
| `meta` | 1 | the provenance / secondary line under a name (`body.sm`, `meta`) |
| `note` | 3 | tasting-note and memo previews |
| `none` | — | fixed copy (labels, buttons, chips), and detail screens where the full text belongs |

- **Form**: tail ellipsis. Never shrink-to-fit (that patches a composite style — §3 forbids it), never a silent clip by a fixed-height parent.
- **Full text**: reached through the detail screen the row already leads to. No tap-to-expand — it would be an invented interaction.
- **Why `name` is 2, not 1**: roaster/origin names put the distinguishing part last ("…Natural Anaerobic, Lot 17"). One line would hide it. Rows have no fixed height (padding-based), and the right meta column is fixed-width, so a second line keeps the column aligned.
- **CJK**: iOS uses `lineBreakStrategyIOS: 'standard'` (system kinsoku — no line-leading `。、」`, no line-ending `「`); Android keeps `highQuality` breaking with hyphenation off. Tail ellipsis works for CJK as-is.
- **Fixed copy is out of scope**: nowrap chips under translation remain `gaps.md` item 7.

### 3.2 Font face resolution — the (family, weight) → face mapping

Text styles name a family and a weight the way the design does (`Archivo` + `700`). React Native cannot select a weight inside a custom family: every weight is its own registered face. A single mapping layer, `src/theme/fonts.js`, is the system component that bridges the two. It is not a TokenSheet detail; every `Text` goes through it, and OQ-14 extends it.

| family | weight | face (registered name) |
|---|---|---|
| Archivo | 500 | `Archivo_500Medium` |
| Archivo | 600 | `Archivo_600SemiBold` |
| Archivo | 700 | `Archivo_700Bold` |
| Instrument Serif | 400 | `InstrumentSerif_400Regular` |

- `fontAssets` is the face list passed to `useFonts()` at the app entry. Only these four faces load, matching the three-weight rule and the serif's single weight.
- `resolveTextStyle(token)` replaces `fontFamily` with the face for that weight and **drops `fontWeight`**, so the platform cannot synthesize bold on top of an already-bold face. A (family, weight) pair with no face warns in development.
- Token values are unchanged: the mapping is how the platform reaches them, not a correction to them.
- **Planned extension (OQ-14, V1.1)**: the key becomes (family, weight, lang) so ja / zh text resolves to a CJK face of the same weight.

**Platform note — line boxes shorter than the font's natural box (2026-10-04, measured on device)**

Each face's natural line box (ascent + descent + lineGap) comes from its font file. hhea, typo and win agree, and CoreText reports the same values, so every engine sees identical metrics:

| face | ascent / descent / gap (per 1000) | natural box | e.g. |
|---|---|---|---|
| Instrument Serif | 990 / 310 / 0 | 1.300 em | 52 at 40 |
| Archivo (500/600/700) | 878 / 210 / 0 | 1.088 em | 15.2 at 14 |

All four serif styles carry a `lineHeight` below their natural box (`display.lg` 41 < 52, `display.sm` 31 < 39, `numeral.hero` 79 < 124.8, `numeral.inline` 22 < 28.6). No Archivo style does.
- **CSS / web** spreads the deficit evenly as negative half-leading, and ink overflows the box without clipping. The token values describe the design correctly in these terms.
- **iOS** takes the whole deficit from *above* the baseline, keeps the full descent *below* it, and clips the text to its frame. Measured on `display.lg`: frame 41, baseline 28.6 from the top, tallest ink ("f", 29.9 above the baseline) cut flat at the frame top, and 12.4 of empty descent above the rule.

This is a platform difference, not a token error.

**iOS adjustment**: `resolveTextStyle` drops a `lineHeight` that is shorter than the face's natural box, so those styles render on the natural box. That box contains every glyph by construction (ascent 39.6 ≥ "f" 29.9; descent 12.4 ≥ "g" 8.6 at 40). Spacing around such text is then set by its container, never by line-box leftover (see §9 Screen shell for the header).
- The rule applies to all four serif styles. Only `display.lg` is in use today; `display.sm`, `numeral.hero` and `numeral.inline` get taller boxes on iOS (e.g. 124.8 for the hero numeral). Their containers must be set when each is first used.
- Web keeps the CSS behaviour; it is a harness target, not a ship target.
- Android is unverified. Check it on the first Android build.

---

## 4. Spacing & Layout

### Primitive layer — implementation vocabulary, not design vocabulary
`space.2 · space.4 · space.6 · space.8 · space.12 · space.14 · space.16 · space.20 · space.28`

Derived from 24 raw values / 1,536 uses by exact dynamic programming, weighted by use count. Total shift cost **914 px·uses = 0.60px mean**; 9 steps is where the marginal gain dies out (8→9 saves 98, 9→10 saves 24, 10→11 saves 4, saturating at 11).

**Designers do not pick from this layer.** They pick a semantic token below.

### Semantic layer — two axes, because padding is authored as `v h`
Each default is the step the most-used value in that axis folds into.

| token | value | axis evidence |
|---|---|---|
| `inset.container` | `{ v: space.14, h: space.16 }` | v: 380 uses, 14px leads · h: 110 uses, 16px leads (40%) |
| `inset.control` | `{ v: space.14, h: space.16 }` | v: 82 uses, 15/14px (72%) · h: 76 uses, 16px (86%) |
| `badge.inline` | `{ v: space.4, h: space.8 }` | 30 uses — chips that sit **inside a list row** |
| `badge.standalone` | `{ v: space.8, h: space.12 }` | 18 uses — chips that sit **alone on a surface** |
| `gap.tight` | `space.4` | within one meaning unit (label + value, heading + caption) — the 2–6px band |
| `gap.row` | `space.8` | between items — the 9px band |
| `gap.section` | `space.12` | between sections, between cards, **and inside an enclosed surface** (measured mode of bordered cards and sheets) |
| `gap.axis` | `space.20` | **taste-axis groups only** — an internal rhythm of the `axis` component, not a general-purpose gap |
| `margin.container` | **no default** | see below |

**Chips do not split by whether they are tappable.** What they actually split by is placement context: `inline` fits within a row's height so its vertical padding is minimal; `standalone` sits alone on a surface. Across all 30 screens only **3 chips are tappable at all** (5a's maker picker) — "control" would have been a name for an assumption, not for the data. Both are separate base components in §9.

**Vertical gap has four modes.** The 6–7px band is empty and should stay empty: `tight` and `row` are "stuck together" vs "separate", with nothing in between. `row` → `section` is continuous, and all three are real. `gap.axis` is larger than `gap.section` because it belongs to one component, not because enclosure implies more room — **inside an enclosed surface, use `gap.section`** (that is the measured mode: 5 of 15 bordered cards/sheets).

**`margin.container` has no default. Choose a primitive explicitly at the point of use.** Its 66 uses spread across 13 values with the mode representing only 20% — a fabricated default would be more dangerous than none.

### Layout tokens — screen chrome, roughly one use per screen
| token | value | evidence |
|---|---|---|
| `layout.gutter` | 22 | 30 screens / 163 uses — the only horizontal screen padding in the product |
| `layout.screen.top` | 60 | 18 screens |
| `layout.screen.bottom` | 34 | 19 screens |
| `layout.section.gap` | 56 | 12 screens |
| `layout.fade.top` | 30 | the fade band above a floating bar |
| `layout.empty.block` | 100 | 2 screens; bottom room under a floating bar |

### Optical negative margins — kept verbatim, not on the scale
`-2` (13 screens / 14 uses) · `-6` (2 / 2) · `-12` (1 / 1) · `-14` (1 / 1). These are optical compensations; they are not spacing decisions and must not be snapped to steps.

---

## 5. Size Tokens

Fixed element dimensions. **Never subject to the spacing scale** — snapping these breaks interaction. Named by the component that owns them.

| token | value | evidence |
|---|---|---|
| `size.tapTarget` | 44 | 26 screens / 79 uses — icon buttons, row controls. The minimum hit area |
| `size.button.primary` | 56 | 17 screens — full-width primary button height |
| `size.button.compact` | 40 | 10 screens — inline buttons ("Add", "Save") |
| `size.button.small` | 36 | 2 screens ("Mark all read", "Replace") — below threshold, recorded for reference |
| `size.control.row` | 52 | 12 screens / 58 uses — rating stars, row-level controls |
| `size.field.height` | 46 | 5 screens — form field height / product thumbnail |
| `size.thumbnail.list` | 66 | 2 screens (2a, 2b) — below threshold |
| `size.avatar` | 88 | 1 screen (6d) — below threshold |
| `size.tabBar.height` | 60 | 6 screens / 40 uses |
| `size.badge.numeral` | 22 | 7 screens / 20 uses — numbered step badges, checkboxes |
| `size.checkbox` | 24 | 3 screens / 22 uses |
| `size.weekday.column` | 68 | 6 screens |
| `size.axis.rail` | 20 | 6 screens / 26 uses |
| `size.axis.needle` | `{ w: 12, h: 30 }` | 6 screens |
| `size.meter.track` | 4 | 2 screens — `beanFreshness` height |
| `size.marker.line` | `{ w: 2, h: 14 }` | marker / caret line width |
| `size.dot.bullet` | 6 | 4 screens / 31 uses — square section bullets |
| `size.sheet.handle` | `{ w: 56, h: 5 }` | 2 screens — bottom-sheet drag handle |

**`size.tapTarget` (44) and the `44px` root padding on 6a are different things that happen to share a number.** The latter is an exception in `exceptions.md`. Never unify them.

---

## 6. Icon Tokens

Stroke width is **inversely correlated with size** in the data (14→3.4, 16→2.6, 18→2.2, 22→1.8), so size and stroke are one composite token, never two scales. 29 observed pairs collapse to 5.

| token | size | strokeWidth | absorbed pairs | reach |
|---|---|---|---|---|
| `icon.xs` | 14 | 3.4 | 13/3.4, 14/3.2, 14/3, 14/2.6, 14/2.4 | 24 uses |
| `icon.sm` | 16 | 2.6 | 17/2.6, 17/2.2, 16/2.4, 16/2.2, 16/2, 16/3, 15/2.6, 15/2.2, 15/2 | 21 uses |
| `icon.md` | 18 | 2.2 | 18/2.4, 18/2.6, 20/2.2, 20/2.4, 20/2.8, 20/2, 19/2.2 | 97 uses — the default |
| `icon.lg` | 22 | 1.8 | 24/1.8, 22/2, 22/2.4 | 9 uses |
| `icon.xl` | 38 | 2.0 | 38/2 | 8 uses |

Icons are stroke-based and take `currentColor`. `icon.xl` widens the stroke back to 2.0 because it is a decorative large glyph, not a UI control.

**Fill icons are a separate system** — no stroke width, fixed colour, and in practice one job:
| token | size | colour | reach |
|---|---|---|---|
| `icon.fill.sm` | 14 | `color.icon.rating` | 17 uses — rating stars |
| `icon.fill.xl` | 38 | `color.icon.rating` | 7 uses — hero rating star |

*Correction (2026-10-04)*: fill glyphs have a second job. The tab bar's icons are also fills; their colours live in the component anatomy (`component.tabBar.icon`, §2 C), not in `icon.fill`. The extraction missed them, which is why this section originally said "one job".

Three 16px fill icons in 3b use other colours and are true exceptions (`exceptions.md`).

---

## 7. Shadows

All hard: blur 0, isotropic offset, single ink. Offset **scales with the element**, so this is a rule rather than three loose values.

| token | value | rule | reach |
|---|---|---|---|
| `shadow.control` | `3px 3px 0` `color.text.primary` | inline controls, 40–48px tall | 3 uses |
| `shadow.floating` | `4px 4px 0` `color.text.primary` | width-flexible or floating elements (auto-width buttons, the 90%-wide tab bar) | 10 uses |
| `shadow.primary` | `5px 5px 0` `color.text.primary` | full-width primary buttons (h56, w100%) | 13 uses |
| `state.error.shadow` | `4px 4px 0` `#9E5202` | error state (5d) **A** | 3 uses |

**RN implementation note**: a blur-0 isotropic hard shadow cannot be reproduced with standard RN shadow props — iOS exposes `shadowOffset`/`shadowRadius`/`shadowOpacity`, Android only `elevation`, and `elevation` cannot express zero blur. **Decided (OQ-6)**: the base `HardShadow` component layers an ink-filled View the size of the element behind it, translated by the token's offset. Same result on both platforms, no new dependency. Tokens are unchanged.

---

## 8. Border & Dashed Semantics

`dashed` is a **semantic system, not decoration** (58 uses / 21 screens). It consistently means **"a surface that is not real content"** — never "draft".

| token | value | meaning | reach |
|---|---|---|---|
| `border.empty` | `2px dashed` `color.border.strong` | an empty slot waiting to be filled — "Add a photo", "Add gear", "Add beans". Always a `<button>` | 10 uses / 10 screens |
| `border.empty.disabled` | `2px dashed` `color.border.muted` | the same slot when it cannot be actioned (5d), and the empty list frame (2a) | 2 uses |
| `divider.soft` | `1.5px dashed` `color.border.soft` | a secondary line inside a card, separating meta or a closing remark from the body | 24 uses |
| `border.track` | `1.5px dashed` `color.border.muted` | a measuring rail or placeholder frame — `axis.rail.readonly`, the search placeholder | 14 uses |
| `state.error.dashed` | `1.5px dashed` `#9E5202` | error emphasis (5d) **A** | 1 use |

**RN implementation note**: iOS cannot dash a single border side. Single-edge dashed lines (`divider.soft` and the like) render through the base `DashedRule` component, which clips a fully dashed box to its top edge. Full dashed frames (`border.empty`, the 5d error swatch) use `borderStyle: 'dashed'` directly.

---

## 9. Patterns — screen-level regularities

### Screen shell
Every screen is `layout.screen.top` (60) → content → `layout.screen.bottom` (34), with `layout.gutter` (22) as the only horizontal padding. The header block is title + optional right-aligned meta, closed by a `2px solid` bottom border. 6a is the one screen with a shallower top (44) — see `exceptions.md` and OQ-8.

**RN implementation note (base `ScreenFrame`, 2026-10-04)**: the source frames measure 60 / 34 from the device edge, so they already include the status bar and home indicator. On device: top = `max(safe-area top, layout.screen.top)` and bottom = `max(safe-area bottom, layout.screen.bottom)`. On notched iPhones the inset wins (e.g. 62 at the top on iPhone 16 Pro). On devices without a notch the design value wins. An optional leading control (the 5a close button) sits above the title at `gap.row`. The source's 10px header gap is an equidistant value the scale already absorbed, so it is not drift.

**Title-to-rule distance (2026-10-04)**: set by the header's bottom padding, `space.8`, not by line-box leftover. On iOS the title renders on Instrument Serif's natural box (§3.2), which ends at the descender line, 12.4 below the baseline. So baseline → rule = 12.4 + 8 = **20.4**, the source's distance (40px box + 14px padding).
- Measured on device for "Profile", "Home", "Record coffee" and a descender test string ("Typography"): nothing clips at the top or the bottom; descenders clear the rule by 11.7.
- Known remainder: the natural box also reserves 39.6 above the baseline, against CSS's 34.1. Title ink therefore sits about 5.5pt lower in the header than in the source, and the header is 5pt taller (52 + 8 against 41 + 14). Closing that would mean trimming the top of the line box. It is left open, not patched.

### Section rhythm
Section heading = a `size.dot.bullet` square (`marker.required` / `marker.optional`) + `label.eyebrow`, optionally a right-aligned status (`icon.xs` + `color.text.success`). Then `gap.section` to the content.

### List row
`[thumbnail] [content column] [right meta column]`. The right column stacks rating over date, right-aligned — dates and ratings align down the whole list because they live in a fixed-width column, not at the end of a text run. Content column: title (`title`) → chips (`badge.inline`) → provenance (`body.sm`) → tasting note (`body.sm`, `color.text.muted`).

### Card
`2px solid color.border.strong` on `color.surface.raised`, `inset.container`, internal groups separated by `gap.section`, meta separated by `divider.soft`. No radius, no shadow unless it is a control.

### Bottom sheet (2 uses: 2b, 3b)
`position: absolute`, pinned bottom, `color.surface.raised`, `2px solid` top border, `padding: 22 22 34`, a `size.sheet.handle` bar centred at the top with `-6` optical margin. Behind it: the page at `opacity: 0.45` plus `color.scrim`.

### Floating bar (2 uses: 8d, 6a — 6a is one screen shown in three scroll states; do not count it as three)
Differs from the sheet: **no scrim, no handle, and a gradient fade above it** (`color.fade.stop` → `color.surface.ground`, `layout.fade.top` = 30). Contains a `size.tabBar.height` (60) bar at 90% width with `shadow.floating`.

**As shipped in the shell (base `FooterNav`, 2026-10-04)**: the bar carries the tab bar (§2 C, `component.tabBar`) — Home · Records · [add] · Try next · Profile — on `color.surface.raised` with a `2px` ink border and `space.4` side padding.
- The floating form is used on every tab. 1b, 2a, 4a and 4b draw the same bar in flow at the end of the page; rebuilt tab screens must leave `layout.empty.block` of room under their content.
- Bottom padding follows the Screen shell note: `max(safe-area bottom, 34)`.
- The fade is a 30px band ending at the bar's top edge (`drift.md` D-11).
- Pressed darkens a slot's 60 × 40 (or 68 × 40) box to `state.pressed.surface`; the ink add square stays as it is. Touches in the fade band pass through to the content.

### Star rating (base `StarRating`)
Card per the Card pattern (`inset.container`, `gap.section`). Five `size.control.row` (52) tap targets spread with space-between. Filled star `icon.fill.xl`, empty star `icon.xl` stroke in `color.border.muted`; optional caption under `divider.soft`; 5d error state per `state.error.*`.

**Pressed**: a **48px disc** in `state.pressed.surface` behind the star. The 52px touch target is unchanged; only the visual changes. It is a circle because the star is a radial control (§1 Shape: press feedback follows the element's shape).
- **Optical offset: disc centre 1px *below* the 52px box centre** (disc top inset 3, left inset 2).
- Why down, not up: the star's mass does sit low relative to its own bounding box (area centroid y = 12.53 vs bbox centre 11.50 in the 24-unit viewBox). But the glyph is drawn centred on its viewBox (y = 12), not on its bbox, so the 52px box centre is already *above* the star's mass: centroid +0.84px, circumcentre +0.81px at 38px.
- Tuned by eye at 3× across −2…+2px: at +1 the top tip clears the disc edge by 7.17px and the bottom tips by 7.52px; at 0 the star reads low and at +2 it reads high.
- Implementation note: the glyph sits in its own View so it paints above the absolute disc on web as well as native.

### Buttons
Primary: `size.button.primary` tall, `color.action.bg`, `2px solid` outline, `shadow.primary`, `button.caps`. Secondary: same geometry on `color.surface.ground` with `color.text.primary`. Tertiary: no background, no border, `label.caps`.

Icon button (base `IconButton`): `size.tapTarget` square, `2px solid` `color.border.strong` on `color.surface.raised`, one `icon.md` glyph in `color.icon.default`, no shadow. It is the header close / back control on 3a–3f, 5a, 5b, 5d and 5e. 6d, 7a, 7b and 8e–8m use the same button with the `-2` optical nudge applied at the point of use. The `1.5px` `color.border.muted` frame (3b, 8e) and the `color.badge.bg.accent` fill (2a, 3b) are variants that have not been built.

Disabled (decided 2026-10-04, `gaps.md` 4 — not in the shipped screens): either variant drops to `color.surface.ground` fill, `color.border.muted` outline, `color.text.muted` label, and no shadow. This reuses the `border.empty.disabled` vocabulary from 5d (muted border = cannot be actioned) rather than introducing opacity, which the design uses only for the scrim backdrop.

---

## 10. Exceptions

Six true one-offs survive. Full records — verbatim source, context, all candidate distances, re-check trigger — are in `exceptions.md`.

1. `#DBCCC3` — skeleton row title inside the 2b sheet
2. Three 16px fill icons in 3b
3. `font-style: italic` + serif 20/1.4 — the 5b tasting-note field
4. `rotate(-4deg)` — the 6a "Home brewer" badge (vs `rotation.sticker` = −3)
5. Footer bottom padding 38 in 8c (19 other screens use 34)
6. Root top padding 44 in 6a (18 other screens use 60)

Also standing: `rotation.sticker = -3` (4 screens; RN wants the number, formatted as `'-3deg'` at use).

---

## 11. Open Questions

1. **`texture.dot` colour, pending a visual check.** `#E3D4CA` was merged into `#E4D6CC` at ΔE00 ≈ 0.6 (below the perceptual threshold, so treated as parallel drift). But a 1px dot is a tiny mark, and there is a chance the darker value was chosen so the dot stays visible. A real optical compensation would not differ by only 1 unit, hence the drift call. **Re-check by eye once it is rendered with `<Pattern>` in RN; if the dots look washed out, give `texture.dot` its own darker value.**
2. **Texture implementation is undecided.** RN has no `background-image` and no CSS gradients. Both textures must be rebuilt with react-native-svg `<Pattern>` (already a project dependency), which is why the tokens carry geometry rather than only colour.
3. **`beanFreshness.peakBand` changes colour by state and we cannot tell whether that is intent.** Interpretation (a): a window that has passed drops its saturation and yields attention to `elapsed`. Interpretation (b): drift — the band's colour was changed along with the state. The drinking window is a property of the bag, not of the state, which is what makes (b) plausible. **Decided by the third state (resting / too fresh): if peakBand is mint again there, (a); if it stays beige, (b).** Until then the state-dependent definition stands; do not unify or split.
4. **`beanFreshness` has no third state.** The peak band starts at 17% of the track, so days 0–4 (degassing) have no defined state. Logically a "resting" / "too fresh" state should exist. Not invented here.
5. **`state.archived` cannot be implemented as-is.** RN style has no `filter` (newer RN has experimental support; availability in this project is unverified). Four options, none eliminated: (a) keep separately desaturated colour values, (b) process on the image side, (c) react-native-svg `feColorMatrix`, (d) a translucent overlay.
6. ~~**Hard-shadow implementation undecided**~~ — **resolved 2026-10-04**: layered offset View (`HardShadow`). See §7.
7. **`motion.expand` implementation undecided.** CSS transitions do not exist in RN; reproduce with Animated/Reanimated as `Easing.bezier(0.22, 0.61, 0.36, 1)`. The token carries duration and four control points, never a CSS string.
8. **6a is the only screen with a shallow header** (root top 44 vs 60 elsewhere). Exception recorded, but it is also a structural fact: Profile's header is built differently. Confirm whether that is intended when the screen-shell template is specified.
9. **`margin.container` is not unified anywhere in the product.** Every other spacing role converged on a two-axis default; this one's mode represents only 20% of 66 uses. Layout is built from padding and gap, and margin appears to be used for ad-hoc nudges. **When specifying components, check each margin use individually for whether it is needed at all.**
10. **`3px` and `7px` belong to no role** — they spread thinly across 5 and 7 axes (157 uses total) and are likely undifferentiated micro-adjustments. Review whether existing defaults can replace them.
11. **Finding, not a gap: there is only one hairline divider tier** (`#E4D6CC` / `#D8C9BF` at 1.5px). This matches border width being binary and border style being binary — deliberate restraint. If stronger separation is ever needed, use a `2px` box outline rather than adding a hairline tier.
12. **The active-day underline in the weekday strip is unimplemented.** The date numerals carry `border-bottom: 2px solid transparent`, and the current day is distinguished only by ink colour (`color.text.primary` vs `color.text.muted`). Decide whether the underline should render.
13. **Only 3 chips in the entire product are tappable**, and the sort chips in 3f and the range chips in 2b — which read as controls — are plain `<span>`s with no pointer affordance and no selected state. Confirm which chips are meant to be interactive.
14. **CJK text loses its weight.** Archivo has no CJK glyphs, so ja/zh fall back to the system font. Because RN selects weight by face (`Archivo_700Bold`) rather than by `fontWeight`, the fallback renders at regular weight — a bold `title` in Japanese looks like `body`. Observed on web in the dev harness; confirm on iOS/Android.
    **Decided direction — deferred to V1.1, do not re-decide**: extend the §3.2 mapping from (family, weight) to **(family, weight, lang)**. On **iOS**, ja / zh resolve to explicit per-weight system families — Hiragino Sans for ja, PingFang SC for zh — named per weight rather than relying on `fontWeight` (exact face names to be verified when implemented). On **Android**, ship a **Noto Sans CJK subset** per weight, loaded through the same `fontAssets` path. Not adopted: passing `fontWeight` alongside the Latin face (risks synthetic bold on Archivo).
    **Batched with it**: `label.eyebrow`'s letter spacing (1.6) is tuned for Latin capitals and is wrong for CJK. It is fixed in the same V1.1 i18n pass, most likely as a per-lang value through the same mapping. No change before then.
    **Also batched — CJK chip height (found 2026-10-04 in device review)**: zh chips render taller than ja because of font metrics, not layout. At 12px, PingFang SC's line box is 17px (ascent 13 / descent 4, about 1.4em) against Hiragino Sans's 12px (11 / 1, about 1.0em). The ink is about 11px in both, so zh carries roughly 3px of extra empty line box above and below the glyphs. A second effect makes it uneven within a row: Hiragino Sans has no simplified glyphs such as 师, so on a device that falls back to Hiragino, 咖啡师 mixes in PingFang and gets a taller line box than its row-mates. The layout half is fixed (chips centre their label, `SegmentedControl`). The metric gap is left to the (family, weight, lang) mapping, which resolves zh to PingFang for the whole label. Any per-lang vertical tuning belongs to that mapping, not to per-language padding overrides in components.

---

## 12. Changelog

One line per change to this document or `tokens.ts`, with the reason.

- 2026-10-04 — §3.1 added: truncation policy (`name` 2 / `meta` 1 / `note` 3 / `none`), landed in the base `Text` component because user-input text had no defined behaviour (`gaps.md` 1).
- 2026-10-04 — OQ-14 added: CJK fallback renders at regular weight, found while validating §3.1 with ja/zh strings.
- 2026-10-04 — OQ-6 resolved: hard shadows render as an offset ink View behind the element, because Android `elevation` cannot express blur 0.
- 2026-10-04 — §9 Buttons: disabled state defined from existing tokens (ground / border.muted / text.muted, no shadow), because the base Button needed one and no screen designs it.
- 2026-10-04 — Copy: maker chip "Ready-to-drink" → "Packaged" (ja 市販品, zh 市售), because the axis is who made it, not the container. Recorded in `i18n-notes.md`; the three chips now fit one line at 390 / 393pt.
- 2026-10-04 — §3.1 truncation policy confirmed by design; `gaps.md` 1 marked resolved.
- 2026-10-04 — `drift.md` D-10: the 52 / 50px secondary buttons in 3b, 5a and 1b are drift. Secondary is 56px with `button.caps` per §9, because it shares the primary's geometry.
- 2026-10-04 — StarRating card padding confirmed as `inset.container` (14/16), per the §9 Card pattern. The 18/16 in 5a / 5d is not an exception.
- 2026-10-04 — §3.2 added: documents the (family, weight) → face mapping in `src/theme/fonts.js`, because it is a system component that OQ-14 extends, not a TokenSheet detail.
- 2026-10-04 — OQ-14 direction fixed for V1.1: (family, weight, lang) mapping, Hiragino / PingFang per-weight on iOS, Noto Sans CJK subset on Android. `label.eyebrow` CJK letter spacing is batched into the same pass. Recorded so it is not re-decided.
- 2026-10-04 — Findability: `HardShadow` (§7) and `DashedRule` (§8) are base primitives that shipped inside the StarRating commit (`e6f5779`), not in commits of their own. The history is left as is.
- 2026-10-04 — **Token added: `state.pressed.surface` (alias of `surface.muted`) and `state.pressed.action` (`#05639C`), plus the §1 Pressed Hard Rule.** Pressed appears in every tappable component, which clears the rule of two. It darkens the fill rather than lowering opacity, because opacity washes out `HardShadow` and the ink borders on the warm ground. `surface.muted` was chosen over `surface.sunken` because sunken sits only ΔE00 3.16 below ground.
- 2026-10-04 — §9: IconButton pattern documented and the base component built. The pressed Hard Rule lists it as a target and it did not exist yet; the header close / back button is the variant used across the 3x, 5x, 6d, 7x and 8x screens.
- 2026-10-04 — `SegmentedControl` chips centre their label (`justifyContent` / `alignItems: center`), because a row stretches every chip to its tallest. A chip with a shorter line box kept its text at the top, with the surplus below — the zh "more padding below" seen in device review. No per-language padding; the PingFang / Hiragino metric gap goes to OQ-14.
- 2026-10-04 — StarRating pressed fill changed from the 52px square to a 48px disc, 1px below the box centre (§9 Star rating). It is the product's one circle, recorded as `exceptions.md` E-7 rather than a token because it has a single use. The pressed Hard Rule is unchanged.
- 2026-10-04 — **§1 Shape rewritten; E-7 removed.** The old rule ("no border radius, anywhere") conflated container geometry with press feedback. It now reads: containers are square-cornered, and press feedback follows the shape of the element it sits behind (square for rectangular controls, circle for radial ones). Narrowing the rule removes the need for an exception, so E-7 is deleted from `exceptions.md` and its §1 / §10 pointers are dropped. The StarRating disc and its +1px offset stay in §9 as an implementation note.
- 2026-10-04 — Loading state: deliberately not needed, rather than deferred.
- 2026-10-04 — **Token added: `component.tabBar`** (slot 60 × 40, add slot 68 × 40, icon colours `#9B8F87` inactive / `#C6BBD3` calendar accent, plus aliases). Rebuilding the bottom bar found that the extraction had missed both icon colours, because the source writes them in lowercase hex; they are the only lowercase values on in-scope screens. Both clear the ≥3-screen threshold (6 and 5 screens), so they become tokens instead of being snapped to the nearest existing colour. §2 C, §6 correction, `drift.md` "not drift".
- 2026-10-04 — `drift.md` D-11: the 6a / 8d fade goes solid at 40% of its wrapper; the shell ships the token's 30px band ending at the bar edge.
- 2026-10-04 — Shell moved to tokens: `ScreenFrame`, `FooterNav` (rebuilt to the §9 floating bar), tab icons, the Record overlay (now `motion.expand`), `AppShell`. The old `theme/token.ts` was deleted. Screens not yet rebuilt render a plain placeholder; their retired files stay on disk, unreferenced. §9 notes the safe-area rule for 60 / 34. Saves write to local SQLite and are instant. Loading TODOs removed; revisit when Step 5 adds real async (MapKit, barcode lookup).
- 2026-10-04 — §3.2 platform note + iOS adjustment: on iOS a `lineHeight` below the face's natural line box is dropped. Measured on device: iOS takes the whole deficit from above the baseline and clips to the frame (the "f" in `display.lg` was cut flat), while CSS splits it evenly. The tokens are unchanged, because they are correct in CSS terms. The header's title-to-rule distance is now a container padding (`space.8` → baseline-to-rule 20.4, the source's value) instead of line-box leftover (§9).
