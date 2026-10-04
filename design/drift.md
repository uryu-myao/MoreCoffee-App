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

## Not drift — recorded so they are not "fixed" by mistake

- **`space.14`** is a deliberate break in the ≥8px-multiple-of-4 rule. See Hard Rules.
- **`gap.axis` (20) > `gap.section` (12)** is intentional: it is one component's internal rhythm, not a general rule that enclosure means more room.
- **Two tokens share `#E4D6CC`** (`color.border.subtle` and `texture.dot` / `texture.rule`). Deliberate, so texture density can be tuned without touching borders.
- **`#5C5049` / `#6B5D55`** and **`#9E5202` / `#8A4602`** are deliberate two-tier pairs (Gate A). Never merge.
- **The 6 items in `exceptions.md`** are unresolved, not wrong. Do not normalise them without the re-check described there.
