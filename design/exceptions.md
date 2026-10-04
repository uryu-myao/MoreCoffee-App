# MoreCoffee — True exceptions

Seven values that are genuinely one-off (six extracted from the screens, E-7 added by decision on 2026-10-04): unique in their role, not part of any mechanism, and with no sibling value to pair with. They are recorded rather than folded, because collapsing them would silently delete a possible decision and a placeholder would eventually be filled in by guesswork.

Started from ~60 low-frequency values; after role-scoped thresholds, the two merge gates, mechanism-bound (class A) promotion and the orphan-alias rule, six remain.

Source: `MoreCoffee design.dc.html` · 30 screens · 2026-09-20

---

## E-1 · `#DBCCC3` — skeleton row title, 2b

**Where**: 2b (Sort sheet), 1 use. The screen is a modal sheet: the page behind it is dimmed to `opacity: 0.45` and covered by `color.scrim` (`rgba(39,61,34,.42)`). This value is on the **skeleton placeholder row drawn into that dimmed backdrop**.

```html
<div style="display:flex;gap:14px">
  <div style="width:66px;height:66px;background:#E4D6CC;border:1.5px solid #C8BCB4"></div>
  <div style="flex:1;display:flex;flex-direction:column;gap:8px;padding-top:4px">
    <div style="height:14px;width:60%;background:#DBCCC3"></div>   <!-- this value -->
    <div style="height:11px;width:80%;background:#E4D6CC"></div>
    <div style="height:11px;width:40%;background:#E4D6CC"></div>
  </div>
</div>
```

Parent: the dimmed sheet backdrop. Siblings: two meta bars at `#E4D6CC`, 11px tall. Above it: a 66px thumbnail frame and the husk of a 44px search field.

**ΔE00 to every qualifying anchor in the `fill` role**: `#DCD0C8` 1.49 · `#D9C7BB` 1.88 · `#E4D6CC` 2.60 · `#EFE4DC` 4.07 · `#F4EDEA` 6.34 · `#CBB6A8` 6.45 · `#FFFCFA` 8.16.

**Why not folded**: screen co-occurrence with every candidate is **0** — it never appears on a screen alongside any of them, so any fold would be a guess. It is also a single use and forms no state pair or anatomy.

**Worth noting**: within that one skeleton it does form a two-tone pattern with `#E4D6CC` (darker 14px title bar / lighter 11px meta bars), so it may be part of a structure rather than noise.

**Re-check trigger**: *"When a second sort/filter sheet is designed, re-check this value. If the same kind of fill appears in the same position, it is a surface inside the sheet and should be promoted to a token; if it does not reappear, delete it."*

---

## E-2 · Three 16px fill icons, 3b

**Where**: 3b (My gear selected), 3 uses — `#5C5049` ×2 and `#9E5202` ×1, all `<svg width="16" height="16">` with a `fill` attribute and no `stroke`.

**Why exceptional**: the product's fill-icon system is **rating stars only** — `icon.fill.sm` (14px) and `icon.fill.xl` (38px), both `color.icon.rating` (`#C9821A`), 24 uses across 8 screens. These three are the only filled icons that are not stars and not that colour. Every other icon in the product is stroke-based with `currentColor`.

**ΔE00 to the only qualifying anchor in `icon-fill`** (`#C9821A`): `#5C5049` **33.45** · `#9E5202` **18.22** — both far beyond the 8.0 non-text limit, so no fold is possible.

**Re-check trigger**: when a second screen uses a filled icon that is not a rating star, compare — if the same sizes and colours recur, a `icon.fill.ui` token exists; if not, convert these three to stroke icons.

---

## E-3 · `font-style: italic` + Instrument Serif 20 / lh 1.4 — tasting-note field, 5b

**Where**: 5b (Tasting note), 1 use. **The only italic in the entire product** (file-wide search: 1 hit).

```html
<div style="font-family:Archivo,…;font-size:10px;…;text-transform:uppercase;color:#6B5D55">My words</div>
<div style="border:2px solid #273D22;background:#FFFCFA;padding:16px;min-height:84px;
            font-family:'Instrument Serif',serif;font-style:italic;font-size:20px;
            line-height:1.4;color:#6B5D55">Cooled down it turned into iced tea…</div>
```

**Role**: the multi-line tasting-note **input field** itself (`min-height: 84px`, 2px outline), directly under the "My words" eyebrow. Not a quote and not notification body copy.

