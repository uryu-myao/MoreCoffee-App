import { Pressable, StyleSheet, View } from 'react-native';
import { color, shadow, shape, size, spacing } from '../../theme/tokens';
import HardShadow from './HardShadow';
import Text from './Text';

/**
 * Full-width button (design-system.md §9 Buttons).
 *
 *   primary    action.bg fill, 2px ink outline, shadow.primary
 *   secondary  same geometry on surface.ground, ink label, no shadow
 *   disabled   either variant: ground fill, border.muted outline, text.muted
 *              label, no shadow — the border.empty.disabled vocabulary from 5d
 *
 * Props
 *   label     fixed copy
 *   variant   'primary' | 'secondary' (default 'primary')
 *   disabled
 *   onPress
 */
export default function Button({ label, variant = 'primary', disabled = false, onPress }) {
  const primary = variant === 'primary' && !disabled;
  const labelColor = disabled ? 'muted' : primary ? color.action.fg : 'primary';

  // TODO: pressed and loading states are undesigned (gaps.md 4).
  return (
    <HardShadow shadow={primary ? shadow.primary : null}>
      <Pressable
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        style={[
          styles.base,
          primary && styles.primary,
          variant === 'secondary' && styles.secondary,
          disabled && styles.disabled,
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
