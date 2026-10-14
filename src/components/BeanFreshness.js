import { StyleSheet, View } from 'react-native';
import { FRESHNESS_TUNING, FRESHNESS_WORDS, freshnessOf } from '../data/freshness';
import { component, icon, spacing } from '../theme/tokens';
import Glyph from './base/Glyph';
import Text from './base/Text';

/**
 * beanFreshness (3d's cards, 4b's rows): a clock, the bar and "Day 7 · drink
 * now", from the roast date (data/freshness.ts; a guide, not a prediction).
 *
 * Bar: the track, the peak band (FRESHNESS_TUNING.drinkFrom … drinkUntil of
 * span), the elapsed fill from the left, and the today marker (2 × 14) at
 * its end. Past `span` the fill stays full. Colours by state
 * (component.beanFreshness, Design Round 7 / 14a).
 * Without a roast date nothing is drawn: no day, no state, no bar.
 */
const { drinkFrom, drinkUntil, span } = FRESHNESS_TUNING;
const BAND = { left: `${(drinkFrom / span) * 100}%`, width: `${((drinkUntil - drinkFrom) / span) * 100}%` };
const meter = component.beanFreshness;

export default function BeanFreshness({ roastedAt }) {
  const f = freshnessOf(roastedAt);
  if (!f) return null;
  const tone = meter[f.state];
  const at = `${f.elapsed * 100}%`;
  const label = `Day ${f.day} · ${FRESHNESS_WORDS[f.state]}`;
  return (
    <View style={styles.row} accessible accessibilityLabel={label}>
      <Glyph name="clock" token={icon.sm} color={tone.elapsed} />
      <View style={[styles.track, { backgroundColor: meter.track }]}>
        <View style={[styles.fill, BAND, { backgroundColor: tone.peakBand }]} />
        <View style={[styles.fill, { left: 0, width: at, backgroundColor: tone.elapsed }]} />
        <View style={[styles.marker, { left: at, backgroundColor: tone.todayMarker }]} />
      </View>
      <Text variant="meterLabel" color={tone.label}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.gap.row,
  },
  track: {
    flex: 1,
    height: meter.height,
  },
  fill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
  // Centred on the 4pt track: (14 − 4) / 2 = 5 above it.
  marker: {
    position: 'absolute',
    top: (meter.height - meter.marker.h) / 2,
    width: meter.marker.w,
    height: meter.marker.h,
    marginLeft: -meter.marker.w / 2,
  },
});
