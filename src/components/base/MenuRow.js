import { Pressable, StyleSheet, View } from 'react-native';
import { color, icon, space, spacing, state } from '../../theme/tokens';
import Chevron from './Chevron';
import Glyph from './Glyph';
import Text from './Text';

/**
 * A settings-list row (6a's My shelf, 6b's My data; 2026-10-21):
 * [glyph] label (over an optional sub line) [value] [chevron].
 * Rows stack in one 2px ink frame on raised, with no item dividers (Design
 * Round 9); the frame is the caller's.
 *
 *   label  label (15 / 700), ink
 *   sub    body.sm, muted ("147 cups as CSV, notes included")
 *   value  meta, accent ("4 of 5"); 6a sets it 13 / 600, and meta is the
 *          12 / 600 style beside it
 *   With onPress the whole row is pressable: a chevron at its end (§1 Tap
 *   affordance) and state.pressed.row out to the frame. Without it, the
 *   row is information only: no chevron, no press (6a's My gear until 3b).
 *
 * Props: icon (Glyph name), label, sub, value, onPress, disabled
 */
export default function MenuRow({ icon: glyph, label, sub, value, onPress, disabled = false }) {
  const pressable = Boolean(onPress);
  return (
    <Pressable
      onPress={onPress}
      disabled={!pressable || disabled}
      accessibilityRole={pressable ? 'button' : 'text'}
      accessibilityState={pressable ? { disabled } : undefined}
      accessibilityLabel={[label, sub, value].filter(Boolean).join(', ')}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      {glyph ? <Glyph name={glyph} token={icon.md} color={color.text.primary} /> : null}
      <View style={styles.text}>
        <Text variant="label" color="primary" truncate="name">
          {label}
        </Text>
        {sub ? (
          <Text variant="bodySm" color="muted" truncate="meta">
            {sub}
          </Text>
        ) : null}
      </View>
      {value ? (
        <Text variant="meta" color="accent">
          {value}
        </Text>
      ) : null}
      {pressable ? <Chevron /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
    paddingVertical: spacing.inset.listRow.v,
    paddingHorizontal: spacing.inset.listRow.h,
  },
  pressed: {
    backgroundColor: state.pressed.row,
  },
  text: {
    flex: 1,
    minWidth: 0,
    gap: spacing.gap.tight,
  },
});
