// Schema drift check: applies every migration to an in-memory SQLite database
// (node:sqlite) and fails if the result differs from src/data/schema.ts, then
// runs the dev seed and probes the constraints. Run: npm run check:schema
import { DatabaseSync } from 'node:sqlite';
import { seedStatements } from '../src/data/dev/seed.ts';
import { MIGRATIONS_TABLE, migrations, type MigrationDb } from '../src/data/migrations.ts';
import { changeOf, dnaCupFromRow, type DnaCup } from '../src/data/tasteDna.ts';
import { schema } from '../src/data/schema.ts';

const problems: string[] = [];
const fail = (msg: string) => problems.push(msg);

/** node:sqlite behind the backfill interface (synchronous underneath). */
const asMigrationDb = (d: DatabaseSync): MigrationDb => ({
  all: async <T,>(sql: string, params: (string | number | null)[] = []) => d.prepare(sql).all(...params) as T[],
  run: async (sql: string, params: (string | number | null)[] = []) => {
    d.prepare(sql).run(...params);
  },
});

const db = new DatabaseSync(':memory:');
db.exec('PRAGMA foreign_keys = ON');
db.exec(MIGRATIONS_TABLE);
const versions = migrations.map((m) => m.version);
if (versions.some((v, i) => v !== i + 1)) fail(`migration versions must be 1..n in order, got ${versions}`);
for (const m of migrations) {
  db.exec('BEGIN');
  for (const sql of m.statements) db.exec(sql);
  if (m.backfill) await m.backfill(asMigrationDb(db));
  db.prepare('INSERT INTO schema_migrations (version, name, applied_at) VALUES (?, ?, ?)').run(m.version, m.name, Date.now());
  db.exec('COMMIT');
}

type Info = { name: string; type: string; notnull: number; pk: number };
type Fk = { from: string; table: string };
const tables = db.prepare(`SELECT name, sql FROM sqlite_master WHERE type = 'table' AND name NOT IN ('schema_migrations') AND name NOT LIKE 'sqlite_%'`).all() as { name: string; sql: string }[];

const declared = Object.keys(schema);
const actual = tables.map((t) => t.name);
for (const t of declared) if (!actual.includes(t)) fail(`table ${t}: declared in schema.ts, missing after migrations`);
for (const t of actual) if (!declared.includes(t)) fail(`table ${t}: created by migrations, not declared in schema.ts`);

for (const { name: table, sql } of tables) {
  const cols = schema[table as keyof typeof schema] as Record<string, any> | undefined;
  if (!cols) continue;
  const info = db.prepare(`PRAGMA table_info(${table})`).all() as Info[];
  const fks = db.prepare(`PRAGMA foreign_key_list(${table})`).all() as Fk[];
  const names = info.map((c) => c.name);
  if (names.join() !== Object.keys(cols).join()) fail(`${table}: columns [${names}] ≠ schema.ts [${Object.keys(cols)}]`);
  for (const c of info) {
    const d = cols[c.name];
    if (!d) continue;
    if (c.type !== d.type) fail(`${table}.${c.name}: type ${c.type} ≠ ${d.type}`);
    // defaultFrom columns are nullable in DDL and filled by a trigger.
    const wantNotNull = d.nullable || d.defaultFrom ? 0 : 1;
    if (!c.pk && c.notnull !== wantNotNull) fail(`${table}.${c.name}: NOT NULL ${c.notnull} ≠ expected ${wantNotNull}`);
    if (Boolean(c.pk) !== Boolean(d.pk)) fail(`${table}.${c.name}: primary key mismatch`);
    const fk = fks.find((f) => f.from === c.name);
    if ((fk?.table ?? undefined) !== d.references) fail(`${table}.${c.name}: references ${fk?.table} ≠ ${d.references}`);
    if (d.values) {
      const m = sql.match(new RegExp(`${c.name}\\s+[^,]*?CHECK\\s*\\(\\s*${c.name}\\s+IN\\s*\\(([^)]*)\\)`));
      const got = m ? m[1].split(',').map((s) => s.trim().replace(/^'|'$/g, '')) : [];
      if (got.join() !== d.values.join()) fail(`${table}.${c.name}: CHECK values [${got}] ≠ schema.ts [${d.values}]`);
    }
    if (d.defaultFrom) {
      const trig = db.prepare(`SELECT sql FROM sqlite_master WHERE type = 'trigger' AND tbl_name = ?`).all(table) as { sql: string }[];
      if (!trig.some((t) => t.sql.includes(`SET ${c.name} = NEW.${d.defaultFrom}`))) fail(`${table}.${c.name}: no trigger filling it from ${d.defaultFrom}`);
    }
  }
}

