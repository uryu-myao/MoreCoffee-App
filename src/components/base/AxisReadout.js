import { StyleSheet, View } from 'react-native';
import { color, size, space, textStyle } from '../../theme/tokens';
import Text from './Text';

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
 * value null (nothing noted on this axis; Design 10b, decided 2026-10-12):
 * the bare track with "Not noted yet" centred on it, on a surface.raised
 * patch padded space.8 each side. The words follow the tone (2026-10-14,
 * Uryu): "Not noted yet" on a profile (computed: a later cup can still note
 * it); "Not noted" on one cup's own values (entered: 2c, 11a — that cup's
 * axes can't change, so "yet" promises something that won't come). — readable, and the gap in the bar reads as
 * "no value", never as "balanced". Every readout sits in a 17pt slot (meta's
 * line height) with the track centred, so filled and empty rows are the same
 * height and a card of readouts never changes height. Shown on raised cards
 * (Taste DNA card, 2c), which the patch matches.
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
  const emptyWords = tone === 'entered' ? 'Not noted' : 'Not noted yet';
  return (
    <View style={styles.box} accessible accessibilityLabel={accessibilityLabel}>
      <View style={styles.track}>
        {previous != null ? <View style={[styles.fill, span(previous), { backgroundColor: GHOST }]} /> : null}
        {has ? <View style={[styles.fill, span(value), { backgroundColor: t.fill }]} /> : null}
      </View>
      {previous != null ? <View style={[styles.marker, { left: `${previous}%`, backgroundColor: GHOST }]} /> : null}
      {has ? <View style={[styles.marker, { left: `${value}%`, backgroundColor: t.marker }]} /> : null}
      {has ? null : (
        <View style={styles.emptyLabel} pointerEvents="none">
          <Text variant="meta" color="muted" style={styles.patch}>
            {emptyWords}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    // meta's line height: the slot an empty row's label needs, kept by every row.
    height: textStyle.meta.lineHeight,
    justifyContent: 'center',
  },
  emptyLabel: {
    // RN 0.86 has no absoluteFillObject (see AddCoffeeOverlay).
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  patch: {
    backgroundColor: color.surface.raised,
    paddingHorizontal: space[8],
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
    top: (textStyle.meta.lineHeight - size.marker.line.h) / 2,
    width: size.marker.line.w,
    height: size.marker.line.h,
    marginLeft: -size.marker.line.w / 2,
  },
});
