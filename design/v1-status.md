# V1 status (scope decided 2026-10-11)

> **This scope is what Uryu needs to log his own coffee every day. It is not a version to hand to other people.** Before any store release, Barista, Welcome, settings, Profile and the legal pages need deciding separately. **A screen marked "not now" is not "not needed"; it is "not needed at this stage".**

Scope test (2026-10-11): can Uryu use it every day himself? His cups are mostly I made it, sometimes Packaged; no café visits lately.

**In scope, in order**: 1. 3c / 3a on the compact header · 2. 5c · 3. Home's My beans / My gear + 3d (Finish bag) · 4. Packaged's minimal input (product name only; needs Design) · 5. the rest of Home (cups total, this week, recently sipped).

**Not now**: 3f · 3g · 2b · 8l · 3b · 3e · 8f · 8g · 8n · 8c · 8o · 7a · 7b · 8i · 8m · 8j · 6a · 6b · 6c · 6d · Barista. The Profile and Try next tabs stay placeholders (decided before release).

Status: **done** (built from the mock, checked on the simulator) · **partial** · **not started** · **out** (decided outside V1).

## Screens

| Screen | V1 | Status | What is there / what is missing |
|---|---|---|---|
| 5a Log a cup | yes | **done (I made it)** | I made it fully; 5d's state; pickers. Packaged: minimal input in scope. Barista: not now (selectable, records no café / drink) |
| 5b Tasting note | yes | **done** | axes, flavours + Search sheet, My words, three Save paths |
| 5c Saved — what the cup changed | yes | **done** | over the steps after a save; moved axes from the stored `dna_change`; summary sentence and Try next parts not shown; first-value / nothing-moved lines provisional |
| 5d Missing required fields | yes | **done (rating only)** | copy provisional (Design); café out of scope |
| 5e Packaged | **yes (minimal)** | partial | in scope as one row: the product name, free text + history (design-missing.md 15). No brand, container or store |
| 3c Add a bag | yes | **partial (minimal)** | name, roaster, roast date. Not: roast level, size, photo, origin / region / process, "Reuse a past bag" |
| 3a Add gear | yes | **partial (minimal)** | 8c's generic list. Not: catalogue, search, models, "Not listed" |
| Bag / gear picker (no mock) | yes | **done** | from 5a |
| 1b / 4a / 4b Home | **yes** | **partial** | Taste DNA card done. In scope: My gear / My beans (entry to 3d), cups total, this week, recently sipped |
| 2a Records | yes | **partial** | grouped list, count; rows open 2c. No sort (2b), no search (8l) |
| 2b Sort sheet | not now | not started | |
| 2c Record (one cup) | **yes** (decided 2026-10-11) | **done, read only** | edit (pencil) waits for Design; share, photo, "22 clicks" / "My default brewer" not shown |
| 3b My gear / 3e Edit gear | not now | not started | the only way to rename generic gear (`gaps.md` 25) |
| 3d My beans | **yes** | not started | Finish bag frees the 5 slots: without it logging stops at 5 bags (the one item with a deadline) |
| 3g Edit bag / 3f Finished bags | not now | not started | 3f's Reopen is the undo for a mistaken Finish; for own use, losing one of five slots is acceptable and the cups stay |
| 6a / 6b / 6c Profile | not now | not started (placeholder) | 6a is 8f's entry point |
| 6d Edit profile | not now | not started | |
| 8f My taste DNA | not now | not started | needs the shift history (`dna_change`, stored) and Design's answers (8f's two contradictions) |
| 8g How my DNA is built | not now | not started | copy to adjust for V1 (`gaps.md` 31) |
| 8n / 8c / 8o First setup | not now | not started | `settings.setup_done` ready; 8o reuses the Bag form |
| 8a / 9a / 9b Welcome | out of the token set | not started | designed separately |
| 8b / 8k Sign-in / account | held | not started | |
| 7a / 7b Notifications | not now | not started | |
| 8h My words | not V1 (no word management; `gaps.md` 27) | not started | |
| 8i Reminders · 8j Feedback · 8m Language | not now | not started | |
| 8l Records search | not now | not started | |
| 8d / 8e Try next | **out (V2)** | placeholder tab | |

## The four V1-path gaps

| Gap | Where it stands |
|---|---|
| **Long text** (`gaps.md` 1, 7, 15) | Applied as built: Text's truncation presets (name 2 lines, meta 1, note 3) on every new row and field. Open: Packaged product names need 2 lines (recorded); flavour chips can wrap to 3 rows (accepted). Not yet asked of Design |
| **Tap targets** (`gaps.md` 3, 19) | Chips 44 (decided); new rows (pickers, checkbox lists, fields) ≥ 44; 36pt buttons padded by hitSlop. Open: 19's 36pt buttons as a class (3e / 3g / 7a, not built). Not yet asked of Design |
| **Empty states** (`gaps.md` 5) | Built: 5a with an empty shelf (intro copy waits for Design), Records' "No cups logged", Taste DNA with nothing noted (provisional line; empty axes asked of Design). Open: Home's other parts, Profile, My gear / My beans when built |
| **Loading / error** (`gaps.md` 6) | Built: save failure (alert, copy undesigned), 5d, 3c's name error, add bag / gear failures (alerts). Loading: none needed so far (local SQLite, instant). Open: inline input error (Design to check 3c), offline (no network in V1 yet) |
