import { StyleSheet, View } from 'react-native';
import { color, icon, shape, size, space, spacing } from '../../theme/tokens';
import Badge from './Badge';
import Glyph from './Glyph';
import Text from './Text';

/**
 * One logged cup in a list (design-system.md §9 List row, source 2a):
 * [thumbnail] [title → badges → source → note] [rating over date].
 * The right column has a fixed role — rating and date align down the whole
 * list because they live in their own column, not at the end of a text run.
 *
 * Informational: no onPress, no chevron. Tapping through to a detail screen
 * is not built yet.
 *
 * Props
 *   title    user data — `name` truncation (2 lines)
 *   badges   [{ label, tone }] — inline Badges
 *   source   optional provenance line — `meta` truncation (1 line)
 *   note     optional tasting note — `note` truncation (3 lines)
 *   rating   1–5, shown as the serif numeral beside a rating star
 *   date     preformatted date label
 */
export default function RecordRow({ title, badges = [], source, note, rating, date }) {
  return (
    <View style={styles.row} accessible accessibilityLabel={[title, ...badges.map((b) => b.label), source, `${rating} of 5`, date].filter(Boolean).join(', ')}>
      {/* TODO(photos): show photo_uri here once photos can be added. */}
      <View style={styles.thumb} />

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
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space[14],
    paddingVertical: space[16],
    borderTopWidth: shape.borderWidth.divider,
    borderTopColor: color.divider.hairlineStrong,
  },
  thumb: {
    width: size.thumbnail.list,
    height: size.thumbnail.list,
    backgroundColor: color.surface.muted,
    borderWidth: shape.borderWidth.divider,
    borderColor: color.border.muted,
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
