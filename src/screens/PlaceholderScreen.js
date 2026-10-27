import { StyleSheet, View } from 'react-native';
import Text from '../components/base/Text';
import { spacing } from '../theme/tokens';
import ScreenFrame from './ScreenFrame';

/**
 * Scaffolding for screens not yet rebuilt from their mocks: the screen name and
 * one line of copy. Deliberately not an empty-state design — each screen's
 * empty state is designed when the screen itself is rebuilt.
 *
 * `children` sit under the line: interim tools that need a home before their
 * screen is designed (Profile's export, 2026-10-20 to 2026-10-21; unused now).
 */
export default function PlaceholderScreen({ title, eyebrow, leading, children }) {
  return (
    <ScreenFrame title={title} eyebrow={eyebrow} leading={leading}>
      <View style={styles.body}>
        <Text variant="body" color="muted">
          This screen is being rebuilt.
        </Text>
        {children}
      </View>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: spacing.gap.section,
  },
});
