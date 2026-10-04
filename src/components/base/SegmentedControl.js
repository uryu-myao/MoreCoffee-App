import { Pressable, StyleSheet, View } from 'react-native';
import { color, shape, spacing, state } from '../../theme/tokens';
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
 * Pressed: an unselected chip darkens to state.pressed.surface. The selected
 * chip is already ink — no darker tier, and pressing it is a no-op — so it
 * does not respond (Hard Rule, design-system.md §1).
 *
 * Props
 *   options   [{ value, label }]
 *   value     selected option value
 *   onChange  (value) => void
 *   testOnly_pressedValue   force the pressed look on one option (dev harness)
 */
export default function SegmentedControl({ options, value, onChange, testOnly_pressedValue }) {
  // TODO: disabled chip state is undesigned (gaps.md 4).
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
            testOnly_pressed={opt.value === testOnly_pressedValue}
            style={({ pressed }) => [styles.chip, on ? styles.chipOn : pressed && styles.chipPressed]}>
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
    // The chip owns its height (padding + content) and centres the label in it.
    // Chips in one row stretch to the tallest (row default alignItems: stretch);
    // without centring, a chip whose label has a shorter line box — e.g. a
    // Hiragino label next to one that falls back to PingFang — keeps its text
    // pinned to the top and the extra space lands below it.
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.inset.control.v,
    paddingHorizontal: spacing.inset.control.h,
    borderWidth: shape.borderWidth.divider,
    borderColor: color.border.muted,
    backgroundColor: color.badge.bg.raised,
  },
  chipPressed: {
    backgroundColor: state.pressed.surface,
  },
  chipOn: {
    borderColor: color.badge.bg.selected,
    backgroundColor: color.badge.bg.selected,
  },
});
