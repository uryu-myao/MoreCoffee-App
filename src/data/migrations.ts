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
        roast_level TEXT CHECK (roast_level IN ('light', 'medium-light', 'medium', 'medium-dark', 'dark', 'other')),
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
        mode TEXT NOT NULL CHECK (mode IN ('made_it', 'barista', 'packaged')),
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
  {
    /*
     * V1's capture → Taste DNA loop, in one migration (design/data-model.md
     * "V1 migration scope", decided 2026-10-10):
     *   - beans → bags (the unit a cup is logged from; §1 Words), with roast
     *     date, size, photo and the finished state; roast level in 4 steps,
     *     process + anaerobic, both without 'other' (unmapped values → NULL)
     *   - gear (one default per category)
     *   - cups: rating nullable (drafts later); the bag's details COPIED onto
     *     the cup at logging (bean_*), references kept (bag_id, brewer_id,
     *     grinder_id); flavour tags (JSON, ≤ 5) and the four axes (0–100)
     *   - settings: the two V1 first-setup answers, one row
     * SQLite cannot drop NOT NULL or change a CHECK in place, so beans and cups
     * are rebuilt; existing cups get their copies backfilled from their bag.
     */
    version: 2,
    name: 'capture loop: bags, gear, cup copies, tasting note, settings',
    statements: [
      `CREATE TABLE bags (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        roaster TEXT,
        origin TEXT,
        region TEXT,
        process TEXT CHECK (process IN ('washed', 'natural', 'honey', 'anaerobic')),
        roast_level TEXT CHECK (roast_level IN ('light', 'medium', 'medium-dark', 'dark')),
        notes TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(notes) AND json_type(notes) = 'array'),
        roasted_at INTEGER,
        opened_at INTEGER,
        finished_at INTEGER,
        size_g INTEGER CHECK (size_g > 0),
        photo_uri TEXT
      )`,
      `INSERT INTO bags (id, name, roaster, origin, region, process, roast_level, notes, opened_at)
        SELECT id, name, roaster, origin, region,
               CASE WHEN process IN ('washed', 'natural', 'honey') THEN process END,
               CASE WHEN roast_level IN ('light', 'medium', 'medium-dark', 'dark') THEN roast_level END,
               notes, opened_at
          FROM beans`,
      `CREATE TABLE gear (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL CHECK (category IN ('brewer', 'grinder', 'kettle', 'scale')),
        maker TEXT,
        settings_note TEXT,
        is_default INTEGER NOT NULL DEFAULT 0 CHECK (is_default IN (0, 1)),
        photo_uri TEXT,
        added_at INTEGER NOT NULL DEFAULT (${NOW_MS})
      )`,
      // One default per category (5a pre-fills it; 3e's "My default grinder").
      `CREATE UNIQUE INDEX gear_one_default_per_category ON gear (category) WHERE is_default = 1`,
      `CREATE TABLE cups_new (
        id INTEGER PRIMARY KEY,
        created_at INTEGER NOT NULL DEFAULT (${NOW_MS}),
        logged_at INTEGER,
        rating INTEGER CHECK (rating BETWEEN 1 AND 5),
        mode TEXT NOT NULL CHECK (mode IN ('made_it', 'barista', 'packaged')),
        photo_uri TEXT,
        note TEXT,
        flavours TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(flavours) AND json_type(flavours) = 'array' AND json_array_length(flavours) <= 5),
        axis_acidity INTEGER CHECK (axis_acidity BETWEEN 0 AND 100),
        axis_body INTEGER CHECK (axis_body BETWEEN 0 AND 100),
        axis_roast INTEGER CHECK (axis_roast BETWEEN 0 AND 100),
        axis_sweetness INTEGER CHECK (axis_sweetness BETWEEN 0 AND 100),
        bag_id INTEGER REFERENCES bags(id) ON DELETE SET NULL,
        bean_name TEXT,
        bean_roaster TEXT,
        bean_origin TEXT,
        bean_region TEXT,
        bean_process TEXT CHECK (bean_process IN ('washed', 'natural', 'honey', 'anaerobic')),
        bean_roast_level TEXT CHECK (bean_roast_level IN ('light', 'medium', 'medium-dark', 'dark')),
        bean_roasted_at INTEGER,
        brewer_id INTEGER REFERENCES gear(id) ON DELETE SET NULL,
        brew_method TEXT,
        grinder_id INTEGER REFERENCES gear(id) ON DELETE SET NULL,
        grinder TEXT,
        grind_setting REAL,
        water_temp_c REAL,
        ratio REAL,
        place_id INTEGER REFERENCES places(id) ON DELETE SET NULL,
        drink_type TEXT,
        product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
        bought_at_place_id INTEGER REFERENCES places(id) ON DELETE SET NULL
      )`,
      `INSERT INTO cups_new (id, created_at, logged_at, rating, mode, photo_uri, note,
                             bag_id, bean_name, bean_roaster, bean_origin, bean_region, bean_process, bean_roast_level,
                             brew_method, grinder, grind_setting, water_temp_c, ratio,
                             place_id, drink_type, product_id, bought_at_place_id)
        SELECT c.id, c.created_at, c.logged_at, c.rating, c.mode, c.photo_uri, c.note,
               c.bean_id, b.name, b.roaster, b.origin, b.region, b.process, b.roast_level,
               c.brew_method, c.grinder, c.grind_setting, c.water_temp_c, c.ratio,
               c.place_id, c.drink_type, c.product_id, c.bought_at_place_id
          FROM cups c LEFT JOIN bags b ON b.id = c.bean_id`,
      `DROP TABLE cups`,
      `DROP TABLE beans`,
      `ALTER TABLE cups_new RENAME TO cups`,
      `CREATE TRIGGER cups_logged_at_default AFTER INSERT ON cups
        WHEN NEW.logged_at IS NULL
        BEGIN
          UPDATE cups SET logged_at = NEW.created_at WHERE id = NEW.id;
        END`,
      `CREATE INDEX cups_logged_at ON cups (logged_at)`,
      `CREATE INDEX cups_bag_id ON cups (bag_id)`,
      `CREATE INDEX cups_brewer_id ON cups (brewer_id)`,
      `CREATE INDEX cups_grinder_id ON cups (grinder_id)`,
      `CREATE INDEX cups_place_id ON cups (place_id)`,
      `CREATE INDEX cups_product_id ON cups (product_id)`,
      `CREATE INDEX cups_bought_at_place_id ON cups (bought_at_place_id)`,
      `CREATE TABLE settings (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        drinks_out INTEGER CHECK (drinks_out IN (0, 1)),
        coffee_style TEXT CHECK (coffee_style IN ('black', 'with_milk', 'depends'))
      )`,
      `INSERT INTO settings (id) VALUES (1)`,
    ],
  },
];

/** The bookkeeping table. Created before any migration runs. */
export const MIGRATIONS_TABLE = `CREATE TABLE IF NOT EXISTS schema_migrations (
  version INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  applied_at INTEGER NOT NULL
)`;