// Seed, then probe behaviour.
for (const s of seedStatements()) db.prepare(s.sql).run(...s.params);
const cups = db.prepare('SELECT id, mode, created_at, logged_at FROM cups ORDER BY id').all() as { id: number; mode: string; created_at: number; logged_at: number }[];
const modes = new Set(cups.map((c) => c.mode));
if (!['made_it', 'barista', 'packaged'].every((m) => modes.has(m))) fail(`seed: expected all three modes, got ${[...modes]}`);
for (const c of cups) if (c.logged_at !== c.created_at) fail(`seed cup ${c.id}: logged_at ${c.logged_at} did not default to created_at ${c.created_at}`);

const rejects = (label: string, sql: string) => {
  try { db.exec(sql); fail(`constraint not enforced: ${label}`); } catch { /* expected */ }
};
const accepts = (label: string, sql: string) => {
  try { db.exec(sql); } catch (e) { fail(`should be accepted: ${label} (${(e as Error).message})`); }
};
rejects('rating 0', `INSERT INTO cups (rating, mode) VALUES (0, 'made_it')`);
accepts('rating missing (a draft, migration 2)', `INSERT INTO cups (mode) VALUES ('made_it')`);
rejects('mode missing', `INSERT INTO cups (rating) VALUES (3)`);
rejects('free-text roast level', `INSERT INTO bags (name, roast_level) VALUES ('x', 'City+')`);
rejects('roast level medium-light (4 steps, deliberately)', `INSERT INTO bags (name, roast_level) VALUES ('x', 'medium-light')`);
rejects('roast level other (dropped)', `INSERT INTO bags (name, roast_level) VALUES ('x', 'other')`);
rejects('unknown mode', `INSERT INTO cups (rating, mode) VALUES (3, 'gifted')`);
accepts('process anaerobic', `INSERT INTO bags (name, process) VALUES ('x', 'anaerobic')`);
rejects('process other (dropped)', `INSERT INTO bags (name, process) VALUES ('x', 'other')`);
rejects('bag notes not an array', `INSERT INTO bags (name, notes) VALUES ('x', '"floral"')`);
rejects('flavours not an array', `INSERT INTO cups (rating, mode, flavours) VALUES (3, 'made_it', '"jasmine"')`);
rejects('six flavours', `INSERT INTO cups (rating, mode, flavours) VALUES (3, 'made_it', '["a","b","c","d","e","f"]')`);
accepts('five flavours', `INSERT INTO cups (rating, mode, flavours) VALUES (3, 'made_it', '["a","b","c","d","e"]')`);
rejects('axis above 100', `INSERT INTO cups (rating, mode, axis_body) VALUES (3, 'made_it', 101)`);
rejects('axis below 0', `INSERT INTO cups (rating, mode, axis_roast) VALUES (3, 'made_it', -1)`);
rejects('copied bean process outside the list', `INSERT INTO cups (rating, mode, bean_process) VALUES (3, 'made_it', 'other')`);
rejects('unknown gear category', `INSERT INTO gear (name, category) VALUES ('x', 'tamper')`);
rejects('two default grinders', `INSERT INTO gear (name, category, is_default) VALUES ('g2', 'grinder', 1)`);
accepts('a second, non-default grinder', `INSERT INTO gear (name, category, is_default) VALUES ('g3', 'grinder', 0)`);
rejects('dangling brewer_id', `INSERT INTO cups (rating, mode, brewer_id) VALUES (3, 'made_it', 999)`);
rejects('a second settings row', `INSERT INTO settings (id) VALUES (2)`);
rejects('unknown coffee style', `UPDATE settings SET coffee_style = 'latte' WHERE id = 1`);
rejects('drinks_out not 0/1', `UPDATE settings SET drinks_out = 2 WHERE id = 1`);
{
  const n = (db.prepare('SELECT COUNT(*) AS n FROM settings').get() as { n: number }).n;
  if (n !== 1) fail(`settings: expected exactly one row after migrations, got ${n}`);
}
rejects('unknown place kind', `INSERT INTO places (name, kind) VALUES ('x', 'kiosk')`);
rejects('dangling bag_id', `INSERT INTO cups (rating, mode, bag_id) VALUES (3, 'made_it', 999)`);
rejects('duplicate external_id', `INSERT INTO places (name, kind, external_id) VALUES ('a', 'cafe', 'mk1'); INSERT INTO places (name, kind, external_id) VALUES ('b', 'cafe', 'mk1')`);

