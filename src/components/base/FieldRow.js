import { Pressable, StyleSheet, View } from 'react-native';
import { color, icon, shape, size, space, spacing, state } from '../../theme/tokens';
import Glyph from './Glyph';
import Text from './Text';

/**
 * A tappable field inside a bordered group: [swatch] label / value / meta [chevron].
 * Source: 5a (Beans, Method, Café, Drink, Brand, Package rows), 5d (error row).
 *
 * Rows stack inside a 2px-outlined card; every row after the first sets
 * `divided` to draw the one hairline tier between them.
 *
 * Props
 *   label     eyebrow (fixed copy)
 *   value     the user's choice — truncated with the `name` preset
 *   meta      secondary line — truncated with the `meta` preset (wraps in full when `error`)
 *   swatch    show the 46px thumbnail frame
 *   icon      Glyph name drawn inside the swatch (implies `swatch`)
 *   divided   hairline above the row
 *   error     5d missing-field state: dashed swatch with a plus, error-toned text
 *   placeholder  the value is an invitation, not a value ("Add a bag" when the
 *             shelf is empty): `text.secondary`, the placeholder colour of
 *             the plain fields (gaps.md 23, until D-38 settles it)
 *   onPress
 *   testOnly_pressed   force the pressed look (dev harness)
 *
 * Pressed: the row fill darkens to state.pressed.surface (Hard Rule, design-system.md §1).
 */
export default function FieldRow({
  label,
  value,
  meta,
  swatch = false,
  icon: iconName,
  divided = false,
  error = false,
  placeholder = false,
  onPress,
  testOnly_pressed,
}) {
  const hasSwatch = swatch || Boolean(iconName);
  const ink = error ? state.error.text : color.icon.default;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={[label, value, meta].filter(Boolean).join(', ')}
      testOnly_pressed={testOnly_pressed}
      style={({ pressed }) => [styles.row, divided && styles.divided, pressed && styles.pressed]}>
      {hasSwatch ? (
        <View style={[styles.swatch, error && styles.swatchError]}>
          {error ? (
            <Glyph name="plus" token={icon.md} color={color.icon.accent} />
          ) : iconName ? (
            <Glyph name={iconName} token={icon.lg} color={color.icon.accent} />
          ) : null}
        </View>
      ) : null}

      <View style={styles.content}>
        <Text variant="labelEyebrow" color={error ? state.error.text : 'muted'}>
          {label}
        </Text>
        <Text variant="title" color={error ? state.error.text : placeholder ? 'secondary' : 'primary'} truncate="name">
          {value}
        </Text>
        {meta ? (
          // In the error state meta is guidance copy ("…or type a new one"), not
          // a user string, so it wraps in full rather than taking the meta clamp.
          <Text variant="bodySm" color={error ? 'secondary' : 'muted'} truncate={error ? 'none' : 'meta'}>
            {meta}
          </Text>
        ) : null}
      </View>

      <Glyph name="chevronRight" token={icon.md} color={ink} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
    paddingVertical: spacing.inset.control.v,
    paddingHorizontal: spacing.inset.control.h,
  },
  pressed: {
    backgroundColor: state.pressed.surface,
  },
  divided: {
    borderTopWidth: shape.borderWidth.divider,
    borderTopColor: color.divider.hairline,
  },
  swatch: {
    width: size.field.height,
    height: size.field.height,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.surface.muted,
    borderWidth: shape.borderWidth.divider,
    borderColor: color.border.muted,
  },
  swatchError: {
    backgroundColor: color.surface.ground,
    borderStyle: state.error.dashedBorder.style,
    borderColor: state.error.dashedBorder.color,
  },
  content: {
    flex: 1,
    minWidth: 0,
    gap: spacing.gap.tight,
  },
});
