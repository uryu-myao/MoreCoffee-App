import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import type { SQLiteDatabase } from 'expo-sqlite';

/**
 * Export everything as one JSON file and hand it to the iOS share sheet
 * (2026-10-20). The minimum before 6b's export / backup design: so Uryu can
 * hold his own records outside the app. Export only — nothing reads it back.
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

/** Write morecoffee-YYYY-MM-DD.json to the cache and open the share sheet on it. */
export async function shareExport(db: SQLiteDatabase): Promise<void> {
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
  const file = new File(Paths.cache, `morecoffee-${localDate(now)}.json`);
  file.write(JSON.stringify(body, null, 2));
  await Sharing.shareAsync(file.uri, { UTI: 'public.json', mimeType: 'application/json' });
}
