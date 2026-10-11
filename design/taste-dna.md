# Taste DNA — rules

First read from the screens (2026-10-11), then decided by Uryu the same day. The decisions come first; the reading follows as the record of where they came from.

## Decided (2026-10-11)

1. **Rating weight** (confidence, never direction): 5★ 3.0 · 4★ 2.0 · 3★ 1.0 · 2★ 0.5 · 1★ 0.25. Unrated cups are ignored. Low ratings still count: an axis records what was perceived, not what was liked. No half stars; 8g's "4.5" only illustrates that weighting exists.
2. **Recency**: exponential decay, **half-life 90 days**, kept as one constant (30 days → 0.79; 8 months → 0.16). 8g's "roughly double" is an explanation, not the spec. The profile is today's taste.
3. **Per axis, only cups that noted it**: an untouched axis is "don't know", never 50.
4. **Lock-in, counted per axis**: an axis locks in at **10 slider records** (flavour words never count toward it). The screens show one state for the whole profile, next to "My taste DNA" (1b, 5c, 6a, 8f); it is **Locked in when every axis with at least one record has 10 or more** (option B). Axes with no record are left out of the judgement. 1b's "N more" counts the axis with the fewest records (copy: Design, D-47).
   - 8f's "From N cups": cups after `reset_at`, rated, with at least one axis noted or one word from the table.
5. **Recompute**: the profile is computed on read (never stored). **5c's change and 8f's shifts are stored at save time** (`cups.dna_change`, migration 3) and never recomputed, so editing a cup or changing the decay does not rewrite history. `gaps.md` 21 closed. Existing cups: replayed once in the migration (`data-model.md`).
6. **Words → axes: the ten bundled flavour words only.** My words do not shape the profile in V1 ("Read my words" does not exist, i.e. off; `gaps.md` 31). User-added words have no entry. A word is a weak record: an observation at a step value, strength at most 0.4 of one slider record, and it never counts toward lock-in.
   - **Criterion**: when the word comes up, the axis leans predictably, **one way**. Not "they often appear together". The strength follows how sure the association is. (Smoke → bitter fails: dark roasts can be un-bitter.)
   - **The table (final, 2026-10-11)**; Acid ↔ Bitter: 0 = acid:

     | Word | Effect (value, strength) |
     |---|---|
     | Jasmine | acidity → 25 (0.2): floral is near-only in light, bright coffees, but it is aroma, so weaker than Grapefruit |
     | Peach | acidity → 25 (0.3); sweetness → 75 (0.3) |
     | Grapefruit | acidity → 0 (0.4) |
     | Blackcurrant | acidity → 25 (0.3); sweetness → 75 (0.2) |
     | Black tea | body → 25 (0.3): "tea-like" means a light mouthfeel |
     | Cocoa | roast → 75 (0.3): the "chocolate sweetness" is caramelisation, which Caramel carries |
     | Walnut | roast → 75 (0.2) |
     | Caramel | sweetness → 75 (0.4) |
     | Cinnamon | none: spice is not sweetness, and not one-way enough for Roast |
     | Smoke | roast → 100 (0.4) |
   - **Words are capped at 1/3 of each axis's total weight** (decided 2026-10-11; `DNA_TUNING.wordShareCap`).
     - **Why — read this before changing it.** One word is weak, but words are picked on nearly every cup, while a slider is moved only when something was noticed. Because of this asymmetry, without a cap an axis with few slider records ends up decided by words alone. In a 30-cup test, Sweetness had 6 slider records and the words made up 51% of it, moving its band from Medium sweet to Sweet: the display showed the algorithm, not the drinker's perception. The reason is the asymmetry, not the number.
     - **Tuning the cap: never judge it by one case near a band edge.** Look at the words' share of each axis and at how far the value moves from the sliders-only value. (2026-10-11: the 30-cup test's Sweetness stayed "Sweet" at 66.0 because its sliders-only value, 61.5, sat 1 point under the 62.5 edge; only a 7% cap brought it back, and that crushed acidity's sound 23% to 7%. 1/3 kept: the share fell 51% → 33%, the shift was 2.4 points, in the sliders' direction.)
     - **Band names come from the same value as the number**, never from a separate sliders-only calculation: "66.0 but Medium sweet" would contradict itself. A value moving across an edge is what edges do, not a defect.
     - **"From N cups"** counts every rated cup with an axis or a table word, words-only cups included: it tells how much record the profile stands on (their arithmetic effect was 0.1–0.2 points in the test). Unrated cups never count (8g).
     - **How**: when an axis's words exceed the cap, every word on that axis is scaled by one factor, so their relative strengths (Grapefruit 0.4 : Jasmine 0.2) never change. With no slider record on an axis, words alone give it no value.
   - **These numbers are starting values.** If the profile disagrees with how real use feels, adjust this table first. The 90-day half-life and the rating weights are the same kind of number. All three live in one place in code (`DNA_TUNING`, `src/data/tasteDna.ts`); never scatter them.
