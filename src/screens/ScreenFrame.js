import { createContext, useContext, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DotTexture from '../components/base/DotTexture';
import Text from '../components/base/Text';
import { color, layout, shape, space, spacing, state, textStyle } from '../theme/tokens';

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
 * Header collapse (design-system.md §9 Header collapse). Two tunables:
 *   titleScale  the title's collapsed scale. displayLg shrinks to displaySm's
 *               size (40 → 30), the scale's next display step, not a new size.
 *   fadeBy      the share of the collapse over which the small labels (eyebrow,
 *               the stat's label, the compact date) fade out. They never scale:
 *               ×0.75 would take them to 7.5–9px.
 * The distance is derived, not tuned: the collapsed title (or the compact row)
 * starts at the safe-area top and the rule follows 1:1 with the content.
 */
const COLLAPSE = {
  titleScale: textStyle.displaySm.fontSize / textStyle.displayLg.fontSize,
  fadeBy: 0.5,
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
 *   userTitle the title is user data (2c's bean name): `name` truncation,
 *             2 lines (§3.1). Fixed screen titles never truncate.
 *   eyebrow   optional small label above the title (label.eyebrow, accent):
 *             "The archive" (2a), "MoreCoffee" (1b). Fades out on collapse.
 *   leading   optional control above the title (5b's back button). A control
 *             never fades or moves on collapse; the title shrinks below it
 *   meta      optional information, right-aligned at the foot of the header
 *             (5b "Step 2 of 2 / Skippable"); fades out on collapse
 *   stat      optional { value, label }, right-aligned at the foot of the header
 *             in place of meta (2a's cup count): the numeral in display.sm
 *             accent over the label in label.eyebrow muted. On collapse the
 *             numeral keeps its size and settles on the title's baseline; the
 *             label fades out.
 *   scroll    the page scrolls under a pinned header that collapses as it
 *             scrolls (title shrinks, rule rises; §9 Header collapse)
 *   footer    optional node in the footer panel at the end of the page; it sits at
 *             the bottom when the content is short and follows it when it is long
 *   compact   Record flow header (Log a cup, Tasting note; revised 2026-10-07):
 *             the leading control and the title on one row at the left, centred
 *             on the title's cap band; meta as the standard right-aligned column.
 *             On collapse the row rises to the safe-area top and the title
 *             scales; the control moves with it (never fades); the meta fades
 *   scrollRef     optional ref to the ScrollView (scroll variants), e.g. 5d's
 *                 "Go to first"
 *   footerTone    'error': the footer panel's top rule takes state.error.border
 *                 (5d)
 *   children  screen body
 */
export default function ScreenFrame({
  title,
  eyebrow,
  leading,
  meta,
  stat,
  scroll = false,
  compact = false,
  footer,
  footerTone,
  userTitle = false,
  scrollRef,
  children,
}) {
  const insets = useSafeAreaInsets();
  const ownBackdrop = useContext(ScreenBackdropContext);
  const chrome = useContext(ScrollChromeContext);
  const rootStyle = ownBackdrop ? styles.screen : styles.screenBare;
  const texture = ownBackdrop ? <DotTexture /> : null;
  const top = Math.max(insets.top, layout.screen.top);
  const headerTop = { paddingTop: top };

  // ── Collapse geometry (scroll variants only; design-system.md §9 Header
  // collapse). Every part is measured once from layout (header-local y, which
  // is screen y: the frame starts at the screen top), then handed to
  // native-driver interpolations. Nothing runs in JS per frame.
  const scrollY = useRef(new Animated.Value(0)).current;
  const parts = useRef({});
  const [geo, setGeo] = useState(null);
  const [range, setRange] = useState(0); // how far the content can scroll
  const sizes = useRef({ content: 0, layout: 0 });

  // Compact header: the control is centred on the title's cap band (cap top to
  // baseline), not on its line box, whose empty ascent and descent area would
  // put it visibly high. Measured from the title's own text layout, so it holds
  // for any title and any font.
  const [optical, setOptical] = useState(0);
  const onCompactTitleText = (e) => {
    const line = e.nativeEvent.lines[0];
    if (!line) return;
    const capCentre = line.y + line.ascender - line.capHeight / 2;
    const next = Math.round((capCentre - line.height / 2 - line.y) * 10) / 10;
    setOptical((prev) => (prev === next ? prev : next));
  };

  const commit = () => {
    const p = parts.current;
    const s = COLLAPSE.titleScale;
    const I = insets.top;
    let next = null;
    if (compact) {
      if (!p.row || !p.title || (leading && !p.leading)) return;
      const tH = p.title.height;
      const titleTop = p.row.y + p.title.y;
      // Collapsed row: the scaled title, or the control if taller, from the safe-area top.
      const rowC = Math.max(s * tH, p.leading ? p.leading.height : 0);
      const centreC = I + rowC / 2;
      const leadingCentre = p.leading ? p.row.y + p.leading.y + p.leading.height / 2 : 0;
      next = {
        full: p.row.y + p.row.height - (I + rowC),
        title: centreC - (titleTop + tH / 2), // origin: the title's left-centre
        // Centre-to-centre move; the optical offset is added at interpolation.
        leadingMove: centreC - leadingCentre,
      };
    } else {
      if (!p.column || !p.title || p.baseline == null || (leading && !p.leading)) return;
      if (stat && (!p.stat || !p.number || p.numberBaseline == null)) return;
      const tH = p.title.height;
      const titleTop = p.column.y + p.title.y;
      // The collapsed title starts at the safe-area top, or under a leading
      // control, which never moves or fades (Hard Rule, §1 Header collapse).
      const topC = p.leading ? p.column.y + p.leading.y + p.leading.height + spacing.gap.row : I;
      const baselineC = topC + s * p.baseline; // the collapsed title's baseline
      next = {
        full: p.column.y + p.column.height - (topC + s * tH),
        title: baselineC - (titleTop + p.baseline), // origin: the title's left baseline
        baseline: p.baseline,
        above: topC - titleTop, // the eyebrow rides the title's top
        // The stat's numeral keeps its size and lands on the title's baseline.
        stat: stat ? baselineC - (p.stat.y + p.number.y + p.numberBaseline) : 0,
      };
    }
    setGeo((prev) => (prev && Object.keys(next).every((k) => prev[k] === next[k]) ? prev : next));
  };
  const onPart = (name) =>
    scroll
      ? (e) => {
          parts.current[name] = e.nativeEvent.layout;
          commit();
        }
      : undefined;
  const onBaseline = (name) =>
    scroll
      ? (e) => {
          const line = e.nativeEvent.lines[0];
          if (!line) return;
          parts.current[name] = line.y + line.ascender;
          commit();
        }
      : undefined;
  const updateRange = () => setRange(Math.max(0, sizes.current.content - sizes.current.layout));

  const full = scroll && geo ? geo.full : 0;
  // A page that cannot scroll at all never collapses (a bounce must not move
  // the header); one that scrolls less than `full` collapses only that far.
  const distance = Math.min(full, range);

  const anim = useMemo(() => {
    if (!(distance > 0)) return null;
    // Collapsed amount in points, clamped to [0, distance]: linear in scroll
    // offset, so the rule stays glued to the content under the finger.
    const shift = scrollY.interpolate({ inputRange: [0, distance], outputRange: [0, distance], extrapolate: 'clamp' });
    const lerp = (to) => shift.interpolate({ inputRange: [0, full], outputRange: [0, to] });
    return {
      shift,
      up: lerp(-full),
      scale: shift.interpolate({ inputRange: [0, full], outputRange: [1, COLLAPSE.titleScale] }),
      // Small labels never scale: they fade out over the first part of the collapse.
      // Fully gone within the reachable collapse: a page that can scroll only
      // a little must not rest with half-transparent labels.
      fade: shift.interpolate({
        inputRange: [0, Math.min(full * COLLAPSE.fadeBy, distance)],
        outputRange: [1, 0],
        extrapolate: 'clamp',
      }),
      title: lerp(geo.title),
      above: compact ? null : lerp(geo.above),
      stat: compact ? null : lerp(geo.stat),
      leading: compact
        ? shift.interpolate({ inputRange: [0, full], outputRange: [optical, geo.leadingMove + optical * COLLAPSE.titleScale] })
        : null,
    };
  }, [compact, distance, full, geo, optical, scrollY]);

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
      truncate={userTitle ? 'name' : 'none'}
      accessibilityRole="header"
      onTextLayout={compact ? onCompactTitleText : onBaseline('baseline')}>
      {title}
    </Text>
  );

  // Compact (2026-10-07): the control and the title share one row on the left;
  // the meta is the standard right-aligned column. Same geometry as the
  // standard header otherwise (padding, rule, meta 20 above the rule).
  const header = compact ? (
    <View style={[styles.header, headerTop, scroll && styles.headerNoRule]}>
      <View style={styles.compactRow} onLayout={onPart('row')}>
        {leading ? (
          <Animated.View onLayout={onPart('leading')} style={{ transform: [{ translateY: anim ? anim.leading : optical }] }}>
            {leading}
          </Animated.View>
        ) : null}
        <Animated.View
          onLayout={onPart('title')}
          style={[
            styles.compactTitle,
            anim && { transformOrigin: 'left center', transform: [{ translateY: anim.title }, { scale: anim.scale }] },
          ]}>
          {titleText}
        </Animated.View>
      </View>
      {meta ? (
        <Animated.View style={[styles.meta, anim && { opacity: anim.fade, transform: [{ translateY: anim.up }] }]}>
          {meta}
        </Animated.View>
      ) : null}
    </View>
  ) : (
    <View style={[styles.header, headerTop, scroll && styles.headerNoRule]}>
      <View style={styles.titleColumn} onLayout={onPart('column')}>
        {/* A control: stays put, fully visible and pressable while collapsing. */}
        {leading ? (
          <View style={styles.leading} onLayout={onPart('leading')}>
            {leading}
          </View>
        ) : null}
        {/* Information: fades out, riding the title's top. */}
        {eyebrow ? (
          <Animated.View style={anim && { opacity: anim.fade, transform: [{ translateY: anim.above }] }}>
            <Text variant="labelEyebrow" color="accent">
              {eyebrow}
            </Text>
          </Animated.View>
        ) : null}
        <Animated.View
          onLayout={onPart('title')}
          style={
            anim && {
              transformOrigin: [0, geo.baseline, 0],
              transform: [{ translateY: anim.title }, { scale: anim.scale }],
            }
          }>
          {titleText}
        </Animated.View>
      </View>
      {stat ? (
        <View style={styles.stat} onLayout={onPart('stat')}>
          <Animated.View onLayout={onPart('number')} style={anim && { transform: [{ translateY: anim.stat }] }}>
            <Text variant="displaySm" color="accent" onTextLayout={onBaseline('numberBaseline')}>
              {stat.value}
            </Text>
          </Animated.View>
          <Animated.View style={[styles.statLabel, anim && { opacity: anim.fade, transform: [{ translateY: anim.stat }] }]}>
            <Text variant="labelEyebrow" color="muted">
              {stat.label}
            </Text>
          </Animated.View>
        </View>
      ) : meta ? (
        <Animated.View style={[styles.meta, anim && { opacity: anim.fade, transform: [{ translateY: anim.up }] }]}>
          {meta}
        </Animated.View>
      ) : null}
    </View>
  );

  const page = (
    <>
      <View style={[styles.body, footer && styles.bodyAboveFooter]}>{children}</View>
      {footer ? (
        <View style={[styles.footer, footerTone === 'error' && styles.footerError, { paddingBottom: Math.max(insets.bottom, layout.screen.bottom) }]}>
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
        ref={scrollRef}
        style={[styles.scroller, anim && { marginBottom: -distance, transform: [{ translateY: anim.up }] }]}
        contentContainerStyle={styles.scrollContent}
        onScroll={onScroll}
        scrollEventThrottle={16}
        // A focused field (5b My words) stays above the keyboard; a tap on
        // another control while typing still lands.
        automaticallyAdjustKeyboardInsets
        keyboardShouldPersistTaps="handled"
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
  },
  leading: {
    marginBottom: spacing.gap.row,
  },
  // Out of flow, so the header height stays the title column's and the rule
  // sits at the same height on every tab (a swipe shows no step). On iOS the
  // display.sm numeral's natural box (39) would otherwise push it 3 lower.
  // Its foot sits where meta's does: header padding + meta padding (8 + 12 =
  // 20) above the rule.
  stat: {
    position: 'absolute',
    right: layout.gutter,
    bottom: space[8] + space[12],
    alignItems: 'flex-end',
  },
  statLabel: {
    marginTop: spacing.gap.tight,
  },
  meta: {
    alignItems: 'flex-end',
    // The source sits the meta 6 above a header foot that was 14 above the rule
    // (20 in all). The header padding is now 8, so the meta takes 12 to stay 20
    // above the rule — its baseline lands 2.1 above the title's, as in the source.
    paddingBottom: space[12],
  },
  compactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    // Control → title: widened from gap.row (8) on review, 2026-10-05.
    gap: space[12],
  },
  compactTitle: {
    flexShrink: 1,
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
  footerError: {
    borderTopColor: state.error.border,
  },
});
