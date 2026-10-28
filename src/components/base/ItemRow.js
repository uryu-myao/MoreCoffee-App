import { Pressable, StyleSheet, View } from 'react-native';
import { icon, layout, size, space, spacing, state } from '../../theme/tokens';
import Chevron from './Chevron';
import Glyph from './Glyph';
import PhotoPlaceholder from './PhotoPlaceholder';
import Text from './Text';

/**
 * A compact list row (Design Round 15): search's hits (18c) and its BEANS /
 * GEAR rows (18d), and the bag and gear pages' cup lists (19a / 19c).
 * [thumbnail 46] [title → meta] [rating over label] [›]
 * The 3b / 3d rows' shape (GearList's), with an optional right column.
 *
 *   thumbnail  FieldRow's swatch (size.field.height, 46, as 3b / 3d's rows
 *              and 18c / 19a's 46)
 *   title      user data, `title`, 2 lines (§3.1 name)
 *   meta       one line, bodySm muted ("Bag · Blue Bottle · day 7")
 *   rating /   the right column, as RecordRow's: the star and the serif
 *   label      numeral over a label.eyebrow ("MORNING", 19a)
 *   onPress    the whole row opens its thing: it ends in the chevron (§1 Tap
 *              affordance) and darkens across the screen's width while
 *              pressed (state.pressed.row, out through the gutter)
 * No item dividers (Design Round 9).
 */
export default function ItemRow({ title, meta, rating, label, onPress, accessibilityLabel }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={accessibilityLabel ?? [title, meta, rating ? `${rating} of 5` : null, label].filter(Boolean).join(', ')}
      style={({ pressed }) => [styles.touch, pressed && styles.pressed]}>
      <View style={styles.row}>
        {/* TODO(photos): show photo_uri here once photos can be added. */}
        <PhotoPlaceholder size={size.field.height} />
        <View style={styles.text}>
          <Text variant="title" truncate="name">
            {title}
          </Text>
          {meta ? (
            <Text variant="bodySm" color="muted" truncate="meta">
              {meta}
            </Text>
          ) : null}
        </View>
        {rating != null || label ? (
          <View style={styles.side}>
            {rating != null ? (
              <View style={styles.rating}>
                <Glyph name="star" token={icon.fill.sm} filled />
                <Text variant="numeralInline">{String(rating)}</Text>
              </View>
            ) : null}
            {label ? (
              <Text variant="labelEyebrow" color="muted">
                {label}
              </Text>
            ) : null}
          </View>
        ) : null}
        {onPress ? <Chevron /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // The touch area spans the screen (out through the gutter, padded back in).
  touch: {
    marginHorizontal: -layout.gutter,
    paddingHorizontal: layout.gutter,
  },
  pressed: {
    backgroundColor: state.pressed.row,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
    paddingVertical: spacing.inset.listRow.v,
  },
  text: {
    flex: 1,
    minWidth: 0,
    gap: spacing.gap.tight,
  },
  // As RecordRow's: the numeral's natural box already leaves the label room.
  side: {
    flexShrink: 0,
    alignItems: 'flex-end',
    gap: 0,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.gap.tight,
  },
});
