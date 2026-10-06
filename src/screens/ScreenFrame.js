import { createContext, useContext, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DotTexture from '../components/base/DotTexture';
import Text from '../components/base/Text';
import { color, layout, shape, space, spacing, textStyle } from '../theme/tokens';

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
 * Whether ScreenFrame draws its own backdrop (ground + dot texture). AppShell's
 * tab pager sets it to false and draws one backdrop behind all four pages:
 * per-page textures would slide with their pages and break at the seam
 * (390 / 7 is not a whole number of tiles). Screens outside the pager (the
 * Record overlay, the database error screen) keep drawing their own.
 */
export const ScreenBackdropContext = createContext(true);

/**
 * Tab chrome that reacts to vertical scroll (the bottom bar's hide / reveal),
 * provided by AppShell around the pager: { scrolledDown(), scrolledUp() }.
 * Null outside it (the Record overlay), where scrolling drives nothing but the
 * header.
 */
export const ScrollChromeContext = createContext(null);

/**
 * Header collapse (design-system.md §9 Header collapse). The one tunable value:
 * the title column's collapsed scale. displayLg shrinks to displaySm's size
 * (40 → 30), so the collapsed title is the scale's next display step, not a new
 * size. The distance is derived, not tuned: the column's top lands on the
 * safe-area top, so collapse = (header top padding − safe-area top) +
 * (1 − titleScale) × column height, and the scroll distance equals it (the
 * rule moves 1:1 with the content).
 */
const COLLAPSE = {
  titleScale: textStyle.displaySm.fontSize / textStyle.displayLg.fontSize,
};

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
 *   scroll    the page scrolls under a pinned header that collapses as it
 *             scrolls (title shrinks, rule rises; §9 Header collapse)
 *   footer    optional node in the footer panel at the end of the page; it sits at
 *             the bottom when the content is short and follows it when it is long
 *   compact   evaluation header (Record coffee, 2026-10-05): leading control and
 *             title column on one row, the control centred on the whole column
 *             (title + gap.tight + meta, measured on line boxes); meta on one line
 *             directly under the title
 *   children  screen body
 */
export default function ScreenFrame({ title, leading, meta, scroll = false, compact = false, footer, children }) {
  const insets = useSafeAreaInsets();
  const ownBackdrop = useContext(ScreenBackdropContext);
  const chrome = useContext(ScrollChromeContext);
  const rootStyle = ownBackdrop ? styles.screen : styles.screenBare;
  const texture = ownBackdrop ? <DotTexture /> : null;
  const top = Math.max(insets.top, layout.screen.top);
  const headerTop = { paddingTop: top };

  // ── Collapse geometry (scroll variants only; design-system.md §9 Header
  // collapse). Measured once from layout, then handed to native-driver
  // interpolations: nothing runs in JS per frame.
  const scrollY = useRef(new Animated.Value(0)).current;
  const measured = useRef({});
  const [geo, setGeo] = useState(null); // { h: title column height, b: title baseline from column top }
  const [range, setRange] = useState(0); // how far the content can scroll
  const sizes = useRef({ content: 0, layout: 0 });

  const commitGeo = () => {
    const m = measured.current;
    if (m.h == null || (!compact && (m.textH == null || m.baselineInText == null))) return;
    const next = compact ? { h: m.h, b: m.h / 2 } : { h: m.h, b: m.h - m.textH + m.baselineInText };
    setGeo((prev) => (prev && prev.h === next.h && prev.b === next.b ? prev : next));
  };
  const onColumnLayout = (e) => {
    measured.current.h = e.nativeEvent.layout.height;
    commitGeo();
  };
  const onTitleLayout = (e) => {
    measured.current.textH = e.nativeEvent.layout.height;
    commitGeo();
  };
  const onTitleTextLayout = (e) => {
    const line = e.nativeEvent.lines[0];
    if (!line) return;
    measured.current.baselineInText = line.y + line.ascender;
    commitGeo();
  };
  const updateRange = () => setRange(Math.max(0, sizes.current.content - sizes.current.layout));

  // Full collapse distance: the title column shrinks to COLLAPSE.titleScale and
  // its top lands on the safe-area top, and the rule follows 1:1.
  const full = scroll && geo ? top - insets.top + (1 - COLLAPSE.titleScale) * geo.h : 0;
  // A page that cannot scroll at all never collapses (a bounce must not move
  // the header); one that scrolls less than `full` collapses only that far.
  const distance = Math.min(full, range);

  const anim = useMemo(() => {
    if (!(distance > 0)) return null;
    const s = COLLAPSE.titleScale;
    // Collapsed amount in points, clamped to [0, distance]: linear in scroll
    // offset, so the rule stays glued to the content under the finger.
    const shift = scrollY.interpolate({ inputRange: [0, distance], outputRange: [0, distance], extrapolate: 'clamp' });
    const lerp = (to) => shift.interpolate({ inputRange: [0, full], outputRange: [0, to] });
    const titleShift = compact
      ? insets.top - top - ((1 - s) * geo.h) / 2 // column centre (origin left-centre)
      : insets.top - top - (1 - s) * geo.b; // title baseline (origin left-baseline)
    return {
      shift,
      up: lerp(-full),
      scale: shift.interpolate({ inputRange: [0, full], outputRange: [1, s] }),
      title: lerp(titleShift),
      // The control stays centred on the column; its optical offset is a
      // property of the column's ink, so it scales with it (+4 → +4·s).
      leading: shift.interpolate({
        inputRange: [0, full],
        outputRange: [COMPACT_LEADING_OPTICAL_Y, titleShift + COMPACT_LEADING_OPTICAL_Y * s],
      }),
    };
  }, [compact, distance, full, geo, insets.top, scrollY, top]);

  // Footer hide / reveal (tab screens): report the scroll direction. Any
  // upward movement reveals at once. The top and bottom bounce are ignored.
  const lastY = useRef(0);
  const onScroll = useMemo(
    () =>
      Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
        useNativeDriver: true,
        listener: chrome
          ? (e) => {
              const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
              const y = contentOffset.y;
              const dy = y - lastY.current;
              lastY.current = y;
              const max = contentSize.height - layoutMeasurement.height;
              // y > max is the bottom bounce; its way back (and the top
              // bounce) is not the reader scrolling up.
              if (y <= 0) return;
              if (dy > 0 && y <= max) chrome.scrolledDown();
              else if (dy < 0 && y < max) chrome.scrolledUp();
            }
          : undefined,
      }),
    [chrome, scrollY]
  );

  const titleText = (
    <Text
      variant="displayLg"
      accessibilityRole="header"
      onLayout={scroll && !compact ? onTitleLayout : undefined}
      onTextLayout={scroll && !compact ? onTitleTextLayout : undefined}>
      {title}
    </Text>
  );

  const header = compact ? (
    <View style={[styles.header, styles.headerCompact, headerTop, scroll && styles.headerNoRule]}>
      <View style={styles.compactRow}>
        {leading ? (
          <Animated.View style={[styles.compactLeading, anim && { transform: [{ translateY: anim.leading }] }]}>
            {leading}
          </Animated.View>
        ) : null}
        <Animated.View
          onLayout={scroll ? onColumnLayout : undefined}
          style={[
            styles.compactTitleColumn,
            anim && { transformOrigin: 'left center', transform: [{ translateY: anim.title }, { scale: anim.scale }] },
          ]}>
          {titleText}
          {meta ? <View style={styles.compactMeta}>{meta}</View> : null}
        </Animated.View>
      </View>
    </View>
  ) : (
    <View style={[styles.header, headerTop, scroll && styles.headerNoRule]}>
      <Animated.View
        onLayout={scroll ? onColumnLayout : undefined}
        style={[
          styles.titleColumn,
          anim && { transformOrigin: [0, geo.b, 0], transform: [{ translateY: anim.title }, { scale: anim.scale }] },
        ]}>
        {leading}
        {titleText}
      </Animated.View>
      {meta ? <Animated.View style={[styles.meta, anim && { transform: [{ translateY: anim.up }] }]}>{meta}</Animated.View> : null}
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

  // Every variant: a fixed root holding the dot texture (or, inside the tab
  // pager, transparent over AppShell's), with any ScrollView above it — so the
  // texture never scrolls and never re-renders on scroll.
  if (!scroll) {
    return (
      <View style={rootStyle}>
        {texture}
        {header}
        {page}
      </View>
    );
  }

  // Scroll variants: the header (rule included) is pinned and collapses; the
  // ScrollView starts below the rule and clips there, so content passes
  // beneath the rule, never beside it. As the header collapses by `shift`, the
  // rule and the ScrollView move up by it (the ScrollView reaches `distance`
  // past the screen bottom to stay flush) and the content inside moves back
  // down by it, so the content still tracks the finger 1:1. A spacer of
  // `distance` keeps the end of the content reachable.
  return (
    <View style={rootStyle}>
      {texture}
      {header}
      <Animated.View style={[styles.rule, anim && { transform: [{ translateY: anim.up }] }]} />
      <Animated.ScrollView
        style={[styles.scroller, anim && { marginBottom: -distance, transform: [{ translateY: anim.up }] }]}
        contentContainerStyle={styles.scrollContent}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onLayout={(e) => {
          sizes.current.layout = e.nativeEvent.layout.height;
          updateRange();
        }}
        onContentSizeChange={(w, h) => {
          sizes.current.content = h;
          updateRange();
        }}>
        <Animated.View style={[styles.scrollPage, anim && { transform: [{ translateY: anim.shift }] }]}>{page}</Animated.View>
        {anim ? <View style={{ height: distance }} /> : null}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.surface.ground,
  },
  screenBare: {
    flex: 1,
  },
  scroller: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  scrollPage: {
    flexGrow: 1,
  },
  // Scroll variants draw the rule as its own view so it can rise with the
  // collapse while the header box keeps its height.
  headerNoRule: {
    borderBottomWidth: 0,
  },
  rule: {
    height: shape.borderWidth.box,
    backgroundColor: color.border.strong,
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
    // Close → title: widened from gap.row (8) on review, 2026-10-05.
    gap: space[12],
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
