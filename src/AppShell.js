import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, View, useWindowDimensions } from 'react-native';
import AddCoffeeOverlay from './components/AddCoffeeOverlay';
import { onShellRequest, requestOpenCup, requestTabReset } from './navigation';
import DotTexture from './components/base/DotTexture';
import FooterNav from './components/FooterNav';
import Notice from './components/Notice';
import ShellStack from './components/ShellStack';
import { TABS } from './constants/navigation';
import { SCREEN_COMPONENTS } from './screens';
import { ScreenBackdropContext } from './screens/ScreenFrame';
import { color } from './theme/tokens';

const PAGES = TABS.map((t) => t.key);

/**
 * Tab shell. Safe-area insets are handled where the design measures them:
 * ScreenFrame at the top, FooterNav at the bottom — so no SafeAreaView here.
 * The overlay is the last child, so it covers the bar; it sits outside the
 * pager, so swiping inside it never pages.
 *
 * The four tab screens sit side by side in a horizontal ScrollView (Home →
 * Records → Try next → Profile), **switched by the tab bar only**: swiping
 * between tabs was removed (2026-10-07) so the horizontal gesture stays free
 * for tabs inside a screen, and for horizontal controls such as the taste
 * axis. The ScrollView is kept, with scrolling disabled, because it keeps
 * every screen mounted (scroll position, collapse state) and its offset still
 * drives FooterNav's active state through a native-driver Animated.event.
 *
 * One ground + dot texture sits behind the pager (ScreenBackdropContext), so
 * the texture stays put while pages slide over it.
 *
 * The bottom bar stays put (decided on device, 2026-10-12: it no longer hides
 * on scroll; design-system.md §9 Bottom bar).
 */
export default function AppShell() {
  const { width } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState('home');
  const [showAddCoffee, setShowAddCoffee] = useState(false);
  const pager = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const position = useMemo(() => Animated.divide(scrollX, width), [scrollX, width]);

  const onScroll = useMemo(
    () => Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: true }),
    [scrollX]
  );

  // A footer tap switches instantly: no slide through the pages in between.
  const selectTab = (key) => {
    // Pressing the tab that is already showing returns it to its root.
    if (key === activeRef.current) requestTabReset(key);
    setActiveTab(key);
    pager.current?.scrollTo({ x: PAGES.indexOf(key) * width, animated: false });
  };

  // Screens ask for a tab or the Record sheet (navigation.js).
  useEffect(
    () =>
      onShellRequest(({ tab, record }) => {
        if (tab) selectTab(tab);
        if (record) setShowAddCoffee(true);
      }),
    // selectTab reads the latest width through its closure; re-subscribe with it.
    [width]
  );

  // Keep the current page if the width changes.
  const activeRef = useRef(activeTab);
  activeRef.current = activeTab;
  useEffect(() => {
    pager.current?.scrollTo({ x: PAGES.indexOf(activeRef.current) * width, animated: false });
  }, [width]);

  // Memoised so a tab switch (setActiveTab) re-renders the bar, not all four screens.
  const pages = useMemo(
    () =>
      PAGES.map((key) => {
        const Screen = SCREEN_COMPONENTS[key];
        return (
          <View key={key} style={{ width }}>
            <Screen />
          </View>
        );
      }),
    [width]
  );

  return (
    <View style={styles.container}>
      <DotTexture />
      <ScreenBackdropContext.Provider value={false}>
        <>
          <Animated.ScrollView
            ref={pager}
            horizontal
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={onScroll}
            keyboardShouldPersistTaps="handled">
            {pages}
          </Animated.ScrollView>
        </>
      </ScreenBackdropContext.Provider>
      <FooterNav activeTab={activeTab} position={position} onTabPress={selectTab} onAddPress={() => setShowAddCoffee(true)} />
      {/* 3d / 3c / 3a / 11a, pushed over the tabs and the bar (their mocks have none). */}
      <ShellStack />
      {/* 13b: "‹cup› deleted." above the bar, over Records. */}
      <Notice />
      <AddCoffeeOverlay
        visible={showAddCoffee}
        onClose={() => setShowAddCoffee(false)}
        // 5c's buttons: Home, or the saved cup's record (2c) in Records.
        onNavigate={({ tab, cupId }) => {
          selectTab(tab);
          if (cupId != null) requestOpenCup(cupId);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.surface.ground,
  },
});
