# MoreCoffee — Structural TODOs

Moves and follow-ups that are neither drift (a design value to correct) nor a design gap. Each item says what is temporary and what has to be re-checked when it is resolved.

## ~~T-1~~ · Move Tasting note (5b) into the Record overlay — logged 2026-10-06, **done 2026-10-07**

**Done**: Try next is its placeholder again. 5b is step 2 of the Record sheet, opened by "Add tasting note" (push from the right, `motion.expand`) with Back returning to step 1. The bar padding is gone (its foot is `max(safe area, layout.screen.bottom)`). Re-checked inside the sheet: the collapse behaves the same (`design-system.md` §9 Header collapse). The history below is kept.

**Now**: `TastingNoteScreen` stands in for the Try next tab (`src/screens/index.js`), **for verification only**. In the tab pager its header collapse and the bottom bar's hide / reveal can both be checked.

**Target**: Record coffee → 5b inside the Record overlay, as step 2 of 2 (back returns to step 1).

**To revert the stand-in**: set `tryNext` back to `TryNextPlaceholder` in `src/screens/index.js` and drop the `TastingNoteScreen` import. Also drop `TastingNoteScreen`'s bottom padding for the bar (`layout.empty.block`): the overlay covers the bar, and 5b's own foot is `layout.screen.bottom`.

**Re-check after the move**: the header collapse inside the overlay. Everything verified so far was outside a modal: the overlay has no ScrollChromeContext, and its own slide-up transform sits above the collapse.

## T-2 · Flavour tags: Search opens nothing yet — logged 2026-10-08

**Now**: when the flavour tags are built, their **Search** opener is pressable (button role, press feedback) but **does nothing**.

**Target** (decided 2026-10-08): Search opens a bottom sheet with a search field and a candidate list. A query with no match offers **Add "xxx"**, which adds a new flavour (the same way out as typing a café by hand when MapKit has no match).

**Why it waits**: the sheet (component #25) and the search field (#24) are not built. The order was changed for this:
1. flavour tags (the tags themselves; Search inert);
2. search field / bottom sheet;
3. wire Search to the sheet.

**Re-check when wired**: at the selection limit Search is locked with the options (§1 Selection limit).

## T-4 · 5a's "Add a bag" / "Add gear" lead nowhere yet — logged 2026-10-10

**Now (5a stage 1)**: with no bag or no gear, 5a's rows show "Add a bag" / "Add gear" without a required mark (§1 Required marks), and pressing them does nothing. 3c (add a bag) and 3a (add gear) are not built.

**Consequence**: someone with no bag (8o skipped) has no way to register one, so every cup they log has no bean details. Taste DNA's axes still work, but Try next and the bean side do not.

**Target**: the rows open 3c / 3a. Priority: see the 5a stage plan.

**Closed 2026-10-11 (stage 3)**: the picker opens from 5a's Bag / Method rows, with "Add a bag" / "Add gear" in it, so 3c / 3a are reachable at any time.

**Update 2026-10-10 (stage 2)**: "Add a bag" now opens 3c (minimal). **But 3c is reachable only while no bag is open.** With one open bag, 5a pre-fills it, and the Bag row (a picker, stage 3) does nothing, so **a second bag cannot be added** until 3d's "Add a bag" or the picker exists. The 5-slot limit state is therefore not reachable in the app yet. 3a (minimal) is built the same way (2026-10-10); its limit was checked by seeding 7 gear, and 3c's by adding 5 open bags while 5a showed "Add a bag".

## V1 candidates

- **The bag's printed flavours as the first flavour suggestions** (2026-10-09).
  - When a cup is logged from a bag, offer that bag's `notes` (the flavours printed on it: Jasmine, White peach, Black tea) first among 5b's flavour suggestions, ahead of history and the bundled list.
  - They are the words on the bag being brewed right now, so the best guess; local, no backend.
  - Needs a notes field in 3c / 3g, not built until this is adopted (`data-model.md` `beans.notes`).
  - Decide once the flavour tags work.

## T-3 · 8j Send feedback: no sending path — logged 2026-10-10

8j's form (topic, message, screenshot, app version, reply email) has nowhere to send to. Mail composer, a form endpoint and a backend are all undecided. Outside the capture loop. **Do not build the screen until the path is defined.**

## V2 candidates

Out of V1's scope (the capture → Taste DNA loop only). Kept so the idea is not lost; treated like Try next and Atlas.

- **Filter Records by a taste attribute** (2026-10-07): tapping 6a's "Acidity high" or 8d's "Blackcurrant" would lead to the records with that attribute. No mock draws the destination, and 8l's search covers words / beans / gear / rating, not attributes. It would be a new screen, so it is not built in V1. The attribute tags stay display-only (`design-system.md` §1 Tap affordance).

## T-5. Roast date ≤ opened date, once 3g edits both (recorded 2026-10-10)
**Now**: 3c sets the opened date to today, and Roasted on's picker stops at today (`maximumDate`), so roasted ≤ opened holds by itself.
**When 3g can edit the roast and opened dates separately**: the roast date's maximum becomes the opened date (and the opened date's minimum the roast date).

