# MoreCoffee — Step 3.0b: role-scoped threshold pass

The ≥3-screen threshold from Step 2 was aggregate. It is re-applied here **inside each role**: one row per (value, role) pair, judged independently.

- Source: `MoreCoffee design.dc.html` · 30 unique screens (same scope as `evidence.md` / `roles.md`)
- **role screens / role uses** = occurrences of that value *in that role only*
- Class A (mechanism-bound: scrim, fade, error shadow, focus, empty, disabled, loading) is exempt from the threshold and promoted regardless — flagged `A` in the verdict column
- `collapse →` names the nearest qualifying value **in the same role**, with the per-channel RGB delta (colors) or px delta (numbers). A delta large enough to be visible is reported as a real exception instead.

## color

| value | role | role screens | role uses | passes ≥3 screens | verdict |
|---|---|---|---|---|---|
| `#9E5202` | `accent-marker` | 5 | 20 | yes | **promote to token** |
| `#067BC2` | `accent-marker` | 1 | 2 | no | collapse → `#9E5202` (Δrgb 152/41/192, max 192) — **Δ visible, flag as real exception instead** |
| `#C8BCB4` | `accent-marker` | 1 | 1 | no | collapse → `#9E5202` (Δrgb 42/106/178, max 178) — **Δ visible, flag as real exception instead** |
| `#273D22` | `badge-bg` | 18 | 19 | yes | **promote to token** |
| `#FFFCFA` | `badge-bg` | 17 | 43 | yes | **promote to token** |
| `#F1E3D6` | `badge-bg` | 7 | 20 | yes | **promote to token** |
| `#EDE4DF` | `badge-bg` | 6 | 9 | yes | **promote to token** |
| `#E2EADC` | `badge-bg` | 4 | 4 | yes | **promote to token** |
| `#E6EFF5` | `badge-bg` | 4 | 4 | yes | **promote to token** |
| `#FFF8F1` | `badge-bg` | 3 | 4 | yes | **promote to token** |
| `#F2E4D2` | `badge-bg` | 1 | 2 | no | collapse → `#F1E3D6` (Δrgb 1/1/4, max 4) |
| `#EFD9C2` | `badge-bg` | 1 | 1 | no | collapse → `#F1E3D6` (Δrgb 2/10/20, max 20) — **Δ visible, flag as real exception instead** |
| `#F4EDEA` | `badge-fg` | 19 | 24 | yes | **promote to token** |
| `#5C5049` | `badge-fg` | 14 | 39 | yes | **promote to token** |
| `#8A4602` | `badge-fg` | 8 | 22 | yes | **promote to token** |
| `#273D22` | `badge-fg` | 4 | 4 | yes | **promote to token** |
| `#2F4A28` | `badge-fg` | 4 | 4 | yes | **promote to token** |
| `#0A5E92` | `badge-fg` | 4 | 4 | yes | **promote to token** |
| `#6B5D55` | `badge-fg` | 1 | 1 | no | collapse → `#5C5049` (Δrgb 15/13/12, max 15) — **Δ visible, flag as real exception instead** |
| `#FFFCFA` | `badge-fg` | 1 | 1 | no | collapse → `#F4EDEA` (Δrgb 11/15/16, max 16) — **Δ visible, flag as real exception instead** |
| `#273D22` | `body-text` | 29 | 136 | yes | **promote to token** |
| `#5C5049` | `body-text` | 18 | 43 | yes | **promote to token** |
| `#6B5D55` | `body-text` | 11 | 26 | yes | **promote to token** |
| `#9E5202` | `body-text` | 9 | 29 | yes | **promote to token** |
| `#3C332E` | `body-text` | 3 | 6 | yes | **promote to token** |
| `#8A4602` | `body-text` | 1 | 4 | no | collapse → `#9E5202` (Δrgb 20/12/0, max 20) — **Δ visible, flag as real exception instead** |
| `#273D22` | `border` | 30 | 234 | yes | **promote to token** |
| `#C8BCB4` | `border` | 29 | 156 | yes | **promote to token** |
| `#D8C9BF` | `border` | 20 | 58 | yes | **promote to token** |
| `#E4D6CC` | `border` | 18 | 56 | yes | **promote to token** |
| `#8A4602` | `border` | 10 | 14 | yes | **promote to token** |
| `#B3A69E` | `border` | 5 | 18 | yes | **promote to token** |
| `#9E5202` | `border` | 1 | 5 | no | collapse → `#8A4602` (Δrgb 20/12/0, max 20) — **Δ visible, flag as real exception instead** |
| `#DDD0C8` | `border` | 1 | 1 | no | collapse → `#E4D6CC` (Δrgb 7/6/4, max 7) — **Δ visible, flag as real exception instead** |
| `#6B5D55` | `border` | 1 | 1 | no | collapse → `#8A4602` (Δrgb 31/23/83, max 83) — **Δ visible, flag as real exception instead** |
| `#FFFCFA` | `button-bg` | 24 | 36 | yes | **promote to token** |
| `#067BC2` | `button-bg` | 18 | 20 | yes | **promote to token** |
| `#F4EDEA` | `button-bg` | 7 | 7 | yes | **promote to token** |
| `#EDE4DF` | `button-bg` | 3 | 4 | yes | **promote to token** |
| `#F1E3D6` | `button-bg` | 3 | 4 | yes | **promote to token** |
| `#FFF8F1` | `button-bg` | 1 | 2 | no | collapse → `#FFFCFA` (Δrgb 0/4/9, max 9) — **Δ visible, flag as real exception instead** |
| `#FBEFE2` | `button-bg` | 1 | 1 | no | collapse → `#F4EDEA` (Δrgb 7/2/8, max 8) — **Δ visible, flag as real exception instead** |
| `#FFFFFF` | `button-fg` | 18 | 20 | yes | **promote to token** |
| `#273D22` | `button-fg` | 12 | 15 | yes | **promote to token** |
| `#9E5202` | `button-fg` | 6 | 7 | yes | **promote to token** |
| `#5C5049` | `button-fg` | 5 | 6 | yes | **promote to token** |
| `#6B5D55` | `button-fg` | 4 | 5 | yes | **promote to token** |
| `#8A4602` | `button-fg` | 1 | 2 | no | collapse → `#9E5202` (Δrgb 20/12/0, max 20) — **Δ visible, flag as real exception instead** |
| `#067BC2` | `divider` | 4 | 4 | yes | **promote to token** |
| `#B3A69E` | `divider` | 1 | 2 | no | collapse → `#067BC2` (Δrgb 173/43/36, max 173) — **Δ visible, flag as real exception instead** |
| `#E4D6CC` | `divider` | 1 | 1 | no | collapse → `#067BC2` (Δrgb 222/91/10, max 222) — **Δ visible, flag as real exception instead** |
| `#7E9675` | `divider` | 1 | 1 | no | collapse → `#067BC2` (Δrgb 120/27/77, max 120) — **Δ visible, flag as real exception instead** |
| `#C2B4AB` | `divider` | 1 | 1 | no | collapse → `#067BC2` (Δrgb 188/57/23, max 188) — **Δ visible, flag as real exception instead** |
| `#4A6640` | `divider` | 1 | 1 | no | collapse → `#067BC2` (Δrgb 68/21/130, max 130) — **Δ visible, flag as real exception instead** |
| `#8C7E76` | `divider` | 1 | 1 | no | collapse → `#067BC2` (Δrgb 134/3/76, max 134) — **Δ visible, flag as real exception instead** |
| `#D8C9BF` | `divider` | 1 | 1 | no | collapse → `#067BC2` (Δrgb 210/78/3, max 210) — **Δ visible, flag as real exception instead** |
| `rgba(244,237,234,0)` | `fade` | 2 | 4 | no | **A — promote** (scroll fade-out stop; threshold waived) |
| `#F4EDEA` | `fade` | 2 | 4 | no | **real exception** — no qualifying value in this role to collapse into |
| `#FFFCFA` | `fill` | 28 | 90 | yes | **promote to token** |
| `#F4EDEA` | `fill` | 16 | 33 | yes | **promote to token** |
| `#E4D6CC` | `fill` | 14 | 22 | yes | **promote to token** |
| `#D9C7BB` | `fill` | 9 | 12 | yes | **promote to token** |
| `#067BC2` | `fill` | 8 | 15 | yes | **promote to token** |
| `#EFE4DC` | `fill` | 6 | 9 | yes | **promote to token** |
| `#DCD0C8` | `fill` | 5 | 15 | yes | **promote to token** |
| `#273D22` | `fill` | 5 | 11 | yes | **promote to token** |
| `#CBB6A8` | `fill` | 5 | 6 | yes | **promote to token** |
| `#9E5202` | `fill` | 3 | 7 | yes | **promote to token** |
| `#E8DCD3` | `fill` | 2 | 4 | no | collapse → `#E4D6CC` (Δrgb 4/6/7, max 7) — **Δ visible, flag as real exception instead** |
| `#CFDCC8` | `fill` | 2 | 2 | no | collapse → `#DCD0C8` (Δrgb 13/12/0, max 13) — **Δ visible, flag as real exception instead** |
| `#7E9675` | `fill` | 2 | 2 | no | collapse → `#CBB6A8` (Δrgb 77/32/51, max 77) — **Δ visible, flag as real exception instead** |
| `#C2B4AB` | `fill` | 2 | 2 | no | collapse → `#CBB6A8` (Δrgb 9/2/3, max 9) — **Δ visible, flag as real exception instead** |
| `#D8C9BF` | `fill` | 2 | 2 | no | collapse → `#D9C7BB` (Δrgb 1/2/4, max 4) |
| `#DDD0C8` | `fill` | 1 | 1 | no | collapse → `#DCD0C8` (Δrgb 1/0/0, max 1) |
| `#F0E7E1` | `fill` | 1 | 1 | no | collapse → `#EFE4DC` (Δrgb 1/3/5, max 5) |
| `#F9F5F2` | `fill` | 1 | 1 | no | collapse → `#FFFCFA` (Δrgb 6/7/8, max 8) — **Δ visible, flag as real exception instead** |
| `#CFC1B6` | `fill` | 1 | 1 | no | collapse → `#D9C7BB` (Δrgb 10/6/5, max 10) — **Δ visible, flag as real exception instead** |
| `#E0D2C8` | `fill` | 1 | 1 | no | collapse → `#DCD0C8` (Δrgb 4/2/0, max 4) |
| `#DBCCC3` | `fill` | 1 | 1 | no | collapse → `#DCD0C8` (Δrgb 1/4/5, max 5) |
| `#273D22` | `heading-text` | 25 | 59 | yes | **promote to token** |
| `#9E5202` | `heading-text` | 13 | 21 | yes | **promote to token** |
| `#5C5049` | `heading-text` | 1 | 1 | no | collapse → `#273D22` (Δrgb 53/19/39, max 53) — **Δ visible, flag as real exception instead** |
| `#05639C` | `link` | 4 | 7 | yes | **promote to token** |
| `#FFFFFF` | `link` | 3 | 3 | yes | **promote to token** |
| `rgba(39,61,34,.42)` | `scrim` | 2 | 2 | no | **A — promote** (modal scrim; threshold waived) |
| `#6B5D55` | `secondary-text` | 29 | 237 | yes | **promote to token** |
| `#5C5049` | `secondary-text` | 21 | 52 | yes | **promote to token** |
| `#9E5202` | `secondary-text` | 19 | 27 | yes | **promote to token** |
| `#273D22` | `secondary-text` | 7 | 13 | yes | **promote to token** |
| `#4A6640` | `secondary-text` | 5 | 13 | yes | **promote to token** |
| `#8A4602` | `secondary-text` | 4 | 9 | yes | **promote to token** |
| `#273D22` | `shadow-ink` | 21 | 27 | yes | **promote to token** |
| `#9E5202` | `shadow-ink` | 1 | 3 | no | collapse → `#273D22` (Δrgb 119/21/32, max 119) — **Δ visible, flag as real exception instead** |
| `#E3D4CA` | `texture` | 16 | 16 | yes | **promote to token** |
| `#E4D6CC` | `texture` | 5 | 18 | yes | **promote to token** |

