import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, useWindowDimensions, View } from 'react-native';
import { FreshnessTrack } from './BeanFreshness';
import ShelfTabs, { useShelfPager } from './ShelfTabs';
import { useDatabase } from '../data/DatabaseProvider';
import { FRESHNESS_WORDS, freshnessOf } from '../data/freshness';
import { listGearWithUse, listShelfBags, onCupsChanged, onShelfChanged } from '../data/repository';
import { formatLastUsed } from '../constants/dates';
import { GEAR_CATEGORY, onCups } from '../constants/gear';
import { color, component, icon, layout, motion, shape, size, space, spacing } from '../theme/tokens';
import AddButton from './base/AddButton';
import Badge from './base/Badge';
import Button from './base/Button';
import PhotoPlaceholder from './base/PhotoPlaceholder';
import Text from './base/Text';

/**
 * Home's My gear / My beans (Round 14, 17a / 17b; was 4a / 4b's box with
 * folder tabs).
 *
 * Heading: ShelfTabs, with the live counts. Under it the two sides as pages
 * side by side, swiped or opened by their tab: the page is the screen less
 * three gutters (402 → 336), space.20 apart, so the closed side peeks
 * 2 × gutter − 20 (24) at the screen's edge, cut straight. Gear snaps to the
 * left gutter, beans to the right one, so the peek is the same on both. The
 * open tab follows the scroll past the midpoint. A swipe stops at the ends
 * (the bounce stays inside, the mock's overscroll contain).
 *
 * Three rows a side, all alike (68: the 44 thumbnail and space.12 above and
 * below): thumbnail, name (label, one line: §3.1's shelf exception, Design
 * Round 15, B3) over one line (bodySm, muted), and a status
 * column at the right. Only the first row has a rule over it
 * (divider.hairlineStrong), which the open tab's underline lands on. Not
 * pressable: Home shows them; the whole list is one tap away.
 *   gear   "Brewer" (and a "Default" badge); status "2 cups" / "Last ·
 *          today", or "Not used" / "Add to a cup". A kettle or scale is never
 *          on a cup, so its status is empty (2026-10-27: "Add to a cup" would
 *          promise what can't be done). Used with no date: the count alone.
 *          Default first, then the most used.
 *   beans  "Roaster · 250 g"; status the freshness word over a short bar
 *          (component.beanFreshness, as 3d: Design Round 7 / 14a's colours;
 *          Round 14's table was an error, Design Round 15, B1). A sealed bag:
 *          "Sealed" alone; an opened bag with no roast date: an empty column
 *          (Round 15, B2). Past peak, then drink now, then resting, the
 *          oldest roast first in each; then no roast date, then sealed,
 *          oldest added first.
 * The status column is at least size.statusColumn wide (the bar) and grows
 * with its text (2026-10-27; the longer "Last · …" forms don't fit 84).
 *
 * Under the pages: the page indicator (component.pageIndicator) and "See all
 * gear & beans ›", which opens Gear & beans on the open side.
 * An empty side: its add button (Add gear → 3a, Add a bag → 3c), as before.
 *
 * Props: onSeeAll(side), onAddBag, onAddGear
 */
const ROWS = 3;

export default function ShelfBlock({ onSeeAll, onAddBag, onAddGear }) {
  const db = useDatabase();
  const [shelf, setShelf] = useState(null);
  const { width } = useWindowDimensions();
  const page = width - 3 * layout.gutter;
  // The farthest the pages scroll: beans' right edge on the right gutter.
  const end = 2 * page + space[20] + 2 * layout.gutter - width;
  const { side, progress, select, scrollProps } = useShelfPager(end);

  useEffect(() => {
    const load = () =>
      Promise.all([listShelfBags(db), listGearWithUse(db)]).then(
        ([bags, gear]) => setShelf({ bags, gear }),
        (error) => console.error('[home] could not read the shelf', error)
      );
    load();
    const offShelf = onShelfChanged(load);
    const offCups = onCupsChanged(load);
    return () => {
      offShelf();
      offCups();
    };
  }, [db]);

  if (!shelf) return null;
  const pageStyle = [styles.page, { width: page }];
  return (
    <View>
      <ShelfTabs active={side} progress={progress} counts={{ gear: shelf.gear.length, beans: shelf.bags.length }} onSelect={select} />
      <Animated.ScrollView
        {...scrollProps}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToOffsets={[0, end]}
        decelerationRate="fast"
        disableIntervalMomentum
        style={styles.pages}
        contentContainerStyle={styles.pagesContent}>
        <View style={pageStyle}>
          {shelf.gear.length ? (
            homeGear(shelf.gear).map((g, i) => <GearRow key={g.id} gear={g} first={i === 0} />)
          ) : (
            <AddButton icon="plus" iconToken={icon.sm} label="Add gear" onPress={onAddGear} />
          )}
        </View>
        <View style={pageStyle}>
          {shelf.bags.length ? (
            homeBeans(shelf.bags).map((b, i) => <BeanRow key={b.id} bag={b} first={i === 0} />)
          ) : (
            <AddButton icon="plus" iconToken={icon.sm} label="Add a bag" onPress={onAddBag} />
          )}
        </View>
      </Animated.ScrollView>
      <View style={styles.foot}>
        <PageIndicator side={side} />
        <Button variant="text" label="See all gear & beans" trailingIcon="chevronRight" onPress={() => onSeeAll(side)} />
      </View>
    </View>
  );
}