const minimal = db.prepare("INSERT INTO cups (rating, mode) VALUES (5, 'barista')").run();
const row = db.prepare('SELECT created_at, logged_at FROM cups WHERE id = ?').get(minimal.lastInsertRowid) as { created_at: number; logged_at: number };
if (!row.created_at || row.logged_at !== row.created_at) fail('a minimal cup (rating + mode) did not get created_at / logged_at defaults');

// Upgrade path: a version-1 database with data, then migration 2. Checks the
// copies are backfilled from the bag and unmapped values become NULL.
{
  const old = new DatabaseSync(':memory:');
  old.exec('PRAGMA foreign_keys = ON');
  old.exec(MIGRATIONS_TABLE);
  const run = async (m: (typeof migrations)[number]) => {
    old.exec('BEGIN');
    for (const sql of m.statements) old.exec(sql);
    if (m.backfill) await m.backfill(asMigrationDb(old));
    old.exec('COMMIT');
  };
  await run(migrations[0]);
  old.exec(`INSERT INTO beans (id, name, roaster, origin, process, roast_level) VALUES (7, 'Kenya AA', 'Glitch', 'Kenya', 'other', 'medium-light')`);
  old.exec(`INSERT INTO beans (id, name, process, roast_level) VALUES (8, 'Brazil Cerrado', 'natural', 'dark')`);
  old.exec(`INSERT INTO cups (id, rating, mode, bean_id, grinder) VALUES (1, 4, 'made_it', 7, 'C40'), (2, 3, 'made_it', 8, NULL)`);
  for (const m of migrations.slice(1)) await run(m);
  const b7 = old.prepare('SELECT process, roast_level FROM bags WHERE id = 7').get() as { process: string | null; roast_level: string | null };
  if (b7.process !== null || b7.roast_level !== null) fail(`upgrade: 'other' / 'medium-light' should become NULL, got ${b7.process} / ${b7.roast_level}`);
  const c1 = old.prepare('SELECT bag_id, bean_name, bean_roaster, bean_origin, grinder, flavours, logged_at FROM cups WHERE id = 1').get() as Record<string, unknown>;
  if (c1.bag_id !== 7 || c1.bean_name !== 'Kenya AA' || c1.bean_roaster !== 'Glitch' || c1.bean_origin !== 'Kenya' || c1.grinder !== 'C40' || c1.flavours !== '[]' || !c1.logged_at)
    fail(`upgrade: cup 1 not carried over with its copies: ${JSON.stringify(c1)}`);
  const c2 = old.prepare('SELECT bean_process, bean_roast_level FROM cups WHERE id = 2').get() as Record<string, unknown>;
  if (c2.bean_process !== 'natural' || c2.bean_roast_level !== 'dark') fail(`upgrade: cup 2 copies wrong: ${JSON.stringify(c2)}`);
  // Deleting the bag keeps the cup and its copied details (the point of copying).
  old.exec('DELETE FROM bags WHERE id = 7');
  const after = old.prepare('SELECT bag_id, bean_name FROM cups WHERE id = 1').get() as Record<string, unknown>;
  if (after.bag_id !== null || after.bean_name !== 'Kenya AA') fail(`delete bag: cup should keep its copies with bag_id NULL, got ${JSON.stringify(after)}`);
  const trig = old.prepare(`SELECT COUNT(*) AS n FROM sqlite_master WHERE type = 'trigger' AND name = 'cups_logged_at_default'`).get() as { n: number };
  if (trig.n !== 1) fail('upgrade: logged_at trigger missing after the cups rebuild');
  old.prepare('INSERT INTO cups (rating, mode) VALUES (5, ?)').run('barista');
  const fresh = old.prepare('SELECT created_at, logged_at FROM cups ORDER BY id DESC LIMIT 1').get() as { created_at: number; logged_at: number };
  if (fresh.logged_at !== fresh.created_at) fail('upgrade: logged_at no longer defaults to created_at');
}