## fontSize

| value | role | role screens | role uses | passes ≥3 screens | verdict |
|---|---|---|---|---|---|
| `13px` | `badge-label` | 3 | 14 | yes | **promote to token** |
| `12px` | `body-sans` | 27 | 111 | yes | **promote to token** |
| `13px` | `body-sans` | 20 | 69 | yes | **promote to token** |
| `15px` | `body-sans` | 14 | 57 | yes | **promote to token** |
| `11px` | `body-sans` | 11 | 20 | yes | **promote to token** |
| `14px` | `body-sans` | 10 | 18 | yes | **promote to token** |
| `10px` | `body-sans` | 3 | 21 | yes | **promote to token** |
| `13.5px` | `body-sans` | 1 | 3 | no | collapse → `14px` (Δ 0.50) |
| `12.5px` | `body-sans` | 1 | 3 | no | collapse → `12px` (Δ 0.50) |
| `16px` | `button-label` | 15 | 15 | yes | **promote to token** |
| `13px` | `button-label` | 12 | 22 | yes | **promote to token** |
| `12px` | `button-label` | 6 | 11 | yes | **promote to token** |
| `14px` | `button-label` | 6 | 6 | yes | **promote to token** |
| `11px` | `button-label` | 2 | 3 | no | collapse → `12px` (Δ 1.00) |
| `15px` | `button-label` | 1 | 1 | no | collapse → `16px` (Δ 1.00) |
| `40px` | `display-serif` | 14 | 14 | yes | **promote to token** |
| `30px` | `display-serif` | 12 | 12 | yes | **promote to token** |
| `22px` | `display-serif` | 6 | 18 | yes | **promote to token** |
| `28px` | `display-serif` | 6 | 6 | yes | **promote to token** |
| `44px` | `display-serif` | 5 | 8 | yes | **promote to token** |
| `26px` | `display-serif` | 3 | 5 | yes | **promote to token** |
| `24px` | `display-serif` | 3 | 3 | yes | **promote to token** |
| `96px` | `display-serif` | 3 | 3 | yes | **promote to token** |
| `32px` | `display-serif` | 2 | 4 | no | collapse → `30px` (Δ 2.00) |
| `21px` | `display-serif` | 1 | 3 | no | collapse → `22px` (Δ 1.00) |
| `33px` | `display-serif` | 1 | 1 | no | collapse → `30px` (Δ 3.00) |
| `38px` | `display-serif` | 1 | 1 | no | collapse → `40px` (Δ 2.00) |
| `42px` | `display-serif` | 1 | 1 | no | collapse → `40px` (Δ 2.00) |
| `34px` | `display-serif` | 1 | 1 | no | collapse → `30px` (Δ 4.00) |
| `31px` | `display-serif` | 1 | 1 | no | collapse → `30px` (Δ 1.00) |
| `36px` | `display-serif` | 1 | 1 | no | collapse → `40px` (Δ 4.00) |
| `27px` | `display-serif` | 1 | 1 | no | collapse → `26px` (Δ 1.00) |
| `20px` | `display-serif` | 1 | 1 | no | collapse → `22px` (Δ 2.00) |
| `10px` | `eyebrow-uppercase` | 26 | 122 | yes | **promote to token** |
| `13px` | `eyebrow-uppercase` | 20 | 21 | yes | **promote to token** |
| `12px` | `eyebrow-uppercase` | 18 | 52 | yes | **promote to token** |
| `11px` | `eyebrow-uppercase` | 17 | 103 | yes | **promote to token** |
| `9px` | `eyebrow-uppercase` | 6 | 10 | yes | **promote to token** |
| `16px` | `title-sans` | 18 | 62 | yes | **promote to token** |
| `19px` | `title-sans` | 5 | 5 | yes | **promote to token** |
| `17px` | `title-sans` | 2 | 4 | no | collapse → `16px` (Δ 1.00) |