## T-6. Check §1 against the code at the final polish (recorded 2026-10-10)
5b's "5 of 5" did not turn accent at the limit although §1 says so (fixed 2026-10-10). Before release, go through §1 rule by rule and confirm each is implemented.

**Pass 1, 2026-10-20** (live code only; the retired screens left out). Grepped where a rule is mechanical, read where it is behaviour.

Holds: Shape (no radius on containers; the two radii are the axis dot and the star's press disc, both radial), border widths and styles, hard shadows only, two families, no 400, no italics, motion only through `motion.*`, press never by opacity (the opacity uses are fades), header collapse (controls stay, information fades), warning haptic on 5b's locked Search, 3c's Open / Add without opening when full, 3a's Save 0 items; selection haptic on StarRating and the axis; 5b's limit (accent count, light impact once, locked hint); disabled markers `border.muted` (CheckboxList, RadioList); `state.pressed.row` on every whole row (sheets go through RadioList); a screen-reader role on every Pressable; row chevrons (RecordRow).

Written but not built:
1. ~~**3a's selection limit (8)**~~ **fixed 2026-10-20**: no light impact when the cap is reached, and the locked rows carry no hint ("Limit reached — deselect one to choose another"). 5b has both (RecordDraft, TastingNoteScreen); CheckboxList has neither. Fix: AddGearScreen's light impact at the cap; CheckboxList's `lockedHint` (§1's line by default, so 5b's search sheet rows get it too; "No slots left." when a full shelf leaves nothing to deselect).
2. ~~**Bare text actions don't scale on press**~~ **fixed 2026-10-20**: 5d's "Go to first" (RecordCoffeeScreen) and 3f's "Reopen bag" (FinishedBagsScreen) are Pressables around `inlineAction` text with no feedback. §1 Pressed: surface-less → scale. `Button variant="text"` already does it. Fix: both now use the new base `InlineAction` (scales over `motion.press`).

Spec questions (not code), **answered by Design 2026-10-20** (`design-response-next.md`, T-6 pass 1 — reply):
3. ~~**3a's count "turns accent at the limit"**~~ **(a): the rule is for inline counts, not header stats.** the compact header's stat numeral is always `displaySm` accent, so the rule cannot show there. Design: drop it for header stats, or give the stat an off-limit colour.
4. ~~**Text action colour contradicts itself**~~ **Ink wins; InlineAction is ink, `color.text.link` removed.** §1 Tap affordance says text actions are ink; §3 (`text.inlineAction`) pairs them with `color.text.link` (blue), and the code follows §3. Which wins?
5. ~~**5b's locked hint words**~~ **Meaning, not copy; 5b's line stays.** ("Limit reached, 5 of 5. Deselect a flavour to choose another.") differ from §1's ("Limit reached — deselect one to choose another"). Fine as long as §1's is read as the meaning, not the copy.

Not yet due (§1 says so itself): light impact on Button, FieldRow and the other pressables waits for their Step 4 spec; no spec in `components.md` turns it on yet. Focus applies nowhere on iOS.

Not covered by pass 1, to do by eye at the final polish: Colour roles value by value, and Required marks per mode.

## T-7. A failed WAL checkpoint goes unnoticed (recorded 2026-10-21)
`DatabaseProvider`'s background checkpoint (`data-model.md`, WAL and backups) fails two ways, and neither can be seen on a release build:
- **It throws** (I/O error, closed database): caught and sent to `console.error`, which a release build shows to no one.
- **It is busy** (another statement holds the database): `PRAGMA wal_checkpoint` does not throw. It returns a row (`busy`, `log`, `checkpointed`) with `busy = 1`, and `execAsync` throws that row away. Nothing is logged at all.

The app must not stop either way: the next background tries again.

**Done 2026-10-21, narrowed**: the row is read (`getFirstAsync`), and `busy = 1` goes to `console.error` like a thrown error. Nothing is written to a file or carried in the export. One failed checkpoint does no harm: the next background retries, and the backup holds `.db` and `-wal` together. Checked:
- **Can busy repeat every time? No.** One connection serves the app. No statement stays open (no `prepareAsync`, no `getEachAsync`). Saves use `withExclusiveTransactionAsync`, which opens its own connection and closes it in `finally` after a few milliseconds. Busy needs a save still running at the instant the app goes to the background.
- **What busy returns** (node:sqlite, a read left open on another connection): `{ busy: 1, log: 7, checkpointed: 7 }`, no throw. Once the read ends: `{ busy: 0, log: 0, checkpointed: 0 }`.
- **The export sees the WAL.** It reads through SQLite (`SELECT *` on the app's connection), not by copying the file, and SQLite reads include `-wal`. Same test: with 5 rows only in `-wal`, a second connection reads 5; a copy of the `.db` alone has no table at all.

## T-8. Profile's placeholder carries two interim entries (recorded 2026-10-21)
Until 6a is built, Profile's placeholder (`screens/index.js`) holds:
- **"My taste DNA"** → 8f (2026-10-21). 6a's Taste DNA card is its real entry.
- **"Export my log (JSON)"** (2026-10-20). 6b's export / backup is its real home.

**When 6a is built, move both**: 8f's entry into 6a's card, the export to wherever 6a / 6b put it. Neither may be dropped with the placeholder.

**Updated 2026-10-21 (6a's upper part)**: 8f's entry becomes 6a's Taste DNA card. The export is the only way to get the data out, so it must never be dropped. 6a's upper part has no place for it, so it moves to an interim row under 6a: 6b's own "My data / Export my cups" row, built alone (built 2026-10-21; the placeholder is gone). **When 6b is built, the export joins the rest of 6b's My data (Backup, …) in its final form.**

**Updated 2026-10-28 (CSV)**: My data now has 6b's two rows. "Export my cups" is the CSV 6b draws (`data/csv.ts`; one cup a row, 27 columns). The JSON of every table moved to 6b's **Backup** row as **"Export everything" — INTERIM**: 6b's Backup saves by itself ("Last saved today, 08:24"), and this is a manual export of everything, a different thing. It stays until the real backup is built, because it is the only way the bags' and gear's own records (size, default, finished on) get out. Label and sub line ("Export everything" / "Cups, bags and gear, as JSON") are Design's, Round 16 B8: "Back up" would promise a restore that doesn't exist.

## T-9. 8f's "What you keep saying" waits for 8h (recorded 2026-10-21)
The block counts **My words** (what the user wrote; `components.md`, Words), not flavour tags (picked from a fixed set). It is not shown until 8h and My words' counts exist. Flavour tags are not a stand-in: under that heading they would pass picked category words off as the user's own words.
- **Keep for then**: tapping a word opens 8l on the Words scope with that word typed (8l is built, 2026-10-21).
- "Flavours I pick most" is its own block (Design Round 11, B; built 2026-10-23), above where this one will go. **When 8h comes**: "What you keep saying" goes under it, and each block gets its sub-heading, "From the flavour list" / "In my own words" (body.sm, `text.secondary`).

## T-10. Pressable blocks: one design pass (recorded 2026-10-21, Uryu) — DONE 2026-10-23
Pressable blocks and rows were each settled on their own, so the app and the boards differ: 2a's cup rows, Home's Recently sipped rows, 2c's "Feeds my taste DNA", 8l's results, 3d's cards, the shelf's Manage row; and 8f's "Last shift", a framed block that is not pressable. Uryu wants one treatment designed for all of them together.
- **Sent as**: `design-brief-next.md`, "Pressable blocks: one treatment across the app" (the inventory, board vs built, and the rules in force).
- **Answered**: Design Round 11, C (`design-response-next.md`). The chevron is the only sign a block opens something (16, `text.secondary`); 2c's › moves to the heading line's end; 8l's results drop the 2px frame and become `RecordRow`; → arrows become the chevron; Profile's Taste DNA card is the one framed pressable block.
- **Built 2026-10-23**: `component.chevron` / base `Chevron` on every row of the inventory, plus 3b's rows and 6a's My gear row; §1 Tap affordance, D-48 and D-49 updated. 8l's matched text was tried as RecordRow's `match` and dropped on device (Uryu, 2026-10-23: it read as a second badge); reported in the next brief.
- **Closed.**


## T-11. The grind setting is held back in three places (recorded 2026-10-22, planner)
Grind is not in V1, and three parts wait on it. **They move together**: whoever builds grind starts here, not by finding each one alone.
- **`cups.grind_setting`**: the column exists (a V1.5 column, `schema.ts`), with no input on 5a or 11a.
- **2c's "22 clicks"**: not shown (`data-model.md`, the addendum; open).
- **3e's "My settings note"**: not built. Its line, "Prefills the grind field when you pick this grinder", promises a field V1 doesn't have. `gear.settings_note` exists, unused.

When grind is built: the input (5a / 11a), 2c's line, and 3e's note with its prefill, in one change.

## T-12. Gestures still use Gesture Handler's legacy API (recorded 2026-10-24, SDK 58)

Expo SDK 58 brought react-native-gesture-handler 3, which deprecates the `Gesture.Pan()` / `Gesture.Tap()` builder API in favour of hooks (`usePanGesture`, `useTapGesture`). The builder still works in 3.x (`GestureDetector` hands legacy gestures to its legacy detector), so the upgrade kept it.

- **Where**: PushedScreen (edge swipe back), AddCoffeeOverlay (edge swipe), BottomSheet (swipe to close), AxisSlider (pan + tap, `Gesture.Exclusive`).
- **Coupled**: the sheets' lists (PickerSheet, SearchSheet, DnaInfoSheet) import `LegacyScrollView`, which takes turns with the legacy sheet swipe as before. Move them to the new `ScrollView` in the same change as BottomSheet's gesture.
- **When**: before Gesture Handler removes the builder, or with the next gesture work. One change, checked on device (each swipe, the slider, and a sheet's list scrolling against its swipe).

## T-13. A café's name is read through place_id, not copied onto the cup (recorded 2026-10-30)
Bags and gear are copied onto the cup at logging (`bean_*`, `brew_method`, `grinder`): a cup is a fact, and the bag can be edited or deleted. A Barista cup's café is not: 2a / 2c / search / the CSV read `places.name` through `cups.place_id`. Inconsistent, but harmless while a places row never changes — and today none does: no screen edits or deletes a place, `placeIdFor` never renames one (a later visit under a new MapKit name keeps the stored one), and 11a's café edit points the cup at another row rather than changing a row.
- **It stops being harmless the day** a places row can be renamed (a place edit screen, or refreshing names from MapKit) or deleted (`ON DELETE SET NULL` would strip the café from every cup). Before either, copy the name onto cups (`cups.place_name`, an ALTER TABLE ADD COLUMN with a backfill from places).
- **Decision**: pending (Uryu, after the 2026-10-30 report).

## T-14. Try next (8d / 8e): what the mocks need that V1 doesn't have (recorded 2026-10-30, read only)
Read for planning after Barista; nothing built. Full transcript of both boards: the 2026-10-30 report.
- **What is suggested**: a direction, never a product — origin + process + a brew change ("A washed Kenyan, ground coarser"; "Same bag, 2°C cooler"; "A natural process, once"). The one proper name, "Revisit Hoja Verde", is a bag from the user's own history (8l / 16c). "Add bag to my beans" means the user buys and adds it. **No bean database is needed.**
- **What it does need and V1 lacks**: a static table from origin / process to the axes ("Kenya pushes acidity further than Ethiopia"; none exists, only `BUNDLED_FLAVOURS`); My words counts ("you wrote "juicy" nine times"; T-9, 8h); water temperature and grind history (`water_temp_c`, `grind_setting`: V1.5 columns with no UI; T-11); half-star ratings ("Rated 4.5"; V1 is whole stars); 6b's "How adventurous" (Safe / Stretch / Surprise) and 6d's "How I brew" (which set its tone; 6b / 6d are not built). 8e's "Log a cup with this plan" pre-fills 28 clicks / 92° / 1:16, which 5a can't enter.
- **The 5-cup threshold has no reason left** (`taste-dna.md`, Thresholds): decide it with Try next.
- **Next**: what can be cut so a first Try next stands on V1's data.

## T-15. 11a's café line wants an address that isn't stored (recorded 2026-10-30, Design Round 16 B5)
Design: "the café line shows the short address only, with no distance or visit count". `places` has no address column (decided 2026-10-30, because no screen showed one); this answer is such a screen. Not built; 11a shows no café meta meanwhile.
- **Option 1, recommended**: migration 6, `places.address TEXT` (ALTER TABLE ADD COLUMN, nullable), written by `placeIdFor` from the map's short address when the row is created. Places typed by hand, and those stored before, have none (no line). Never updated afterwards, as the name.
- **Option 2**: look the address up live by MapKit id (`MKMapItemRequest`, iOS 18+). No schema change, but it needs the network on every 11a open and a new native call.
- **Decision**: Uryu.
