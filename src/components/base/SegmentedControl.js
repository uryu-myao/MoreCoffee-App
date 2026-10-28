import { Pressable, StyleSheet, View } from 'react-native';
import { color, shape, size, spacing, state } from '../../theme/tokens';
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
 *   toggle    optional { label, on, onToggle }: one more chip after the
 *             options, on or off by itself (8l's "4★ and up" beside the
 *             scopes, 2026-10-21). Same look; pressing it when on turns it
 *             off, so it responds in both states.
 *   compact   optional: inset.controlCompact and gap.controlCompact, so a row of
 *             four holds one line on narrow phones (2b's Group by; Uryu,
 *             2026-10-26; search's Kind chips, Design Round 15, which took
 *             over from 2a's category chips and 8l's scopes). 32 tall, with a hit-slop above and
 *             below back to 44 (size.tapTarget); never narrower than 44.
 *             Wraps as before past that.
 *   testOnly_pressedValue   force the pressed look on one option (dev harness)
 */
// The compact chip is shorter than the regular one (44) by twice this, so a
// hit-slop of it above and below gives back the 44 target.
const COMPACT_SLOP = spacing.inset.control.v - spacing.inset.controlCompact.v;
const COMPACT_HIT_SLOP = { top: COMPACT_SLOP, bottom: COMPACT_SLOP };

export default function SegmentedControl({ options, value, onChange, toggle, compact, testOnly_pressedValue }) {
  // TODO: disabled chip state is undesigned (gaps.md 4).
  const chip = [styles.chip, compact && styles.chipCompact];
  const hitSlop = compact ? COMPACT_HIT_SLOP : undefined;
  return (
    <View style={[styles.group, compact && styles.groupCompact]} accessibilityRole="radiogroup">
      {options.map((opt) => {
        const on = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            accessibilityRole="radio"
            accessibilityState={{ checked: on }}
            hitSlop={hitSlop}
            testOnly_pressed={opt.value === testOnly_pressedValue}
            style={({ pressed }) => [chip, on ? styles.chipOn : pressed && styles.chipPressed]}>
            <Text variant="labelCaps" color={on ? color.badge.fg.selected : color.badge.fg.neutral}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
      {toggle ? (
        <Pressable
          onPress={toggle.onToggle}
          hitSlop={hitSlop}
          accessibilityRole="switch"
          accessibilityState={{ checked: toggle.on }}
          accessibilityLabel={toggle.label}
          style={({ pressed }) => [chip, toggle.on ? styles.chipOn : pressed && styles.chipPressed]}>
          <Text variant="labelCaps" color={toggle.on ? color.badge.fg.selected : color.badge.fg.neutral}>
            {toggle.label}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.gap.row,
  },
  groupCompact: {
    gap: spacing.gap.controlCompact,
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
  chipCompact: {
    minWidth: size.tapTarget,
    paddingVertical: spacing.inset.controlCompact.v,
    paddingHorizontal: spacing.inset.controlCompact.h,
  },
  chipPressed: {
    backgroundColor: state.pressed.surface,
  },
  chipOn: {
    borderColor: color.badge.bg.selected,
    backgroundColor: color.badge.bg.selected,
  },
});