## space

| value | role | role screens | role uses | passes ≥3 screens | verdict |
|---|---|---|---|---|---|
| `18px` | `badge-inset` | 11 | 12 | yes | **promote to token** |
| `11px` | `badge-inset` | 10 | 37 | yes | **promote to token** |
| `8px` | `badge-inset` | 10 | 34 | yes | **promote to token** |
| `14px` | `badge-inset` | 9 | 11 | yes | **promote to token** |
| `9px` | `badge-inset` | 8 | 25 | yes | **promote to token** |
| `16px` | `badge-inset` | 7 | 9 | yes | **promote to token** |
| `20px` | `badge-inset` | 7 | 8 | yes | **promote to token** |
| `3px` | `badge-inset` | 6 | 30 | yes | **promote to token** |
| `6px` | `badge-inset` | 6 | 6 | yes | **promote to token** |
| `7px` | `badge-inset` | 5 | 6 | yes | **promote to token** |
| `10px` | `badge-inset` | 5 | 5 | yes | **promote to token** |
| `13px` | `badge-inset` | 3 | 11 | yes | **promote to token** |
| `15px` | `badge-inset` | 3 | 9 | yes | **promote to token** |
| `4px` | `badge-inset` | 3 | 3 | yes | **promote to token** |
| `5px` | `badge-inset` | 2 | 2 | no | collapse → `4px` (Δ 1.00) |
| `12px` | `badge-inset` | 2 | 2 | no | collapse → `11px` (Δ 1.00) |
| `2px` | `badge-inset` | 2 | 2 | no | collapse → `3px` (Δ 1.00) |
| `0` | `container-inset` | 30 | 119 | yes | **promote to token** |
| `16px` | `container-inset` | 21 | 58 | yes | **promote to token** |
| `60px` | `container-inset` | 18 | 18 | yes | **promote to token** |
| `14px` | `container-inset` | 15 | 52 | yes | **promote to token** |
| `4px` | `container-inset` | 14 | 19 | yes | **promote to token** |
| `56px` | `container-inset` | 12 | 12 | yes | **promote to token** |
| `15px` | `container-inset` | 11 | 29 | yes | **promote to token** |
| `12px` | `container-inset` | 11 | 20 | yes | **promote to token** |
| `6px` | `container-inset` | 9 | 16 | yes | **promote to token** |
| `9px` | `container-inset` | 7 | 18 | yes | **promote to token** |
| `34px` | `container-inset` | 7 | 9 | yes | **promote to token** |
| `30px` | `container-inset` | 6 | 8 | yes | **promote to token** |
| `3px` | `container-inset` | 5 | 23 | yes | **promote to token** |
| `11px` | `container-inset` | 5 | 17 | yes | **promote to token** |
| `13px` | `container-inset` | 5 | 12 | yes | **promote to token** |
| `7px` | `container-inset` | 4 | 13 | yes | **promote to token** |
| `2px` | `container-inset` | 4 | 8 | yes | **promote to token** |
| `10px` | `container-inset` | 4 | 4 | yes | **promote to token** |
| `18px` | `container-inset` | 4 | 4 | yes | **promote to token** |
| `8px` | `container-inset` | 2 | 6 | no | collapse → `7px` (Δ 1.00) |
| `100px` | `container-inset` | 2 | 4 | no | collapse → `60px` (Δ 40.00) |
| `44px` | `container-inset` | 1 | 2 | no | collapse → `34px` (Δ 10.00) |
| `5px` | `container-inset` | 1 | 1 | no | collapse → `4px` (Δ 1.00) |
| `20px` | `container-inset` | 1 | 1 | no | collapse → `18px` (Δ 2.00) |
| `2px` | `container-margin` | 7 | 12 | yes | **promote to token** |
| `5px` | `container-margin` | 7 | 7 | yes | **promote to token** |
| `22px` | `container-margin` | 5 | 8 | yes | **promote to token** |
| `4px` | `container-margin` | 5 | 5 | yes | **promote to token** |
| `0` | `container-margin` | 5 | 5 | yes | **promote to token** |
| `8px` | `container-margin` | 4 | 7 | yes | **promote to token** |
| `6px` | `container-margin` | 3 | 10 | yes | **promote to token** |
| `20px` | `container-margin` | 3 | 3 | yes | **promote to token** |
| `10px` | `container-margin` | 2 | 2 | no | collapse → `8px` (Δ 2.00) |
| `14px` | `container-margin` | 1 | 4 | no | collapse → `20px` (Δ 6.00) |
| `13px` | `container-margin` | 1 | 4 | no | collapse → `8px` (Δ 5.00) |
| `7px` | `container-margin` | 1 | 3 | no | collapse → `6px` (Δ 1.00) |
| `16px` | `container-margin` | 1 | 1 | no | collapse → `20px` (Δ 4.00) |
| `1px` | `container-margin` | 1 | 1 | no | collapse → `0` (Δ 1.00) |
| `16px` | `control-inset` | 18 | 65 | yes | **promote to token** |
| `0` | `control-inset` | 17 | 43 | yes | **promote to token** |
| `14px` | `control-inset` | 13 | 30 | yes | **promote to token** |
| `15px` | `control-inset` | 9 | 35 | yes | **promote to token** |
| `8px` | `control-inset` | 7 | 9 | yes | **promote to token** |
| `13px` | `control-inset` | 3 | 3 | yes | **promote to token** |
| `18px` | `control-inset` | 3 | 3 | yes | **promote to token** |
| `11px` | `control-inset` | 2 | 4 | no | collapse → `13px` (Δ 2.00) |
| `12px` | `control-inset` | 2 | 3 | no | collapse → `13px` (Δ 1.00) |
| `6px` | `control-inset` | 1 | 1 | no | collapse → `8px` (Δ 2.00) |
| `-2px` | `optical-negative-margin` | 13 | 14 | yes | **promote to token** |
| `-6px` | `optical-negative-margin` | 2 | 2 | no | collapse → `-2px` (Δ 4.00) |
| `-14px` | `optical-negative-margin` | 1 | 1 | no | collapse → `-2px` (Δ 12.00) |
| `-12px` | `optical-negative-margin` | 1 | 1 | no | collapse → `-2px` (Δ 10.00) |
| `22px` | `screen-gutter` | 30 | 163 | yes | **promote to token** |
| `0` | `screen-padding-block` | 30 | 139 | yes | **promote to token** |
| `20px` | `screen-padding-block` | 21 | 40 | yes | **promote to token** |
| `14px` | `screen-padding-block` | 21 | 29 | yes | **promote to token** |
| `34px` | `screen-padding-block` | 19 | 19 | yes | **promote to token** |
| `18px` | `screen-padding-block` | 18 | 26 | yes | **promote to token** |
| `22px` | `screen-padding-block` | 17 | 21 | yes | **promote to token** |
| `16px` | `screen-padding-block` | 17 | 18 | yes | **promote to token** |
| `12px` | `screen-padding-block` | 11 | 16 | yes | **promote to token** |
| `24px` | `screen-padding-block` | 6 | 6 | yes | **promote to token** |
| `26px` | `screen-padding-block` | 6 | 6 | yes | **promote to token** |
| `38px` | `screen-padding-block` | 1 | 1 | no | collapse → `34px` (Δ 4.00) |
| `10px` | `screen-padding-block` | 1 | 1 | no | collapse → `12px` (Δ 2.00) |
| `12px` | `stack-gap` | 27 | 119 | yes | **promote to token** |
| `9px` | `stack-gap` | 25 | 54 | yes | **promote to token** |
| `10px` | `stack-gap` | 20 | 50 | yes | **promote to token** |
| `3px` | `stack-gap` | 19 | 51 | yes | **promote to token** |
| `8px` | `stack-gap` | 17 | 57 | yes | **promote to token** |
| `14px` | `stack-gap` | 17 | 51 | yes | **promote to token** |
| `5px` | `stack-gap` | 13 | 63 | yes | **promote to token** |
| `7px` | `stack-gap` | 13 | 30 | yes | **promote to token** |
| `4px` | `stack-gap` | 11 | 34 | yes | **promote to token** |
| `6px` | `stack-gap` | 11 | 29 | yes | **promote to token** |
| `11px` | `stack-gap` | 11 | 24 | yes | **promote to token** |
| `2px` | `stack-gap` | 10 | 26 | yes | **promote to token** |
| `13px` | `stack-gap` | 9 | 29 | yes | **promote to token** |
| `20px` | `stack-gap` | 6 | 6 | yes | **promote to token** |
| `16px` | `stack-gap` | 2 | 2 | no | collapse → `14px` (Δ 2.00) |
| `18px` | `stack-gap` | 2 | 2 | no | collapse → `20px` (Δ 2.00) |
| `15px` | `stack-gap` | 1 | 1 | no | collapse → `14px` (Δ 1.00) |
| `22px` | `stack-gap` | 1 | 1 | no | collapse → `20px` (Δ 2.00) |

