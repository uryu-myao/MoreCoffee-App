import { useContext, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Reanimated, { Easing as ReEasing, interpolate, useAnimatedKeyboard, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';
import { ACTIVE_OFFSET_X, BACK_DISTANCE, BACK_VELOCITY, FAIL_OFFSET_Y } from '../../constants/edgeSwipe';
import { SwipeBackHoldContext } from '../swipeBackHold';
import { color, layout, motion, opticalMargin, shape, size, space, spacing } from '../../theme/tokens';

/**
 * Bottom sheet (design-system.md §9 Bottom sheet; catalogue #25), shared by
 * the date picker (3c Roasted on), the search sheet (5b flavours, later the
 * bag's Origin) and stage 3's pickers.
 *
 * 2b's sheet: pinned bottom, surface.raised, 2px ink top border, padding
 * 22 22 34 (layout.gutter / layout.screen.bottom), gap.section inside, a
 * size.sheet.handle bar (border.soft) centred at the top with the -6 optical
 * margin. Behind it the page drops to opacity 0.45 under color.scrim: drawn
 * here as ground at 0.55 (page × 0.45 + ground × 0.55 is the same pixel) and
 * the scrim over it. Slides up over motion.expand (Animated, native driver).
 *
 * full: the search sheet (decided 2026-10-10). A pinned half-height sheet
 * leaves 0 rows above the keyboard on an SE, so it runs from just under the
 * status bar to the keyboard's top, following the keyboard frame by frame
 * (Reanimated useAnimatedKeyboard). When the keyboard goes, only the bottom
 * edge moves with it: the top stays put, so nothing jumps. The bottom padding
 * eases from 34 (home indicator) to gap.section while the keyboard is up.
 * The sheet itself runs on to the screen's bottom, the keyboard's height
 * added to its padding, so the translucent keyboard shows the sheet behind
 * it, not the dimmed page (2026-10-18, on device).
 *
 * Otherwise the sheet wraps its content, up to the same top line (content that
 * is taller scrolls inside it).
 *
 * The handle is drawn as in 2b. Tapping the dimmed page closes the sheet.
 * With swipeToClose (15b's info sheet, Design Round 8), a swipe down closes it
 * too: the sheet follows the finger and closes past 25% of its height or on a
 * 300pt/s flick, else settles back — the edge swipe's tuning on the other
 * axis (constants/edgeSwipe.js). A scroll view inside should be gesture
 * handler's, so the two take turns; where it scrolls, it keeps the touch.
 *
 * Props
 *   visible   controlled; the sheet animates out before it unmounts
 *   onClose   scrim tap
 *   full      the full-height, keyboard-following form
 *   maxHeight optional share of the window height the wrapping sheet stops
 *             at (15b: size.sheet.info.maxHeight); never above the top line
 *   swipeToClose  a swipe down calls onClose
 *   children
 */
const expandEasing = Easing.bezier(...motion.expand.controlPoints);
const settleEasing = ReEasing.bezier(...motion.expand.controlPoints); // a worklet, for the swipe's settle
const PAGE_DIM = 1 - 0.45; // §9: the page behind drops to opacity 0.45

export default function BottomSheet({ visible, onClose, full = false, maxHeight, swipeToClose = false, children }) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [mounted, setMounted] = useState(visible);
  // While shown, the screen under it doesn't swipe back (swipeBackHold.js).
  const swipeHold = useContext(SwipeBackHoldContext);
  useEffect(() => {
    if (!mounted || !swipeHold) return undefined;
    swipeHold.hold();
    return swipeHold.release;
  }, [mounted, swipeHold]);
  const progress = useRef(new Animated.Value(0)).current;

  // The swipe's offset, on top of the slide. Back to 0 each time it opens.
  const drag = useSharedValue(0);
  const sheetHeight = useSharedValue(0);
  useEffect(() => {
    if (visible) {
      drag.value = 0;
      setMounted(true);
    }
    Animated.timing(progress, {
      toValue: visible ? 1 : 0,
      duration: motion.expand.duration,
      easing: expandEasing,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && !visible) setMounted(false);
    });
  }, [visible, progress]);

  const keyboard = useAnimatedKeyboard();
  const followKeyboard = useAnimatedStyle(() =>
    full
      ? {
          bottom: 0,
          paddingBottom:
            keyboard.height.value +
            interpolate(keyboard.height.value, [0, layout.screen.bottom], [layout.screen.bottom, spacing.gap.section], 'clamp'),
        }
      : {}
  );

  const dragStyle = useAnimatedStyle(() => ({ transform: [{ translateY: drag.value }] }));
  const swipe = Gesture.Pan()
    .enabled(swipeToClose)
    .activeOffsetY(ACTIVE_OFFSET_X)
    .failOffsetX([-FAIL_OFFSET_Y, FAIL_OFFSET_Y])
    .onUpdate((e) => {
      drag.value = Math.max(0, e.translationY);
    })
    .onEnd((e) => {
      // The visible sheet: a full sheet's height includes the part behind the keyboard.
      const shown = sheetHeight.value - (full ? keyboard.height.value : 0);
      if (e.translationY > shown * BACK_DISTANCE || e.velocityY > BACK_VELOCITY) {
        // The slide takes it out from where the finger left it.
        scheduleOnRN(onClose);
      } else {
        drag.value = withTiming(0, { duration: motion.expand.duration, easing: settleEasing });
      }
    });

  if (!mounted) return null;
  const slide = { transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [height, 0] }) }] };
  const topLine = height - insets.top - space[12];
  const wrapMax = maxHeight == null ? topLine : Math.min(topLine, height * maxHeight);

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: progress }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityRole="button" accessibilityLabel="Dismiss">
          <View style={[StyleSheet.absoluteFill, styles.pageDim]} />
          <View style={[StyleSheet.absoluteFill, styles.scrim]} />
        </Pressable>
      </Animated.View>
      <Animated.View style={[styles.slide, full && { top: insets.top + space[12] }, slide]} pointerEvents="box-none">
        <GestureDetector gesture={swipe}>
          <Reanimated.View
            style={[styles.sheet, full ? styles.sheetFull : { maxHeight: wrapMax }, followKeyboard, swipeToClose && dragStyle]}
            onLayout={(e) => {
              sheetHeight.value = e.nativeEvent.layout.height;
            }}
            accessibilityViewIsModal>
            <View style={styles.handle} />
            {children}
          </Reanimated.View>
        </GestureDetector>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  pageDim: {
    backgroundColor: color.surface.ground,
    opacity: PAGE_DIM,
  },
  scrim: {
    backgroundColor: color.scrim,
  },
  slide: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  sheet: {
    backgroundColor: color.surface.raised,
    borderTopWidth: shape.borderWidth.box,
    borderTopColor: color.border.strong,
    paddingTop: layout.gutter,
    paddingHorizontal: layout.gutter,
    paddingBottom: layout.screen.bottom,
    gap: spacing.gap.section,
  },
  sheetFull: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  handle: {
    width: size.sheet.handle.w,
    height: size.sheet.handle.h,
    backgroundColor: color.border.soft,
    alignSelf: 'center',
    marginTop: opticalMargin.handle,
  },
});
