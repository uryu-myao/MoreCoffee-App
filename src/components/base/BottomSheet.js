import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import Reanimated, { interpolate, useAnimatedKeyboard, useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
 *
 * Otherwise the sheet wraps its content, up to the same top line (content that
 * is taller scrolls inside it).
 *
 * The handle is drawn as in 2b but does not drag (no mock shows dragging).
 * Tapping the dimmed page closes the sheet.
 *
 * Props
 *   visible   controlled; the sheet animates out before it unmounts
 *   onClose   scrim tap
 *   full      the full-height, keyboard-following form
 *   children
 */
const expandEasing = Easing.bezier(...motion.expand.controlPoints);
const PAGE_DIM = 1 - 0.45; // §9: the page behind drops to opacity 0.45

export default function BottomSheet({ visible, onClose, full = false, children }) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [mounted, setMounted] = useState(visible);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) setMounted(true);
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
          bottom: keyboard.height.value,
          paddingBottom: interpolate(keyboard.height.value, [0, layout.screen.bottom], [layout.screen.bottom, spacing.gap.section], 'clamp'),
        }
      : {}
  );

  if (!mounted) return null;
  const slide = { transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [height, 0] }) }] };

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: progress }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityRole="button" accessibilityLabel="Dismiss">
          <View style={[StyleSheet.absoluteFill, styles.pageDim]} />
          <View style={[StyleSheet.absoluteFill, styles.scrim]} />
        </Pressable>
      </Animated.View>
      <Animated.View style={[styles.slide, full && { top: insets.top + space[12] }, slide]} pointerEvents="box-none">
        <Reanimated.View
          style={[styles.sheet, full ? styles.sheetFull : { maxHeight: height - insets.top - space[12] }, followKeyboard]}
          accessibilityViewIsModal>
          <View style={styles.handle} />
          {children}
        </Reanimated.View>
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
