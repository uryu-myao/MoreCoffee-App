import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Button from '../components/base/Button';
import RecordRow from '../components/base/RecordRow';
import Text from '../components/base/Text';
import HomeStats, { weekStart } from '../components/HomeStats';
import ShelfBlock from '../components/ShelfBlock';
import TasteDnaCard from '../components/TasteDnaCard';
import { MODE_BADGE, cupTitle } from '../constants/cups';
import { useDatabase } from '../data/DatabaseProvider';
import { countCups, cupTimesSince, listCups, loadTasteDna, onCupsChanged } from '../data/repository';
import { requestDnaInfo, requestOpenCup, requestPush, requestShell } from '../navigation';
import { layout, space, spacing } from '../theme/tokens';
import ScreenFrame from './ScreenFrame';

/**
 * Home (1b; 4a / 4b are Home with My gear / My beans below), top to bottom:
 *   - title: a greeting by part of day — 1b's "Good morning"; "Good
 *     afternoon" / "Good evening" ours, confirmed (Design Round 7); eyebrow
 *     "MoreCoffee"
 *   - HomeStats: cups total, this week (count + strip)
 *   - "Record a coffee" (primary) → the Record sheet, as the bar's +
 *   - the Taste DNA card; its stamp opens 15b's sheet (over the bar, so
 *     AppShell hosts it: DnaInfoHost)
 *   - "Recently sipped" (display.sm) with "See all" (→ Records) and the three
 *     latest cups as list rows (title, mode badge, rating, date) → their 2c
 *   - My gear / My beans
 * Not shown: Try next's box (V2), the line under the counts (no rule yet).
 *
 * Screens opened from Home — 3d (Manage my beans), 3c (Add a bag), 3a (Add
 * gear) — are pushed over Home and the bottom bar (ShellStack; their mocks
 * draw no bar). Back or a swipe from the left edge returns.
 * Everything is read on open and again whenever a cup is saved.
 */
/**
 * The greeting by the hour (Design Round 7, 16): morning before 12:00,
 * afternoon 12:00–17:59, evening from 18:00 and through the night. Its own
 * split, not partOfDay's (the cup's daypart words keep theirs).
 */
function greetingAt(date) {
  const h = date.getHours();
  if (h >= 18 || h < 5) return 'Good evening';
  return h < 12 ? 'Good morning' : 'Good afternoon';
}
const dayFormat = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' });

export default function HomeTabScreen() {
  const db = useDatabase();
  const [data, setData] = useState(null);
  const push = (name) => requestPush({ name });

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


  const greeting = greetingAt(new Date(data?.now ?? Date.now()));
  return (
    <View style={styles.screen}>
      <ScreenFrame scroll title={greeting} eyebrow="MoreCoffee">
        {data ? (
          <View style={styles.body}>
            <HomeStats total={data.total} cupTimes={data.week} now={data.now} />
            <Button label="Record a coffee" onPress={() => requestShell({ record: true })} />
            <TasteDnaCard dna={data.dna} onStampPress={() => requestDnaInfo(data.dna)} />
            {data.recent.length ? (
              <View>
                <View style={styles.recentHead}>
                  <Text variant="displaySm" color="primary">
                    Recently sipped
                  </Text>
                  <View style={styles.seeAll}>
                    <Button variant="text" label="See all" trailingIcon="arrowRight" onPress={() => requestShell({ tab: 'records' })} />
                  </View>
                </View>
                {data.recent.map((cup, i) => (
                  <RecordRow
                    key={cup.id}
                    first={i === 0}
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
            <ShelfBlock onManageBeans={() => push('beans')} onManageGear={() => push('gear')} onAddBag={() => push('addBag')} onAddGear={() => push('addGear')} />
          </View>
        ) : null}
      </ScreenFrame>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
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
  // Optical (on device, 2026-10-18): centred on the title's box, the caps
  // read high beside a mostly lowercase serif. Its cap centre sits 0.5 under
  // the title's cap centre but 2.7 over its x-height centre (Instrument Serif
  // 30, iOS natural box: 18.9 / 22.1 from the top); space.2 lowers it between
  // the two, near the x-height.
  seeAll: {
    transform: [{ translateY: space[2] }],
  },
});
