# MoreCoffee — Step 3.0: role annotation (gate)

Every value from `evidence.md` is tagged by the **property it is declared on and the element type it lands on** — not by its number. No values are merged, rounded or renamed here.

- Source: `MoreCoffee design.dc.html` · 32 frames · **30 unique screens** (6b/6c counted as 6a; 9a 9b 8a 1a 2c 8b 8k excluded)
- A value used in several roles is **listed once per role**, with that role's use count and its share of the value's total uses (`multi-role` flag).

### How each role was assigned (mechanical rules, applied to the inline style of the element itself)

| role | assignment rule |
|---|---|
| `fill` | `background` on a non-button, non-chip box |
| `button-bg` / `button-fg` | `background` / `color` on a `<button>` |
| `badge-bg` / `badge-fg` | `background` / `color` on a non-button element with two-value `padding` + uppercase or ≤13px type (chips) |
| `border` | any `border*` longhand/shorthand |
| `divider` | `background` on a box whose width or height is ≤3px and carries no type |
| `accent-marker` | `background` on a square ≤9px with no type (the square bullets) |
| `heading-text` | `color` on an Instrument Serif element |
| `body-text` | `color` on sans text ≥13px |
| `secondary-text` | `color` on sans text ≤12px, or uppercase micro-type |
| `link` | `color` on `<a>` or on an underlined element |
| `scrim` | translucent `rgba` `background` on an absolutely-positioned overlay |
| `fade` | gradient background, or an `rgba(...,0)` stop |
| `texture` | any color inside `background-image` |
| `icon-stroke` / `icon-fill` | `stroke` / `fill` attribute on `<svg>` |
| `shadow-ink` | the color inside `box-shadow` |

## Colors by role

### role: `border` — 9 value(s), 543 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `#273D22` | 30 | 234 | 234/518 (multi-role) | 1b 2a 2b 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5c 5d 5e 6a 6d 7a 7b 8c 8d 8e 8f 8g 8h 8i 8j 8l 8m | div / span |
| `#C8BCB4` | 29 | 156 | 156/157 (multi-role) | 1b 2a 2b 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5c 5d 5e 6a 6d 7a 7b 8c 8d 8e 8f 8h 8i 8j 8l 8m | span / span "Blackcurrant" |
| `#D8C9BF` | 20 | 58 | 58/61 (multi-role) | 1b 2a 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5c 5d 5e 6a 7b 8d 8e 8g | div / div "Two clicks coarser than your" |
| `#E4D6CC` | 18 | 56 | 56/97 (multi-role) | 2b 3b 4a 4b 5a 5d 5e 6a 7a 8c 8d 8e 8g 8h 8i 8j 8l 8m | div / button |
| `#8A4602` | 10 | 14 | 14/51 (multi-role) | 1b 3d 4a 4b 5b 5c 6a 7a 8d 8e | span "Stretch" / span "One step off profile" |
| `#B3A69E` | 5 | 18 | 18/20 (multi-role) | 1b 4a 4b 5b 5c | span |
| `#9E5202` | 1 | 5 | 5/119 (multi-role) | 5d | div |
| `#DDD0C8` | 1 | 1 | 1/2 (multi-role) | 6d | div |
| `#6B5D55` | 1 | 1 | 1/270 (multi-role) | 3d | span "Medium" |

### role: `secondary-text` — 6 value(s), 351 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `#6B5D55` | 29 | 237 | 237/270 (multi-role) | 1b 2a 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5c 5d 5e 6a 6d 7a 7b 8c 8d 8e 8f 8g 8h 8i 8j 8l 8m | span "V60, Kalita…" / span "C40, 1Zpresso…" |
| `#5C5049` | 21 | 52 | 52/141 (multi-role) | 2a 2b 3a 3b 3c 3d 3e 5a 5b 5c 5d 5e 6a 6d 7a 7b 8d 8g 8h 8i 8l | span "Blackcurrant" / span "Grapefruit" |
| `#9E5202` | 19 | 27 | 27/119 (multi-role) | 1b 2a 2b 3c 3f 4a 4b 5a 5b 5c 5d 5e 6a 7a 8c 8d 8e 8f 8m | div "2 of 3 picked" / div "Based on 147 cups" |
| `#273D22` | 7 | 13 | 13/518 (multi-role) | 1b 3c 4a 4b 5c 6a 7b | div "Notifications" / span "Edit" |
| `#4A6640` | 5 | 13 | 13/14 (multi-role) | 3d 4b 5a 5d 5e | span "Set" / span "Pre-filled" |
| `#8A4602` | 4 | 9 | 9/51 (multi-role) | 5d 7a 8d 8e | span "Stretch" / span "One step off profile" |

### role: `body-text` — 6 value(s), 244 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `#273D22` | 29 | 136 | 136/518 (multi-role) | 1b 2a 2b 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5d 5e 6a 6d 7a 7b 8c 8d 8e 8f 8g 8h 8i 8j 8l 8m | div "Setup · 2 of 3" / span "Pour-over dripper" |
| `#5C5049` | 18 | 43 | 43/141 (multi-role) | 1b 2a 2b 3a 3c 3e 4a 4b 5d 5e 6d 7a 8c 8d 8e 8f 8g 8m | div "Pick what you own now. This " / span "French press" |
| `#6B5D55` | 11 | 26 | 26/270 (multi-role) | 1b 3a 3b 3c 3d 4a 4b 5b 5c 6d 8j | span "Optional" / span "Jan 2026" |
| `#9E5202` | 9 | 29 | 29/119 (multi-role) | 1b 3b 3e 4a 4b 6a 8f 8g 8h | div "From 147 cups · shifted 4 da" / span "9" |
| `#3C332E` | 3 | 6 | 6/6 | 7b 8e 8j | div "Your last 20 cups lean brigh" / div "I would love to mark a bag a" |
| `#8A4602` | 1 | 4 | 4/51 (multi-role) | 5d | div "Two answers are still missin" / span "Tap a star — this is the one" |

### role: `fill` — 21 value(s), 238 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `#FFFCFA` | 28 | 90 | 90/170 (multi-role) | 1b 2a 2b 3a 3b 3d 3e 3f 4a 4b 5a 5b 5d 5e 6a 6d 7a 7b 8c 8d 8e 8f 8g 8h 8i 8j 8l 8m | div / span |
| `#F4EDEA` | 16 | 33 | 33/68 (multi-role) | 1b 2a 2b 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5c 5d 5e | div / span |
| `#E4D6CC` | 14 | 22 | 22/97 (multi-role) | 1b 2a 2b 3b 3c 3d 3f 4a 4b 5a 5b 5e 6a 6d | div "Y" / div |
| `#D9C7BB` | 9 | 12 | 12/12 | 1b 2a 3b 3c 3d 3e 3f 4a 4b | div |
| `#067BC2` | 8 | 15 | 15/41 (multi-role) | 1b 4a 4b 8c 8f 8g 8i 8j | span / a "See all" |
| `#EFE4DC` | 6 | 9 | 9/9 | 1b 4a 4b 8f 8i 8m | div / span |
| `#DCD0C8` | 5 | 15 | 15/15 | 1b 4a 4b 5b 5c | span |
| `#273D22` | 5 | 11 | 11/518 (multi-role) | 3a 3e 8c 8i 8m | span / span "M" |
| `#CBB6A8` | 5 | 6 | 6/6 | 1b 2a 3b 4a 4b | div |
| `#9E5202` | 3 | 7 | 7/119 (multi-role) | 3a 5b 5d | span / span "2" |
| `#E8DCD3` | 2 | 4 | 4/4 | 3d 4b | div |
| `#CFDCC8` | 2 | 2 | 2/2 | 3d 4b | span |
| `#7E9675` | 2 | 2 | 2/3 (multi-role) | 3d 4b | span |
| `#C2B4AB` | 2 | 2 | 2/3 (multi-role) | 3d 4b | span |
| `#D8C9BF` | 2 | 2 | 2/61 (multi-role) | 2b 3b | div |
| `#DDD0C8` | 1 | 1 | 1/2 (multi-role) | 8c | span |
| `#F0E7E1` | 1 | 1 | 1/1 | 6d | div |
| `#F9F5F2` | 1 | 1 | 1/1 | 3e | div "22 clicks for V60, 18 for Ae" |
| `#CFC1B6` | 1 | 1 | 1/1 | 3f | div |
| `#E0D2C8` | 1 | 1 | 1/1 | 3f | div |
| `#DBCCC3` | 1 | 1 | 1/1 | 2b | div |

