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
- **No border radius, anywhere.** `border-radius` appears **0 times across all 30 screens**. Every corner in this product is square.
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

### 3.1 Truncation policy (resolves `gaps.md` item 1 in code — pending design review)

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

**RN implementation note**: a blur-0 isotropic hard shadow probably cannot be reproduced with standard RN shadow props — iOS exposes `shadowOffset`/`shadowRadius`/`shadowOpacity`, Android only `elevation`, and `elevation` cannot express zero blur. Options: an absolutely-positioned View layered behind, or drawing via react-native-svg. See OQ-6; tokens are unchanged.

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

---

## 9. Patterns — screen-level regularities

### Screen shell
Every screen is `layout.screen.top` (60) → content → `layout.screen.bottom` (34), with `layout.gutter` (22) as the only horizontal padding. The header block is title + optional right-aligned meta, closed by a `2px solid` bottom border. 6a is the one screen with a shallower top (44) — see `exceptions.md` and OQ-8.

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

### Buttons
Primary: `size.button.primary` tall, `color.action.bg`, `2px solid` outline, `shadow.primary`, `button.caps`. Secondary: same geometry on `color.surface.ground` with `color.text.primary`. Tertiary: no background, no border, `label.caps`.

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
6. **Hard-shadow implementation undecided** — see §7.
7. **`motion.expand` implementation undecided.** CSS transitions do not exist in RN; reproduce with Animated/Reanimated as `Easing.bezier(0.22, 0.61, 0.36, 1)`. The token carries duration and four control points, never a CSS string.
8. **6a is the only screen with a shallow header** (root top 44 vs 60 elsewhere). Exception recorded, but it is also a structural fact: Profile's header is built differently. Confirm whether that is intended when the screen-shell template is specified.
9. **`margin.container` is not unified anywhere in the product.** Every other spacing role converged on a two-axis default; this one's mode represents only 20% of 66 uses. Layout is built from padding and gap, and margin appears to be used for ad-hoc nudges. **When specifying components, check each margin use individually for whether it is needed at all.**
10. **`3px` and `7px` belong to no role** — they spread thinly across 5 and 7 axes (157 uses total) and are likely undifferentiated micro-adjustments. Review whether existing defaults can replace them.
11. **Finding, not a gap: there is only one hairline divider tier** (`#E4D6CC` / `#D8C9BF` at 1.5px). This matches border width being binary and border style being binary — deliberate restraint. If stronger separation is ever needed, use a `2px` box outline rather than adding a hairline tier.
12. **The active-day underline in the weekday strip is unimplemented.** The date numerals carry `border-bottom: 2px solid transparent`, and the current day is distinguished only by ink colour (`color.text.primary` vs `color.text.muted`). Decide whether the underline should render.
13. **Only 3 chips in the entire product are tappable**, and the sort chips in 3f and the range chips in 2b — which read as controls — are plain `<span>`s with no pointer affordance and no selected state. Confirm which chips are meant to be interactive.
14. **CJK text loses its weight.** Archivo has no CJK glyphs, so ja/zh fall back to the system font. Because RN selects weight by face (`Archivo_700Bold`) rather than by `fontWeight`, the fallback renders at regular weight — a bold `title` in Japanese looks like `body`. Observed on web in the dev harness; confirm on iOS/Android. Options: (a) pair Archivo with a CJK face per weight (e.g. Noto Sans JP/SC 500/600/700), (b) pass `fontWeight` alongside the face and accept possible synthetic bold on Latin. Neither is a token change until a CJK family is chosen.

---

## 12. Changelog

One line per change to this document or `tokens.ts`, with the reason.

- 2026-10-04 — §3.1 added: truncation policy (`name` 2 / `meta` 1 / `note` 3 / `none`), landed in the base `Text` component because user-input text had no defined behaviour (`gaps.md` 1).
- 2026-10-04 — OQ-14 added: CJK fallback renders at regular weight, found while validating §3.1 with ja/zh strings.
