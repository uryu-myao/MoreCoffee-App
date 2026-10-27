import { useEffect, useRef } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Reanimated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { ACTIVE_OFFSET_X, BACK_DISTANCE, BACK_VELOCITY, EDGE, FAIL_OFFSET_Y } from '../constants/edgeSwipe';
import { color, motion } from '../theme/tokens';
import DotTexture from './base/DotTexture';
import { SwipeBackHoldContext, useSwipeBackHold } from './swipeBackHold';

/**
 * A screen pushed over a tab's page (2c over Records), the way the Record
 * sheet's second step is pushed (§9 Record sheet steps): it slides in from the
 * right over motion.expand, a swipe from the left edge follows the finger and
 * goes back past 25% or on a flick, and the screen's own Back slides it out.
 * The page underneath stays mounted, so it shows during the swipe.
 *
 * It draws its own ground and dot texture: inside the pager, screens are
 * transparent over AppShell's backdrop.
 *
 * The swipe is held while a bottom sheet is open on the screen
 * (swipeBackHold.js).
 *
 * Leave guard (Design Round 4, 19: unsaved changes): a screen can hold its
 * leave — guardLeave(active, onBlocked). While active, Back (goBack) and a
 * completed edge swipe do not leave: the swipe springs back and onBlocked
 * runs (11a opens "Discard your changes?"). goBack({ force: true }) leaves
 * anyway (that sheet's "Discard changes").
 *
 * Props
 *   onLeave   called the moment the screen commits to leaving (Back, or a
 *             swipe past the threshold), before it has slid out
 *   onBack    called once the screen has slid out
 *   children  (goBack, guardLeave) => node — goBack slides out, then calls onBack
 */
const easing = Easing.bezier(...motion.expand.controlPoints);

export default function PushedScreen({ onLeave, onBack, children }) {
  const [held, holdValue] = useSwipeBackHold();
  const { width } = useWindowDimensions();
  const x = useSharedValue(width); // 0 = in place, width = off to the right

  useEffect(() => {
    x.value = withTiming(0, { duration: motion.expand.duration, easing });
  }, [x]);

  const guarded = useSharedValue(false);
  const onBlocked = useRef(null);
  const guardLeave = (active, blocked) => {
    guarded.value = active;
    onBlocked.current = blocked;
  };
  const notifyBlocked = () => onBlocked.current?.();

  // goBack is also handed straight to onPress, so its argument may be a press event.
  const goBack = (options) => {
    if (guarded.value && options?.force !== true) {
      notifyBlocked();
      return;
    }
    onLeave?.();
    x.value = withTiming(width, { duration: motion.expand.duration, easing }, (done) => {
      if (done) scheduleOnRN(onBack);
    });
  };

  const swipe = Gesture.Pan()
    .enabled(!held)
    .hitSlop({ left: 0, width: EDGE })
    .activeOffsetX(ACTIVE_OFFSET_X)
    .failOffsetY([-FAIL_OFFSET_Y, FAIL_OFFSET_Y])
    .onUpdate((e) => {
      x.value = Math.min(width, Math.max(0, e.translationX));
    })
    .onEnd((e) => {
      const wantsBack = e.translationX > width * BACK_DISTANCE || e.velocityX > BACK_VELOCITY;
      const back = wantsBack && !guarded.value;
      if (wantsBack && !back) scheduleOnRN(notifyBlocked);
      if (back && onLeave) scheduleOnRN(onLeave);
      x.value = withTiming(back ? width : 0, { duration: motion.expand.duration, easing }, (done) => {
        if (done && back) scheduleOnRN(onBack);
      });
    });

  const slide = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  return (
    <GestureDetector gesture={swipe}>
      <Reanimated.View style={[StyleSheet.absoluteFill, styles.page, slide]}>
        <DotTexture />
        <SwipeBackHoldContext.Provider value={holdValue}>{children(goBack, guardLeave)}</SwipeBackHoldContext.Provider>
      </Reanimated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: color.surface.ground,
  },
});