### role: `badge-bg` — 9 value(s), 106 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `#273D22` | 18 | 19 | 19/518 (multi-role) | 2a 2b 3a 3b 3c 3e 3f 4a 5d 5e 6a 6d 7a 7b 8d 8f 8j 8l | span "This week" / span "Locked in" |
| `#FFFCFA` | 17 | 43 | 43/170 (multi-role) | 1b 3c 3e 3f 4a 4b 5a 5b 5c 5d 5e 6d 7b 8f 8h 8j 8l | span "juicy" / span "peach" |
| `#F1E3D6` | 7 | 20 | 20/24 (multi-role) | 1b 2a 3d 4a 4b 5b 5c | span "Jasmine" / span "White peach" |
| `#EDE4DF` | 6 | 9 | 9/13 (multi-role) | 1b 2a 3d 3f 4a 4b | span "Ready-to-drink" / span "Medium" |
| `#E2EADC` | 4 | 4 | 4/4 | 1b 2a 4a 4b | span "I made it" |
| `#E6EFF5` | 4 | 4 | 4/4 | 1b 2a 4a 4b | span "Barista" |
| `#FFF8F1` | 3 | 4 | 4/6 (multi-role) | 7b 8c 8f | div |
| `#F2E4D2` | 1 | 2 | 2/2 | 6a | span "Home brewer" / span "¥300+" |
| `#EFD9C2` | 1 | 1 | 1/1 | 5d | div |

### role: `badge-fg` — 8 value(s), 99 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `#F4EDEA` | 19 | 24 | 24/68 (multi-role) | 2a 2b 3a 3b 3c 3e 3f 4a 5d 5e 6a 6d 7a 7b 8d 8f 8i 8j 8l | span "This week" / span "Locked in" |
| `#5C5049` | 14 | 39 | 39/141 (multi-role) | 1b 2a 3d 3f 4a 4b 5d 5e 6d 8f 8h 8i 8j 8l | span "peach" / span "tea-like" |
| `#8A4602` | 8 | 22 | 22/51 (multi-role) | 1b 2a 3d 4a 4b 5b 5c 6a | span "Home brewer" / span "¥300+" |
| `#273D22` | 4 | 4 | 4/518 (multi-role) | 3e 6a 6d 8f | span "juicy" / div "Y" |
| `#2F4A28` | 4 | 4 | 4/4 | 1b 2a 4a 4b | span "I made it" |
| `#0A5E92` | 4 | 4 | 4/4 | 1b 2a 4a 4b | span "Barista" |
| `#6B5D55` | 1 | 1 | 1/270 (multi-role) | 5b | div "Cooled down it turned into i" |
| `#FFFCFA` | 1 | 1 | 1/170 (multi-role) | 5d | span "2" |

### role: `heading-text` — 3 value(s), 81 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `#273D22` | 25 | 59 | 59/518 (multi-role) | 1b 2a 2b 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5c 5d 5e 6a 7a 7b 8c 8d 8e 8f 8g 8i | div "How do you usually brew?" / div "Try next" |
| `#9E5202` | 13 | 21 | 21/119 (multi-role) | 1b 2a 3a 3b 3c 3d 3e 3f 4a 4b 5b 5c 6a | div "11" / div "Where did it sit?" |
| `#5C5049` | 1 | 1 | 1/141 (multi-role) | 2a | div "The rest is unwritten" |

### role: `button-bg` — 7 value(s), 74 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `#FFFCFA` | 24 | 36 | 36/170 (multi-role) | 1b 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5d 5e 6a 6d 7a 7b 8e 8f 8g 8h 8i 8j 8m | button / button "Try next" |
| `#067BC2` | 18 | 20 | 20/41 (multi-role) | 1b 2b 3a 3c 3e 4a 4b 5a 5b 5c 5d 5e 6d 7b 8c 8d 8e 8j | button "Next" / button "See the plan" |
| `#F4EDEA` | 7 | 7 | 7/68 (multi-role) | 1b 3b 3c 5a 5b 5c 5e | button "Add tasting note" / button "Save without the note" |
| `#EDE4DF` | 3 | 4 | 4/13 (multi-role) | 1b 4a 4b | button "My beans" / button "My gear" |
| `#F1E3D6` | 3 | 4 | 4/24 (multi-role) | 2a 3b 3d | button / button "Finish bag" |
| `#FFF8F1` | 1 | 2 | 2/6 (multi-role) | 7a | button |
| `#FBEFE2` | 1 | 1 | 1/1 | 6a | button |

### role: `button-fg` — 6 value(s), 55 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `#FFFFFF` | 18 | 20 | 20/23 (multi-role) | 1b 2b 3a 3c 3e 4a 4b 5a 5b 5c 5d 5e 6d 7b 8c 8d 8e 8j | button "Next" / button "See the plan" |
| `#273D22` | 12 | 15 | 15/518 (multi-role) | 1b 3b 3d 3e 4a 4b 5a 5b 5c 5e 8f 8h | button "Try next" / button "Add" |
| `#9E5202` | 6 | 7 | 7/119 (multi-role) | 2b 6d 8c 8e 8h 8l | button "Skip all" / button "Not for me" |
| `#5C5049` | 5 | 6 | 6/141 (multi-role) | 5d 7a 7b 8e 8f | button "Add bag to my shelf" / button "How it is built" |
| `#6B5D55` | 4 | 5 | 5/270 (multi-role) | 1b 3e 4a 4b | button "My beans" / button "My gear" |
| `#8A4602` | 1 | 2 | 2/51 (multi-role) | 3d | button "Finish bag" |

### role: `texture` — 2 value(s), 34 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `#E3D4CA` | 16 | 16 | 16/16 | 1b 2a 2b 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5c 5d 5e | div |
| `#E4D6CC` | 5 | 18 | 18/97 (multi-role) | 1b 4a 4b 5b 5c | div |

### role: `shadow-ink` — 2 value(s), 30 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `#273D22` | 21 | 27 | 27/518 (multi-role) | 1b 2a 2b 3a 3c 3e 4a 4b 5a 5b 5c 5d 5e 6a 6d 7b 8c 8d 8e 8f 8j | button "Next" / div |
| `#9E5202` | 1 | 3 | 3/119 (multi-role) | 5d | div |

### role: `accent-marker` — 3 value(s), 23 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `#9E5202` | 5 | 20 | 20/119 (multi-role) | 5a 5d 5e 7b 8g | span |
| `#067BC2` | 1 | 2 | 2/41 (multi-role) | 7a | span |
| `#C8BCB4` | 1 | 1 | 1/157 (multi-role) | 5e | span |

### role: `divider` — 8 value(s), 12 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `#067BC2` | 4 | 4 | 4/41 (multi-role) | 3e 6d 8j 8l | span |
| `#B3A69E` | 1 | 2 | 2/20 (multi-role) | 5c | span |
| `#E4D6CC` | 1 | 1 | 1/97 (multi-role) | 8e | span |
| `#7E9675` | 1 | 1 | 1/3 (multi-role) | 4b | span |
| `#C2B4AB` | 1 | 1 | 1/3 (multi-role) | 4b | span |
| `#4A6640` | 1 | 1 | 1/14 (multi-role) | 3d | span |
| `#8C7E76` | 1 | 1 | 1/1 | 3d | span |
| `#D8C9BF` | 1 | 1 | 1/61 (multi-role) | 2a | div |

### role: `link` — 2 value(s), 10 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `#05639C` | 4 | 7 | 7/7 | 3f 4a 4b 5d | span "Go to first" / a "Manage my gear" |
| `#FFFFFF` | 3 | 3 | 3/23 (multi-role) | 1b 4a 4b | a "See all" |

### role: `fade` — 2 value(s), 8 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `rgba(244,237,234,0)` | 2 | 4 | 4/4 | 6a 8d | div |
| `#F4EDEA` | 2 | 4 | 4/68 (multi-role) | 6a 8d | div |

### role: `scrim` — 1 value(s), 2 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `rgba(39,61,34,.42)` | 2 | 2 | 2/2 | 2b 3b | div |

## Font sizes by role

### role: `eyebrow-uppercase` — 5 value(s), 308 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `10px` | 26 | 122 | 122/143 (multi-role) | 1b 2a 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5d 5e 6a 6d 7a 7b 8d 8e 8f 8h 8i 8j 8l 8m | div "Based on 147 cups" w700 / span "Stretch" w700 |
| `13px` | 20 | 21 | 21/126 (multi-role) | 1b 3a 3b 3d 3e 4a 4b 5a 5d 5e 6a 6d 8c 8e 8f 8g 8h 8i 8j 8m | div "Setup · 2 of 3" w700 / div "Try next" w700 |
| `12px` | 18 | 52 | 52/174 (multi-role) | 1b 2b 3a 3b 3c 3d 3e 4a 4b 5a 5b 5c 5d 5e 6a 6d 7b 8j | span "An idea" w700 / span "Logging" w700 |
| `11px` | 17 | 103 | 103/126 (multi-role) | 1b 2a 2b 3a 3c 3d 3f 4a 4b 5a 5b 5c 5d 5e 6a 8d 8l | span "Blackcurrant" w700 / span "Grapefruit" w700 |
| `9px` | 6 | 10 | 10/10 | 3b 4a 6a 7a 8d 8f | span "This week" w700 / span "Locked in" w700 |

