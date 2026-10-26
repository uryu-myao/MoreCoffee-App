import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Animated, Pressable, StyleSheet, View } from 'react-native';
import { AlignedDotTexture } from '../components/base/DotTexture';
import Glyph from '../components/base/Glyph';
import IconButton from '../components/base/IconButton';
import SegmentedControl from '../components/base/SegmentedControl';
import RecordRow from '../components/base/RecordRow';
import Text from '../components/base/Text';
import RecordsSearch from '../components/RecordsSearch';
import { CATEGORIES, CATEGORY_EMPTY, DEFAULT_CATEGORY, DEFAULT_GROUP, DEFAULT_SORT, arrangeCups, cupsInCategory, sortLabel } from '../constants/records';
import { useDatabase } from '../data/DatabaseProvider';
import { listCups, onCupsChanged } from '../data/repository';
import { MODE_BADGE, cupTitle, tidyNote } from '../constants/cups';
import { onCloseCupRequest, onOpenCupRequest, onTabReset, requestPush, requestSortSheet } from '../navigation';
import PushedScreen from '../components/PushedScreen';
import { color, icon, layout, shape, size, space, spacing, state } from '../theme/tokens';
import CupRecordScreen from './CupRecordScreen';
import ScreenFrame, { ContentScrollContext } from './ScreenFrame';

/**
 * Records — 2a, the list of logged cups, newest first, grouped by month.
 * Reads from the database and refreshes whenever a cup is saved.
 *
 * Under the header, 2a's row: the search field and the filter button.
 *   - The field is only an opener (2a draws it idle): pressing it puts 8l
 *     (RecordsSearch) in the list's place, focused; Cancel brings the list back.
 *   - The filter button (IconButton, 2a's filter glyph) opens 2b (SortSheet,
 *     shown by AppShell over the bar: requestSortSheet).
 *     Its sort and group apply to this list; each launch starts from Newest
 *     first / Month (not stored). The button looks the same either way: V1
 *     has no filter, and its "in force" look is drawn with one (Design
 *     Round 10, 16; gaps.md 16).
 * Each group's header carries the sort's name on the right, as 2a's
 * "Newest first". Group "None" has one header with the sort's name alone.
 *
 * A row pushes the cup (2c, CupRecordScreen) over the list, which stays
 * mounted: Back, a swipe from the left edge, or the Records icon returns to it.
 * 2c's pencil asks ShellStack for 11a (over the bottom bar); a delete there
 * closes the cup here.
 *
 * Under the search row, the category chips (2a; built 2026-10-23, Design
 * Round 13, E): All / I made it / Barista / Packaged, one at a time,
 * 8l's SegmentedControl (44 tall; the board's 25-tall outline chips are
 * under the tap target). The chip picks the cups; 2b's sort and group then
 * arrange them. Each launch starts from All (not stored, as the sort). All
 * four always show, so none moves when one has no cups. 8l ignores the chip.
 *   - Switching chips starts the list again from the top: each chip shows
 *     a different list (E1).
 *   - The header's "N Cups" counts the cups shown, so it always matches the
 *     list; "0 Cups" on an empty chip (E3).
 *   - A chip with no cups: one line for its type, the fact only, where the
 *     first row would be, body text.secondary (E4; CATEGORY_EMPTY).
 *   - Pinned (Uryu, 2026-10-24): the chips stay under the header, and each
 *     group heading under the chips until the next one pushes it up
 *     (pinFrom, below). Without it the chips scroll away and can't be
 *     switched from deep in the list.
 *
 * Row content follows the data model, degrading by mode (drift.md D-16):
 *   title   made_it → bean name · barista → drink · packaged → product name
 *   source  made_it → roaster · process · barista → place · packaged → brand
 * The brew-category badge (FILTER / ESPRESSO / COLD BREW) is not shown: it has
 * no column yet (gaps.md 10).
 */


/**
 * Pinned blocks (Uryu, 2026-10-24): the chips stay under the header once the
 * list scrolls past them, and each group's heading stays under the chips
 * until the next heading pushes it up; scrolling back, both return with the
 * content. Built on ScreenFrame's ContentScrollContext (RN's
 * stickyHeaderIndices pins one block at a time, and only a direct child of
 * the ScrollView). A pinned block hides the rows passing under it (with no
 * fill their text overlapped: Uryu, on device): surface.ground edge to edge,
 * with the page's dots drawn in it and lined up with the page's
 * (AlignedDotTexture), so it still reads as the page. The line between a
 * heading and its first row belongs to the heading, so it stays while the
 * heading is pinned. Not in the board, which scrolls everything.
 */
