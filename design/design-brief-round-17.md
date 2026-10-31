# Design brief — Round 17 (2026-10-30)

Round 17 · responds to design-response-next.md Round 16 (Barista, 2026-10-30)

Two groups. Reply under "Round 17" in `design-response-next.md`, numbered as in this brief. A is a report: say if you see a problem. B asks for answers. **We are not waiting**: everything in B is built with our provisional version and gets replaced when your answer comes. In the code, each provisional line is marked PROVISIONAL.

**Scope reminder**: this is what Uryu needs to log coffee every day, not a version for other people.

**Why 8g now** (Uryu): 8f's footer draws a way to 8g, and it went nowhere. Taste DNA could be computed and seen, but not how it is computed. It is also what Try next stands on: nobody trusts a suggestion from arithmetic they don't trust.

## A. Report

1. **The café sheet's map rows are cafés within 5 km** (found after Round 16). On the simulator, "fujimi" from Chōfu returned toilets, car parks, clinics and schools, some 20 km away. Round 16 described the map rows as "biased towards the location". Changed (Uryu):
   - the map rows are **cafés only** (MapKit's café category; restaurants and bakeries out too);
   - **within 5 km** of the phone when the location is known, never further;
   - nothing typed: cafés within 1 km, as before;
   - a café outside that is typed by hand (`Add "…"`, "Saved by name only");
   - with the location off, the search can't be kept near and is not limited.
   No change to the rows' look. Say if the "no results" case needs a line.

2. **8g is built from the mock, but most of its text describes rules V1 does not have.** 8g was drawn before Taste DNA's rules were decided (`taste-dna.md`, 2026-10-11). Item by item:

   | 8g says | V1 does |
   |---|---|
   | "Ratings weigh most: A 4.5 counts more than a 3. Cups you never rated are ignored." | Whole stars only. 5★ counts 3× a 3★, 12× a 1★. Every V1 cup has a rating (Save requires it), so "never rated" describes nothing |
   | "The last 30 days count roughly double last winter." | A cup's weight halves every 90 days. A cup from the last month weighs about 5× one from last winter, not 2× |
   | "Your words are matched, not read: 'juicy' maps to acidity and sweetness." | My words never shape the profile in V1 (`gaps.md` 31). Only the ten bundled flavour tags do (Peach → brighter and sweeter). "juicy" is not one of them |
   | "Ten cups to lock in" | Ten **slider notes per axis**; tags don't count. One cup can note four axes, so notes are not cups |
   | Switch "Read my words — Let notes shape the profile" (on) | Doesn't exist in V1: My words are off |
   | "Reset my taste DNA" row and "Cups and notes are never deleted by a reset." | Reset is V1.5 (the `reset_at` column exists, no screen). Round 12 already rewrote its line for 6b as "Counts from today. Older cups stay in Records." |

   What 8g doesn't say, and V1 does:
   - each axis is averaged on its own; an axis a cup didn't note is left out, never counted as the middle;
   - low ratings count too: an axis records what was tasted, not what was liked;
   - flavour tags are weaker than sliders and make up at most a third of an axis;
   - once locked, the profile stays locked, unless cups are deleted;
   - time alone never moves the profile: it moves only when cups are logged, edited or deleted (this is why 8f can say "shifted 4 days ago");
   - the bag's roast level never feeds the Roast axis. Decided by Uryu to be said on the page: a bag reading "Light" next to a Roast axis the user moved toward dark puts two "roasts" on screen, and without a line nobody can tell which one the profile uses.

3. **Built (2026-10-30), with our provisional copy** (B1):
   - header as 8g ("How it is built", back), the two opening lines as drawn: "Nothing here is a guess about you." / "Your profile is arithmetic on cups you logged. No taste quiz, no crowd averages." They hold in V1.
   - then the user's own numbers (B2), then five rules in 8g's list look (bullet, bold line, one line under it).
   - **Not built**: "Read my words" (no My words in the profile) and "Reset my taste DNA" with its line (V1.5).

4. **Ways in** (decided by Uryu):
   - **8f's footer** keeps its bar with "How it is built" alone; Try next (8d) is V2. The bar stays so Try next has its place when it comes back.
   - **Profile**: 6b's Taste DNA section, with only "How my DNA is built" (6b's row, its glyph). "How adventurous" is Try next's setting, V2. PROVISIONAL: 6b is not built otherwise; this row and My data's two are the parts of it that are.
   - **15b** stays short and gains a way on at its foot, "How it is built", on Home and 8f. Not on 5c: 5c is inside the Record sheet, and pushing a page from a sheet inside a sheet is not natural.
   - 15b's progress box ("Body needs 3 more notes to lock in.") now repeats part of 8g's numbers. Kept for now; Uryu decides once both can be seen side by side.

## B. Questions

1. **8g's rules: please rewrite or confirm.** Ours (PROVISIONAL), in this order:

   | Bold line | Under it |
   |---|---|
   | Higher-rated cups weigh more | A 5★ cup counts three times a 3★. Low ratings count too: they record what you tasted, not what you liked. |
   | Recent cups weigh more | A cup counts half as much after three months. Rated the same, today's cup pulls four times as hard as one from six months ago. It moves only when your cups do, never with time alone. |
   | Each axis on its own | An axis you skip isn't counted as the middle; it isn't counted. Roast is the roast you tasted, not the one on the bag. |
   | Flavour tags nudge, sliders decide | Peach leans brighter and sweeter. Tags make up at most a third of an axis. Your own words don't count. |
   | Ten notes per axis to lock in | Each axis needs ten slider notes; tags don't count. Once locked, it stays locked, unless you delete cups. |

   - "Ratings weigh most" was renamed: with recency as a second multiplier, neither is "most".
   - The recency example keeps the rating the same and changes only the time, so it shows the decay alone. A mixed example (a 5★ from four months ago against today's 3★: 1.19 against 1.0) made the two look nearly equal.
   - Left out on purpose: the full rating table, how the third is enforced, the band edges, how 5c's per-cup change differs from today's profile, and unrated cups (none exist in V1). All true, but they turn the page into a spec.

2. **The user's own numbers on 8g** (not in the mock; Uryu wants them: "Sweetness needs 7 more" is a reason to read the page, a general rule is not). Built as a framed block between the opening lines and the rules, headed "My numbers":
   - one row per axis, in 8f's order: the axis name, then
     - "14 notes" — at or past ten;
     - "3 notes · 7 more to lock in" — under ten while the profile is Early signs;
     - "3 notes" — under ten after the profile has locked in (an axis first noted after the lock). Saying "more to lock in" there would contradict the Locked in stamp;
     - "Not noted yet" — no slider note;
   - under an axis whose tags reached their third: "Tags are at their limit here.";
   - the last line: "From 47 cups." and, when some cups count for nothing (no axis, no bundled tag), "2 had nothing noted, so they don't count."
   - **Please draw it**, and say: the heading, the row look, and whether the tags line should show the share always ("Tags 18%") or only at the limit (ours: only at the limit).

3. **8f's footer with one action.** The bar (2px ink rule, raised) now holds only the text link at its left. It doesn't break, but a framed bar around one 11pt link may look unfinished. Keep it, or draw the one-action state? The link is our inline action ("HOW IT IS BUILT", 11 caps, underlined: §1's only tappable-text style), not the mock's 13pt sentence-case underline.

4. **15b's way on**: "How it is built" as an inline action under the progress box, above "Got it". Confirm or redraw.