### role: `body-sans` — 8 value(s), 302 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `12px` | 27 | 111 | 111/174 (multi-role) | 2a 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5c 5d 5e 6a 6d 7a 7b 8c 8d 8f 8g 8h 8i 8j 8l 8m | span "V60, Kalita…" w600 / span "C40, 1Zpresso…" w600 |
| `13px` | 20 | 69 | 69/126 (multi-role) | 1b 2a 3c 3f 4a 4b 5a 5b 5c 5e 6a 6d 7a 7b 8d 8e 8f 8g 8h 8j | div "You like bright and juicy. K" w500 / div "Two clicks coarser than your" w500 |
| `15px` | 14 | 57 | 57/58 (multi-role) | 3c 3e 4a 4b 5b 5e 6a 7a 8d 8g 8i 8j 8l 8m | span "Same bag, 2°C cooler" w700 / span "A natural process, once" w700 |
| `11px` | 11 | 20 | 20/126 (multi-role) | 3e 3f 5a 5b 5c 5e 6a 7a 7b 8d 8l | span "One step off your profile" w600 / span "juicy" w700 |
| `14px` | 10 | 18 | 18/24 (multi-role) | 1b 2a 3a 3e 5d 6d 7b 8c 8e 8g | div "Pick what you own now. This " w500 / div "Your last 20 cups lean brigh" w500 |
| `10px` | 3 | 21 | 21/143 (multi-role) | 1b 4a 4b | span "M" w700 / span "T" w700 |
| `13.5px` | 1 | 3 | 3/3 | 8m | span "Labels, buttons and the tast" w500 / span "Your notes and saved words s" w500 |
| `12.5px` | 1 | 3 | 3/3 | 5d | div "Nothing is lost — this cup i" w500 / span "Tap a star — this is the one" w600 |

### role: `display-serif` — 18 value(s), 84 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `40px` | 14 | 14 | 14/14 | 3a 3b 3c 3d 3e 3f 5a 5b 5c 5d 5e 6a 6d 8d | div "Try next" / div "My profile" |
| `30px` | 12 | 12 | 12/12 | 1b 2a 3a 3b 3c 3d 3e 3f 4a 4b 6a 8d | div "A washed Kenyan, ground coar" / div "Y" |
| `22px` | 6 | 18 | 18/18 | 1b 2a 3f 4a 4b 5b | span "4" / div "Try next" |
| `28px` | 6 | 6 | 6/6 | 1b 3c 4a 4b 5b 5c | div "Where did it sit?" / div "My taste DNA" |
| `44px` | 5 | 8 | 8/8 | 1b 2a 2b 4a 4b | div "Good morning" / div "{{ week }}" |
| `26px` | 3 | 5 | 5/5 | 3b 3f 8e | span "28" / span "92°" |
| `24px` | 3 | 3 | 3/3 | 3d 5c 8i | span "08:00" / div "One more cup" |
| `96px` | 3 | 3 | 3/3 | 1b 4a 4b | div "{{ cups }}" |
| `32px` | 2 | 4 | 4/4 | 2b 6a | div "147" / div "23" |
| `21px` | 1 | 3 | 3/3 | 2a | span "4" / span "5" |
| `33px` | 1 | 1 | 1/1 | 8c | div "How do you usually brew?" |
| `38px` | 1 | 1 | 1/1 | 8e | div "A washed Kenyan, ground coar" |
| `42px` | 1 | 1 | 1/1 | 8f | div "Bright, juicy, lightly sweet" |
| `34px` | 1 | 1 | 1/1 | 8g | div "Nothing here is a guess abou" |
| `31px` | 1 | 1 | 1/1 | 7a | div "Notifications" |
| `36px` | 1 | 1 | 1/1 | 7b | div "Taste DNA now reads your not" |
| `27px` | 1 | 1 | 1/1 | 6a | div "Bright, juicy, lightly sweet" |
| `20px` | 1 | 1 | 1/1 | 5b | div "Cooled down it turned into i" |

### role: `title-sans` — 3 value(s), 71 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `16px` | 18 | 62 | 62/77 (multi-role) | 1b 2b 3a 3b 3c 3d 3e 3f 4a 4b 5a 5d 5e 7a 8c 8h 8l 8m | span "Pour-over dripper" w700 / span "Hand grinder" w700 |
| `19px` | 5 | 5 | 5/5 | 3a 3b 3c 3d 6a | div "Yuka M." w700 / span "/ 8" |
| `17px` | 2 | 4 | 4/4 | 2a 6d | span "Yuka M." w700 / div "Ethiopia Guji" w700 |

### role: `button-label` — 6 value(s), 58 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `16px` | 15 | 15 | 15/77 (multi-role) | 1b 2b 3a 3c 3e 4a 4b 5a 5b 5c 5d 5e 7b 8c 8e | button "Next" w700 / button "Log a cup with this plan" w700 |
| `13px` | 12 | 22 | 22/126 (multi-role) | 1b 3c 4a 4b 5d 6d 7b 8c 8e 8f 8h 8l | button "Skip all" w700 / button "Add bag to my shelf" w700 |
| `12px` | 6 | 11 | 11/174 (multi-role) | 2b 3d 5a 6d 8h 8j | button "Add" w700 / button "Send" w700 |
| `14px` | 6 | 6 | 6/24 (multi-role) | 1b 3b 5a 5b 5c 5e | button "Add tasting note" w700 / button "Save without the note" w700 |
| `11px` | 2 | 3 | 3/126 (multi-role) | 3e 7a | button "Mark all read" w700 / button "Replace" w700 |
| `15px` | 1 | 1 | 1/58 (multi-role) | 8d | button "See the plan" w700 |

### role: `badge-label` — 1 value(s), 14 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `13px` | 3 | 14 | 14/126 (multi-role) | 8f 8h 8l | span "juicy" w700 / span "peach" w700 |

## Font weights by role

### role: `eyebrow-uppercase` — 2 value(s), 308 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `700` | 30 | 302 | 302/551 (multi-role) | 1b 2a 2b 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5c 5d 5e 6a 6d 7a 7b 8c 8d 8e 8f 8g 8h 8i 8j 8l 8m | div "Setup · 2 of 3" / div "Based on 147 cups" |
| `600` | 6 | 6 | 6/56 (multi-role) | 1b 4a 4b 5a 5d 5e | span "Optional" / div "Opens at 5 cups" |

### role: `body-sans` — 3 value(s), 302 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `500` | 29 | 134 | 134/142 (multi-role) | 1b 2a 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5c 5d 5e 6a 6d 7a 7b 8c 8d 8e 8f 8g 8h 8i 8j 8l 8m | div "Pick what you own now. This " / div "You like bright and juicy. K" |
| `700` | 22 | 119 | 119/551 (multi-role) | 1b 3c 3e 3f 4a 4b 5a 5b 5d 5e 6a 6d 7a 7b 8d 8e 8f 8g 8i 8j 8l 8m | span "Same bag, 2°C cooler" / span "A natural process, once" |
| `600` | 18 | 49 | 49/56 (multi-role) | 2a 3f 5a 5b 5c 5d 5e 6a 6d 7a 7b 8c 8d 8f 8h 8i 8j 8m | span "V60, Kalita…" / span "C40, 1Zpresso…" |

### role: `title-sans` — 3 value(s), 67 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `700` | 20 | 58 | 58/551 (multi-role) | 1b 2a 2b 3a 3b 3c 3d 3e 3f 4a 4b 5a 5d 5e 6a 6d 7a 8c 8h 8m | span "Pour-over dripper" / span "Hand grinder" |
| `500` | 3 | 8 | 8/142 (multi-role) | 2b 3c 3e | div "Comandante" / div "Apr 2" |
| `600` | 1 | 1 | 1/56 (multi-role) | 8l | span "juicy" |

### role: `button-label` — 1 value(s), 58 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `700` | 24 | 58 | 58/551 (multi-role) | 1b 2b 3a 3b 3c 3d 3e 4a 4b 5a 5b 5c 5d 5e 6d 7a 7b 8c 8d 8e 8f 8h 8j 8l | button "Skip all" / button "Next" |

