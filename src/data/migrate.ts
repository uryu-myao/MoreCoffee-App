import * as SQLite from 'expo-sqlite';
import { MIGRATIONS_TABLE, migrations } from './migrations';

export const DATABASE_NAME = 'morecoffee.db';

/**
 * Open the database and bring it up to the latest schema version.
 * Each pending migration runs in its own exclusive transaction together with
 * its schema_migrations row, so a failed migration leaves no partial schema.
 *
 * Not wired into the app yet (Step 6 is schema only); the first screen that
 * reads or writes calls this once at startup.
 */
export async function openDatabase(): Promise<SQLite.SQLiteDatabase> {
  const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
  await db.execAsync('PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;');
  await db.execAsync(MIGRATIONS_TABLE);

  const row = await db.getFirstAsync<{ version: number | null }>(
    'SELECT MAX(version) AS version FROM schema_migrations'
  );
  const current = row?.version ?? 0;

  for (const migration of migrations) {
    if (migration.version <= current) continue;
    await db.withExclusiveTransactionAsync(async (tx) => {
      for (const sql of migration.statements) await tx.execAsync(sql);
      await tx.runAsync('INSERT INTO schema_migrations (version, name, applied_at) VALUES (?, ?, ?)', [
        migration.version,
        migration.name,
        Date.now(),
      ]);
    });
  }

  return db;
}
