import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Keyboard, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MODE_BADGE, cupTitle, tidyNote } from '../constants/cups';
import { DEFAULT_GROUP, DEFAULT_SORT, arrangeCups } from '../constants/records';
import {
  ALL_SECTIONS,
  KINDS,
  RATINGS,
  TABS,
  bagLine,
  cupCount,
  cupsForFilter,
  filterEmpty,
  flavourChips,
  kindFilter,
  noTabMatches,
  nothingMatches,
  ratingFilter,
  searchText,
  suggestions,
} from '../constants/search';
import { useDatabase } from '../data/DatabaseProvider';
import {
  addSearchTerm,
  clearSearchTerms,
  listAllBags,
  listCups,
  listGearWithUse,
  listSearchTerms,
  onCupsChanged,
  onShelfChanged,
} from '../data/repository';
import { requestPush, requestSortSheet } from '../navigation';
import { color, icon, layout, shape, size, space, spacing, state } from '../theme/tokens';
import Button from './base/Button';
import FilterToken from './base/FilterToken';
import Glyph from './base/Glyph';
import IconButton from './base/IconButton';
import ItemRow from './base/ItemRow';
import RecordRow from './base/RecordRow';
import SearchField from './base/SearchField';
import SectionLabel from './base/SectionLabel';
import SegmentedControl from './base/SegmentedControl';
import Text from './base/Text';
import { gearLine } from './GearList';
import RecordGroup from './RecordGroup';
import { Tab } from './ShelfTabs';

/** What search finds, in its field and in 2a's opener (18a). */
export const SEARCH_PLACEHOLDER = 'Cups, beans, gear, words';

/**
 * Search (Design Round 15, 18a–18f, 18x; replaces 8l). It takes 2a's place
 * when 2a's field is pressed (Cancel brings 2a back), and it is pushed over
 * everything by a bag or gear page's "All N cups ›" (ShellStack 'search',
 * with that bag or gear as a block).
 *
 * Header: SearchField (focused on open from 2a) and "Cancel". The field
 * holds either typed text or one block (FilterToken), never both (18x):
 *   - a Kind or Rating chip puts its block in the field; × or backspace
 *     removes it; typing replaces it with the text
 *   - a flavour chip, a recent search or a term row puts plain text in it
 *     and searches at once
 *
 * What shows under it:
 *   start    (empty field, no block; 18a / 18b) groups in a fixed order:
 *            Kind, Rating (always there), Flavours I use most (top 6, each
 *            on 2+ cups), Recent searches (the last 5 typed, clock rows,
 *            "Clear" at once). A group with nothing in it doesn't show,
 *            heading included; no hint line.
 *   typing   (text not yet searched; 18c) up to 3 hits (thumbnail, the kind
 *            first in the meta line, ›: they open that thing), a hairline,
 *            then the terms (magnifier, typed part in ink, the rest muted, no
 *            ›: they search). No headings.
 *   results  (text searched: the keyboard's Search, or a term; 18d) five
 *            tabs, Home's tab on a hairline: ALL (no count), CUPS, WORDS,
 *            BEANS, GEAR, a 0 kept so the row never moves. ALL's sections:
 *            Beans, Gear, Words, Cups (2, 2, 3, 3 rows), empty ones left
 *            out, "More cups · N ›" switches tab. Nothing at all: no tabs,
 *            "Nothing matches “xyz”." An empty tab: "No gear matches “guji”."
 *            Searching records the text in Recent searches.
 *   filter   (a block; 18e / 18f) the archive's shape: the count line ("14
 *            cups", E3) with 2a's filter button (2b's sort and group, each
 *            search from Newest first / Month), then 2a's month groups. No
 *            tabs. No cups: E4's line, and for a rating the ratings given
 *            most.
 *
 * A bean row opens its bag page (3g, 19a), a gear row its page (3e, 19c),
 * a cup row 2c (onOpenCup); each puts the keyboard away first.
 *
 * Props: onOpenCup(id), onCancel, filter (optional block to start with),
 *        autoFocus (default true)
 */
