import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import { color, motion, shape, size, space, spacing, state } from '../theme/tokens';
import Text from './base/Text';

/**
 * The My gear / My beans tabs (Round 14): the heading of Home's shelf
 * (17a / 17b) and of Gear & beans (17c / 17d). No box, no folder tabs: two
 * labels, each with its count, set as a section heading.
 *
 * A tab: label.caps label, then its count in label.caps (Round 14 §0,
 * 2026-10-27: the mock's 13 / .06em and 12 / .04em fold to it), gap.tight
 * apart. Open: ink label, accent count, a box-wide (2) ink underline.
 * Closed: muted label and count, no underline. size.tapTarget tall, the text
 * at its foot, space.12 over the underline. The underlines follow the pages'
 * scroll (`progress`): one fades out as the other fades in under the finger,
 * so they never jump; the labels switch at the midpoint.
 *
 * The row sits on the first row's divider (shape.borderWidth.divider) below
 * it: it overlaps the content under it by the divider plus half of what the
 * underline is wider, so the underline lands centred on the divider and the
 * two read as one line (the mock's −1.75).
 *
 * Tabs space.20 apart (the mock's 22 is layout.gutter, the screen's edge, not
 * a gap; 20 is the nearest step). Having no surface, a tab presses by scale
 * (state.pressed.scale over motion.press), as a text button.
 *
 * Props
 *   active    'gear' | 'beans'
 *   progress  Animated 0 (gear) … 1 (beans), from useShelfPager
 *   counts    { gear, beans }
 *   onSelect  (side) => void
 *   trailing  optional node at the row's right end, on the labels' foot
 *             (17c's slot count)
 */
export const TAB_OVERLAP = shape.borderWidth.divider + (shape.borderWidth.box - shape.borderWidth.divider) / 2;

const TABS = [
  { side: 'gear', label: 'My gear' },
  { side: 'beans', label: 'My beans' },
];

export default function ShelfTabs({ active, progress, counts, onSelect, trailing }) {
  const shown = { gear: progress.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }), beans: progress };
  return (
    <View style={styles.row} accessibilityRole="tablist">
      <View style={styles.tabs}>
        {TABS.map((t) => (
          <Tab key={t.side} label={t.label} count={counts[t.side]} on={active === t.side} underline={shown[t.side]} onPress={() => onSelect(t.side)} />
        ))}
      </View>
      {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
    </View>
  );
}

const pressEasing = Easing.bezier(...motion.press.controlPoints);

function Tab({ label, count, on, underline, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  const scaleTo = (toValue) =>
    Animated.timing(scale, { toValue, duration: motion.press.duration, easing: pressEasing, useNativeDriver: true }).start();
  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => scaleTo(state.pressed.scale)}
      onPressOut={() => scaleTo(1)}
      accessibilityRole="tab"
      accessibilityLabel={`${label}, ${count}`}
      accessibilityState={{ selected: on }}
      style={styles.tab}>
      <Animated.View style={[styles.underline, { opacity: underline }]} />
      <Animated.View style={[styles.text, { transform: [{ scale }] }]}>
        <Text variant="labelCaps" color={on ? 'primary' : 'muted'}>
          {label}
        </Text>
        <Text variant="labelCaps" color={on ? 'accent' : 'muted'}>
          {count}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

/**
 * The two sides as pages in a horizontal Animated.ScrollView (Home's shelf,
 * Gear & beans). `span` is how far the pages scroll from gear to beans.
 * Returns the open side, the scroll's progress (0 gear … 1 beans) for
 * ShelfTabs, select(side) for a tab, and the props for the ScrollView.
 *
 * The open side follows the scroll past the midpoint, except while a tab's
 * own scroll runs: it passes through the old side's half, and following it
 * there flipped the tab and the slot count back and forth (Uryu, on device,
 * 2026-10-27). A drag, or the scroll's end, hands it back to the scroll.
 */
export function useShelfPager(span, openOn = 'gear') {
  const [side, setSide] = useState(openOn);
  const ref = useRef(null);
  const current = useRef(openOn);
  const tapped = useRef(false);
  const scrollX = useRef(new Animated.Value(openOn === 'beans' ? span : 0)).current;
  const show = (next) => {
    if (current.current === next) return;
    current.current = next;
    setSide(next);
  };
  const onScroll = useMemo(
    () =>
      Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
        useNativeDriver: true,
        listener: (e) => {
          if (!tapped.current) show(e.nativeEvent.contentOffset.x > span / 2 ? 'beans' : 'gear');
        },
      }),
    [scrollX, span]
  );
  const release = () => {
    tapped.current = false;
  };
  const select = (next) => {
    tapped.current = true;
    show(next);
    ref.current?.scrollTo({ x: next === 'beans' ? span : 0, animated: true });
  };
  const progress = scrollX.interpolate({ inputRange: [0, span], outputRange: [0, 1], extrapolate: 'clamp' });
  return { side, progress, select, scrollProps: { ref, onScroll, scrollEventThrottle: 16, onScrollBeginDrag: release, onMomentumScrollEnd: release } };
}

const fadeEasing = Easing.bezier(...motion.expand.controlPoints);
const FADE = motion.expand.duration / 2;

/**
 * 17c's slot count at the tab row's right end: "7 / 8" (label.caps, accent)
 * then "In my kit" (meterLabel, muted), space.6 apart, on one baseline.
 * When the side changes it crossfades, out then in, over one motion.expand,
 * rather than swapping in a frame.
 */
export function SlotCount({ value, label }) {
  const [shown, setShown] = useState({ value, label });
  const opacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (shown.value === value && shown.label === label) {
      // Back to what is shown before the fade finished: bring it back up.
      Animated.timing(opacity, { toValue: 1, duration: FADE, easing: fadeEasing, useNativeDriver: true }).start();
      return;
    }
    if (shown.label === label) {
      // Same side, a new count (a bag added): no fade.
      setShown({ value, label });
      return;
    }
    Animated.timing(opacity, { toValue: 0, duration: FADE, easing: fadeEasing, useNativeDriver: true }).start(({ finished }) => {
      if (!finished) return;
      setShown({ value, label });
      Animated.timing(opacity, { toValue: 1, duration: FADE, easing: fadeEasing, useNativeDriver: true }).start();
    });
  }, [value, label]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Animated.View style={[styles.slot, { opacity }]} accessible accessibilityLabel={`${value} ${label}`}>
      <Text variant="labelCaps" color="accent">
        {shown.value}
      </Text>
      <Text variant="meterLabel" color="muted">
        {shown.label}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing.gap.section,
    marginBottom: -TAB_OVERLAP,
    zIndex: 1,
  },
  tabs: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: space[20],
  },
  tab: {
    minHeight: size.tapTarget,
    justifyContent: 'flex-end',
    paddingBottom: space[12] + shape.borderWidth.box,
  },
  underline: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: shape.borderWidth.box,
    backgroundColor: color.border.strong,
  },
  text: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.gap.tight,
  },
  // On the labels' foot: the same space.12 over the underline's line.
  trailing: {
    paddingBottom: space[12] + shape.borderWidth.box,
  },
  slot: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: space[6],
  },
});
