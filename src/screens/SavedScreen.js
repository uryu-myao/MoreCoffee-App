import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import AxisReadout from '../components/base/AxisReadout';
import Button from '../components/base/Button';
import Text from '../components/base/Text';
import { NOTHING_MOVED, changeLines, changeSummary } from '../components/DnaChangeLines';
import { DnaStateBadge } from '../components/TasteDnaCard';
import { TASTE_AXES } from '../constants/tasteAxes';
import { useDatabase } from '../data/DatabaseProvider';
import { cupOrdinal, getCup, loadTasteDna } from '../data/repository';
import { color, motion, shape, size, spacing } from '../theme/tokens';
import ScreenFrame from './ScreenFrame';

/**
 * 5c — Saved: what the cup changed. Shown in the Record sheet right after a
 * save (over the steps, fading in over motion.expand), until one of its two
 * buttons closes the sheet.
 *
 * From the mock: eyebrow "Cup N · logged HH:MM", title "Noted.", then the
 * Taste DNA card — "My taste DNA" with the profile's state sticker, the moved
 * axes, each an AxisReadout (computed: §9's ghost at the profile's value
 * before, the value after; both neutral, decided 2026-10-11) with its line
 * under it. Read from the cup's stored dna_change, never recomputed.
 *   - only axes that moved (rounding to >= 1 point) or got their first value,
 *     largest first (DnaChangeLines); nothing moved: Design's line
 *   - "Where it sat before": the legend for the ghost, when there is one
 *   - the summary sentence, under the title: "This cup pushed you ‹phrases›."
 *     (moved axes only; Design's phrase table, design-missing.md 12)
 *   - Try next's "4 of 5 cups" and "One more cup and Try next opens up" are
 *     V2: not shown
 * Buttons: "Back to home" (primary) and "See this record" (secondary → 2c).
 */
const expandEasing = Easing.bezier(...motion.expand.controlPoints);
const timeFormat = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });

export default function SavedScreen({ id, onHome, onSeeRecord }) {
  const db = useDatabase();
  const [data, setData] = useState(null);
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let alive = true;
    Promise.all([getCup(db, id), cupOrdinal(db, id), loadTasteDna(db)]).then(
      ([cup, n, dna]) => alive && setData({ cup, n, dna }),
      (error) => console.error('[5c] could not read the saved cup', error)
    );
    Animated.timing(fade, { toValue: 1, duration: motion.expand.duration, easing: expandEasing, useNativeDriver: true }).start();
    return () => {
      alive = false;
    };
  }, [db, id, fade]);

  const change = data?.cup?.dna_change ? JSON.parse(data.cup.dna_change) : null;
  const lines = changeLines(change);
  const anyBefore = lines.some((l) => change.before[l.key]?.value != null);
  const summary = changeSummary(lines);

  return (
    <Animated.View style={[styles.fill, { opacity: fade }]}>
      {data ? (
        <ScreenFrame
          scroll
          eyebrow={`Cup ${data.n} · logged ${timeFormat.format(new Date(data.cup.logged_at))}`}
          title="Noted."
          footer={
            <>
              <Button label="Back to home" onPress={onHome} />
              <Button variant="secondary" label="See this record" onPress={onSeeRecord} />
            </>
          }>
          <View style={styles.card}>
            <View style={styles.head}>
              <Text variant="displaySm" color="accent" style={styles.title}>
                My taste DNA
              </Text>
              <DnaStateBadge state={data.dna.state} />
            </View>
            {summary ? (
              <Text variant="body" color="muted">
                {summary}
              </Text>
            ) : null}
            {anyBefore ? (
              <View style={styles.legend}>
                <View style={styles.legendMark} />
                <Text variant="meta" color="muted">
                  Where it sat before
                </Text>
              </View>
            ) : null}
            {lines.length ? (
              <View style={styles.axes}>
                {lines.map((l) => {
                  const axis = TASTE_AXES.find((a) => a.key === l.key);
                  return (
                    <View key={l.key} style={styles.axis}>
                      <View style={styles.poles}>
                        <Text variant="labelCaps" color="muted">
                          {axis.from}
                        </Text>
                        <Text variant="labelCaps" color="muted">
                          {axis.to}
                        </Text>
                      </View>
                      <AxisReadout
                        value={change.after[l.key].value}
                        previous={change.before[l.key]?.value ?? null}
                        accessibilityLabel={`${axis.from} to ${axis.to}. ${l.text}`}
                      />
                      <Text variant="meta" color="accent">
                        {l.text}
                      </Text>
                    </View>
                  );
                })}
              </View>
            ) : (
              <Text variant="body" color="muted">
                {NOTHING_MOVED}
              </Text>
            )}
          </View>
        </ScreenFrame>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  card: {
    borderWidth: shape.borderWidth.box,
    borderColor: color.border.strong,
    backgroundColor: color.surface.raised,
    paddingVertical: spacing.inset.container.v,
    paddingHorizontal: spacing.inset.container.h,
    gap: spacing.gap.section,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.gap.section,
  },
  title: {
    flex: 1,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.gap.row,
  },
  // The ghost marker itself (§9: 2 × 14, border.muted), as the legend's key.
  legendMark: {
    width: size.marker.line.w,
    height: size.marker.line.h,
    backgroundColor: color.border.muted,
  },
  axes: {
    gap: spacing.gap.axis,
  },
  axis: {
    gap: spacing.gap.row,
  },
  poles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