export default function RecordsSearch({ onOpenCup, onCancel, filter: startFilter = null, autoFocus = true }) {
  const db = useDatabase();
  const insets = useSafeAreaInsets();
  const field = useRef(null);
  const scroll = useRef(null);
  const [data, setData] = useState({ cups: [], bags: [], gear: [] });
  const [history, setHistory] = useState([]);
  const [text, setText] = useState('');
  const [filter, setFilter] = useState(startFilter);
  const [submitted, setSubmitted] = useState(false);
  const [tab, setTab] = useState('all');
  const [order, setOrder] = useState({ sort: DEFAULT_SORT, group: DEFAULT_GROUP });

  const load = useCallback(() => {
    Promise.all([listCups(db), listAllBags(db), listGearWithUse(db)]).then(
      ([cups, bags, gear]) => setData({ cups, bags, gear }),
      (error) => {
        console.error('[search] could not read', error);
        Alert.alert("Couldn't read your cups", String(error?.message ?? error));
      }
    );
  }, [db]);
  const loadHistory = useCallback(() => {
    listSearchTerms(db).then(setHistory, (error) => console.error('[search] could not read the history', error));
  }, [db]);
  useEffect(() => {
    load();
    loadHistory();
    const offCups = onCupsChanged(load);
    const offShelf = onShelfChanged(load);
    return () => {
      offCups();
      offShelf();
    };
  }, [load, loadHistory]);

  const query = text.trim();
  const mode = filter ? 'filter' : !query ? 'start' : submitted ? 'results' : 'typing';
  const toTop = () => scroll.current?.scrollTo({ y: 0, animated: false });

  const changeText = (next) => {
    // Typing replaces a block with the text (18x).
    if (filter) setFilter(null);
    setText(next);
    setSubmitted(false);
  };
  const search = (term) => {
    const t = term.trim();
    if (!t) return;
    Keyboard.dismiss();
    setFilter(null);
    setText(t);
    setSubmitted(true);
    setTab('all');
    toTop();
    addSearchTerm(db, t).then(loadHistory, (error) => console.error('[search] could not keep the term', error));
  };
  const pickFilter = (next) => {
    Keyboard.dismiss();
    setText('');
    setSubmitted(false);
    setFilter(next);
    setOrder({ sort: DEFAULT_SORT, group: DEFAULT_GROUP });
    toTop();
  };
  const removeFilter = () => {
    setFilter(null);
    field.current?.focus();
  };
  const clearHistory = () => {
    setHistory([]);
    clearSearchTerms(db).catch((error) => console.error('[search] could not clear the history', error));
  };
  // Opening a result puts the keyboard away first: the page comes in over
  // the search, whose field would otherwise keep it up (Uryu, 2026-10-28).
  const openBag = (bag) => {
    Keyboard.dismiss();
    requestPush({ name: 'editBag', bag });
  };
  const openGear = (gear) => {
    Keyboard.dismiss();
    requestPush({ name: 'editGear', gear });
  };
  const openCup = (id) => {
    Keyboard.dismiss();
    onOpenCup(id);
  };

  return (
    <View style={[styles.screen, { paddingTop: Math.max(insets.top, layout.screen.top) }]}>
      <View style={styles.header}>
        <SearchField
          ref={field}
          value={text}
          onChangeText={changeText}
          placeholder={SEARCH_PLACEHOLDER}
          accessibilityLabel="Search"
          autoFocus={autoFocus && !startFilter}
          returnKeyType="search"
          onSubmitEditing={() => search(text)}
          onKeyPress={(e) => {
            if (filter && !text && e.nativeEvent.key === 'Backspace') setFilter(null);
          }}
          token={filter ? <FilterToken label={filter.label} onRemove={removeFilter} /> : null}
        />
        <Button variant="text" label="Cancel" onPress={onCancel} />
      </View>
      <ScrollView
        ref={scroll}
        style={styles.body}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag">
        {mode === 'start' ? <Start cups={data.cups} history={history} onFilter={pickFilter} onSearch={search} onClear={clearHistory} /> : null}
        {mode === 'typing' ? (
          <Typing query={query} {...suggestions(query, data, history)} onSearch={search} onBag={openBag} onGear={openGear} onCup={openCup} />
        ) : null}
        {mode === 'results' ? (
          <Results query={query} data={data} tab={tab} onTab={(next) => (setTab(next), toTop())} onBag={openBag} onGear={openGear} onCup={openCup} />
        ) : null}
        {mode === 'filter' ? <Filtered filter={filter} cups={data.cups} order={order} onOrder={setOrder} onCup={openCup} /> : null}
      </ScrollView>
    </View>
  );
}