### role: `badge-label` — 1 value(s), 14 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `700` | 3 | 14 | 14/551 (multi-role) | 8f 8h 8l | span "juicy" / span "peach" |

## Line heights by role (grouped with the font-size they sit on)

### role: `display @22px` — 1 value(s), 18 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `1` | 6 | 18 | 18/54 (multi-role) | 1b 2a 3f 4a 4b 5b | span "4" / div "Try next" |

### role: `display @40px` — 2 value(s), 13 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `1` | 11 | 11 | 11/54 (multi-role) | 3a 3b 3c 3d 3e 5a 5b 5d 5e 6a 8d | div "Try next" / div "My profile" |
| `1.02` | 2 | 2 | 2/7 (multi-role) | 3f 5c | div "Noted." / div "Finished bags" |

### role: `sans @13px` — 2 value(s), 13 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `1.45` | 5 | 6 | 6/11 (multi-role) | 1b 4a 4b 6d 7a | div "Your own words feed the prof" / div "A 3-cup experiment that shar" |
| `1.5` | 4 | 7 | 7/18 (multi-role) | 8d 8e 8f 8g | div "You like bright and juicy. K" / div "Two clicks coarser than your" |

### role: `display @30px` — 3 value(s), 11 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `.9` | 7 | 7 | 7/7 | 2a 3a 3b 3c 3d 3e 3f | div "3" / div "2" |
| `1` | 3 | 3 | 3/54 (multi-role) | 1b 4a 4b | div "My taste DNA" |
| `1.1` | 1 | 1 | 1/3 (multi-role) | 8d | div "A washed Kenyan, ground coar" |

### role: `sans @14px` — 3 value(s), 9 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `1.5` | 4 | 6 | 6/18 (multi-role) | 1b 3e 7b 8c | div "Pick what you own now. This " / span "Your 31 saved words are alre" |
| `1.6` | 2 | 2 | 2/3 (multi-role) | 7b 8e | div "Your last 20 cups lean brigh" / div "Until now your profile was b" |
| `1.55` | 1 | 1 | 1/1 | 8g | div "Your profile is arithmetic o" |

### role: `sans @12px` — 3 value(s), 9 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `1.45` | 4 | 4 | 4/11 (multi-role) | 8h 8i 8j 8m | span "Words appear as chips when y" / span "System permission is on for " |
| `1.4` | 3 | 3 | 3/9 (multi-role) | 3c 3e 6a | div "Logging since Jan 2026 · 34 " / div "Shot Apr 2. Shows on every c" |
| `1.5` | 2 | 2 | 2/18 (multi-role) | 8h 8i | div "Tap a word to rename it ever" / div "Everything except Updates &a" |

### role: `display @44px` — 2 value(s), 8 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `1.02` | 5 | 5 | 5/7 (multi-role) | 1b 2a 2b 4a 4b | div "Good morning" / div "Records" |
| `.8` | 3 | 3 | 3/3 | 1b 4a 4b | div "{{ week }}" |

### role: `display @28px` — 1 value(s), 6 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `1` | 6 | 6 | 6/54 (multi-role) | 1b 3c 4a 4b 5b 5c | div "Where did it sit?" / div "My taste DNA" |

### role: `display @26px` — 1 value(s), 5 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `1` | 3 | 5 | 5/54 (multi-role) | 3b 3f 8e | span "28" / span "92°" |

### role: `sans @15px` — 2 value(s), 4 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `1.3` | 1 | 3 | 3/5 (multi-role) | 7a | div "Export your cups as CSV" / div "Backups moved to nightly" |
| `1.6` | 1 | 1 | 1/3 (multi-role) | 8j | div "I would love to mark a bag a" |

### role: `display @32px` — 1 value(s), 4 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `1` | 2 | 4 | 4/54 (multi-role) | 2b 6a | div "147" / div "23" |

### role: `display @24px` — 1 value(s), 3 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `1` | 3 | 3 | 3/54 (multi-role) | 3d 5c 8i | span "08:00" / div "One more cup" |

### role: `sans @13.5px` — 1 value(s), 3 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `1.5` | 1 | 3 | 3/18 (multi-role) | 8m | span "Labels, buttons and the tast" / span "Your notes and saved words s" |

### role: `sans @11px` — 1 value(s), 3 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `1.4` | 3 | 3 | 3/9 (multi-role) | 3f 5a 5e | span "Marked fields are required —" / span "Bottled cups skip brewing an" |

### role: `sans @12.5px` — 2 value(s), 3 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `1.4` | 1 | 2 | 2/9 (multi-role) | 5d | span "Tap a star — this is the one" / span "Rating and café are still em" |
| `1.45` | 1 | 1 | 1/11 (multi-role) | 5d | div "Nothing is lost — this cup i" |

### role: `display @96px` — 1 value(s), 3 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `.82` | 3 | 3 | 3/3 | 1b 4a 4b | div "{{ cups }}" |

### role: `display @21px` — 1 value(s), 3 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `1` | 1 | 3 | 3/54 (multi-role) | 2a | span "4" / span "5" |

### role: `sans @16px` — 1 value(s), 2 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `1.3` | 1 | 2 | 2/5 (multi-role) | 7a | div "Taste DNA now reads your not" / div "One bag, three grinds" |

### role: `display @33px` — 1 value(s), 1 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `1.1` | 1 | 1 | 1/3 (multi-role) | 8c | div "How do you usually brew?" |

### role: `display @38px` — 1 value(s), 1 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `1.06` | 1 | 1 | 1/1 | 8e | div "A washed Kenyan, ground coar" |

### role: `display @42px` — 1 value(s), 1 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `1.04` | 1 | 1 | 1/1 | 8f | div "Bright, juicy, lightly sweet" |

### role: `display @34px` — 1 value(s), 1 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `1.08` | 1 | 1 | 1/2 (multi-role) | 8g | div "Nothing here is a guess abou" |

### role: `display @31px` — 1 value(s), 1 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `1` | 1 | 1 | 1/54 (multi-role) | 7a | div "Notifications" |

### role: `display @36px` — 1 value(s), 1 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `1.08` | 1 | 1 | 1/2 (multi-role) | 7b | div "Taste DNA now reads your not" |

### role: `display @27px` — 1 value(s), 1 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `1.1` | 1 | 1 | 1/3 (multi-role) | 6a | div "Bright, juicy, lightly sweet" |

### role: `display @20px` — 1 value(s), 1 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `1.4` | 1 | 1 | 1/9 (multi-role) | 5b | div "Cooled down it turned into i" |

## Letter spacing by role (grouped with the font-size they sit on)

### role: `uppercase @10px` — 5 value(s), 122 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `.16em` | 22 | 73 | 73/82 (multi-role) | 2a 3a 3b 3c 3d 3e 3f 5a 5b 5d 5e 6a 6d 7a 8d 8e 8f 8h 8i 8j 8l 8m | div "Based on 147 cups" / div "Also worth a cup" |
| `.12em` | 10 | 23 | 23/43 (multi-role) | 1b 2a 3f 4a 4b 6a 7b 8d 8e 8m | span "Stretch" / span "One step off profile" |
| `.1em` | 4 | 15 | 15/51 (multi-role) | 5a 5d 5e 8e | span "Clicks" / span "Water" |
| `.08em` | 4 | 8 | 8/92 (multi-role) | 3c 3d 3f 5b | span "3 of 5" / span "Photo" |
| `.14em` | 1 | 3 | 3/3 | 6a | div "Cups" / div "Bags" |

### role: `uppercase @11px` — 7 value(s), 106 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `.06em` | 9 | 35 | 35/72 (multi-role) | 1b 2a 4a 4b 5a 5d 5e 6a 8l | span "Words" / span "Beans" |
| `.08em` | 8 | 25 | 25/92 (multi-role) | 2a 3a 3d 3e 3f 4b 5d 7a | button "Mark all read" / span "Go to first" |
| `.1em` | 6 | 24 | 24/51 (multi-role) | 1b 4a 4b 5b 5c 6a | div "Yuka M." / div |
| `.16em` | 6 | 9 | 9/82 (multi-role) | 1b 2a 2b 3c 3f 4b | div "Cups total" / div "This week" |
| `.22em` | 4 | 4 | 4/4 | 1b 2a 2b 5c | div "Cup 4 · logged 08:21" / div "The archive" |
| `.04em` | 2 | 5 | 5/14 (multi-role) | 6a 8d | span "Blackcurrant" / span "Grapefruit" |
| `0.16em` | 2 | 4 | 4/4 | 4a 4b | div "MoreCoffee" / div "Cups total" |

