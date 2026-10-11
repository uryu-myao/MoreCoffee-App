import { StyleSheet, View } from 'react-native';
import { color, size } from '../../theme/tokens';

/**
 * AxisReadout (design-system.md §9 Taste axis readout): a value on a bipolar
 * axis, read-only — the beanFreshness bar family. 4pt, so it never looks
 * operable like the 5b slider.
 *
 *   track   size.meter.track (4), surface.muted
 *   fill    from 50 to the value (helps only)
 *   marker  size.marker.line (2 × 14) at the value — it carries the value
 *   no ticks, no gradient; at exactly 50 only the marker shows ("balanced")
 *
 * tone (§1 Colour roles: computed = neutral, entered = brown; 2026-10-11):
 *   computed  a value worked out from records (1b / 4a / 4b / 8f, 5c):
 *             fill border.medium (1.67:1), marker text.muted (4.45:1)
 *   entered   a value the user entered for one cup (2c "Where it sat"):
 *             fill icon.accent (the entered slider handle's fill, 4.04:1),
 *             marker border.accent (the selected flavour chip's frame,
 *             5.0:1). Same shape: still read-only.
 *
 * previous (5c): the earlier value, drawn under the current one in
 * border.muted — its fill from 50 and a 2 × 14 border.muted marker (§9).
 * Moving away from 50 the extra current fill is the movement; moving toward
 * 50 the exposed lighter fill is.
 *
 * value null (nothing noted on this axis): the track alone. TODO: no mock
 * draws an axis without a value; asked of Design.
 *
 * Props: value 0–100 or null, tone, previous, accessibilityLabel
 */
const TONES = {
  computed: { fill: color.border.medium, marker: color.text.muted },
  entered: { fill: color.icon.accent, marker: color.border.accent },
};
const GHOST = color.border.muted;

const span = (v) => ({ left: `${Math.min(50, v)}%`, width: `${Math.abs(v - 50)}%` });

export default function AxisReadout({ value, tone = 'computed', previous = null, accessibilityLabel }) {
  const t = TONES[tone];
  const has = value != null;
  return (
    <View style={styles.box} accessible accessibilityLabel={accessibilityLabel}>
      <View style={styles.track}>
        {previous != null ? <View style={[styles.fill, span(previous), { backgroundColor: GHOST }]} /> : null}
        {has ? <View style={[styles.fill, span(value), { backgroundColor: t.fill }]} /> : null}
      </View>
      {previous != null ? <View style={[styles.marker, { left: `${previous}%`, backgroundColor: GHOST }]} /> : null}
      {has ? <View style={[styles.marker, { left: `${value}%`, backgroundColor: t.marker }]} /> : null}
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
  },
  marker: {
    position: 'absolute',
    top: 0,
    width: size.marker.line.w,
    height: size.marker.line.h,
    marginLeft: -size.marker.line.w / 2,
  },
});
