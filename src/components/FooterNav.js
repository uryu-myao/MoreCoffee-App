import * as Haptics from 'expo-haptics';
import { useRef } from 'react';
import { Animated, Easing, Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TABS } from '../constants/navigation';
import { color, component, layout, motion, shape, size, space, spacing, state } from '../theme/tokens';
import Text from './base/Text';
import { AddCoffeeIcon, HomeIcon, ProfileIcon, RecordsIcon, TryNextIcon } from './icons/TabBarIcons';

const ICONS = { home: HomeIcon, records: RecordsIcon, tryNext: TryNextIcon, profile: ProfileIcon };
const { slot, addSlot, glyph, addLift, icon: iconColor } = component.tabBar;

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
 * Each tab names itself under its glyph (2026-10-18): tabLabel, gap.tight
 * below the glyph, in the glyph's colour, so the active blue covers both.
 * The + has no name (its accessibility label is "Log a cup"); it sits
 * component.tabBar.addLift (4) above the block's centre, since the tabs'
 * weight is in their glyphs. Only the drawing moves; the touch area doesn't.
 *
 * Pressed (Hard Rule §1, by surface): the tab icons are bare glyphs, so they
 * scale to state.pressed.scale over motion.press (the name with them). The +
 * is an ink square, a surface whose fill has no darker tier, so it scales too
 * (§1, 2026-10-18; it used to show no change). Both give a light impact
 * haptic (a discrete press).
 */
/**
 * Room under the row: the home-indicator inset less space.8 (26 on notched
 * iPhones). 2026-10-12 it was less space.14 (20); 2026-10-15, on device, a
 * little taller — the row (and the icons' room above them) is unchanged,
 * only the space under it grows.
 */
const footerInset = (insets) => Math.max(0, insets.bottom - space[8]);

/** The bar's height from the screen's bottom edge (its rule, row and the trimmed inset); 13b's notice sits above it. */
export function useFooterHeight() {
  const insets = useSafeAreaInsets();
  return shape.borderWidth.box + size.tabBar.height + footerInset(insets);
}

export default function FooterNav({ activeTab, position, hidden, onTabPress, onAddPress }) {
  const insets = useSafeAreaInsets();
  // hidden: 0 → in place, 1 → its whole height below the screen edge.
  const barHeight = useFooterHeight();
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
        {position ? (
          <PagerTab Icon={Icon} label={label} page={page} position={position} />
        ) : (
          <TabContent Icon={Icon} label={label} isActive={isActive} />
        )}
      </Slot>
    );
  };

  return (
    <Animated.View style={[styles.wrapper, slide]}>
      <View style={[styles.bar, { paddingBottom: footerInset(insets) }]}>
        <View style={styles.row}>
          {TABS.slice(0, 2).map((t, i) => tab(t, i, ['start', null]))}
          <Slot box={addSlot} role="button" label="Log a cup" onPress={onAddPress}>
            <View style={styles.add}>
              <AddCoffeeIcon />
            </View>
          </Slot>
          {TABS.slice(2).map((t, i) => tab(t, i, [null, 'end']))}
        </View>
      </View>
    </Animated.View>
  );
}

const pressEasing = Easing.bezier(...motion.press.controlPoints);

/** A tab's glyph, centred in its 20 box, and its name under it, in one colour. */
function TabContent({ Icon, label, isActive = false }) {
  return (
    <View style={styles.tab}>
      <View style={styles.glyph}>
        <Icon isActive={isActive} />
      </View>
      <Text variant="tabLabel" color={isActive ? iconColor.active : iconColor.inactive}>
        {label}
      </Text>
    </View>
  );
}

/**
 * The active state follows the pager continuously, not only on settle: the
 * active glyph and name are laid over the inactive ones and their opacity
 * tracks the pager position (1 on its page, 0 one page away). Native driver,
 * so it moves on the UI thread with the drag. Opacity here is a crossfade
 * between two states, not press feedback, so the §1 no-opacity rule for
 * pressed does not apply.
 */
function PagerTab({ Icon, label, page, position }) {
  const opacity = position.interpolate({
    inputRange: [page - 1, page, page + 1],
    outputRange: [0, 1, 0],
    extrapolate: 'clamp',
  });
  return (
    <View>
      <TabContent Icon={Icon} label={label} />
      <Animated.View style={[StyleSheet.absoluteFill, { opacity }]}>
        <TabContent Icon={Icon} label={label} isActive />
      </Animated.View>
    </View>
  );
}

/** Every slot scales when pressed: bare glyphs, and the + (ink, no darker tier). */
function Slot({ box, edge, role, label, selected, onPress, children }) {
  const scale = useRef(new Animated.Value(1)).current;
  const scaleTo = (toValue) =>
    Animated.timing(scale, { toValue, duration: motion.press.duration, easing: pressEasing, useNativeDriver: true }).start();

  return (
    <Pressable
      onPress={() => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      onPressIn={() => scaleTo(state.pressed.scale)}
      onPressOut={() => scaleTo(1)}
      accessibilityRole={role}
      accessibilityLabel={label}
      accessibilityState={role === 'tab' ? { selected } : undefined}
      style={[styles.slotTouch, edge === 'start' && styles.slotStart, edge === 'end' && styles.slotEnd]}>
      {/* Only the glyph scales; the Pressable (the touch area) never does. */}
      <Animated.View style={[styles.slotBox, { width: box.w, height: box.h }, { transform: [{ scale }] }]}>
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
    // Centred in the 56 row: 8 above and below the 40 slot box (2026-10-18).
    justifyContent: 'center',
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
  tab: {
    alignItems: 'center',
    gap: spacing.gap.tight,
  },
  glyph: {
    height: glyph,
    justifyContent: 'center',
  },
  add: {
    transform: [{ translateY: -addLift }],
  },
});