7. **Reset**: a stored `reset_at`; only cups after it count. Cups are never deleted; Records keeps all of them. The column comes with the migration; the feature is V1.5 (no settings screen in V1).
8. **Band names**: the five slider steps, edges at 12.5 / 37.5 / 62.5 / 87.5 (0–12.5 Very bright, … 87.5–100 Very bitter), so input steps and display bands match.
9. **The bag's roast level does not feed the Roast axis**: it is the roaster's claim, the axis is the drinker's perception.
10. **Thresholds**: 5 cups = Try next (V2, not shown in V1); 10 = lock-in (D-47).

## What the screens say (2026-10-11)

## Read from the screens

**What it is** (8g): "Nothing here is a guess about you. Your profile is arithmetic on cups you logged. No taste quiz, no crowd averages."

**Inputs per cup** (stored since migration 2):
- the four axes, 0–100, each NULL when not noted (`axis_acidity`, `axis_body`, `axis_roast`, `axis_sweetness`);
- the rating;
- the flavour words (`cups.flavours`) and My words (`cups.note`);
- the logged time.

**Weighting**
- **Rating** (8g "Ratings weigh most"): "A 4.5 counts more than a 3. **Cups you never rated are ignored.**"
  - Higher-rated cups pull harder. The 4.5 implies half stars; V1's stars are whole (1–5).
- **Recency** (8g "Recent cups weigh more"): "The last 30 days count **roughly double last winter**."

**Words** (8g "Your words are matched, not read"):
- "'juicy' maps to acidity and sweetness. Notes stay on your phone."
- So words act through **a fixed word → axis table**, matched on the phone, never sent anywhere.
- 8g also has a setting, **"Read my words — Let notes shape the profile"**, and 7a announces "Taste DNA now reads your notes — Your own words feed the profile, not just the sliders."
- So: **flavour words always count; My words count only with that setting on.**

**Locking in**
- 8g "Ten cups to lock in — Below that it stays provisional, because it would be noise." 9a: "Around ten cups, the profile locks in."
- Two states:
  - **"Early signs"** (1a, 1b, 4a, 4b, 5c): provisional.
  - **"Locked in"** (8f, "From 147 cups · shifted 4 days ago").

**Try next opens at 5 cups**: 1b / 4a / 4b "Opens at 5 cups". 5c: "4 of 5 cups. One more cup and Try next opens up." This is a second threshold, separate from locking in.

**Per-cup change** (5c): "Moved 6 points brighter", "Moved 4 points lighter": the profile after this cup minus before, on the 0–100 scale. "This cup pushed you brighter and lighter."

**Shifts** (8f):
- "shifted 4 days ago";
- "Last shift: Sweetness moved from low to medium after three naturals in August."

A shift is an axis crossing into another named band. This needs a history of the profile, or recomputing it as of past dates (`gaps.md` 21).

