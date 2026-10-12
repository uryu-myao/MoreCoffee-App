import { Pressable, StyleSheet, View } from 'react-native';
import { color, dashed, icon, shape, size, space, spacing, state } from '../theme/tokens';
import Badge from './base/Badge';
import Glyph from './base/Glyph';
import PhotoPlaceholder from './base/PhotoPlaceholder';
import Text from './base/Text';

/**
 * Radio list: a single-select list in one 2px frame, hairline-divided — the
 * single-select sibling of CheckboxList. Used by stage 3's bag / gear picker.
 *
 * Marker (design-system.md §9 Radio marker, D-35): square, outer
 * size.checkbox (24) with a 2px frame — border.muted on raised, ink when
 * selected — and, when selected, an inner ink square of
 * 24 − 2 × 2 − 2 × 4 = 12 (border 2, gap 4 a side). It reads differently from
 * the checkbox's tick.
 * Row: the marker, an optional 46 photo placeholder (10a), the name
 * (title; ink when selected, text.secondary otherwise, as CheckboxList) and
 * an optional meta line (meta, text.muted). The row is the pressable.
 *
 * Add row (optional, last): as CheckboxList's — a 24 dashed border.addSlot
 * box with a plus, then the label.
 *
 * Props
 *   items     [{ key, label, meta?, swatch?, badge? }] — badge: an inline
 *             Badge after the name ("Default", selected tone, as 4a)
 *   selected  key or null
 *   onPick    (key) => void
 *   add       optional { label, onPress }
 */
const MARK = size.checkbox - 2 * shape.borderWidth.box - 2 * space[4];

export default function RadioList({ items, selected, onPick, add }) {
  if (items.length === 0 && !add) return null;
  return (
    <View style={styles.frame} accessibilityRole="radiogroup">
      {items.map((item, i) => {
        const on = item.key === selected;
        return (
          <Pressable
            key={item.key}
            onPress={() => onPick(item.key)}
            accessibilityRole="radio"
            accessibilityState={{ checked: on }}
            accessibilityLabel={item.meta ? `${item.label}, ${item.meta}` : item.label}
            style={({ pressed }) => [styles.row, i > 0 && styles.divided, pressed && styles.pressed]}>
            <View style={[styles.marker, on && styles.markerOn]}>{on ? <View style={styles.mark} /> : null}</View>
            {item.swatch ? <PhotoPlaceholder size={size.field.height} /> : null}
            <View style={styles.text}>
              <View style={styles.nameRow}>
                <Text variant="title" color={on ? 'primary' : 'secondary'} truncate="name">
                  {item.label}
                </Text>
                {item.badge ? <Badge label={item.badge} tone="selected" /> : null}
              </View>
              {item.meta ? (
                <Text variant="meta" color="muted" truncate="meta">
                  {item.meta}
                </Text>
              ) : null}
            </View>
          </Pressable>
        );
      })}
      {add ? (
        <Pressable
          onPress={add.onPress}
          accessibilityRole="button"
          accessibilityLabel={add.label}
          style={({ pressed }) => [styles.row, items.length > 0 && styles.divided, pressed && styles.pressed]}>
          <View style={[styles.marker, styles.addBox]}>
            <Glyph name="plus" token={icon.xs} color={color.text.primary} />
          </View>
          <Text variant="title" color="primary" style={styles.text} truncate="name">
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
  marker: {
    width: size.checkbox,
    height: size.checkbox,
    borderWidth: shape.borderWidth.box,
    borderColor: color.border.muted,
    backgroundColor: color.surface.raised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerOn: {
    borderColor: color.border.strong,
  },
  mark: {
    width: MARK,
    height: MARK,
    backgroundColor: color.surface.inverse,
  },
  addBox: {
    borderStyle: dashed.addSlot.style,
    borderColor: dashed.addSlot.color,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.gap.row,
  },
  text: {
    flex: 1,
    minWidth: 0,
    gap: spacing.gap.tight,
  },
});
