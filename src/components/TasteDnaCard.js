import { StyleSheet, View } from 'react-native';
import { TASTE_AXES } from '../constants/tasteAxes';
import { DNA_TUNING, bandOf } from '../data/tasteDna';
import { color, rotation, shape, spacing } from '../theme/tokens';
import AxisReadout from './base/AxisReadout';
import Badge from './base/Badge';
import Text from './base/Text';

/**
 * Taste DNA card (1b / 4a / 4b: Home, the same card on all three; not
 * pressable). From the mock: "My taste DNA" (display.sm, accent) with the
 * state as a tilted sticker badge beside it, one line under it, then the four
 * axes — pole labels over an AxisReadout (§9; replaces the mock's dashed
 * display rail and needle).
 *
 * State, one for the whole profile (taste-dna.md item 4, option B):
 *   early   "Early signs" — Badge accent (the mock's #F1E3D6 / #8A4602; its
 *           1.5px border is left out: a Badge has none, §9)
 *   locked  "Locked in" — Badge selected (6a / 8f)
 *   none    no badge: nothing noted yet
 * The mock's footer "3 of 5 cups" is Try next's progress (V2): not shown.
 *
 * An axis with nothing noted shows its empty track and "Not noted" (5b's
 * word for an untouched axis), never a value of 50.
 *
 * TODO(copy, PROVISIONAL): the line under the title (Design: D-47).
 */
const PROVISIONAL_LINE = {
  none: 'Note what you taste on a cup to start it.', // PROVISIONAL
  early: (n) => `${n} more ${n === 1 ? 'cup' : 'cups'} to lock it in.`, // PROVISIONAL: counts the least-noted axis (D-47)
  locked: (cups) => `From ${cups} ${cups === 1 ? 'cup' : 'cups'}.`, // PROVISIONAL: 8f's "From 147 cups"
};

export default function TasteDnaCard({ dna }) {
  const line =
    dna.state === 'none'
      ? PROVISIONAL_LINE.none
      : dna.state === 'early'
        ? PROVISIONAL_LINE.early(DNA_TUNING.lockIn - dna.fewest)
        : PROVISIONAL_LINE.locked(dna.cups);
  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <Text variant="displaySm" color="accent" style={styles.title}>
          My taste DNA
        </Text>
        {dna.state === 'none' ? null : (
          <View style={styles.sticker}>
            <Badge label={dna.state === 'locked' ? 'Locked in' : 'Early signs'} tone={dna.state === 'locked' ? 'selected' : 'accent'} placement="standalone" />
          </View>
        )}
      </View>
      <Text variant="body" color="muted">
        {line}
      </Text>
      <View style={styles.axes}>
        {TASTE_AXES.map((axis) => {
          const value = dna.axes[axis.key].value;
          const band = value == null ? null : axis.steps[bandOf(value)];
          return (
            <View key={axis.key} style={styles.axis}>
              <View style={styles.poles}>
                <Text variant="labelCaps" color="muted">
                  {axis.from}
                </Text>
                <Text variant="labelCaps" color="muted">
                  {axis.to}
                </Text>
              </View>
              <AxisReadout value={value} accessibilityLabel={`${axis.from} to ${axis.to}, ${band ?? 'not noted'}`} />
              {value == null ? (
                <Text variant="meta" color="muted" style={styles.notNoted}>
                  Not noted
                </Text>
              ) : null}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: shape.borderWidth.box,
    borderColor: color.border.strong,
    backgroundColor: color.surface.raised,
    paddingVertical: spacing.inset.container.v,
    paddingHorizontal: spacing.inset.container.h,
    gap: spacing.gap.row,
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
  sticker: {
    transform: [{ rotate: `${rotation.sticker}deg` }],
  },
  axes: {
    marginTop: spacing.gap.section,
    gap: spacing.gap.axis,
  },
  axis: {
    gap: spacing.gap.row,
  },
  poles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  notNoted: {
    alignSelf: 'flex-end',
  },
});
