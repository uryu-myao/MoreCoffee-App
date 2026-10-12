import { useEffect } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Reanimated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { ACTIVE_OFFSET_X, BACK_DISTANCE, BACK_VELOCITY, EDGE, FAIL_OFFSET_Y } from '../constants/edgeSwipe';
import { color, motion } from '../theme/tokens';
import DotTexture from './base/DotTexture';

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
 * Props
 *   onBack    called once the screen has slid out
 *   children  (goBack) => node — goBack slides out, then calls onBack
 */
const easing = Easing.bezier(...motion.expand.controlPoints);

export default function PushedScreen({ onBack, children }) {
  const { width } = useWindowDimensions();
  const x = useSharedValue(width); // 0 = in place, width = off to the right

  useEffect(() => {
    x.value = withTiming(0, { duration: motion.expand.duration, easing });
  }, [x]);

  const goBack = () => {
    x.value = withTiming(width, { duration: motion.expand.duration, easing }, (done) => {
      if (done) scheduleOnRN(onBack);
    });
  };

  const swipe = Gesture.Pan()
    .hitSlop({ left: 0, width: EDGE })
    .activeOffsetX(ACTIVE_OFFSET_X)
    .failOffsetY([-FAIL_OFFSET_Y, FAIL_OFFSET_Y])
    .onUpdate((e) => {
      x.value = Math.min(width, Math.max(0, e.translationX));
    })
    .onEnd((e) => {
      const back = e.translationX > width * BACK_DISTANCE || e.velocityX > BACK_VELOCITY;
      x.value = withTiming(back ? width : 0, { duration: motion.expand.duration, easing }, (done) => {
        if (done && back) scheduleOnRN(onBack);
      });
    });

  const slide = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  return (
    <GestureDetector gesture={swipe}>
      <Reanimated.View style={[StyleSheet.absoluteFill, styles.page, slide]}>
        <DotTexture />
        {children(goBack)}
      </Reanimated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: color.surface.ground,
  },
});
