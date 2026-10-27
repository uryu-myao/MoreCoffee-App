# MoreCoffee — Step 2: raw value frequency (evidence layer)

Transcribed verbatim from the inline styles of `MoreCoffee design.dc.html`. No rounding, no merging of near-identical values.

- Frames parsed: **32** · unique screens: **30**
- Excluded per Step 1: `9a` `9b` `8a` (Welcome), `1a` (rejected direction), `2c` (superseded by 5a), `8b` `8k` (sign-in / account, held with Welcome)
- `6b` `6c` are counted as `6a` (one screen, scrolled)
- Device bezel, notch and canvas chrome are excluded — app pixels only. The page's own `height/min-height: 874px` is dropped as frame scaffolding.
- **screens** = distinct screens the value appears on (the agreed ≥3 threshold unit). **uses** = raw element instances.

## Screens in scope

- `8c` — First setup
- `8d` — Try next
- `8e` — Try next · detail
- `8f` — My taste DNA
- `8g` — How my DNA is built
- `8h` — My words
- `8i` — Reminders
- `8m` — Language
- `8j` — Send feedback
- `8l` — Records · search
- `7a` — Notifications list
- `7b` — Notification detail
- `6a` — Profile (scrolled: 6a/6b/6c)
- `6d` — Edit profile
- `5a` — Log a cup
- `5b` — Tasting note
- `5c` — Saved
- `5d` — Missing required fields
- `5e` — Ready-to-drink selected
- `4a` — Home · My gear
- `4b` — Home · My beans
- `3a` — Add gear
- `3b` — My gear selected
- `3e` — Edit gear
- `3c` — Add beans
- `3d` — My beans selected
- `3f` — Finished bags
- `2a` — Records
- `2b` — Sort sheet
- `1b` — Home · 3-cup (locked tone)

## Colors — 45 distinct values