## iconSize

| value | role | role screens | role uses | passes ≥3 screens | verdict |
|---|---|---|---|---|---|
| `20px` | `solid-icon` | 6 | 24 | yes | **promote to token** |
| `18px` | `solid-icon` | 6 | 8 | yes | **promote to token** |
| `44px` | `solid-icon` | 6 | 8 | yes | **promote to token** |
| `16px` | `solid-icon` | 5 | 23 | yes | **promote to token** |
| `15px` | `solid-icon` | 4 | 10 | yes | **promote to token** |
| `38px` | `solid-icon` | 2 | 7 | no | collapse → `44px` (Δ 6.00) |
| `14px` | `solid-icon` | 2 | 7 | no | collapse → `15px` (Δ 1.00) |
| `18px` | `stroke-icon` | 27 | 64 | yes | **promote to token** |
| `20px` | `stroke-icon` | 9 | 30 | yes | **promote to token** |
| `14px` | `stroke-icon` | 9 | 15 | yes | **promote to token** |
| `16px` | `stroke-icon` | 8 | 9 | yes | **promote to token** |
| `17px` | `stroke-icon` | 6 | 8 | yes | **promote to token** |
| `22px` | `stroke-icon` | 6 | 6 | yes | **promote to token** |
| `13px` | `stroke-icon` | 3 | 9 | yes | **promote to token** |
| `38px` | `stroke-icon` | 3 | 8 | yes | **promote to token** |
| `15px` | `stroke-icon` | 3 | 4 | yes | **promote to token** |
| `24px` | `stroke-icon` | 3 | 3 | yes | **promote to token** |
| `19px` | `stroke-icon` | 1 | 3 | no | collapse → `18px` (Δ 1.00) |

