import { Pressable, StyleSheet, View } from 'react-native';
import { color, icon, shape, size, space, spacing, state } from '../theme/tokens';
import Glyph from './base/Glyph';
import Text from './base/Text';

/**
 * Gear pick list (design/components.md "Adding a bag and gear…"; catalogue #7
 * checkbox list, #8 checkbox): 8c's generic gear as a multi-select list in
 * one 2px frame, hairline-divided like 5a's field groups.
 *
 * Row (8c): a 24 checkbox, the name (title) and an optional hint (meta,
 * text.muted). Checked = ink box with a ground tick and the name in ink (a
 * chosen option is ink, §1; 8c's blue was drift D-19). Unchecked = border.muted
 * box on raised, name text.secondary. At the cap, unchecked rows lock (§1
 * Disabled options: name text.muted, box border.muted). 8c's row tint
 * #FFF8F1 was absorbed into surface.raised, so a checked row has no tint.
 * The row is the pressable (≥ 44pt), so its pressed look is the surface.
 *
 * Props
 *   items     [{ name, hint? }]
 *   selected  names checked
 *   locked    true at the cap: unchecked rows can't be checked
 *   onToggle  (name) => void
 */
export default function GearPickList({ items, selected, locked = false, onToggle }) {
  return (
    <View style={styles.frame}>
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
            accessibilityLabel={item.hint ? `${item.name}, ${item.hint}` : item.name}
            style={({ pressed }) => [styles.row, i > 0 && styles.divided, pressed && styles.pressed]}>
            <View style={[styles.box, on && styles.boxOn]}>
              {on ? <Glyph name="check" token={icon.xs} color={color.text.onInverse} /> : null}
            </View>
            <Text variant="title" color={on ? 'primary' : off ? 'muted' : 'secondary'} style={styles.name} truncate="name">
              {item.name}
            </Text>
            {item.hint ? (
              <Text variant="meta" color="muted" truncate="meta">
                {item.hint}
              </Text>
            ) : null}
          </Pressable>
        );
      })}
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
  name: {
    flex: 1,
    minWidth: 0,
  },
});
