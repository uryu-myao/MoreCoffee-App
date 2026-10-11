# V1 status (2026-10-11, before 5c)

Where every screen stands, and the four V1-path gaps. **"V1?" marks screens whose V1 membership has not been decided.** V1 is "the capture → Taste DNA loop" (`data-model.md`); this table does not decide membership.

Status: **done** (built from the mock, checked on the simulator) · **partial** · **not started** · **out** (decided outside V1).

## Screens

| Screen | V1 | Status | What is there / what is missing |
|---|---|---|---|
| 5a Log a cup | yes | **done (I made it)** | I made it fully; 5d's state; pickers. Barista / Packaged show the seed's café / product, no pickers (MapKit, barcode not built) |
| 5b Tasting note | yes | **done** | axes, flavours + Search sheet, My words, three Save paths |
| 5c Saved — what the cup changed | yes | **not started** | next; `dna_change` already stored |
| 5d Missing required fields | yes | **done (rating only)** | copy provisional (Design); café out of scope |
| 5e Packaged | yes? | partial | fields shown from the seed; no product / store pickers |
| 3c Add a bag | yes | **partial (minimal)** | name, roaster, roast date. Not: roast level, size, photo, origin / region / process, "Reuse a past bag" |
| 3a Add gear | yes | **partial (minimal)** | 8c's generic list. Not: catalogue, search, models, "Not listed" |
| Bag / gear picker (no mock) | yes | **done** | from 5a |
| 1b / 4a / 4b Home | yes | **partial** | Taste DNA card only. Not: cups total, this week, recently sipped, My gear / My beans |
| 2a Records | yes | **partial** | grouped list, count. Rows don't open 2c; no sort (2b), no search (8l) |
| 2b Sort sheet | V1? | not started | |
| 2c Record (one cup) | V1? | not started | the place to see a cup's note and its 5c change again |
| 3b My gear / 3e Edit gear | V1? | not started | the only way to rename generic gear (`gaps.md` 25) |
| 3d My beans / 3g Edit bag / 3f Finished bags | V1? | not started | "Finish bag" frees the 5 slots; without it a user stalls at 5 open bags |
| 6a / 6b / 6c Profile | V1? | not started (placeholder) | 6a is 8f's entry point |
| 6d Edit profile | V1? | not started | |
| 8f My taste DNA | V1? | not started | needs the shift history (`dna_change`, stored) and Design's answers (8f's two contradictions) |
| 8g How my DNA is built | V1? | not started | copy to adjust for V1 (`gaps.md` 31) |
| 8n / 8c / 8o First setup | V1? | not started | `settings.setup_done` ready; 8o reuses the Bag form |
| 8a / 9a / 9b Welcome | out of the token set | not started | designed separately |
| 8b / 8k Sign-in / account | held | not started | |
| 7a / 7b Notifications | V1? | not started | |
| 8h My words | not V1 (no word management; `gaps.md` 27) | not started | |
| 8i Reminders · 8j Feedback · 8m Language | V1? | not started | |
| 8l Records search | V1? | not started | |
| 8d / 8e Try next | **out (V2)** | placeholder tab | |

## The four V1-path gaps

| Gap | Where it stands |
|---|---|
| **Long text** (`gaps.md` 1, 7, 15) | Applied as built: Text's truncation presets (name 2 lines, meta 1, note 3) on every new row and field. Open: Packaged product names need 2 lines (recorded); flavour chips can wrap to 3 rows (accepted). Not yet asked of Design |
| **Tap targets** (`gaps.md` 3, 19) | Chips 44 (decided); new rows (pickers, checkbox lists, fields) ≥ 44; 36pt buttons padded by hitSlop. Open: 19's 36pt buttons as a class (3e / 3g / 7a, not built). Not yet asked of Design |
| **Empty states** (`gaps.md` 5) | Built: 5a with an empty shelf (intro copy waits for Design), Records' "No cups logged", Taste DNA with nothing noted (provisional line; empty axes asked of Design). Open: Home's other parts, Profile, My gear / My beans when built |
| **Loading / error** (`gaps.md` 6) | Built: save failure (alert, copy undesigned), 5d, 3c's name error, add bag / gear failures (alerts). Loading: none needed so far (local SQLite, instant). Open: inline input error (Design to check 3c), offline (no network in V1 yet) |
