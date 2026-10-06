import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, View, useWindowDimensions } from 'react-native';
import AddCoffeeOverlay from './components/AddCoffeeOverlay';
import DotTexture from './components/base/DotTexture';
import FooterNav from './components/FooterNav';
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
 * The four tab screens sit in a horizontal paging ScrollView (Home → Records →
 * Try next → Profile; the + is a modal trigger, not a stop). It is the native
 * scroll view, so the drag, the edge rubber-band (iOS bounce; Android's system
 * overscroll), the eased settle and the horizontal-vs-vertical arbitration
 * with each screen's own vertical ScrollView all run natively on the UI thread
 * — no per-frame JS. Its offset drives FooterNav's active state through a
 * native-driver Animated.event. The pager stops at both ends; it never wraps.
 *
 * One ground + dot texture sits behind the pager (ScreenBackdropContext), so
 * the texture stays put while pages slide over it.
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

  // The settled page becomes the active tab (accessibility state, tab taps).
  // Drag end without momentum lands here too; momentum end then confirms.
  const settle = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveTab(PAGES[Math.min(Math.max(index, 0), PAGES.length - 1)]);
  };

  // A footer tap switches instantly, as before the pager: no slide through
  // the pages in between.
  const selectTab = (key) => {
    setActiveTab(key);
    pager.current?.scrollTo({ x: PAGES.indexOf(key) * width, animated: false });
  };

  // Keep the current page if the width changes.
  const activeRef = useRef(activeTab);
  activeRef.current = activeTab;
  useEffect(() => {
    pager.current?.scrollTo({ x: PAGES.indexOf(activeRef.current) * width, animated: false });
  }, [width]);

  // Memoised so a settle (setActiveTab) re-renders the bar, not all four screens.
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
        <Animated.ScrollView
          ref={pager}
          horizontal
          pagingEnabled
          bounces
          directionalLockEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={onScroll}
          onScrollEndDrag={settle}
          onMomentumScrollEnd={settle}
          keyboardShouldPersistTaps="handled">
          {pages}
        </Animated.ScrollView>
      </ScreenBackdropContext.Provider>
      <FooterNav activeTab={activeTab} position={position} onTabPress={selectTab} onAddPress={() => setShowAddCoffee(true)} />
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
