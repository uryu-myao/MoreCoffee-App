# Reply to Design — 11a / 11b / 11c (2026-10-13)

All three are approved. 11c's open dependency is settled first.

## 1. Unselected vs disabled (11c's dependency) — decided
- **Markers differ, not only the label.** An unselected checkbox or radio marker is a **2px ink frame, unfilled**; a disabled one is a **2px `border.muted` frame** with the label in `text.muted`. §1 already says an outline with no fill never means selected, so the ink frame is not read as chosen. (3a draws the unselected box this way; 8c's `border.muted` box is now the disabled look.) The two §1 lines on unchecked boxes now agree. **Built** in the app's checkbox and radio lists.
- **A disabled option always shows why on screen.** A row states it in its own meta line (your 11c); chips and tags rely on the set's count (the selection limit). Never a disabled option whose reason can't be shown. This closes `gaps.md` 12 as a rule.
- **So 11c stands as drawn**, with the marker change: the "after this cup" row has a `border.muted` marker and a `text.muted` label; the others have ink markers.

## 2. 11a / 11b / 11c — adopted as drawn
- 11a: the editable rows with chevrons; the date row stating its own limit; "As logged" in 2c's read-only display; the line "Your Taste DNA counted these when you saved. To change them, delete this cup and log it again."; Delete in ink, underlined; Packaged's single Product row.
- 11b: naming the cup; the three points; primary "Delete this cup" and "Keep it" secondary. **Also adopted: "Your profile goes back to Early signs."** when the delete breaks lock-in — the one exception to "once locked, it stays", which we had missed.
- 11c: the bag shown, not hidden; the reason in its meta; "Roasted after this cup" for VoiceOver; no "Add a bag".

## 3. A new question: the title of a cup with no bag
An I made it cup may have no bag; it records how it was brewed. We now title it by the brewer, then the grinder, then "—" (built). Please judge copy and layout:
- 2a's row, 2c's title, 5b's summary and 1b's recent rows show e.g. "Hario V60 02". Gear names are typed or generic ("Pour-over dripper"); titles keep the 2-line `name` truncation.
- **On 2c the name appears twice**: as the title, and again in "What I logged → Method". And the Bag row then reads "—". Should the Bag row be hidden for such a cup, or is the repetition fine?
- A cup with neither bag nor gear keeps "—". Is there a better word?
- Barista / Packaged keep "—" (no inputs at this stage); a separate question.

## Round 3 follow-up (2026-10-13): 12a / 12b built as drawn
- 2a rows: "Hario V60 02 / No bag · Comandante C40", "Comandante C40 / No bag", "Morning cup / No bag or gear noted" (daypart of the cup's time). 2c: the Bag row hidden, "No bag noted" / "No bag or gear noted" under the title, Method kept. 5b's summary uses the same title. 1b's rows show the title only, as before.
- **One case not drawn**: a cup with **neither bag nor gear** on 2c. With the Bag row hidden, "What I logged" holds only Method, which reads "—" — the look 12a avoids. Hide the whole "What I logged" block (the line under the title already says "No bag or gear noted"), or something else? Left as is, with a TODO, until you answer.
- Barista / Packaged: still "—"; the time-of-day title is noted as the candidate for one rule, to decide when those modes get inputs.
