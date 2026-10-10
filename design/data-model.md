# MoreCoffee — Data model

Local-first, on-device SQLite (`expo-sqlite`). This document holds the *why*; column comments in `src/data/schema.ts` point back here.

- **Shape (single source)**: `src/data/schema.ts` declares every column once. The TypeScript row types (`Cup`, `Bean`, `Place`, `Product`) are derived from it, so they cannot drift from it.
- **DDL**: `src/data/migrations.ts`, as versioned, immutable migrations.
- **Drift guard**: `npm run check:schema`, run on every commit by the pre-commit hook (`.githooks/pre-commit`), applies every migration to a scratch database (node:sqlite) and fails if the result differs from `schema.ts`. It checks tables, columns, types, NOT NULL, keys, references, CHECK value lists and the `logged_at` trigger. It then runs the dev seed and probes the constraints.
- **Dev seed**: `src/data/dev/seed.ts`. It is never imported by the app, so it is never bundled or shipped.

Status (2026-10-05, Step 6b): writes are wired; nothing reads cups yet.
- `DatabaseProvider` (above `AppShell`, in `App.js`) opens the database and runs pending migrations before the app renders. A failure shows a plain error screen instead of being swallowed. It sits at the root because storage is app-wide infrastructure, not shell layout: every screen needs it and nothing works without it.
- Dev builds seed the reference rows (beans / places / products) on first run. The seed is required inside an `if (__DEV__)` branch, which Metro drops from production builds.
- Record coffee reads the most recent bean / café / product / store as its field-set defaults and writes a `cups` row on Save, then dismisses. Only the active mode's columns are written.
- **Save cannot fail for a remote reason**: the write is a local insert (0.6–1.8 ms measured on device), so there is no spinner, no disabled state and no optimistic UI. A genuine failure (disk full, corrupt database) is shown in an alert, and the overlay stays open with the cup still filled in.

---

## Migrations

A versioned `schema_migrations (version, name, applied_at)` table, not a single setup script. The schema will change, and users will have data by then.

- On open: enable foreign keys, create `schema_migrations` if absent, then apply every migration with a version above the highest recorded one, in order.
- Each migration runs in its own transaction **together with** its `schema_migrations` row, so a failed migration leaves neither a partial schema nor a false record. On native that transaction is exclusive (its own connection). On web, where expo-sqlite does not support exclusive transactions, it is a regular one, still atomic (`inTransaction` in `migrate.ts`).
- **Web** (dev harness / browser checks only): expo-sqlite runs as WebAssembly (wa-sqlite). `metro.config.js` registers `.wasm` as an asset and sends COOP / COEP headers. Without the first, the web bundle fails to resolve `wa-sqlite.wasm`.
- Migration 1 was amended on 2026-10-05 (`mode` NOT NULL, `roast_level` CHECK) **before it had ever run anywhere**: `openDatabase()` was not yet wired into any build. That was the last moment such a change is a one-line edit rather than a table rebuild.
- **Never edit or reorder a shipped migration.** Append a new version, update `schema.ts` to the new shape, and run `check:schema`.
- The DDL is not generated from `schema.ts` because migrations are history: migration 1 must stay what it was even after the shape moves on. `check:schema` is what keeps the two honest.

## Conventions

- ids: `INTEGER PRIMARY KEY` (the SQLite rowid alias).
- Timestamps: `INTEGER` milliseconds since the Unix epoch, UTC. Sortable, compact, and timezone-free at rest.
- Enumerations: `TEXT` with a `CHECK (col IN (...))`. `schema.ts` holds the same list, and the TS types are unions of it.
- References: `ON DELETE SET NULL`. Deleting a bean or a place never deletes the cups that mention it.

---

## Tables

### cups

| column | type | null | notes |
|---|---|---|---|
| id | INTEGER | pk | |
| created_at | INTEGER | not null | default now |
| logged_at | INTEGER | filled | when the cup was drunk; defaults to `created_at` |
| rating | INTEGER | **not null** | 1–5 |
| mode | TEXT | **not null** | `made_it` \| `barista` \| `packaged` · structural |
| photo_uri | TEXT | null | |
| note | TEXT | null | the tasting note |
| bean_id | INTEGER | null | → beans · made_it |
| brew_method | TEXT | null | made_it (e.g. "V60") |
| grinder | TEXT | null | made_it (e.g. "Comandante C40") |
| grind_setting | REAL | null | made_it · **V1.5, no UI in V1** |
| water_temp_c | REAL | null | made_it · **V1.5, no UI in V1** |
| ratio | REAL | null | made_it · water : coffee by weight (16 = 1:16) · **V1.5, no UI in V1** |
| place_id | INTEGER | null | → places · barista |
| drink_type | TEXT | null | barista (e.g. "Flat white") |
| product_id | INTEGER | null | → products · packaged |
| bought_at_place_id | INTEGER | null | → places · packaged |

