import * as Haptics from 'expo-haptics';
import { useRef } from 'react';
import { Animated, Easing, Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TABS } from '../constants/navigation';
import { color, component, layout, motion, shape, size, space, state } from '../theme/tokens';
import { AddCoffeeIcon, HomeIcon, ProfileIcon, RecordsIcon, TryNextIcon } from './icons/TabBarIcons';

const ICONS = { home: HomeIcon, records: RecordsIcon, tryNext: TryNextIcon, profile: ProfileIcon };
const { slot, addSlot } = component.tabBar;

/**
 * Bottom bar (design-system.md §9, revised 2026-10-05) carrying the tab bar.
 * Full screen width on the bottom edge, no hard shadow: its 2px ink top rule is
 * the boundary. The source's floating, shadowed 90% bar read as a deliberate
 * object on an empty mock but as noise over a full list.
 *
 * No fade above the rule: it covered the content just above the bar (removed
 * on review, 2026-10-05). Below the size.tabBar.height row, padding clears the
 * home indicator (the safe-area inset).
 *
 * Five slots, the icons evenly spaced within the screen gutter (layout.gutter)
 * and the centre + exactly in the middle; the outer slots' touch areas extend
 * through the gutter to the screen edge. The touch area is the whole slot.
 *
 * Pressed (Hard Rule §1, by surface): the tab icons are bare glyphs, so they
 * scale to state.pressed.scale over motion.press. The + is an ink square, a
 * surface whose fill has no darker tier, so it shows no visual change (§1). Both
 * give a light impact haptic (a discrete press).
 */
export default function FooterNav({ activeTab, position, hidden, onTabPress, onAddPress }) {
  const insets = useSafeAreaInsets();
  // hidden: 0 → in place, 1 → its whole height below the screen edge.
  const barHeight = shape.borderWidth.box + size.tabBar.height + insets.bottom;
  const slide = hidden ? { transform: [{ translateY: hidden.interpolate({ inputRange: [0, 1], outputRange: [0, barHeight] }) }] } : null;

  const tab = ({ key, label }, index, edges) => {
    const Icon = ICONS[key];
    const isActive = key === activeTab;
    const page = TABS.findIndex((t) => t.key === key);
    return (
      <Slot
        key={key}
        box={slot}
        edge={edges[index]}
        role="tab"
        label={label}
        selected={isActive}
        onPress={() => onTabPress(key)}>
        {position ? <PagerIcon Icon={Icon} page={page} position={position} /> : <Icon isActive={isActive} />}
      </Slot>
    );
  };

  return (
    <Animated.View style={[styles.wrapper, slide]}>
      <View style={[styles.bar, { paddingBottom: insets.bottom }]}>
        <View style={styles.row}>
          {TABS.slice(0, 2).map((t, i) => tab(t, i, ['start', null]))}
          <Slot box={addSlot} role="button" label="Log a cup" onPress={onAddPress} feedback="none">
            <AddCoffeeIcon />
          </Slot>
          {TABS.slice(2).map((t, i) => tab(t, i, [null, 'end']))}
        </View>
      </View>
    </Animated.View>
  );
}

const pressEasing = Easing.bezier(...motion.press.controlPoints);

/**
 * The active state follows the pager continuously, not only on settle: the
 * active glyph is laid over the inactive one and its opacity tracks the pager
 * position (1 on its page, 0 one page away). Native driver, so it moves on the
 * UI thread with the drag. Opacity here is a crossfade between two states, not
 * press feedback, so the §1 no-opacity rule for pressed does not apply.
 */
function PagerIcon({ Icon, page, position }) {
  const opacity = position.interpolate({
    inputRange: [page - 1, page, page + 1],
    outputRange: [0, 1, 0],
    extrapolate: 'clamp',
  });
  return (
    <View>
      <Icon />
      <Animated.View style={[StyleSheet.absoluteFill, { opacity }]}>
        <Icon isActive />
      </Animated.View>
    </View>
  );
}

/** feedback: 'scale' (bare glyph) or 'none' (ink fill, no darker tier). */
function Slot({ box, edge, role, label, selected, onPress, feedback = 'scale', children }) {
  const scale = useRef(new Animated.Value(1)).current;
  const scaleTo = (toValue) =>
    Animated.timing(scale, { toValue, duration: motion.press.duration, easing: pressEasing, useNativeDriver: true }).start();
  const scales = feedback === 'scale';

  return (
    <Pressable
      onPress={() => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      onPressIn={scales ? () => scaleTo(state.pressed.scale) : undefined}
      onPressOut={scales ? () => scaleTo(1) : undefined}
      accessibilityRole={role}
      accessibilityLabel={label}
      accessibilityState={role === 'tab' ? { selected } : undefined}
      style={[styles.slotTouch, edge === 'start' && styles.slotStart, edge === 'end' && styles.slotEnd]}>
      {/* Only the glyph scales; the Pressable (the touch area) never does. */}
      <Animated.View style={[styles.slotBox, { width: box.w, height: box.h }, scales && { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  bar: {
    borderTopWidth: shape.borderWidth.box,
    borderTopColor: color.border.strong,
    backgroundColor: color.surface.raised,
  },
  row: {
    height: size.tabBar.height,
    flexDirection: 'row',
  },
  // Five slots share the row equally *after* the outer slots take
  // layout.gutter of padding: the icons sit as if the row were inset by the
  // screen gutter, while the outer touch areas still reach the screen edge.
  slotTouch: {
    flexBasis: 0,
    flexGrow: 1,
    alignItems: 'center',
    // Icons sit near the rule (less room above them, 2026-10-12); the touch
    // area still fills the row.
    justifyContent: 'flex-start',
    paddingTop: space[4],
  },
  slotStart: {
    paddingLeft: layout.gutter,
  },
  slotEnd: {
    paddingRight: layout.gutter,
  },
  slotBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
