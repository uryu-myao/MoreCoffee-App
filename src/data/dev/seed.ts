/**
 * DEV-ONLY seed data. The app reaches it only through a require() inside an
 * `if (__DEV__)` branch (src/data/DatabaseProvider.js); Metro folds __DEV__ to
 * false and drops that branch before collecting dependencies in production
 * builds, so this module is never bundled or shipped.
 *
 * Reference rows (bags / gear / places / products) seed a development database on
 * first run. Sample cups are used by scripts/check-schema.ts only, so cups
 * saved on device are never mixed with fixtures.
 *
 * Every value comes from the mocks: 2a's three April records (one per mode),
 * enriched with 5a (Ethiopia Guji, V60 · Comandante C40, Fuglen Tomigaya) and
 * 5e (Boss Craft · Black, 7-Eleven Tomigaya, 3 stars). Times are Tokyo local
 * as the mocks show them; 2a gives Apr 7 a date only, so it is set at noon.
 *
 * created_at is set and logged_at omitted, so the logged_at trigger is
 * exercised (logged_at = created_at).
 */

export type SeedStatement = { sql: string; params: (string | number | null)[] };

const at = (iso: string) => new Date(iso).getTime();

export function seedReferenceStatements(): SeedStatement[] {
  return [
    {
      // 3g "Edit bag": Ethiopia Guji · Blue Bottle · Light · roasted Mar 30 ·
      // opened Apr 6 · 250 g. 2a: Washed. 5b's printed flavours as notes.
      sql: `INSERT INTO bags (id, name, roaster, origin, region, process, roast_level, notes, roasted_at, opened_at, size_g)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      params: [1, 'Ethiopia Guji', 'Blue Bottle', 'Ethiopia', 'Guji', 'washed', 'light', '["Jasmine","White peach","Black tea"]', at('2026-03-30T08:00:00+09:00'), at('2026-04-06T08:00:00+09:00'), 250],
    },
    {
      // 3b: Hario V60 02 (default brewer), Comandante C40 (grinder; 3e: default,
      // added Apr 2, settings note), Fellow Stagg EKG (kettle).
      sql: `INSERT INTO gear (id, name, category, maker, settings_note, is_default, added_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      params: [1, 'Hario V60 02', 'brewer', 'Hario', null, 1, at('2026-04-02T08:00:00+09:00')],
    },
    {
      sql: `INSERT INTO gear (id, name, category, maker, settings_note, is_default, added_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      params: [2, 'Comandante C40', 'grinder', 'Comandante', '22 clicks for V60, 18 for AeroPress. Zero point re-set Mar 30.', 1, at('2026-04-02T08:00:00+09:00')],
    },
    {
      sql: `INSERT INTO gear (id, name, category, maker, settings_note, is_default, added_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      params: [3, 'Fellow Stagg EKG', 'kettle', 'Fellow', null, 0, at('2026-04-02T08:00:00+09:00')],
    },
    {
      sql: `INSERT INTO places (id, name, kind) VALUES (?, ?, ?)`,
      params: [1, 'Fuglen Tomigaya', 'cafe'],
    },
    {
      sql: `INSERT INTO places (id, name, kind) VALUES (?, ?, ?)`,
      params: [2, '7-Eleven Tomigaya', 'store'],
    },
    {
      sql: `INSERT INTO products (id, brand, name, container, volume_ml) VALUES (?, ?, ?, ?, ?)`,
      params: [1, 'Boss Craft', 'Black', 'can', 185],
    },
  ];
}

/** The gear rows alone: a dev database from before migration 2 has bags but no gear. */
export function seedGearStatements(): SeedStatement[] {
  return seedReferenceStatements().filter((st) => st.sql.includes('INSERT INTO gear'));
}

export function seedCupStatements(): SeedStatement[] {
  return [
    {
      // 2a "Ethiopia Guji · I made it · Floral, peach · 4" + 5a's method; the
      // bag's details copied as at logging (the cup copy rule).
      sql: `INSERT INTO cups (id, created_at, rating, mode, note, flavours, bag_id, bean_name, bean_roaster, bean_origin, bean_region, bean_process, bean_roast_level, bean_roasted_at, brewer_id, brew_method, grinder_id, grinder)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      params: [1, at('2026-04-08T08:20:00+09:00'), 4, 'made_it', 'Floral, peach', '["Floral","Peach"]', 1, 'Ethiopia Guji', 'Blue Bottle', 'Ethiopia', 'Guji', 'washed', 'light', at('2026-03-30T08:00:00+09:00'), 1, 'V60', 2, 'Comandante C40'],
    },
    {
      // 2a "House espresso · Barista · Fuglen · Cocoa, walnut · 5".
      sql: `INSERT INTO cups (id, created_at, rating, mode, note, place_id, drink_type)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      params: [2, at('2026-04-07T12:00:00+09:00'), 5, 'barista', 'Cocoa, walnut', 1, 'House espresso'],
    },
    {
      // 2a "Cold brew · Ready-to-drink · 7-Eleven · Can 185 ml · 3" = 5e's cup.
      sql: `INSERT INTO cups (id, created_at, rating, mode, product_id, bought_at_place_id)
            VALUES (?, ?, ?, ?, ?, ?)`,
      params: [3, at('2026-04-06T14:05:00+09:00'), 3, 'packaged', 1, 2],
    },
  ];
}

export function seedStatements(): SeedStatement[] {
  return [...seedReferenceStatements(), ...seedCupStatements()];
}
