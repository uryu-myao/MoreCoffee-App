import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { spacing } from '../theme/tokens';
import BottomSheet from './base/BottomSheet';
import Button from './base/Button';
import Text from './base/Text';
import RadioList from './RadioList';

/**
 * Picker sheet (stage 3, decided 2026-10-11): choose this cup's bag or gear
 * from the shelf. A separate component from SearchSheet: 5 bags and 8 gear
 * need no search, and the rows carry more (thumbnail, roaster, day N).
 * No mock draws it; built from BottomSheet + RadioList.
 *
 * Header: the field's label as the sheet's title (display.sm; decided
 * 2026-10-11 — as an eyebrow it stacked over Method's "Brewer" / "Grinder"
 * eyebrows, two eyebrows in a row) and "Done" on the right.
 * Each section is one RadioList with an optional eyebrow (Method: Brewer /
 * Grinder). A pick applies at once; with `closeOnPick` (one
 * section) it also closes. The list scrolls when taller than the sheet.
 * Closing: "Done", a tap on the dimmed page, or a swipe down (BottomSheet
 * swipeToClose, 2026-10-22, as 2b / 5b's search / 15b). The list is gesture
 * handler's ScrollView, so the list's scroll and the swipe take turns.
 *
 * Props
 *   visible, onClose
 *   label        "Bag" / "Method"
 *   sections     [{ label?, items, selected, onPick, add? }] — see RadioList
 *   closeOnPick
 */
export default function PickerSheet({ visible, onClose, label, sections, closeOnPick = false }) {
  return (
    <BottomSheet visible={visible} onClose={onClose} swipeToClose>
      <View style={styles.header}>
        <Text variant="displaySm" color="primary">
          {label}
        </Text>
        <Button variant="text" label="Done" onPress={onClose} />
      </View>
      <ScrollView style={styles.list} contentContainerStyle={styles.sections} bounces={false}>
        {sections.map((section, i) => (
          <View key={section.label ?? i} style={styles.section}>
            {section.label ? (
              <Text variant="labelEyebrow" color="muted">
                {section.label}
              </Text>
            ) : null}
            <RadioList
              items={section.items}
              selected={section.selected}
              add={section.add}
              onPick={(key) => {
                section.onPick(key);
                if (closeOnPick) onClose();
              }}
            />
          </View>
        ))}
      </ScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  list: {
    flexShrink: 1,
  },
  sections: {
    gap: spacing.gap.section,
  },
  section: {
    gap: spacing.gap.row,
  },
});
