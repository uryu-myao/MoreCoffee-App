import { Pressable, StyleSheet, View } from 'react-native';
import { color, shape, spacing } from '../../theme/tokens';
import Text from './Text';

/**
 * Single-choice chip group — the 5a "Who made it?" maker picker
 * (I made it / Barista / Packaged). Chips wrap rather than squeeze,
 * matching the source's flex-wrap.
 *
 * Padding is `inset.control`: process/roles.md files the maker chip's padding
 * under control-inset, not badge-inset. It also brings the chip to 44px
 * (size.tapTarget), which closes gaps.md 3 for these chips without a hit-slop.
 *
 * Props
 *   options   [{ value, label }]
 *   value     selected option value
 *   onChange  (value) => void
 */
export default function SegmentedControl({ options, value, onChange }) {
  // TODO: pressed and disabled chip states are undesigned (gaps.md 3, 4).
  return (
    <View style={styles.group} accessibilityRole="radiogroup">
      {options.map((opt) => {
        const on = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            accessibilityRole="radio"
            accessibilityState={{ checked: on }}
            style={[styles.chip, on && styles.chipOn]}>
            <Text variant="labelCaps" color={on ? color.badge.fg.selected : color.badge.fg.neutral}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.gap.row,
  },
  chip: {
    paddingVertical: spacing.inset.control.v,
    paddingHorizontal: spacing.inset.control.h,
    borderWidth: shape.borderWidth.divider,
    borderColor: color.border.muted,
    backgroundColor: color.badge.bg.raised,
  },
  chipOn: {
    borderColor: color.badge.bg.selected,
    backgroundColor: color.badge.bg.selected,
  },
});
