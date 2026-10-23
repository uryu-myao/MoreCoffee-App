# V1 status (scope decided 2026-10-11)

> **This scope is what Uryu needs to log his own coffee every day. It is not a version to hand to other people.** Before any store release, Barista, Welcome, settings, Profile and the legal pages need deciding separately. **A screen marked "not now" is not "not needed"; it is "not needed at this stage".**

Scope test (2026-10-11): can Uryu use it every day himself? His cups are mostly I made it, sometimes Packaged; no café visits lately.

**In scope, in order**: 1. 3c / 3a on the compact header · 2. 5c · 3. Home's My beans / My gear + 3d (Finish bag) · 4. Packaged's minimal input (product name only; needs Design) · 5. the rest of Home (cups total, this week, recently sipped).

**In scope since 2026-10-14, after the above**: 3f (minimal: list + Reopen bag), then 3g (minimal: name, roaster, roasted on). Questions: design-missing.md 27–38.

**Not now**: 8g · 8n · 8c · 8o · 7a · 7b · 8i · 8m · 8j · 6b · 6c · 6d · Barista. The Try next tab stays a placeholder (decided before release); Profile is 6a's upper part (2026-10-21).

**Next to fall due (recorded 2026-10-20): 2b (sort) and 8l (search)**, the next deadline we set ourselves after the five-bag problem. Dogfood has a few dozen cups today, so scrolling 2a still reaches them; at two a day that is several hundred within three months, and older cups stop being reachable. Home (1b / 4a / 4b) is already done, so this is the next thing to review.

Status: **done** (built from the mock, checked on the simulator) · **partial** · **not started** · **out** (decided outside V1).

## Screens