| value | screens | uses | properties | screen ids | example elements |
|---|---|---|---|---|---|
| `#273D22` | 30 | 607 | border-bottom, color, background, border, border-top, box-shadow, svg stroke, border-left, border-right | 1b 2a 2b 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5c 5d 5e 6a 6d 7a 7b 8c 8d 8e 8f 8g 8h 8i 8j 8l 8m | div / div "Setup · 2 of 3" |
| `#FFFCFA` | 30 | 170 | background, color | 1b 2a 2b 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5c 5d 5e 6a 6d 7a 7b 8c 8d 8e 8f 8g 8h 8i 8j 8l 8m | div / span |
| `#5C5049` | 30 | 151 | color, svg stroke, svg fill | 1b 2a 2b 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5c 5d 5e 6a 6d 7a 7b 8c 8d 8e 8f 8g 8h 8i 8j 8l 8m | div "Pick what you own now. This be" / span "French press" |
| `#6B5D55` | 29 | 276 | color, svg stroke, border | 1b 2a 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5c 5d 5e 6a 6d 7a 7b 8c 8d 8e 8f 8g 8h 8i 8j 8l 8m | span "V60, Kalita…" / span "C40, 1Zpresso…" |
| `#C8BCB4` | 29 | 165 | border, svg stroke, background, border-bottom | 1b 2a 2b 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5c 5d 5e 6a 6d 7a 7b 8c 8d 8e 8f 8h 8i 8j 8l 8m | span / span "Blackcurrant" |
| `#9E5202` | 28 | 134 | color, background, svg stroke, border, box-shadow, border-top, svg fill | 1b 2a 2b 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5c 5d 5e 6a 6d 7a 7b 8c 8d 8e 8f 8g 8h 8l 8m | button "Skip all" / div "2 of 3 picked" |
| `#E4D6CC` | 26 | 97 | border-top, background, border-left, background-image, border-bottom | 1b 2a 2b 3b 3c 3d 3f 4a 4b 5a 5b 5c 5d 5e 6a 6d 7a 8c 8d 8e 8g 8h 8i 8j 8l 8m | div / button |
| `#F4EDEA` | 26 | 71 | color, background, svg stroke | 1b 2a 2b 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5c 5d 5e 6a 6d 7a 7b 8d 8f 8i 8j 8l 8m | span "This week" / div |
| `#067BC2` | 25 | 44 | background, svg stroke | 1b 2b 3a 3c 3d 3e 4a 4b 5a 5b 5c 5d 5e 6d 7a 7b 8c 8d 8e 8f 8g 8i 8j 8l 8m | span / button "Next" |
| `#D8C9BF` | 21 | 61 | border-top, border-bottom, background | 1b 2a 2b 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5c 5d 5e 6a 7b 8d 8e 8g | div / div "Two clicks coarser than your V" |
| `#FFFFFF` | 18 | 33 | color, svg stroke | 1b 2b 3a 3c 3e 4a 4b 5a 5b 5c 5d 5e 6d 7b 8c 8d 8e 8j | button "Next" / icon 14px |
| `#E3D4CA` | 16 | 16 | background-image | 1b 2a 2b 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5c 5d 5e | div |
| `#8A4602` | 12 | 54 | border, color, svg stroke | 1b 2a 3d 4a 4b 5b 5c 5d 6a 7a 8d 8e | span "Stretch" / span "One step off profile" |
| `#D9C7BB` | 9 | 12 | background | 1b 2a 3b 3c 3d 3e 3f 4a 4b | div |
| `#C9821A` | 8 | 24 | svg fill | 1b 2a 3f 4a 4b 5a 5b 5e | icon 38px / icon 15px |
| `#F1E3D6` | 8 | 24 | background | 1b 2a 3b 3d 4a 4b 5b 5c | span "Jasmine" / span "White peach" |
| `#EDE4DF` | 6 | 13 | background | 1b 2a 3d 3f 4a 4b | span "Ready-to-drink" / button "My beans" |
| `#EFE4DC` | 6 | 9 | background | 1b 4a 4b 8f 8i 8m | div / span |
| `#4A6640` | 5 | 25 | color, svg stroke, background | 3d 4b 5a 5d 5e | span "Set" / span "Pre-filled" |
| `#B3A69E` | 5 | 20 | border, background | 1b 4a 4b 5b 5c | span |
| `#DCD0C8` | 5 | 15 | background | 1b 4a 4b 5b 5c | span |
| `#CBB6A8` | 5 | 6 | background | 1b 2a 3b 4a 4b | div |
| `#05639C` | 4 | 9 | color, svg stroke | 3f 4a 4b 5d | span "Go to first" / a "Manage my gear" |
| `#FFF8F1` | 4 | 6 | background | 7a 7b 8c 8f | div / button |
| `#0A5E92` | 4 | 4 | color | 1b 2a 4a 4b | span "Barista" |
| `#2F4A28` | 4 | 4 | color | 1b 2a 4a 4b | span "I made it" |
| `#E2EADC` | 4 | 4 | background | 1b 2a 4a 4b | span "I made it" |
| `#E6EFF5` | 4 | 4 | background | 1b 2a 4a 4b | span "Barista" |
| `#3C332E` | 3 | 6 | color | 7b 8e 8j | div "Your last 20 cups lean bright " / div "I would love to mark a bag as " |
| `#7E9675` | 2 | 5 | background, svg stroke | 3d 4b | span / icon 15px |
| `#C2B4AB` | 2 | 5 | background, svg stroke | 3d 4b | span / icon 15px |
| `#E8DCD3` | 2 | 4 | background | 3d 4b | div |
| `rgba(244,237,234,0)` | 2 | 4 | background | 6a 8d | div |
| `#8C7E76` | 2 | 2 | background, svg stroke | 2a 3d | span / icon 17px |
| `#CFDCC8` | 2 | 2 | background | 3d 4b | span |
| `#DDD0C8` | 2 | 2 | background, border-top | 6d 8c | span / div |
| `rgba(39,61,34,.42)` | 2 | 2 | background | 2b 3b | div |
| `#F2E4D2` | 1 | 2 | background | 6a | span "Home brewer" / span "¥300+" |
| `#CFC1B6` | 1 | 1 | background | 3f | div |
| `#DBCCC3` | 1 | 1 | background | 2b | div |
| `#E0D2C8` | 1 | 1 | background | 3f | div |
| `#EFD9C2` | 1 | 1 | background | 5d | div |
| `#F0E7E1` | 1 | 1 | background | 6d | div |
| `#F9F5F2` | 1 | 1 | background | 3e | div "22 clicks for V60, 18 for Aero" |
| `#FBEFE2` | 1 | 1 | background | 6a | button |

