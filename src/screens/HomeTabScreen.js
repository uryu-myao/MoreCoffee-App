import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import TasteDnaCard from '../components/TasteDnaCard';
import { useDatabase } from '../data/DatabaseProvider';
import { loadTasteDna, onCupsChanged } from '../data/repository';
import { spacing } from '../theme/tokens';
import ScreenFrame from './ScreenFrame';

/**
 * Home (1b; 4a / 4b are Home with My gear / My beans below). Stage 3 builds
 * the Taste DNA card only. TODO: the rest of 1b (cup counts, this week,
 * recently sipped, My gear / My beans) is not rebuilt yet.
 *
 * The profile is computed on read (taste-dna.md item 5) and again whenever a
 * cup is saved.
 */
export default function HomeTabScreen() {
  const db = useDatabase();
  const [dna, setDna] = useState(null);

  useEffect(() => {
    const load = () => loadTasteDna(db).then(setDna, (error) => console.error('[home] could not compute taste DNA', error));
    load();
    return onCupsChanged(load);
  }, [db]);

  return (
    <ScreenFrame scroll title="Home" eyebrow="MoreCoffee">
      <View style={styles.body}>{dna ? <TasteDnaCard dna={dna} /> : null}</View>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: spacing.gap.section,
  },
});
