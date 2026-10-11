import { StyleSheet, View } from 'react-native';
import { color, size } from '../../theme/tokens';

/**
 * AxisReadout (design-system.md §9 Taste axis readout): a computed value on a
 * bipolar axis, read-only — the beanFreshness bar family. Not operable, so it
 * never looks like the 5b slider; neutral colours (§1: computed = neutral).
 *
 *   track   size.meter.track (4), surface.muted
 *   fill    from 50 to the value, border.medium (helps only: 1.67:1)
 *   marker  size.marker.line (2 × 14), text.muted, at the value — it carries
 *           the value (4.45:1 on the track)
 *   no ticks, no gradient; at exactly 50 only the marker shows ("balanced")
 *
 * value null (nothing noted on this axis): the track alone, no fill and no
 * marker. TODO: no mock draws an axis without a value (all show four values);
 * to be shown to Design.
 *
 * Props: value 0–100 or null, accessibilityLabel
 */
export default function AxisReadout({ value, accessibilityLabel }) {
  const has = value != null;
  const lo = has ? Math.min(50, value) : 50;
  const hi = has ? Math.max(50, value) : 50;
  return (
    <View style={styles.box} accessible accessibilityLabel={accessibilityLabel}>
      <View style={styles.track}>
        {has ? <View style={[styles.fill, { left: `${lo}%`, width: `${hi - lo}%` }]} /> : null}
      </View>
      {has ? <View style={[styles.marker, { left: `${value}%` }]} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    height: size.marker.line.h,
    justifyContent: 'center',
  },
  track: {
    height: size.meter.track,
    backgroundColor: color.surface.muted,
  },
  fill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: color.border.medium,
  },
  marker: {
    position: 'absolute',
    top: 0,
    width: size.marker.line.w,
    height: size.marker.line.h,
    marginLeft: -size.marker.line.w / 2,
    backgroundColor: color.text.muted,
  },
});
