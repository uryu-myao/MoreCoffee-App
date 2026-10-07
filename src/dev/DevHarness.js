import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Text from '../components/base/Text';
import { color, layout, shape, spacing } from '../theme/tokens';
import AxisSliderPage from './pages/AxisSliderPage';
import ButtonPage from './pages/ButtonPage';
import EmptySlotPage from './pages/EmptySlotPage';
import FieldRowPage from './pages/FieldRowPage';
import IconButtonPage from './pages/IconButtonPage';
import RecordRowPage from './pages/RecordRowPage';
import SectionLabelPage from './pages/SectionLabelPage';
import SegmentedControlPage from './pages/SegmentedControlPage';
import StarRatingPage from './pages/StarRatingPage';
import TextPage from './pages/TextPage';
import TokenSheet from './TokenSheet';

/**
 * Dev harness: one page per base component, each rendering every state.
 * Register new pages here as components land.
 */
const PAGES = [
  { key: 'tokens', title: 'Tokens', Page: TokenSheet },
  { key: 'text', title: 'Text', Page: TextPage },
  { key: 'sectionLabel', title: 'SectionLabel', Page: SectionLabelPage },
  { key: 'fieldRow', title: 'FieldRow', Page: FieldRowPage },
  { key: 'segmented', title: 'SegmentedControl', Page: SegmentedControlPage },
  { key: 'starRating', title: 'StarRating', Page: StarRatingPage },
  { key: 'button', title: 'Button', Page: ButtonPage },
  { key: 'iconButton', title: 'IconButton', Page: IconButtonPage },
  { key: 'emptySlot', title: 'EmptySlot', Page: EmptySlotPage },
  { key: 'axisSlider', title: 'AxisSlider · dashes', Page: AxisSliderPage },
  { key: 'recordRow', title: 'Badge · RecordRow', Page: RecordRowPage },
];

export default function DevHarness() {
  const [active, setActive] = useState(PAGES[0].key);
  const { Page } = PAGES.find((p) => p.key === active);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView
        horizontal
        style={styles.navScroll}
        contentContainerStyle={styles.nav}
        showsHorizontalScrollIndicator={false}>
        {PAGES.map(({ key, title }) => {
          const on = key === active;
          return (
            <Pressable
              key={key}
              onPress={() => setActive(key)}
              accessibilityRole="tab"
              accessibilityState={{ selected: on }}
              style={[styles.navItem, on && styles.navItemOn]}>
              <Text variant="labelCaps" color={on ? color.badge.fg.selected : color.badge.fg.neutral}>
                {title}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <View style={styles.page}>
        <Page />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: color.surface.ground,
  },
  navScroll: {
    flexGrow: 0,
    borderBottomWidth: shape.borderWidth.box,
    borderBottomColor: color.border.strong,
  },
  nav: {
    paddingHorizontal: layout.gutter,
    paddingVertical: spacing.gap.section,
    gap: spacing.gap.row,
  },
  navItem: {
    paddingVertical: spacing.badge.standalone.v,
    paddingHorizontal: spacing.badge.standalone.h,
    borderWidth: shape.borderWidth.divider,
    borderColor: color.border.muted,
    backgroundColor: color.badge.bg.raised,
  },
  navItemOn: {
    borderColor: color.badge.bg.selected,
    backgroundColor: color.badge.bg.selected,
  },
  page: {
    flex: 1,
    paddingTop: spacing.gap.section,
  },
});