## Font size — 30 distinct values

| value | screens | uses | properties | screen ids | example elements |
|---|---|---|---|---|---|
| `12px` | 29 | 174 | — | 1b 2a 2b 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5c 5d 5e 6a 6d 7a 7b 8c 8d 8f 8g 8h 8i 8j 8l 8m | span "V60, Kalita…" / span "C40, 1Zpresso…" |
| `13px` | 29 | 126 | — | 1b 2a 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5c 5d 5e 6a 6d 7a 7b 8c 8d 8e 8f 8g 8h 8i 8j 8l 8m | div "Setup · 2 of 3" / button "Skip all" |
| `10px` | 26 | 143 | — | 1b 2a 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5d 5e 6a 6d 7a 7b 8d 8e 8f 8h 8i 8j 8l 8m | div "Based on 147 cups" / span "Stretch" |
| `16px` | 22 | 77 | — | 1b 2b 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5c 5d 5e 7a 7b 8c 8e 8h 8l 8m | span "Pour-over dripper" / span "Hand grinder" |
| `11px` | 20 | 126 | — | 1b 2a 2b 3a 3c 3d 3e 3f 4a 4b 5a 5b 5c 5d 5e 6a 7a 7b 8d 8l | span "One step off your profile" / span "Blackcurrant" |
| `14px` | 15 | 24 | — | 1b 2a 3a 3b 3e 5a 5b 5c 5d 5e 6d 7b 8c 8e 8g | div "Pick what you own now. This be" / div "Your last 20 cups lean bright " |
| `15px` | 14 | 58 | — | 3c 3e 4a 4b 5b 5e 6a 7a 8d 8g 8i 8j 8l 8m | button "See the plan" / span "Same bag, 2°C cooler" |
| `40px` | 14 | 14 | — | 3a 3b 3c 3d 3e 3f 5a 5b 5c 5d 5e 6a 6d 8d | div "Try next" / div "My profile" |
| `30px` | 12 | 12 | — | 1b 2a 3a 3b 3c 3d 3e 3f 4a 4b 6a 8d | div "A washed Kenyan, ground coarse" / div "Y" |
| `22px` | 6 | 18 | — | 1b 2a 3f 4a 4b 5b | span "4" / div "Try next" |
| `9px` | 6 | 10 | — | 3b 4a 6a 7a 8d 8f | span "This week" / span "Locked in" |
| `28px` | 6 | 6 | — | 1b 3c 4a 4b 5b 5c | div "Where did it sit?" / div "My taste DNA" |
| `44px` | 5 | 8 | — | 1b 2a 2b 4a 4b | div "Good morning" / div "{{ week }}" |
| `19px` | 5 | 5 | — | 3a 3b 3c 3d 6a | div "Yuka M." / span "/ 8" |
| `26px` | 3 | 5 | — | 3b 3f 8e | span "28" / span "92°" |
| `24px` | 3 | 3 | — | 3d 5c 8i | span "08:00" / div "One more cup" |
| `96px` | 3 | 3 | — | 1b 4a 4b | div "{{ cups }}" |
| `17px` | 2 | 4 | — | 2a 6d | span "Yuka M." / div "Ethiopia Guji" |
| `32px` | 2 | 4 | — | 2b 6a | div "147" / div "23" |
| `12.5px` | 1 | 3 | — | 5d | div "Nothing is lost — this cup is " / span "Tap a star — this is the one t" |
| `13.5px` | 1 | 3 | — | 8m | span "Labels, buttons and the taste " / span "Your notes and saved words sta" |
| `21px` | 1 | 3 | — | 2a | span "4" / span "5" |
| `20px` | 1 | 1 | — | 5b | div "Cooled down it turned into ice" |
| `27px` | 1 | 1 | — | 6a | div "Bright, juicy, lightly sweet" |
| `31px` | 1 | 1 | — | 7a | div "Notifications" |
| `33px` | 1 | 1 | — | 8c | div "How do you usually brew?" |
| `34px` | 1 | 1 | — | 8g | div "Nothing here is a guess about " |
| `36px` | 1 | 1 | — | 7b | div "Taste DNA now reads your notes" |
| `38px` | 1 | 1 | — | 8e | div "A washed Kenyan, ground coarse" |
| `42px` | 1 | 1 | — | 8f | div "Bright, juicy, lightly sweet" |

