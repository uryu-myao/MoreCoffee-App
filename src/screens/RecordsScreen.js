import { useCallback, useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import RecordRow from '../components/base/RecordRow';
import Text from '../components/base/Text';
import { useDatabase } from '../data/DatabaseProvider';
import { listCups, onCupsChanged } from '../data/repository';
import { MODE_BADGE, cupTitle } from '../constants/cups';
import { onCloseCupRequest, onOpenCupRequest, onTabReset, requestEditCup } from '../navigation';
import PushedScreen from '../components/PushedScreen';
import { layout, spacing } from '../theme/tokens';
import CupRecordScreen from './CupRecordScreen';
import ScreenFrame from './ScreenFrame';

/**
 * Records — 2a, the list of logged cups, newest first, grouped by month.
 * Reads from the database and refreshes whenever a cup is saved.
 *
 * A row pushes the cup (2c, CupRecordScreen) over the list, which stays
 * mounted: Back, a swipe from the left edge, or the Records icon returns to it.
 * 2c's pencil asks AppShell for 11a (over the bottom bar); a delete there
 * closes the cup here. Not built here: search, the category chips, the 2b sort panel.
 *
 * Row content follows the data model, degrading by mode (drift.md D-16):
 *   title   made_it → bean name · barista → drink · packaged → product name
 *   source  made_it → roaster · process · barista → place · packaged → brand
 * The brew-category badge (FILTER / ESPRESSO / COLD BREW) is not shown: it has
 * no column yet (gaps.md 10).
 */


const countFormat = new Intl.NumberFormat();
const dayFormat = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' });
const monthFormat = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' });

/** Consecutive cups grouped under their month, keeping the newest-first order. */
function groupByMonth(cups) {
  const groups = [];
  for (const cup of cups) {
    const d = new Date(cup.logged_at);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const last = groups[groups.length - 1];
    if (last && last.key === key) last.cups.push(cup);
    else groups.push({ key, label: monthFormat.format(d), cups: [cup] });
  }
  return groups;
}

export default function RecordsScreen() {
  const db = useDatabase();
  const [cups, setCups] = useState(null);
  const [openId, setOpenId] = useState(null);

  const load = useCallback(() => {
    listCups(db).then(setCups, (error) => {
      console.error('[records] could not read cups', error);
      setCups([]);
      Alert.alert("Couldn't read your cups", String(error?.message ?? error));
    });
  }, [db]);

  useEffect(() => {
    load();
    return onCupsChanged(load);
  }, [load]);

  // 5c's "See this record" opens the cup here; the Records icon pressed while
  // a cup is open returns to the list (2026-10-12).
  useEffect(() => onOpenCupRequest(setOpenId), []);
  useEffect(() => onTabReset((tab) => tab === 'records' && setOpenId(null)), []);
  useEffect(() => onCloseCupRequest(() => setOpenId(null)), []);

  return (
    <View style={styles.screen}>
      <ScreenFrame
        scroll
        eyebrow="The archive"
        title="Records"
        // 2a's count: numeral over "Cups". Shown once the cups are read.
        // TODO(i18n): plural rules beyond English's one / other.
        stat={cups ? { value: countFormat.format(cups.length), label: cups.length === 1 ? 'Cup' : 'Cups' } : undefined}>
        <View style={styles.list}>
          {cups && cups.length === 0 ? (
            // TODO(design): no empty state is designed (gaps.md 5); the plainest
            // honest placeholder until one is.
            <Text variant="body" color="muted">
              No cups logged yet.
            </Text>
          ) : null}
          {cups
            ? groupByMonth(cups).map((group) => (
                <View key={group.key}>
                  <View style={styles.month}>
                    <Text variant="labelEyebrow" color="accent">
                      {group.label}
                    </Text>
                    <Text variant="labelEyebrow" color="muted">
                      Newest first
                    </Text>
                  </View>
                  {group.cups.map((cup) => {
                    const { title, source } = cupTitle(cup);
                    return (
                      <RecordRow
                        key={cup.id}
                        title={title}
                        badges={[MODE_BADGE[cup.mode]]}
                        source={source}
                        note={cup.note ?? undefined}
                        rating={cup.rating}
                        date={dayFormat.format(new Date(cup.logged_at))}
                        onPress={() => setOpenId(cup.id)}
                      />
                    );
                  })}
                </View>
              ))
            : null}
        </View>
      </ScreenFrame>
      {openId != null ? (
        <PushedScreen key={openId} onBack={() => setOpenId(null)}>
          {(goBack) => <CupRecordScreen id={openId} onBack={goBack} onEdit={requestEditCup} />}
        </PushedScreen>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  list: {
    // Room under the last row so the bottom bar never covers it (§9 Bottom bar).
    paddingBottom: layout.empty.block,
  },
  month: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.gap.row,
    paddingBottom: spacing.gap.row,
  },
});
