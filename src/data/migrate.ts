import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { MIGRATIONS_TABLE, migrations } from './migrations';

export const DATABASE_NAME = 'morecoffee.db';

type Executor = Pick<SQLite.SQLiteDatabase, 'execAsync' | 'runAsync'>;

/**
 * Run `task` in a transaction. Native uses an exclusive transaction (its own
 * connection, so nothing else interleaves); expo-sqlite on web does not support
 * that and gets a regular transaction — still atomic. The task receives the
 * executor to run statements on.
 */
export async function inTransaction(db: SQLite.SQLiteDatabase, task: (tx: Executor) => Promise<void>): Promise<void> {
  if (Platform.OS === 'web') {
    await db.withTransactionAsync(() => task(db));
  } else {
    await db.withExclusiveTransactionAsync((tx) => task(tx));
  }
}

/**
 * Open the database and bring it up to the latest schema version. Called once
 * at startup by DatabaseProvider. Each pending migration runs in its own
 * transaction (exclusive on native) together with its schema_migrations row,
 * so a failed migration leaves no partial schema.
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
    await inTransaction(db, async (tx) => {
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
