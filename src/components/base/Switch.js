import { Pressable, StyleSheet, View } from 'react-native';
import { color, shape, size, space, state } from '../../theme/tokens';

/**
 * Toggle switch (components.md #9; 8i 8j 8m, 3e at D-20's size; 2026-10-22,
 * first built for 3e). size.switch: a 52 × 30 track, 2px frame, inset 2, a
 * square knob 22 in its own 2px frame.
 *
 *   on   track color.action.bg (§1 Colour roles: blue = in force), ink frames,
 *        knob at the end
 *   off  track surface.sunken, border.muted frames, knob at the start
 *   pressed  the knob fills with state.pressed.surface
 *
 * Moves at once (no animation drawn). The 30pt track sits in a 44pt touch
 * area (size.tapTarget) through hitSlop.
 *
 * Props: value, onValueChange, accessibilityLabel, disabled
 */
const SLOP = (size.tapTarget - size.switch.h) / 2;

export default function Switch({ value, onValueChange, accessibilityLabel, disabled = false }) {
  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      disabled={disabled}
      hitSlop={{ top: SLOP, bottom: SLOP, left: space[8], right: space[8] }}
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value, disabled }}
      style={[styles.track, value ? styles.trackOn : styles.trackOff]}>
      {({ pressed }) => <View style={[styles.knob, value ? styles.knobOn : styles.knobOff, pressed && styles.knobPressed]} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: size.switch.w,
    height: size.switch.h,
    borderWidth: shape.borderWidth.box,
    padding: size.switch.inset,
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackOn: {
    borderColor: color.border.strong,
    backgroundColor: color.action.bg,
    justifyContent: 'flex-end',
  },
  trackOff: {
    borderColor: color.border.muted,
    backgroundColor: color.surface.sunken,
    justifyContent: 'flex-start',
  },
  knob: {
    width: size.switch.knob,
    height: size.switch.knob,
    borderWidth: shape.borderWidth.box,
    backgroundColor: color.surface.raised,
  },
  knobOn: {
    borderColor: color.border.strong,
  },
  knobOff: {
    borderColor: color.border.muted,
  },
  knobPressed: {
    backgroundColor: state.pressed.surface,
  },
});