**Δ to the serif steps**: `numeral.inline` 22 → **Δ2** · `display.sm` 30 → Δ10 · `display.lg` 40 → Δ20. Its `line-height: 1.4` matches **no** serif step (all others are 0.82–1.1); the nearest relative is the sans `meta` style at 1.45, and the raw 1.4 is shared with `12/500/1.4` and `11/600/1.4`, both already absorbed into `body.sm` / `meta`.

**Note**: this was missed in the first typography pass because the tuple key did not include `font-style`. Fixed, and the full declaration audit that followed found no other omissions.

**Re-check trigger**: *"Re-check when a second multi-line serif body is designed. If the same kind appears, promote as `text.quote`; if not, delete."* Re-check `font-style: italic` at the same time — it hangs off this single use.

---

## E-4 · `rotate(-4deg)` — "Home brewer" badge, 6a

**Where**: 6a (Profile), 1 use.

```html
<span style="transform:rotate(-4deg);padding:7px 10px;background:#F2E4D2;
  border:1.5px solid #8A4602;font-family:Archivo,sans-serif;font-size:10px;
  font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#8A4602">Home brewer</span>
```

A role badge sitting to the right of "Yuka M." (19px/700) and "Logging since Jan 2026 · 34 weeks".

**Other stickers on this screen**: none. 6a's only rotation declaration is this one, so "avoiding an overlap with an adjacent sticker" does not explain it. The four `-3deg` uses are all a different component (the "Early signs" taste badge on 1b, 4a, 4b, 5c), so a per-component angle difference remains possible.

**Δ**: 1 degree from `rotation.sticker` = −3 (4 screens / 4 uses).

**Why not folded**: a 1° difference cannot be classified as drift or intent from the data alone.

**Re-check trigger**: *"Re-check when a third tilted sticker is designed. If it is −3deg, delete −4deg as drift; if it is yet another angle, change the rule to 'angle is tuned per instance'."*

---

## E-5 · Footer bottom padding `38px` — 8c

**Where**: 8c (First setup), 1 use.

```html
<div style="margin-top:auto;padding:20px 22px 38px;background:#FFFCFA;
            border-top:2px solid #273D22;…">
```

The pinned footer bar below "2 of 3 picked".

**Δ**: +4px from `layout.screen.bottom` = 34, which **19 other screens** use for the same footer position.

**Re-check trigger**: *"Every other screen's footer bottom is 34. Re-check when the next screen with a footer is designed: if it is 34, delete this as drift; if it is 38 again, record 8c's specific reason."*

---

## E-6 · Root top padding `44px` — 6a

**Where**: 6a (Profile), 2 uses.

```html
<div style="position:absolute;inset:0;padding:44px 0 100px;…">
```

The scroll container's top padding (its bottom, 100, is `layout.empty.block`).

**Δ**: −16px from `layout.screen.top` = 60, which **18 other screens** use. Profile is the one screen with a shallower header.

**Critical distinction — do not unify**: this `44` is a **padding**. `size.tapTarget` is also `44` (26 screens / 79 uses) but is the minimum hit area of a control. **The shared number is a coincidence.** Merging them would tie screen chrome to interaction sizing.

**Re-check trigger**: *"Every other screen root is 60 at the top. Re-check when a second shallow-header screen is designed."* This is also a structural question, not only a spacing one — see OQ-8.

---

## E-7 · Circle (`border-radius`) — StarRating pressed disc

*Added 2026-10-04 by decision, not extracted from the screens.*

**Where**: the pressed state of each star in the base `StarRating`, 1 use. A 48px disc in `state.pressed.surface` appears behind the star while it is held. The 52px touch target (`size.control.row`) is unchanged.

**Why exceptional**: it is the **only round shape in the product**. `border-radius` appears 0 times across the 30 shipped screens, and §1 Shape says every corner is square. It replaced the original square 52px fill after device review on 2026-10-04.

**Values (local to `StarRating.js`, not tokens)**:
- diameter `48` — sits inside the 52px target, 2px clear on each side
- optical offset `+1` (down) — centres the disc on the star's mass, not on the box. The glyph is centred on its 24-unit viewBox, which puts the star's area centroid 0.84px and its circumcentre 0.81px *below* the box centre at 38px. Tuned by eye at 3× across −2…+2: at +1 the top tip clears the edge by 7.17px and the bottom tips by 7.52px. See `design-system.md` §9 Star rating.

**Why not a token**: one use. The rule of two applies — a token waits for a second occurrence.

**Re-check trigger**: *"When a second round pressed / selection shape is designed, promote a radius token and amend §1 Shape. If none appears, keep E-7 as the single sanctioned circle."*