/** Default first, then the most used (a stable sort keeps 3b's order in a tie). */
function homeGear(gear) {
  return [...gear].sort((a, b) => b.is_default - a.is_default || b.cups - a.cups).slice(0, ROWS);
}

/** What to drink first (Round 14; Round 15, B2 for the last two). */
const DRINK_ORDER = { pastPeak: 0, drinkNow: 1, resting: 2 };
function homeBeans(bags) {
  const rank = (b) => (!b.opened_at ? 4 : b.roasted_at == null ? 3 : DRINK_ORDER[freshnessOf(b.roasted_at).state]);
  return [...bags]
    .sort((a, b) => rank(a) - rank(b) || (a.roasted_at ?? 0) - (b.roasted_at ?? 0) || a.id - b.id)
    .slice(0, ROWS);
}

function GearRow({ gear: g, first }) {
  let status = null;
  if (onCups(g.category)) {
    status = g.cups ? (
      <Status word={g.cups === 1 ? '1 cup' : `${g.cups} cups`} wordColor="primary" line={g.last_used_at != null ? `Last · ${formatLastUsed(g.last_used_at)}` : null} />
    ) : (
      <Status word="Not used" wordColor="muted" line="Add to a cup" />
    );
  }
  return <Row first={first} name={g.name} badge={g.is_default ? 'Default' : null} meta={GEAR_CATEGORY[g.category]} status={status} />;
}

function BeanRow({ bag, first }) {
  const meta = [bag.roaster, bag.size_g ? `${bag.size_g} g` : null].filter(Boolean).join(' · ') || ' ';
  let status = null;
  if (!bag.opened_at) {
    status = <Status word="Sealed" wordColor={component.beanFreshness.sealed.label} />;
  } else {
    const f = freshnessOf(bag.roasted_at);
    if (f) status = <Status word={FRESHNESS_WORDS[f.state]} wordColor={component.beanFreshness[f.state].label} track={f} />;
  }
  return <Row first={first} name={bag.name} meta={meta} status={status} />;
}

function Row({ first, name, badge, meta, status }) {
  return (
    <View style={[styles.row, first && styles.rowFirst]}>
      <PhotoPlaceholder size={size.thumbnail.compact} />
      <View style={styles.text}>
        <View style={styles.nameRow}>
          <Text variant="label" truncate="shelf" style={styles.name}>
            {name}
          </Text>
          {badge ? <Badge label={badge} tone="selected" /> : null}
        </View>
        <Text variant="bodySm" color="muted" truncate="meta">
          {meta}
        </Text>
      </View>
      {status}
    </View>
  );
}

/**
 * The status column: a word (meterLabel) over a line (bodySm, muted) or a
 * freshness bar. Without either under it the word sits alone, centred.
 */
function Status({ word, wordColor, line, track }) {
  return (
    <View style={styles.status}>
      <Text variant="meterLabel" color={wordColor}>
        {word}
      </Text>
      {line ? (
        <Text variant="bodySm" color="muted">
          {line}
        </Text>
      ) : null}
      {track ? <FreshnessTrack freshness={track} style={styles.track} /> : null}
    </View>
  );
}

const indicatorEasing = Easing.bezier(...motion.expand.controlPoints);
const dots = component.pageIndicator;

/** Two bars: the open side's longer and in ink (component.pageIndicator). */
function PageIndicator({ side }) {
  const at = useRef(new Animated.Value(side === 'beans' ? 1 : 0)).current;
  useEffect(() => {
    Animated.timing(at, { toValue: side === 'beans' ? 1 : 0, duration: motion.expand.duration, easing: indicatorEasing, useNativeDriver: false }).start();
  }, [at, side]);
  const bar = (open) => ({
    width: at.interpolate({ inputRange: [0, 1], outputRange: open ? [dots.inactive.w, dots.active.w] : [dots.active.w, dots.inactive.w] }),
    backgroundColor: at.interpolate({ inputRange: [0, 1], outputRange: open ? [dots.inactive.color, dots.active.color] : [dots.active.color, dots.inactive.color] }),
  });
  return (
    <View style={styles.indicator} accessible accessibilityLabel={side === 'beans' ? 'My beans, 2 of 2' : 'My gear, 1 of 2'}>
      <Animated.View style={[styles.indicatorBar, bar(false)]} />
      <Animated.View style={[styles.indicatorBar, bar(true)]} />
    </View>
  );
}

const styles = StyleSheet.create({
  // Out to the screen's edges: the closed side is cut by them.
  pages: {
    marginHorizontal: -layout.gutter,
  },
  pagesContent: {
    paddingHorizontal: layout.gutter,
    gap: space[20],
  },
  page: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
    paddingVertical: spacing.inset.listRow.v,
  },
  rowFirst: {
    borderTopWidth: shape.borderWidth.divider,
    borderTopColor: color.divider.hairlineStrong,
  },
  text: {
    flex: 1,
    minWidth: 0,
    gap: spacing.gap.tight,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.gap.row,
  },
  name: {
    flexShrink: 1,
  },
  status: {
    flexShrink: 0,
    minWidth: size.statusColumn,
    alignItems: 'flex-end',
    gap: space[6],
  },
  track: {
    width: size.statusColumn,
  },
  foot: {
    minHeight: size.tapTarget,
    paddingTop: space[6],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.gap.section,
  },
  indicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: dots.gap,
  },
  indicatorBar: {
    height: dots.height,
  },
});
