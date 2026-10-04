import * as Haptics from 'expo-haptics';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { TABS } from '../constants/navigation';
import { color, component, layout, shadow, shape, size, space, state } from '../theme/tokens';
import HardShadow from './base/HardShadow';
import { AddCoffeeIcon, CalendarIcon, HomeIcon, ProfileIcon, RecordsIcon } from './icons/TabBarIcons';

const ICONS = { home: HomeIcon, records: RecordsIcon, tryNext: CalendarIcon, profile: ProfileIcon };
const { slot, addSlot } = component.tabBar;

/**
 * Floating bar (design-system.md §9) carrying the tab bar — source 6a / 8d.
 * Pinned to the bottom over the content: no scrim, no handle, a fade above it
 * (state.fade over layout.fade.top), then a size.tabBar.height bar at 90% width
 * with shadow.floating.
 *
 * Bottom padding is layout.screen.bottom measured from the screen edge, never
 * less than the home-indicator inset (§9 Screen shell).
 *
 * Slots keep the source's 60×40 / 68×40 visual box; the touch area stretches to
 * the bar's full inner height so it clears size.tapTarget. Pressed darkens the
 * slot's fill (Hard Rule §1).
 */
export default function FooterNav({ activeTab, onTabPress, onAddPress }) {
  const insets = useSafeAreaInsets();

  const tab = ({ key, label }) => {
    const Icon = ICONS[key];
    const isActive = key === activeTab;
    return (
      <Slot
        key={key}
        box={slot}
        role="tab"
        label={label}
        selected={isActive}
        onPress={() => onTabPress(key)}>
        <Icon isActive={isActive} />
      </Slot>
    );
  };

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, layout.screen.bottom) }]}>
      <Fade />
      <HardShadow shadow={shadow.floating} style={styles.barFrame}>
        <View style={styles.bar}>
          {TABS.slice(0, 2).map(tab)}
          <Slot box={addSlot} role="button" label="Log a cup" onPress={onAddPress}>
            <AddCoffeeIcon />
          </Slot>
          {TABS.slice(2).map(tab)}
        </View>
      </HardShadow>
    </View>
  );
}

function Slot({ box, role, label, selected, onPress, children }) {
  return (
    <Pressable
      onPress={() => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      accessibilityRole={role}
      accessibilityLabel={label}
      accessibilityState={role === 'tab' ? { selected } : undefined}
      style={[styles.slotTouch, { width: box.w }]}>
      {({ pressed }) => (
        <View style={[styles.slotBox, { width: box.w, height: box.h }, pressed && styles.slotPressed]}>
          {children}
        </View>
      )}
    </Pressable>
  );
}

/** Transparent ground → solid ground across the fade band; solid below it. */
function Fade() {
  // pointerEvents on the Svg too: the wrapper's box-none does not reach its
  // children, so without it the gradient would swallow touches in the band.
  return (
    <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
      <Defs>
        <LinearGradient id="floatingBarFade" x1="0" y1="0" x2="0" y2={layout.fade.top} gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={state.fade.from} />
          <Stop offset="1" stopColor={state.fade.to} />
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#floatingBarFade)" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingTop: layout.fade.top,
    // Touches in the fade band fall through to the content behind it.
    pointerEvents: 'box-none',
  },
  barFrame: {
    width: '90%',
  },
  bar: {
    height: size.tabBar.height,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: space[4],
    borderWidth: shape.borderWidth.box,
    borderColor: color.border.strong,
    backgroundColor: color.surface.raised,
  },
  slotTouch: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotPressed: {
    backgroundColor: state.pressed.surface,
  },
});
