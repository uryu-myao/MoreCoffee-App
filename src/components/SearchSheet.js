import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import BottomSheet from './base/BottomSheet';
import Button from './base/Button';
import SearchField from './base/SearchField';
import { color, shape, spacing } from '../theme/tokens';
import CheckboxList from './CheckboxList';
import RadioList from './RadioList';

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
 *   mode        'multi' (5b's flavours) | 'single' (Packaged's product name,
 *               2026-10-15): radio rows; a pick or an Add closes the sheet
 *   selected    multi: keys; single: one key or null
 *   limit       multi only: at the limit unselected rows and Add lock
 *   onToggle    multi: (key) => void
 *   onPick      single: (key) => void
 *   onAdd       optional (label) => void, with `normalize`
 *   normalize   (query) => label, for Add
 */
const defaultMatch = (item, q) => {
  const hay = (item.searchText ?? item.label).toLowerCase();
  if (hay.startsWith(q)) return 2;
  return hay.includes(q) ? 1 : 0;
};

export default function SearchSheet({
  visible,
  onClose,
  placeholder,
  items,
  selected,
  mode = 'multi',
  limit,
  onToggle,
  onPick,
  onAdd,
  normalize = (q) => q.trim(),
  match = defaultMatch,
}) {
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
  const single = mode === 'single';
  const locked = !single && limit != null && selected.length >= limit;

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
      {/* The 2px frame stays whole around the list; only its inside scrolls
          (decided 2026-10-12: a frame cut by the sheet's edge breaks "the
          box's outline", §1). */}
      <View style={[styles.list, shown.length || canAdd ? styles.frame : null]}>
        <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="none">
          {single ? (
            <RadioList
              framed={false}
              items={shown.map((item) => ({ key: item.key, label: item.label, meta: item.hint }))}
              selected={selected}
              onPick={(key) => {
                onPick(key);
                close();
              }}
              add={
                canAdd
                  ? {
                      label: `Add "${added}"`,
                      onPress: () => {
                        onAdd(added);
                        close();
                      },
                    }
                  : undefined
              }
            />
          ) : (
            <CheckboxList
              framed={false}
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
          )}
        </ScrollView>
      </View>
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
    flexShrink: 1,
  },
  frame: {
    borderWidth: shape.borderWidth.box,
    borderColor: color.border.strong,
    backgroundColor: color.surface.raised,
  },
});
