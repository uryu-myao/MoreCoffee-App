import * as Haptics from 'expo-haptics';
import { useRef } from 'react';
import { Animated, Easing, Platform, Pressable, StyleSheet, View } from 'react-native';
import { color, icon, motion, shadow, shape, size, space, spacing, state } from '../../theme/tokens';
import Glyph from './Glyph';
import HardShadow from './HardShadow';
import Text from './Text';

/**
 * Button (design-system.md §9 Buttons).
 *
 *   primary    full width: action.bg fill, 2px ink outline, shadow.primary
 *   secondary  full width: same geometry on surface.ground, ink label, no shadow
 *   text       label only (label.caps, ink, underlined — §1: a text-only
 *              action is underlined): no fill, no frame, sized to its
 *              label; the touch area is padded out to size.tapTarget. Added
 *              2026-10-07 for the taste axis "Clear". Having no surface, it
 *              presses by scale (state.pressed.scale over motion.press), §1.
 *              small: `meta` as written, not caps, UNDERLINED — the taste axis
 *              Clear, set like the "Not noted" it replaces (2026-10-09; was
 *              label.eyebrow). The underline is §1's "a text-only action is
 *              underlined" (the means text.inlineAction defines); colour
 *              alone never marks pressable.
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
 *   size      'full' (default, 56) | 'row' (44, size.button.row: an action
 *             inside a card's strip, 3d "Finish bag"; label.caps). §9 Buttons.
 *   warnWhenDisabled  a press while disabled gives the warning haptic (§1
 *             Haptics). Only where the screen already shows why the button
 *             is off (decided 2026-10-11); otherwise leave it false and show
 *             the reason first. Still no visual press feedback.
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
// small (the taste axis Clear): meta's 17pt line + 8 + 20 = 45. Most of the
// reach goes down: the track sits gap.tight (4) above, so a top of 8 reaches
// only 4pt into it; 20 below ends where the next axis begins (gap.axis).
const SMALL_HIT_SLOP = { top: space[8], bottom: space[20], left: space[8], right: space[8] };

function TextButton({ label, small = false, disabled = false, onPress, accessibilityLabel }) {
  const scale = useRef(new Animated.Value(1)).current;
  const scaleTo = (toValue) =>
    Animated.timing(scale, { toValue, duration: motion.press.duration, easing: pressEasing, useNativeDriver: true }).start();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={disabled ? undefined : () => scaleTo(state.pressed.scale)}
      onPressOut={disabled ? undefined : () => scaleTo(1)}
      hitSlop={small ? SMALL_HIT_SLOP : TEXT_HIT_SLOP}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Text variant={small ? 'meta' : 'labelCaps'} color={disabled ? 'muted' : 'primary'} style={styles.underline}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const warnDisabled = () => {
  if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
};

function FilledButton({
  label,
  variant = 'primary',
  trailingIcon,
  disabled = false,
  warnWhenDisabled = false,
  size: buttonSize = 'full',
  onPress,
  testOnly_pressed,
}) {
  const row = buttonSize === 'row';
  const warns = disabled && warnWhenDisabled;
  const primary = variant === 'primary' && !disabled;
  const labelColor = disabled ? 'muted' : primary ? color.action.fg : 'primary';
  const iconColor = disabled ? color.icon.muted : primary ? color.icon.onAction : color.icon.default;

  return (
    {/* Row size has no hard shadow (1b's See all, 2026-10-12). */}
    <HardShadow shadow={primary && !row ? shadow.primary : null}>
      <Pressable
        onPress={warns ? warnDisabled : onPress}
        disabled={disabled && !warns}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        testOnly_pressed={testOnly_pressed}
        style={({ pressed }) => [
          styles.base,
          row && styles.row,
          primary && styles.primary,
          variant === 'secondary' && styles.secondary,
          disabled && styles.disabled,
          pressed && !disabled && (primary ? styles.primaryPressed : styles.secondaryPressed),
        ]}>
        <View style={styles.content}>
          <Text variant={row ? 'labelCaps' : 'buttonCaps'} color={labelColor} style={styles.label}>
            {label}
          </Text>
          {trailingIcon ? <Glyph name={trailingIcon} token={icon.sm} color={iconColor} /> : null}
        </View>
      </Pressable>
    </HardShadow>
  );
}

const styles = StyleSheet.create({
  /** §1: a text-only action is underlined; colour alone never marks pressable. */
  underline: {
    textDecorationLine: 'underline',
  },
  base: {
    height: size.button.primary,
    borderWidth: shape.borderWidth.box,
    borderColor: color.border.strong,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.inset.control.h,
  },
  row: {
    height: size.button.row,
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
