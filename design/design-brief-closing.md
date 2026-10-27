# Design brief — closing this round (2026-10-10)

Four requests. When they are done, this round of Design work is closed. Apply every change in your **source files** (not the exported HTML), and take values only from `design-system.md`.

---

## 1. Export the updated file

We record 21 drift entries as "Applied (Design, A)" on your report alone; the repo has no export showing them.

**Please export `MoreCoffee design.dc.html` with groups A, the addendum and the drift fixes below applied.** We will check each entry against it, one by one:

> D-1, D-2, D-4, D-5, D-6, D-19, D-20, D-21, D-22, D-23, D-24, D-26, D-27, D-28, D-29, D-30, D-31, D-33, D-36, D-41
> (D-3 is withdrawn: 3b's sheet no longer exists.)

Any entry not visible in the export goes back to "Active".

## 2. Drift to apply (eight entries)

Each correct value cites `design-system.md` directly. Do not copy another screen's part as the example.

| # | screens | apply |
|---|---|---|
| D-18 | 1b ×2, 2c, 3c, 3e, 3g, 4a, 4b, 5b, 5c, 7b, 8e, 8f, 8j, 8m, 8o | Card padding → **`inset.container` (14 / 16)** (replaces "20 / 18") |
| D-34 | 1b, 4a, 4b | **12** between "CUPS TOTAL" and the 96px count on all three (1b: 0 + 2 → 12; 4a / 4b: 10 + 2 = 12). Row height unchanged. §3: the digits fill their box, so the space is set by the ink |
| D-21 | 5b | Search opener → `border.addSlot`: **2px dashed #6B5D55** |
| D-25 | 3d | "Finish bag" → **§9 `secondary`** (`color.surface.ground`, 2px ink outline, ink label), full width in the card's lower strip (D-29) |
| D-27 | 8e | the text action reads **"Add bag to my beans"** |
| D-40 | 3g | "Remove photo" → **§9 `secondary` + `small` (36)** |
| D-20 | 3e | Switch → **`size.switch`** (§5: 52 × 30, square knob 22, inset 2), on = `color.action.bg` |
| D-35 | 8n | Radio marker → **§9 Radio marker**: square; outer `size.checkbox` (24) with a 2px frame; selected inner mark 24 − 2 × 2 − 2 × 4 = **12** square, ink (D-36). It must read differently from the checkbox's tick |

## 3. Three open questions: please report, do not change yet

- **D-37: dashed underline on 8o's optional fields.** Does a dashed underline mean "optional"?
  - Survey the other forms (3c, 3e, 3g, 5a, 6d): how are optional fields drawn there?
  - Is there one consistent rule? Dashed already has its uses (§8); "optional" would be a third.
- **D-38: placeholder colour.** Today:
  - 8o uses `#A39389` (not a token);
  - 2a / 3a / 3c use `text.secondary`;
  - 5b's "My words" uses `text.muted`.
  - Is 5b's "My words" in the same role as the other placeholders, or a different one (an example sentence inside a note field)? Report what the screens support.
- **D-39: footer bottom padding 38** on 8c, 8n and 8o (other screens: 34). Is it a value shared by the whole setup flow for a reason, or should it be 34?

## 4. 6a "My shelf": report only

"shelf" is now defined as registered belongings, **gear + beans** (`design-system.md` §1 Words). Words are not on the shelf: they come out of logging rather than being picked. So the heading "My shelf" over My gear / My beans / **My words** no longer fits.

Report what the screen supports:
- change the heading, or
- move My words under another existing heading.

**Do not invent a new heading.** If nothing on the screens supports either, say so.

---

**Not in this round**: group B. Of its items, only those on V1's path are needed (long text, tap targets, empty states, loading / error). They will be asked for one at a time, as implementation reaches them.
