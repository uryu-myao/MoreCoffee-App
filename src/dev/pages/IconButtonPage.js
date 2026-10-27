import { StyleSheet, View } from 'react-native';
import IconButton from '../../components/base/IconButton';
import Text from '../../components/base/Text';
import { spacing } from '../../theme/tokens';
import { HarnessCase, HarnessGroup, HarnessPage } from '../harness';

export default function IconButtonPage() {
  return (
    <HarnessPage>
      <HarnessGroup title="glyphs">
        <HarnessCase label="close (5a) · back (7b, 8e–8m)">
          <View style={styles.row}>
            <IconButton icon="close" accessibilityLabel="Close" onPress={() => {}} />
            <IconButton icon="chevronLeft" accessibilityLabel="Back" onPress={() => {}} />
          </View>
        </HarnessCase>
      </HarnessGroup>

      <HarnessGroup title="pressed">
        <HarnessCase label="fill darkens — state.pressed.surface">
          <View style={styles.row}>
            <IconButton icon="close" accessibilityLabel="Close" testOnly_pressed onPress={() => {}} />
            <IconButton icon="chevronLeft" accessibilityLabel="Back" testOnly_pressed onPress={() => {}} />
          </View>
        </HarnessCase>
      </HarnessGroup>

      <HarnessGroup title="in context (5a header)">
        <HarnessCase label="above the screen title">
          <View style={styles.header}>
            <IconButton icon="close" accessibilityLabel="Close" onPress={() => {}} />
            <Text variant="displayLg">Log a cup</Text>
          </View>
        </HarnessCase>
      </HarnessGroup>
    </HarnessPage>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.gap.section,
  },
  header: {
    alignItems: 'flex-start',
    gap: spacing.gap.row,
  },
});
