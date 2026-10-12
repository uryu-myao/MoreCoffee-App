import { Pressable, StyleSheet, View } from 'react-native';
import { color, dashed, icon as iconTokens, space, spacing, state } from '../../theme/tokens';
import Glyph from './Glyph';
import Text from './Text';

/**
 * An empty slot waiting to be filled — the `border.addSlot` pattern
 * (design-system.md §8, §9 Empty slot). Always a button: "Add a photo" (5a, 5e),
 * "Add gear" (3b), "Add a bag" (3d), "Not listed — add your own" (3a).
 *
 *   default    2px dashed ink frame, transparent, ink glyph and label
 *   pressed    fill darkens to state.pressed.surface (Hard Rule §1)
 *   disabled   the frame drops to dashed.addSlotInert, glyph muted, label
 *              secondary — 5d, a slot that cannot be actioned yet
 *
 * Props
 *   label       fixed copy (label.caps)
 *   icon        Glyph name
 *   iconToken   icon size/stroke pair (default icon.md — 5a's camera; 3b's plus is icon.sm)
 *   tag         optional trailing copy ("Optional", "5 slots left"), label.caps, muted
 *   disabled
 *   onPress
 *   testOnly_pressed   force the pressed look (dev harness)
 */
export default function EmptySlot({
  label,
  icon,
  iconToken = iconTokens.md,
  tag,
  disabled = false,
  onPress,
  testOnly_pressed,
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={tag ? `${label}, ${tag}` : label}
      accessibilityState={{ disabled }}
      testOnly_pressed={testOnly_pressed}
      style={({ pressed }) => [
        styles.slot,
        disabled && styles.slotDisabled,
        pressed && !disabled && styles.slotPressed,
      ]}>
      {/* The label and glyph are an invitation, in text.placeholder (2026-10-12);
          the dashed frame is what says pressable (§1 Tap affordance: a part
          with a surface → its frame), and the inert frame says it isn't. */}
      {icon ? <Glyph name={icon} token={iconToken} color={color.text.placeholder} /> : null}
      <Text variant="labelCaps" color="placeholder" style={styles.label}>
        {label}
      </Text>
      {tag ? (
        <View style={styles.tag}>
          <Text variant="labelCaps" color="muted">
            {tag}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  slot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
    paddingVertical: spacing.inset.control.v,
    paddingHorizontal: spacing.inset.control.h,
    borderWidth: dashed.addSlot.width,
    borderStyle: dashed.addSlot.style,
    borderColor: dashed.addSlot.color,
  },
  slotDisabled: {
    borderColor: dashed.addSlotInert.color,
  },
  slotPressed: {
    backgroundColor: state.pressed.surface,
  },
  label: {
    flexShrink: 1,
  },
  tag: {
    marginLeft: 'auto',
    flexShrink: 0,
  },
});
