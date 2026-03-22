import { Pressable, StyleSheet, View } from 'react-native';
import {
  AccountIcon,
  AddCoffeeIcon,
  CoffeeListIcon,
  HomeIcon,
  SearchIcon,
} from './icons/TabBarIcons';
import { TABS } from '../constants/navigation';

export default function FooterNav({ activeTab, onTabPress, onAddPress }) {
  return (
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
        onPress={onAddPress}
        accessibilityRole="button"
        accessibilityLabel="AddCoffee">
        <AddCoffeeIcon />
      </Pressable>

      <FooterTab
        label={TABS[2].label}
        isActive={activeTab === TABS[2].key}
        onPress={() => onTabPress(TABS[2].key)}
        icon={<SearchIcon isActive={activeTab === TABS[2].key} />}
      />
      <FooterTab
        label={TABS[3].label}
        isActive={activeTab === TABS[3].key}
        onPress={() => onTabPress(TABS[3].key)}
        icon={<AccountIcon isActive={activeTab === TABS[3].key} />}
      />
    </View>
  );
}

function FooterTab({ label, icon, onPress }) {
  return (
    <Pressable
      style={styles.tabButton}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}>
      <View style={styles.iconWrap}>{icon}</View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  footer: {
    width: '90%',
    height: 60,
    backgroundColor: '#ffffff',
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  tabButton: {
    width: 60,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    width: 68,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    // marginTop: -18,
  },
  iconWrap: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
