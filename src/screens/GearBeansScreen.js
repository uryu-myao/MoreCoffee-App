import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, useWindowDimensions, View } from 'react-native';
import BeansList from '../components/BeansList';
import GearList from '../components/GearList';
import IconButton from '../components/base/IconButton';
import ShelfTabs, { SlotCount, TAB_OVERLAP, useShelfPager } from '../components/ShelfTabs';
import { GEAR_LIMIT } from '../constants/gear';
import { useDatabase } from '../data/DatabaseProvider';
import { OPEN_BAG_LIMIT, countFinishedBags, listGearWithUse, listShelfBags, onCupsChanged, onShelfChanged } from '../data/repository';
import { layout, spacing } from '../theme/tokens';
import ScreenFrame from './ScreenFrame';

/**
 * Gear & beans (Round 14, 17c / 17d): 3b (My gear) and 3d (My beans) as one
 * screen, from Home's "See all gear & beans ›" (on the side Home had open)
 * and Profile's My gear / My beans rows.
 *
 * Header: compact, Back + "Gear & beans" (Edit cup's pattern).
 * Under it the shelf's tabs (ShelfTabs, as Home), with the open side's slot
 * count at the row's right end: "7 / 8 In my kit" / "3 / 5 On the shelf".
 * The body is the open side's: GearList (3b's rows and Add gear) or
 * BeansList (3d's cards, Add a bag, Finished bags ›). A tab or a sideways
 * swipe swaps all of it, slot count included; the tab follows the swipe
 * past the midpoint.
 *
 * The two sides are pages a screen wide. The pages' box takes the open
 * side's height, so the shorter side doesn't scroll on into the other's
 * length. Both sides start under the open tab's underline, not on it
 * (Uryu, on device, 2026-10-27): gear's first row has no rule over it, and
 * beans' first card sits gap.section under it. 17c / 17d follow (Design
 * Round 15, addendum).
 *
 * Props: side ('gear' | 'beans', the one to open on), onBack, onAddGear,
 * onEditGear(gear), onAddBag, onFinished, onEditBag(bag)
 */
export default function GearBeansScreen({ side: openOn = 'gear', onBack, onAddGear, onEditGear, onAddBag, onFinished, onEditBag }) {
  const db = useDatabase();
  const [data, setData] = useState(null);
  const [heights, setHeights] = useState({});
  const placed = useRef(false);
  const { width } = useWindowDimensions();
  const { side, progress, select, scrollProps } = useShelfPager(width, openOn);

  useEffect(() => {
    const load = () =>
      Promise.all([listGearWithUse(db), listShelfBags(db), countFinishedBags(db)]).then(
        ([gear, bags, finished]) => setData({ gear, bags, finished }),
        (error) => console.error('[17c] could not read the shelf', error)
      );
    load();
    const offShelf = onShelfChanged(load);
    const offCups = onCupsChanged(load);
    return () => {
      offShelf();
      offCups();
    };
  }, [db]);

  // Opened on beans: start there, once the pages are laid out.
  const onPagerLayout = () => {
    if (placed.current) return;
    placed.current = true;
    if (openOn === 'beans') scrollProps.ref.current?.scrollTo({ x: width, animated: false });
  };
  const measure = (key) => (e) => {
    const h = e.nativeEvent.layout.height;
    setHeights((was) => (was[key] === h ? was : { ...was, [key]: h }));
  };

  const slot =
    side === 'gear'
      ? data && { value: `${data.gear.length} / ${GEAR_LIMIT}`, label: 'In my kit' }
      : data && { value: `${data.bags.length} / ${OPEN_BAG_LIMIT}`, label: 'On the shelf' };
  return (
    <ScreenFrame scroll compact title="Gear & beans" leading={<IconButton icon="chevronLeft" accessibilityLabel="Back" onPress={onBack} />}>
      {data ? (
        <View>
          <ShelfTabs active={side} progress={progress} counts={{ gear: data.gear.length, beans: data.bags.length }} onSelect={select} trailing={<SlotCount {...slot} />} />
          <Animated.ScrollView
            {...scrollProps}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onLayout={onPagerLayout}
            style={[styles.pager, heights[side] != null && { height: heights[side] }]}
            contentContainerStyle={styles.pagerContent}>
            <View style={[styles.page, { width }]} onLayout={measure('gear')}>
              <GearList gear={data.gear} onAddGear={onAddGear} onEditGear={onEditGear} />
            </View>
            <View style={[styles.page, styles.beans, { width }]} onLayout={measure('beans')}>
              <BeansList bags={data.bags} finished={data.finished} onAddBag={onAddBag} onFinished={onFinished} onEditBag={onEditBag} />
            </View>
          </Animated.ScrollView>
        </View>
      ) : null}
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  // Out to the screen's edges; each page pads the gutter back in.
  pager: {
    marginHorizontal: -layout.gutter,
  },
  // Each page keeps its own height (measured), not the taller one's.
  pagerContent: {
    alignItems: 'flex-start',
  },
  // From the underline's foot: the tab row overlaps the pages by
  // TAB_OVERLAP. Gear's rows then start on their own listRow padding.
  page: {
    paddingTop: TAB_OVERLAP,
    paddingHorizontal: layout.gutter,
  },
  // gap.section from the underline's foot to the first card's frame.
  beans: {
    paddingTop: TAB_OVERLAP + spacing.gap.section,
  },
});