- **`logged_at` vs `created_at`**: they are separate so a cup can be back-dated (logged in the evening, drunk in the morning). `logged_at` defaults to `created_at`. SQLite cannot default one column from another, and a BEFORE trigger cannot rewrite `NEW`. So the column is nullable in DDL, and an AFTER INSERT trigger fills it whenever it is inserted as NULL. The app never reads a NULL, and the TS type is `number`.
- **Required fields**: `rating` is the only required *user-supplied content* field. **`mode` is structural**, so it is required too: it decides which mode-specific columns mean anything. A cup without a mode is invalid data, and allowing NULL would force null-handling into every query that branches on it. Everything else the user enters is optional.
- **Naming**: the UI uses the database values directly (`made_it`, `barista`, `packaged`); the earlier `mine` is gone.
- **Mode-specific columns live on `cups`**, all nullable, rather than in per-mode tables. Three short column groups are cheaper than three joins on every list read, and a cup belongs to exactly one mode. The columns of the other two modes are simply NULL.
- **V1.5 columns, not dead**: `grind_setting`, `water_temp_c` and `ratio` have no UI in V1. They exist so V1.5's parameter-tuning suggestions have history to learn from the day they ship. Removing them as unused would throw that history away. `grind_setting` is REAL because tuning needs a number; its scale is the grinder's own (clicks or dial).
- **Indexes**: `logged_at` (the list sorts on it), plus each reference column.

### beans

| column | type | null | notes |
|---|---|---|---|
| id | INTEGER | pk | |
| name | TEXT | not null | |
| roaster | TEXT | null | |
| origin | TEXT | null | Try Next input |
| region | TEXT | null | Try Next input |
| process | TEXT | null | `washed` \| `natural` \| `honey` \| `other` · Try Next input |
| roast_level | TEXT | null | `light` \| `medium-light` \| `medium` \| `medium-dark` \| `dark` \| `other` · Try Next input |
| notes | TEXT | not null | flavour tags, JSON array of strings, default `[]` |
| opened_at | INTEGER | null | drives the freshness meter |

- **Try Next inputs**: `origin`, `region` and `process` are what Try Next reasons from. They are nullable because a bag's label does not always say, but **the UI should encourage filling them**, since a bean without them contributes little to Try Next.
- **`roast_level` as an ordered enum, not free text**: it is a Try Next matching dimension alongside origin and process. Free text guarantees that "Medium", "medium", "中深", "City+" and "中煎り" all coexist, and none of them compare or yield a distance. Six values give an ordered scale (light → dark), so "one step darker" is computable, plus `other` for labels that do not map. The mocks define no scale, which means the *UI* is undecided, not that storage should be unconstrained; the picker maps whatever it shows onto these values.
- **`notes` as a JSON array, not a join table**: deliberate. Per-user volume is in the hundreds of beans, so Try Next can scan them all and parse the arrays in memory. A tags table and a join table would add two tables and a join to every bean read, for a query pattern that never needs an index. The column is checked to be a valid JSON array. If tags ever need cross-user aggregation or indexing, that is the point to migrate to a join table.

### places

| column | type | null | notes |
|---|---|---|---|
| id | INTEGER | pk | |
| name | TEXT | not null | |
| kind | TEXT | not null | `cafe` \| `store` |
| lat | REAL | null | |
| lng | REAL | null | |
| external_id | TEXT | null, unique | MapKit identifier |

- **One table for cafés and stores**: a convenience store and a café differ only by `kind`. Barista cups point at a café (`place_id`); packaged cups point at where they were bought (`bought_at_place_id`). The same 7-Eleven can be both, depending on the cup.
- **`external_id`** holds the MapKit identifier, so a later visit matches the existing place instead of creating a duplicate. It is unique when present; places entered by hand have none.

### products

