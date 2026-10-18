import { Pressable, StyleSheet, View } from 'react-native';
import { color, icon, shape, size, space, spacing, state } from '../theme/tokens';
import Glyph from './base/Glyph';
import Text from './base/Text';

/**
 * Checkbox list (catalogue #7 checkbox list, #8 checkbox): a multi-select
 * list in one 2px frame. No item dividers (Design Round 9, 2026-10-18):
 * rows are set apart by spacing.inset.listRow alone. Used by 3a's
 * Gear pick list (8c's generic gear) and the flavour search sheet.
 *
 * Row (8c): a 24 checkbox, the name (title) and an optional hint (meta,
 * text.muted). Checked = ink box with a ground tick and the name in ink (a
 * chosen option is ink, §1; 8c's blue was drift D-19). Unchecked = 2px ink
 * box on raised, name text.secondary. At the cap, unchecked rows lock (§1
 * Disabled options: name text.muted, box border.muted); the count says why. 8c's row tint
 * #FFF8F1 was absorbed into surface.raised, so a checked row has no tint.
 * The row is the pressable (≥ 44pt), so its pressed look is the surface.
 *
 * Add row (search sheet, `add`): last row, "Add \"xxx\"" beside an ink plus
 * (icon.sm) in the checkbox's 24 place, no frame — a row like the others
 * (dashed means only an empty or not-started state, decided 2026-10-18,
 * Uryu; a framed box would read as a checkbox). It locks with the rest at
 * the cap: plus and label muted.
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
      {items.map((item) => {
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
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
            <View style={[styles.box, on && styles.boxOn, off && styles.boxOff]}>
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
          style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
          <View style={styles.addMark}>
            <Glyph name="plus" token={icon.sm} color={locked ? color.text.muted : color.text.primary} />
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
    paddingVertical: spacing.inset.listRow.v,
    paddingHorizontal: spacing.inset.listRow.h,
  },
  // A frameless whole row (state.pressed.row, 2026-10-18): it already spans
  // its frame, edge to edge.
  pressed: {
    backgroundColor: state.pressed.row,
  },
  // Unchecked: a 2px ink box (decided 2026-10-12; 3a's mock). Locked:
  // border.muted, so the marker differs as well as the label (§1 Disabled
  // options). An unfilled frame never means "selected" (§1).
  box: {
    width: size.checkbox,
    height: size.checkbox,
    borderWidth: shape.borderWidth.box,
    borderColor: color.border.strong,
    backgroundColor: color.surface.raised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxOn: {
    backgroundColor: color.surface.inverse,
  },
  boxOff: {
    borderColor: color.border.muted,
  },
  addMark: {
    width: size.checkbox,
    height: size.checkbox,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    flex: 1,
    minWidth: 0,
  },
});
