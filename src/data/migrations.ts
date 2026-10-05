/**
 * Versioned migrations. Each entry is applied once, in order, inside a
 * transaction, and recorded in `schema_migrations`.
 *
 * RULES
 *   - Never edit or reorder a migration that has shipped: users already have
 *     data shaped by it. Change the schema by appending a new version.
 *   - After adding a migration, update schema.ts to the new shape and run
 *     `npm run check:schema` — it applies every migration to a scratch
 *     database and fails if the result differs from schema.ts.
 *
 * Driver-agnostic on purpose (plain SQL strings): migrate.ts runs these with
 * expo-sqlite on device; scripts/check-schema.ts runs them with node:sqlite.
 */

export type Migration = {
  readonly version: number;
  readonly name: string;
  readonly statements: readonly string[];
};

/** Epoch milliseconds, portable across SQLite versions. */
const NOW_MS = `CAST((julianday('now') - 2440587.5) * 86400000 AS INTEGER)`;

export const migrations: readonly Migration[] = [
  {
    version: 1,
    name: 'initial schema',
    statements: [
      `CREATE TABLE beans (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        roaster TEXT,
        origin TEXT,
        region TEXT,
        process TEXT CHECK (process IN ('washed', 'natural', 'honey', 'other')),
        roast_level TEXT,
        notes TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(notes) AND json_type(notes) = 'array'),
        opened_at INTEGER
      )`,
      `CREATE TABLE places (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        kind TEXT NOT NULL CHECK (kind IN ('cafe', 'store')),
        lat REAL,
        lng REAL,
        external_id TEXT UNIQUE
      )`,
      `CREATE TABLE products (
        id INTEGER PRIMARY KEY,
        brand TEXT NOT NULL,
        name TEXT,
        container TEXT CHECK (container IN ('can', 'bottle', 'carton', 'pouch')),
        volume_ml INTEGER CHECK (volume_ml > 0)
      )`,
      `CREATE TABLE cups (
        id INTEGER PRIMARY KEY,
        created_at INTEGER NOT NULL DEFAULT (${NOW_MS}),
        logged_at INTEGER,
        rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
        mode TEXT CHECK (mode IN ('made_it', 'barista', 'packaged')),
        photo_uri TEXT,
        note TEXT,
        bean_id INTEGER REFERENCES beans(id) ON DELETE SET NULL,
        brew_method TEXT,
        grinder TEXT,
        grind_setting REAL,
        water_temp_c REAL,
        ratio REAL,
        place_id INTEGER REFERENCES places(id) ON DELETE SET NULL,
        drink_type TEXT,
        product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
        bought_at_place_id INTEGER REFERENCES places(id) ON DELETE SET NULL
      )`,
      // logged_at defaults to created_at. SQLite cannot default one column from
      // another, and a BEFORE trigger cannot rewrite NEW, so the column is
      // nullable in DDL and filled here — the app never reads a NULL.
      `CREATE TRIGGER cups_logged_at_default AFTER INSERT ON cups
        WHEN NEW.logged_at IS NULL
        BEGIN
          UPDATE cups SET logged_at = NEW.created_at WHERE id = NEW.id;
        END`,
      `CREATE INDEX cups_logged_at ON cups (logged_at)`,
      `CREATE INDEX cups_bean_id ON cups (bean_id)`,
      `CREATE INDEX cups_place_id ON cups (place_id)`,
      `CREATE INDEX cups_product_id ON cups (product_id)`,
      `CREATE INDEX cups_bought_at_place_id ON cups (bought_at_place_id)`,
    ],
  },
];

/** The bookkeeping table. Created before any migration runs. */
export const MIGRATIONS_TABLE = `CREATE TABLE IF NOT EXISTS schema_migrations (
  version INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  applied_at INTEGER NOT NULL
)`;
