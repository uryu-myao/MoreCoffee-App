# Design brief — group A, addendum (2026-10-10)

Six drift entries were rewritten after group A was done. Apply them in your **source files**. Each correct value cites `design-system.md` directly; do not copy another screen's part as the example (§1, "Correct values in drift point to the spec").

| # | screens | change |
|---|---|---|
| D-18 | 1b ×2, 2c, 3c, 3e, 3g, 4a, 4b, 5b, 5c, 7b, 8e, 8f, 8j, 8m, 8o | Card padding → **`inset.container` (14 / 16)**. Replaces the earlier "20 / 18". StarRating's card already ships at 14 / 16 |
| D-34 | 1b, 4a, 4b | **12** between "CUPS TOTAL" and the 96px count on all three (1b: 0 + 2 → 12; 4a / 4b: 10 + 2 = 12). Row height stays the same. Replaces the earlier "10 + 2 on 1b". Reason: §3, the digits fill their box, so space is set by the ink |
| D-21 | 5b | Search opener → `border.addSlot`: **2px dashed #6B5D55** (not "ink") |
| D-25 | 3d | "Finish bag" → **§9 `secondary`** (`color.surface.ground`, 2px ink outline, ink label), full width in the card's lower strip (D-29). Not "as Edit": Edit is removed, and the secondary fill is ground, not raised |
| D-27 | 8e | the text action reads **"Add bag to my beans"** |
| D-40 | 3g | "Remove photo" → **§9 `secondary` + `small` (36)**. Not "as Replace" |

Not included:
- D-10 is withdrawn (→ D-17 / D-32).
- D-20 and D-35 wait until their sizes have tokens.
