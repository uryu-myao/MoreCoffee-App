# Design brief — Round 10 (sent 2026-10-21)

**Status**: answered. E on 2026-10-21 (`design-response-next.md`, "Round 10 — E"); A–D with Round 11 (`design-response-next.md`, "Round 11 … with Round 10 A–D"). B9's switch to the "Remove gear…" line is noted in Round 12, 1.

Five groups. A is mock-side fixes only; B–E need your answer. Reply under "Round 10" in `design-response-next.md`, numbered as below.

**Scope reminder**: this is what Uryu needs to log his own coffee every day, not a version for other people.

## A. Drift never sent (mock-side fixes; the token side already holds the right value)

Eight entries. D-10 and D-11 are withdrawn and not asked.

1. **D-7** · 4a / 4b: letter-spacing written `0.16em` → `.16em`. Same value; notation only, for diffing.
2. **D-8** · 5d: body copy at `12.5px` (3 uses) → `body.sm` (12). No fractional size exists elsewhere.
3. **D-9** · 8m: body copy at `13.5px` (3 uses) → `body` (14). Same.
4. **D-12** · 5a / 5d / 5e: the "Optional" tag in the Add a photo slot is 11 / 600 / .06em caps → `label.caps` (12 / 700), as on 3b / 3d's slot tags.
5. **D-13** · 5a / 5d / 5e: space between form sections is 16 / 20 (5a, 5e) and 18 (5d) → `gap.section` (12). 20 is `gap.axis`, the taste axes' own rhythm.
6. **D-14** · 5e: intro line says "Bottled cups…" → **"Packaged cups…"** (the 2026-10-04 rename; the sample is a can). Built that way.
7. **D-15** · 5e: "Bought at" shows "¥180" → **store name only**. The data model has no price, on purpose. Built that way.
8. **D-16** · 2a: every row's source line has the same density → **by mode**: I made it = roaster · process; Barista = place only; Packaged = brand only. Only what the data holds is shown. Built that way.

Also, from your T-6 reply: **D-56** · 3f / 5d: "Reopen bag" and "Go to first" are drawn blue → ink, underlined (your item 2). Built that way.

## B. 3a's full-shelf hint points at something V1 can't do

9. Your T-6 reply (item 4) gave the screen-reader hint "No slots left. Remove gear from My gear to free one." V1 can't remove gear:
   - 3b (My gear) and 3e (Edit gear) are not built.
   - Home's My gear (4a) only lists the gear.
   - 3b / 3e are planned, but after 8f and 6a, so not soon.

   Please write a V1 line. It must:
   - say the limit is reached;
   - offer no way out that doesn't exist.

   We'll switch to your current line when 3b / 3e ship. The footer's "0 slots left" stays. For now the app reads your current line (marked TODO).

## C. 1b's line under the counts (item 17)

10. In Round 7 you agreed with "not shown until there's a rule". Nobody has written the rule, so the line ("A slow start is still a start.") has stayed off since. Please either:
   - (a) give the rule and a line for each case: when it shows (a slow week? always? the first week?), and what it says otherwise; or
   - (b) drop it for V1.

   Facts you can use:
   - Home already shows the cups total and this week's count, with a Monday-first strip.
   - The line sits under both.

## D. 8f (My taste DNA): three contradictions

8f is next on our list, after Records' sort and search. Without your answers we'll build 8f without the parts below.

11. **"lightly sweet" vs "Medium sweet"**: 8f's summary says "lightly sweet", and its Sweetness axis says "Medium sweet". Which is right?
    - Band names are computed from the same value as the number (`taste-dna.md`). One value can't be both.
12. **The summary sentence ("Bright, juicy, lightly sweet")**: from which axes and which words is it built?
    - "Bright" is a band name.
    - "juicy" is neither a band name nor a bundled word. It is the user's most-used word (8f's "What you keep saying": juicy 9).
    - "lightly sweet" matches no band.
    Please give the rule: which parts, in what order, and what it says when an axis has no value.
13. **6a's labels ("Acidity high", "Body light", "Roast light")** differ from the band names (Bright, Light-bodied, Light roast). Should they match, or is 6a a summary that may word things differently?

## E. Records sort (2b) and search (8l): parts the boards don't draw

We build 2b and 8l next, together, so 2a is changed once:
- 2a gets the search field and the filter icon;
- the icon opens 2b;
- the field opens 8l in place.

Everything drawn is built as drawn. Below is what isn't drawn, each with what we would do. "OK" is a full answer.

**2b — Sort & group**

14. **Cups with no roaster or brewer.** Barista and Packaged cups have no roaster and no brewer. Under "Roaster A–Z", and under Group by "Brew method" or "Roaster", they have no place.
    - We would put them last.
    - Group headings we would use: "No roaster" and "No brewer".
    - Should Barista cups group by their café instead?
15. **Sort and group together** (e.g. Group by Roaster + Highest rated).
    - Inside a group, cups follow the chosen sort.
    - Groups are ordered by their first cup under that sort.
    - Month groups follow the date direction ("Oldest first" puts the oldest month first).
16. **The filter icon while 2b is not at its defaults** (`gaps.md` 16). Its direction is blue (in force), but nothing is drawn.
    - We would leave the icon unchanged in V1.
    - Or draw it.
17. **The sort rows' marker.** The board draws a check mark. The app's other single-select rows (the pickers) use §9's square radio marker.
    - We would use the square marker, so all single-select rows match.
18. **"Show 3 cups".** 2b holds no filter, so the number is always the total count.
    - Keep the number, or make the button "Show cups"?

**8l — Search**

19. **Result headings.** Only Words is drawn ("9 cups say "juicy""). We need lines for these cases:
    - Beans (a bean name or roaster typed);
    - Gear;
    - 4★ and up with nothing typed: it then lists every 4★+ cup;
    - no results;
    - the field still empty.
20. **Words and flavour tags.** By `components.md`, Words searches My words (the note), not flavour tags. So typing "peach" doesn't find a cup tagged Peach unless the note says it.
    - We would search both under Words.
21. **Gear while names are generic.** Until 3b / 3e let gear be renamed, every brewer is one of four generic names ("Pour-over dripper"…), so typing "V60" finds nothing.
    - We would keep the Gear scope: it costs nothing and becomes useful with 3b / 3e.
    - Or hide it until then?
22. **Recent searches** need storage, and V1 stores none (`data-model.md`, storage audit).
    - We would leave the block out of V1.
    - Or keep it for the session only.
23. **4★ and up** is a switch that combines with any scope, not a fourth scope; it means rating ≥ 4.
    - Ratings are whole stars in the data, so rows show "4", not the board's "4.5".
    - OK?
