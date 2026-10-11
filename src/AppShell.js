import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View, useWindowDimensions } from 'react-native';
import AddCoffeeOverlay from './components/AddCoffeeOverlay';
import { requestOpenCup } from './navigation';
import DotTexture from './components/base/DotTexture';
import FooterNav from './components/FooterNav';
import { TABS } from './constants/navigation';
import { SCREEN_COMPONENTS } from './screens';
import { ScreenBackdropContext, ScrollChromeContext } from './screens/ScreenFrame';
import { color, motion } from './theme/tokens';

const PAGES = TABS.map((t) => t.key);
const easing = Easing.bezier(...motion.expand.controlPoints);

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
 * The bottom bar hides when a tab screen scrolls down and comes fully back on
 * any upward scroll (ScrollChromeContext; design-system.md §9 Bottom bar). It
 * is always either on its way out or fully back, never part-way, and the move
 * is eased (motion.expand), since it runs on after the finger. A tab tap
 * brings it back, so a screen too short to scroll is never left without it.
 */
export default function AppShell() {
  const { width } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState('home');
  const [showAddCoffee, setShowAddCoffee] = useState(false);
  const pager = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const position = useMemo(() => Animated.divide(scrollX, width), [scrollX, width]);

  // 0 = shown, 1 = hidden. Fires only on a change of direction, not per frame.
  const footerHidden = useRef(new Animated.Value(0)).current;
  const footerIsHidden = useRef(false);
  const setFooterHidden = useCallback(
    (hidden) => {
      if (footerIsHidden.current === hidden) return;
      footerIsHidden.current = hidden;
      Animated.timing(footerHidden, {
        toValue: hidden ? 1 : 0,
        duration: motion.expand.duration,
        easing,
        useNativeDriver: true,
      }).start();
    },
    [footerHidden]
  );
  const chrome = useMemo(
    () => ({ scrolledDown: () => setFooterHidden(true), scrolledUp: () => setFooterHidden(false) }),
    [setFooterHidden]
  );
  const onScroll = useMemo(
    () => Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: true }),
    [scrollX]
  );

  // A footer tap switches instantly: no slide through the pages in between.
  const selectTab = (key) => {
    setFooterHidden(false);
    setActiveTab(key);
    pager.current?.scrollTo({ x: PAGES.indexOf(key) * width, animated: false });
  };

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
        <ScrollChromeContext.Provider value={chrome}>
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
        </ScrollChromeContext.Provider>
      </ScreenBackdropContext.Provider>
      <FooterNav activeTab={activeTab} position={position} hidden={footerHidden} onTabPress={selectTab} onAddPress={() => setShowAddCoffee(true)} />
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
