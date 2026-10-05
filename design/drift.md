# MoreCoffee — Drift to correct

Values in the shipped designs that contradict a token established in `design-system.md`. Each one is a design-side fix, not a token change — the token side already carries the correct value.

Source: `MoreCoffee design.dc.html` · 30 screens · 2026-09-20

| # | screen | element | current | correct | why |
|---|---|---|---|---|---|
| D-1 | 4b | `beanFreshness.todayMarker`, both rows | marker matches the fill: `#7E9675` (drinkNow) / `#C2B4AB` (pastPeak) | `#4A6640` / `#8C7E76` | 3d uses a dedicated darker marker. The marker is a 2px line standing at the right edge of the bar — matching the fill makes "today" unreadable. 3d is correct; 4b saves two tokens at the cost of legibility |
| D-2 | 8e | "Log a cup with this plan" button | `box-shadow: 4px 4px 0` | `shadow.primary` = `5px 5px 0` | The button is h56 / w100%, the same geometry as the 13 other full-width primaries, all of which use 5px |
| D-3 | 3b | bottom sheet footer panel | `gap: 18px` | `gap.section` = 12 | 3b and 2b are structurally identical sheets (position, background, 2px top border, `padding: 22 22 34`, 56×5 drag handle with −6 margin) yet differ in gap alone |
| D-4 | 2b | bottom sheet footer panel | `gap: 22px` | `gap.section` = 12 | Same as D-3. Also collides numerically with `layout.gutter` (22), which invites confusion |
| D-5 | 3c | bordered card | `gap: 18px` | `gap.section` = 12 | 12 is the measured mode for enclosed surfaces (5 of 15 bordered cards/sheets) |
| D-6 | 3e | bordered form card | `gap: 20px` | `gap.section` = 12 | 20px belongs to `gap.axis`, which is the taste-axis component's internal rhythm. 3e is a form-field group, not an axis list |
| D-7 | 4a, 4b | letter-spacing notation | `0.16em` | `.16em` | Same computed value; notation only. Normalise for diffability |
| D-8 | 5d | body copy | `font-size: 12.5px` (3 uses) | `body.sm` = 12 | Fractional type size with no counterpart elsewhere |
| D-9 | 8m | body copy | `font-size: 13.5px` (3 uses) | `body` = 14 | Same |
| D-10 | 3b, 5a, 1b | secondary full-width button ("Add tasting note" and siblings) | `height: 52px` (3b ×3, 5a ×2) / `50px` (1b ×1), label `14px / .08em` caps | `size.button.primary` = 56, `button.caps` | §9: secondary is the primary's geometry on `color.surface.ground`. `button.caps` already absorbs 14/.08em. Six uses on three screens with two different heights is drift, not a second button size — the base `Button` ships 56. Recorded 2026-10-04 |
| D-11 | 6a, 8d | floating bar fade | `linear-gradient(to bottom, rgba(244,237,234,0), #F4EDEA 40%)` across the whole wrapper. With `padding: 30 0 34` and a 60px bar the wrapper is 124px, so the fade goes solid at ~50px, 20px below the bar's top edge; at the bar edge it is ~60% opaque | fade band = `layout.fade.top` (30): transparent at the wrapper top → `color.surface.ground` at the bar's top edge, solid below | `layout.fade.top` is defined as "the fade band above a floating bar". A percentage stop ties the band to the wrapper height, which changes with the bottom safe-area inset. The base `FooterNav` ships the 30px band. Recorded 2026-10-04 |
| D-12 | 5a, 5d, 5e | "Optional" tag in the Add a photo slot | `11px / 600 / .06em` uppercase | `label.caps` (12 / 700 / 0.96) | The same slot's trailing tag is `label.caps` on 3b and 3d ("5 slots left", 12/700/.06em). 11/600 caps matches no text style, and 5a/5d/5e are one screen family, so this is the outlier. The base `EmptySlot` sets every tag in `label.caps`. Recorded 2026-10-05 |
| D-13 | 5a, 5d, 5e | Log a cup form: space between sections | `padding-top: 16px` (first section, below the intro line) / `20px` (between sections) in 5a and 5e; `18px` in 5d | `gap.section` = 12 | Same case as D-6. 20 belongs to `gap.axis`, the taste-axis component's rhythm, and three different values across one screen family show no intent of their own. These are form sections, and `gap.section` is the between-sections token. Record coffee ships 12. Recorded 2026-10-05 |
| D-14 | 5e | Packaged intro line | "Bottled cups skip brewing and café — two fields left." | "Packaged cups skip brewing and café — two fields left." | The mock predates the READY-TO-DRINK → PACKAGED rename (`i18n-notes.md`). The rename exists because a can is not bottled, and this screen's sample product is a 185 ml can, so the rename wins over the mock. Copy drift, not a token value. Recorded 2026-10-05 |
| D-15 | 5e | "Bought at" row | store name + right-aligned "¥180" | store name only | The data model deliberately has no price column (`data-model.md`, "No price"). A hand-entered price is always partial and cannot support spend reporting, so the UI does not collect or show one. Recorded 2026-10-05 |

## Not drift — recorded so they are not "fixed" by mistake

- **`space.14`** is a deliberate break in the ≥8px-multiple-of-4 rule. See Hard Rules.
- **`gap.axis` (20) > `gap.section` (12)** is intentional: it is one component's internal rhythm, not a general rule that enclosure means more room.
- **Two tokens share `#E4D6CC`** (`color.border.subtle` and `texture.dot` / `texture.rule`). Deliberate, so texture density can be tuned without touching borders.
- **`#5C5049` / `#6B5D55`** and **`#9E5202` / `#8A4602`** are deliberate two-tier pairs (Gate A). Never merge.
- **The tab bar icon colours `#9B8F87` / `#C6BBD3`** (1b, 2a, 4a, 4b, 6a, 8d) are not drift. The original extraction missed them (lowercase hex in the source), and they qualify on their own (6 and 5 screens), so they are tokens: `component.tabBar.icon`. Recorded 2026-10-04.
- **The 6 items in `exceptions.md`** are unresolved, not wrong. Do not normalise them without the re-check described there.
