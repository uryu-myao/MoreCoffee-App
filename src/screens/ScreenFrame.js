import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Text from '../components/base/Text';
import { color, layout, shape, spacing } from '../theme/tokens';

/**
 * Screen shell (design-system.md §9): header block — optional leading control
 * (e.g. a close IconButton, as in 5a) above the display.lg title — closed by a
 * 2px ink rule, then the screen body. layout.gutter is the only horizontal
 * padding.
 *
 * layout.screen.top is measured from the screen edge, as in the source frames,
 * so it already contains the status bar; it is never allowed to sit inside the
 * safe-area inset on devices whose inset is taller.
 *
 * Props
 *   title     screen title (display.lg)
 *   leading   optional node above the title
 *   children  screen body
 */
export default function ScreenFrame({ title, leading, children }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, layout.screen.top) }]}>
        {leading}
        <Text variant="displayLg" accessibilityRole="header">
          {title}
        </Text>
      </View>
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.surface.ground,
  },
  header: {
    alignItems: 'flex-start',
    gap: spacing.gap.row,
    paddingHorizontal: layout.gutter,
    paddingBottom: spacing.inset.container.v,
    borderBottomWidth: shape.borderWidth.box,
    borderBottomColor: color.border.strong,
  },
  body: {
    flex: 1,
    paddingHorizontal: layout.gutter,
    paddingTop: spacing.inset.container.v,
  },
});
