import { createContext, useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
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
        if (__DEV__) {
          // Dev-only reference rows on first run. Required inside the __DEV__
          // branch so production builds drop the seed module entirely.
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
