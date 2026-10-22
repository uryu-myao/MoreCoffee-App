import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { color, icon, layout, shape, space, spacing, state } from '../theme/tokens';
import { SCOPES, searchCups, searchHeading } from '../constants/records';
import { cupTitle } from '../constants/cups';
import Button from './base/Button';
import Glyph from './base/Glyph';
import SearchField from './base/SearchField';
import SegmentedControl from './base/SegmentedControl';
import Text from './base/Text';

/**
 * 8l, Records search: takes 2a's place when its search field is pressed, and
 * Cancel brings 2a back. Nothing about a search is kept: no recent
 * searches in V1 (Design Round 10, 22).
 *
 *   header   SearchField (focused on open) and "Cancel" (Button text), over a
 *            2px ink rule, as 8l's
 *   scopes   SegmentedControl Words / Beans / Gear (Gear back with 3b / 3e),
 *            with "4★ and up" as its toggle chip (it combines with any scope)
 *   heading  body.sm with tabular numerals, text.secondary: "9 cups say
 *            "juicy"" (searchHeading; Design Round 10, 19). Nothing under
 *            "Nothing matches".
 *   results  one 2px frame on raised; newest first, flat (8l draws no groups)
 *
 * Result row (8l's): title, then "date · method · rating" (meta, muted),
 * then the text that matched in an outline tag, and a chevron (§1: a whole
 * row is pressable → chevron; 8l has none, as D-49 for 2a). Set as
 * RadioList's rows: title / meta and inset.listRow, no item dividers (Design
 * Round 9). 8l sets the title 15 / 700 and the meta 12 / 500; the tag's
 * 11 / 700 lowercase label has no style, so `meta` stands in (words are
 * shown as typed, so no caps style fits).
 *
 * Props: cups (listCups), onOpen(id), onCancel
 */
const dayFormat = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' });

function resultLines(cup) {
  const { title } = cupTitle(cup);
  const where = cup.mode === 'made_it' ? cup.brew_method : cup.mode === 'barista' ? cup.place_name : null;
  const name = cup.mode === 'made_it' && cup.bean_name && cup.bean_process ? `${title} · ${cup.bean_process}` : title;
  const meta = [dayFormat.format(new Date(cup.logged_at)), where, cup.rating != null ? String(cup.rating) : null].filter(Boolean).join(' · ');
  return { name, meta };
}

export default function RecordsSearch({ cups, onOpen, onCancel }) {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState('words');
  const [fourUp, setFourUp] = useState(false);

  const search = { query, scope, fourUp };
  const found = useMemo(() => searchCups(cups, { query, scope, fourUp }), [cups, query, scope, fourUp]);
  // With nothing typed and 4★ off, no heading and no list (Design Round 10, 19).
  const active = Boolean(query.trim()) || fourUp;

  return (
    <View style={[styles.screen, { paddingTop: Math.max(insets.top, layout.screen.top) }]}>
      <View style={styles.header}>
        <SearchField value={query} onChangeText={setQuery} placeholder="Search my cups" autoFocus />
        <Button variant="text" label="Cancel" onPress={onCancel} />
      </View>
      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag">
        <SegmentedControl
          options={SCOPES}
          value={scope}
          onChange={setScope}
          toggle={{ label: '4★ and up', on: fourUp, onToggle: () => setFourUp((on) => !on) }}
        />
        {active ? (
          <View style={styles.results}>
            <Text variant="bodySmTabular" color="secondary" accessibilityRole="header">
              {searchHeading(found.length, search)}
            </Text>
            {found.length ? (
              <View style={styles.frame}>
                {found.map(({ cup, match }) => {
                  const { name, meta } = resultLines(cup);
                  return (
                    <Pressable
                      key={cup.id}
                      onPress={() => onOpen(cup.id)}
                      accessibilityRole="button"
                      accessibilityLabel={[name, meta, match].filter(Boolean).join(', ')}
                      style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
                      <View style={styles.text}>
                        <Text variant="title" color="primary" truncate="name">
                          {name}
                        </Text>
                        <Text variant="meta" color="muted" truncate="meta">
                          {meta}
                        </Text>
                      </View>
                      {match ? (
                        <View style={styles.tag}>
                          <Text variant="meta" color="secondary" numberOfLines={1}>
                            {match}
                          </Text>
                        </View>
                      ) : null}
                      <Glyph name="chevronRight" token={icon.md} color={color.text.primary} />
                    </Pressable>
                  );
                })}
              </View>
            ) : null}
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

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
    borderBottomWidth: shape.borderWidth.box,
    borderBottomColor: color.border.strong,
  },
  body: {
    flex: 1,
  },
  content: {
    paddingHorizontal: layout.gutter,
    paddingTop: space[14],
    // Room under the last row so the bottom bar never covers it (§9 Bottom bar).
    paddingBottom: layout.empty.block,
    gap: space[16],
  },
  results: {
    gap: spacing.gap.row,
  },
  frame: {
    borderWidth: shape.borderWidth.box,
    borderColor: color.border.strong,
    backgroundColor: color.surface.raised,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
    paddingVertical: spacing.inset.listRow.v,
    paddingHorizontal: spacing.inset.listRow.h,
  },
  pressed: {
    backgroundColor: state.pressed.row,
  },
  text: {
    flex: 1,
    minWidth: 0,
    gap: spacing.gap.tight,
  },
  tag: {
    flexShrink: 1,
    maxWidth: '40%',
    paddingVertical: space[6],
    paddingHorizontal: space[8],
    borderWidth: shape.borderWidth.divider,
    borderColor: color.border.muted,
  },
});
