import { useContext, useMemo, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { MODE_BADGE, cupTitle, tidyNote } from '../constants/cups';
import { sortLabel } from '../constants/records';
import { ContentScrollContext } from '../screens/ScreenFrame';
import { color, layout, shape, spacing } from '../theme/tokens';
import { AlignedDotTexture } from './base/DotTexture';
import RecordRow from './base/RecordRow';
import Text from './base/Text';

/**
 * One group of the archive (2a; moved out of RecordsScreen for search's
 * Kind / Rating results, Design Round 15, 18e, which keep its shape): the
 * group's heading (its label in accent, the sort's name on the right, the
 * hairline under it), then 2a's rows.
 *
 * Pinned headings (Uryu, 2026-10-24): inside a ScreenFrame scroll page, a
 * heading stays under the header (`top` below the page's foot) until the
 * next one pushes it up; scrolling back, it returns with the content. Built
 * on ScreenFrame's ContentScrollContext (RN's stickyHeaderIndices pins one
 * block at a time, and only a direct child of the ScrollView). A pinned
 * heading hides the rows passing under it: surface.ground edge to edge, with
 * the page's dots drawn in it, lined up with the page's (AlignedDotTexture),
 * so it still reads as the page. The line between a heading and its first
 * row belongs to the heading, so it stays while the heading is pinned.
 * Outside a ScreenFrame page (search) nothing pins.
 *
 * Props: group ({ key, label, cups }), sort, top (where headings pin; 0
 * under the header), listY (the list's y in the page), onOpen(id)
 */
export function pinFrom(scroll, from, travel) {
  if (!scroll || from == null) return null;
  scroll = scroll.under;
  if (travel == null) {
    // No end: once reached, it stays.
    return scroll.interpolate({ inputRange: [from, from + 1], outputRange: [0, 1], extrapolateLeft: 'clamp' });
  }
  if (!(travel > 0)) return null;
  return scroll.interpolate({ inputRange: [from, from + travel], outputRange: [0, travel], extrapolate: 'clamp' });
}

/**
 * A pinned block's top on screen, for its dots: the page's top + its y in
 * the page + how far it has pinned.
 */
function usePinnedTop(scroll, pageY, pin) {
  return useMemo(() => {
    if (!scroll || pageY == null) return null;
    const base = Animated.add(scroll.pageTop, pageY);
    return pin ? Animated.add(base, pin) : base;
  }, [scroll, pageY, pin]);
}

const dayFormat = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' });

export default function RecordGroup({ group, sort, top = 0, listY = 0, onOpen }) {
  const scroll = useContext(ContentScrollContext);
  const [box, setBox] = useState(null); // { y, h, head }
  const measure = (key) => (e) => {
    const v = key === 'head' ? e.nativeEvent.layout.height : e.nativeEvent.layout;
    setBox((prev) => {
      const next = { ...prev, ...(key === 'head' ? { head: v } : { y: v.y, h: v.height }) };
      return prev && prev.y === next.y && prev.h === next.h && prev.head === next.head ? prev : next;
    });
  };
  const ready = scroll && box && box.head != null && box.y != null && listY != null && top != null;
  const from = ready ? listY + box.y - top : null;
  const travel = ready ? box.h - box.head : null;
  const pin = useMemo(() => (from == null ? null : pinFrom(scroll, from, travel)), [scroll, from, travel]);
  const screenTop = usePinnedTop(scroll, ready ? listY + box.y : null, pin);
  return (
    <View onLayout={scroll ? measure('group') : undefined}>
      <Animated.View
        onLayout={scroll ? measure('head') : undefined}
        style={[styles.head, scroll && styles.pinned, pin && { transform: [{ translateY: pin }] }]}>
        {screenTop ? <AlignedDotTexture y={screenTop} /> : null}
        <View style={[styles.month, styles.headLine]}>
          {group.label ? (
            <Text variant="labelEyebrow" color="accent" style={styles.groupLabel} numberOfLines={1}>
              {group.label}
            </Text>
          ) : (
            <View />
          )}
          <Text variant="labelEyebrow" color="muted">
            {sortLabel(sort)}
          </Text>
        </View>
      </Animated.View>
      {group.cups.map((cup) => {
        const { title, source } = cupTitle(cup);
        return (
          <RecordRow
            key={cup.id}
            title={title}
            badges={[MODE_BADGE[cup.mode]]}
            source={source}
            note={tidyNote(cup.note) || undefined}
            rating={cup.rating}
            date={dayFormat.format(new Date(cup.logged_at))}
            onPress={() => onOpen(cup.id)}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  // A pinned block: opaque from the screen's left edge to its right (it
  // starts at the page's left edge, as AlignedDotTexture needs), clipping
  // the texture's overhang.
  pinned: {
    marginHorizontal: -layout.gutter,
    paddingHorizontal: layout.gutter,
    backgroundColor: color.surface.ground,
    overflow: 'hidden',
  },
  head: {
    zIndex: 1,
  },
  // The heading carries the hairline under it (RecordRow's `first` line,
  // moved here), at the content's width, so a pinned heading keeps it.
  headLine: {
    borderBottomWidth: shape.borderWidth.divider,
    borderBottomColor: color.divider.hairlineStrong,
  },
  groupLabel: {
    flexShrink: 1,
  },
  month: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.gap.row,
    paddingBottom: spacing.gap.row,
  },
});
