import { useRef } from 'react';
import { Animated, Easing, Pressable } from 'react-native';
import { motion, space, state } from '../../theme/tokens';
import Text from './Text';

/**
 * Inline action (2026-10-20): a text-only action set in text.inlineAction
 * (11 caps, underlined) and color.text.link, beside other text — 5d's
 * "Go to first", 3f's "Reopen bag" (§3 text.inlineAction).
 *
 *   pressed   surface-less, so the text scales to state.pressed.scale over
 *             motion.press (§1 Pressed); the touch area does not shrink
 *   touch     the ~13pt line padded out to size.tapTarget (44) by hitSlop
 *   disabled  inlineActionOff (no underline) in text.muted; no feedback.
 *             Only where the screen shows why (3f: the 5 / 5 line)
 *
 * Props: label, onPress, disabled, accessibilityLabel, style (the press
 * area's placement in its row)
 */
const pressEasing = Easing.bezier(...motion.press.controlPoints);
const HIT_SLOP = { top: space[16], bottom: space[16], left: space[8], right: space[8] };

export default function InlineAction({ label, onPress, disabled = false, accessibilityLabel, style }) {
  const scale = useRef(new Animated.Value(1)).current;
  const scaleTo = (toValue) =>
    Animated.timing(scale, { toValue, duration: motion.press.duration, easing: pressEasing, useNativeDriver: true }).start();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={disabled ? undefined : () => scaleTo(state.pressed.scale)}
      onPressOut={disabled ? undefined : () => scaleTo(1)}
      hitSlop={HIT_SLOP}
      style={style}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      accessibilityLabel={accessibilityLabel}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Text variant={disabled ? 'inlineActionOff' : 'inlineAction'} color={disabled ? 'muted' : 'link'}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}
