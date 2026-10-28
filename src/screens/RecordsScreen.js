import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import Glyph from '../components/base/Glyph';
import IconButton from '../components/base/IconButton';
import Text from '../components/base/Text';
import RecordGroup from '../components/RecordGroup';
import RecordsSearch, { SEARCH_PLACEHOLDER } from '../components/RecordsSearch';
import { DEFAULT_GROUP, DEFAULT_SORT, arrangeCups } from '../constants/records';
import { useDatabase } from '../data/DatabaseProvider';
import { listCups, onCupsChanged } from '../data/repository';
import { onCloseCupRequest, onOpenCupRequest, onTabLeave, onTabReset, requestPush, requestSortSheet } from '../navigation';
import PushedScreen from '../components/PushedScreen';
import { color, icon, layout, shape, size, space, spacing, state } from '../theme/tokens';
import CupRecordScreen from './CupRecordScreen';
import ScreenFrame from './ScreenFrame';

/**
 * Records — 2a, the list of logged cups, newest first, grouped by month.
 * Reads from the database and refreshes whenever a cup is saved.
 *
 * Under the header, 2a's row: the search field and the filter button.
 *   - The field is only an opener (2a draws it idle): pressing it puts
 *     search (RecordsSearch, Design Round 15) in the list's place, focused;
 *     Cancel brings the list back, and so does leaving the Records tab
 *     (Uryu, 2026-10-28). It says what search finds, as search's own field
 *     does.
 *   - The filter button (IconButton, 2a's filter glyph) opens 2b (SortSheet,
 *     shown by AppShell over the bar: requestSortSheet).
 *     Its sort and group apply to this list; each launch starts from Newest
 *     first / Month (not stored). The button looks the same either way: V1
 *     has no filter, and its "in force" look is drawn with one (Design
 *     Round 10, 16; gaps.md 16).
 * Each group's header carries the sort's name on the right, as 2a's
 * "Newest first". Group "None" has one header with the sort's name alone.
 * Each heading pins under the header until the next one pushes it up
 * (RecordGroup; Uryu, 2026-10-24).
 *
 * A row pushes the cup (2c, CupRecordScreen) over the list, which stays
 * mounted: Back, a swipe from the left edge, or the Records icon returns to it.
 * 2c's pencil asks ShellStack for 11a (over the bottom bar); a delete there
 * closes the cup here.
 *
 * No category chips since Design Round 15 ("2a: remove the chip row"):
 * search's Kind chips filter by mode (18a), and 2a is the archive itself,
 * header, search, list. The header's "N Cups" counts every cup.
 *
 * Row content follows the data model, degrading by mode (drift.md D-16):
 *   title   made_it → bean name · barista → drink · packaged → product name
 *   source  made_it → roaster · process · barista → place · packaged → brand
 * The brew-category badge (FILTER / ESPRESSO / COLD BREW) is not shown: it has
 * no column yet (gaps.md 10).
 */


const countFormat = new Intl.NumberFormat();
const monthFormat = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' });

export default function RecordsScreen() {
  const db = useDatabase();
  const [cups, setCups] = useState(null);
  const [openId, setOpenId] = useState(null);
  const [order, setOrder] = useState({ sort: DEFAULT_SORT, group: DEFAULT_GROUP });
  const [searching, setSearching] = useState(false);
  // The list's y in the page (where its headings start to pin).
  const [listY, setListY] = useState(null);
  const groups = useMemo(() => (cups ? arrangeCups(cups, order.sort, order.group, monthFormat) : null), [cups, order]);

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
  // Leaving Records closes the search: coming back shows the list (Uryu,
  // 2026-10-28). An open cup stays, as before.
  useEffect(
    () =>
      onTabLeave((tab) => {
        if (tab === 'records') setSearching(false);
      }),
    []
  );

  return (
    <View style={styles.screen}>
      {searching ? (
        <RecordsSearch onOpenCup={setOpenId} onCancel={() => setSearching(false)} />
      ) : (
        <ScreenFrame
          scroll
          eyebrow="The archive"
          title="Records"
          // 2a's count: numeral over "Cups". Shown once the cups are read.
          // TODO(i18n): plural rules beyond English's one / other.
          stat={cups ? { value: countFormat.format(cups.length), label: cups.length === 1 ? 'Cup' : 'Cups' } : undefined}>
          <View style={styles.tools}>
            <Pressable
              onPress={() => setSearching(true)}
              accessibilityRole="search"
              accessibilityLabel="Search"
              accessibilityHint={SEARCH_PLACEHOLDER}
              style={({ pressed }) => [styles.field, pressed && styles.fieldPressed]}>
              <Glyph name="search" token={icon.md} color={color.text.primary} />
              <Text variant="body" color="placeholder" numberOfLines={1} style={styles.fieldText}>
                {SEARCH_PLACEHOLDER}
              </Text>
            </Pressable>
            <IconButton icon="filter" accessibilityLabel="Sort and group" onPress={() => requestSortSheet({ sort: order.sort, group: order.group, onApply: setOrder })} />
          </View>
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
            ) : null}
            {groups
              ? groups.map((group) => (
                  <RecordGroup key={group.key} group={group} sort={order.sort} top={0} listY={listY} onOpen={setOpenId} />
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
  fieldText: {
    flex: 1,
  },
  // 8l's 16 from the search row to the list (it sat under the chips).
  list: {
    paddingTop: space[16],
    zIndex: 1,
    // Room under the last row so the bottom bar never covers it (§9 Bottom bar).
    paddingBottom: layout.empty.block,
  },
});
