import { Pressable, StyleSheet, View } from 'react-native';
import { color, icon, shape, size, space, spacing, state } from '../theme/tokens';
import Badge from './base/Badge';
import Glyph from './base/Glyph';
import PhotoPlaceholder from './base/PhotoPlaceholder';
import Text from './base/Text';

/**
 * Radio list: a single-select list in one 2px frame — the single-select
 * sibling of CheckboxList. No item dividers (Design Round 9, 2026-10-18):
 * rows are set apart by spacing.inset.listRow alone. Used by stage 3's bag /
 * gear picker.
 *
 * Marker (design-system.md §9 Radio marker, D-35): square, outer
 * size.checkbox (24) with a 2px frame — ink, border.muted when disabled
 * (decided 2026-10-12) — and, when selected, an inner ink square of
 * 24 − 2 × 2 − 2 × 4 = 12 (border 2, gap 4 a side). It reads differently from
 * the checkbox's tick.
 * Row: the marker, an optional 46 photo placeholder (10a), the name
 * (title; ink when selected, text.secondary otherwise, as CheckboxList) and
 * an optional meta line (meta, text.muted). The row is the pressable.
 *
 * Add row (optional, last): as CheckboxList's — an ink plus (icon.sm) in
 * the marker's 24 place, no frame, then the label in ink. A row like the
 * others, pressed like them: dashed means only an empty or not-started state
 * (decided 2026-10-18, Uryu), and a framed box would read as a marker.
 *
 * Props
 *   items     [{ key, label, meta?, swatch?, badge?, disabled?, disabledHint? }]
 *             badge: an inline Badge after the name ("Default", as 4a).
 *             disabled: §1's disabled look (marker border.muted, label
 *             text.muted), no press; its meta line must say why (§1: a
 *             disabled option shows its reason), disabledHint for VoiceOver.
 *   selected  key or null
 *   onPick    (key) => void
 *   add       optional { label, meta?, onPress }: meta, a line under the
 *             label as an item's (the café sheet's "Saved by name only",
 *             Design Round 16, B1)
 *   framed    false when the container draws the frame (the search sheet)
 */
const MARK = size.checkbox - 2 * shape.borderWidth.box - 2 * space[4];

export default function RadioList({ items, selected, onPick, add, framed = true }) {
  if (items.length === 0 && !add) return null;
  return (
    <View style={framed && styles.frame} accessibilityRole="radiogroup">
      {items.map((item) => {
        const on = item.key === selected;
        const off = Boolean(item.disabled);
        return (
          <Pressable
            key={item.key}
            onPress={() => onPick(item.key)}
            disabled={off}
            accessibilityRole="radio"
            accessibilityState={{ checked: on, disabled: off }}
            accessibilityHint={off ? item.disabledHint : undefined}
            accessibilityLabel={item.meta ? `${item.label}, ${item.meta}` : item.label}
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
            <View style={[styles.marker, off && styles.markerOff]}>{on ? <View style={styles.mark} /> : null}</View>
            {item.swatch ? <PhotoPlaceholder size={size.field.height} /> : null}
            <View style={styles.text}>
              <View style={styles.nameRow}>
                <Text variant="title" color={on ? 'primary' : off ? 'muted' : 'secondary'} truncate="name">
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
          accessibilityLabel={add.meta ? `${add.label}, ${add.meta}` : add.label}
          style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
          <View style={styles.addMark}>
            <Glyph name="plus" token={icon.sm} color={color.text.primary} />
          </View>
          <View style={styles.text}>
            <Text variant="title" color="primary" truncate="name">
              {add.label}
            </Text>
            {add.meta ? (
              <Text variant="meta" color="muted" truncate="meta">
                {add.meta}
              </Text>
            ) : null}
          </View>
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
  // Unselected: a 2px ink frame; disabled: border.muted (decided 2026-10-12).
  marker: {
    width: size.checkbox,
    height: size.checkbox,
    borderWidth: shape.borderWidth.box,
    borderColor: color.border.strong,
    backgroundColor: color.surface.raised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerOff: {
    borderColor: color.border.muted,
  },
  mark: {
    width: MARK,
    height: MARK,
    backgroundColor: color.surface.inverse,
  },
  addMark: {
    width: size.checkbox,
    height: size.checkbox,
    alignItems: 'center',
    justifyContent: 'center',
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