**Display words per axis** (8f): "Bright", "Light-bodied", "Medium sweet", "Light roast"; summary "Bright, juicy, lightly sweet". The summary mixes axis bands and a top word ("juicy").

**Words said most** (8f "What you keep saying"): juicy 9, peach 6, tea-like 5, too roasty 4. These are counts of words, not axes.

**Reset** (6b, 8g):
- "Reset my taste DNA — My 147 cups and notes stay. Only the profile is rebuilt."
- "Cups and notes are never deleted by a reset."

## Contradictions in the mocks

1. **Lock-in count**: 8g / 9a say ten cups. 1a / 1b / 4a / 4b say "Three more cups to lock it in" next to "3 of 5 cups". With a threshold of 10 that would be 7 more; with 5 it would be 2 more. The "of 5" belongs to Try next (5c says so), so the line "Three more cups to lock it in" fits neither threshold.
2. **Half stars**: "A 4.5 counts more than a 3" and 8d's "Rated 4.5 in March", but V1's rating is whole stars.
3. **Reset vs "arithmetic on cups you logged"**: if the profile is always recomputed from cups, a reset that keeps every cup changes nothing. A reset must mean something else, e.g. "count only cups from now on" (a stored reset date).

## Open — for Uryu to decide

| # | Question | What the mocks fix | What they leave |
|---|---|---|---|
| 1 | **Rating weight** | Higher counts more; unrated ignored | The curve: linear (rating), rating − 2 (a 1–2★ cup barely counts or pulls away), or other. Whether a 1★ cup counts *against* its position |
| 2 | **Recency decay** | "Last 30 days ≈ double last winter" | Exponential `w = 0.5^(age / half-life)`. Taking "last winter" as ~8 months back and "last 30 days" as ~15 days: half-life ≈ (240 − 15) days ≈ **225 days**. If "last winter" is ~5 months: ≈ 135 days. Pick one |
| 3 | **Per-axis averaging** | Untouched axes are "left out" (5b) | Average each axis only over cups that noted it (weights renormalised per axis). An axis with no notes shows nothing |
| 4 | **Lock-in** | Two states; ten cups (8g, 9a) | Ten cups total, or ten rated cups, or ten cups noting each axis? Fix the "Three more cups" line (contradiction 1) |
| 5 | **Recompute timing** (`gaps.md` 21) | Profile is arithmetic on cups | Compute on read (always current, history moves when old cups are edited) or store snapshots per save (5c's "before / after" and 8f's "shifted 4 days ago" become stable) |
| 6 | **Words → axes** | A fixed table; "juicy" → acidity + sweetness; flavour words always, My words with the setting | The table itself (the bundled words' groups bright / round / neutral are a start); how strong a word is against a slider value; user-added words with no entry are ignored |
| 7 | **Reset** | Cups stay; the profile is rebuilt | A stored "count from" date? |
| 8 | **Bands and names** | 8f's names per axis | Where "Bright" / "Medium sweet" start (band edges on 0–100) |

The roast axis could also take the bag's roast level (4 steps, data-model), but no screen says so. Left out unless decided.

## Editing a cup (decided 2026-10-11)

- **Editable**: the bag, the gear, the date and time, My words; Barista / Packaged fields (café, drink, product, where bought).
- **Not editable**: the rating, the four axes, the flavours (Taste DNA's input).
- **Why**: making rating / axes / flavours editable would require replaying every `dna_change` after that cup. The replay is technically possible (migration 3 does it), but a "Moved 6 points brighter" the user has already seen would later become another number. Taste DNA is arithmetic on your own records, and the records are not rewritten afterwards. So the inputs are not editable.
- **A known mismatch, not a bug**: the sum of every cup's stored change does not equal today's profile. The profile is computed on read (with today's decay); each `dna_change` is a snapshot at its save. No screen shows both side by side. **Do not "fix" the sums.**
