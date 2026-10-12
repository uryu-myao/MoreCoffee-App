import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Button from '../components/base/Button';
import RecordRow from '../components/base/RecordRow';
import Text from '../components/base/Text';
import HomeStats, { weekStart } from '../components/HomeStats';
import ShelfBlock from '../components/ShelfBlock';
import TasteDnaCard from '../components/TasteDnaCard';
import { MODE_BADGE, cupTitle } from '../constants/cups';
import { partOfDay } from '../constants/dates';
import { useDatabase } from '../data/DatabaseProvider';
import { countCups, cupTimesSince, listCups, loadTasteDna, onCupsChanged } from '../data/repository';
import { requestOpenCup, requestShell } from '../navigation';
import { layout, space, spacing } from '../theme/tokens';
import AddBagScreen from './AddBagScreen';
import AddGearScreen from './AddGearScreen';
import MyBeansScreen from './MyBeansScreen';
import ScreenFrame from './ScreenFrame';

/**
 * Home (1b; 4a / 4b are Home with My gear / My beans below), top to bottom:
 *   - title: a greeting by part of day — 1b's "Good morning"; "Good
 *     afternoon" / "Good evening" are ours (TODO(copy): Design); eyebrow
 *     "MoreCoffee"
 *   - HomeStats: cups total, this week (count + strip)
 *   - "Record a coffee" (primary) → the Record sheet, as the bar's +
 *   - the Taste DNA card
 *   - "Recently sipped" (display.sm) with "See all" (→ Records) and the three
 *     latest cups as list rows (title, mode badge, rating, date) → their 2c
 *   - My gear / My beans
 * Not shown: Try next's box (V2), the line under the counts (no rule yet).
 *
 * Screens opened from Home replace it in the tab, as 2c does in Records:
 * 3d (Manage my beans), 3c (Add a bag) and 3a (Add gear). Back returns.
 * Everything is read on open and again whenever a cup is saved.
 */
const GREETING = { Morning: 'Good morning', Afternoon: 'Good afternoon', Evening: 'Good evening', Night: 'Good evening' };
const dayFormat = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' });

export default function HomeTabScreen() {
  const db = useDatabase();
  const [data, setData] = useState(null);
  // [] = Home; each entry a screen opened on top: 'beans' | 'addBag' | 'addGear'.
  const [stack, setStack] = useState([]);
  const push = (page) => setStack((s) => [...s, page]);
  const back = () => setStack((s) => s.slice(0, -1));

  useEffect(() => {
    const load = () => {
      const now = Date.now();
      Promise.all([loadTasteDna(db), countCups(db), cupTimesSince(db, weekStart(now)), listCups(db)]).then(
        ([dna, total, week, cups]) => setData({ dna, total, week, recent: cups.slice(0, 3), now }),
        (error) => console.error('[home] could not read', error)
      );
    };
    load();
    return onCupsChanged(load);
  }, [db]);

  const top = stack[stack.length - 1];
  if (top === 'beans') return <MyBeansScreen onBack={back} onAddBag={() => push('addBag')} />;
  if (top === 'addBag') return <AddBagScreen onBack={back} />;
  if (top === 'addGear') return <AddGearScreen onBack={back} />;

  const greeting = GREETING[partOfDay(new Date(data?.now ?? Date.now()))];
  return (
    <ScreenFrame scroll title={greeting} eyebrow="MoreCoffee">
      {data ? (
        <View style={styles.body}>
          <HomeStats total={data.total} cupTimes={data.week} now={data.now} />
          <Button label="Record a coffee" onPress={() => requestShell({ record: true })} />
          <TasteDnaCard dna={data.dna} />
          {data.recent.length ? (
            <View>
              <View style={styles.recentHead}>
                <Text variant="displaySm" color="primary">
                  Recently sipped
                </Text>
                <Button size="row" label="See all" trailingIcon="arrowRight" onPress={() => requestShell({ tab: 'records' })} />
              </View>
              {data.recent.map((cup) => (
                <RecordRow
                  key={cup.id}
                  title={cupTitle(cup).title}
                  badges={[MODE_BADGE[cup.mode]]}
                  rating={cup.rating}
                  date={dayFormat.format(new Date(cup.logged_at))}
                  onPress={() => {
                    requestShell({ tab: 'records' });
                    requestOpenCup(cup.id);
                  }}
                />
              ))}
            </View>
          ) : null}
          <ShelfBlock onManageBeans={() => push('beans')} onAddBag={() => push('addBag')} onAddGear={() => push('addGear')} />
        </View>
      ) : null}
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
  recentHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.gap.section,
    paddingBottom: space[14],
  },
});
