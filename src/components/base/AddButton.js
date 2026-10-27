import { Pressable, StyleSheet, View } from 'react-native';
import { color, icon as iconTokens, shape, space, spacing, state } from '../../theme/tokens';
import Glyph from './Glyph';
import Text from './Text';

/**
 * Add button (design-system.md §9 Add button; was EmptySlot, a dashed slot):
 * an action that adds something — "Add a photo" (5a, 5e), "Add gear" (3b),
 * "Add a bag" (3d), "Not listed — add your own" (3a).
 *
 * A button like any other (decided 2026-10-18, Uryu): dashed means only an
 * empty or not-started state, never "you can press this", so a pressable add
 * entry takes the secondary button's surface — a 2px solid ink frame on
 * surface.ground — with its own row layout: glyph → label → optional tag.
 *
 *   default    2px solid ink frame, surface.ground, ink glyph and label
 *   pressed    fill darkens to state.pressed.surface (Hard Rule §1)
 *   disabled   as Button's: border.muted frame, glyph and label muted —
 *              5d, an add that cannot be actioned yet
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
export default function AddButton({
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
      {/* Ink, as 3d draws it (2026-10-14: an action, not an empty field's
          invitation). */}
      {icon ? <Glyph name={icon} token={iconToken} color={disabled ? color.icon.muted : color.icon.default} /> : null}
      <Text variant="labelCaps" color={disabled ? 'muted' : 'primary'} style={styles.label}>
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
    borderWidth: shape.borderWidth.box,
    borderColor: color.border.strong,
    backgroundColor: color.surface.ground,
  },
  slotDisabled: {
    borderColor: color.border.muted,
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
