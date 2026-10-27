import { ScrollView, StyleSheet, View } from 'react-native';
import Text from '../components/base/Text';
import { color, layout, shape, space, spacing } from '../theme/tokens';

/** Scrolling page with the screen gutter. */
export function HarnessPage({ children }) {
  return <ScrollView contentContainerStyle={styles.page}>{children}</ScrollView>;
}

/** A titled group of states. */
export function HarnessGroup({ title, children }) {
  return (
    <View style={styles.group}>
      <Text variant="labelEyebrow" color="accent">
        {title}
      </Text>
      {children}
    </View>
  );
}

/** One state: a caption naming it, then the component. `framed` draws the box it lays out in. */
export function HarnessCase({ label, framed = false, children }) {
  return (
    <View style={styles.case}>
      <Text variant="meta" color="muted">
        {label}
      </Text>
      <View style={framed && styles.frame}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: layout.gutter,
    paddingBottom: layout.screen.bottom,
    gap: space[28],
  },
  group: {
    gap: spacing.gap.section,
  },
  case: {
    gap: spacing.gap.tight,
  },
  frame: {
    borderWidth: shape.borderWidth.divider,
    borderColor: color.border.muted,
    borderStyle: 'dashed',
  },
});
