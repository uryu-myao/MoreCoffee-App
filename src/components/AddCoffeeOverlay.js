import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import RecordCoffeeScreen from '../screens/RecordCoffeeScreen';
import TastingNoteScreen from '../screens/TastingNoteScreen';
import { color, motion } from '../theme/tokens';

const easing = Easing.bezier(...motion.expand.controlPoints);

/**
 * The Record sheet, presented over the tabs as a full-screen sheet that slides
 * up (motion.expand). Two steps: Log a cup (5a), then Tasting note (5b) via
 * "Add tasting note".
 *
 * The steps are two pages of a horizontal paging ScrollView, so the way back
 * is both the back arrow and a swipe to the right (2026-10-07). The scroll
 * view is native: the drag, the settle and the arbitration with each step's
 * own vertical scroll run on the UI thread, as in the tab pager. Swiping only
 * works on step 2: on step 1 the pager is locked, so step 2 is reached only
 * through its button. Step 1 stays mounted, so its rating and fields survive.
 *
 * The button and the back arrow move the same native scroll position, so
 * they animate with the platform's scroll animation (scrollTo), not
 * motion.expand: a separate Animated push could not hand over to the drag.
 */
export default function AddCoffeeOverlay({ visible, onClose }) {
  const { width, height } = useWindowDimensions();
  const [mounted, setMounted] = useState(false);
  const [noteMounted, setNoteMounted] = useState(false);
  const [onNote, setOnNote] = useState(false); // step 2 is showing: swipe back enabled
  const pendingPush = useRef(false);
  const pager = useRef(null);
  const translateY = useRef(new Animated.Value(height)).current;

  const slide = (toValue, done) =>
    Animated.timing(translateY, { toValue, duration: motion.expand.duration, easing, useNativeDriver: true }).start(done);

  useEffect(() => {
    if (!visible) return;
    setMounted(true);
    setNoteMounted(false);
    setOnNote(false);
    translateY.setValue(height);
    slide(0);
  }, [height, translateY, visible]);

  const dismiss = () => {
    slide(height, () => {
      setMounted(false);
      setNoteMounted(false);
      setOnNote(false);
      onClose();
    });
  };

  // Step 2 is mounted on first use; the push waits until its page is laid out.
  const openNote = () => {
    setOnNote(true);
    if (noteMounted) pager.current?.scrollTo({ x: width, animated: true });
    else {
      pendingPush.current = true;
      setNoteMounted(true);
    }
  };
  const onContentSizeChange = (w) => {
    if (pendingPush.current && w >= width * 2) {
      pendingPush.current = false;
      pager.current?.scrollTo({ x: width, animated: true });
    }
  };
  const backToRecord = () => {
    setOnNote(false);
    pager.current?.scrollTo({ x: 0, animated: true });
  };
  // A swipe settles on a page: that page decides whether swiping stays on.
  // Momentum end only: switching scrollEnabled off mid-settle could cut the
  // paging animation short.
  const settle = (e) => setOnNote(Math.round(e.nativeEvent.contentOffset.x / width) === 1);

  if (!mounted) return null;

  return (
    // StyleSheet.absoluteFill, not absoluteFillObject: RN 0.86 removed the
    // latter, and spreading it silently drops the positioning (the sheet then
    // lays out at 0 height). react-native-web still ships it, so web hides this.
    <Animated.View style={[StyleSheet.absoluteFill, styles.overlay, { transform: [{ translateY }] }]}>
      <ScrollView
        ref={pager}
        horizontal
        pagingEnabled
        directionalLockEnabled
        scrollEnabled={onNote}
        showsHorizontalScrollIndicator={false}
        onContentSizeChange={onContentSizeChange}
        onMomentumScrollEnd={settle}
        keyboardShouldPersistTaps="handled">
        <View style={{ width }}>
          <RecordCoffeeScreen onClose={dismiss} onAddNote={openNote} />
        </View>
        {noteMounted ? (
          <View style={{ width }}>
            <TastingNoteScreen onBack={backToRecord} />
          </View>
        ) : null}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: color.surface.ground,
  },
});
