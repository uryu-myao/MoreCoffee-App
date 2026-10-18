import { useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import { TASTE_AXES } from '../constants/tasteAxes';
import { bandOf } from '../data/tasteDna';
import { color, motion, shape, size, space, spacing, state as pressState } from '../theme/tokens';
import AxisReadout from './base/AxisReadout';
import Badge from './base/Badge';
import Text from './base/Text';

/**
 * Taste DNA card (1b / 4a / 4b: Home, the same card on all three; the card
 * itself is not pressable). From the mock: "My taste DNA" (display.sm,
 * accent) with the state's stamp beside it, the header row centred, then the
 * four axes — pole labels over an AxisReadout (§9; replaces the mock's dashed
 * display rail and needle).
 *
 * State, one for the whole profile (taste-dna.md item 4, option B):
 *   early   "Early signs" — Badge accent (the mock's #F1E3D6 / #8A4602; its
 *           1.5px border is left out: a Badge has none, §9)
 *   locked  "Locked in" — Badge selected (6a / 8f)
 *   none    no stamp: nothing noted yet
 * The stamp is a button (DnaStamp, 15a): it opens 15b's info sheet.
 * No line under the title (Design Round 8, 2026-10-17): what it said moved
 * into the sheet's progress box (DnaInfoSheet).
 * The mock's footer "3 of 5 cups" is Try next's progress (V2): not shown.
 *
 * All four axes always show (Design 10b, option A, decided 2026-10-12): an
 * axis with nothing noted is AxisReadout's empty track with "Not noted yet"
 * on it, never a value of 50. The card's height never depends on what has
 * been noted (design-system.md §9 Taste axis readout).
 */
const pressEasing = Easing.bezier(...motion.press.controlPoints);

/**
 * The profile's state as a stamp that explains itself (15a, Design Round 8):
 * the Badge with an ⓘ, upright (no rotation.sticker: a tilt reads as
 * decoration, a straight shape as a control). Shared with 5c; none: nothing.
 *
 * Hit area: a transparent wrapper size.tapTarget (44) tall, 6 either side,
 * pulled back by -6 on the top, right and bottom so the stamp stays where it
 * was. Pressed: the stamp scales (§1: its visible box is under 44).
 * Not for a status chip inside a card that is itself a link (Profile, 6):
 * that one stays a plain Badge, so there is no button in a button.
 */
export function DnaStamp({ state, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  if (state === 'none') return null;
  const label = state === 'locked' ? 'Locked in' : 'Early signs';
  const scaleTo = (toValue) =>
    Animated.timing(scale, { toValue, duration: motion.press.duration, easing: pressEasing, useNativeDriver: true }).start();
  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => scaleTo(pressState.pressed.scale)}
      onPressOut={() => scaleTo(1)}
      style={styles.stampHit}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint="Explains your taste DNA">
      <Animated.View style={{ transform: [{ scale }] }}>
        <Badge label={label} tone={state === 'locked' ? 'selected' : 'accent'} placement="standalone" icon="info" />
      </Animated.View>
    </Pressable>
  );
}

/**
 * Props
 *   dna            the profile (loadTasteDna)
 *   onStampPress   the stamp: open 15b's sheet
 */
export default function TasteDnaCard({ dna, onStampPress }) {
  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <Text variant="displaySm" color="accent" style={styles.title}>
          My taste DNA
        </Text>
        <DnaStamp state={dna.state} onPress={onStampPress} />
      </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.gap.section,
  },
  title: {
    flex: 1,
  },
  stampHit: {
    height: size.tapTarget,
    justifyContent: 'center',
    paddingHorizontal: space[6],
    marginTop: -space[6],
    marginRight: -space[6],
    marginBottom: -space[6],
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
});