## iconStroke

| value | role | role screens | role uses | passes ≥3 screens | verdict |
|---|---|---|---|---|---|
| `2.4` | `stroke-icon` | 21 | 29 | yes | **promote to token** |
| `2.2` | `stroke-icon` | 17 | 68 | yes | **promote to token** |
| `2.6` | `stroke-icon` | 9 | 17 | yes | **promote to token** |
| `2` | `stroke-icon` | 6 | 19 | yes | **promote to token** |
| `1.8` | `stroke-icon` | 4 | 7 | yes | **promote to token** |
| `3.4` | `stroke-icon` | 3 | 11 | yes | **promote to token** |
| `3.2` | `stroke-icon` | 2 | 4 | no | collapse → `3.4` (Δ 0.20) |
| `3` | `stroke-icon` | 2 | 3 | no | collapse → `2.6` (Δ 0.40) |
| `2.8` | `stroke-icon` | 1 | 1 | no | collapse → `2.6` (Δ 0.20) |

## borderWidth

| value | role | role screens | role uses | passes ≥3 screens | verdict |
|---|---|---|---|---|---|
| `2px` | `box-outline` | 30 | 195 | yes | **promote to token** |
| `1.5px` | `box-outline` | 24 | 170 | yes | **promote to token** |
| `2px` | `divider-line` | 30 | 81 | yes | **promote to token** |
| `1.5px` | `divider-line` | 29 | 115 | yes | **promote to token** |