// Migration 3's replay: a version-2 database with cups, then migration 3.
// Each cup's dna_change must equal changeOf() at its own logged time, the
// replay must give the same bytes twice (deterministic: no clock), and an
// existing user is marked past setup.
{
  const DAY = 86400000;
  const v2 = async () => {
    const d = new DatabaseSync(':memory:');
    d.exec('PRAGMA foreign_keys = ON');
    d.exec(MIGRATIONS_TABLE);
    for (const m of migrations.slice(0, 2)) {
      d.exec('BEGIN');
      for (const sql of m.statements) d.exec(sql);
      d.exec('COMMIT');
    }
    const t0 = 1760000000000;
    d.exec(`INSERT INTO cups (id, rating, mode, logged_at, created_at, axis_acidity, axis_body, flavours) VALUES
      (1, 4, 'made_it', ${t0}, ${t0}, 25, NULL, '["Peach"]'),
      (2, NULL, 'made_it', ${t0 + DAY}, ${t0 + DAY}, 0, NULL, '[]'),
      (3, 2, 'made_it', ${t0 + 40 * DAY}, ${t0 + 40 * DAY}, 75, 50, '["Smoke","Juicy"]'),
      (4, 5, 'barista', ${t0 + 40 * DAY}, ${t0 + 40 * DAY}, NULL, NULL, '[]')`);
    d.exec('BEGIN');
    for (const sql of migrations[2].statements) d.exec(sql);
    await migrations[2].backfill!(asMigrationDb(d));
    d.exec('COMMIT');
    return d;
  };
  const a = await v2();
  const b = await v2();
  const rows = a.prepare('SELECT id, rating, logged_at, axis_acidity, axis_body, axis_roast, axis_sweetness, flavours, dna_change FROM cups ORDER BY logged_at, id').all() as any[];
  const again = b.prepare('SELECT dna_change FROM cups ORDER BY logged_at, id').all() as { dna_change: string }[];
  const earlier: DnaCup[] = [];
  rows.forEach((row, i) => {
    const cup = dnaCupFromRow(row);
    const want = JSON.stringify(changeOf(earlier, cup));
    if (row.dna_change !== want) fail(`replay: cup ${row.id} dna_change ${row.dna_change} ≠ ${want}`);
    if (again[i].dna_change !== row.dna_change) fail(`replay: not deterministic for cup ${row.id}`);
    earlier.push(cup);
  });
  const first = JSON.parse(rows[0].dna_change);
  if (first.before.acidity.value !== null || first.after.acidity.n !== 1) fail(`replay: cup 1 should start from nothing, got ${rows[0].dna_change}`);
  const unrated = JSON.parse(rows[1].dna_change);
  if (JSON.stringify(unrated.before) !== JSON.stringify(unrated.after)) fail('replay: an unrated cup must not move the profile');
  const setup = a.prepare('SELECT setup_done FROM settings').get() as { setup_done: number };
  if (setup.setup_done !== 1) fail('migration 3: an existing user should be marked past setup');
}
{
  const fresh = db.prepare('SELECT setup_done, reset_at FROM settings').get() as { setup_done: number; reset_at: number | null };
  if (fresh.setup_done !== 0 || fresh.reset_at !== null) fail(`migration 3: a fresh install should have setup_done 0, reset_at NULL; got ${JSON.stringify(fresh)}`);
}

// Migration 4: a version-3 database with a product and a packaged cup. The
// product's brand and name become the cup's product_name; products is gone.
{
  const d = new DatabaseSync(':memory:');
  d.exec('PRAGMA foreign_keys = ON');
  d.exec(MIGRATIONS_TABLE);
  for (const m of migrations.slice(0, 3)) {
    d.exec('BEGIN');
    for (const sql of m.statements) d.exec(sql);
    d.exec('COMMIT');
  }
  d.exec(`INSERT INTO products (id, brand, name) VALUES (1, 'Boss Craft', 'Black'), (2, 'Seven Café', NULL)`);
  d.exec(`INSERT INTO cups (id, rating, mode, product_id) VALUES (1, 3, 'packaged', 1), (2, 4, 'packaged', 2), (3, 5, 'packaged', NULL)`);
  d.exec('BEGIN');
  for (const sql of migrations[3].statements) d.exec(sql);
  d.exec('COMMIT');
  const names = (d.prepare('SELECT product_name FROM cups ORDER BY id').all() as { product_name: string | null }[]).map((r) => r.product_name);
  if (JSON.stringify(names) !== JSON.stringify(['Boss Craft Black', 'Seven Café', null])) fail(`migration 4: product names ${JSON.stringify(names)}`);
  const left = d.prepare(`SELECT COUNT(*) AS n FROM sqlite_master WHERE name = 'products'`).get() as { n: number };
  if (left.n !== 0) fail('migration 4: products should be dropped');
  const trig4 = d.prepare(`SELECT COUNT(*) AS n FROM sqlite_master WHERE type = 'trigger' AND name = 'cups_logged_at_default'`).get() as { n: number };
  if (trig4.n !== 1) fail('migration 4: logged_at trigger missing after the rebuild');
}

if (problems.length) {
  console.error(`check:schema FAILED (${problems.length})\n  - ${problems.join('\n  - ')}`);
  process.exit(1);
}
console.log(`check:schema OK — ${migrations.length} migration(s), ${declared.length} tables match schema.ts; seed: ${cups.length} cups across ${modes.size} modes; constraints enforced.`);