| column | type | null | notes |
|---|---|---|---|
| id | INTEGER | pk | |
| brand | TEXT | not null | "Boss Craft" |
| name | TEXT | null | "Black" |
| container | TEXT | null | `can` \| `bottle` \| `carton` \| `pouch` |
| volume_ml | INTEGER | null | > 0 |

---

## Migration 2 landed (2026-10-10)

The "V1 migration scope" below (a–d, nullable rating, the two settings) is **built as migration 2**. The planned items it covers are no longer plans. The tables above still describe migration 1; `src/data/schema.ts` is the current shape.

Names as built:
- **`beans` is renamed `bags`** (§1 Words: the unit a cup is logged from), and `cups.bean_id` is renamed `cups.bag_id`.
- The copies on cups keep the `bean_` prefix: `bean_name`, `bean_roaster`, `bean_origin`, `bean_region`, `bean_process`, `bean_roast_level`, `bean_roasted_at`. They describe the coffee ("Bean name").
- Bags: `size_g`, `finished_at` (NULL = open, counts against the 5 slots).
- Gear: `gear (name, category, maker, settings_note, is_default, photo_uri, added_at)`. A partial unique index allows one default per category.
- Settings: one row, `drinks_out` (0 / 1) and `coffee_style` (`black` / `with_milk` / `depends`); NULL when first setup was skipped.

Not in it (unchanged decisions): drafts' screen and flow, profile, the other settings, 8h's merge table, remembered filters.

## Planned changes (decided 2026-10-09, not built)

Not in `schema.ts` yet. They change the structure, so they land as a migration once the design is settled. They come **before** the bag-delete feature (`gaps.md` 18).

**One migration, not several (decided 2026-10-09).** All of the following land together:
- the cup copies of bag details;
- the tasting-note columns;
- `roasted_at`, size and photo on bags;
- the 4-step roast level;
- `anaerobic`.

Do not stack small migrations.
- **What "one migration" means**: everything already visible lands together. It does not mean nothing may be added later.
- **Migration 3 is already known**: a "first setup done" flag, added when the first-setup flow (8a / 8n / 8c / 8o) is built (stage 3 or later). Without it, a skipped setup (both settings NULL) cannot be told from one never shown.

### Storage audit: every input in the 31 screens (2026-10-10)

