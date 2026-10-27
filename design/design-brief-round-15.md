# Design brief — Round 15 (2026-10-27)

Round 15 · responds to handoff/handoff-round14.md (Round 14, Rev 2)

**Status**: answered in full (`design-response-next.md`, "Round 15"). A, C, D, F agreed; B1 Round 7 stands (Round 14's table was Design's error); B2–B5 agreed as built or asked, built 2026-10-27 (B3: §3.1's `shelf`; B4: 1b's See all takes ›). F3's "use for" note added to the tokens. The follow-ups (C8 as rewritten, B3's reason, B4's rule, the 17a / 17b badges, Round 13 E1) are answered in "Round 15 · addendum".

Six groups, A–F. Reply under "Round 15" in `design-response-next.md`, numbered as in this brief. B asks for answers. A, C, D, E and F are reports: say if you see a problem.

**Scope reminder**: this is what Uryu needs to log coffee every day, not a version for other people.

Round 14 is built (2026-10-27): Home's shelf (17a / 17b) and Gear & beans (17c / 17d). Checked in the simulator at 430pt (iPhone 15 Pro Max), on both sides of both screens. The swipe gestures have not been tried on device yet.

## A. §0 token check: what we found and what Uryu decided

Every value in §0 was checked against `tokens.ts`. Uryu decided the open ones on 2026-10-27.

1. **Already expressible: all confirmed.** The 2px underline, the 1.5 first-row divider, the 4px indicator, the 20 page gap, the 12 row padding and the 6 status gap all map as you listed. Page width, peek and row height are computed from the screen width, as you asked. Nothing is hard-coded.
2. **Tab row gap: `space.20`, not `layout.gutter`.** `layout.gutter` is the screen's edge, not a gap. Using it here would tie the tab spacing to the screen margin, two things that have nothing to do with each other. 20 is the nearest step, 2pt under the mock's 22.
3. **New tokens: added under your proposed names.**
   - `size.thumbnail.compact: 44`. This settles D-51 for Home. 3b and 3d still draw 52 and 56 against the app's 46, so D-51 stays open for them.
   - `size.statusColumn: 84`. This is the bar's width and the column's **least** width. See C1.
   - `component.pageIndicator`: active `{ w: 24, color: text.primary }`, inactive `{ w: 10, color: border.muted }`, height `size.meter.track`, gap `space.4`. You listed 24 / 10 as having no token and proposed none, so this name is ours.
4. **Text styles: your proposal holds for three of the five. Two differ.**

   | Part | Mock | Your proposal | Built | Why |
   |---|---|---|---|---|
   | Tab label | 13 / 700 / .06em caps | `labelCaps` | `labelCaps` | as proposed |
   | Tab count | 12 / 700 / .04em | `meta` (12 / 600) | `labelCaps` | `meta` drops the weight to 600. `labelCaps` keeps 700 and shares the label's metrics, so the two sit on one baseline. Its caps don't touch digits. |
   | Status word | 11 / 700 / .06em caps | `labelCaps` (12) | `meterLabel` (11 / 700 / .08em caps) | `meterLabel` matches the size exactly and is already beanFreshness's state word ("Day 7 · drink now"), which this word is. At 12, "DRINK NOW" measures 80 of the 84. |
   | Gear line 2 | 11 / 500 | `bodySm` | `bodySm` | as proposed (but see C1) |
   | 17c slot number / label | 12 / 700 / .04em; 11 / 700 / .06em caps | — | `labelCaps` / `meterLabel` | the same pairing as the tabs and the status column |

   No new text style was added.
5. **Inactive count: `text.muted`**, your fallback. The label and the count of a closed tab are one colour.

## B. Questions