### role: `uppercase @12px` — 4 value(s), 63 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `.08em` | 14 | 32 | 32/92 (multi-role) | 2b 3c 3d 3e 4a 4b 5a 5b 5d 5e 6a 6d 8h 8j | button "Add" / button "Send" |
| `.06em` | 9 | 20 | 20/72 (multi-role) | 1b 3a 3b 3d 4a 4b 5b 6d 8j | span "An idea" / span "Logging" |
| `.1em` | 7 | 10 | 10/51 (multi-role) | 1b 4a 4b 5a 5c 5d 5e | div "Wed, Apr 8" / div "08:20 · Morning" |
| `.12em` | 1 | 1 | 1/43 (multi-role) | 7b | div "Notifications" |

### role: `uppercase @13px` — 3 value(s), 33 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `.08em` | 11 | 21 | 21/92 (multi-role) | 1b 3a 3b 3c 3d 3e 4a 4b 5a 5d 5e | span "Add a photo" / button "Keep as draft" |
| `.12em` | 10 | 11 | 11/43 (multi-role) | 6a 6d 8c 8e 8f 8g 8h 8i 8j 8m | div "Setup · 2 of 3" / div "Try next" |
| `.06em` | 1 | 1 | 1/72 (multi-role) | 8f | button "Try next" |

### role: `sentence @10px` — 1 value(s), 21 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `.02em` | 3 | 21 | 21/21 | 1b 4a 4b | span "M" / span "T" |

### role: `uppercase @16px` — 1 value(s), 15 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `.06em` | 15 | 15 | 15/72 (multi-role) | 1b 2b 3a 3c 3e 4a 4b 5a 5b 5c 5d 5e 7b 8c 8e | button "Next" / button "Log a cup with this plan" |

### role: `uppercase @9px` — 2 value(s), 10 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `.12em` | 4 | 8 | 8/43 (multi-role) | 6a 7a 8d 8f | span "This week" / span "Locked in" |
| `.1em` | 2 | 2 | 2/51 (multi-role) | 3b 4a | span "Default" |

### role: `uppercase @14px` — 1 value(s), 6 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `.08em` | 6 | 6 | 6/92 (multi-role) | 1b 3b 5a 5b 5c 5e | button "Add tasting note" / button "Save without the note" |

### role: `sentence @11px` — 1 value(s), 4 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `.04em` | 2 | 4 | 4/14 (multi-role) | 5b 5c | div "Not noted" / span "Where it sat before" |

### role: `sentence @12px` — 1 value(s), 3 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `.04em` | 3 | 3 | 3/14 (multi-role) | 2a 5a 5e | span "All three required fields ar" / span "Rating and product are set" |

### role: `sentence @13px` — 1 value(s), 2 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `.04em` | 2 | 2 | 2/14 (multi-role) | 5a 5e | div "Would order again" / div "Fine for a desk afternoon" |

### role: `uppercase @15px` — 1 value(s), 1 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `.06em` | 1 | 1 | 1/72 (multi-role) | 8d | button "See the plan" |

## Spacing by role

### role: `stack-gap` — 18 value(s), 629 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `12px` | 27 | 119 | 119/160 (multi-role) | 1b 2b 3a 3b 3c 3d 3f 4a 4b 5a 5c 5d 5e 6a 6d 7a 7b 8c 8d 8e 8f 8g 8h 8i 8j 8l 8m | gap:12px · div / gap:12px · button |
| `9px` | 25 | 54 | 54/97 (multi-role) | 2a 3a 3c 3d 3e 3f 4b 5a 5b 5d 5e 6a 6d 7a 7b 8c 8d 8e 8f 8g 8h 8i 8j 8l 8m | gap:9px · div / gap:9px · button "Add tasting note" |
| `10px` | 20 | 50 | 50/62 (multi-role) | 1b 2a 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5d 5e 6a 6d 7b 8d 8e 8l | gap:10px · div / gap:10px · button |
| `3px` | 19 | 51 | 51/104 (multi-role) | 1b 2a 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5d 5e 6a 7a 8d 8e 8g | gap:3px · div / gap:3px · span |
| `8px` | 17 | 57 | 57/113 (multi-role) | 1b 2b 3e 3f 4a 4b 5a 5b 5c 5d 5e 6a 6d 7a 8d 8f 8j | gap:8px · div / gap:8px · button |
| `14px` | 17 | 51 | 51/177 (multi-role) | 1b 2a 2b 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5d 5e 6a 7b | gap:14px · div |
| `5px` | 13 | 63 | 63/73 (multi-role) | 1b 2a 3b 3c 3d 3f 4a 4b 5a 5d 5e 7a 8d | gap:5px · div / gap:5px · span |
| `7px` | 13 | 30 | 30/52 (multi-role) | 2a 3a 3b 3c 3e 4a 5a 5b 5d 5e 8f 8h 8l | gap:7px · div |
| `4px` | 11 | 34 | 34/61 (multi-role) | 1b 2a 3a 3f 4a 4b 5c 5d 6a 8f 8l | gap:4px · div / gap:4px · span |
| `6px` | 11 | 29 | 29/62 (multi-role) | 1b 2a 3c 4a 4b 5a 5d 5e 6a 8c 8i | gap:6px · div / gap:6px · a "See all" |
| `11px` | 11 | 24 | 24/82 (multi-role) | 5a 5b 5c 5d 5e 6a 7a 7b 8e 8i 8m | gap:11px · div / gap:11px · button |
| `2px` | 10 | 26 | 26/48 (multi-role) | 1b 4a 4b 5b 6a 7b 8g 8i 8j 8m | gap:2px · div |
| `13px` | 9 | 29 | 29/59 (multi-role) | 3b 3c 3d 3f 5a 5d 5e 8g 8m | gap:13px · div / gap:13px · button |
| `20px` | 6 | 6 | 6/58 (multi-role) | 1b 3e 4a 4b 5b 5c | gap:20px · div |
| `16px` | 2 | 2 | 2/153 (multi-role) | 2b 6d | gap:16px · div |
| `18px` | 2 | 2 | 2/47 (multi-role) | 3b 3c | gap:18px · div |
| `15px` | 1 | 1 | 1/74 (multi-role) | 8f | gap:15px · div |
| `22px` | 1 | 1 | 1/193 (multi-role) | 2b | gap:22px · div |

### role: `container-inset` — 24 value(s), 473 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `0` | 30 | 119 | 119/306 (multi-role) | 1b 2a 2b 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5c 5d 5e 6a 6d 7a 7b 8c 8d 8e 8f 8g 8h 8i 8j 8l 8m | padding:56px 0 0 · div / padding:60px 0 100px · div |
| `16px` | 21 | 58 | 58/153 (multi-role) | 1b 2a 3b 3d 3e 3f 4a 4b 5b 5c 6a 6d 8c 8d 8e 8f 8g 8h 8i 8j 8m | padding:15px 16px · div / padding:18px 16px · div |
| `60px` | 18 | 18 | 18/18 | 1b 2a 2b 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5c 5d 5e 6a 8d | padding:60px 0 100px · div / padding:60px 0 0 · div |
| `14px` | 15 | 52 | 52/177 (multi-role) | 1b 2b 3a 3c 3d 3e 4a 4b 5b 6a 6d 7b 8d 8e 8h | padding:14px 16px · div / padding:14px 8px · div |
| `4px` | 14 | 19 | 19/61 (multi-role) | 1b 2a 2b 3a 3b 3c 3d 3e 3f 4a 4b 6a 7a 8d | padding:0 4px · div / padding:4px 7px · span "Tip" |
| `56px` | 12 | 12 | 12/12 | 6d 7a 7b 8c 8e 8f 8g 8h 8i 8j 8l 8m | padding:56px 0 0 · div / padding:56px 0 34px · div |
| `15px` | 11 | 29 | 29/74 (multi-role) | 1b 3b 3f 4a 4b 6a 8c 8g 8i 8j 8m | padding:15px 16px · div / padding:0 15px · a "See all" |
| `12px` | 11 | 20 | 20/160 (multi-role) | 1b 2a 3a 3e 3f 4a 4b 5a 5d 5e 8e | padding-top:12px · div / padding-top:12px · div "Would order again" |
| `6px` | 9 | 16 | 16/62 (multi-role) | 2a 4a 4b 5a 5b 5d 5e 6a 8l | padding:6px 9px · span "juicy" / padding:11px 6px · span "Safe" |
| `9px` | 7 | 18 | 18/97 (multi-role) | 2b 3c 3e 6a 8d 8e 8l | padding:7px 9px · span "Blackcurrant" / padding:7px 9px · span "Grapefruit" |
| `34px` | 7 | 9 | 9/28 (multi-role) | 1b 2a 4a 4b 6a 7a 8d | padding:30px 0 34px · div / padding:56px 0 34px · div |
| `30px` | 6 | 8 | 8/8 | 1b 2a 4a 4b 6a 8d | padding:30px 0 34px · div |
| `3px` | 5 | 23 | 23/104 (multi-role) | 1b 3e 3f 4a 4b | padding-bottom:3px · span "6" / padding-bottom:3px · span "7" |
| `11px` | 5 | 17 | 17/82 (multi-role) | 2a 3e 5b 6a 8i | padding:11px 0 · span "M" / padding:11px 0 · span "T" |
| `13px` | 5 | 12 | 12/59 (multi-role) | 3c 3d 3f 4b 6a | padding:13px 16px · a / padding:15px 0 13px · div |
| `7px` | 4 | 13 | 13/52 (multi-role) | 3a 6a 7a 8d | padding:7px 10px · span "Stretch" / padding:7px 9px · span "Blackcurrant" |
| `2px` | 4 | 8 | 8/48 (multi-role) | 8g 8i 8j 8m | padding:2px · span |
| `10px` | 4 | 4 | 4/62 (multi-role) | 1b 4a 4b 8d | padding:7px 10px · span "Stretch" / padding-top:10px · div "A slow start is still a star" |
| `18px` | 4 | 4 | 4/47 (multi-role) | 2a 5c 6a 8d | padding:18px 16px · div / padding:18px · div |
| `8px` | 2 | 6 | 6/113 (multi-role) | 6a 8e | padding:14px 8px · div |
| `100px` | 2 | 4 | 4/4 | 6a 8d | padding:60px 0 100px · div / padding:44px 0 100px · div |
| `44px` | 1 | 2 | 2/2 | 6a | padding:44px 0 100px · div |
| `5px` | 1 | 1 | 1/73 (multi-role) | 8e | padding:5px 9px · span "One step off profile" |
| `20px` | 1 | 1 | 1/58 (multi-role) | 2a | padding:20px 18px · div |