## Font weight — 3 distinct values

| value | screens | uses | properties | screen ids | example elements |
|---|---|---|---|---|---|
| `700` | 30 | 551 | — | 1b 2a 2b 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5c 5d 5e 6a 6d 7a 7b 8c 8d 8e 8f 8g 8h 8i 8j 8l 8m | div "Setup · 2 of 3" / button "Skip all" |
| `500` | 30 | 142 | — | 1b 2a 2b 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5c 5d 5e 6a 6d 7a 7b 8c 8d 8e 8f 8g 8h 8i 8j 8l 8m | div "Pick what you own now. This be" / div "You like bright and juicy. Ken" |
| `600` | 22 | 56 | — | 1b 2a 3f 4a 4b 5a 5b 5c 5d 5e 6a 6d 7a 7b 8c 8d 8f 8h 8i 8j 8l 8m | span "V60, Kalita…" / span "C40, 1Zpresso…" |

## Line height — 15 distinct values

| value | screens | uses | properties | screen ids | example elements |
|---|---|---|---|---|---|
| `1` | 21 | 54 | — | 1b 2a 2b 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5c 5d 5e 6a 7a 8d 8e 8i | div "Try next" / span "28" |
| `1.5` | 11 | 18 | — | 1b 3e 7b 8c 8d 8e 8f 8g 8h 8i 8m | div "Pick what you own now. This be" / div "You like bright and juicy. Ken" |
| `1.45` | 10 | 11 | — | 1b 4a 4b 5d 6d 7a 8h 8i 8j 8m | span "Words appear as chips when you" / span "System permission is on for Mo" |
| `1.4` | 8 | 9 | — | 3c 3e 3f 5a 5b 5d 5e 6a | div "Logging since Jan 2026 · 34 we" / span "Marked fields are required — a" |
| `.9` | 7 | 7 | — | 2a 3a 3b 3c 3d 3e 3f | div "3" / div "2" |
| `1.02` | 7 | 7 | — | 1b 2a 2b 3f 4a 4b 5c | div "Noted." / div "Good morning" |
| `.8` | 3 | 3 | — | 1b 4a 4b | div "{{ week }}" |
| `.82` | 3 | 3 | — | 1b 4a 4b | div "{{ cups }}" |
| `1.1` | 3 | 3 | — | 6a 8c 8d | div "How do you usually brew?" / div "A washed Kenyan, ground coarse" |
| `1.6` | 3 | 3 | — | 7b 8e 8j | div "Your last 20 cups lean bright " / div "I would love to mark a bag as " |
| `1.08` | 2 | 2 | — | 7b 8g | div "Nothing here is a guess about " / div "Taste DNA now reads your notes" |
| `1.3` | 1 | 5 | — | 7a | div "Taste DNA now reads your notes" / div "One bag, three grinds" |
| `1.04` | 1 | 1 | — | 8f | div "Bright, juicy, lightly sweet" |
| `1.06` | 1 | 1 | — | 8e | div "A washed Kenyan, ground coarse" |
| `1.55` | 1 | 1 | — | 8g | div "Your profile is arithmetic on " |

## Letter spacing — 10 distinct values

