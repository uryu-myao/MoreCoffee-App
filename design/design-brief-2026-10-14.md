# Brief for Design — 2026-10-14

Round 7 · responds to design-response-next.md Round 6. **Please number your reply "Round 7" as well.**

Everything below is in `design-missing.md` under the same numbers. New items first, then older ones still open. Values stay tokens; no new components unless one is needed.

## New

### Bean freshness (rules decided, built on 3d and 4b)
From the roast date: **resting** day 0–6, **drink now** 7–21, **past peak** 22+; a 42-day bar (peak band 17%–50%, close to your 17%–52%); past 42 the bar stays full. No roast date: no day, no state, no bar. These windows are a guide, not a prediction (data-model.md "Freshness").

- **39. The resting look.** Label "Day 3 · resting". The elapsed fill hasn't reached the peak band (left of 17%). It means "not yet", not "bad": no warning colour; existing tokens only. For reference: drinkNow peakBand `#CFDCC8` / elapsed `#7E9675` / marker `#4A6640`; pastPeak `#E4D6CC` / `#C2B4AB` / `#8C7E76`. Built today with drinkNow's colours, marked provisional.
  **Also OQ-3**: pastPeak changes peakBand from mint to beige, and we can't tell intent from drift. Please look at all three states together and say whether the band follows the state or stays the bag's.
- **40. Saying it's a guide.** The app knows neither storage nor brew method. One short line, once, on 3d or 3g (not per card): the window is a guide, and your own taste is the better judge. Please write it and say where.
- **41. 3c's Roasted on line.** Today "Optional — for freshness": optional first, benefit last. Turn it round, toward "Add it to see when it's best" — your own words, please. Only on Roasted on (not Roaster: adding a roaster changes nothing on screen). Short enough for FieldRow's second line; stays optional, no required mark. **Also check** how a bag with no roast date reads with the freshness row gone: 3d's card, 5a's Bag row (roaster alone), 2c (no "day N when brewed").
- **42. 3g's line under Roasted on.** "Recounted from the roast date when you change it" fits only a date already there; a bag whose date was skipped in 3c can only get one in 3g. No nudge (3g corrects, it doesn't ask), but the user should see a date can go in and what it does. Proposal: one line for both cases, e.g. "Freshness on My beans counts from this date." Please write it.

### For your information
- **33 decided**: in 3g the roast date can't move past the first cup logged from the bag. The sheet stops at that day; the limit line says so, as 11a's: "Up to Apr 6, your first cup from it." (no cups: up to today, no line).

## Still open from earlier rounds

- **2 / 6. Packaged.** One FieldRow for the product name, free text, completing from the user's own past products. 2c for a Packaged cup: what replaces "What I logged"?
  On your Round 1 questions — the two fields are not the same kind of thing, so they get different answers:
  - **Brand: we're not sure a separate field is needed at all.** A packaged coffee's name usually carries its brand ("Georgia Emerald Mountain", "BOSS Black", "Seven Café", where brand and product are one word), and people type it as one name. Two fields would leave one empty or repeat a word. What the mocks show supports this: **no list row draws a brand.** 2a / 13a / 1a draw the Packaged cup's line 2 as **"7-Eleven · Can 185 ml"** — the store and the package. And 5e's only brand-like field, labelled "Brand", holds **"Boss Craft · Black"**: brand and product in one value. §9's "Packaged line 2 = brand" (2026-10-06) was our own analogy from bean / roaster, not from a mock. **So, at this stage, a Packaged row is one line** (the name), not a row with an empty line 2. Please draw that, and say if you see a reason for a brand field later.
  - **Bought at: not at this stage, and it will return.** It is a separate fact (where to buy it again). In the mocks it is exactly what line 2 shows ("7-Eleven"), so when it returns, line 2 becomes the store — §9's rule "line 2 = where it came from" holds, with the store, not the brand. §9's Bought at row stays, marked not at this stage.
  - The cross-reference is fixed (item 2 now points to item 6).
- **16. 1b's greeting.** The mock has "Good morning"; we show "Good afternoon" / "Good evening" (evening at night too) by part of day. Ours — confirm or replace.
- **17. 1b's line under the counts** ("A slow start is still a start."): no rule for when it shows. Not shown until there's a rule and a line for each case.
- **18. Adding a bag without opening it** (built): 3c's second button "Add without opening" (our label). An unopened bag takes a slot, reads "not opened yet" on Home and 3d, isn't offered when logging, and 3d shows "Open this bag" in Finish bag's place. Please check the copy, and whether "Bags open" (3c / 3d) should be renamed. Our reading: unopened bags take a slot too, so what it counts is **the bags you have**, not the bags you've opened.