function pinFrom(scroll, from, travel) {
  if (!scroll || from == null) return null;
  scroll = scroll.under;
  if (travel == null) {
    // No end: once reached, it stays.
    return scroll.interpolate({ inputRange: [from, from + 1], outputRange: [0, 1], extrapolateLeft: 'clamp' });
  }
  if (!(travel > 0)) return null;
  return scroll.interpolate({ inputRange: [from, from + travel], outputRange: [0, travel], extrapolate: 'clamp' });
}

/**
 * A pinned block's top on screen, for its dots: the page's top + its y in
 * the page + how far it has pinned.
 */
function usePinnedTop(scroll, pageY, pin) {
  return useMemo(() => {
    if (!scroll || pageY == null) return null;
    const base = Animated.add(scroll.pageTop, pageY);
    return pin ? Animated.add(base, pin) : base;
  }, [scroll, pageY, pin]);
}

/** One group: its heading pins under the chips (`top`) until the group ends. */
function RecordGroup({ group, sort, top, listY, onOpen }) {
  const scroll = useContext(ContentScrollContext);
  const [box, setBox] = useState(null); // { y, h, head }
  const measure = (key) => (e) => {
    const v = key === 'head' ? e.nativeEvent.layout.height : e.nativeEvent.layout;
    setBox((prev) => {
      const next = { ...prev, ...(key === 'head' ? { head: v } : { y: v.y, h: v.height }) };
      return prev && prev.y === next.y && prev.h === next.h && prev.head === next.head ? prev : next;
    });
  };
  const ready = box && box.head != null && box.y != null && listY != null && top != null;
  const from = ready ? listY + box.y - top : null;
  const travel = ready ? box.h - box.head : null;
  const pin = useMemo(() => (from == null ? null : pinFrom(scroll, from, travel)), [scroll, from, travel]);
  const screenTop = usePinnedTop(scroll, ready ? listY + box.y : null, pin);
  return (
    <View onLayout={measure('group')}>
      <Animated.View onLayout={measure('head')} style={[styles.pinned, styles.head, pin && { transform: [{ translateY: pin }] }]}>
        {screenTop ? <AlignedDotTexture y={screenTop} /> : null}
        <View style={[styles.month, styles.headLine]}>
          {group.label ? (
            <Text variant="labelEyebrow" color="accent" style={styles.groupLabel} numberOfLines={1}>
              {group.label}
            </Text>
          ) : (
            <View />
          )}
          <Text variant="labelEyebrow" color="muted">
            {sortLabel(sort)}
          </Text>
        </View>
      </Animated.View>
      {group.cups.map((cup) => {
        const { title, source } = cupTitle(cup);
        return (
          <RecordRow
            key={cup.id}
            title={title}
            badges={[MODE_BADGE[cup.mode]]}
            source={source}
            note={tidyNote(cup.note) || undefined}
            rating={cup.rating}
            date={dayFormat.format(new Date(cup.logged_at))}
            onPress={() => onOpen(cup.id)}
          />
        );
      })}
    </View>
  );
}

/** The chips' band: pins under the header once reached (it never unpins). */
function PinnedChips({ category, onChange, onMeasure }) {
  const scroll = useContext(ContentScrollContext);
  const [y, setY] = useState(null);
  const pin = useMemo(() => pinFrom(scroll, y, null), [scroll, y]);
  const screenTop = usePinnedTop(scroll, y, pin);
  return (
    <Animated.View
      onLayout={(e) => {
        const { y: at, height } = e.nativeEvent.layout;
        setY((prev) => (prev === at ? prev : at));
        onMeasure(height);
      }}
      style={[styles.chips, styles.pinned, pin && { transform: [{ translateY: pin }] }]}>
      {screenTop ? <AlignedDotTexture y={screenTop} /> : null}
      <SegmentedControl options={CATEGORIES} value={category} onChange={onChange} />
    </Animated.View>
  );
}

const countFormat = new Intl.NumberFormat();
const dayFormat = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' });
const monthFormat = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' });