| value | screens | uses | properties | screen ids | example elements |
|---|---|---|---|---|---|
| `.16em` | 25 | 82 | — | 1b 2a 2b 3a 3b 3c 3d 3e 3f 4b 5a 5b 5d 5e 6a 6d 7a 8d 8e 8f 8h 8i 8j 8l 8m | div "Based on 147 cups" / div "Also worth a cup" |
| `.06em` | 24 | 72 | — | 1b 2a 2b 3a 3b 3c 3d 3e 4a 4b 5a 5b 5c 5d 5e 6a 6d 7b 8c 8d 8e 8f 8j 8l | button "Next" / button "See the plan" |
| `.08em` | 21 | 92 | — | 1b 2a 2b 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5c 5d 5e 6a 6d 7a 8h 8j | button "Add" / button "Send" |
| `.12em` | 18 | 43 | — | 1b 2a 3f 4a 4b 6a 6d 7a 7b 8c 8d 8e 8f 8g 8h 8i 8j 8m | div "Setup · 2 of 3" / span "Stretch" |
| `.1em` | 11 | 51 | — | 1b 3b 4a 4b 5a 5b 5c 5d 5e 6a 8e | span "Clicks" / span "Water" |
| `.04em` | 7 | 14 | — | 2a 5a 5b 5c 5e 6a 8d | span "Blackcurrant" / span "Grapefruit" |
| `.22em` | 4 | 4 | — | 1b 2a 2b 5c | div "Cup 4 · logged 08:21" / div "The archive" |
| `.02em` | 3 | 21 | — | 1b 4a 4b | span "M" / span "T" |
| `0.16em` | 2 | 4 | — | 4a 4b | div "MoreCoffee" / div "Cups total" |
| `.14em` | 1 | 3 | — | 6a | div "Cups" / div "Bags" |

## Font family — 2 distinct values

| value | screens | uses | properties | screen ids | example elements |
|---|---|---|---|---|---|
| `Archivo,sans-serif` | 30 | 749 | — | 1b 2a 2b 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5c 5d 5e 6a 6d 7a 7b 8c 8d 8e 8f 8g 8h 8i 8j 8l 8m | div "Setup · 2 of 3" / button "Skip all" |
| `'Instrument Serif',serif` | 26 | 84 | — | 1b 2a 2b 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5c 5d 5e 6a 6d 7a 7b 8c 8d 8e 8f 8g 8i | div "How do you usually brew?" / div "Try next" |

## Spacing (padding / margin / gap) — 33 distinct values

