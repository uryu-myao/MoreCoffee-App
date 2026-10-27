import { useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet } from 'react-native';
import { color, icon, motion, size, state } from '../../theme/tokens';
import Glyph from './Glyph';

/**
 * Clear (2026-10-17, ours; no mock): the × at the right end of a one-line
 * text field while it holds text (BagForm's fields, SearchField). A press
 * empties the field.
 *
 *   glyph    close, icon.sm, icon.muted: a secondary action, quieter than
 *            the ink value beside it
 *   touch    a size.tapTarget (44) square, pulled back by the glyph's
 *            inset on the right, so the glyph's right edge sits on the
 *            field's own edge (BagForm: the underline's end; SearchField:
 *            its padding, mirroring the search glyph)
 *   pressed  surface-less, so the glyph scales (§1 Pressed)
 *
 * Props: onPress, accessibilityLabel (default "Clear")
 */
const pressEasing = Easing.bezier(...motion.press.controlPoints);
const INSET = (size.tapTarget - icon.sm.size) / 2;

export default function ClearButton({ onPress, accessibilityLabel = 'Clear' }) {
  const scale = useRef(new Animated.Value(1)).current;
  const scaleTo = (toValue) =>
    Animated.timing(scale, { toValue, duration: motion.press.duration, easing: pressEasing, useNativeDriver: true }).start();
  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => scaleTo(state.pressed.scale)}
      onPressOut={() => scaleTo(1)}
      style={styles.hit}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Glyph name="close" token={icon.sm} color={color.icon.muted} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: {
    width: size.tapTarget,
    height: size.tapTarget,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -INSET,
  },
});
