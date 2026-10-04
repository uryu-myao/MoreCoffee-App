import { Pressable, StyleSheet, View } from 'react-native';
import { color, shadow, shape, size, spacing, state } from '../../theme/tokens';
import HardShadow from './HardShadow';
import Text from './Text';

/**
 * Full-width button (design-system.md §9 Buttons).
 *
 *   primary    action.bg fill, 2px ink outline, shadow.primary
 *   secondary  same geometry on surface.ground, ink label, no shadow
 *   disabled   either variant: ground fill, border.muted outline, text.muted
 *              label, no shadow — the border.empty.disabled vocabulary from 5d
 *   pressed    the fill darkens (state.pressed.action / .surface); outline,
 *              label and shadow stay — Hard Rule, design-system.md §1
 *
 * No loading state, deliberately: saves write to local SQLite and complete
 * instantly. Revisit when real async arrives (Step 5: MapKit, barcode lookup).
 *
 * Props
 *   label     fixed copy
 *   variant   'primary' | 'secondary' (default 'primary')
 *   disabled
 *   onPress
 *   testOnly_pressed   force the pressed look (dev harness)
 */
export default function Button({ label, variant = 'primary', disabled = false, onPress, testOnly_pressed }) {
  const primary = variant === 'primary' && !disabled;
  const labelColor = disabled ? 'muted' : primary ? color.action.fg : 'primary';

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
        <View style={styles.labelWrap}>
          <Text variant="buttonCaps" color={labelColor} style={styles.label}>
            {label}
          </Text>
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
  labelWrap: {
    alignSelf: 'stretch',
  },
  label: {
    textAlign: 'center',
  },
});