### role: `screen-padding-block` — 12 value(s), 322 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `0` | 30 | 139 | 139/306 (multi-role) | 1b 2a 2b 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5c 5d 5e 6a 6d 7a 7b 8c 8d 8e 8f 8g 8h 8i 8j 8l 8m | padding:0 22px 12px · div / padding:14px 22px 0 · div |
| `20px` | 21 | 40 | 40/58 (multi-role) | 1b 3a 3c 3d 3e 4a 4b 5a 5b 5c 5e 6a 6d 7a 8c 8e 8f 8h 8i 8j 8l | padding:20px 22px 0 · div / padding:20px 22px 38px · div |
| `14px` | 21 | 29 | 29/177 (multi-role) | 1b 2a 2b 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5c 5d 5e 6a 7a 8c 8d 8l | padding:14px 22px 0 · div / padding:0 22px 14px · div |
| `34px` | 19 | 19 | 19/28 (multi-role) | 2b 3a 3b 3c 3e 3f 5a 5b 5c 5d 5e 6d 7b 8e 8f 8h 8i 8j 8m | padding:20px 22px 34px · div / padding:18px 22px 34px · div |
| `18px` | 18 | 26 | 26/47 (multi-role) | 1b 3a 3b 3e 3f 4a 4b 5d 6d 7b 8d 8e 8f 8g 8h 8i 8j 8l | padding:18px 22px 0 · div / padding:18px 22px 34px · div |
| `22px` | 17 | 21 | 21/193 (multi-role) | 1b 2a 2b 3b 3d 4a 4b 5c 6a 6d 7b 8c 8d 8e 8f 8i 8m | padding:22px 22px 0 · div / padding:22px 22px 34px · div |
| `16px` | 17 | 18 | 18/153 (multi-role) | 1b 2a 2b 3a 3d 3f 4a 4b 5a 5b 5d 5e 7a 7b 8e 8f 8m | padding:16px 22px 0 · div / padding:16px 22px 34px · div |
| `12px` | 11 | 16 | 16/160 (multi-role) | 6a 6d 7b 8c 8e 8f 8g 8h 8i 8j 8m | padding:0 22px 12px · div / padding:12px 22px 0 · div |
| `24px` | 6 | 6 | 6/6 | 1b 3c 4a 4b 6d 8g | padding:24px 22px 0 · div / padding:0 22px 24px · div |
| `26px` | 6 | 6 | 6/6 | 2a 3a 3c 3e 5b 5c | padding:26px 22px 34px · div / padding:26px 22px 0 · div |
| `38px` | 1 | 1 | 1/1 | 8c | padding:20px 22px 38px · div |
| `10px` | 1 | 1 | 1/62 (multi-role) | 2a | padding:22px 22px 10px · div |

### role: `badge-inset` — 17 value(s), 212 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `18px` | 11 | 12 | 12/47 (multi-role) | 1b 3c 3e 4a 4b 5a 5b 5c 5d 5e 7b | padding:18px 16px · div / padding:20px 18px · div |
| `11px` | 10 | 37 | 37/82 (multi-role) | 2a 5b 5d 5e 6a 6d 8f 8h 8j 8l | padding:9px 11px · span "juicy" / padding:9px 11px · span "peach" |
| `8px` | 10 | 34 | 34/113 (multi-role) | 1b 2a 3d 3f 4a 4b 6a 7b 8d 8f | padding:4px 8px · span "This week" / padding:5px 8px · span "Locked in" |
| `14px` | 9 | 11 | 11/177 (multi-role) | 2b 3c 3e 5b 5d 6d 7b 8f 8l | padding:14px 16px · div / padding:12px 14px · div |
| `9px` | 8 | 25 | 25/97 (multi-role) | 2b 3c 3e 3f 6a 8f 8h 8l | padding:9px 11px · span "juicy" / padding:9px 11px · span "peach" |
| `16px` | 7 | 9 | 9/153 (multi-role) | 5a 5d 5e 6d 7b 8c 8f | padding:15px 16px · div / padding:14px 16px · div |
| `20px` | 7 | 8 | 8/58 (multi-role) | 1b 3c 3e 4a 4b 5b 5c | padding:20px 18px · div |
| `3px` | 6 | 30 | 30/104 (multi-role) | 1b 2a 3d 3f 4a 4b | padding:3px 8px · span "Filter" / padding:3px 8px · span "I made it" |
| `6px` | 6 | 6 | 6/62 (multi-role) | 1b 2a 4a 4b 5c 6a | padding:11px 6px · span "Stretch" / padding:6px 10px · span "Early signs" |
| `7px` | 5 | 6 | 6/52 (multi-role) | 3a 3b 4a 6a 7a | padding:4px 7px · span "Update" / padding:7px 10px · span "Home brewer" |
| `10px` | 5 | 5 | 5/62 (multi-role) | 1b 4a 4b 5c 6a | padding:7px 10px · span "Home brewer" / padding:6px 10px · span "Early signs" |
| `13px` | 3 | 11 | 11/59 (multi-role) | 3f 6d 8j | padding:11px 13px · span "An idea" / padding:11px 13px · span "Logging" |
| `15px` | 3 | 9 | 9/74 (multi-role) | 5d 5e 8c | padding:15px 16px · div / padding:14px 15px · div |
| `4px` | 3 | 3 | 3/61 (multi-role) | 6a 7a 8d | padding:4px 8px · span "This week" / padding:4px 7px · span "Update" |
| `5px` | 2 | 2 | 2/73 (multi-role) | 7b 8f | padding:5px 8px · span "Locked in" / padding:5px 8px · span "Update" |
| `12px` | 2 | 2 | 2/160 (multi-role) | 3a 8l | padding:12px 14px · div / padding:7px 12px · span "Brewer" |
| `2px` | 2 | 2 | 2/48 (multi-role) | 3b 4a | padding:2px 7px · span "Default" |