/** 18a / 18b: Kind, Rating, Flavours I use most, Recent searches. */
function Start({ cups, history, onFilter, onSearch, onClear }) {
  const flavours = useMemo(() => flavourChips(cups), [cups]);
  return (
    <View style={styles.groups}>
      <View style={styles.group}>
        <SectionLabel variant="plain" label="Kind" />
        <SegmentedControl compact options={KINDS} value={null} onChange={(v) => onFilter(kindFilter(v))} />
      </View>
      <View style={styles.group}>
        <SectionLabel variant="plain" label="Rating" />
        <View style={styles.ratings} accessibilityRole="radiogroup">
          {RATINGS.map((r) => (
            <Pressable
              key={r}
              onPress={() => onFilter(ratingFilter(r))}
              accessibilityRole="button"
              accessibilityLabel={`${r} star cups`}
              style={({ pressed }) => [styles.rating, pressed && styles.chipPressed]}>
              <Text variant="numeralInline">{String(r)}</Text>
              <Glyph name="star" token={icon.fill.sm} filled />
            </Pressable>
          ))}
        </View>
      </View>
      {flavours.length ? (
        <View style={styles.group}>
          <SectionLabel variant="plain" label="Flavours I use most" />
          <View style={styles.chips}>
            {flavours.map((tag) => (
              <Pressable
                key={tag}
                onPress={() => onSearch(tag)}
                accessibilityRole="button"
                hitSlop={CHIP_HIT_SLOP}
                style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}>
                <Text variant="meta" color="primary">
                  {tag}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}
      {history.length ? (
        <View>
          <View style={styles.historyHead}>
            <SectionLabel variant="plain" label="Recent searches" />
            <Button variant="text" label="Clear" onPress={onClear} />
          </View>
          {history.map((term) => (
            <Pressable key={term} onPress={() => onSearch(term)} accessibilityRole="button" style={({ pressed }) => [styles.lineRow, pressed && styles.rowPressed]}>
              <Glyph name="clock" token={icon.sm} color={color.text.muted} />
              <Text variant="label" color="primary" numberOfLines={1} style={styles.lineText}>
                {term}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

/** 18c: hits, a hairline, terms. */
function Typing({ query, hits, terms, onSearch, onBag, onGear, onCup }) {
  const q = query.toLowerCase();
  const open = (hit) => (hit.type === 'bag' ? onBag(hit.item) : hit.type === 'gear' ? onGear(hit.item) : onCup(hit.item.id));
  return (
    <View>
      {hits.map((hit) => (
        <ItemRow key={hit.key} title={hit.title} meta={hit.meta} onPress={() => open(hit)} />
      ))}
      {hits.length && terms.length ? <View style={styles.rule} /> : null}
      {terms.map((term) => (
        <Pressable key={term} onPress={() => onSearch(term)} accessibilityRole="button" accessibilityLabel={`Search ${term}`} style={({ pressed }) => [styles.lineRow, pressed && styles.rowPressed]}>
          <Glyph name="search" token={icon.sm} color={color.text.muted} />
          <Text variant="label" color="muted" numberOfLines={1} style={styles.lineText}>
            <Text variant="label" color="primary">
              {term.slice(0, q.length)}
            </Text>
            {term.slice(q.length)}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

/** 18d (and 18f's text cases). */
function Results({ query, data, tab, onTab, onBag, onGear, onCup }) {
  const found = useMemo(() => searchText(query, data), [query, data]);
  const total = found.beans.length + found.gear.length + found.words.length + found.cups.length;
  if (!total) {
    return (
      <Text variant="body" color="secondary">
        {nothingMatches(query)}
      </Text>
    );
  }
  const rows = (key, list) =>
    list.map((item) => {
      if (key === 'beans') return <ItemRow key={item.id} title={item.name} meta={bagLine(item)} onPress={() => onBag(item)} />;
      if (key === 'gear') return <ItemRow key={item.id} title={item.name} meta={gearLine(item)} onPress={() => onGear(item)} />;
      return <CupRow key={item.id} cup={item} onPress={() => onCup(item.id)} />;
    });
  return (
    <View style={styles.results}>
      <View style={styles.tabBar}>
        <View style={styles.tabLine} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.tabs}>
          {TABS.map((t) => (
            <Tab key={t.key} label={t.label} count={t.key === 'all' ? undefined : found[t.key].length} on={tab === t.key} underline={tab === t.key ? 1 : 0} onPress={() => onTab(t.key)} />
          ))}
        </ScrollView>
      </View>
      {tab === 'all' ? (
        ALL_SECTIONS.filter((s) => found[s.key].length).map((s) => {
          const list = found[s.key];
          return (
            <View key={s.key} style={styles.section}>
              <SectionLabel variant="plain" label={`${s.label} · ${list.length}`} />
              <View>{rows(s.key, list.slice(0, s.rows))}</View>
              {list.length > s.rows ? (
                <View style={styles.more}>
                  <Button variant="text" label={`More ${s.label.toLowerCase()} · ${list.length}`} trailingIcon="chevronRight" onPress={() => onTab(s.key)} />
                </View>
              ) : null}
            </View>
          );
        })
      ) : found[tab].length ? (
        <View>{rows(tab, found[tab])}</View>
      ) : (
        <Text variant="body" color="secondary">
          {noTabMatches(tab, query)}
        </Text>
      )}
    </View>
  );
}

const dayFormat = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' });
const monthFormat = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' });

/** 2a's row, as 8l listed its cups. */
function CupRow({ cup, onPress }) {
  const { title, source } = cupTitle(cup);
  return (
    <RecordRow
      title={title}
      badges={[MODE_BADGE[cup.mode]]}
      source={source}
      note={tidyNote(cup.note) || undefined}
      rating={cup.rating}
      date={dayFormat.format(new Date(cup.logged_at))}
      onPress={onPress}
    />
  );
}

/** 18e / 18f: a block's cups in the archive's shape. */
function Filtered({ filter, cups, order, onOrder, onCup }) {
  const shown = useMemo(() => cupsForFilter(cups, filter), [cups, filter]);
  const groups = useMemo(() => arrangeCups(shown, order.sort, order.group, monthFormat), [shown, order]);
  if (!shown.length) {
    const { line, hint } = filterEmpty(filter, cups);
    return (
      <View style={styles.empty}>
        <Text variant="body" color="secondary">
          {line}
        </Text>
        {hint ? (
          <Text variant="bodySm" color="secondary">
            {hint}
          </Text>
        ) : null}
      </View>
    );
  }
  return (
    <View style={styles.results}>
      <View style={styles.countRow}>
        <Text variant="labelCaps" color="secondary" style={styles.count}>
          {cupCount(shown.length)}
        </Text>
        <IconButton icon="filter" accessibilityLabel="Sort and group" onPress={() => requestSortSheet({ sort: order.sort, group: order.group, onApply: onOrder })} />
      </View>
      <View>
        {groups.map((group) => (
          <RecordGroup key={group.key} group={group} sort={order.sort} onOpen={onCup} />
        ))}
      </View>
    </View>
  );
}

// The compact chip's hit-slop back to 44 (SegmentedControl's COMPACT_SLOP).
const CHIP_SLOP = spacing.inset.control.v - spacing.inset.controlCompact.v;
const CHIP_HIT_SLOP = { top: CHIP_SLOP, bottom: CHIP_SLOP };

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.gap.row,
    paddingHorizontal: layout.gutter,
    paddingBottom: space[14],
  },
  body: {
    flex: 1,
  },
  content: {
    paddingHorizontal: layout.gutter,
    paddingTop: space[6],
    // Room under the last row so the bottom bar never covers it (§9 Bottom bar).
    paddingBottom: layout.empty.block,
  },
  // 18a: the groups space.20 apart (the shelf's page gap), each heading
  // gap.row over its chips.
  groups: {
    gap: space[20],
  },
  group: {
    gap: spacing.gap.row,
  },
  // Five equal boxes on one line: 18a's 1★ … 5★, the chips' frame at 44.
  ratings: {
    flexDirection: 'row',
    gap: spacing.gap.controlCompact,
  },
  rating: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.gap.tight,
    height: size.tapTarget,
    borderWidth: shape.borderWidth.divider,
    borderColor: color.border.muted,
    backgroundColor: color.badge.bg.raised,
  },
  // Flavour chips: the compact chip's frame, the tag in lower case (meta).
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.gap.controlCompact,
  },
  chip: {
    justifyContent: 'center',
    minWidth: size.tapTarget,
    paddingVertical: spacing.inset.controlCompact.v,
    paddingHorizontal: spacing.inset.controlCompact.h,
    borderWidth: shape.borderWidth.divider,
    borderColor: color.border.muted,
    backgroundColor: color.badge.bg.raised,
  },
  chipPressed: {
    backgroundColor: state.pressed.surface,
  },
  historyHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  // A recent search or a term: glyph + text, a 44 row; the press fills it
  // across the screen (out through the gutter), as a list row.
  lineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
    minHeight: size.tapTarget,
    marginHorizontal: -layout.gutter,
    paddingHorizontal: layout.gutter,
  },
  rowPressed: {
    backgroundColor: state.pressed.row,
  },
  lineText: {
    flex: 1,
  },
  // 18c: the hairline between hits and terms.
  rule: {
    height: shape.borderWidth.divider,
    backgroundColor: color.divider.hairlineStrong,
    marginVertical: spacing.gap.row,
  },
  results: {
    gap: spacing.gap.section,
  },
  // 18d: the tabs run on a hairline across the screen. The open tab's
  // underline (2) lies over the line (1.5), on its foot: drawn under the
  // tabs, since the row scrolls sideways and can't overlap what is below it
  // (ShelfTabs' TAB_OVERLAP).
  tabBar: {
    marginHorizontal: -layout.gutter,
  },
  tabLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: shape.borderWidth.divider,
    backgroundColor: color.divider.hairlineStrong,
  },
  tabs: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: space[20],
    paddingHorizontal: layout.gutter,
  },
  section: {
    gap: spacing.gap.tight,
  },
  more: {
    alignItems: 'flex-start',
  },
  empty: {
    gap: spacing.gap.tight,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.gap.row,
  },
  count: {
    flexShrink: 1,
  },
});