**Why this audit exists**: the taste axes and the flavour tags were built as screen parts (`AxisSlider`, 5b's chips) while nothing checked where their values would be stored. Parts went from design to code; storage did not follow. So before the one migration, every input is mapped to its column, and gaps are written as **none**.

The columns are today's (`schema.ts`); "planned" means already decided above.

**Cups (Record flow)**

| screen | input | stored in |
|---|---|---|
| 5a 5d 5e | rating (stars) | `cups.rating` |
| 5a 5d 5e | Who made it (mode) | `cups.mode` |
| 5a | date / time in the header (back-dating) | `cups.logged_at` (no edit UI drawn) |
| 5a | Bag | `cups.bean_id`; copies planned |
| 5a | Method ("V60 · Comandante C40") | `cups.brew_method`, `cups.grinder` (text) |
| 5a 5d | Café | `cups.place_id` → `places` |
| 5a 5d | Drink | `cups.drink_type` |
| 5a 5e | Product (brand · name) | `cups.product_id` → `products` |
| 5a 5e | Package ("Can · 185 ml") | `products.container`, `products.volume_ml` |
| 5a 5e | Package detail "Chilled, unsweetened" | **none** (display copy, or product attributes; unclear) |
| 5e | Bought at | `cups.bought_at_place_id` |
| 5e | price "¥180" | none, **by design** (No price, D-15) |
| 5a 5d 5e | photo | `cups.photo_uri` |
| 5b | four axes | **none** → `axis_*` planned |
| 5b | flavour tags | **none** → `cups.flavours` planned |
| 5b | My words | `cups.note` |
| 5d | "Keep as draft" ("held as a draft until you finish") | **none**: a draft has no rating, but `rating` is NOT NULL, and there is no draft table or flag |
| 8e | "Log a cup with this plan" (28 clicks, 92°, 1:16) | `grind_setting`, `water_temp_c`, `ratio` (V1.5 columns, no UI in V1) |

**Bags (`beans`)**

| screen | input | stored in |
|---|---|---|
| 3c 3g | Bean name / Roaster | `name` / `roaster` |
| 3c 3g | Roast level | `roast_level` (4 steps planned) |
| 3c 3g | Origin / Region / Process (forms planned) | `origin` / `region` / `process` |
| 3c 3g | Photo | **none** (planned) |
| 3c 3g | Roasted on | **none** → `roasted_at` planned |
| 3c 3g | Size | **none** (planned) |
| 3c / 3g | "Open this bag" / Opened on | `opened_at` |
| 3c | "Use" (reuse a past bag) | a new row from an old one |
| 3d | Finish bag | **none**: no finished state. 3f's "Mar 2 → Mar 21" needs a finish date, and the 5-slot cap counts unfinished bags |
| 3f | Reopen bag | **none** (clears the finish state) |
| 3g | Delete this bag | row delete (after the copies, `gaps.md` 18) |

**Gear: no table at all**

| screen | input | stored in |
|---|---|---|
| 3a | category tabs, catalogue search, multi-select (cap 8), "Not listed — add your own" | **none** |
| 3b | the list itself, "Default" badge | **none** ("used in N cups" can be derived from `cups.brew_method` / `grinder` text) |
| 3e | photo, Name, Category, Maker, Added on, My settings note, My default grinder, Remove | **none** |
| 5a | "Your default brewer" pre-fill | **none** (needs the default) |
| 8c | "Pick what you own now" (generic: Pour-over dripper, Hand grinder, …; up to 3) | **none** (becomes the gear shelf) |

**Profile, settings, words, notifications, search**

| screen | input | stored in |
|---|---|---|
| 6d | photo, Display name (24), How I brew | **none** |
| 8g | "Read my words" switch | **none** |
| 8g | Reset my taste DNA ("cups and notes are never deleted") | **none** (needs a reset point) |
| 8h | Add word, rename, merge, Clean up | **none** (the merge table, proposal above) |
| 8i | Morning reminder, time, days; Updates & notices; Brewing tips; Bag going stale | **none** |
| 8m | App language / Follow my phone | **none** |
| 7a 7b | read state, Mark all read (and the items themselves, kept 60 days) | **none** |
| 8l | recent searches | **none** |
| 8e | "Not for me" (dismiss a suggestion) | **none** |
| 8e | "Add bag to my beans" | a new `beans` row |
| 8j | topic, message, screenshot, include version, reply email | sent, not stored; **the sending path is undefined** |
| 2a 2b 3f 8l | filters, sort, group, search scope | screen state; whether to remember them is undecided |

**Derived, no storage needed**:
- counts, streak, "Logging since", "used in N cups", slots left, "stale", freshness day, Taste DNA;
- its shifts ("shifted 4 days ago", 5c's "where it sat before") can be recomputed as of a date from cups, as long as the arithmetic is fixed. If it changes (e.g. "Read my words" is toggled), past shifts move. That is a call for later.

**The migration as now known** (in addition to the planned items above):
- a finish state on bags;
- a gear table;
- profile and settings storage;
- 8h's merge table;
- notification read state;
- recent searches;
- Try next dismissals;
- a draft form of a cup.

Which of these are V1 is open (report 2026-10-10).

**Audit addendum (2026-10-10)**: the mock file holds 40 boards. The 31 above are the shipped screens; these were outside them:

| screen | input | stored in |
|---|---|---|
| **2c Record (one cup)** | none; read-only. Its buttons: back, **edit** (pencil; destination not drawn), share | — |
| 2c | shows "day 7 when brewed" | derived from the cup's copied `roasted_at` + `logged_at` (supports copying the date) |
| 2c | shows "My default brewer, **22 clicks**" | `grind_setting`, which has **no input** in 5a; 3e's settings note is free text ("22 clicks for V60, 18 for AeroPress"), so parsing it is fragile. Open |
| 6b | How adventurous (Safe / Stretch / Surprise), Export CSV, Backup | none; outside the loop |
| 6c 8b 8k | reminders summary, language, sign-in, account, delete account | none; outside the loop |
| 1a 8a 9a 9b | welcome / alternative home, no inputs | — |

### V1 migration scope (decided 2026-10-10)

**Test**: is it needed for the capture → Taste DNA loop to run? Not "is the screen in V1".

**In**:
- a. Cups: the four axes and the flavour tags.
- b. The cup copies of bag details, `roasted_at`, the 4-step roast level, `anaerobic`, and `other` dropped.
- c. Bags: photo, roast date, size, and **the finished state with its date**. The 5-slot cap counts open bags; full slots would stop capture.
- d. **The gear table, whole.** 5a pre-fills the default brewer and 8c's first setup picks gear; without stored gear every cup is typed by hand, and "15 seconds a cup" fails. 3a / 3b / 3e can be built later; the table and 5a's read of it are V1.

**Out**:
- e. Drafts (5d "Keep as draft"): an exception path, designed once the main path runs. **But `cups.rating` becomes nullable in this migration**, because a draft has no rating; dropping NOT NULL later costs more. Taste DNA already ignores unrated cups (8g).
- f. Profile (6d), settings (8g 8i 8m), notification read state, recent searches, 8h's merge table: outside the loop, V1.5+.
- g. Remembered filters / sort (2a 2b 3f 8l): **not stored**, decided. Each launch starts from the defaults. No columns.
- h. 8j's sending path: outside the loop, but the screen is not built until it is defined (`todo.md`).

### capture → Taste DNA, end to end (checked 2026-10-10, scope a–d)

| step | data | stored in (a–d) |
|---|---|---|
| 8n first setup 1/3 | how you take your coffee | **nowhere**, see finding 3 |
| 8c first setup 2/3 | gear picks (generic: "Pour-over dripper", "Hand grinder") | gear table (d) |
| 8o first setup 3/3 | first bag: name (roaster, roast date optional) | `beans` (b, c) |
| 8c | "I mostly drink out" | **nowhere**, see finding 2 |
| 3c add a bag | name, roaster, roast level, roast date, size, photo, opened | `beans` (b, c) |
| 5a | date / time, rating, mode | `logged_at`, `rating`, `mode` |
| 5a | Bag pre-filled, with "day 7, drink now" | `bean_id` + copies (b); the day from `roasted_at` |
| 5a | Method pre-filled "Your default brewer" | the gear table's default (d) → `brew_method` / `grinder` text |
| 5a | Café / Drink / Product / Bought at / photo | `places` / `drink_type` / `products` / `bought_at_place_id` / `photo_uri` |
| 5b | four axes, flavour tags, My words | `axis_*` (a), `flavours` (a), `note` |
| 5b | flavour suggestions (bundled, history, the bag's notes) | code; history from `cups.flavours`; `beans.notes` |
| Save → 5c | "pushed you brighter", the ghost / delta, "4 of 5 cups" | derived: Taste DNA as of before / after this cup |
| Taste DNA (1b 4a 4b 6a 8f) | ratings (unrated ignored), recency, axes, matched words, lock-in at 10 | `rating`, `logged_at`, `axis_*`, `note` + the bundled word map |
| 2c the cup again | everything above, "day 7 when brewed" | as above |
| 3d → 3f finish | slots | the finished state (c) |

**V1 settings: exactly two, in one place (decided 2026-10-10)**. They live together, e.g. a single-row `settings` table:

| setting | from | read | effect |
|---|---|---|---|
| "I mostly drink out" | 8c | **once**: the first cup's default mode (Barista) | from the 2nd cup on, the last cup's mode is the default, so the setting stops mattering |
| "How do you take your coffee?" (Black / With milk / Depends on the day) | 8n | **every cup** | orders 5b's tasting-note suggestions |

- The second is read for good, so it should be changeable. V1 has no settings screen (`gaps.md` 22).
- It needs the bundled flavour words to carry a group ("acidity / origin" vs "body / sweetness"); proposal in `components.md`, to be decided. Whether it also orders the axes (C-1) is open; the scope is fixed after that.

**Result**: with a–d, every value on the path has a column, except these findings:
1. **Cups should reference their gear as well as copy it.**
   - 3e says "Edits apply to the 2 cups already logged with it" (option B), and 3b shows "used in N cups". Matching by name text breaks on a rename or two items with one name.
   - So add `brewer_id` / `grinder_id` references to cups, with the text kept as the copy: the same shape as bags.
   - This is part of d.
2. **8c's "I mostly drink out"** has nowhere to go under a–d.
   - Its likely job is the first cup's default mode (Barista); later cups take the last cup's mode.
   - Either store one setting for it, or treat the choice as "no gear" and default the first cup to I made it.
3. ~~8c's other two steps are not drawn.~~ **Drawn 2026-10-10 as 8n and 8o:**
   - **8o** (3/3, first bag: Bean name; Roaster and Roasted on optional) → `beans` (b, c). Covered.
   - **8n** (1/3, "How do you take your coffee?": Black / With milk / Depends on the day) **"sets which tasting notes show first when you log a cup"**. It is **a new input with nowhere to go** under a–d: one setting. It changes 5b's ordering, not whether the loop runs.
   - **Decided 2026-10-10: stored in V1.** History has no first cups, and the first cups are exactly where this setting should work. Asking it in first setup and then ignoring it would be the worst form.
4. 2c's "22 clicks": see the addendum (open).

### The tasting note has no columns yet (found 2026-10-09; priority)
5b's input has nowhere to go except "My words", so building 5b first would let a user enter a note that is not kept. Proposal:

| data | today | proposal |
|---|---|---|
| **My words** (free text) | `cups.note` exists ("the tasting note") | keep `note`. It is stored as written and never rewritten (see words below) |
| **flavour tags** (up to 5) | **no column** | `cups.flavours TEXT NOT NULL DEFAULT '[]'`: a JSON array of the **words themselves**, in the order chosen, `CHECK (json_valid(flavours) AND json_type(flavours) = 'array' AND json_array_length(flavours) <= 5)` |
| **the four axes** | **no columns** | `axis_acidity`, `axis_body`, `axis_roast`, `axis_sweetness`: `INTEGER NULL`, `CHECK (… BETWEEN 0 AND 100)`. Points on the 5 steps; `NULL` = not noted (§9). Keys as `src/constants/tasteAxes.js` |

- **Why an array, not a join table**: at most 5 per cup, read with the cup. The bundled list lives in code, and history (frequency order) is a `json_each` over cups: hundreds to thousands of rows. Same reasoning as `beans.notes`.
- **Why the words, not word ids**:
  - Flavours have **no master table and no rename UI**. 8h's rename / merge belongs to *My words*, a different list (`components.md` "Flavours and words are two kinds of data").
  - Storing the text keeps a cup the fact it was, as with the bag copies.
  - If renaming a flavour is ever wanted, it is an explicit rewrite at that moment (as bag edits are), never a reference.
- **My words and 8h**:
  - 8h's words are *matched* from notes (8g: "Your words are matched, not read"). Renaming or merging a word "everywhere" must not rewrite anyone's note text; the note is the user's own writing.
  - So 8h needs its own small table (a word, and what it merges into), used for matching and counting. The notes stay as typed.
  - Proposal; specced with 8h.

### Cups copy their bag's details at logging
- When a cup is logged, the bag's details are **copied onto the cup** and stored there. `bean_id` stays as a reference, but **display and Taste DNA read the cup's copies**.
- **Why**:
  - It matches gear, which a cup already stores as text (`grinder`).
  - A cup is a fact that happened: that day, that coffee. A reference would let a later edit of the bag rewrite past cups, and a delete strip them (`ON DELETE SET NULL`).
  - In a local-first app the records are the only asset, so they must not depend on a foreign-key chain.
- **Copied** (decided 2026-10-09):
  - `name`, `roaster`, `origin`, `region`, `process`, `roast_level`;
  - **`roasted_at`**: the date itself, never the day count. "Day N" is computed for display. The date cannot be recovered once lost, and how a cup's rating relates to the bean's age is a future input for Taste DNA (it has recency decay).
- **Not copied**:
  - `opened_at`, size and photo: they describe the bag, not the cup;
  - **`notes`**: the bag's printed flavour text, not something that happened in the cup. What the user tasted lives in the cup's flavour tags and My words. Copying the label's text in would put "what I entered" and "what the bag said" in one place, the same mixing of sources §1's brown / neutral rule forbids.
- **Editing a bag (decided 2026-10-09, option B)**: on Save, 3e / 3g also rewrite **the copied fields** on the cups already logged from it, as their footers say ("Edits apply to the N cups already logged").
  - Conditions: the footer note stays on screen, with the real count, **and says which fields sync** (wording decided later) (seeing how many cups change is what makes B acceptable); only copied fields sync (opening date, size and photo were never copied).
  - **B is an explicit rewrite at edit time, not a live reference.** Do not "simplify" it back to reading the bag through `bean_id`: a reference would also let a delete strip cups, and would make every edit silent.
  - Deleting a bag rewrites nothing (decided).
- **`beans.notes`: kept, with one recorded use (2026-10-09)**:
  - It is the bag's printed flavours (Jasmine, White peach, Black tea), the same vocabulary as 5b's flavour tags. So when a cup is logged from that bag, its notes can be **the first flavour suggestions**: more precise than the bundled list or history, and with no backend (`todo.md` V1 candidate).
  - Whether Try Next also uses it is a V2 call.
  - **No form fills it yet** (3c / 3g need a field, built only if that use is adopted). Until then it is a kept column with a stated purpose, not a dead one.
  - It is never copied to cups (decided).
- **Not the same thing**: 5b's flavour tags are per cup and have **no column yet** (the tasting note is not saved).

### Bag fields: the forms and the table disagree
| field | 3c (new bag) | 3g (edit bag) | `beans` |
|---|---|---|---|
| Bean name | yes | yes | `name` |
| Roaster | yes | yes | `roaster` |
| Roast level | Light / Medium / Dark | same | `roast_level`, 6 values (+ other) |
| Roasted on | yes | yes | **missing** |
| Opened on | set by "Open this bag" | yes | `opened_at` |
| Size | yes | yes | **missing** |
| Photo | yes | yes | **missing** |
| Origin / region / process | — | — | present, but no form asks for them (Try Next inputs) |
| notes (flavour tags) | — | — | present, no form |

- **Roast level vs the Roast axis (2026-10-09): two different data.**
  - The bag's `roast_level` is **transcribed from the bag**: what the roaster calls it. 3c's form copies the label ("Shoot the bag", Roasted on, Size).
  - The cup's Roast axis (5b, five steps) is **what the user perceived**.
  - 5b starts every axis empty ("Drag only what you noticed"), so the bag never pre-fills the axis, and no scale mapping is needed.
  - A gap between them is information (a "Medium" that always reads dark to this person), not a conflict to remove. The axis stays at five steps like the other three.
  - The table's 6 values + other (`light` · `medium-light` · `medium` · `medium-dark` · `dark` · `other`) were set when this model was written, on the belief that "the mocks define no scale". 3c / 3g do: Light / Medium / Dark.
- **The bag's roast level becomes 4 steps + unset (decided 2026-10-09)**: `light` · `medium` · `medium-dark` · `dark`, `NULL` = unset. 3c / 3g's forms gain "Medium-dark".
  - **The asymmetry is deliberate. Do not "complete" it with medium-light.**
  - Medium-dark (中深煎り) is a standard class on Japanese labels: 浅 / 中 / 中深 / 深. With 3 steps those bags cannot be transcribed.
  - 6 steps would be false precision: roasters' granularity differs, so finer steps do not make bags more comparable.
  - A symmetric 5 would match the Roast axis's 5 and invite "set both the same", erasing the difference that is the information. An uneven 4 shows by its shape that these are two scales.
  - `other` is dropped (proposal 2026-10-09). A label that does not map is left unset; `other` gives Try Next nothing to compare.
- **Process: `anaerobic` is added (decided 2026-10-09)**, giving `washed` · `natural` · `honey` · `anaerobic`, `NULL` = unset or unknown. `other` is dropped too (proposal), for the same reason.
- **Roast date**: freshness is counted from it in 3g ("Recounted from the roast date"), and the meter's peak band fits degassing. 8i's "Bag going stale — around day 21 after opening" counts from opening. So **both dates are needed** (`gaps.md` 8).

---

## No price

**There is no price column anywhere, deliberately.** A hand-entered price is always partial: people skip it, round it, or forget it for some cups. Partial price data cannot support spend reporting, because any total built on it is wrong in an unknown direction. Meanwhile, collecting it still costs UI space and user attention on every log.

So the model leaves price out rather than half-collect it. Do not reintroduce it as an obvious-looking addition. A spend feature needs a complete source (receipts, payment integration), not a free-text field.

UI consequence: 5e's "Bought at" row shows the store name only. The mock's right-aligned "¥180" is dropped (`drift.md` D-15).

---

## Dev seed

`src/data/dev/seed.ts` holds three cups, one per mode, every value taken from the mocks: 2a's three April records, enriched with 5a and 5e. Driver-agnostic SQL, so `check:schema` runs it under node:sqlite and a development database can run it under expo-sqlite. It is never imported by the app.