| Screen | V1 | Status | What is there / what is missing |
|---|---|---|---|
| 5a Log a cup | yes | **done (I made it)** | I made it fully; 5d's state; pickers. Packaged: minimal input in scope. Barista: not now (selectable, records no café / drink) |
| 5b Tasting note | yes | **done** | axes, flavours + Search sheet, My words, three Save paths |
| 5c Saved — what the cup changed | yes | **done** | over the steps after a save; moved axes from the stored `dna_change`; summary sentence and Try next parts not shown; first-value / nothing-moved lines provisional |
| 5d Missing required fields | yes | **done (rating only)** | copy provisional (Design); café out of scope |
| 5e Packaged | **yes (minimal)** | **done** (2026-10-15) | one Product row: the name as typed, from a search sheet over past products with Add "‹typed›"; also editable in 11a. No brand (Design Round 7), container or store. Migration 4 |
| 3c Add a bag | yes | **partial (minimal)** | name, roaster, roast date. Not: roast level, size, photo, origin / region / process, "Reuse a past bag" |
| 3a Add gear | yes | **partial (minimal)** | 8c's generic list. Not: catalogue, search, models, "Not listed" |
| Bag / gear picker (no mock) | yes | **done** | from 5a |
| 1b / 4a / 4b Home | **yes** | **done** | greeting, cups total + this week strip, Record a coffee, Taste DNA card, recently sipped (→ 2c, See all → Records), My gear / My beans. Taste DNA card's foot row "Open my taste DNA ›" → 8f (Design Round 11, B; 2026-10-23). Not shown: Try next box (V2), the slow-start line (dropped for V1, Design Round 10, C10) |
| 2a Records | yes | **partial** | grouped list, count; rows open 2c; the search field opens 8l, the filter button 2b (2026-10-21). Not: the category chips (All / I made it / Barista / Packaged — the mock's "Ready-to-drink" is the old name), scheduled after 8f (Uryu, 2026-10-21). They are a real filter, so Design's Round 10, 16 / 18 (no "in force" look, "Done" with no count) go back to Design then |
| 2b Sort sheet | **yes (2026-10-21, with 8l)** | **built, not yet seen on device** | four sorts, four groups, Reset, Done; not remembered. Undrawn parts per Design's Round 10 reply (14–18); 14's I made it tail is ours, in the next brief |
| 2c Record (one cup) | **yes** (decided 2026-10-11) | **done** | the pencil opens 11a; "Feeds my taste DNA" opens 8f (D-48, 2026-10-21); share, photo, "22 clicks" / "My default brewer" not shown |
| 11a Edit cup · 11b Delete · 11c Bag picker | **yes** (approved 2026-10-13) | **done** | bag, method, date & time, My words; "As logged" read only; delete with 11b's sheet; the date wins over the bag. Round 4 built: the discard sheet on leaving with changes, "No bag" / "No brewer" / "No grinder", a finished own bag marked. Packaged / Barista: no shelf block until design-missing 6 |
| 3b My gear / 3e Edit gear | **yes (2026-10-22)** | **built (3e minimal), not yet seen on device** | 3b from Home's "Manage my gear" and Profile's My gear; rows open 3e (D-26). 3e: Name (rewrites the cups' copies), Maker, default switch (turns off; a removed default passes to nothing), Remove (asks first; 13b "removed"). Not: photo, Category, Added on, My settings note (T-11). Resolves `gaps.md` 25 |
| 3d My beans | **yes** | **done** | open bags, "Day N", Finish bag (no confirm, no undo at this stage), Add a bag → 3c. Card tap (3g) and Finished bags (3f) not at this stage |
| 3g Edit bag / 3f Finished bags | **yes, minimal (2026-10-14)**: 3f first, then 3g | **3f done** (entry at 3d's foot, rows, Reopen, the 5 / 5 line, the reopened notice); **3g done** (minimal: name, roaster, roasted on, opened on; limits; freshness; Delete; from a 3d card) | 3f's Reopen is the recovery for Finish (gaps 17 / 18), which stays unconfirmed; questions to Design: design-missing.md 27–38 |
| 6a / 6b / 6c Profile | **6a upper part: yes (2026-10-21)** | **6a upper part built, not yet seen on device**; 6b / 6c not started | personal card without name / avatar / badge (6d): "Logging since" over Cups / Bags / Week streak (our rule); Taste DNA card → 8f (the summary line, D12; band-name Badges); My shelf: My gear → 3b (2026-10-22), My beans → 3d; 6b's "Export my cups" row alone under My data (T-8). Not: Edit (6d), My words (8h), "1 stale" |
| 6d Edit profile | not now | not started | |
| 8f My taste DNA | **yes (2026-10-21)** | **built, not yet seen on device** | stamp (ⓘ → 15b), the summary line (Round 10, D12; 2026-10-23), "From N cups · shifted N days ago" (with nothing noted, "Rate a cup and note one taste to start."), four axes with band names, "Flavours I pick most" (top 4 tags, Round 11, B), Last shift (band names + date, no cause). From 6a's card, 2c's "Feeds my taste DNA" and Home's card foot. Not: "What you keep saying" (waits for 8h, T-9), the footer (8g / 8d out of V1) |
| 8g How my DNA is built | not now | not started | copy to adjust for V1 (`gaps.md` 31) |
| 8n / 8c / 8o First setup | not now | not started | `settings.setup_done` ready; 8o reuses the Bag form |
| 8a / 9a / 9b Welcome | out of the token set | not started | designed separately |
| 8b / 8k Sign-in / account | held | not started | |
| 7a / 7b Notifications | not now | not started | |
| 8h My words | not V1 (no word management; `gaps.md` 27) | not started | |
| 8i Reminders · 8j Feedback · 8m Language | not now | not started | |
| 8l Records search | **yes (2026-10-21, with 2b)** | **built, not yet seen on device** | Words (My words + flavour tags) / Beans / Gear (back 2026-10-22, with 3b / 3e), 4★ and up; results open 2c. No recent searches. Undrawn parts per Design's Round 10 reply (19–23); two headings are ours, in the next brief |
| 8d / 8e Try next | **out (V2)** | placeholder tab | |

## The four V1-path gaps

| Gap | Where it stands |
|---|---|
| **Long text** (`gaps.md` 1, 7, 15) | Applied as built: Text's truncation presets (name 2 lines, meta 1, note 3) on every new row and field. Open: Packaged product names need 2 lines (recorded); flavour chips can wrap to 3 rows (accepted). Not yet asked of Design |
| **Tap targets** (`gaps.md` 3, 19) | Chips 44 (decided); new rows (pickers, checkbox lists, fields) ≥ 44; 36pt buttons padded by hitSlop. Open: 19's 36pt buttons as a class (3e / 3g / 7a, not built). Not yet asked of Design |
| **Empty states** (`gaps.md` 5) | Built: 5a with an empty shelf (intro copy waits for Design), Records' "No cups logged", Taste DNA with nothing noted (provisional line; empty axes asked of Design). Open: Home's other parts, Profile, My gear / My beans when built |
| **Loading / error** (`gaps.md` 6) | Built: save failure (alert, copy undesigned), 5d, 3c's name error, add bag / gear failures (alerts). Loading: none needed so far (local SQLite, instant). Open: inline input error (Design to check 3c), offline (no network in V1 yet) |
