/**
 * DEV-ONLY seed data. The app reaches it only through a require() inside an
 * `if (__DEV__)` branch (src/data/DatabaseProvider.js); Metro folds __DEV__ to
 * false and drops that branch before collecting dependencies in production
 * builds, so this module is never bundled or shipped.
 *
 * Reference rows (beans / places / products) seed a development database on
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
      sql: `INSERT INTO beans (id, name, roaster, origin, region, process, notes, opened_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      // 5a: "Blue Bottle · day 7, drink now" on Apr 8 → opened Apr 1. 2a: Washed.
      params: [1, 'Ethiopia Guji', 'Blue Bottle', 'Ethiopia', 'Guji', 'washed', '[]', at('2026-04-01T08:00:00+09:00')],
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

export function seedCupStatements(): SeedStatement[] {
  return [
    {
      // 2a "Ethiopia Guji · I made it · Floral, peach · 4" + 5a's brewer.
      sql: `INSERT INTO cups (id, created_at, rating, mode, note, bean_id, brew_method, grinder)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      params: [1, at('2026-04-08T08:20:00+09:00'), 4, 'made_it', 'Floral, peach', 1, 'V60', 'Comandante C40'],
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
