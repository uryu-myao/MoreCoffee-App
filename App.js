import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppShell from './src/AppShell';
import DevHarness from './src/dev/DevHarness';
import { fontAssets } from './src/theme/fonts';

// The base-component dev harness stays reachable for development:
//   EXPO_PUBLIC_DEV_HARNESS=1 npx expo start
const SHOW_DEV_HARNESS = __DEV__ && process.env.EXPO_PUBLIC_DEV_HARNESS === '1';

export default function App() {
  const [fontsLoaded] = useFonts(fontAssets);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      {SHOW_DEV_HARNESS ? <DevHarness /> : <AppShell />}
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
