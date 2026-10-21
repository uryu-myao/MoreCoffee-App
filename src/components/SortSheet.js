import { useEffect, useState } from 'react';
import { onSortSheetRequest } from '../navigation';
import { StyleSheet, View } from 'react-native';
import { spacing } from '../theme/tokens';
import { DEFAULT_GROUP, DEFAULT_SORT, GROUPS, SORTS } from '../constants/records';
import BottomSheet from './base/BottomSheet';
import Button from './base/Button';
import SegmentedControl from './base/SegmentedControl';
import Text from './base/Text';
import RadioList from './RadioList';

/**
 * 2b, Sort & group: one sheet from 2a's filter button. Shown by
 * SortSheetHost in AppShell, so it covers the bottom bar like every sheet
 * (inside Records the bar was drawn over its Done). A swipe down closes it,
 * as the scrim does (§9 Bottom sheet swipeToClose).
 *
 *   header   "Sort & group" (display.sm) with "Reset" opposite (Button
 *            text, as the pickers' "Done": the slot right of a sheet title)
 *   Sort by  eyebrow (accent, as 2b) over a RadioList of the four orders,
 *            with its square marker like every single-select row (Design
 *            Round 10, 17: 2b's check mark is the drift)
 *   Group by eyebrow over a SegmentedControl: Month / Brew method / Roaster / None
 *   Done     primary. 2b draws "Show 3 cups"; with no filter the number is
 *            always the total, so it returns with filters (Design Round 10, 18)
 *
 * Picks are held in the sheet until Done applies them. Reset puts the
 * defaults back in the sheet (still applied by Done). Closing by the scrim
 * drops the picks.
 *
 * Props: visible, onClose, sort, group, onApply({ sort, group })
 */
export default function SortSheet({ visible, onClose, sort, group, onApply }) {
  const [pick, setPick] = useState({ sort, group });
  // Each opening starts from what 2a shows now.
  useEffect(() => {
    if (visible) setPick({ sort, group });
  }, [visible, sort, group]);

  return (
    <BottomSheet visible={visible} onClose={onClose} swipeToClose>
      <View style={styles.header}>
        <Text variant="displaySm" color="primary">
          Sort & group
        </Text>
        <Button variant="text" label="Reset" onPress={() => setPick({ sort: DEFAULT_SORT, group: DEFAULT_GROUP })} />
      </View>
      <View style={styles.section}>
        <Text variant="labelEyebrow" color="accent">
          Sort by
        </Text>
        <RadioList
          items={SORTS.map((s) => ({ key: s.key, label: s.label }))}
          selected={pick.sort}
          onPick={(key) => setPick((p) => ({ ...p, sort: key }))}
        />
      </View>
      <View style={styles.section}>
        <Text variant="labelEyebrow" color="accent">
          Group by
        </Text>
        <SegmentedControl options={GROUPS} value={pick.group} onChange={(value) => setPick((p) => ({ ...p, group: value }))} />
      </View>
      <Button
        variant="primary"
        label="Done"
        onPress={() => {
          onApply(pick);
          onClose();
        }}
      />
    </BottomSheet>
  );
}

/** AppShell's host: 2a asks with requestSortSheet({ sort, group, onApply }). */
export function SortSheetHost() {
  const [shown, setShown] = useState({ visible: false, sort: DEFAULT_SORT, group: DEFAULT_GROUP, onApply: null });
  useEffect(() => onSortSheetRequest((request) => setShown({ visible: true, ...request })), []);
  return (
    <SortSheet
      visible={shown.visible}
      onClose={() => setShown((s) => ({ ...s, visible: false }))}
      sort={shown.sort}
      group={shown.group}
      onApply={(pick) => shown.onApply?.(pick)}
    />
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  section: {
    gap: spacing.gap.row,
  },
});
