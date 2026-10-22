import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import BeanFreshness from './BeanFreshness';
import { useDatabase } from '../data/DatabaseProvider';
import { GEAR_CATEGORY, GEAR_LIMIT, onCups } from '../constants/gear';
import { OPEN_BAG_LIMIT, listGearWithUse, listShelfBags, onCupsChanged, onShelfChanged } from '../data/repository';
import { color, icon, shape, size, space, spacing, state } from '../theme/tokens';
import Badge from './base/Badge';
import AddButton from './base/AddButton';
import Glyph from './base/Glyph';
import PhotoPlaceholder from './base/PhotoPlaceholder';
import Text from './base/Text';

/**
 * Home's My gear / My beans (4a / 4b): two folder tabs over one card.
 *
 * Tabs: the selected one on surface.raised with ink text, joined to the card;
 * the other on badge.bg.neutral with muted text (4a / 4b). label.caps.
 *
 * My beans (4b): open bags, newest opened first — thumbnail, name, "roaster ·
 * 250 g", and beanFreshness under it ("Day 7 · drink now" and its bar, from
 * the roast date; nothing without one; gaps.md 8, decided 2026-10-14). Then "Manage my beans  N / 5" →
 * 3d. No bag: an "Add a bag" AddButton (3d's vocabulary) → 3c.
 *
 * My gear (4a): every piece of gear, defaults first — name with a "Default"
 * badge, "Brewer · 2 cups" / "· not used yet". A kettle or scale is never on
 * a cup, so its line is the category alone. Then "Manage my gear  N / 8" →
 * 3b (2026-10-22), as My beans'. No gear: an "Add gear" AddButton → 3a.
 *
 * No item dividers (Design Round 9, 2026-10-18): rows are set apart by
 * spacing.inset.listRow alone, and "Manage my beans" sits under the last row
 * with no rule, as 4a / 4b draw it.
 *
 * Thumbnails are FieldRow's swatch (size.field.height, 46): 4a / 4b draw 44,
 * which has no token (drift D-51).
 *
 * Props: onManageBeans, onManageGear, onAddBag, onAddGear
 */
export default function ShelfBlock({ onManageBeans, onManageGear, onAddBag, onAddGear }) {
  const db = useDatabase();
  const [tab, setTab] = useState('beans');
  const [shelf, setShelf] = useState(null);

  useEffect(() => {
    const load = () =>
      Promise.all([listShelfBags(db), listGearWithUse(db)]).then(
        ([bags, gear]) => setShelf({ bags, gear }),
        (error) => console.error('[home] could not read the shelf', error)
      );
    load();
    const offShelf = onShelfChanged(load);
    const offCups = onCupsChanged(load);
    return () => {
      offShelf();
      offCups();
    };
  }, [db]);

  if (!shelf) return null;
  return (
    <View>
      <View style={styles.tabs} accessibilityRole="tablist">
        <Tab label="My gear" on={tab === 'gear'} onPress={() => setTab('gear')} />
        <Tab label="My beans" on={tab === 'beans'} onPress={() => setTab('beans')} first={false} />
      </View>
      <View style={styles.card}>{tab === 'beans' ? <Beans bags={shelf.bags} onManage={onManageBeans} onAdd={onAddBag} /> : <Gear gear={shelf.gear} onManage={onManageGear} onAdd={onAddGear} />}</View>
    </View>
  );
}

function Tab({ label, on, onPress, first = true }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: on }}
      style={({ pressed }) => [styles.tab, !first && styles.tabNext, on ? styles.tabOn : styles.tabOff, pressed && !on && styles.pressed]}>
      <Text variant="labelCaps" color={on ? 'primary' : 'muted'}>
        {label}
      </Text>
    </Pressable>
  );
}

function Beans({ bags, onManage, onAdd }) {
  if (!bags.length) return <AddButton icon="plus" iconToken={icon.sm} label="Add a bag" onPress={onAdd} />;
  return (
    <>
      {bags.map((bag) => (
        // 4b: the bag row, then its freshness under it (nothing without a roast date).
        <View key={bag.id} style={styles.bag}>
          <View style={styles.bagTop}>
            <PhotoPlaceholder size={size.field.height} />
            <View style={styles.text}>
              <Text variant="label" truncate="name">
                {bag.name}
              </Text>
              <Text variant="bodySm" color="muted" truncate="meta">
                {[bag.roaster, bag.size_g ? `${bag.size_g} g` : null, bag.opened_at ? null : 'Not opened yet'].filter(Boolean).join(' · ') || ' '}
              </Text>
            </View>
          </View>
          <BeanFreshness roastedAt={bag.roasted_at} />
        </View>
      ))}
      <Manage label="Manage my beans" count={`${bags.length} / ${OPEN_BAG_LIMIT}`} onPress={onManage} />
    </>
  );
}

