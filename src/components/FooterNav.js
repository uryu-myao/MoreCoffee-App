import { Pressable, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import {
  ProfileIcon,
  AddCoffeeIcon,
  CalendarIcon,
  CoffeeListIcon,
  HomeIcon,
} from './icons/TabBarIcons';
import { TABS } from '../constants/navigation';
import { colors, radius, shadows, spacing } from '../theme/token';

export default function FooterNav({ activeTab, onTabPress, onAddPress }) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.footer}>
        <FooterTab
          label={TABS[0].label}
          isActive={activeTab === TABS[0].key}
          onPress={() => onTabPress(TABS[0].key)}
          icon={<HomeIcon isActive={activeTab === TABS[0].key} />}
        />
        <FooterTab
          label={TABS[1].label}
          isActive={activeTab === TABS[1].key}
          onPress={() => onTabPress(TABS[1].key)}
          icon={<CoffeeListIcon isActive={activeTab === TABS[1].key} />}
        />

        <Pressable
          style={styles.addButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onAddPress();
          }}
          accessibilityRole="button"
          accessibilityLabel="AddCoffee">
          <AddCoffeeIcon />
        </Pressable>

        <FooterTab
          label={TABS[2].label}
          isActive={activeTab === TABS[2].key}
          onPress={() => onTabPress(TABS[2].key)}
          icon={<CalendarIcon isActive={activeTab === TABS[2].key} />}
        />
        <FooterTab
          label={TABS[3].label}
          isActive={activeTab === TABS[3].key}
          onPress={() => onTabPress(TABS[3].key)}
          icon={<ProfileIcon isActive={activeTab === TABS[3].key} />}
        />
      </View>
    </View>
  );
}

function FooterTab({ label, icon, isActive, onPress }) {
  return (
    <Pressable
      style={styles.tabButton}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: isActive }}>
      <View style={styles.iconWrap}>{icon}</View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: spacing.sm,
    paddingTop: spacing.xs,
  },
  footer: {
    width: '88%',
    height: 54,
    backgroundColor: colors.background.card,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border.default,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.md,
    ...shadows.hard.light,
  },
  tabButton: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.sm,
  },
  iconWrap: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