export default function RecordsScreen() {
  const db = useDatabase();
  const [cups, setCups] = useState(null);
  const [openId, setOpenId] = useState(null);
  const [order, setOrder] = useState({ sort: DEFAULT_SORT, group: DEFAULT_GROUP });
  const [category, setCategory] = useState(DEFAULT_CATEGORY);
  const [searching, setSearching] = useState(false);
  const scrollRef = useRef(null);
  // The chips' band height (where headings pin) and the list's y in the page.
  const [chipsH, setChipsH] = useState(null);
  const [listY, setListY] = useState(null);
  const pickCategory = (next) => {
    if (next === category) return;
    setCategory(next);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };
  const shown = useMemo(() => (cups ? cupsInCategory(cups, category) : null), [cups, category]);
  const groups = useMemo(() => (shown ? arrangeCups(shown, order.sort, order.group, monthFormat) : null), [shown, order]);

  const load = useCallback(() => {
    listCups(db).then(setCups, (error) => {
      console.error('[records] could not read cups', error);
      setCups([]);
      Alert.alert("Couldn't read your cups", String(error?.message ?? error));
    });
  }, [db]);

  useEffect(() => {
    load();
    return onCupsChanged(load);
  }, [load]);

  // 5c's "See this record" opens the cup here; the Records icon pressed while
  // a cup is open returns to the list (2026-10-12).
  useEffect(() => onOpenCupRequest(setOpenId), []);
  useEffect(
    () =>
      onTabReset((tab) => {
        if (tab !== 'records') return;
        setOpenId(null);
        setSearching(false);
      }),
    []
  );
  useEffect(() => onCloseCupRequest(() => setOpenId(null)), []);

  return (
    <View style={styles.screen}>
      {searching ? (
        <RecordsSearch cups={cups ?? []} onOpen={setOpenId} onCancel={() => setSearching(false)} />
      ) : (
        <ScreenFrame
          scroll
          eyebrow="The archive"
          title="Records"
          scrollRef={scrollRef}
          // 2a's count: numeral over "Cups", the cups shown (the chip's;
          // Design Round 13, E3). Shown once the cups are read.
          // TODO(i18n): plural rules beyond English's one / other.
          stat={shown ? { value: countFormat.format(shown.length), label: shown.length === 1 ? 'Cup' : 'Cups' } : undefined}>
          <View style={styles.tools}>
            <Pressable
              onPress={() => setSearching(true)}
              accessibilityRole="search"
              accessibilityLabel="Search my cups"
              style={({ pressed }) => [styles.field, pressed && styles.fieldPressed]}>
              <Glyph name="search" token={icon.md} color={color.text.primary} />
              <Text variant="body" color="placeholder">
                Search my cups
              </Text>
            </Pressable>
            <IconButton icon="filter" accessibilityLabel="Sort and group" onPress={() => requestSortSheet({ sort: order.sort, group: order.group, onApply: setOrder })} />
          </View>
          <PinnedChips category={category} onChange={pickCategory} onMeasure={(h) => setChipsH((prev) => (prev === h ? prev : h))} />
          <View
            style={styles.list}
            onLayout={(e) => {
              const at = e.nativeEvent.layout.y;
              setListY((prev) => (prev === at ? prev : at));
            }}>
            {cups && cups.length === 0 ? (
              // TODO(design): no empty state is designed (gaps.md 5); the plainest
              // honest placeholder until one is.
              <Text variant="body" color="muted">
                No cups logged yet.
              </Text>
            ) : shown && shown.length === 0 ? (
              <Text variant="body" color="secondary">
                {CATEGORY_EMPTY[category]}
              </Text>
            ) : null}
            {groups
              ? groups.map((group) => (
                  <RecordGroup key={group.key} group={group} sort={order.sort} top={chipsH} listY={listY} onOpen={setOpenId} />
                ))
              : null}
          </View>
        </ScreenFrame>
      )}
      {openId != null ? (
        <PushedScreen key={openId} onBack={() => setOpenId(null)}>
          {(goBack) => <CupRecordScreen id={openId} onBack={goBack} onEdit={(cup) => requestPush({ name: 'editCup', cup })} />}
        </PushedScreen>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  tools: {
    flexDirection: 'row',
    gap: spacing.gap.row,
  },
  // The band keeps the spacing inside it, so pinned it still has room above
  // and below: gap.section from the search row, 8l's 16 to the list.
  chips: {
    paddingTop: spacing.gap.section,
    paddingBottom: space[16],
    zIndex: 2,
  },
  // A pinned block: opaque from the screen's left edge to its right (it
  // starts at the page's left edge, as AlignedDotTexture needs), clipping
  // the texture's overhang.
  pinned: {
    marginHorizontal: -layout.gutter,
    paddingHorizontal: layout.gutter,
    backgroundColor: color.surface.ground,
    overflow: 'hidden',
  },
  head: {
    zIndex: 1,
  },
  // The heading carries the hairline under it (RecordRow's `first` line,
  // moved here), at the content's width, so a pinned heading keeps it.
  headLine: {
    borderBottomWidth: shape.borderWidth.divider,
    borderBottomColor: color.divider.hairlineStrong,
  },
  // 2a's idle search field: SearchField's frame at 2a's 44 (size.tapTarget,
  // beside the 44 filter button), the placeholder in body.
  field: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.gap.row,
    height: size.tapTarget,
    paddingHorizontal: space[12],
    borderWidth: shape.borderWidth.box,
    borderColor: color.border.strong,
    backgroundColor: color.surface.raised,
  },
  fieldPressed: {
    backgroundColor: state.pressed.surface,
  },
  groupLabel: {
    flexShrink: 1,
  },
  list: {
    zIndex: 1,
    // Room under the last row so the bottom bar never covers it (§9 Bottom bar).
    paddingBottom: layout.empty.block,
  },
  month: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.gap.row,
    paddingBottom: spacing.gap.row,
  },
});
