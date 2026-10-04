import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, useWindowDimensions } from 'react-native';
import PlaceholderScreen from '../screens/PlaceholderScreen';
import { color, motion } from '../theme/tokens';
import IconButton from './base/IconButton';

const easing = Easing.bezier(...motion.expand.controlPoints);

/**
 * Record coffee, presented over the tabs as a full-screen sheet that slides up.
 * Uses the product's one motion (motion.expand) for both present and dismiss.
 *
 * TODO(Step 5): replace the placeholder with Record coffee rebuilt from 5a–5e.
 */
export default function AddCoffeeOverlay({ visible, onClose }) {
  const { height } = useWindowDimensions();
  const [mounted, setMounted] = useState(false);
  const translateY = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (!visible) return;
    setMounted(true);
    translateY.setValue(height);
    Animated.timing(translateY, {
      toValue: 0,
      duration: motion.expand.duration,
      easing,
      useNativeDriver: true,
    }).start();
  }, [height, translateY, visible]);

  const dismiss = () => {
    Animated.timing(translateY, {
      toValue: height,
      duration: motion.expand.duration,
      easing,
      useNativeDriver: true,
    }).start(() => {
      setMounted(false);
      onClose();
    });
  };

  if (!mounted) return null;

  return (
    // StyleSheet.absoluteFill, not absoluteFillObject: RN 0.86 removed the
    // latter, and spreading it silently drops the positioning (the sheet then
    // lays out at 0 height). react-native-web still ships it, so web hides this.
    <Animated.View style={[StyleSheet.absoluteFill, styles.overlay, { transform: [{ translateY }] }]}>
      <PlaceholderScreen
        title="Record coffee"
        leading={<IconButton icon="close" accessibilityLabel="Close" onPress={dismiss} />}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: color.surface.ground,
  },
});
