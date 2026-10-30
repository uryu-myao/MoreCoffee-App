import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import type { SQLiteDatabase } from 'expo-sqlite';
import { cupsCsv, type CsvCup } from './csv';

/**
 * Two ways out, 6b's two My data rows (2026-10-28), each a file handed to
 * the iOS share sheet:
 *   shareCupsCsv  "Export my cups": the cups as a spreadsheet (csv.ts)
 *   shareBackup   "Export everything" (6b's Backup row): every table as one JSON file.
 *                 INTERIM (todo.md T-8): it holds 6b's Backup row until the
 *                 real backup is built. 6b's Backup saves by itself ("Last
 *                 saved today, 08:24"); this is a manual export of
 *                 everything, a different thing, and the only way the bags'
 *                 and gear's own records (size, default, finished on) get out.
 * Export only — nothing reads either back.
 *
 * The JSON (2026-10-20):
 *
 * Every table as stored, rows untouched (ids, epoch-ms times, JSON columns as
 * their text), found from sqlite_master so a new table is never left out.
 * schema_migrations rides along: it says which schema the rows are in.
 *
 * Read through SQL, never by copying the database file: the rows mostly live
 * in morecoffee.db-wal until a checkpoint, so the .db alone can be empty.
 */
export const EXPORT_FORMAT = 1;

type Tables = Record<string, Record<string, unknown>[]>;

export async function exportAll(db: SQLiteDatabase): Promise<{ schemaVersion: number; tables: Tables }> {
  const names = await db.getAllAsync<{ name: string }>(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
  );
  const tables: Tables = {};
  for (const { name } of names) {
    // Names come from sqlite_master, not from input; quoted as identifiers.
    tables[name] = await db.getAllAsync(`SELECT * FROM "${name.replace(/"/g, '""')}"`);
  }
  const row = await db.getFirstAsync<{ version: number | null }>('SELECT MAX(version) AS version FROM schema_migrations');
  return { schemaVersion: row?.version ?? 0, tables };
}

/** Local date as YYYY-MM-DD, for the file name. */
function localDate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Write morecoffee-backup-YYYY-MM-DD.json to the cache and open the share sheet on it. */
export async function shareBackup(db: SQLiteDatabase): Promise<void> {
  if (!(await Sharing.isAvailableAsync())) throw new Error('Sharing is not available on this device.');
  const now = new Date();
  const { schemaVersion, tables } = await exportAll(db);
  const body = {
    app: 'MoreCoffee',
    format: EXPORT_FORMAT,
    exported_at: now.toISOString(),
    schema_version: schemaVersion,
    tables,
  };
  // Cache: the file only has to live until the share sheet has taken it.
  const file = new File(Paths.cache, `morecoffee-backup-${localDate(now)}.json`);
  file.write(JSON.stringify(body, null, 2));
  await Sharing.shareAsync(file.uri, { UTI: 'public.json', mimeType: 'application/json' });
}

/** Every cup with its café's name, for the sheet. */
export async function listCsvCups(db: SQLiteDatabase): Promise<CsvCup[]> {
  const rows = await db.getAllAsync<Omit<CsvCup, 'flavours'> & { flavours: string }>(
    `SELECT c.id, c.logged_at, c.mode, c.rating, c.note, c.flavours,
            c.bean_name, c.bean_roaster, c.bean_origin, c.bean_region, c.bean_process, c.bean_roast_level, c.bean_roasted_at,
            c.brew_method, c.grinder, c.axis_acidity, c.axis_body, c.axis_roast, c.axis_sweetness,
            c.drink_type, p.name AS place_name, c.product_name
       FROM cups c
       LEFT JOIN places p ON p.id = c.place_id
      ORDER BY c.logged_at, c.id`
  );
  return rows.map((row) => ({ ...row, flavours: JSON.parse(row.flavours) }));
}

/**
 * Write morecoffee-cups-YYYY-MM-DD.csv to the cache and open the share sheet
 * on it (the date says what the file is once it is in someone's Files).
 */
export async function shareCupsCsv(db: SQLiteDatabase): Promise<void> {
  if (!(await Sharing.isAvailableAsync())) throw new Error('Sharing is not available on this device.');
  const file = new File(Paths.cache, `morecoffee-cups-${localDate(new Date())}.csv`);
  file.write(cupsCsv(await listCsvCups(db)));
  await Sharing.shareAsync(file.uri, { UTI: 'public.comma-separated-values-text', mimeType: 'text/csv' });
}
