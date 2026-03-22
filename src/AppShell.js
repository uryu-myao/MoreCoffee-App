import { useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import AddCoffeeOverlay from './components/AddCoffeeOverlay';
import FooterNav from './components/FooterNav';
import { SCREEN_COMPONENTS } from './screens';

export default function AppShell() {
  const [activeTab, setActiveTab] = useState('home');
  const [showAddCoffee, setShowAddCoffee] = useState(false);

  const ActiveScreen = useMemo(
    () => SCREEN_COMPONENTS[activeTab] || SCREEN_COMPONENTS.home,
    [activeTab]
  );

  return (
    <SafeAreaView style={styles.container}>
      <ActiveScreen />

      <FooterNav
        activeTab={activeTab}
        onTabPress={setActiveTab}
        onAddPress={() => setShowAddCoffee(true)}
      />

      <AddCoffeeOverlay visible={showAddCoffee} onClose={() => setShowAddCoffee(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f4ef',
  },
});

