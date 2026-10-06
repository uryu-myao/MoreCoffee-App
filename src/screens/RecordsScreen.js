import { useCallback, useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import RecordRow from '../components/base/RecordRow';
import Text from '../components/base/Text';
import { useDatabase } from '../data/DatabaseProvider';
import { listCups, onCupsChanged } from '../data/repository';
import { layout, spacing } from '../theme/tokens';
import ScreenFrame from './ScreenFrame';

/**
 * Records — 2a, the list of logged cups, newest first, grouped by month.
 * Reads from the database and refreshes whenever a cup is saved.
 *
 * Not built here: search, the category chips, the 2b sort panel, and tapping
 * through to a cup (no detail screen yet).
 *
 * Row content follows the data model, degrading by mode (drift.md D-16):
 *   title   made_it → bean name · barista → drink · packaged → product name
 *   source  made_it → roaster · process · barista → place · packaged → brand
 * The brew-category badge (FILTER / ESPRESSO / COLD BREW) is not shown: it has
 * no column yet (gaps.md 10).
 */
const MODE_BADGE = {
  made_it: { label: 'I made it', tone: 'success' },
  barista: { label: 'Barista', tone: 'info' },
  packaged: { label: 'Packaged', tone: 'neutral' },
};

const NONE = '—';

const countFormat = new Intl.NumberFormat();
const dayFormat = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' });
const monthFormat = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' });

const capitalise = (word) => word.charAt(0).toUpperCase() + word.slice(1);

function toRow(cup) {
  if (cup.mode === 'made_it') {
    return {
      title: cup.bean_name ?? NONE,
      source: [cup.bean_roaster, cup.bean_process && capitalise(cup.bean_process)].filter(Boolean).join(' · ') || undefined,
    };
  }
  if (cup.mode === 'barista') return { title: cup.drink_type ?? NONE, source: cup.place_name ?? undefined };
  return { title: cup.product_name ?? NONE, source: cup.product_brand ?? undefined };
}

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

  return (
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
                  const { title, source } = toRow(cup);
                  return (
                    <RecordRow
                      key={cup.id}
                      title={title}
                      badges={[MODE_BADGE[cup.mode]]}
                      source={source}
                      note={cup.note ?? undefined}
                      rating={cup.rating}
                      date={dayFormat.format(new Date(cup.logged_at))}
                    />
                  );
                })}
              </View>
            ))
          : null}
      </View>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
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
