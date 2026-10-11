import { ScrollView, StyleSheet, View } from 'react-native';
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
 * Header: the field's label (label.eyebrow, muted) and "Done" on the right,
 * as DateSheet. Each section is one RadioList with an optional eyebrow
 * (Method: Brewer / Grinder). A pick applies at once; with `closeOnPick` (one
 * section) it also closes. The list scrolls when taller than the sheet.
 *
 * Props
 *   visible, onClose
 *   label        "Bag" / "Method"
 *   sections     [{ label?, items, selected, onPick, add? }] — see RadioList
 *   closeOnPick
 */
export default function PickerSheet({ visible, onClose, label, sections, closeOnPick = false }) {
  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.header}>
        <Text variant="labelEyebrow" color="muted">
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
