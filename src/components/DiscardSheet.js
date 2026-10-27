import { StyleSheet, View } from 'react-native';
import { space, spacing } from '../theme/tokens';
import BottomSheet from './base/BottomSheet';
import Button from './base/Button';
import Text from './base/Text';

/**
 * Leaving an edit form with unsaved changes (Design Round 4, 19; the 11b
 * shape): "Discard your changes?", a body naming the object, primary "Keep
 * editing", text action "Discard changes". 11a and 3g; 3e / 6d later.
 *
 * Props
 *   visible, onClose (Keep editing, or the scrim)
 *   body       "Your edits to this cup won't be saved. The cup stays as it was."
 *   onDiscard
 */
export default function DiscardSheet({ visible, onClose, body, onDiscard }) {
  return (
    <BottomSheet visible={visible} onClose={onClose} swipeToClose>
      <Text variant="displaySm" color="primary">
        Discard your changes?
      </Text>
      <Text variant="body" color="secondary">
        {body}
      </Text>
      <View style={styles.actions}>
        <Button label="Keep editing" onPress={onClose} />
        <Button variant="text" stacked label="Discard changes" onPress={onDiscard} />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  // The buttons sit a step under the copy (11b: margin-top 8 over the sheet's gap).
  actions: {
    marginTop: space[8],
    gap: spacing.gap.section,
  },
});
