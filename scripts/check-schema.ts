// Schema drift check: applies every migration to an in-memory SQLite database
// (node:sqlite) and fails if the result differs from src/data/schema.ts, then
// runs the dev seed and probes the constraints. Run: npm run check:schema
import { DatabaseSync } from 'node:sqlite';
import { seedStatements } from '../src/data/dev/seed.ts';
import { MIGRATIONS_TABLE, migrations } from '../src/data/migrations.ts';
import { schema } from '../src/data/schema.ts';

const problems: string[] = [];
const fail = (msg: string) => problems.push(msg);

const db = new DatabaseSync(':memory:');
db.exec('PRAGMA foreign_keys = ON');
db.exec(MIGRATIONS_TABLE);
const versions = migrations.map((m) => m.version);
if (versions.some((v, i) => v !== i + 1)) fail(`migration versions must be 1..n in order, got ${versions}`);
for (const m of migrations) {
  db.exec('BEGIN');
  for (const sql of m.statements) db.exec(sql);
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
rejects('rating 0', `INSERT INTO cups (rating) VALUES (0)`);
rejects('rating missing', `INSERT INTO cups (mode) VALUES ('made_it')`);
rejects('unknown mode', `INSERT INTO cups (rating, mode) VALUES (3, 'gifted')`);
rejects('unknown process', `INSERT INTO beans (name, process) VALUES ('x', 'anaerobic')`);
rejects('bean notes not an array', `INSERT INTO beans (name, notes) VALUES ('x', '"floral"')`);
rejects('unknown place kind', `INSERT INTO places (name, kind) VALUES ('x', 'kiosk')`);
rejects('unknown container', `INSERT INTO products (brand, container) VALUES ('x', 'jar')`);
rejects('dangling bean_id', `INSERT INTO cups (rating, bean_id) VALUES (3, 999)`);
rejects('duplicate external_id', `INSERT INTO places (name, kind, external_id) VALUES ('a', 'cafe', 'mk1'); INSERT INTO places (name, kind, external_id) VALUES ('b', 'cafe', 'mk1')`);

const minimal = db.prepare('INSERT INTO cups (rating) VALUES (5)').run();
const row = db.prepare('SELECT created_at, logged_at FROM cups WHERE id = ?').get(minimal.lastInsertRowid) as { created_at: number; logged_at: number };
if (!row.created_at || row.logged_at !== row.created_at) fail('a cup with only a rating did not get created_at / logged_at defaults');

if (problems.length) {
  console.error(`check:schema FAILED (${problems.length})\n  - ${problems.join('\n  - ')}`);
  process.exit(1);
}
console.log(`check:schema OK — ${migrations.length} migration(s), ${declared.length} tables match schema.ts; seed: ${cups.length} cups across ${modes.size} modes; constraints enforced.`);