function Gear({ gear, onManage, onAdd }) {
  if (!gear.length) return <AddButton icon="plus" iconToken={icon.sm} label="Add gear" onPress={onAdd} />;
  const rows = gear.map((g) => {
    const line = onCups(g.category) ? `${GEAR_CATEGORY[g.category]} · ${g.cups ? `${g.cups} ${g.cups === 1 ? 'cup' : 'cups'}` : 'not used yet'}` : GEAR_CATEGORY[g.category];
    return (
      <View key={g.id} style={styles.row}>
        <PhotoPlaceholder size={size.field.height} />
        <View style={styles.text}>
          <View style={styles.nameRow}>
            <Text variant="label" truncate="name" style={styles.name}>
              {g.name}
            </Text>
            {g.is_default ? <Badge label="Default" tone="selected" /> : null}
          </View>
          <Text variant="bodySm" color="muted" truncate="meta">
            {line}
          </Text>
        </View>
      </View>
    );
  });
  return (
    <>
      {rows}
      <Manage label="Manage my gear" count={`${gear.length} / ${GEAR_LIMIT}`} onPress={onManage} />
    </>
  );
}

/**
 * "Manage my beans   2 / 5  ›" — a whole row, so a chevron (§1 Tap
 * affordance). Pressed (state.pressed.row, 2026-10-18): the fill bleeds
 * through the card's padding to its frame, sides and bottom, past the label.
 */
function Manage({ label, count, onPress }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`${label}, ${count}`} style={({ pressed }) => [styles.manage, pressed && styles.managePressed]}>
      <Text variant="labelCaps" color="primary">
        {label}
      </Text>
      <View style={styles.manageEnd}>
        <Text variant="labelCaps" color="muted">
          {count}
        </Text>
        <Glyph name="chevronRight" token={icon.md} color={color.icon.default} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    // The tabs overlap the card's top border, so the selected one joins it.
    marginBottom: -shape.borderWidth.box,
    zIndex: 1,
  },
  tab: {
    minHeight: size.tapTarget,
    justifyContent: 'center',
    paddingHorizontal: spacing.inset.control.h,
    borderWidth: shape.borderWidth.box,
    borderBottomWidth: 0,
    borderColor: color.border.strong,
  },
  tabNext: {
    borderLeftWidth: 0,
  },
  tabOn: {
    backgroundColor: color.surface.raised,
    // Covers the card's top border under the selected tab.
    paddingBottom: shape.borderWidth.box,
  },
  tabOff: {
    backgroundColor: color.badge.bg.neutral,
    borderBottomWidth: shape.borderWidth.box,
  },
  pressed: {
    backgroundColor: state.pressed.surface,
  },
  card: {
    borderWidth: shape.borderWidth.box,
    borderColor: color.border.strong,
    backgroundColor: color.surface.raised,
    paddingHorizontal: spacing.inset.container.h,
    paddingVertical: spacing.gap.row,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
    paddingVertical: spacing.inset.listRow.v,
  },
  // 4b: the bag row over its freshness (gap 9 in the mock; gap.row).
  bag: {
    gap: spacing.gap.row,
    paddingVertical: spacing.inset.listRow.v,
  },
  bagTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
  },
  text: {
    flex: 1,
    minWidth: 0,
    gap: spacing.gap.tight,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.gap.row,
  },
  name: {
    flexShrink: 1,
  },
  // Out through the card's padding to its frame (sides and bottom), padded
  // back in: the content stays put, the 44 row keeps its height.
  manage: {
    minHeight: size.tapTarget + spacing.gap.row,
    marginHorizontal: -spacing.inset.container.h,
    paddingHorizontal: spacing.inset.container.h,
    marginBottom: -spacing.gap.row,
    paddingBottom: spacing.gap.row,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  managePressed: {
    backgroundColor: state.pressed.row,
  },
  manageEnd: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.gap.row,
  },
});
