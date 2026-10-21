import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import Glyph from '../components/base/Glyph';
import IconButton from '../components/base/IconButton';
import RecordRow from '../components/base/RecordRow';
import Text from '../components/base/Text';
import RecordsSearch from '../components/RecordsSearch';
import { DEFAULT_GROUP, DEFAULT_SORT, arrangeCups, sortLabel } from '../constants/records';
import { useDatabase } from '../data/DatabaseProvider';
import { listCups, onCupsChanged } from '../data/repository';
import { MODE_BADGE, cupTitle, tidyNote } from '../constants/cups';
import { onCloseCupRequest, onOpenCupRequest, onTabReset, requestPush, requestSortSheet } from '../navigation';
import PushedScreen from '../components/PushedScreen';
import { color, icon, layout, shape, size, space, spacing, state } from '../theme/tokens';
import CupRecordScreen from './CupRecordScreen';
import ScreenFrame from './ScreenFrame';

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
 * closes the cup here. Not built here: the category chips (All / I made it / …).
 *
 * Row content follows the data model, degrading by mode (drift.md D-16):
 *   title   made_it → bean name · barista → drink · packaged → product name
 *   source  made_it → roaster · process · barista → place · packaged → brand
 * The brew-category badge (FILTER / ESPRESSO / COLD BREW) is not shown: it has
 * no column yet (gaps.md 10).
 */


const countFormat = new Intl.NumberFormat();
const dayFormat = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' });
const monthFormat = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' });

export default function RecordsScreen() {
  const db = useDatabase();
  const [cups, setCups] = useState(null);
  const [openId, setOpenId] = useState(null);
  const [order, setOrder] = useState({ sort: DEFAULT_SORT, group: DEFAULT_GROUP });
  const [searching, setSearching] = useState(false);
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

  return (
    <View style={styles.screen}>
      {searching ? (
        <RecordsSearch cups={cups ?? []} onOpen={setOpenId} onCancel={() => setSearching(false)} />
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
              accessibilityLabel="Search my cups"
              style={({ pressed }) => [styles.field, pressed && styles.fieldPressed]}>
              <Glyph name="search" token={icon.md} color={color.text.primary} />
              <Text variant="body" color="placeholder">
                Search my cups
              </Text>
            </Pressable>
            <IconButton icon="filter" accessibilityLabel="Sort and group" onPress={() => requestSortSheet({ sort: order.sort, group: order.group, onApply: setOrder })} />
          </View>
          <View style={styles.list}>
            {cups && cups.length === 0 ? (
              // TODO(design): no empty state is designed (gaps.md 5); the plainest
              // honest placeholder until one is.
              <Text variant="body" color="muted">
                No cups logged yet.
              </Text>
            ) : null}
            {groups
              ? groups.map((group) => (
                  <View key={group.key}>
                    <View style={styles.month}>
                      {group.label ? (
                        <Text variant="labelEyebrow" color="accent" style={styles.groupLabel} numberOfLines={1}>
                          {group.label}
                        </Text>
                      ) : (
                        <View />
                      )}
                      <Text variant="labelEyebrow" color="muted">
                        {sortLabel(order.sort)}
                      </Text>
                    </View>
                    {group.cups.map((cup, i) => {
                      const { title, source } = cupTitle(cup);
                      return (
                        <RecordRow
                          key={cup.id}
                          first={i === 0}
                          title={title}
                          badges={[MODE_BADGE[cup.mode]]}
                          source={source}
                          note={tidyNote(cup.note) || undefined}
                          rating={cup.rating}
                          date={dayFormat.format(new Date(cup.logged_at))}
                          onPress={() => setOpenId(cup.id)}
                        />
                      );
                    })}
                  </View>
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
    marginBottom: spacing.gap.section,
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
