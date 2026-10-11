# Handoff to Design — 2026-10-11

## The one source
`../../design-system.md` (in the app repo) is **the only design system file. Please discard any copy kept in your own project.** Its "sealed 2026-09-20" dates the token *extraction*, not the document; the document is current to 2026-10-12 (§12).

## What is in this handoff
1. `../../design-system.md`
2. `../../design-missing.md` — what V1 needs that no mock draws, marked [this round] / [not at this stage]. Your copy proposals of 2026-10-11 are adopted and in the app.
3. `../../design-brief-next.md` — notes for this round (scope, hand-made work, texture.rule retired).
4. `icons.md` — every glyph the built screens use.
5. SE (375 × 667) screenshots of the three sheets built without a mock: `se-search-sheet.png`, `se-picker-method.png`, `se-date-sheet.png`.
   - **The search sheet with the keyboard up will follow** (taken on a device). The simulator here runs headless and cannot raise the software keyboard.

## The search sheet on an SE — measured, not estimated
- **270pt is the list area only**: from the list's top (below the search field and Done) to 12pt above the keyboard. The search field (46) and Done are **not** inside it.
- Sheet top 32; the list starts at 125; the first row is 52 (+ the list's 2px frame), each next row 53.5; **the "Add \"Word\"" row is the same height**.
- With the standard keyboard (260 incl. the predictive bar): **5 full rows** (the 5th ends at 393 of 395). **Not 4.** (270 / 53.5 = 5.05 is right because the 270 excludes the field.)
- Keyboard closed: about 9.5 rows.
