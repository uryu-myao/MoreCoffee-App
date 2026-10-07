import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, useWindowDimensions } from 'react-native';
import RecordCoffeeScreen from '../screens/RecordCoffeeScreen';
import TastingNoteScreen from '../screens/TastingNoteScreen';
import { color, motion } from '../theme/tokens';

const easing = Easing.bezier(...motion.expand.controlPoints);

/**
 * The Record sheet, presented over the tabs as a full-screen sheet that slides
 * up. Two steps: Record coffee (5a), then Tasting note (5b) via "Add tasting
 * note". Step 2 pushes in from the right and Back pushes it out again; step 1
 * stays mounted underneath, so nothing typed or rated there is lost. Every
 * move uses the product's one expand motion (motion.expand): the sheet's
 * present / dismiss and the step change alike. No mock draws the step change;
 * the push was agreed on review (2026-10-07).
 */
export default function AddCoffeeOverlay({ visible, onClose }) {
  const { width, height } = useWindowDimensions();
  const [mounted, setMounted] = useState(false);
  const [noteMounted, setNoteMounted] = useState(false);
  const translateY = useRef(new Animated.Value(height)).current;
  const step = useRef(new Animated.Value(0)).current; // 0 → Record coffee, 1 → Tasting note

  const run = (value, toValue, done) =>
    Animated.timing(value, { toValue, duration: motion.expand.duration, easing, useNativeDriver: true }).start(done);

  useEffect(() => {
    if (!visible) return;
    setMounted(true);
    setNoteMounted(false);
    step.setValue(0);
    translateY.setValue(height);
    run(translateY, 0);
  }, [height, step, translateY, visible]);

  const dismiss = () => {
    run(translateY, height, () => {
      setMounted(false);
      setNoteMounted(false);
      onClose();
    });
  };

  const openNote = () => {
    setNoteMounted(true);
    run(step, 1);
  };
  const closeNote = () => run(step, 0, () => setNoteMounted(false));

  if (!mounted) return null;

  return (
    // StyleSheet.absoluteFill, not absoluteFillObject: RN 0.86 removed the
    // latter, and spreading it silently drops the positioning (the sheet then
    // lays out at 0 height). react-native-web still ships it, so web hides this.
    <Animated.View style={[StyleSheet.absoluteFill, styles.overlay, { transform: [{ translateY }] }]}>
      <Animated.View
        style={[StyleSheet.absoluteFill, { transform: [{ translateX: step.interpolate({ inputRange: [0, 1], outputRange: [0, -width] }) }] }]}>
        <RecordCoffeeScreen onClose={dismiss} onAddNote={openNote} />
      </Animated.View>
      {noteMounted ? (
        <Animated.View
          style={[StyleSheet.absoluteFill, { transform: [{ translateX: step.interpolate({ inputRange: [0, 1], outputRange: [width, 0] }) }] }]}>
          <TastingNoteScreen onBack={closeNote} />
        </Animated.View>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: color.surface.ground,
  },
});
