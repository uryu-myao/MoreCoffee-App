import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import BottomSheet from './base/BottomSheet';
import Button from './base/Button';
import SearchField from './base/SearchField';
import { spacing } from '../theme/tokens';
import CheckboxList from './CheckboxList';

/**
 * Search sheet (decided 2026-10-10): BottomSheet (full) + SearchField + a
 * list. Built for the flavour tags first; the bag's Origin reuses it later.
 * Stage 3's bag / gear pickers are a separate component (no search, richer
 * rows).
 *
 * The sheet runs from under the status bar to the keyboard (BottomSheet
 * `full`): on an SE about 282pt / 5 rows stay above the keyboard.
 *
 * Matching: case-insensitive; items whose label starts with the query come
 * first, then other matches (`match` overrides; Origin will match aliases
 * through `searchText`). The caller orders `items`.
 * Add: when `onAdd` is set and the query, normalised, matches no item
 * exactly (ignoring case), the last row offers Add "Query".
 *
 * Closing: "Done" beside the field (8l's slot; 8l says "Cancel", but picks
 * apply as they are made, so nothing is cancelled. TODO: copy to confirm with
 * Design) or a tap on the dimmed page.
 *
 * Props
 *   visible, onClose
 *   placeholder
 *   items       [{ key, label, hint?, searchText? }], already ordered
 *   selected    keys
 *   mode        'multi' (built). TODO: 'single' for Origin — a radio row
 *               (§9 Radio marker, D-35 pending) that picks and closes.
 *   limit       multi only: at the limit unselected rows and Add lock
 *   onToggle    (key) => void
 *   onAdd       optional (label) => void, with `normalize`
 *   normalize   (query) => label, for Add
 */
const defaultMatch = (item, q) => {
  const hay = (item.searchText ?? item.label).toLowerCase();
  if (hay.startsWith(q)) return 2;
  return hay.includes(q) ? 1 : 0;
};

export default function SearchSheet({ visible, onClose, placeholder, items, selected, limit, onToggle, onAdd, normalize = (q) => q.trim(), match = defaultMatch }) {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  const shown = useMemo(() => {
    if (!q) return items;
    return items
      .map((item, i) => ({ item, i, score: match(item, q) }))
      .filter((m) => m.score > 0)
      .sort((a, b) => b.score - a.score || a.i - b.i)
      .map((m) => m.item);
  }, [items, q, match]);

  const added = onAdd && q ? normalize(query) : null;
  const canAdd = Boolean(added) && !items.some((item) => item.label.toLowerCase() === added.toLowerCase());
  const locked = limit != null && selected.length >= limit;

  const close = () => {
    setQuery('');
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={close} full>
      <View style={styles.header}>
        <SearchField value={query} onChangeText={setQuery} placeholder={placeholder} autoFocus={visible} />
        <Button variant="text" label="Done" onPress={close} />
      </View>
      <ScrollView style={styles.list} keyboardShouldPersistTaps="handled" keyboardDismissMode="none">
        <CheckboxList
          items={shown.map((item) => ({ name: item.key, label: item.label, hint: item.hint }))}
          selected={selected}
          locked={locked}
          onToggle={onToggle}
          add={
            canAdd
              ? {
                  label: `Add "${added}"`,
                  onPress: () => {
                    onAdd(added);
                    setQuery('');
                  },
                }
              : undefined
          }
        />
      </ScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.gap.row,
  },
  list: {
    flex: 1,
  },
});
