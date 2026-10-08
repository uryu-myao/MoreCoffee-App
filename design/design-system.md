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
- **Two motion tokens, one easing (2026-10-06).** `motion.expand` (340ms) is for expanding and collapsing, and crossfades between states. `motion.press` (100ms, same bezier) is **only** for press feedback (`state.pressed.scale` in and out): 340ms reads as lag under a finger. Never swap them.

### Pressed (added 2026-10-04, revised 2026-10-06 — not in the shipped screens, which have 0 `:active`)
- **Press feedback depends on whether the element has a surface. With a surface (a fill, frame or box), the fill darkens. Without one (a bare glyph), the element scales. In neither case does opacity change.** Opacity would wash out the hard shadow and the 2px ink borders, and reads muddy against the warm ground.
- **Surface-less → scale** to `state.pressed.scale` (0.88) over `motion.press` (100ms), back to 1 on release. 0.88 because ~0.95 is not perceptible on a 20–24px glyph. **Only the visual scales: the touch area does not**, so it stays at least `size.tapTarget` (44) while the glyph shrinks. First use: the bottom-bar tab icons (§9).
- Light fills — `color.surface.raised`, `color.surface.ground`, or transparent over a raised card — go to **`state.pressed.surface`** (alias of `color.surface.muted`). The action fill `color.action.bg` goes to **`state.pressed.action`**.
- **Surface → darken.** **Nothing else changes**: border, label/ink, glyph and `HardShadow` stay as they are. The change is instant (no motion).
- A fill that is already ink (the selected chip) has no darker tier and does not respond. Pressing it is a no-op anyway. Disabled controls do not respond.
- Darken applies to: Button, SegmentedControl options, FieldRow, StarRating stars, IconButton, and the bottom bar's + (an ink square, so no darker tier: no visual change). Scale applies to: the bottom-bar tab icons. Every tappable component added later takes one of the two by this test; its Step 4 component spec says which.
- **Size decides too (2026-10-07): under 44pt, scale; 44pt and up, darken.**
  - Some parts have a surface but are too small for its change to be seen, because the finger covers it: the taste axis needle (12 × 32), checkboxes (24), the avatar edit button (34).
  - So the press feedback depends not only on whether the element has a surface, but on whether that change can be perceived.
  - Size is the objective test. The five existing components are all 44pt or more and keep darkening.
  - The axis needle is under 44: it presses by scale (0.88 over `motion.press`). Its touch band and travel do not shrink.
- **Haptics follow the gesture, not the component.** A discrete press gives a **light impact**: today only the bottom bar does; Button, FieldRow and the other pressables have no haptic yet and take light impact when their Step 4 spec applies this rule. Sweeping across a continuous set of options gives **selection** (StarRating). Selection is the API built for stepping through values, and a light impact would make changing stars feel duller. Do not unify them.

### Header collapse (added 2026-10-06)
- **Controls never fade and are never disabled by the collapse.** Back, close, save and other functional controls stay fully visible and pressable throughout. **Only information fades**: the eyebrow, the date / time, and meta labels.
- Why: a control that is invisible but pressable, or one that should be pressable but has gone, both break operability. The collapse is a side effect of scrolling, not a sign that the user has given up on an action: being unable to go back after scrolling is plainly wrong.
- Precedent: Record coffee's close button does not scale. The same principle covers 5b's back button above the title, which stays where it is while the title shrinks beneath it (§9 Header collapse).

### Naming state tokens (added 2026-10-06)
- **Name a state token for what the state means, not for how it was used on the screen where it was first found.**
- **Before naming, check every screen that uses the same value.**
- **If the name and the reality disagree, fix the name, not the comment.**
- Why: the same mistake was made three times. `axis.rail.readonly / editable` and the interim `unset / set` were both read off one screen. `border.empty.disabled` was named for 5d and is also used on 2a, where nothing can be pressed. A comment that contradicts its name loses to the name.

