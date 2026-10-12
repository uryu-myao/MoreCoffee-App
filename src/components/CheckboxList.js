import { Pressable, StyleSheet, View } from 'react-native';
import { color, dashed, icon, shape, size, space, spacing, state } from '../theme/tokens';
import Glyph from './base/Glyph';
import Text from './base/Text';

/**
 * Checkbox list (catalogue #7 checkbox list, #8 checkbox): a multi-select
 * list in one 2px frame, hairline-divided like 5a's field groups. Used by 3a's
 * Gear pick list (8c's generic gear) and the flavour search sheet.
 *
 * Row (8c): a 24 checkbox, the name (title) and an optional hint (meta,
 * text.muted). Checked = ink box with a ground tick and the name in ink (a
 * chosen option is ink, §1; 8c's blue was drift D-19). Unchecked = border.muted
 * box on raised, name text.secondary. At the cap, unchecked rows lock (§1
 * Disabled options: name text.muted, box border.muted). 8c's row tint
 * #FFF8F1 was absorbed into surface.raised, so a checked row has no tint.
 * The row is the pressable (≥ 44pt), so its pressed look is the surface.
 *
 * Add row (search sheet, `add`): last row, "Add \"xxx\"" beside a 24 dashed
 * box (border.addSlot, the "add" vocabulary of 5b's Search opener) holding a
 * plus. It locks with the rest at the cap.
 * TODO: no mock draws the add row; to be shown to Design.
 *
 * Props
 *   items     [{ name, label?, hint? }] — name is the key; label is shown (defaults to name)
 *   selected  names checked
 *   locked    true at the cap: unchecked rows can't be checked
 *   onToggle  (name) => void
 *   add       optional { label, onPress }: the add row
 *   framed    false when the container draws the frame (the search sheet's
 *             list scrolls inside a fixed frame)
 */
export default function CheckboxList({ items, selected, locked = false, onToggle, add, framed = true }) {
  if (items.length === 0 && !add) return null;
  return (
    <View style={framed && styles.frame}>
      {items.map((item, i) => {
        const on = selected.includes(item.name);
        const off = locked && !on;
        return (
          <Pressable
            key={item.name}
            onPress={() => onToggle(item.name)}
            disabled={off}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: on, disabled: off }}
            accessibilityLabel={item.hint ? `${item.label ?? item.name}, ${item.hint}` : item.label ?? item.name}
            style={({ pressed }) => [styles.row, i > 0 && styles.divided, pressed && styles.pressed]}>
            <View style={[styles.box, on && styles.boxOn]}>
              {on ? <Glyph name="check" token={icon.xs} color={color.text.onInverse} /> : null}
            </View>
            <Text variant="title" color={on ? 'primary' : off ? 'muted' : 'secondary'} style={styles.name} truncate="name">
              {item.label ?? item.name}
            </Text>
            {item.hint ? (
              <Text variant="meta" color="muted" truncate="meta">
                {item.hint}
              </Text>
            ) : null}
          </Pressable>
        );
      })}
      {add ? (
        <Pressable
          onPress={add.onPress}
          disabled={locked}
          accessibilityRole="button"
          accessibilityState={{ disabled: locked }}
          accessibilityLabel={add.label}
          style={({ pressed }) => [styles.row, items.length > 0 && styles.divided, pressed && styles.pressed]}>
          <View style={[styles.box, styles.addBox, locked && styles.addBoxLocked]}>
            <Glyph name="plus" token={icon.xs} color={locked ? color.text.muted : color.text.primary} />
          </View>
          <Text variant="title" color={locked ? 'muted' : 'primary'} style={styles.name} truncate="name">
            {add.label}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    borderWidth: shape.borderWidth.box,
    borderColor: color.border.strong,
    backgroundColor: color.surface.raised,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
    paddingVertical: spacing.inset.control.v,
    paddingHorizontal: spacing.inset.control.h,
  },
  divided: {
    borderTopWidth: shape.borderWidth.divider,
    borderTopColor: color.divider.hairline,
  },
  pressed: {
    backgroundColor: state.pressed.surface,
  },
  box: {
    width: size.checkbox,
    height: size.checkbox,
    borderWidth: shape.borderWidth.box,
    borderColor: color.border.muted,
    backgroundColor: color.surface.raised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxOn: {
    borderColor: color.border.strong,
    backgroundColor: color.surface.inverse,
  },
  addBox: {
    borderStyle: dashed.addSlot.style,
    borderColor: dashed.addSlot.color,
  },
  addBoxLocked: {
    borderColor: dashed.addSlotInert.color,
  },
  name: {
    flex: 1,
    minWidth: 0,
  },
});