| value | screens | uses | properties | screen ids | example elements |
|---|---|---|---|---|---|
| `0` | 30 | 306 | padding, margin | 1b 2a 2b 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5c 5d 5e 6a 6d 7a 7b 8c 8d 8e 8f 8g 8h 8i 8j 8l 8m | div / button "Skip all" |
| `22px` | 30 | 193 | padding, margin, gap | 1b 2a 2b 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5c 5d 5e 6a 6d 7a 7b 8c 8d 8e 8f 8g 8h 8i 8j 8l 8m | div / div "Three more cups to lock it in." |
| `12px` | 29 | 160 | padding, gap | 1b 2a 2b 3a 3b 3c 3d 3e 3f 4a 4b 5a 5c 5d 5e 6a 6d 7a 7b 8c 8d 8e 8f 8g 8h 8i 8j 8l 8m | div / button |
| `16px` | 29 | 153 | padding, gap, margin | 1b 2a 2b 3a 3b 3d 3e 3f 4a 4b 5a 5b 5c 5d 5e 6a 6d 7a 7b 8c 8d 8e 8f 8g 8h 8i 8j 8l 8m | div / button "See the plan" |
| `14px` | 26 | 177 | padding, gap, margin | 1b 2a 2b 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5c 5d 5e 6a 6d 7a 7b 8c 8d 8e 8f 8h 8l | div / div "Two clicks coarser than your V" |
| `9px` | 26 | 97 | gap, padding | 2a 2b 3a 3c 3d 3e 3f 4b 5a 5b 5d 5e 6a 6d 7a 7b 8c 8d 8e 8f 8g 8h 8i 8j 8l 8m | div / span "Blackcurrant" |
| `34px` | 26 | 28 | padding | 1b 2a 2b 3a 3b 3c 3e 3f 4a 4b 5a 5b 5c 5d 5e 6a 6d 7a 7b 8d 8e 8f 8h 8i 8j 8m | div |
| `18px` | 25 | 47 | padding, gap | 1b 2a 3a 3b 3c 3e 3f 4a 4b 5a 5b 5c 5d 5e 6a 6d 7b 8d 8e 8f 8g 8h 8i 8j 8l | div / button |
| `8px` | 24 | 113 | padding, gap, margin | 1b 2a 2b 3d 3e 3f 4a 4b 5a 5b 5c 5d 5e 6a 6d 7a 7b 8c 8d 8e 8f 8h 8j 8l | button "Skip all" / div |
| `20px` | 23 | 58 | padding, margin, gap | 1b 2a 3a 3c 3d 3e 4a 4b 5a 5b 5c 5e 6a 6d 7a 8c 8e 8f 8g 8h 8i 8j 8l | div / div "Drag only what you noticed. Un" |
| `10px` | 21 | 62 | padding, gap, margin | 1b 2a 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5c 5d 5e 6a 6d 7b 8d 8e 8l | span "Stretch" / div |
| `4px` | 20 | 61 | margin, padding, gap | 1b 2a 2b 3a 3b 3c 3d 3e 3f 4a 4b 5a 5c 5d 5e 6a 7a 8d 8f 8l | span "Stretch" / span "This week" |
| `3px` | 19 | 104 | gap, padding | 1b 2a 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5d 5e 6a 7a 8d 8e 8g | div / span "6" |
| `15px` | 19 | 74 | padding, gap | 1b 3b 3c 3f 4a 4b 5a 5d 5e 6a 7a 8c 8d 8f 8g 8i 8j 8l 8m | div / button |
| `5px` | 19 | 73 | gap, padding, margin | 1b 2a 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5d 5e 7a 7b 8d 8e 8f | div / span "One step off profile" |
| `11px` | 18 | 82 | gap, padding | 2a 3e 5a 5b 5c 5d 5e 6a 6d 7a 7b 8e 8f 8h 8i 8j 8l 8m | div / span "juicy" |
| `60px` | 18 | 18 | padding | 1b 2a 2b 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5c 5d 5e 6a 8d | div |
| `6px` | 17 | 62 | gap, margin, padding | 1b 2a 3c 4a 4b 5a 5b 5c 5d 5e 6a 6d 7a 8c 8g 8i 8l | div / span |
| `7px` | 17 | 52 | padding, gap, margin | 2a 3a 3b 3c 3e 4a 5a 5b 5d 5e 6a 7a 7b 8d 8f 8h 8l | span "Stretch" / span "Blackcurrant" |
| `13px` | 14 | 59 | gap, padding, margin | 3b 3c 3d 3f 4b 5a 5d 5e 6a 6d 8g 8h 8j 8m | div / button "Add" |
| `-2px` | 13 | 14 | margin | 1b 4a 4b 6d 7a 7b 8e 8f 8g 8h 8i 8j 8m | button / div |
| `56px` | 12 | 12 | padding | 6d 7a 7b 8c 8e 8f 8g 8h 8i 8j 8l 8m | div |
| `2px` | 11 | 48 | gap, padding, margin | 1b 3b 4a 4b 5b 6a 7b 8g 8i 8j 8m | div / span |
| `30px` | 6 | 8 | padding | 1b 2a 4a 4b 6a 8d | div |
| `24px` | 6 | 6 | padding | 1b 3c 4a 4b 6d 8g | div |
| `26px` | 6 | 6 | padding | 2a 3a 3c 3e 5b 5c | div |
| `100px` | 2 | 4 | padding | 6a 8d | div |
| `-6px` | 2 | 2 | margin | 2b 3b | div |
| `44px` | 1 | 2 | padding | 6a | div |
| `-12px` | 1 | 1 | margin | 2b | button "Reset" |
| `-14px` | 1 | 1 | margin | 2b | button "Reset" |
| `1px` | 1 | 1 | margin | 5d | svg |
| `38px` | 1 | 1 | padding | 8c | div |

## Border radius — 0 distinct values

_None found in any in-scope screen._

## Border width — 2 distinct values

