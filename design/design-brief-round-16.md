# Design brief — Round 16 (2026-10-30)

Round 16 · responds to design-response-next.md Round 15 (Search and bag / gear pages, 2026-10-28)

**Status**: answered (`design-response-next.md`, "Round 16", 2026-10-30) and built the same day, except B5's address line: no address is stored (`data-model.md`, places), so it waits on Uryu (`todo.md` T-15). 2c for a Barista cup is answered in words, not drawn.

Two groups. Reply under "Round 16" in `design-response-next.md`, numbered as in this brief. A is a report: say if you see a problem. B asks for answers. **We are not waiting**: everything in B is built with our provisional version and gets replaced when your answer comes.

**Scope reminder**: this is what Uryu needs to log coffee every day, not a version for other people. Barista joins that scope now: Uryu wants to log his café cups.

Status of what this brief describes: Barista is built (2026-10-30). It compiles, and its data rules are tested. **It has not been tried on a device yet**: it needs a new native build (a MapKit search module and the location permission).

## A. Barista: what is built and the rules behind it (decided by Uryu, 2026-10-30)

Built from 5a / 5d as drawn. The two search sheets reuse the search sheet you already approved (flavours, Packaged's product). Everything not drawn in 5a / 5d is ours.

1. **Café is required.** This follows 5d ("Café · required"). §1 shows a required mark only when the field can always be filled. A café always can, because a name can be typed by hand, so its mark is always shown. That is unlike Bag / Method, whose mark depends on the shelf.
   - 5d now has two items that can be missing, the rating and the café. This is the state the mock drew ("Rating and café are still empty.").
   - The copy follows Round 9's two-field wording:
     - title: "Still needs a rating and a café"
     - body: "A cup can't be saved without them. What you've entered stays while you're here; closing loses it."
     - footer: "No rating or café yet."
   - The empty row reads 5d's "Which café?", in 5d's error look once Save has been pressed. "Go to first" scrolls to it.
2. **The café is never pre-filled from where the phone is.** There is no rule for how close is "close enough to be the same café". A wrong guess would record a café the user never chose.
   - So 5a's "Pre-filled" café is not built. The Café details heading reads SET once a café is chosen, never PRE-FILLED.
3. **The drink is pre-filled once a café is picked.** It takes the last drink logged at that café, with 5a's meta "What you ordered here last time".
   - Like the bag and gear defaults, saving without touching it records it.
   - A drink the user chose stays when the café changes.
   - A drink pre-filled from another café is cleared. A café with no history leaves the drink empty.
   - The drink is not required.
4. **The Café row's meta** is 5a's "250 m away · your 4th visit". Each part shows only when it is known:
   - the distance, when the location is known;
   - "your Nth visit", counting this cup, with nothing on a first visit.
5. **11a can now change a Barista cup's café and drink.** This overturns Round 4's 24 ("Barista leaves the block out until item 6").
   - Why: picking the wrong café from the map will happen. Without an edit, the only fix would be to delete the cup and log it again, entering its rating, axes, flavours and My words a second time.
   - Changing the café changes which café the cup points at, never a café's name. It leaves the drink as it is: editing corrects a record, so nothing is pre-filled here.
   - The rating, axes and flavours stay read only, as before.
6. **The location is asked for once**, on the first tap on a Café row. It is never asked on opening 5a or on choosing Barista. A later cup takes the last cup's mode, so 5a could open on Barista, and the system prompt would then appear with no reason in view.
   - The location is never stored.
   - It is never needed: the map's typed search works without it. It is used only for three things: putting nearby results first, showing distances, and listing the cafés around.
7. **The drink list starts from seven names. It is a starting point, never a whitelist.**
   - From the mocks: Flat white (5a / 5d) and House espresso (2a / 1b).
   - Added by us: Latte, Cappuccino, Americano, Pour-over, Cold brew.
   - Anything can be typed, and what is typed joins the history.

## B. Questions

1. **The café sheet** (5a's and 11a's Café row). It is the full-height search sheet: the field with "Done", one framed list of square radio rows, a pick closes the sheet, and `Add "‹typed›"` is the last row.
   - **The order of the rows:**
     - first, the cafés I've logged, latest visit first;
     - then the map's places. With nothing typed, these are the cafés within about 1 km (this needs the location). Once something is typed, they are the map's search results, biased towards the location when there is one.
     - A map place I've already logged shows once, as my row.
   - **Their meta lines:**
     - my cafés: "N visits", plus the distance when it is known;
     - the map's places: the short address · the distance.
   - It is one list, with no group headings. Typing filters my cafés and searches the map.
   - `Add "‹typed›"` is the way out that always works: no location, no network, or a café the map doesn't know. It saves the name only.
   - **Please confirm or redraw:**
     - the row content;
     - whether my cafés and the map's places need headings;
     - the placeholder (ours: "Café name").
2. **When the map can't help.** Each state is one muted line under the search field. Ours, provisional:
   - while searching: "Searching the map…"
   - with no network, or when the map refuses (Apple limits how often an app may search): "Can't search the map right now. Type the café's name to add it."
   - with the location denied or restricted, shown while nothing is typed: "Location is off, so nearby cafés aren't shown."
   - With the permission on but no position in time, there is no line: the nearby list is simply absent.
   - **Please draw these states.** Also say whether "Location is off" should offer a way to the phone's Settings.
   - **Copy: the sentence in iOS's permission prompt.** Ours: "MoreCoffee uses your location to list nearby cafés first when you pick one. Where you are is never stored."
3. **The drink sheet.** It is the same search sheet. Rows come in three blocks, one row per name:
   - this café's drinks, last ordered first, the first one with the meta "Last time here";
   - every drink I've logged, most used first;
   - the starting list (A7).
   - **Copy, all ours:** the placeholder "Drink", the empty 5a row "Add a drink", and "Last time here".
4. **2c for a Barista cup** (design-missing 2; it is still undrawn). Built for now: "What I logged" shows 5a's two rows, Café and Drink, read only.
   - These rows repeat the header: the title is already the drink, and the line under it is the café. Repeating the title is why Packaged's block was taken out (Round 7).
   - **What should "What I logged" show for a Barista cup, if anything?**
5. **11a for a Barista cup** (A5). Built:
   - a plain "Café details" heading over the two rows, as Packaged's "Product";
   - for an older cup that has none, the empty rows read "No café noted" / "No drink noted", which are ours, after "No bag noted".
   - There is no "No café" row, so a café can be changed but not removed. This fits it being required.
   - **Please confirm or redraw.**
6. **2b's group by café.** Round 10, 14 said: "Barista cups do not group by café in V1, because café can't be entered yet. Revisit once it can." It now can.
   - **Should Barista cups group by café, and under which sort?** Or should they stay one "Barista" group?
7. **Home's shelf rows open their page** (built 2026-10-28; overturns Round 15 B3). Round 15 B3 kept Home's shelf rows (17a / 17b) as information that opens nothing, with "See all gear & beans ›" as the way on. Now that a bag and a piece of gear have a page you arrive at to look (19a / 19c), Uryu wants the row itself to go there.
   - Built that way: a bean row opens 19a and a gear row opens 19c.
   - The row darkens while pressed (`state.pressed.row`), and a swipe across the pages cancels the press.
   - **Question:** §1 says a whole pressable row ends in the chevron, and B4 made › the only "opens something" sign. The shelf rows are one line with a status column, and a chevron would take about 24 from the name. We built them without one. Should they have it, or is the shelf an exception, as it is for §3.1's two lines?
8. **6b's Backup row, for now: a manual JSON export** (built 2026-10-28).
   - "Export my cups" is now the CSV 6b draws ("147 cups as CSV, notes included").
   - The JSON export of every table, which was that row until now, moved into 6b's **Backup** row. It stands in until the real backup exists, because it is the only way the bags' and gear's own records (size, default, finished on) get out. The per-cup CSV does not carry them.
   - 6b's line for Backup, "Last saved today, 08:24", describes a backup that saves by itself. This one is a file the user exports by hand, so the line can't be used as drawn.
   - **Question:** the label and the sub line for this interim row. We built "Back up everything" / "Bags and gear too, as JSON".
