import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import DevHarness from './src/dev/DevHarness';
import { fontAssets } from './src/theme/fonts';

// TODO: render AppShell again once the screens are rebuilt on tokens.ts.
// The current screens still import the removed theme/token module, so the
// entry point shows the base-component dev harness in the meantime.
export default function App() {
  const [fontsLoaded] = useFonts(fontAssets);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <DevHarness />
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
