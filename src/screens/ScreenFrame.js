import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Text from '../components/base/Text';
import { color, layout, shape, space, spacing } from '../theme/tokens';

/**
 * Compact header: optical correction for the leading control (design-system.md
 * §9 Screen shell). The control is centred on the title column's line boxes, but
 * the column's visible ink starts 10.8 below its top (empty ascent above
 * Instrument Serif's cap height) and ends 2.5 above its bottom (the date line's
 * descent), so the box centre sits ~4 above the ink centre. Tuned by eye at 3x
 * across 0…5: +4 reads centred for Latin titles. ja (Hiragino fallback) reads
 * centred at 0 — its per-language value belongs to the OQ-14 mapping.
 * Single use, so a local value, not a token. translateY: no effect on layout.
 */
const COMPACT_LEADING_OPTICAL_Y = 4;

/**
 * Screen shell (design-system.md §9): header block — optional leading control
 * (e.g. a close IconButton, as in 5a) above the display.lg title, optional
 * right-aligned meta — closed by a 2px ink rule, then the screen body, then an
 * optional footer. layout.gutter is the only horizontal padding.
 *
 * layout.screen.top / .bottom are measured from the screen edge, as in the
 * source frames, so they already contain the status bar / home indicator; they
 * never sit inside a taller safe-area inset.
 *
 * Props
 *   title     screen title (display.lg)
 *   leading   optional node above the title
 *   meta      optional node, right-aligned at the foot of the header (5a date / time)
 *   scroll    the whole page scrolls, header included (5a)
 *   footer    optional node in the footer panel at the end of the page; it sits at
 *             the bottom when the content is short and follows it when it is long
 *   compact   evaluation header (Record coffee, 2026-10-05): leading control and
 *             title column on one row, the control centred on the whole column
 *             (title + gap.tight + meta, measured on line boxes); meta on one line
 *             directly under the title; with `scroll`, the header (rule included)
 *             stays pinned and only the content below the rule scrolls
 *   children  screen body
 */
export default function ScreenFrame({ title, leading, meta, scroll = false, compact = false, footer, children }) {
  const insets = useSafeAreaInsets();
  const headerTop = { paddingTop: Math.max(insets.top, layout.screen.top) };

  const titleText = (
    <Text variant="displayLg" accessibilityRole="header">
      {title}
    </Text>
  );

  const header = compact ? (
    <View style={[styles.header, styles.headerCompact, headerTop]}>
      <View style={styles.compactRow}>
        {leading ? <View style={styles.compactLeading}>{leading}</View> : null}
        <View style={styles.compactTitleColumn}>
          {titleText}
          {meta ? <View style={styles.compactMeta}>{meta}</View> : null}
        </View>
      </View>
    </View>
  ) : (
    <View style={[styles.header, headerTop]}>
      <View style={styles.titleColumn}>
        {leading}
        {titleText}
      </View>
      {meta ? <View style={styles.meta}>{meta}</View> : null}
    </View>
  );

  const page = (
    <>
      <View style={[styles.body, footer && styles.bodyAboveFooter]}>{children}</View>
      {footer ? (
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, layout.screen.bottom) }]}>
          {footer}
        </View>
      ) : null}
    </>
  );

  if (scroll && compact) {
    // Pinned header: the ScrollView starts below the rule and clips there, so
    // content passes beneath the header's bottom edge, never beside it.
    return (
      <View style={styles.screen}>
        {header}
        <ScrollView style={styles.scroller} contentContainerStyle={styles.scrollContent}>
          {page}
        </ScrollView>
      </View>
    );
  }

  return scroll ? (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent}>
      {header}
      {page}
    </ScrollView>
  ) : (
    <View style={styles.screen}>
      {header}
      {page}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.surface.ground,
  },
  scroller: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: space[14],
    paddingHorizontal: layout.gutter,
    // The title-to-rule distance is this padding, not line-box leftover. The
    // title renders on Instrument Serif's natural box (§3.2), which ends at the
    // descender line, 12.4 below the baseline at 40. 12.4 + 8 = 20.4 from the
    // baseline to the rule, matching the source (40px box + 14px padding).
    paddingBottom: space[8],
    borderBottomWidth: shape.borderWidth.box,
    borderBottomColor: color.border.strong,
  },
  titleColumn: {
    flexShrink: 1,
    alignItems: 'flex-start',
    gap: spacing.gap.row,
  },
  meta: {
    alignItems: 'flex-end',
    // The source sits the meta 6 above a header foot that was 14 above the rule
    // (20 in all). The header padding is now 8, so the meta takes 12 to stay 20
    // above the rule — its baseline lands 2.1 above the title's, as in the source.
    paddingBottom: space[12],
  },
  headerCompact: {
    flexDirection: 'column',
    alignItems: 'stretch',
    // The header now ends on the date/time line (Archivo), whose natural box
    // matches the CSS line box, so the source's 14 applies as-is; the 8 was only
    // ever a correction for the serif title's 12.4 descent box.
    paddingBottom: spacing.inset.container.v,
  },
  compactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.gap.row,
  },
  compactLeading: {
    transform: [{ translateY: COMPACT_LEADING_OPTICAL_Y }],
  },
  compactTitleColumn: {
    flexShrink: 1,
  },
  compactMeta: {
    // Title + its date/time are one meaning unit (heading + caption).
    marginTop: spacing.gap.tight,
  },
  body: {
    flexGrow: 1,
    paddingHorizontal: layout.gutter,
    paddingTop: spacing.inset.container.v,
  },
  bodyAboveFooter: {
    // When the content is long, the footer follows it directly; keep one
    // section gap so the last block never touches the footer rule.
    paddingBottom: spacing.gap.section,
  },
  footer: {
    gap: spacing.gap.section,
    paddingTop: space[20],
    paddingHorizontal: layout.gutter,
    backgroundColor: color.surface.raised,
    borderTopWidth: shape.borderWidth.box,
    borderTopColor: color.border.strong,
  },
});