| value | screens | uses | properties | screen ids | example elements |
|---|---|---|---|---|---|
| `1.5px` | 30 | 285 | border-top, border, border-left, border-bottom | 1b 2a 2b 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5c 5d 5e 6a 6d 7a 7b 8c 8d 8e 8f 8g 8h 8i 8j 8l 8m | div / span "Stretch" |
| `2px` | 30 | 276 | border-bottom, border, border-top, border-left, border-right | 1b 2a 2b 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5c 5d 5e 6a 6d 7a 7b 8c 8d 8e 8f 8g 8h 8i 8j 8l 8m | div / span |

## Border style — 2 distinct values

| value | screens | uses | properties | screen ids | example elements |
|---|---|---|---|---|---|
| `solid` | 30 | 504 | border-bottom, border, border-top, border-left, border-right | 1b 2a 2b 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5c 5d 5e 6a 6d 7a 7b 8c 8d 8e 8f 8g 8h 8i 8j 8l 8m | div / span |
| `dashed` | 21 | 57 | border-top, border, border-bottom | 1b 2a 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5c 5d 5e 6a 7b 8d 8e 8f 8g | div / div "Two clicks coarser than your V" |

## Shadow — 4 distinct values

| value | screens | uses | properties | screen ids | example elements |
|---|---|---|---|---|---|
| `5px 5px 0 #273D22` | 13 | 13 | — | 1b 2b 3a 3c 3e 4a 4b 5a 5b 5c 5d 5e 8d | div / button "Save this cup" |
| `4px 4px 0 #273D22` | 9 | 11 | — | 1b 2a 4a 4b 6a 7b 8c 8d 8e | button "Next" / div |
| `3px 3px 0 #273D22` | 3 | 3 | — | 6d 8f 8j | button "Try next" / button "Send" |
| `4px 4px 0 #9E5202` | 1 | 3 | — | 5d | div |

## Icon size — 12 distinct values

| value | screens | uses | properties | screen ids | example elements |
|---|---|---|---|---|---|
| `18px` | 27 | 72 | — | 1b 2a 3a 3b 3c 3d 3f 4a 4b 5a 5b 5d 5e 6a 6d 7a 7b 8c 8d 8e 8f 8g 8h 8i 8j 8l 8m | svg / svg h=20 |
| `20px` | 14 | 54 | — | 1b 2a 2b 3c 3d 4a 4b 5a 5d 5e 6a 7b 8d 8j | svg / svg h=19 |
| `16px` | 11 | 32 | — | 1b 3b 3d 4a 4b 5a 5c 5e 6a 6d 8m | svg |
| `14px` | 11 | 22 | — | 1b 2a 3a 3c 3f 4a 4b 5a 5e 8c 8h | svg |
| `15px` | 6 | 14 | — | 1b 3f 4a 4b 5b 5d | svg |
| `17px` | 6 | 8 | — | 1b 2a 3a 3b 3d 3e | svg |
| `44px` | 6 | 8 | — | 1b 2a 4a 4b 6a 8d | svg h=34 |
| `22px` | 6 | 6 | — | 1b 4a 4b 5a 5c 5d | svg |
| `38px` | 3 | 15 | — | 5a 5d 5e | svg |
| `13px` | 3 | 9 | — | 5a 5d 5e | svg |
| `24px` | 3 | 3 | — | 1b 4a 4b | svg |
| `19px` | 1 | 3 | — | 3b | svg |

## Icon stroke width — 9 distinct values

| value | screens | uses | properties | screen ids | example elements |
|---|---|---|---|---|---|
| `2.4` | 21 | 29 | — | 3a 3b 3c 3d 3f 5a 5b 5d 5e 6d 7a 7b 8c 8e 8f 8g 8h 8i 8j 8l 8m | svg 18px / svg 14px |
| `2.2` | 17 | 68 | — | 2a 3a 3b 3e 3f 5a 5d 5e 6a 6d 7b 8d 8e 8g 8i 8j 8m | svg 18px / svg 20px |
| `2.6` | 9 | 17 | — | 1b 3a 3b 3d 3e 4a 4b 5d 8m | svg 18px / svg 15px |
| `2` | 6 | 19 | — | 3c 3d 4b 5a 5d 5e | svg 38px / svg 22px |
| `1.8` | 4 | 7 | — | 1b 4a 4b 5c | svg 22px / svg 24px |
| `3.4` | 3 | 11 | — | 5a 5d 5e | svg 13px / svg 14px |
| `3.2` | 2 | 4 | — | 3a 8c | svg 14px |
| `3` | 2 | 3 | — | 3c 8m | svg 16px / svg 14px |
| `2.8` | 1 | 1 | — | 2b | svg 20px |

