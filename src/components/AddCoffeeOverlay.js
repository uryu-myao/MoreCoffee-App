import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Reanimated, { Easing as REasing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import RecordCoffeeScreen from '../screens/RecordCoffeeScreen';
import AddBagScreen from '../screens/AddBagScreen';
import AddGearScreen from '../screens/AddGearScreen';
import TastingNoteScreen from '../screens/TastingNoteScreen';
import { color, motion, size } from '../theme/tokens';
import { GESTURE_LOG, logGesture } from './base/gestureLog';
import { RecordDraftProvider } from './RecordDraft';

const easing = Easing.bezier(...motion.expand.controlPoints);
const stepEasing = REasing.bezier(...motion.expand.controlPoints);

/**
 * Swipe back starts only from a strip at the left screen edge — iOS's own
 * edge-swipe convention. Device logs (2026-10-08) showed a full-width
 * swipe-back pager taking touches meant for the taste axes; confined to the
 * strip, no touch on the card can move the sheet.
 *
 * Tuned from the next device log: at 22pt the strip was too hard to hit
 * (swipes starting at x 27–51 never began), and of the swipes that did begin,
 * most FAILED on a little vertical drift (failOffsetY ±10) or ended short of
 * 35%. Now:
 *   EDGE           size.tapTarget (44): one tap target wide. The taste axes'
 *                  touch bands start ~65pt in (77pt on a 430pt phone).
 *   FAIL_OFFSET_Y  ±30: a thumb swipe drifts; horizontal 10 still decides first.
 *   BACK_*         25% of the width, or a 300pt/s flick.
 */
const EDGE = size.tapTarget;
const ACTIVE_OFFSET_X = 10;
const FAIL_OFFSET_Y = 30;
const BACK_DISTANCE = 0.25;
const BACK_VELOCITY = 300;

/**
 * The Record sheet, presented over the tabs as a full-screen sheet that slides
 * up (motion.expand). Two steps: Log a cup (5a), then Tasting note (5b) via
 * "Add tasting note".
 *
 * The steps are two pages moved by one UI-thread value (Reanimated): the
 * button pushes step 2 in from the right and the back arrow pushes it out,
 * over motion.expand (2026-10-08; restored now that no native scroll view
 * owns the position). On step 2, a swipe from the LEFT EDGE follows the finger
 * and goes back past 25% or on a flick. Step 1 stays mounted, so its rating
 * and fields survive; it is never swiped to step 2.
 */
export default function AddCoffeeOverlay({ visible, onClose }) {
  const { width, height } = useWindowDimensions();
  const [mounted, setMounted] = useState(false);
  // The second page: 5b ('note'), 3c minimal ('bag') or 3a minimal ('gear'), all pushed from 5a.
  const [second, setSecond] = useState(null);
  const [onNote, setOnNote] = useState(false); // step 2 showing: edge swipe enabled
  const translateY = useRef(new Animated.Value(height)).current;
  const pos = useSharedValue(0); // 0 → Log a cup, 1 → Tasting note
  const w = useSharedValue(width);

  useEffect(() => {
    w.value = width;
  }, [w, width]);

  const slide = (toValue, done) =>
    Animated.timing(translateY, { toValue, duration: motion.expand.duration, easing, useNativeDriver: true }).start(done);

  useEffect(() => {
    if (!visible) return;
    setMounted(true);
    setSecond(null);
    setOnNote(false);
    pos.value = 0;
    translateY.setValue(height);
    slide(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height, translateY, visible]);

  const dismiss = () => {
    slide(height, () => {
      setMounted(false);
      setSecond(null);
      setOnNote(false);
      onClose();
    });
  };

  const toStep = (to) => {
    'worklet';
    pos.value = withTiming(to, { duration: motion.expand.duration, easing: stepEasing });
  };
  const push = (page) => {
    setSecond(page);
    setOnNote(true);
    toStep(1);
  };
  const openNote = () => push('note');
  const openBag = () => push('bag');
  const openGear = () => push('gear');
  const backToRecord = () => {
    setOnNote(false);
    toStep(0);
  };
  const log = (st, extra) => logGesture('sheet.edge', st, extra);

  const edgeSwipe = Gesture.Pan()
    .enabled(onNote)
    .hitSlop({ left: 0, width: EDGE })
    .activeOffsetX(ACTIVE_OFFSET_X)
    .failOffsetY([-FAIL_OFFSET_Y, FAIL_OFFSET_Y])
    .onBegin((e) => {
      if (GESTURE_LOG) scheduleOnRN(log, 'BEGAN', `x=${e.absoluteX.toFixed(1)}`);
    })
    .onStart(() => {
      if (GESTURE_LOG) scheduleOnRN(log, 'ACTIVE');
    })
    .onUpdate((e) => {
      pos.value = 1 - Math.min(1, Math.max(0, e.translationX / w.value));
    })
    .onEnd((e) => {
      const back = e.translationX > w.value * BACK_DISTANCE || e.velocityX > BACK_VELOCITY;
      toStep(back ? 0 : 1);
      if (back) scheduleOnRN(setOnNote, false);
      if (GESTURE_LOG) scheduleOnRN(log, back ? 'END → back' : 'END → stay');
    })
    .onFinalize((e, success) => {
      if (GESTURE_LOG && !success) scheduleOnRN(log, 'FAILED');
    });

  const recordStyle = useAnimatedStyle(() => ({ transform: [{ translateX: -pos.value * w.value }] }));
  const noteStyle = useAnimatedStyle(() => ({ transform: [{ translateX: (1 - pos.value) * w.value }] }));

  if (!mounted) return null;

  return (
    // StyleSheet.absoluteFill, not absoluteFillObject: RN 0.86 removed the
    // latter, and spreading it silently drops the positioning (the sheet then
    // lays out at 0 height). react-native-web still ships it, so web hides this.
    <Animated.View
      style={[StyleSheet.absoluteFill, styles.overlay, { transform: [{ translateY }] }]}
      // Debug: log where each touch starts, to place the touches the axis misses.
      onStartShouldSetResponderCapture={
        GESTURE_LOG
          ? (e) => {
              logGesture('touch', 'START', `window (${e.nativeEvent.pageX.toFixed(1)}, ${e.nativeEvent.pageY.toFixed(1)})`);
              return false;
            }
          : undefined
      }>
      {/* The cup being recorded, shared by both steps; discarded when the sheet
          closes (it unmounts with it). Saving dismisses the sheet. */}
      <RecordDraftProvider onSaved={dismiss}>
        <Reanimated.View style={[StyleSheet.absoluteFill, recordStyle]}>
          <RecordCoffeeScreen onClose={dismiss} onAddNote={openNote} onAddBag={openBag} onAddGear={openGear} />
        </Reanimated.View>
        {second ? (
          <GestureDetector gesture={edgeSwipe}>
            <Reanimated.View style={[StyleSheet.absoluteFill, styles.overlay, noteStyle]}>
              {second === 'note' ? (
                <TastingNoteScreen onBack={backToRecord} />
              ) : second === 'bag' ? (
                <AddBagScreen onBack={backToRecord} />
              ) : (
                <AddGearScreen onBack={backToRecord} />
              )}
            </Reanimated.View>
          </GestureDetector>
        ) : null}
      </RecordDraftProvider>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: color.surface.ground,
  },
});
