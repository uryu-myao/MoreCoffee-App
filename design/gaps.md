# MoreCoffee — State gaps to design

States and behaviours the React Native code will need that **do not exist anywhere in the 30 shipped screens**. Ordered by how directly each one causes a production failure.

Source: `MoreCoffee design.dc.html` · 30 screens · 2026-09-20

---

## 1. Long text from user input has no truncation anywhere — **highest risk**

**Parts affected**: every place a user-supplied string is rendered — bean name, roaster name, gear name, profile name, tasting note, "My words" entries, café name.

**Measured**: `text-overflow` **0 uses / 30 screens**. `-webkit-line-clamp` **0**. `overflow-x` / `overflow-y` **0**. The only clipping in the product is `overflow: hidden` on the screen root (15 screens), and the only wrap control is `white-space: nowrap` (5 screens / 40 uses) — **none of which is on user-supplied text**.

**What happens if left alone**: a long bean name wraps freely and pushes a list row taller, breaking the aligned right-hand meta column; inside any fixed-height row (`size.field.height` 46, `size.tapTarget` 44, `size.control.row` 52) it is clipped by the parent instead, silently hiding content. Neither outcome was designed, so RN engineers will each invent their own behaviour.

**Needs designing**: line count per surface (list-row title, card title, note preview, profile name), the truncation form (ellipsis vs clamp vs shrink), and the full-text affordance (tap to expand vs detail screen).

**Status (2026-10-04)**: decided in code, pending design review — see `design-system.md` §3.1. Tail ellipsis; `name` 2 lines, `meta` 1, `note` 3; full text on the detail screen.

---

## 2. No focus state exists — **high risk for accessibility and TV/keyboard input**

**Parts affected**: every field, button and chip.

**Measured**: `outline` **0 uses / 30 screens**. The only focus expression in the product is `color.caret` (a 2px text cursor, 4 screens).

**What happens if left alone**: keyboard and screen-reader users have no visible focus; RN's default focus ring (where it exists) will fight the square, hard-edged visual language.

**Needs designing**: a focus treatment consistent with the binary border system (a 2px outline is the obvious candidate, since a third border width is forbidden).

---

## 3. Tappable chips are 39px tall and are not marked as tappable

**Parts affected**: `badge.standalone` used as a control — 5a's maker picker (3 uses, the only genuinely tappable chips in the product), 3f's sort chips ("Newest" / "Best rated" / "Most cups"), 2b's range chips.

**Measured**: the 3 tappable chips compute to **11 (v) × 2 + ~14 (line box) = 39px**, below `size.tapTarget` = 44. The 3f and 2b chips read as controls but are plain `<span>`s with **no `cursor: pointer` and no selected state**.

**What happens if left alone**: sub-44px hit areas fail platform guidance and feel unreliable under thumb; chips that look pressable but are not produce dead taps.

**Needs designing**: the tappable chip's height (padding or an invisible hit-slop), plus its pressed / selected / disabled states. Deciding which chips are interactive at all is OQ-13.

---

## 4. Pressed, disabled and loading states are undesigned for every component

**Parts affected**: all buttons (primary / secondary / tertiary / icon), all chips, list rows, form fields, the tab bar.

**Measured**: `:active`, `:hover`, `:focus`, `cursor: not-allowed`, `pointer-events` — **0 uses each**. `opacity` appears **twice, both on the 2b sheet's dimmed backdrop** (0.45), not as a disabled treatment. The nearest thing to a disabled state in the whole product is `border.empty.disabled` (`2px dashed` `color.border.muted`) on 5d's blocked add-button, and the greyed marker `marker.optional`.

**What happens if left alone**: hard shadows make press feedback especially conspicuous by its absence — the natural affordance is the shadow collapsing, and if nobody specifies it, each screen invents a different amount. Async actions ("Save this cup") have no in-flight state, so double submissions are invisible.

**Needs designing**: press (shadow offset → 0? translate?), disabled (which of ink/border/surface changes), loading (spinner vs skeleton vs label swap) for each component in the base set.

**Status (2026-10-04)**: Button disabled is decided — see `design-system.md` §9. Press and loading remain undesigned for every component, and disabled remains undesigned for chips, rows and fields.

---

## 5. Empty states exist for only one surface

**Parts affected**: Records list, My gear, My beans, Notifications, Try next, My words, Finished bags.

**Measured**: exactly one empty treatment exists — 2a's `2px dashed` `color.border.muted` frame plus the `layout.empty.block` (100) spacer. 2b contains a skeleton row (`#DBCCC3` title bar + two `#E4D6CC` meta bars) but that is a dimmed backdrop, not a designed loading state.

**What happens if left alone**: a new user sees blank screens on first launch — the worst possible first impression for a logging app whose whole premise is accumulating records.

**Needs designing**: first-run empty state per list, and whether empty differs from loading.

---

## 6. Error states exist for one screen only

**Parts affected**: every form and every network action.

**Measured**: the error system (`state.error.border` / `.surface` / `.shadow` / `.text` / `.dashed`) appears on **5d alone** — missing required fields in the log-a-cup form. There is no network error, no save failure, no offline state, no per-field inline error.

**What happens if left alone**: the vocabulary exists (brown border + brown hard shadow + tinted surface) but its scope is unproven; engineers will apply it to failures it was not designed for, or invent a red that does not exist in the palette.

**Needs designing**: save failure, offline, and per-field inline error, reusing the 5d vocabulary.

---

## 7. Nowrap chips will overflow once the UI is translated

**Parts affected**: the 40 `nowrap` uses — **all fixed copy, none user-supplied**: brew-method chips `Filter / Espresso / Cold brew` (12), maker chips `I made it / Barista / Ready-to-drink` (12), dates `Apr 8 / Apr 7 / Apr 6` (12), status label `Early signs` (4).

**What happens if left alone**: safe in English. Once Japanese and Simplified Chinese ship (8m already lists three languages), `READY-TO-DRINK` and `Best rated` grow while `nowrap` keeps them on one line — they will push out of the row or out of the card.

**Needs designing**: per-locale behaviour for chips — shorter strings, wrapping allowed, or horizontal scroll.

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
