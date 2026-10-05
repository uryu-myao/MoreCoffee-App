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

## No price

**There is no price column anywhere, deliberately.** A hand-entered price is always partial: people skip it, round it, or forget it for some cups. Partial price data cannot support spend reporting, because any total built on it is wrong in an unknown direction. Meanwhile, collecting it still costs UI space and user attention on every log.

So the model leaves price out rather than half-collect it. Do not reintroduce it as an obvious-looking addition. A spend feature needs a complete source (receipts, payment integration), not a free-text field.

UI consequence: 5e's "Bought at" row shows the store name only. The mock's right-aligned "¥180" is dropped (`drift.md` D-15).

---

## Dev seed

`src/data/dev/seed.ts` holds three cups, one per mode, every value taken from the mocks: 2a's three April records, enriched with 5a and 5e. Driver-agnostic SQL, so `check:schema` runs it under node:sqlite and a development database can run it under expo-sqlite. It is never imported by the app.
