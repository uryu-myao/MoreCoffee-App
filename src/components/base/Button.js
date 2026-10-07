import { useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import { color, icon, motion, shadow, shape, size, space, spacing, state } from '../../theme/tokens';
import Glyph from './Glyph';
import HardShadow from './HardShadow';
import Text from './Text';

/**
 * Button (design-system.md §9 Buttons).
 *
 *   primary    full width: action.bg fill, 2px ink outline, shadow.primary
 *   secondary  full width: same geometry on surface.ground, ink label, no shadow
 *   text       label only (label.caps, ink): no fill, no frame, sized to its
 *              label; the touch area is padded out to size.tapTarget. Added
 *              2026-10-07 for the taste axis "Clear". Having no surface, it
 *              presses by scale (state.pressed.scale over motion.press), §1
 *   disabled   either variant: ground fill, border.muted outline, text.muted
 *              label, no shadow — the border.addSlot.inert vocabulary from 5d
 *   pressed    the fill darkens (state.pressed.action / .surface); outline,
 *              label and shadow stay — Hard Rule, design-system.md §1
 *
 * Optional trailing glyph (5a "Add tasting note →"): icon.sm, gap.row after the
 * label, coloured like the label — onAction on primary, ink on secondary,
 * muted when disabled. 1b's leading-icon form is not built.
 *
 * No loading state, deliberately: saves write to local SQLite and complete
 * instantly. Revisit when real async arrives (Step 5: MapKit, barcode lookup).
 *
 * Props
 *   label     fixed copy
 *   variant   'primary' | 'secondary' | 'text' (default 'primary')
 *   trailingIcon   optional Glyph name drawn after the label
 *   disabled
 *   onPress
 *   testOnly_pressed   force the pressed look (dev harness)
 */
export default function Button(props) {
  if (props.variant === 'text') return <TextButton {...props} />;
  return <FilledButton {...props} />;
}

const pressEasing = Easing.bezier(...motion.press.controlPoints);
// Pads the label's line (label.caps, ~13) out to at least size.tapTarget (44).
const TEXT_HIT_SLOP = { top: space[16], bottom: space[16], left: space[8], right: space[8] };

function TextButton({ label, disabled = false, onPress, accessibilityLabel }) {
  const scale = useRef(new Animated.Value(1)).current;
  const scaleTo = (toValue) =>
    Animated.timing(scale, { toValue, duration: motion.press.duration, easing: pressEasing, useNativeDriver: true }).start();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={disabled ? undefined : () => scaleTo(state.pressed.scale)}
      onPressOut={disabled ? undefined : () => scaleTo(1)}
      hitSlop={TEXT_HIT_SLOP}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Text variant="labelCaps" color={disabled ? 'muted' : 'primary'}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

function FilledButton({
  label,
  variant = 'primary',
  trailingIcon,
  disabled = false,
  onPress,
  testOnly_pressed,
}) {
  const primary = variant === 'primary' && !disabled;
  const labelColor = disabled ? 'muted' : primary ? color.action.fg : 'primary';
  const iconColor = disabled ? color.icon.muted : primary ? color.icon.onAction : color.icon.default;

  return (
    <HardShadow shadow={primary ? shadow.primary : null}>
      <Pressable
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        testOnly_pressed={testOnly_pressed}
        style={({ pressed }) => [
          styles.base,
          primary && styles.primary,
          variant === 'secondary' && styles.secondary,
          disabled && styles.disabled,
          pressed && !disabled && (primary ? styles.primaryPressed : styles.secondaryPressed),
        ]}>
        <View style={styles.content}>
          <Text variant="buttonCaps" color={labelColor} style={styles.label}>
            {label}
          </Text>
          {trailingIcon ? <Glyph name={trailingIcon} token={icon.sm} color={iconColor} /> : null}
        </View>
      </Pressable>
    </HardShadow>
  );
}

const styles = StyleSheet.create({
  base: {
    height: size.button.primary,
    borderWidth: shape.borderWidth.box,
    borderColor: color.border.strong,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.inset.control.h,
  },
  primary: {
    backgroundColor: color.action.bg,
  },
  secondary: {
    backgroundColor: color.surface.ground,
  },
  primaryPressed: {
    backgroundColor: state.pressed.action,
  },
  secondaryPressed: {
    backgroundColor: state.pressed.surface,
  },
  disabled: {
    backgroundColor: color.surface.ground,
    borderColor: color.border.muted,
  },
  content: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.gap.row,
  },
  label: {
    flexShrink: 1,
    textAlign: 'center',
  },
});
