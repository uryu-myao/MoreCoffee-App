import { createContext, useContext, useEffect, useState } from 'react';
import { AppState, Platform, StyleSheet, View } from 'react-native';
import Text from '../components/base/Text';
import ScreenFrame from '../screens/ScreenFrame';
import { spacing } from '../theme/tokens';
import { inTransaction, openDatabase } from './migrate';

const DatabaseContext = createContext(null);

/** The open, migrated database. Only usable below DatabaseProvider. */
export function useDatabase() {
  const db = useContext(DatabaseContext);
  if (!db) throw new Error('useDatabase() outside <DatabaseProvider>');
  return db;
}

/**
 * Opens the database and runs pending migrations before anything renders.
 * Sits above AppShell (App.js) because storage is app-wide infrastructure,
 * not shell layout: every screen and the Record overlay need it, and nothing
 * works without it, so a failure blocks the whole app instead of surfacing
 * inside one screen. Gating here lets every screen assume a ready database.
 *
 * Opening is local and takes milliseconds, so there is no loading state: the
 * tree simply renders once the database is ready. A failure is shown plainly,
 * never swallowed.
 */
export default function DatabaseProvider({ children }) {
  const [state, setState] = useState({ db: null, error: null });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const db = await openDatabase();
        // Dev reference rows, OPT-IN (2026-10-15): only with
        //   EXPO_PUBLIC_DEV_SEED=1 npx expo start
        // It wrote whenever bags was empty, so a wiped device (dogfood) got the
        // seed back on the next launch. Required inside the branch so
        // production builds drop the seed module entirely.
        if (__DEV__ && process.env.EXPO_PUBLIC_DEV_SEED === '1') {
          const { seedGearStatements, seedReferenceStatements } = require('./dev/seed');
          const row = await db.getFirstAsync('SELECT COUNT(*) AS n FROM bags');
          const gear = await db.getFirstAsync('SELECT COUNT(*) AS n FROM gear');
          const seed = row.n === 0 ? seedReferenceStatements() : gear.n === 0 ? seedGearStatements() : [];
          if (seed.length) {
            await inTransaction(db, async (tx) => {
              for (const s of seed) await tx.runAsync(s.sql, s.params);
            });
          }
        }
        if (!cancelled) setState({ db, error: null });
      } catch (error) {
        console.error('[db] failed to open', error);
        if (!cancelled) setState({ db: null, error });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Checkpoint on the way to the background (2026-10-20). The app is never
  // closed cleanly and the WAL stays far under SQLite's 1000-page auto
  // checkpoint, so the rows lived only in morecoffee.db-wal (the .db stayed a
  // 4 KB header for weeks). iOS backs up all three files together and replays
  // the WAL on restore, so nothing was lost — but folding the WAL in before
  // iOS suspends us (and backs up) leaves morecoffee.db complete on its own.
  // A busy checkpoint just does less; the next one catches up. Busy does not
  // throw: the pragma returns a row (busy, log, checkpointed) with busy = 1,
  // so the row is read (todo.md T-7). Neither failure stops the app.
  useEffect(() => {
    if (!state.db || Platform.OS === 'web') return undefined;
    const db = state.db;
    const sub = AppState.addEventListener('change', (next) => {
      if (next !== 'background') return;
      db.getFirstAsync('PRAGMA wal_checkpoint(TRUNCATE)').then(
        (row) => {
          if (row?.busy) console.error('[db] checkpoint busy', row);
        },
        (error) => console.error('[db] checkpoint failed', error)
      );
    });
    return () => sub.remove();
  }, [state.db]);

  if (state.error) {
    // TODO(design): error states are undesigned (gaps.md 6); this is the
    // plain, honest minimum — say it failed and why.
    return (
      <ScreenFrame title="Can't open your log">
        <View style={styles.body}>
          <Text variant="body" color="secondary">
            The coffee log on this device could not be opened, so nothing can be saved right now.
          </Text>
          <Text variant="bodySm" color="muted">
            {String(state.error?.message ?? state.error)}
          </Text>
        </View>
      </ScreenFrame>
    );
  }

  if (!state.db) return null;

  return <DatabaseContext.Provider value={state.db}>{children}</DatabaseContext.Provider>;
}

const styles = StyleSheet.create({
  body: {
    gap: spacing.gap.row,
  },
});
