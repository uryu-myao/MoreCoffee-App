import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import AddCoffeeOverlay from './components/AddCoffeeOverlay';
import FooterNav from './components/FooterNav';
import { SCREEN_COMPONENTS } from './screens';
import { color } from './theme/tokens';

/**
 * Tab shell. Safe-area insets are handled where the design measures them:
 * ScreenFrame at the top, FooterNav at the bottom — so no SafeAreaView here.
 * The overlay is the last child, so it covers the floating bar.
 */
export default function AppShell() {
  const [activeTab, setActiveTab] = useState('home');
  const [showAddCoffee, setShowAddCoffee] = useState(false);

  const ActiveScreen = SCREEN_COMPONENTS[activeTab] ?? SCREEN_COMPONENTS.home;

  return (
    <View style={styles.container}>
      <ActiveScreen />
      <FooterNav activeTab={activeTab} onTabPress={setActiveTab} onAddPress={() => setShowAddCoffee(true)} />
      <AddCoffeeOverlay visible={showAddCoffee} onClose={() => setShowAddCoffee(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.surface.ground,
  },
});