## borderStyle

| value | role | role screens | role uses | passes ≥3 screens | verdict |
|---|---|---|---|---|---|
| `solid` | `box-outline` | 30 | 334 | yes | **promote to token** |
| `dashed` | `box-outline` | 15 | 31 | yes | **promote to token** |
| `solid` | `divider-line` | 30 | 170 | yes | **promote to token** |
| `dashed` | `divider-line` | 15 | 26 | yes | **promote to token** |

## shadow

| value | role | role screens | role uses | passes ≥3 screens | verdict |
|---|---|---|---|---|---|
| `4px 4px 0 #273D22` | `card` | 6 | 8 | yes | **promote to token** |
| `4px 4px 0 #9E5202` | `card` | 1 | 3 | no | **A — promote** (error-state shadow; threshold waived) |
| `5px 5px 0 #273D22` | `card` | 1 | 1 | no | collapse → `4px 4px 0 #273D22` (Δ 1.00) |
| `5px 5px 0 #273D22` | `control` | 12 | 12 | yes | **promote to token** |
| `4px 4px 0 #273D22` | `control` | 3 | 3 | yes | **promote to token** |
| `3px 3px 0 #273D22` | `control` | 3 | 3 | yes | **promote to token** |

## Values that fail the threshold in every role but have a high aggregate

These are used widely without settling into any one role — they need your call, not mine.

| value | dim | aggregate screens | aggregate uses | roles (screens/uses each) |
|---|---|---|---|---|

## `#DCD0C8` / `#DDD0C8` — merge, then collapse (per your ruling)

| pair | Δrgb | verdict |
|---|---|---|
| `#DCD0C8` ↔ `#DDD0C8` | 1/0/0 | merge (R-channel only) |

Collapse targets, measured against the qualifying values **in each role**:

| role | candidate token value | role screens | Δrgb from #DDD0C8 | max channel |
|---|---|---|---|---|
| `border` | `#E4D6CC` | 18 | 7/6/4 | 7 |
| `border` | `#C8BCB4` | 29 | 21/20/20 | 21 |
| `border` | `#D8C9BF` | 20 | 5/7/9 | 9 |
| `fill` | `#EFE4DC` | 6 | 18/20/20 | 20 |
| `fill` | `#E4D6CC` | 14 | 7/6/4 | 7 |
| `fill` | `#DCD0C8` | 5 | 1/0/0 | 1 |
| `fill` | `#D9C7BB` | 9 | 4/9/13 | 13 |
