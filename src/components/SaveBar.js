import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { color, layout, motion, shape, space, spacing } from '../theme/tokens';

/**
 * The bag and gear pages' Save bar (Design Round 15, 19b): absent until the
 * first edit, then pinned at the foot, outside the scroll. It rises over
 * motion.expand: the height leads (0 → its own), the fade follows (from
 * halfway); reverting the edits takes it back the same way.
 *
 * It sits under the page in one column, so as it grows the page above
 * shrinks by the same height in the same 340ms: the scroll area's bottom
 * inset grows with it and nothing is covered (the end actions stay
 * reachable).
 *
 * The panel is ScreenFrame's footer: raised, a box-wide ink rule on top,
 * space.20 over its content, the home indicator's inset under it.
 *
 * Props: visible, children (the Save button, its line)
 */
const easing = Easing.bezier(...motion.expand.controlPoints);

export default function SaveBar({ visible, children }) {
  const insets = useSafeAreaInsets();
  const [height, setHeight] = useState(0);
  const shown = useRef(new Animated.Value(visible ? 1 : 0)).current;
  useEffect(() => {
    // Height is a layout property: the JS driver.
    Animated.timing(shown, { toValue: visible ? 1 : 0, duration: motion.expand.duration, easing, useNativeDriver: false }).start();
  }, [shown, visible]);
  return (
    <Animated.View
      style={[styles.clip, { height: shown.interpolate({ inputRange: [0, 1], outputRange: [0, height] }) }]}
      pointerEvents={visible ? 'auto' : 'none'}
      accessibilityElementsHidden={!visible}
      importantForAccessibility={visible ? 'auto' : 'no-hide-descendants'}>
      <Animated.View
        onLayout={(e) => {
          const h = e.nativeEvent.layout.height;
          setHeight((prev) => (prev === h ? prev : h));
        }}
        style={[styles.panel, { paddingBottom: Math.max(insets.bottom, layout.screen.bottom), opacity: shown.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0, 1] }) }]}>
        <View style={styles.content}>{children}</View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  clip: {
    overflow: 'hidden',
  },
  // Measured at its own height, whatever the clip's. Anchored to the foot,
  // so as the clip grows the panel rises from the bottom edge.
  panel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: space[20],
    paddingHorizontal: layout.gutter,
    backgroundColor: color.surface.raised,
    borderTopWidth: shape.borderWidth.box,
    borderTopColor: color.border.strong,
  },
  content: {
    gap: spacing.gap.row,
  },
});
