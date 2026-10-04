import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { resolveTextStyle } from '../theme/fonts';
import { color, layout, shape, spacing, textStyle } from '../theme/tokens';
import TokenSheet from './TokenSheet';

/**
 * Dev harness: one page per base component, each rendering every state.
 * Register new pages here as components land.
 */
const PAGES = [{ key: 'tokens', title: 'Tokens', Page: TokenSheet }];

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
              <Text style={[resolveTextStyle(textStyle.labelCaps), on ? styles.navTextOn : styles.navText]}>
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
  navText: {
    color: color.badge.fg.neutral,
  },
  navTextOn: {
    color: color.badge.fg.selected,
  },
  page: {
    flex: 1,
    paddingTop: spacing.gap.section,
  },
});