1. **Bean status colours: your Round 14 table differs from Round 7 (14a). We built Round 7. Please confirm, or say what changed.**
   - Round 14's table:
     - Past peak's word in accent (`#9E5202`).
     - Resting's word in `text.muted`.
     - The peak window beige (`#E4D6CC`, the track's own colour) in both past peak and resting.
   - Round 7 (your 14a, 2026-10-14):
     - The peak band is the bag's and stays mint (`#CFDCC8`) in every state. OQ-3 was settled as drift.
     - Resting and past peak share the neutral pair, with a `text.secondary` word.
     - "Green means only drink now", and past peak is not a warning.
   - Round 14 gives no reason for the change, so we read it as the old 4b drawing coming back, not as a new decision. Home now uses `component.beanFreshness` as it stands, the same as 3d. If accent for past peak on Home was meant, tell us why: it reopens the "not a warning" rule for that one place.
2. **Two bean states Home doesn't draw. What should they show?** Built for now, each marked TODO in the code:
   - **A bag not opened yet**: the word "Sealed" alone (`meterLabel`, `beanFreshness.sealed.label`), centred, with no bar. This follows 3d's sealed line.
   - **An opened bag with no roast date**: an empty status column. With no roast date there is no state (3d shows nothing there either).
   - **Order**: both come after Resting, opened ones first, then oldest added. Your order covers only the three states.
3. **Row names: one line or two?** §1 says "ellipsis on both lines". Our truncation rule (§3.1) gives every user-supplied name **2 lines**, and Home's rows follow it, so a long name makes its row taller than 68. The meta line is one line, as you drew. Either keep §3.1, or make the shelf rows an exception to it. Which?
4. **"Recently sipped"'s "See all": arrow or chevron?** 17a draws a › after it. The app has → there (1b, redrawn 2026-10-18). The new "See all gear & beans" right under it is built with ›, as you drew. Should "See all" switch to ›, so the two actions on one screen match?
5. **Kettle and scale: the status column is empty (Uryu, 2026-10-27). OK?** 17a gives the kettle "Not used" / "Add to a cup". A cup holds only a brewer and a grinder (`brewer_id`, `grinder_id`), so a kettle or scale can never be added to one. That line would promise something the app can't do. The second line under the name already says "Kettle". This matches 3b, where a kettle's line is the category alone.

## C. Built differently from the handoff

1. **The status column grows with its text, with 84 as its least width** (Uryu, 2026-10-27; this was §0's alternative). §4's dates don't fit a fixed 84. Archivo's advances at `bodySm` (12 / 500):
   - "Last · yesterday": 85
   - "Last · 6 days ago": 90
   - "Last · Apr 12, 2025": 101

   Even at the mock's 11 / 500, the year form is 92. The bar stays 84. When the text is wider, the name column gives up the room and truncates sooner. Please let the mock follow.
2. **The tab label and its count are `gap.tight` (4) apart**, not 5. 5 is off the scale.
3. **"Default" is the existing `Badge`**: `labelEyebrow` (10 / .16em), padding 4 / 8. It is not 17a's 9px badge with 2 / 6 padding. It is the same badge as 3b and 3e.
4. **The bar's today marker is 2 × 14** (`beanFreshness.marker`), centred on the 4px track. It is not 17b's 2 × 12. It is the same marker as 3d.
5. **The indicator moves over `motion.expand` (340)**, not 0.2s. There is no 200 motion, and `press` is for press feedback only.
6. **Gear & beans' header is the compact one, pinned, and it collapses as the page scrolls**, like every pushed screen (Edit cup's pattern). The tabs scroll with the body. 17c's frame scrolls the header away.
7. **Gear & beans keeps each side's own height.** The two sides are pages a screen wide, swiped or tapped. The pages' box takes the open side's height, so the gear side (8 rows at most) doesn't scroll on into the beans side's length. The height changes when the tab switches, at the swipe's midpoint.
8. **On Gear & beans, both sides start under the open tab's underline, not on it** (Uryu, on device, 2026-10-27). 17c draws the underline on the gear list's first rule, and 17d draws the first card touching it. On device, the card's 2px ink frame read as one line with the 2px underline.
   - Gear: no rule over the first row. The rows start right under the underline on their own `listRow` padding.
   - Beans: the first card sits `gap.section` (12) under the underline.
   - Gear rows keep 3b's 46 thumbnail (D-51).
   - Home is unchanged: its underline still lands on the first row's rule, as 17a draws it.
   - Moving between sides: the underlines fade under the finger as the pages scroll, so they never jump. The tab labels switch at the midpoint. The slot count crossfades over one `motion.expand`. Before this, a tap on a tab flickered back and forth on device: the scroll passed through the old side's half on its way.
9. **Home opens on the gear side every time**, as 17a. The open side isn't remembered.
10. **An empty side on Home shows its add button** ("Add gear" → 3a, "Add a bag" → 3c), as before. Round 14 doesn't draw an empty side.

## D. §4 gear usage: confirmed

- **Lookup**: a cup holds its gear as `brewer_id` / `grinder_id`. One query gives each piece of gear its cup count and the latest `logged_at`, which is the brew date (back-datable, separate from `created_at`).
- **"Used, but no date"** can't happen today: `logged_at` is NOT NULL and defaults to `created_at`. The branch is built anyway: `N cups` alone, centred.
- **Date words**: built as you listed: today / yesterday / N days ago / Apr 12 / Apr 12, 2025, by calendar days in local time.
- **Order on Home**: Default first, then the most cups. On a tie, 3b's order (oldest added). Gear & beans' gear side keeps 3b's order unchanged.

## E. Mock fixes (no answer needed)

- **17c's note** says "a 3px bar on the first row's divider". Rev 2 made it 2px.
- **17c's note** says the slot count reads "4 / 5 open". The app and your §2 say "3 / 5 on the shelf" (Design Round 7, 18).
- **17b's past peak and resting bars** draw the beige window. See B1.
- **17a's "Recently sipped" rows** are 58 / 14 / 11 and Archivo 16. That is the old 2a row. The app's rows follow Round 9 (`thumbnail.list`, `listRow` padding). This is not new, just still in the frame.

## F. Reports: ours, not in any board

1. **2a: pinned chips and group headings** (built 2026-10-24; Uryu's).
   - Once the list scrolls past them, the category chips stay under the header.
   - Each group heading (month, roaster…, with the sort's name) stays under the chips until the next heading pushes it up.
   - Scrolling back, both return with the content.
   - A pinned block hides the rows passing under it. It is `surface.ground` edge to edge, with the page's dots drawn in it and lined up with the page's, so it reads as the page itself, not a band. With no fill, the rows' text overlapped the chips (Uryu, on device).
   - The hairline under a heading now belongs to the heading, so it stays while the heading is pinned.
2. **Every header: no rule under it** (built 2026-10-26; Uryu's).
   - The 2px ink rule that closed every screen header (and 8l's search header) is gone. The header ends open on its padding, and the 2pt it took goes with it.
   - Title-to-content distances are otherwise unchanged, and the collapse works as before. The footer panel keeps its top rule.
3. **2a's category chips and 2b's Group by are compact chips, 32 tall** (built 2026-10-26; Uryu's). This changes your Round 13 E1, which said `SegmentedControl` at 44.
   - Both rows should hold one line on narrower phones. At 44 with `inset.control`, 2a's four chips took two lines even at 430pt.
   - New `inset.controlCompact` `{ v: 8, h: 8 }`, `gap.controlCompact` (`space.6`) between chips, and each chip at least 44 wide.
   - A hit-slop of 6 above and below keeps the 44 touch target (§1).
   - 2a's chips hold one line from 375pt, 2b's Group by from 402pt.
   - 5a's maker chips and 8l's scopes keep `inset.control` at 44.