### role: `control-inset` — 10 value(s), 196 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `16px` | 18 | 65 | 65/153 (multi-role) | 1b 3a 3b 3d 3e 4a 4b 5a 5d 5e 6a 6d 7a 8d 8f 8g 8j 8l | padding:16px · button "See the plan" / padding:15px 16px · button |
| `0` | 17 | 43 | 43/306 (multi-role) | 2b 3b 3c 3e 5a 5d 5e 6a 6d 7a 7b 8c 8e 8f 8h 8j 8l | padding:8px 0 · button "Skip all" / padding:8px 0 · button "Add bag to my shelf" |
| `14px` | 13 | 30 | 30/177 (multi-role) | 1b 2b 3a 3b 3d 3e 4a 4b 5a 5d 5e 6a 7a | padding:14px 16px · button / padding:0 14px · button |
| `15px` | 9 | 35 | 35/74 (multi-role) | 3b 3c 5a 6a 7a 8d 8g 8j 8l | padding:15px 16px · button / padding:11px 15px · button "I made it" |
| `8px` | 7 | 9 | 9/113 (multi-role) | 6d 7b 8c 8e 8f 8h 8l | padding:8px 0 · button "Skip all" / padding:8px 0 · button "Add bag to my shelf" |
| `13px` | 3 | 3 | 3/59 (multi-role) | 5e 6a 8h | padding:0 13px · button "Add" / padding:13px 16px · button |
| `18px` | 3 | 3 | 3/47 (multi-role) | 1b 4a 4b | padding:16px 18px · button |
| `11px` | 2 | 4 | 4/82 (multi-role) | 5a 7a | padding:0 11px · button "Mark all read" / padding:11px 15px · button "I made it" |
| `12px` | 2 | 3 | 3/160 (multi-role) | 2b 3e | padding:0 12px · button "Replace" / padding:0 12px · button "Remove photo" |
| `6px` | 1 | 1 | 1/62 (multi-role) | 6d | padding:6px 0 · button "Remove photo" |

### role: `screen-gutter` — 1 value(s), 163 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `22px` | 30 | 163 | 163/193 (multi-role) | 1b 2a 2b 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5c 5d 5e 6a 6d 7a 7b 8c 8d 8e 8f 8g 8h 8i 8j 8l 8m | padding:0 22px 12px · div / padding:14px 22px 0 · div |

### role: `container-margin` — 14 value(s), 72 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `2px` | 7 | 12 | 12/48 (multi-role) | 1b 3b 4a 4b 6a 8j 8m | margin-top:2px · svg / margin-left:2px · span |
| `5px` | 7 | 7 | 7/73 (multi-role) | 3a 3b 3c 3d 3e 3f 5b | margin-top:5px · div "Skippable" / margin-top:5px · div "Selected" |
| `22px` | 5 | 8 | 8/193 (multi-role) | 1b 4a 4b 5c 8g | margin:20px 22px 0 · div / margin-top:22px · div |
| `4px` | 5 | 5 | 5/61 (multi-role) | 2a 5a 5d 5e 8d | margin-bottom:4px · span "Stretch" / margin-top:4px · div "08:20 · Morning" |
| `0` | 5 | 5 | 5/306 (multi-role) | 1b 4a 4b 5c 8g | margin:20px 22px 0 · div / margin:8px 0 16px · div "This cup pushed you brighter" |
| `8px` | 4 | 7 | 7/113 (multi-role) | 1b 4a 4b 5c | margin:8px 0 16px · div "This cup pushed you brighter" / margin-bottom:8px · svg |
| `6px` | 3 | 10 | 10/62 (multi-role) | 5b 7a 8g | margin-top:6px · span / margin-bottom:6px · div |
| `20px` | 3 | 3 | 3/58 (multi-role) | 5b 5c 8g | margin:20px 22px 0 · div / margin-bottom:20px · div "Drag only what you noticed. " |
| `10px` | 2 | 2 | 2/62 (multi-role) | 4a 4b | margin-bottom:10px · div "Cups total" |
| `14px` | 1 | 4 | 4/177 (multi-role) | 3d | margin-top:14px · div |
| `13px` | 1 | 4 | 4/59 (multi-role) | 3f | margin-top:13px · div |
| `7px` | 1 | 3 | 3/52 (multi-role) | 7b | margin-top:7px · span |
| `16px` | 1 | 1 | 1/153 (multi-role) | 5c | margin:8px 0 16px · div "This cup pushed you brighter" |
| `1px` | 1 | 1 | 1/1 | 5d | margin-top:1px · svg |

### role: `optical-negative-margin` — 4 value(s), 18 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `-2px` | 13 | 14 | 14/14 | 1b 4a 4b 6d 7a 7b 8e 8f 8g 8h 8i 8j 8m | margin-left:-2px · button / margin-bottom:-2px · div |
| `-6px` | 2 | 2 | 2/2 | 2b 3b | margin-top:-6px · div |
| `-14px` | 1 | 1 | 1/1 | 2b | margin:-14px -12px · button "Reset" |
| `-12px` | 1 | 1 | 1/1 | 2b | margin:-14px -12px · button "Reset" |

## Icons — size / stroke-width pairs

### role: `stroke-icon` — 29 value(s), 159 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `18px / sw 2.4` | 21 | 21 | 21/21 | 3a 3b 3c 3d 3f 5a 5b 5d 5e 6d 7a 7b 8c 8e 8f 8g 8h 8i 8j 8l 8m |  |
| `18px / sw 2.2` | 10 | 37 | 37/37 | 2a 5a 5d 5e 6a 8d 8e 8g 8i 8m |  |
| `17px / sw 2.6` | 5 | 5 | 5/5 | 1b 3a 3b 3d 3e |  |
| `20px / sw 2.2` | 4 | 22 | 22/22 | 5d 6a 7b 8j |  |
| `18px / sw 2.6` | 4 | 6 | 6/6 | 1b 4a 4b 8m |  |
| `20px / sw 2` | 4 | 6 | 6/6 | 3c 5a 5d 5e |  |
| `22px / sw 1.8` | 4 | 4 | 4/4 | 1b 4a 4b 5c |  |
| `13px / sw 3.4` | 3 | 9 | 9/9 | 5a 5d 5e |  |
| `38px / sw 2` | 3 | 8 | 8/8 | 5a 5d 5e |  |
| `24px / sw 1.8` | 3 | 3 | 3/3 | 1b 4a 4b |  |
| `14px / sw 2.6` | 3 | 3 | 3/3 | 1b 4a 4b |  |
| `17px / sw 2.2` | 3 | 3 | 3/3 | 2a 3a 3e |  |
| `14px / sw 3.2` | 2 | 4 | 4/4 | 3a 8c |  |
| `16px / sw 2.2` | 2 | 2 | 2/2 | 6a 6d |  |
| `14px / sw 3.4` | 2 | 2 | 2/2 | 5a 5e |  |
| `16px / sw 2.4` | 2 | 2 | 2/2 | 5a 5e |  |
| `16px / sw 2.6` | 2 | 2 | 2/2 | 4a 4b |  |
| `14px / sw 2.4` | 1 | 4 | 4/4 | 8h |  |
| `19px / sw 2.2` | 1 | 3 | 3/3 | 3b |  |
| `15px / sw 2` | 1 | 2 | 2/2 | 4b |  |
| `14px / sw 3` | 1 | 2 | 2/2 | 3c |  |
| `16px / sw 2` | 1 | 2 | 2/2 | 3d |  |
| `16px / sw 3` | 1 | 1 | 1/1 | 8m |  |
| `22px / sw 2` | 1 | 1 | 1/1 | 5a |  |
| `22px / sw 2.4` | 1 | 1 | 1/1 | 5d |  |
| `15px / sw 2.6` | 1 | 1 | 1/1 | 5d |  |
| `20px / sw 2.4` | 1 | 1 | 1/1 | 3d |  |
| `15px / sw 2.2` | 1 | 1 | 1/1 | 3f |  |
| `20px / sw 2.8` | 1 | 1 | 1/1 | 2b |  |

### role: `solid-icon` — 7 value(s), 87 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `20px / sw —` | 6 | 24 | 24/24 | 1b 2a 4a 4b 6a 8d |  |
| `18px / sw —` | 6 | 8 | 8/8 | 1b 2a 4a 4b 6a 8d |  |
| `44px / sw —` | 6 | 8 | 8/8 | 1b 2a 4a 4b 6a 8d |  |
| `16px / sw —` | 5 | 23 | 23/23 | 1b 3b 4a 4b 5c |  |
| `15px / sw —` | 4 | 10 | 10/10 | 1b 4a 4b 5b |  |
| `38px / sw —` | 2 | 7 | 7/7 | 5a 5e |  |
| `14px / sw —` | 2 | 7 | 7/7 | 2a 3f |  |

## Icon size by role

