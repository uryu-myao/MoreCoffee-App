import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ShelfBlock from '../components/ShelfBlock';
import TasteDnaCard from '../components/TasteDnaCard';
import { useDatabase } from '../data/DatabaseProvider';
import { loadTasteDna, onCupsChanged } from '../data/repository';
import { layout, space } from '../theme/tokens';
import AddBagScreen from './AddBagScreen';
import AddGearScreen from './AddGearScreen';
import MyBeansScreen from './MyBeansScreen';
import ScreenFrame from './ScreenFrame';

/**
 * Home (1b; 4a / 4b are Home with My gear / My beans below). Built: the
 * Taste DNA card and the My gear / My beans block. TODO: the rest of 1b (cups
 * total, this week, recently sipped) is not rebuilt yet.
 *
 * Screens opened from Home replace it in the tab, as 2c does in Records:
 * 3d (Manage my beans), 3c (Add a bag, from the empty beans tab or 3d) and
 * 3a (Add gear, from the empty gear tab). Back returns to where it came from.
 *
 * The profile is computed on read (taste-dna.md item 5) and again whenever a
 * cup is saved.
 */
export default function HomeTabScreen() {
  const db = useDatabase();
  const [dna, setDna] = useState(null);
  // [] = Home; each entry a screen opened on top: 'beans' | 'addBag' | 'addGear'.
  const [stack, setStack] = useState([]);
  const push = (page) => setStack((s) => [...s, page]);
  const back = () => setStack((s) => s.slice(0, -1));

  useEffect(() => {
    const load = () => loadTasteDna(db).then(setDna, (error) => console.error('[home] could not compute taste DNA', error));
    load();
    return onCupsChanged(load);
  }, [db]);

  const top = stack[stack.length - 1];
  if (top === 'beans') return <MyBeansScreen onBack={back} onAddBag={() => push('addBag')} />;
  if (top === 'addBag') return <AddBagScreen onBack={back} />;
  if (top === 'addGear') return <AddGearScreen onBack={back} />;

  return (
    <ScreenFrame scroll title="Home" eyebrow="MoreCoffee">
      <View style={styles.body}>
        {dna ? <TasteDnaCard dna={dna} /> : null}
        <ShelfBlock onManageBeans={() => push('beans')} onAddBag={() => push('addBag')} onAddGear={() => push('addGear')} />
      </View>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  body: {
    // 1b's blocks sit 20 apart (each section's padding-bottom).
    gap: space[20],
    // Room under the last block so the bottom bar never covers it (as 2a).
    paddingBottom: layout.empty.block,
  },
});
