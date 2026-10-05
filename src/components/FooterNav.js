import * as Haptics from 'expo-haptics';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TABS } from '../constants/navigation';
import { color, component, shape, size, state } from '../theme/tokens';
import { AddCoffeeIcon, CalendarIcon, HomeIcon, ProfileIcon, RecordsIcon } from './icons/TabBarIcons';

const ICONS = { home: HomeIcon, records: RecordsIcon, tryNext: CalendarIcon, profile: ProfileIcon };
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
 * Five equal slots across the full width, so the icons are evenly spaced and
 * the centre + sits exactly in the middle. Each keeps the source's 60×40 /
 * 68×40 visual box for its pressed fill (Hard Rule §1); the touch area is the
 * whole slot.
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
    <View style={styles.wrapper}>
      <View style={[styles.bar, { paddingBottom: insets.bottom }]}>
        <View style={styles.row}>
          {TABS.slice(0, 2).map(tab)}
          <Slot box={addSlot} role="button" label="Log a cup" onPress={onAddPress}>
            <AddCoffeeIcon />
          </Slot>
          {TABS.slice(2).map(tab)}
        </View>
      </View>
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
      style={styles.slotTouch}>
      {({ pressed }) => (
        <View style={[styles.slotBox, { width: box.w, height: box.h }, pressed && styles.slotPressed]}>
          {children}
        </View>
      )}
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
  slotTouch: {
    flex: 1,
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