### role: `stroke-icon` — 11 value(s), 159 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `18px` | 27 | 64 | 64/72 (multi-role) | 1b 2a 3a 3b 3c 3d 3f 4a 4b 5a 5b 5d 5e 6a 6d 7a 7b 8c 8d 8e 8f 8g 8h 8i 8j 8l 8m |  |
| `20px` | 9 | 30 | 30/54 (multi-role) | 2b 3c 3d 5a 5d 5e 6a 7b 8j |  |
| `14px` | 9 | 15 | 15/22 (multi-role) | 1b 3a 3c 4a 4b 5a 5e 8c 8h |  |
| `16px` | 8 | 9 | 9/32 (multi-role) | 3d 4a 4b 5a 5e 6a 6d 8m |  |
| `17px` | 6 | 8 | 8/8 | 1b 2a 3a 3b 3d 3e |  |
| `22px` | 6 | 6 | 6/6 | 1b 4a 4b 5a 5c 5d |  |
| `13px` | 3 | 9 | 9/9 | 5a 5d 5e |  |
| `38px` | 3 | 8 | 8/15 (multi-role) | 5a 5d 5e |  |
| `15px` | 3 | 4 | 4/14 (multi-role) | 3f 4b 5d |  |
| `24px` | 3 | 3 | 3/3 | 1b 4a 4b |  |
| `19px` | 1 | 3 | 3/3 | 3b |  |

### role: `solid-icon` — 7 value(s), 87 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `20px` | 6 | 24 | 24/54 (multi-role) | 1b 2a 4a 4b 6a 8d |  |
| `18px` | 6 | 8 | 8/72 (multi-role) | 1b 2a 4a 4b 6a 8d |  |
| `44px` | 6 | 8 | 8/8 | 1b 2a 4a 4b 6a 8d |  |
| `16px` | 5 | 23 | 23/32 (multi-role) | 1b 3b 4a 4b 5c |  |
| `15px` | 4 | 10 | 10/14 (multi-role) | 1b 4a 4b 5b |  |
| `38px` | 2 | 7 | 7/15 (multi-role) | 5a 5e |  |
| `14px` | 2 | 7 | 7/22 (multi-role) | 2a 3f |  |

## Icon stroke width by role (and the size it pairs with)

### role: `stroke-icon @18px` — 3 value(s), 64 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `2.4` | 21 | 21 | 21/29 (multi-role) | 3a 3b 3c 3d 3f 5a 5b 5d 5e 6d 7a 7b 8c 8e 8f 8g 8h 8i 8j 8l 8m |  |
| `2.2` | 10 | 37 | 37/68 (multi-role) | 2a 5a 5d 5e 6a 8d 8e 8g 8i 8m |  |
| `2.6` | 4 | 6 | 6/17 (multi-role) | 1b 4a 4b 8m |  |

### role: `stroke-icon @20px` — 4 value(s), 30 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `2.2` | 4 | 22 | 22/68 (multi-role) | 5d 6a 7b 8j |  |
| `2` | 4 | 6 | 6/19 (multi-role) | 3c 5a 5d 5e |  |
| `2.4` | 1 | 1 | 1/29 (multi-role) | 3d |  |
| `2.8` | 1 | 1 | 1/1 | 2b |  |

### role: `stroke-icon @14px` — 5 value(s), 15 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `2.6` | 3 | 3 | 3/17 (multi-role) | 1b 4a 4b |  |
| `3.2` | 2 | 4 | 4/4 | 3a 8c |  |
| `3.4` | 2 | 2 | 2/11 (multi-role) | 5a 5e |  |
| `2.4` | 1 | 4 | 4/29 (multi-role) | 8h |  |
| `3` | 1 | 2 | 2/3 (multi-role) | 3c |  |

### role: `stroke-icon @16px` — 5 value(s), 9 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `2.2` | 2 | 2 | 2/68 (multi-role) | 6a 6d |  |
| `2.4` | 2 | 2 | 2/29 (multi-role) | 5a 5e |  |
| `2.6` | 2 | 2 | 2/17 (multi-role) | 4a 4b |  |
| `2` | 1 | 2 | 2/19 (multi-role) | 3d |  |
| `3` | 1 | 1 | 1/3 (multi-role) | 8m |  |

### role: `stroke-icon @13px` — 1 value(s), 9 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `3.4` | 3 | 9 | 9/11 (multi-role) | 5a 5d 5e |  |

### role: `stroke-icon @38px` — 1 value(s), 8 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `2` | 3 | 8 | 8/19 (multi-role) | 5a 5d 5e |  |

### role: `stroke-icon @17px` — 2 value(s), 8 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `2.6` | 5 | 5 | 5/17 (multi-role) | 1b 3a 3b 3d 3e |  |
| `2.2` | 3 | 3 | 3/68 (multi-role) | 2a 3a 3e |  |

### role: `stroke-icon @22px` — 3 value(s), 6 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `1.8` | 4 | 4 | 4/7 (multi-role) | 1b 4a 4b 5c |  |
| `2` | 1 | 1 | 1/19 (multi-role) | 5a |  |
| `2.4` | 1 | 1 | 1/29 (multi-role) | 5d |  |

### role: `stroke-icon @15px` — 3 value(s), 4 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `2` | 1 | 2 | 2/19 (multi-role) | 4b |  |
| `2.6` | 1 | 1 | 1/17 (multi-role) | 5d |  |
| `2.2` | 1 | 1 | 1/68 (multi-role) | 3f |  |

### role: `stroke-icon @24px` — 1 value(s), 3 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `1.8` | 3 | 3 | 3/7 (multi-role) | 1b 4a 4b |  |

### role: `stroke-icon @19px` — 1 value(s), 3 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `2.2` | 1 | 3 | 3/68 (multi-role) | 3b |  |

## Border width by role

### role: `box-outline` — 2 value(s), 365 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `2px` | 30 | 195 | 195/276 (multi-role) | 1b 2a 2b 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5c 5d 5e 6a 6d 7a 7b 8c 8d 8e 8f 8g 8h 8i 8j 8l 8m | div / span |
| `1.5px` | 24 | 170 | 170/285 (multi-role) | 1b 2a 2b 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5c 5d 5e 6a 7a 7b 8d 8e 8f 8h 8l | span "Stretch" / span "Blackcurrant" |

### role: `divider-line` — 2 value(s), 196 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `2px` | 30 | 81 | 81/276 (multi-role) | 1b 2a 2b 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5c 5d 5e 6a 6d 7a 7b 8c 8d 8e 8f 8g 8h 8i 8j 8l 8m | div / button "See the plan" |
| `1.5px` | 29 | 115 | 115/285 (multi-role) | 1b 2a 2b 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5c 5d 5e 6a 6d 7a 7b 8c 8d 8e 8g 8h 8i 8j 8l 8m | div / button |

## Border style by role

### role: `box-outline` — 2 value(s), 365 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `solid` | 30 | 334 | 334/504 (multi-role) | 1b 2a 2b 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5c 5d 5e 6a 6d 7a 7b 8c 8d 8e 8f 8g 8h 8i 8j 8l 8m | div / span |
| `dashed` | 15 | 31 | 31/57 (multi-role) | 1b 2a 3a 3b 3c 3d 4a 4b 5a 5b 5c 5d 5e 7b 8f | div / button |

### role: `divider-line` — 2 value(s), 196 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `solid` | 30 | 170 | 170/504 (multi-role) | 1b 2a 2b 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5c 5d 5e 6a 6d 7a 7b 8c 8d 8e 8f 8g 8h 8i 8j 8l 8m | div / button "See the plan" |
| `dashed` | 15 | 26 | 26/57 (multi-role) | 1b 3d 3e 3f 4a 4b 5a 5c 5d 5e 6a 7b 8d 8e 8g | div / div "Two clicks coarser than your" |

## Shadows by role

### role: `control` — 3 value(s), 18 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `5px 5px 0 #273D22` | 12 | 12 | 12/13 (multi-role) | 1b 2b 3a 3c 3e 4a 4b 5a 5b 5c 5d 5e | button "Save this cup" h56 / button "Back to home" h56 |
| `4px 4px 0 #273D22` | 3 | 3 | 3/11 (multi-role) | 7b 8c 8e | button "Next" h56 / button "Log a cup with this plan" h56 |
| `3px 3px 0 #273D22` | 3 | 3 | 3/3 | 6d 8f 8j | button "Try next" h48 / button "Send" h40 |

### role: `card` — 3 value(s), 12 uses

| value | screens | uses in this role | share of value's total uses | screen ids | example |
|---|---|---|---|---|---|
| `4px 4px 0 #273D22` | 6 | 8 | 8/11 (multi-role) | 1b 2a 4a 4b 6a 8d | div h60 |
| `4px 4px 0 #9E5202` | 1 | 3 | 3/3 | 5d | div |
| `5px 5px 0 #273D22` | 1 | 1 | 1/13 (multi-role) | 8d | div |

## Border radius

**Not found** — no `border-radius` declaration exists on any in-scope screen (0 occurrences across all 30).