## Fixed element sizes (width / height / min-* / max-width) — 40 distinct values

| value | screens | uses | properties | screen ids | example elements |
|---|---|---|---|---|---|
| `44px` | 26 | 79 | width, height | 1b 2a 2b 3a 3b 3c 3d 3e 3f 4a 4b 5a 5b 5d 5e 6a 6d 7a 7b 8e 8f 8g 8h 8i 8j 8m | button / button "Keep as draft" |
| `56px` | 17 | 22 | height, width | 1b 2b 3a 3b 3c 3d 3e 4a 4b 5a 5b 5c 5d 5e 7b 8c 8e | button / button "Next" |
| `52px` | 12 | 58 | width, height | 3b 3f 5a 5b 5c 5d 5e 8c 8g 8i 8j 8m | button / span |
| `40px` | 10 | 45 | height, width | 1b 2a 4a 4b 5b 6a 6d 8d 8h 8j | span / button "Add" |
| `30px` | 9 | 23 | height | 1b 4a 4b 5b 5c 8g 8i 8j 8m | span |
| `22px` | 7 | 20 | width, height | 3e 5d 6d 8g 8i 8j 8m | span / span "2" |
| `2px` | 7 | 10 | width, height | 3d 3e 4b 5c 6d 8j 8l | span |
| `60px` | 6 | 40 | height, width | 1b 2a 4a 4b 6a 8d | div / span |
| `20px` | 6 | 26 | height, width | 1b 3a 4a 4b 5b 5c | div / span |
| `12px` | 6 | 22 | height, width | 1b 4a 4b 5b 5c 8f | div / span |
| `68px` | 6 | 8 | width | 1b 2a 4a 4b 6a 8d | span |
| `46px` | 5 | 17 | width, height | 3c 3e 5a 5d 5e | div / div "Comandante" |
| `6px` | 4 | 31 | height, width | 5a 5d 5e 8c | span |
| `24px` | 3 | 22 | width, height | 3a 3e 8c | span |
| `58px` | 3 | 18 | width, height | 1b 4a 4b | div |
| `14px` | 3 | 5 | height | 2b 3d 4b | span / div |
| `34px` | 3 | 4 | width, height | 3d 3e 6d | span / div |
| `9px` | 2 | 18 | width, height | 7a 8g | span |
| `66px` | 2 | 8 | width, height | 2a 2b | div |
| `48px` | 2 | 5 | height, width | 3c 8f | button "Try next" / div |
| `4px` | 2 | 4 | height | 3d 4b | div |
| `76px` | 2 | 4 | width, height | 3c 3e | div / button |
| `36px` | 2 | 3 | height | 3e 7a | button "Mark all read" / button "Replace" |
| `1.5px` | 2 | 2 | width, height | 2a 8e | span / div |
| `18px` | 2 | 2 | height | 8j 8l | span |
| `5px` | 2 | 2 | height | 2b 3b | div |
| `28px` | 1 | 8 | width, height | 8h | span |
| `8px` | 1 | 8 | height | 3a | span |
| `10px` | 1 | 6 | width, height | 5c | span |
| `26px` | 1 | 6 | width, height | 8m | span |
| `7px` | 1 | 6 | width, height | 7b | span |
| `88px` | 1 | 4 | width, height | 6d | div / div "Y" |
| `32px` | 1 | 3 | height | 5b | span |
| `11px` | 1 | 2 | height | 2b | div |
| `64px` | 1 | 2 | width, height | 6a | div "Y" |
| `160px` | 1 | 1 | min-height | 8j | div |
| `50px` | 1 | 1 | height | 1b | button |
| `62px` | 1 | 1 | width | 3e | span |
| `78px` | 1 | 1 | min-height | 3e | div "22 clicks for V60, 18 for Aero" |
| `84px` | 1 | 1 | min-height | 5b | div "Cooled down it turned into ice" |
