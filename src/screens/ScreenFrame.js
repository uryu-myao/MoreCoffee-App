import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Text from '../components/base/Text';
import { color, layout, shape, space, spacing } from '../theme/tokens';

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
    // The title-to-rule distance is this padding, not line-box leftover. The
    // title renders on Instrument Serif's natural box (§3.2), which ends at the
    // descender line, 12.4 below the baseline at 40. 12.4 + 8 = 20.4 from the
    // baseline to the rule, matching the source (40px box + 14px padding).
    paddingBottom: space[8],
    borderBottomWidth: shape.borderWidth.box,
    borderBottomColor: color.border.strong,
  },
  body: {
    flex: 1,
    paddingHorizontal: layout.gutter,
    paddingTop: spacing.inset.container.v,
  },
});