### Colour roles: blue vs ink (added 2026-10-07)
- **Blue = this is in force now**: the primary action, the active tab, a switch that is on.
- **Ink = the user chose this**: tags, checkboxes, weekdays, single-select options.
- **Do not mix them.**
- Grounding: the mocks' own note (above 2a) says "blue only for the primary action and the active tab". A switch that is on is in force in the same sense as the active tab; it is not "chosen".
- **Boundary**: a checkbox in a settings list is *chosen*, so ink. A tick alone puts nothing in force; it takes effect only on save or apply.
- Consequences:
  - all 8 switches are on = blue by rule, not drift (3e's ink is D-20);
  - 8c's blue checkbox is drift (D-19).

### Focus (added 2026-10-07)
- **One treatment for every focusable element, no branching**: a **2px** (`shape.borderWidth.box`) square frame in **`color.caret`** (`#067BC2`), drawn **outside** the element with a **`space.2`** gap.
  - It never changes the element's own border or fill: those already carry meaning (selected = ink, dashed = provenance / add entry, error = brown).
  - It is drawn above `HardShadow`.
  - A bare glyph (a tab icon) is framed by its visual box (`component.tabBar.slot`), or by its 44pt target if smaller.
- Why no branch, unlike Pressed: pressed branches because surface vs no surface physically changes what can be drawn. A frame drawn outside works the same either way.
- `color.caret` is already "the only focus expression in the product", so this extends that role with no new value.
- Contrast (non-text, needs 3:1): 3.93 on ground, 4.45 on raised, **3.20 on `state.pressed.surface`**. The last case is focus + press at once (keyboard focus, then Enter). Check it on device.
- **Shown only for non-touch focus**: keyboard, D-pad, switch control. Never after a finger press. Never for VoiceOver / TalkBack, which draw their own cursor.
- **Implementability (RN 0.86, checked in source)**:
  - Android: `Pressable` `focusable` + `onFocus` / `onBlur` fire for keyboard / D-pad focus and not in touch mode, so the rule can be implemented as written.
  - iOS (not tvOS): a focusable view can take hardware-keyboard focus (Full Keyboard Access, iPadOS), but RN fires `onFocus` only on tvOS, so the app cannot draw this frame.
- **Where it applies (2026-10-07)**:
  - **On iOS the OS draws its own focus indicator; the app does not draw one.** That covers hardware-keyboard focus, VoiceOver and Switch Control.
  - The rule takes effect on Android and on a future web build.
  - If iOS ever needs this frame, it takes a native module. Not built in V1.
- MoreCoffee ships on iOS only, so today the rule applies nowhere. It is kept because the conclusion is **"focus is delegated to the OS"**, not "focus is missing": the indicator exists, the OS owns it.
- To check once on a device with an external keyboard: how iOS's own indicator looks against this design. If it clashes, report it; that is when a native module gets weighed.

### Tap affordance (added 2026-10-07)
- **A pressable option looks like an option**:
  - an outline (1.5 `border.muted`) when unselected; an ink fill when selected (or 5b's accent tint + accent border for multi-select);
  - **44pt tall** (`inset.control`);
  - **always in a set**: two or more options, with a selected member or a count.
- **A label that cannot be pressed looks like a Badge**: tinted fill, no `border.muted` outline, badge sizes.
- **Except one display form, the attribute tag** (6a "Acidity high", 8d "Blackcurrant"): a 1.5 `border.muted` outline on no fill, padding 7/9, 11px label. It is consistent across both screens (5 uses, identical values) and never pressable on its own. On 6a it sits inside the pressable Taste DNA card, which is the target (→ 8f); on 8d it describes a suggestion and leads nowhere.
- **So the outline alone does not mean pressable; height does.** A pressable option is 44pt. The attribute tag is about 29.
  - In the mocks the two differ by fill (raised vs none) and size (13 vs 11px); in the build the 44pt height is the decisive cue.
  - The pressable word tags (8f, 8h, about 34 in the mock) are built at 44.
- **Word tags are pressable**:
  - 8h says so on screen: "Tap a word to rename it everywhere, or merge it into another."
  - 8f's "juicy 9" leads to 8l, whose heading is "9 cups say "juicy"" (the counts match).
  - Settled 2026-10-07 together with 6a / 8d, as one decision.
- **Every pressable carries its screen-reader role and state.** Role: button, radio, checkbox, switch or tab. State: selected, checked or disabled. This is the affordance that does not depend on sight (`gaps.md` item 11).
- A switch's shape (track + knob) explains itself; it only needs its role.
- The weekday selector (8i) takes the option form, so 39 → 44.
- `cursor:pointer` is a web hover cue; native apps have no cursor. On web, `Pressable` sets it itself.

### Selection limit (added 2026-10-07)
- **Applies to every capped multi-select**: 3a (8), 5b (5), 8c (3). The selection logic is shared. An uncapped set (8i's weekdays) runs through the same logic with no limit: it never locks and **shows no count** (never "∞ of ∞").
- **At the limit, the unselected options lock.**
  - They take the disabled look: label `color.text.muted`, checkbox border `color.border.muted`. 5b's Search opener locks too.
  - Locked options do not respond: no press feedback, no haptic (§1 Pressed: disabled does not respond).
  - To a screen reader they are disabled, with the hint "Limit reached — deselect one to choose another".
- **Selected options stay live.** Deselecting one unlocks the rest at once.
- **The count explains it**: at the limit it turns `color.text.accent` ("5 of 5", "3 of 3 picked", "8 / 8 Selected").
- **A light impact at the moment the limit is reached, once.** "Now locked" reaches the user wherever they are looking. A press on a locked option stays silent.
- Why lock rather than allow the tap and then refuse: an option that looks pressable but will not select is a small failure each time.

### Disabled options (added 2026-10-07)
- **One disabled look for every option in a set**:
  - label `color.text.muted`;
  - frame / box `color.border.muted`;
  - no press feedback, no haptic.
- **Applies to**: single-select chips, flavour chips, checkbox lists, checkboxes, the weekday selector. The selection limit uses this same look; it was defined there first and is reused, not duplicated.
- **The look is the same, but there are two reasons**:
  1. **The limit is reached** (deselecting another brings it back). The count explains it.
  2. **This option itself cannot be chosen now.** Nothing on screen explains it, so the screen reader must state the reason. A visible way to explain it is still missing (`gaps.md` 12).

### Animation systems (added 2026-10-07)
- **Existing scroll-linked animation stays on Animated** (native driver): the header collapse, the bottom bar's hide / reveal, the tab pager's indicator, press scale, the sheet slide.
- **Gestures that follow the finger use Reanimated + gesture-handler** on the UI thread. The taste axis drag is the first.
- **Do not rewrite the existing ones.** Two systems live side by side, each where it is used.

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
| `state.pressed.scale` | `0.88` | surface-less elements (bare glyphs) | Added 2026-10-06. ~0.95 is imperceptible on a 20–24px line or fill glyph; 0.88 reads clearly (a 20px glyph becomes 17.6). Visual only: the touch area never scales |

### Texture — same value, two geometries
Colour was unified to `#E4D6CC`; the two textures differ in **geometry, not colour**. Two tokens sharing one value is intentional, so that texture density can be tuned without touching the border role.

| token | value | geometry (verbatim) | coverage |
|---|---|---|---|
| `texture.dot` | `#E4D6CC` | `radial-gradient(<color> 1px, transparent 1px)`, `background-size: 7px 7px`, default repeat | 16 screens |
| `texture.rule` | `#E4D6CC` | `repeating-linear-gradient(90deg, <color> 0 1.5px, transparent 1.5px 25%)` | 6 screens / 18 uses |

**Implemented (2026-10-05)**: `texture.dot` is the base `DotTexture`, a single react-native-svg `<Pattern>` with the 1px dot centred in its 7 × 7 tile. CSS `radial-gradient` centres by default; the token values are used as-is. `ScreenFrame` mounts it **fixed behind everything**, outside any ScrollView, so every screen inherits it, it never scrolls, and it never re-renders on scroll (it takes no props and is memoised). Opaque surfaces (cards, chips, field groups, the bottom bar, thumbnails) cover it, so dots show only on the page background. Verified on device: animated scroll of the Records list held 60 fps on the JS thread (worst frame 17.9 ms, simulator). Text crossing a dot: `text.muted` 5.46 → 4.45, `text.accent` 4.96 → 4.04, on 6.4% of the page (dot vs ground 1.23:1). `texture.rule` (the axis rails) is still unimplemented.

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
| `axis.rail.derived` | `1.5px dashed` `#C8BCB4` on `#F4EDEA` + `texture.rule` | a value the user did not enter for this cup: the computed profile (1b, 4a, 4b), history (5c), an axis not noted yet (5b) |
| `axis.rail.entered` | `2px solid` `#273D22` on `#FFFCFA` + `texture.rule` | a value the user decided, themselves, for this cup (5b's set axes) |
| `axis.needle` | fill `#E4D6CC`, border `#B3A69E`, `12 × 30` | |
| `axis.ghost` | border `#B3A69E`, `10 × 10`, transparent fill | previous value (5c) |
| `axis.delta` | `#B3A69E`, `2px` tall | movement since last value (5c) |

**Renamed 2026-10-06** (formerly `readonly` / `editable`; an interim `unset` / `set` was never shipped). The rail shows **where the value came from**:
- Solid means a value the user decided, themselves, for this cup. Dashed is everything else: computed profile values, history, and an axis not noted yet.
- It is **not about editability**: 5b holds both kinds side by side, all editable. It is **not about whether there is a value** either: 1b / 4a / 4b show values on dashed rails.

**Why this matters**: it carries one of MoreCoffee's core promises. Taste DNA is arithmetic on your own records, not a guess. The UI therefore has to let you tell, at a glance, what you put in from what came out of it. Solid / dashed is a statement of data provenance, not decoration: **do not unify them.**

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

**15 styles.** The original 14 all have ≥3 uses, and 13 of them have ≥3 screens. `text.inlineAction` is promoted as mechanism-bound (class A). `text.note` (2026-10-06) is promoted from `exceptions.md` E-3 because it now has a clear role: the tasting-note input.

### Serif (Instrument Serif)
| style | size | weight | lineHeight | replaces | reach |
|---|---|---|---|---|---|
| `display.lg` | 40 | 400 | 41 | 40/1, 40/1.02, 44/1.02, 44/0.8, 42/1.04, 38/1.06, 36/1.08, 34/1.08, 33/1.1 | 12 screens / 29 uses |
| `display.sm` | 30 | 400 | 31 | 30/1, 30/0.9, 30/1.1, 32/1, 31/1, 28/1, 27/1.1 | 14 screens / 25 uses |
| `numeral.hero` | 96 | 400 | 79 | 96/0.82 | 3 screens / 3 uses |
| `numeral.inline` | 22 | 400 | 22 | 22/1, 26/1, 24/1, 21/1, 19 | 10 screens / 33 uses |
| `text.note` | 20 **italic** | 400 | 28 | 20/1.4 italic (formerly E-3) | 1 screen / 1 use: the 5b "My words" input. Colour `color.text.muted`. The only italic; do not use italics elsewhere. Its `min-height: 84` stays local to the field |

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

**Platform note — no glyph baseline for Yoga on iOS (2026-10-05, measured on device)**: RN on iOS does not report a Text's glyph baseline to Yoga, so `alignItems: 'baseline'` aligns to the bottom of the text frame instead. Measured on `display.lg`: the true baseline was at 99.6 and the aligned box's bottom landed at 112.7. Do not rely on `baseline` alignment; it silently behaves like `flex-end`.

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
| `size.thumbnail.summary` | 40 | 5b — the one-cup summary row (added 2026-10-06). A different job from the list row's 66, so a separate size rather than a variant |
| `size.avatar` | 88 | 1 screen (6d) — below threshold |
| `size.tabBar.height` | 60 | 6 screens / 40 uses |
| `size.badge.numeral` | 22 | 7 screens / 20 uses — numbered step badges, checkboxes |
| `size.checkbox` | 24 | 3 screens / 22 uses |
| `size.weekday.column` | 68 | 6 screens |
| `size.axis.rail` | **28** (was 20, the mock; L3 + H1, 2026-10-08) | the slider's rail height |
| `size.axis.railWidth` | **260** | the slider's rail width, centred in its card (added 2026-10-08 at 240; 260 once the pole labels went to `label.caps`) |
| `size.axis.handle` | `{ w: 16, h: 40 }` | the slider's handle (added 2026-10-08); stops 56pt apart |
| `size.axis.needle` | `{ w: 12, h: 30 }` | 6 screens; now only the display axis, until AxisReadout replaces it |
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

`dashed` is a **semantic system, not decoration** (58 uses / 21 screens). It never means "draft". It has **two uses, written separately** (revised 2026-10-06; formerly one rule, "a surface that is not real content", which fits empty slots but not the axis rail):
- **An entry for adding something (nothing in it yet)**: `border.addSlot`, `border.addSlot.inert`.
- **The value shown is not one the user entered**: `axis.rail.derived` (§2 B).

What they share is "not something the user has settled". They are still two uses, not one rule; do not merge them.

**Operable or not, by colour (moved from §1, 2026-10-07)**: a **dark dashed** frame (`border.addSlot`, #6B5D55) can be pressed; a **muted dashed** frame (`border.addSlot.inert`, `border.muted`) cannot. The line style does not decide it. 5d's error dashes mark a field that is still pressable. (The axes no longer use dashes: the slider has one solid rail, and the display axis becomes AxisReadout.)

| token | value | meaning | reach |
|---|---|---|---|
| `border.addSlot` | `2px dashed` #6B5D55 (`icon.muted`'s value; ink until 2026-10-07, lightened two steps on review: ΔE00 32.6 from `.inert`, 5.46:1 on ground, 6.19:1 on raised) | an entry for adding something, and pressable — the empty slots ("Add a photo", "Add gear", "Add beans") and 5b's "Search" opener. Renamed 2026-10-07 from `border.empty`: "an entry you can add through" is closer to what it is than "empty" | 10 uses / 10 screens + 5b |
| `border.addSlot.inert` | `2px dashed` `color.border.muted` | an empty slot that cannot be pressed now (5d's blocked add button), or is not a thing to press at all (2a's empty list frame). Renamed 2026-10-06 from `border.empty.disabled` (misnamed the 2a frame), then 2026-10-07 to `addSlot.inert` with its parent | 2 uses |
| `divider.soft` | `1.5px dashed` `color.border.soft` | a secondary line inside a card, separating meta or a closing remark from the body | 24 uses |
| `border.track` | `1.5px dashed` `color.border.muted` | the axis rail of a value the user did not enter: `axis.rail.derived` only. Since 2026-10-07 it no longer covers the search placeholder, which moved to `border.addSlot` (drift D-21) | 14 uses |
| `state.error.dashed` | `1.5px dashed` `#9E5202` | error emphasis (5d) **A** | 1 use |

**RN implementation note**: iOS cannot dash a single border side. Single-edge dashed lines (`divider.soft` and the like) render through the base `DashedRule` component, which clips a fully dashed box to its top edge. Full dashed frames (`border.empty`, the 5d error swatch) use `borderStyle: 'dashed'` directly.

---

## 9. Patterns — screen-level regularities

### Screen shell
Every screen is `layout.screen.top` (60) → content → `layout.screen.bottom` (34), with `layout.gutter` (22) as the only horizontal padding. The header block is title + optional right-aligned meta, closed by a `2px solid` bottom border. 6a is the one screen with a shallower top (44) — see `exceptions.md` and OQ-8.

**RN implementation note (base `ScreenFrame`, 2026-10-04)**: the source frames measure 60 / 34 from the device edge, so they already include the status bar and home indicator. On device: top = `max(safe-area top, layout.screen.top)` and bottom = `max(safe-area bottom, layout.screen.bottom)`. On notched iPhones the inset wins (e.g. 62 at the top on iPhone 16 Pro). On devices without a notch the design value wins. An optional leading control (the 5a close button) sits above the title at `gap.row`. The source's 10px header gap is an equidistant value the scale already absorbed, so it is not drift.

**Title-to-rule distance (2026-10-04)**: set by the header's bottom padding, `space.8`, not by line-box leftover. On iOS the title renders on Instrument Serif's natural box (§3.2), which ends at the descender line, 12.4 below the baseline. So baseline → rule = 12.4 + 8 = **20.4**, the source's distance (40px box + 14px padding).
- Measured on device for "Profile", "Home", "Record coffee" and a descender test string ("Typography"): nothing clips at the top or the bottom; descenders clear the rule by 11.7.
- **Resolved — accepted platform difference, do not re-open (2026-10-04)**: on iOS, title ink sits about 5.5pt lower in the header than in the source, and the header is 5pt taller (52 + 8 against 41 + 14). The spec was drawn under CSS line-box rules, which place the baseline 34.1 below the box top. iOS's natural box places it 39.6 below. Closing the gap would mean trimming the top of the line box, which is exactly the clipping bug this fix removed. The offset is the correct result on iOS, not a defect.

**Header meta, page scroll, footer (base `ScreenFrame`, 2026-10-05, first used by Record coffee)**:
- **Meta**: the optional right-aligned header meta (5a's date / time) sits at the foot of the header, `space.14` from the title column. Its bottom padding is `space.12`. The source sets the meta 6 above a header foot that was itself 14 above the rule, 20 in all. With the header padding now 8, the meta takes 12 to stay 20 above the rule, which lands its baseline 2.1 above the title's, as in the source. Title-to-rule geometry is unchanged.
- **Scroll** (revised 2026-10-06): with `scroll` the header is **pinned** and **collapses** as the page scrolls (Header collapse, below). The content scrolls beneath the rule. Superseded: the whole page scrolling with the header, as in 5a's `overflow: auto` root.
- **Footer**: the footer panel follows the body. It sits on `color.surface.raised` with a 2px ink top rule, padding `space.20` on top, `layout.gutter` at the sides and `max(safe-area bottom, layout.screen.bottom)` below, and stacks its children `gap.section` apart. Like the source's `margin-top: auto`, it sits at the bottom when the content is short and follows the content when it is long. The body keeps `gap.section` of bottom padding so the last block never touches the footer rule (the source's `auto` can collapse to 0).

**Compact header — current (revised 2026-10-07, on review)**: the Record sheet's header, shared by Log a cup (5a) and Tasting note (5b).
- **Layout**: the control and the title share **one row at the left**: Log a cup's close, Tasting note's back arrow, `space.12` before the title. The date / time (Log a cup) or "Step 2 of 2 / Skippable" (Tasting note) is the **standard right-aligned meta**: two lines, right-aligned, `gap.tight` apart, its foot 20 above the rule.
- **Geometry**: otherwise identical to the standard header. Title padding `space.8`, then the rule, and the same 122 to the rule's bottom on iPhone 14. The header ends on the title again, so the standard padding applies.
- **Vertical alignment**: the control is centred on the **title's cap band** (cap top to baseline), measured from the title's own text layout (`onTextLayout`: ascender, capHeight). It is not centred on the line box, and there is no fixed optical constant: the old +4 described a title + date column that no longer exists.
  - Measured on iPhone 14: control centre minus cap-band centre is 0 for "Log a cup" and 0.3 for "Tasting note".
  - It holds for any title and any font; for ja this replaces the per-language +4 / 0 split.
- **Collapse**:
  - the row rises to the safe-area top and the title scales (left-centre);
  - the control moves with the row and stays centred on the scaled cap band (never fades, §1);
  - the meta fades.
- Superseded (the 2026-10-05 layout below): the date / time under the title, and the header ending on it with `inset.container.v`.

**Compact header (base `ScreenFrame` `compact`, 2026-10-05, Record coffee) — superseded 2026-10-07**: an evaluation layout that reclaims vertical space and keeps the close control reachable.
- **Layout**: the close `IconButton` and the title column share one row, `space.12` apart (widened from `gap.row` on review). The title column is the `display.lg` title, then `gap.tight` (heading + caption are one meaning unit), then the date / time on one line (`label.caps`, `gap.row` between the two strings). The title stays at `display.lg`; ja / zh titles need its width budget.
- **Spacing to the rule**: `inset.container.v` (14). The header now ends on an Archivo line whose natural box matches the CSS line box, so the source's 14 applies as-is. The `space.8` of the stacked header only ever corrected for the serif title's 12.4 descent box.
- **Vertical alignment**: the button is centred on the title column's line boxes (title + `gap.tight` + date line), then shifted **+4pt down** as an optical correction. The column's visible ink starts 10.8 below its top (Instrument Serif's empty ascent above cap height) and ends 2.5 above its bottom (the date line's descent), so the box centre sits about 4 above the ink centre. Tuned by eye at 3× across 0…5 on the 390pt device: 0 and 3 read high, **4** reads centred, 5 reads low.
- **ja**: pure centring is correct for ja. Hiragino's 40pt line box leaves only 3.4 empty above the ink, and 0 reads centred. The fixed +4 makes ja read about 4pt low. Decided 2026-10-05: ship +4 (English is the only shipping locale) and move the per-language value into the OQ-14 mapping.
- **Pinned**: with `scroll`, the header (rule included) stays fixed and only the content below the rule scrolls. The ScrollView starts at the rule and clips there. Verified: header pixels are byte-identical between scroll positions.
- **Measured (390 × 844)**: header to the rule bottom 145.3 (the stacked header was 174); viewport below the rule 698.7, content 728, so it scrolls 29.3. The button + "Log a cup" take 184 of the 346pt row, with 162 clear. 「コーヒーを記録」 and 「コーヒーの記録」 are both 278 wide, fitting the 290 title budget with 12 clear.
- **Do not use `alignItems: 'baseline'`** for this row: see the §3.2 platform note.

### Section rhythm
Section heading = a `size.dot.bullet` square (`marker.required` / `marker.optional`) + `label.eyebrow`, optionally a right-aligned status (`icon.xs` + `color.text.success`). Then `gap.section` to the content.

**Stable height (base `SectionLabel`, 2026-10-05)**: the row reserves `icon.xs` height (14) whether or not a status is shown. The check glyph is taller than the eyebrow line box (about 11), so rows with SET / PRE-FILLED used to be 3pt taller, and a REQUIRED → SET or unrated → SET change pushed everything below it down. Measured on device: no status and all five statuses give 14; tapping the first star moves nothing. The status text is not shrunk; only a wrapping label can make the row taller.

### List row
`[thumbnail] [content column] [right meta column]`. The right column stacks rating over date, right-aligned — dates and ratings align down the whole list because they live in a fixed-width column, not at the end of a text run. Content column: title (`title`) → chips (`badge.inline`) → provenance (`body.sm`) → tasting note (`body.sm`, `color.text.muted`).

**Row order — one rule for all three modes (2026-10-06)**: **line 1 = what was drunk** (bean name / drink / product name), **line 2 = where it came from** (roaster / café / brand). Do not add a per-mode rule.

| mode | line 1 (`title`, `name` truncation, ≤ 2 lines) | line 2 (`source`, `meta` truncation, 1 line) |
|---|---|---|
| I made it | bean name | roaster · process |
| Barista | drink | café |
| Packaged | product name | brand |

- Why this direction: line 1 is the two-line heading slot. Putting a MapKit café name there (the longest and least predictable string) would put the most fragile text in the most prominent place. As line 2 it falls under the one-line rule below. A proposal to swap Barista / Packaged (source first) was withdrawn on review.
- I made it's line 2 stays "roaster · process". Changing it to the brew method waits for a brew-method input (`gaps.md` 10): without one the line would be empty.

**Long names (2026-10-06)**: café and brand names come from the user or from MapKit, whose official names run long. **The DB stores the full name; only display truncates.**
- Café and brand names: **1 line, tail ellipsis** (`meta`).
- Drink and product names: **at most 2 lines** (`name`).
- This holds wherever they appear (list rows, field values, pickers); the full name is reached on the detail screen.

### Card
`2px solid color.border.strong` on `color.surface.raised`, `inset.container`, internal groups separated by `gap.section`, meta separated by `divider.soft`. No radius, no shadow unless it is a control.

### Bottom sheet (2 uses: 2b, 3b)
`position: absolute`, pinned bottom, `color.surface.raised`, `2px solid` top border, `padding: 22 22 34`, a `size.sheet.handle` bar centred at the top with `-6` optical margin. Behind it: the page at `opacity: 0.45` plus `color.scrim`.

### Header eyebrow and stat (2026-10-06)
**Eyebrow**: every tab has a small label above its title, from its mock verbatim, in `label.eyebrow` `color.text.accent`, directly above the title (no gap, as in the mocks).

| tab | eyebrow | source |
|---|---|---|
| Home | MoreCoffee | 1b |
| Records | The archive | 2a |
| Try next | Based on {n} cups (the real count; "cup" at 1) | 8d ("Based on 147 cups") |
| Profile | Morecoffee (renders MORECOFFEE) | 6a |

1b and 2a set it at 11 / .22em, which `label.eyebrow` already folds in (11 / .04–.22em, §3), so this is not drift. Record coffee (5a) has none.

**Stat** (`ScreenFrame` `stat`; Records only, 2a's count): the numeral in `display.sm` `color.text.accent` (2a: Instrument Serif 30 / .9, folded into `display.sm`), with "Cups" in `label.eyebrow` `color.text.muted` `gap.tight` (4) below it, right-aligned.
- Its foot sits 20 above the rule, like `meta`.
- It is **out of flow** (absolute, bottom-right), so the header height stays the title column's. Every tab's rule then sits at the same height (131 on iPhone 14), and a swipe at rest shows no step. In flow, the numeral's iOS natural box (39) pushed Records' rule 3 lower.
- The value goes through `Intl.NumberFormat` (1,247). Right-aligned, its right edge stays at 367.3 whatever the digit count. Measured at 147, 1,247 and 12,470:
  - numeral left edge 338.3 / 319.7 / 306;
  - the title ends at 127.3, so 12,470 still clears it by 179 expanded and 205 collapsed.
  - Records is the only screen with a stat.

### Header collapse (2026-10-06)
Every `ScreenFrame` with `scroll`: Records (standard header), and Log a cup and Tasting note (compact header, in the Record sheet).

**Mechanism.** Transforms only, driven by the ScrollView offset through native-driver `Animated` interpolations. No `fontSize`, no `height`, nothing in JS per frame.
- The header box keeps its height. The **rule** is its own view and moves up by the collapse amount.
- The **ScrollView** starts under the rule and clips there, so content always disappears beneath the rule, never beside it. It moves up with the rule, and reaches past the screen bottom by the collapse distance to stay flush. The content inside moves back down by the same amount, so it still tracks the finger 1:1.
- A spacer the size of the collapse distance keeps the end of the content reachable.
- Collapse amount = scroll offset, clamped to [0, distance]. It is linear by construction: the rule stays glued to the content under the finger. Nothing settles after the finger lifts.

**Title.**
- Standard header: the title column scales around the **title's left baseline**. The baseline is measured from the text layout (`onTextLayout` ascender), not assumed. The column also moves up, so the collapsed title's box top lands on the safe-area top.
- Compact header (revised 2026-10-07): the title scales around its left-centre as the row rises to the safe-area top. The control does not scale (its 44pt target stays). It moves with the row and stays centred on the title's cap band, with the measured offset scaled with the title. The meta fades.

**What each part does (revised 2026-10-06, on review).**
- Serif display text **scales** with the collapse. The title goes 1 → 0.75.
- The stat's numeral **keeps its size** and slides to the collapsed title's baseline, so the collapsed header reads "Records … 147" at one size (30) on one baseline.
- Small labels **never scale**: ×0.75 would take them to 7.5–9px. They **fade out** over the first half of the collapse (`COLLAPSE.fadeBy` = 0.5) while riding the part they belong to. This covers the eyebrow (on the title's top), the stat's "Cups" (with the numeral) and Record coffee's date / time line (on the title's bottom).
- With its date gone, Record coffee's close button re-centres on the title alone, with the optical offset scaled (+4 → +4 × scale).

**Values — the tunables.** One tunable lives in code (`COLLAPSE` in `ScreenFrame.js`). The rest are derived:

| value | rule | iPhone 14 (390 × 844, safe-area top 47) |
|---|---|---|
| title scale | 1 → **`displaySm` / `displayLg` = 0.75** (40 → 30, the next display size; not a new value) | 1 → 0.75 |
| label fade | over the first `fadeBy` = **0.5** of the collapse distance, and always within the reachable distance (a page that scrolls only a little never rests with half-faded labels) | Records 0–18.5. Tasting note 0–10.5. Log a cup 0–6 |
| collapse distance = scroll distance | standard: (title-column bottom) − (safe-area top + 0.75 × title height). Compact: (row bottom) − (safe-area top + max(0.75 × title height, control height)). Capped at how far the page can scroll | Records **37**. Tasting note **21**. Log a cup **21**, capped at its **6** scroll (its header is 23 shorter now, so the page barely scrolls) |
| expanded height (to the rule's bottom) | eyebrow + title column; stat out of flow | Records **133** (every tab the same). Log a cup / Tasting note **122** |
| collapsed height | expanded − distance | Records **96**. Tasting note **101**. Log a cup **116** at its cap |

- On Dynamic Island phones (safe-area top 59, top padding 60) the same rule gives Records 1 + 13 = **14**: the title still shrinks, the header gives back less.
- **A page that cannot scroll never collapses** (`distance` = 0), even when bounced. A page that scrolls less than the full distance collapses only that far.

**Measured (iPhone 14 simulator, 2026-10-06 revision).**
- Records, offset −30 / 0 / 10 / 20 / 30 / 38 / 200:
  - rule 131 / 131 / 121 / 111 / 101 / 94 / 94;
  - title ink 81.3–111 → 74.3–101.7 → 67–92.7 → 59.7–83.3 → 54.7–77 (left edge 23 → 22.7);
  - numeral ink 65.3–87.3 → 62.7–84.3 → 60–81.7 → 57–79 → 55.3–77.3, right edge 367 throughout;
  - eyebrow 62–69 and "Cups" 102.3–109 at rest, gone by offset 10 (opacity under ~0.5 no longer reads).
  - Collapsed, the numeral baseline (77.3) sits on the title's (77).
  - −30 and 0 are identical, as are 38, 39, 40 and 200: nothing shifts at either end.
- Record coffee, offset −30 / 0 / 5 / 15 / 22 / 29 / 60:
  - rule 143.3 / 143.3 / 138.3 / 128.3 / 121.3 / 114.3 / 114;
  - close 76.7–120.7 → 73.3 → 66.3 → 61.3 → 56.3–100.3;
  - title ink 71–108 → 69.3–105 → 66–99.3 → 63.3–95 → 61–91.
  - Close centre minus title ink centre: 9.2 at rest (centred on title + date), 8.1 → 5.6 → 4.1 → 2.3 at the cap. It ends centred on the title alone (≈ 0.4 at full collapse, where 0 would be ink-centred).
  - −30 = 0 and 29 ≈ 60: no jump at either end.
- Frame timing while scrolling with the collapse active: 60 fps on the JS thread, worst frame 19.9 ms, none over 20 ms.

- Tasting note (5b, standard header with a fixed back button), offset −30 / 0 / 5 / 10 / 13 / 14 / 20 / 400:
  - back button 60–104 at every offset: never moves, never fades;
  - rule 172 / 172 / 167 / 162 / 159 / 159 / 159 / 159;
  - title ink 122.3–160 → 121.3–155.3 → 120.3–151 → 120–148, then unchanged;
  - "Step 2 of 2 / Skippable" gone by offset 5;
  - the first content line ("Ethiopia Guji") 16 under the rule through the collapse (190 → 177), then 1:1.
  - **Full collapse is only 13**: the title box top stops under the back button (104 + `gap.row`), not at the safe-area top, so only the title's shrink is given back. Scroll range 380.7, so it always completes.
  - "Skippable" fading loses no information: "Save without the note" stays at the foot of the page, and the intro line says untouched axes are left out.

- In the Record sheet (2026-10-07, after the move; `todo.md` T-1):
  - Tasting note, offset −30 / 0 / 7 / 14 / 21 / 22 / 200: rule 122 / 122 / 115 / 108 / 101 / 101 / 101. The first content line stays 16 under the rule (138 → 117), then 1:1. The control stays centred on the cap band (0.3 → 0.9). −30 = 0 and 21 = 200.
  - Log a cup, offset −30 / 0 / 3 / 6 / 50: rule 122 / 122 / 119 / 116 / 116; meta gone by 6.
  - Frame timing in the sheet (Tasting note): 60 fps, worst frame 18.6 ms, none over 20 ms.
  - The collapse works the same inside the modal.

**With the pager.** Each screen owns its collapse, tied to its own scroll position. Swiping away from a half-collapsed Records shows the next screen's own header (expanded for the placeholders). Coming back shows Records exactly as left. During the swipe the two rules sit at different heights across the seam (measured 107 vs 120 at a half swipe). This was judged right: a shared collapse would detach each header from its own content.

### Record sheet steps (2026-10-07; swipe revised 2026-10-08)
**Revised 2026-10-08: swipe back only from the left screen edge.**
- Three device logs showed the full-width swipe-back pager taking touches meant for the taste axes. Each time the axis received nothing, and blocking from the axis (`blocksExternalGesture`, hit areas) did not hold.
- Swipe back now starts only from a strip at the left edge, the iOS edge-swipe convention. No touch on the card (the axes start well inside it) can move the sheet.
- The steps are moved by one Reanimated value, not a ScrollView. The edge swipe follows the finger.
- Tuned from the next device log:
  - 22pt (the gutter) was too hard to hit: swipes starting at x 27–51 never began. Most that did begin failed on a little vertical drift (±10) or stopped short of 35%.
  - Now the strip is **`size.tapTarget` (44)** wide, vertical drift up to **±30** is tolerated (horizontal 10 still decides first), and it goes back past **25%** of the width or on a **300pt/s** flick.
  - The axes' touch bands start ~65pt in (77pt on a 430pt phone).
- The button push and the back arrow use **`motion.expand` again** (the push confirmed on device on 2026-10-07): no native scroll position has to be shared with the drag any more.
- The notes below describe the earlier pager.

The Record sheet (`AddCoffeeOverlay`) has two steps: Log a cup (5a), then Tasting note (5b) via "Add tasting note".
- Step 2 **pushes in from the right**; its back arrow, or a **swipe to the right** (added 2026-10-07), takes it back. No mock draws the step change; agreed on review.
- **Mechanism (revised 2026-10-07)**: the two steps are pages of a native horizontal paging ScrollView, like the tab pager. The swipe, its settle and the arbitration with each step's vertical scroll all run on the UI thread.
- Swiping is enabled only while step 2 shows. On step 1 the pager is locked, so step 2 is reached only through "Add tasting note".
- Because the button and the back arrow now move that same native scroll position, they use the platform's scroll animation (`scrollTo`), not `motion.expand`: a separate Animated push could not hand over to the drag. Superseded: the `motion.expand` push (confirmed on device the same day). The sheet's own slide-up still uses `motion.expand`.
- Step 1 stays mounted underneath, so its rating and fields survive a visit to step 2.
- Closing the sheet resets it to step 1.

### Tab pager (2026-10-06) — **swiping removed 2026-10-07**
**Tabs switch by the tab bar only.** Swiping between the four tab screens was removed so the horizontal gesture stays free: future tabs inside a screen, and horizontal controls such as the taste axis, would otherwise compete with a screen-wide swipe and could not be resolved. The horizontal ScrollView stays, with scrolling disabled, to keep every screen mounted and to drive the bar's indicator. The notes below describe the swipe as it was.

Swiping horizontally moves between the four tab screens: Home → Records → Try next → Profile. Swipe left for the next tab, right for the previous. The + is a modal trigger, not a stop.
- **Native paging ScrollView in `AppShell`, no gesture or animation library.** The drag, the eased settle on release (UIKit's paging deceleration), the edge rubber-band (iOS bounce; Android's system overscroll stretch) and the arbitration with each screen's own vertical ScrollView all run in the native scroll view on the UI thread. Nothing crosses to JS per frame.
- **Ends stop, never wrap.** Home → Profile does not wrap; the edge is felt as the bounce.
- **Horizontal vs vertical** is decided by the platform, not by thresholds of ours: on iOS, nested perpendicular UIScrollViews claim the gesture by the direction of the initial movement; on Android, by which axis passes the touch slop first. A mostly vertical drag goes to the screen's list. There are no custom numbers to tune. If explicit thresholds are ever needed, that takes react-native-gesture-handler (not installed; deliberately not added for this).
- **The bar's active state follows the drag continuously.** A native-driver `Animated.event` on the pager offset crossfades each tab's active glyph over its inactive one (opacity 1 on its page, 0 one page away). The settled page then becomes the tab's accessibility state.
- **A footer tap still switches instantly**: `scrollTo` without animation, no slide through the pages in between.
- **One backdrop behind all pages.** `AppShell` draws the ground and the dot texture once; `ScreenFrame` skips its own inside the pager (`ScreenBackdropContext`). Otherwise each page's texture would slide with it and break at the seam, since 390 / 7 is not a whole number of tiles. The Record overlay and the error screen sit outside the pager and keep their own.
- **Scope**: tab screens only. The Record overlay is above the pager, not inside it, so swiping in it never pages. No back gesture yet, because no detail screen exists.
- Measured (390pt simulator, programmatic animated page changes): 60 fps on the JS thread, p95 17.5 ms, one ~25 ms frame per page change at settle (the bar re-rendering; screens are memoised and do not re-render). Footer taps land on the right page in all four directions. Gesture arbitration with real fingers needs a physical device: the simulator cannot inject swipes here.

### Bottom bar — formerly "Floating bar" (revised 2026-10-05)
**Hide and reveal (2026-10-06)**: the bar **hides on downward scroll**, sliding its full height off the bottom edge. **Any upward scroll brings it fully back at once**: no threshold, no waiting for the top, because + is the primary action and scrolling back up the list is when a missed cup comes to mind.
- It is binary: always either on its way out or fully back, never part-way.
- The move is eased (`motion.expand`), since it runs on after the finger.
- Only a change of direction triggers it, from the ScrollView's scroll events. The animation runs on the native driver.
- The top and bottom bounces do not count. A page that cannot scroll never hides it. Any pager drag or tab tap brings it back, so a short screen is never left without the bar.
- Measured: the reveal starts 9 ms after an upward scroll begins and completes 340 ms later. A real flick decelerates for longer, so the bar is back first. A programmatic scroll (UIKit's fixed 326 ms) finishes about 20 ms ahead of it.

**Current spec (base `FooterNav`)**: the tab bar spans the **full screen width on the bottom edge**, on `color.surface.raised`, with **no hard shadow**. Its `2px` ink top rule is the boundary: with the bar on the screen edge, that line does the separating work the shadow used to do.
- **Row**: `size.tabBar.height` (60), with the home-indicator inset below it (34 on notched iPhones).
- **Slots**: the icons sit inside the screen gutter: the two outer slots take `layout.gutter` (22) of padding on their outer side, then all five share the remaining width equally, so the icons are evenly spaced and the centre + sits exactly in the middle. The outer slots still reach the screen edge, so the gutter is part of their touch area (the icons move in; the touch areas do not shrink). Measured at 390pt: icon centres every 69 (56.7 / 126 / 195 / 264.3 / 333.3); touch areas Home 0–91.3 and Profile 298.7–390 (both start at the screen edge, 0pt), inner slots 69 wide, all 60 tall. Superseded: five equal 78pt slots with centres 39 … 351 (2026-10-05).
- **Pressed** (§1, by surface): the tab icons are bare glyphs, so they scale to `state.pressed.scale` over `motion.press`. There is no square fill behind them any more. The + is an ink square, a surface whose fill has no darker tier, so it shows no visual change. Both give a light impact haptic. Measured: Home glyph 20 → 17.6 while held, its touch area fixed at 0–91.3 × 60; the + touch area fixed at 69.3 × 60. (Superseded 2026-10-06: a `state.pressed.surface` fill in the 60 × 40 / 68 × 40 slot box.)
- **No fade band** (removed on review, 2026-10-05): with the bar on the screen edge, the 30pt fade above the rule only covered the content just above the bar. The rule alone separates. Rebuilt tab screens keep `layout.empty.block` of room under their content.

**Why it changed**: the source (6a / 8d, and in flow on 1b / 2a / 4a / 4b) draws a 90%-wide floating bar with `shadow.floating`. That spec was drawn against an empty screen. Over real content (a full Records list) the elevation read as noise and worked against the design, so the bar went full width and the shadow came off.

**Superseded**: the 90% width, the 2px box outline, `shadow.floating`, the `space.4` side padding, and the fade band (`state.fade`, `layout.fade.top`). `shadow.floating`, `state.fade` and `layout.fade.top` now have **no consumer**; they are left in `tokens.ts` pending a decision. `HardShadow` itself is still used by the primary `Button`, `StarRating`'s error state, and the FieldRow harness.

### Empty slot (base `EmptySlot`, 2026-10-05)
The `border.addSlot` slot as a component: always a button, full width. It is the row form from 3a, 3b, 3d, 5a, 5d and 5e.
- **Anatomy**: `dashed.addSlot` frame (2px dashed ink) on a transparent ground, `inset.control` padding, then glyph → label → optional trailing tag, `space.12` apart. The glyph is `icon.md` by default (5a's camera); 3b's plus is `icon.sm`. The label is `label.caps` in ink. The tag is `label.caps` in `color.text.muted`, pushed to the right edge.
- **Source fit**: 3x pads 14 / 16 (`inset.control` exactly); 5x pads 16, folded to it. The 10–11px glyph-label gap folds to `space.12`. The tag is `label.caps` on 3b and 3d; 5a, 5d and 5e set it at 11/600 (`drift.md` D-12).
- **States**: default; **pressed**, where the fill darkens to `state.pressed.surface` (§1 Hard Rule); **disabled** (5d), where the frame drops to `dashed.emptyInert` (`border.empty.inert`), the glyph to `color.icon.muted` and the label to `color.text.secondary`. A disabled slot does not respond to press.
- **Not part of this component**: the 76px square photo slot (3c), the 2a empty-list frame (not a button), and the "Try next — opens at 5 cups" teaser card (1b, 4a, 4b, 5c).

### Badge (base `Badge`, 2026-10-05)
A chip that labels, never acts: square, filled, no border, `label.eyebrow` (2a's 11/700/.06em folds to it).
- **Tones**: `neutral` · `accent` · `success` · `info` · `raised` · `selected`, each `color.badge.bg.*` with its paired `color.badge.fg.*`.
- **Placements**: `inline` (`badge.inline`, inside a list row) and `standalone` (`badge.standalone`, alone on a surface), as §4 splits them.
- **Mode badges**: `made_it` → success ("I made it"), `barista` → info ("Barista"), `packaged` → neutral ("Packaged"); colours from 2a.
- **Single line**: it keeps its own width rather than wrapping (the source's `nowrap`). Long translations are `gaps.md` 7. Not tappable; OQ-13 still decides which chips act.

### Record row (base `RecordRow`, 2026-10-05)
The List row pattern above as a component (source 2a): a `size.thumbnail.list` placeholder thumbnail, then the content column (`title` with `name` truncation → inline Badges, `gap.row` apart → source in `body`, `color.text.secondary`, `meta` truncation → note in `body.sm`, muted, `note` truncation), then the fixed right column (`icon.fill.sm` star + `numeral.inline` rating over the `label.eyebrow` date).
- **Spacing**: `space.14` between columns, `space.16` vertical padding, and a top hairline in `color.divider.hairlineStrong` (2a's #D8C9BF). The content column stacks `gap.tight` apart; the source's 5 folds to it.
- **§3.2 adjustment**: `numeral.inline` renders on its natural 28.6 box on iOS, 6.8 below the baseline, against the spec's 22px box with 3.5 below. The right column therefore stacks rating and date with **0** gap, not the source's 4. That puts the date 6.8 under the digits, against 7.5 in the source; with 4 it would be 10.8. `lineHeight` is untouched.
- Informational: no press, no chevron. The detail screen does not exist yet. Photos show once they can be added (TODO).

### Bought at row (inline composition in Record coffee, 5e — not a base component)
The optional "Bought at" row in Record coffee's Packaged mode is composed inline in the screen from `Glyph` + `Text`. It is not built from `FieldRow`, because its anatomy differs:
- a **weak frame**: `shape.borderWidth.divider` (1.5) in `color.border.muted` on `color.surface.raised`, not the 2px ink card;
- an **inline glyph**: `bag`, `icon.md`, `color.icon.muted`, with no swatch;
- the **name** in `label`, truncated with the `name` preset, filling the row;
- ~~a right-aligned value ("¥180")~~ — dropped 2026-10-05: the data model has no price (`drift.md` D-15, `data-model.md`);
- **no chevron** and no eyebrow label. It is inert; pressed darkens it to `state.pressed.surface` (§1).

Padding is `inset.control` (the source's 13 / 16 folds to it) and the gap is `space.12` (the source's 11 folds to it). It sits under a `SectionLabel` with the `optional` status.

**Promotion rule — read this before building a similar row**: this is the **only** occurrence across the designs, so the rule of two keeps it inline. A **second occurrence promotes it to a base component**, with harness states and a §9 entry, and this inline copy is replaced by it. Do not compose it inline a second time.

**Mode switching (Record coffee, 2026-10-05)**: the rating persists across a switch (it is about the cup, not who made it). The conditional field set resets: it is keyed by mode and remounts. The photo slot persists. The conditional block's height animates with `motion.expand` (Animated, `Easing.bezier` on the token's control points), which is 5a's own mechanism, so the photo slot and footer slide rather than jump. LayoutAnimation was not used because it cannot take the token's bezier.

**Intro line per mode (2026-10-05)**: the line under the header changes with the mode. I made it is 5a verbatim ("Marked fields are required — all of them start pre-filled.") and Packaged is 5e with one word changed ("Packaged cups skip brewing and café — two fields left."; the mock says "Bottled", see `drift.md` D-14). No mock has a Barista line, because 5d replaces it with the error summary. Barista's line was **written to 5e's pattern** (what the mode skips, then how many fields are left): "Cups made for you skip beans and brewing — two fields left." Every line names the cup by who made it, matching the "Who made it?" field, not by its vessel or where it came from ("Café cups" was rejected on review). The line **crossfades** with `motion.expand` (same duration and bezier as the field block), the outgoing line laid over the incoming one, inside the same height-animating wrapper. All three fit on one line at 390pt, so the block does not change height. A longer translation would ease rather than jump.

### Taste axis slider (base `AxisSlider`; revised 2026-10-07)
The input of Taste DNA, on 5b only. **The display of Taste DNA is a different component, AxisReadout** (below): the two look different, so what can be operated is clear at a glance. The governing rule still holds: a value the user entered must never be confused with one that came out of their records.

**Five steps.**

| step | value (points) | name (screen reader) |
|---|---|---|
| 0 | 0 | Strongly {low} |
| 1 | 25 | Leaning {low} |
| 2 | 50 | **Balanced** |
| 3 | 75 | Leaning {high} |
| 4 | 100 | Strongly {high} |

- Why not 1-point steps: Taste DNA is a weighted average with recency decay, so coarse input averages into fine output over many cups. The precision of the input does not set the precision of the output. Asking "38 or 39?" works against logging a cup in 15 seconds.
- 9 steps was not taken.
- Stored as integer **0–100 points**, step i = round(i × 100 / 4). A later change of step count needs no data migration: old values snap to the nearest step.
- "Balanced", not "Middle": Middle describes the slider's position, Balanced describes the coffee. The app talks about coffee, not about its controls.

**States: the rail is the same in every state; the needle carries the state.** One state decides both (`component.axis.state.*`):

| state | rail | needle |
|---|---|---|
| `empty` (value null) | the track: 1.5 solid `border.muted` on a `surface.ground` fill + `texture.rule` | `axis.needle.empty`: `surface.muted`, 1.5 `border.medium`, 12 × 30, resting at Balanced as a **placeholder, never a value** |
| `lit` (finger on it) | same | `axis.needle.lit`: `icon.rating` #C9821A (same value, needle role), 2 ink, 12 × 32, scaled to 0.88 |
| `entered` | same | `axis.needle.entered`: `icon.accent`, 2 ink, 12 × 32 |

- The rail is a weak frame (1.5 = internal / weak in §1 Shape), so the needle leads. An unentered axis no longer looks "confirmed" (the ink solid rail did).
- The rail also differs clearly from AxisReadout's 4pt bar.
- **Lit**: gold reads as "entered, brighter", not as a third state. `accentStrong` (#8A4602) was too close to entered.
  - In and out over `motion.press` (100ms).
  - The needle presses by scale, because it is under 44pt (§1 Pressed).
  - On release it settles to entered.

**Layout and size: L3 + H1 (2026-10-08).**
- The rail is **260 × 28** (`size.axis.railWidth` / `size.axis.rail`), **centred** in its card.
- The pole labels are **`label.caps`** (12; was `label.eyebrow` 10, enlarged on review 2026-10-08) and sit at the rail's ends. 260 (up from the first 240) fits the longest pair, Low / High sweetness at 245, with ~15 between.
- The **handle is 16 × 40** (`size.axis.handle`), so the 5 stops are **61pt apart** ((260 − 16) / 4). The old full-width rail made 74.5, too far for a 5-step control.
- **Grip**: a short centre line on the handle, as wide as its stroke (2) and 14 tall (the readout marker's height). It takes the handle's stroke colour until the axis is changed, then **turns white** (`icon.onAction`) once entered. Ink while lit.
- **Clear sits under the handle and travels with it** (from Uryu's sketch), in the same fixed 17pt slot. It is **hidden while dragging** and set in **`label.eyebrow`** (the Button text variant's `small`), smaller than the pole labels. "Not noted" stays at the rail's start.
- On iPhone 14 the rail spans x 65–325: 65pt from each screen edge.
- Superseded the rail at full card width (310, 74.5 per step) and the 12 × 32 needle.

**Stops and travel.**
- The 5 stops and the 3 reference lines (`texture.rule` at the inner stops) sit on a track **inset by half the handle (8pt)** from each rail end, so the handle never overhangs the rail at 0 or 100.
- 5b's stops on iPhone 14: x 73 / 134 / 195 / 256 / 317.
- **Discrete = snapping**: the needle moves stop to stop (eased over `motion.press`).
- **A selection haptic on every step change**, so the number of steps moved can be felt without looking.

**Commit.**
- Nothing commits while the finger is down.
- Release commits the step (onChange). A gesture taken away restores the committed step.
- **Clear** (Button text variant), shown only when entered, is the one way back to empty. It sits in a fixed 17pt slot shared with "Not noted", so nothing jumps.

**Under the finger.** While dragging, the pole label on the side of the needle's step turns `text.primary`. At **Balanced neither does**: the middle step is the middle. There is no dead zone; the steps replace it.

**Gesture.**
- Pan (`activeOffsetX` / `failOffsetY` ±10) and tap-to-set, `Exclusive`. Vertical scroll has priority.
- **Touch band**: a real view 12pt larger than the rail on every side (negative margins, layout unchanged). A gesture-handler `hitSlop` was tried first and did nothing on iOS: no axis touch ever began outside the rail, because a touch outside a view's bounds is hit-tested to the view underneath.
- **Competition with swipe-back, resolved by removing the competitor (2026-10-08).**
  - Three device logs showed that the axis pan never let go. It stayed ACTIVE through 0 / 100 and past the rail until the finger lifted.
  - Every unwanted sheet movement was a touch the axis never received, taken by the Record sheet's full-width swipe-back pager.
  - Blocking from the axis (`blocksExternalGesture`, then the real touch band) did not hold.
  - The sheet now swipes back only from a 44pt strip at the left edge (§9 Record sheet steps), so nothing competes with the axes. Device-confirmed: axis drags no longer move the sheet.
  - Residual, not explained: a few touches logged inside an axis band never produced an axis BEGAN (`gaps.md` 14).

**Screen reader.**
- Role adjustable; one swipe = one step.
- The value is read as the step's name ("Leaning bitter"); an empty axis reads "Not entered yet".
- The first adjustment of an empty axis starts from Balanced. Custom action Clear when entered.

**Device-tuning constants**: `ACTIVE_OFFSET_X` / `FAIL_OFFSET_Y` = 10, `TAP_MAX_DISTANCE` = 8 (top of `AxisSlider.js`); the edge swipe's `EDGE` / `FAIL_OFFSET_Y` / `BACK_*` in `AddCoffeeOverlay.js`. The 340ms crossfade is gone: the rail no longer changes.

### Taste axis readout (AxisReadout — spec 2026-10-07, to be built)
The display of computed values: 1b / 4a / 4b (the profile) and 5c (the change after a save). It is **not operable** and belongs to the read-only bar family of `beanFreshness`. No new visual language.

| part | value | from beanFreshness |
|---|---|---|
| track | `size.meter.track` (4), `surface.muted` | same |
| fill | **from 50 to the value**, `border.medium` | changed: it fills from the left there, in freshness colours |
| marker | 2 × 14, `text.muted`, at the value | same geometry (todayMarker); neutral colour |
| ticks | **none** | — |
| gradient | **none** | — |

- **Fill from the middle (B)**: the axis is bipolar, so "22 toward bitter" is the true reading, not "72% bitter". At exactly 50 there is no fill, and the marker alone at the centre reads as "balanced".
- **The marker carries the value; the fill only helps.** Measured: the fill is **1.67:1** against the track, under the 3:1 needed for a meaningful graphic. The marker is **4.45:1** on the track and 6.19:1 on a card. A fill-only readout would also show nothing at 50.
- **No ticks**: on a 4pt bar they are barely visible and add noise; the fill's origin at 50 is the reference.
- **4pt** (`size.meter.track`): beside the 20pt slider the difference is unmistakable. No new size.
- **5c, ghost and delta**: two fills.
  - The previous value is drawn in `border.muted` underneath, and the current one in `border.medium` on top.
  - The ghost is a `border.muted` 2 × 14 marker at the previous value.
  - Moving away from 50, the extra current fill is the movement; moving toward 50, the exposed lighter fill is.
  - It reads weakly, so the copy under the axis carries the movement ("Moved 6 points brighter"; `gaps.md` 13).
- When built, `axis.rail.derived`, `axis.needle.derived`, `dashed.track` and the `derived` mode of `AxisSlider` go, in one token clean-up.

### Component catalog — pending (Step 4, logged 2026-10-06)
Three parts of 5b are drawn inline in `TastingNoteScreen` for now (display only). They become base components in a later round. Each entry lists what to settle then.
- **Axis slider** (`component.axis.*`): rail + needle (+ ghost + delta on 5c), with drag. **Specced and built 2026-10-07** (§9 Taste axis slider, `AxisSlider`).
  - The set needle (accent fill, 2px ink, 12 × 32) is a local constant today; decide whether to promote it to a token.
  - Also settle the rail naming; see the `axis.rail` note in §2.
- **Flavour chip, multi-select**: three looks, all bordered surfaces that darken on press:
  - selected: `badge.bg.accent` + `border.accent`, `accentStrong` label;
  - unselected: `border.muted`, `secondary` label;
  - Search opener: `border.addSlot` (2px ink dashed; was `border.track`, drift D-21), `muted` label.
  - To report then: whether the dashed Search fits the dashed meaning (§8), and whether other screens have a multi-select set to share it with.
  - Note: at `inset.control` (44 tall) the 5b chips wrap to 3 rows at 390pt where the mock's 39-tall chips take 2 (`gaps.md` 3).
- **Cup summary row** (5b): `size.thumbnail.summary` thumbnail, name (`label`), one line of meta (`body.sm` muted), and the rating star + `numeral.inline` on the right.
  - To report then: how it differs from `RecordRow` (2a) in information, not just layout, and whether the mocks explain showing the same cup two ways. That decides merging versus a separate component.

### Section heading (base `SectionLabel`, variants 2026-10-06)
Two variants, both `label.eyebrow` `color.text.muted` with an optional right-side status:
- **`marked`** has the `size.dot.bullet` square. Read from its distribution, the square marks **a section of an input form** (it appears only where the user is filling something in). It is used only on the Record coffee form (5a, 5d, 5e): How was it?, Who made it?, From my shelf, Café details, Product, Bought at.
- **`plain`** has no bullet. It covers every other section heading:
  - 5b Flavors, My words;
  - 2c What I logged, Flavors;
  - 3f From archived bags;
  - 6a My taste DNA, My shelf;
  - 6b Taste DNA, My data, Account;
  - 6c App, Help & feedback, Support us, Legal;
  - 7a This week, Earlier;
  - 8d Also worth a cup; 8e Why this, for you / The plan; 8f What you keep saying; 8h Most used / Used once or twice; 8i Nudge me to log / From the app; 8j What is this about / Tell us; 8k Signed-in devices / Deleting; 8l Recent searches; 8m App language / What changes.
- Not headings, so not `SectionLabel`: FieldRow labels (Beans, Method, Café, Drink, Brand, Package), form field labels (3c, 3e, 6d) and header eyebrows / meta.
- Status `count` is a neutral right-side count (5b "3 of 5").

### Star rating (base `StarRating`)
Card per the Card pattern (`inset.container`, `gap.section`). Five `size.control.row` (52) tap targets spread with space-between. Filled star `icon.fill.xl`, empty star `icon.xl` stroke in `color.border.muted`; optional caption under `divider.soft`; 5d error state per `state.error.*`.

**Pressed**: a **48px disc** in `state.pressed.surface` behind the star. The 52px touch target is unchanged; only the visual changes. It is a circle because the star is a radial control (§1 Shape: press feedback follows the element's shape).
- **Optical offset: disc centre 1px *below* the 52px box centre** (disc top inset 3, left inset 2).
- Why down, not up: the star's mass does sit low relative to its own bounding box (area centroid y = 12.53 vs bbox centre 11.50 in the 24-unit viewBox). But the glyph is drawn centred on its viewBox (y = 12), not on its bbox, so the 52px box centre is already *above* the star's mass: centroid +0.84px, circumcentre +0.81px at 38px.
- Tuned by eye at 3× across −2…+2px: at +1 the top tip clears the disc edge by 7.17px and the bottom tips by 7.52px; at 0 the star reads low and at +2 it reads high.
- Implementation note: the glyph sits in its own View so it paints above the absolute disc on web as well as native.

**Caption copy (2026-10-06)**: one line per rating, shown the moment a star is set. There is no empty level.

| ★ | Caption |
|---|---|
| 1 | Not for me |
| 2 | Not again |
| 3 | Does the job |
| 4 | Would have again |
| 5 | One to remember |

- Grammar follows 5a's "Would order again": subject dropped, sentence case, never "Your". The verb is mode-neutral: "have" works for a cup I made as well as one bought, where "order" does not. So 4 is 5a's line with the verb swapped, and the five rise monotonically.
- **Fixed height, one line.** The caption is held to one line (`meta` truncation). While unrated the line is still reserved (an empty line), so neither the first tap nor any later change moves the card. Measured at 390pt: the caption box is 310 × 16.3 at every rating, and the next section label stays at y 349.7 from 0 through 5 stars.
- A two-line reserve was rejected: ja / zh likely fit one line and would carry a permanent empty line. If a translation overflows (it would ellipsize), revisit then. The code says so at the caption.

### Buttons
Primary: `size.button.primary` tall, `color.action.bg`, `2px solid` outline, `shadow.primary`, `button.caps`. Secondary: same geometry on `color.surface.ground` with `color.text.primary`. Tertiary: no background, no border, `label.caps`.

Trailing icon (base `Button`, 2026-10-05): an optional glyph after the label (5a "Add tasting note →"), `icon.sm`, `gap.row` from the label, coloured like the label: `color.icon.onAction` on primary, `color.icon.default` on secondary, `color.icon.muted` when disabled. 1b's buttons carry a *leading* icon instead; that form has not been built.

Icon button (base `IconButton`): `size.tapTarget` square, `2px solid` `color.border.strong` on `color.surface.raised`, one `icon.md` glyph in `color.icon.default`, no shadow. It is the header close / back control on 3a–3f, 5a, 5b, 5d and 5e. 6d, 7a, 7b and 8e–8m use the same button with the `-2` optical nudge applied at the point of use. The `1.5px` `color.border.muted` frame (3b, 8e) and the `color.badge.bg.accent` fill (2a, 3b) are variants that have not been built.

Disabled (decided 2026-10-04, `gaps.md` 4 — not in the shipped screens): either variant drops to `color.surface.ground` fill, `color.border.muted` outline, `color.text.muted` label, and no shadow. This reuses the `border.empty.inert` vocabulary from 5d (muted border = cannot be actioned) rather than introducing opacity, which the design uses only for the scrim backdrop.

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

1. **`texture.dot` colour, pending a visual check.** `#E3D4CA` was merged into `#E4D6CC` at ΔE00 ≈ 0.6 (below the perceptual threshold, so treated as parallel drift). But a 1px dot is a tiny mark, and there is a chance the darker value was chosen so the dot stays visible. A real optical compensation would not differ by only 1 unit, hence the drift call. **Re-check by eye once it is rendered with `<Pattern>` in RN; if the dots look washed out, give `texture.dot` its own darker value.** *Rendered 2026-10-05: in the simulator the dots read clearly, not washed out, so no change for now. The final call should be made on a physical device, including at low brightness.*
2. ~~**Texture implementation is undecided.**~~ **Resolved for `texture.dot` (2026-10-05)**: SVG `<Pattern>` in `DotTexture`, fixed behind `ScreenFrame` (§2 Texture). `texture.rule` is still open. RN has no `background-image` and no CSS gradients. Both textures must be rebuilt with react-native-svg `<Pattern>` (already a project dependency), which is why the tokens carry geometry rather than only colour.
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
    ~~**Also batched — compact header optical offset (2026-10-05)**~~ **Resolved 2026-10-07**: the control is now centred on the title's measured cap band, so no per-language constant is needed (§9 Compact header — current).

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
- 2026-10-04 — §9: the ~5.5pt lower title on iOS is reclassified from an open item to an accepted platform difference. The spec follows CSS line-box rules, and matching it would require clipping the top of the line box, which is the bug just fixed.
- 2026-10-05 — Base components added: `EmptySlot` (the `border.empty` row slot, with default / pressed / disabled states) and a trailing icon on `Button`. Both were needed by Record coffee (5a) but are owned by the base set, not the screen. No new tokens; `drift.md` D-12 records 5x's 11/600 tag against `label.caps`.
- 2026-10-05 — Record coffee (5a, I MADE IT mode, static): first screen rebuilt from its mock. `ScreenFrame` gains a header meta slot, page scroll and a footer panel (§9 Screen shell). `drift.md` D-13: 5a / 5d / 5e section spacing (16 / 18 / 20) → `gap.section`.
- 2026-10-05 — §3.2 platform note: iOS gives Yoga no glyph baseline. A short-lived `textBaseline` helper in `fonts.js` computed the baseline from font metrics so the Record coffee close button could sit on the title baseline. It was removed when the header switched to centring the button on the title column; the header was its only consumer, and centring needs no font metrics.
- 2026-10-05 — §9 Compact header: Record coffee's close button now shares the title row, the date / time drops beneath the title, and the header is pinned. The button is centred on the title column with a +4 optical correction, tuned by eye; it replaced baseline alignment. ja reads centred at 0, so its value moves to the OQ-14 mapping.
- 2026-10-05 — §9 Compact header: close → title gap widened from `gap.row` (8) to `space.12` on review. The ja titles still fit, 12 clear of the 290 budget.
- 2026-10-05 — Record coffee: Barista (5a) and Packaged (5e) field sets built. The 5e "Bought at" row is an inline composition recorded in §9, with a promotion rule so a second occurrence becomes a base component. Mode switches keep the rating and the photo slot, reset the field set, and animate the height with `motion.expand`.
- 2026-10-05 — Record coffee intro line is now per mode: 5a and 5e verbatim; the Barista line is written to 5e's pattern, pending review. It crossfades with `motion.expand`.
- 2026-10-05 — Intro copy: Packaged "Bottled cups…" → "Packaged cups…" (D-14: the rename wins over the 5e mock); Barista "Café cups…" → "Cups made for you…", so every line names who made the cup.
- 2026-10-05 — Data layer (Step 6): schema, migrations and types in `src/data/`, reasoning in `data-model.md`. No price column, so the Bought at row drops ¥180 (`drift.md` D-15).
- 2026-10-05 — Record coffee writes real cups (Step 6b). Field sets read their values from the database, and meta lines show only what the stored rows can back. The mock's history- and location-derived lines ("drink now", "250 m away · your 4th visit", "What you ordered here last time", "Bought twice in the last month") and "Chilled, unsweetened" wait for the features behind them.
- 2026-10-05 — Base components added: `Badge` and `RecordRow`, for the Records list (2a). No new tokens. Record coffee now defaults its rating to 0, with Save disabled until a star is tapped (minimum viable validation), and shows the live date / time it will store, formatted by Intl.
- 2026-10-05 — Records (2a) reads from the database: `RecordRow`s newest first, grouped under month headers. The source line degrades by mode (`drift.md` D-16), the brew-category badge is withheld (`gaps.md` 10), and the empty state is a plain one-line placeholder (`gaps.md` 5).
- 2026-10-05 — `SectionLabel` reserves `icon.xs` height, so a status appearing no longer shifts the layout (§9 Section rhythm).
- 2026-10-05 — §9 Bottom bar replaces the Floating bar spec: full width on the bottom edge, no hard shadow, the 2px top rule as its boundary, five equal slots. The floating 90% bar with `shadow.floating` was drawn against an empty screen; on real content the elevation worked against the design. `shadow.floating` is now unused (kept, pending a decision).
- 2026-10-05 — §9 Bottom bar: the fade band above the rule is removed. On the edge bar it only covered the content just above it. `state.fade` and `layout.fade.top` are now unused (kept, pending a decision).
- 2026-10-05 — `texture.dot` implemented: `DotTexture` (one SVG `<Pattern>` from the token values), fixed behind every `ScreenFrame`, under opaque surfaces. OQ-2 resolved for the dot texture; OQ-1 rendered, final check on a physical device.
- 2026-10-06 — §9 Bottom bar: icons inset by `layout.gutter`, which the outer slots take as padding, so their touch areas still reach the screen edge. Icon centres now every 69pt instead of 78.
- 2026-10-06 — StarRating caption: five per-rating lines (§9 Star rating), mode-neutral, fixed one-line height reserved while unrated.
- 2026-10-06 — **Tokens added: `state.pressed.scale` (0.88) and `motion.press` (100ms, `motion.expand`'s bezier).** §1 Pressed rewritten: feedback is decided by whether the element has a surface (surface → darken, none → scale; never opacity). The five existing components are unchanged. Haptics rule: a discrete press is a light impact; sweeping across options is selection. Bottom-bar tab icons now scale with no square fill.
- 2026-10-06 — §9 List row: the row-order rule is written down for all three modes (line 1 what was drunk, line 2 where it came from), and the long-name rule for café / brand (1 line) vs drink / product (2 lines). Packaged is the only name for the third mode; READY-TO-DRINK survives only in the mocks and in records of the rename.
- 2026-10-06 — §9 Tab pager: horizontal swipe between the four tabs, as a native paging ScrollView (no gesture or animation library added). The bar's active glyph follows the drag. One backdrop sits behind the pager.
- 2026-10-06 — §9 Header collapse: scrolling screens pin the header and collapse it with transforms only (title 1 → 0.75 = displaySm / displayLg; distance derived from the safe area, Records 26 on iPhone 14). §9 Bottom bar hides on downward scroll and comes fully back on any upward scroll.
- 2026-10-06 — §9 Header eyebrow and stat: every tab carries its mock eyebrow, and Records shows the cup count (2a). Collapse revised: the stat numeral keeps its size and lands on the title baseline; small labels (eyebrow, "Cups", Record coffee's date) fade over the first half instead of scaling.
- 2026-10-06 — §1 Hard Rule, Header collapse: controls never fade or disable; only information fades. ScreenFrame's standard-header `leading` is now fixed (the title shrinks below it) and its `meta` fades.
- 2026-10-06 — **Token added: `size.thumbnail.summary` (40). Style added: `text.note`** (Instrument Serif 20 italic / 28), promoted from E-3; 15 styles. `SectionLabel` gains `marked` / `plain` variants and a `count` status.
- 2026-10-06 — Tasting note (5b) built as a static shell, stood in for Try next for verification (design/todo.md). Axis slider, flavour chip and cup summary row logged as pending components (§9).
- 2026-10-06 — **Renamed** `axis.rail.readonly / editable` → `derived / entered` (provenance, §2 B) and `border.empty.disabled` → `border.empty.inert`. §8 now lists dashed's two uses separately. §1 Hard Rule added: name state tokens for their meaning, across every screen.
- 2026-10-07 — Tasting note moved into the Record sheet as step 2 (push from the right, `motion.expand`); Try next is its placeholder again (`todo.md` T-1 done). §9 Compact header revised for both steps: control + title on one row, meta as the right-aligned standard column, the control centred on the measured cap band (no fixed +4). Labels finish fading within the reachable collapse.
- 2026-10-07 — Record sheet: swipe right on Tasting note returns to Log a cup. The steps are now a native paging ScrollView, locked on step 1; button and back use the platform scroll animation instead of `motion.expand`.
- 2026-10-07 — §1 Hard Rules added: **Focus** (one 2px `color.caret` frame outside, `space.2` gap, non-touch focus only), **Tap affordance** (option form = outline / ink + 44 + in a set; roles and states on every pressable; 6a / 8d / 8h / 8f held), **Selection limit** (lock the unselected, accent count, one light impact at the limit). `border.empty` → `border.addSlot` (+ `.inert`); `border.track` is rails only.
- 2026-10-07 — §1 added: **Colour roles** (blue = in force, ink = chosen; settings checkboxes are chosen) and **Disabled options** (the lock look as every option set's disabled state, two reasons). Tap affordance: 6a / 8d attribute tags are a display form, 8f / 8h word tags are pressable, and height decides. Focus: on iOS delegated to the OS.
- 2026-10-07 — §9 Taste axis slider spec written: four states (derived / empty / provisional / entered) each deciding rail and needle, 0–100 points, commit on release with revert on scroll takeover, Clear only when entered, ±5 dead zone, vertical scroll priority, adjustable role. §1 added: Animation systems (Animated stays, Reanimated for finger-following gestures) and Dashed does not mean "cannot be operated" (colour decides).
- 2026-10-07 — Tab swipe removed (tab bar only). Taste axis slider revised: five steps named Strongly / Leaning / Balanced, one rail for every state (1.5 `border.muted` on ground), needle empty / lit (#C9821A) / entered, stops inset 6pt, a haptic per step. AxisReadout specified (fill from 50, marker carries the value). §1 Pressed: under 44pt scale, 44pt and up darken. `border.addSlot` lightened to #6B5D55; the dashed rule moved from §1 to §8.
- 2026-10-08 — Taste axis slider L3 + H1: rail 240 × 28 centred with the labels at its ends, handle 16 × 40, stops 56pt apart; a centre grip that turns white once entered; Clear under the handle. Tokens: `size.axis.rail` 20 → 28, `size.axis.railWidth` and `size.axis.handle` added.
- 2026-10-08 — Record sheet: swipe back only from the left edge (22pt gutter), with the steps on a Reanimated value and the push back on `motion.expand`. Taste axis: pole labels `label.caps`, rail 260 (61pt steps), Clear smaller (`label.eyebrow`) and hidden while dragging.
