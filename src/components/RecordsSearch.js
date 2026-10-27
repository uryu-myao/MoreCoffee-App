import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { layout, space, spacing } from '../theme/tokens';
import { SCOPES, searchCups, searchHeading } from '../constants/records';
import { MODE_BADGE, cupTitle, tidyNote } from '../constants/cups';
import Button from './base/Button';
import RecordRow from './base/RecordRow';
import SearchField from './base/SearchField';
import SegmentedControl from './base/SegmentedControl';
import Text from './base/Text';

/**
 * 8l, Records search: takes 2a's place when its search field is pressed, and
 * Cancel brings 2a back. Nothing about a search is kept: no recent
 * searches in V1 (Design Round 10, 22).
 *
 *   header   SearchField (focused on open) and "Cancel" (Button text); open
 *            at its foot, as every header since 2026-10-26 (8l drew a rule)
 *   scopes   SegmentedControl Words / Beans / Gear (Gear back with 3b / 3e),
 *            with "4★ and up" as its toggle chip (it combines with any scope)
 *   heading  body.sm with tabular numerals, text.secondary: "9 cups say
 *            "juicy"" (searchHeading; Design Round 10, 19). Nothing under
 *            "Nothing matches".
 *   results  2a's RecordRow, unframed (Design Round 11, C4: per-row frames
 *            are the noise Round 9 removed); newest first, flat (8l draws no
 *            groups). The first row draws the hairline under the heading.
 *
 * Each row is 2a's (title, mode badge, source, note, rating over date,
 * chevron). 8l's own row (title, "date · method · rating", an outline tag
 * with the text that matched) is gone with its frame. The matched text is
 * not shown (Uryu, 2026-10-23): beside the mode badge it read as a second
 * badge, and the row's own lines already hold most matches.
 *
 * Props: cups (listCups), onOpen(id), onCancel
 */
const dayFormat = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' });

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
              <View>
                {found.map(({ cup }, i) => {
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
                      onPress={() => onOpen(cup.id)}
                    />
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
});
