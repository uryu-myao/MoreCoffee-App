import { Pressable, StyleSheet, View } from 'react-native';
import { color, icon, layout, shape, size, space, spacing, state } from '../../theme/tokens';
import Badge from './Badge';
import Glyph from './Glyph';
import PhotoPlaceholder from './PhotoPlaceholder';
import Text from './Text';

/**
 * One logged cup in a list (design-system.md §9 List row, source 2a):
 * [thumbnail] [title → badges → source → note] [rating over date].
 * The right column has a fixed role — rating and date align down the whole
 * list because they live in their own column, not at the end of a text run.
 *
 * With onPress (2a → 2c, 2026-10-11) the whole row is pressable, so it ends
 * in a chevron (§1 Tap affordance: a whole row → chevron) and its surface
 * darkens while pressed (state.pressed.row, 2026-10-18): the fill bleeds
 * through the screen gutter to the screen's edges, so it reaches past the
 * row's content; the row itself, and the first row's hairline, keep the
 * content width. The row sits on the screen gutter (Records, Home). 2a's mock
 * has no chevron: drift D-49.
 *
 * No item dividers (Design Round 9, 2026-10-18): rows are set apart by
 * spacing.inset.listRow alone. Only the first row draws the hairline: the
 * one line between the list's header and its first item.
 *
 * Props
 *   title    user data — `name` truncation (2 lines)
 *   badges   [{ label, tone }] — inline Badges
 *   source   optional provenance line — `meta` truncation (1 line)
 *   note     optional tasting note — `note` truncation (3 lines)
 *   rating   1–5, shown as the serif numeral beside a rating star
 *   date     preformatted date label
 *   onPress  opens the cup (2c)
 *   first    the list's first row, under its header: draws the hairline
 */
export default function RecordRow({ title, badges = [], source, note, rating, date, onPress, first = false }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      style={({ pressed }) => [styles.touch, pressed && styles.pressed]}
      accessible
      accessibilityLabel={[title, ...badges.map((b) => b.label), source, `${rating} of 5`, date].filter(Boolean).join(', ')}>
      <View style={[styles.row, first && styles.first]}>
        {/* TODO(photos): show photo_uri here once photos can be added. */}
        <PhotoPlaceholder size={size.thumbnail.list} />

        <View style={styles.content}>
          <Text variant="title" truncate="name">
            {title}
          </Text>
          {badges.length ? (
            <View style={styles.badges}>
              {badges.map((b) => (
                <Badge key={b.label} label={b.label} tone={b.tone} />
              ))}
            </View>
          ) : null}
          {source ? (
            <Text variant="body" color="secondary" truncate="meta">
              {source}
            </Text>
          ) : null}
          {note ? (
            <Text variant="bodySm" color="muted" truncate="note">
              {note}
            </Text>
          ) : null}
        </View>

        <View style={styles.side}>
          <View style={styles.rating}>
            <Glyph name="star" token={icon.fill.sm} filled />
            <Text variant="numeralInline">{String(rating)}</Text>
          </View>
          <Text variant="labelEyebrow" color="muted">
            {date}
          </Text>
        </View>
        {onPress ? (
          <View style={styles.chevron}>
            <Glyph name="chevronRight" token={icon.md} color={color.icon.default} />
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // The touch area (and its pressed fill) spans the screen: out through the
  // gutter on both sides, padded back in so the content stays put.
  touch: {
    marginHorizontal: -layout.gutter,
    paddingHorizontal: layout.gutter,
  },
  pressed: {
    backgroundColor: state.pressed.row,
  },
  chevron: {
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space[14],
    paddingVertical: spacing.inset.listRow.v,
  },
  first: {
    borderTopWidth: shape.borderWidth.divider,
    borderTopColor: color.divider.hairlineStrong,
  },
  content: {
    flex: 1,
    minWidth: 0,
    gap: spacing.gap.tight,
  },
  badges: {
    flexDirection: 'row',
    gap: spacing.gap.row,
  },
  side: {
    flexShrink: 0,
    alignItems: 'flex-end',
    // numeral.inline renders on its natural box on iOS (§3.2): 28.6 tall, 6.8 of
    // it below the baseline, against the spec's 22px CSS box (3.5 below). The
    // source's 4px gap would put the date 10.8 under the digits; 0 puts it at
    // 6.8, the closest the scale gets to the source's 7.5. lineHeight untouched.
    gap: 0,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.gap.tight,
  },
});
