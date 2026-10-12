import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { daysSince } from '../constants/dates';
import { useDatabase } from '../data/DatabaseProvider';
import { OPEN_BAG_LIMIT, listGearWithUse, listShelfBags, onCupsChanged, onShelfChanged } from '../data/repository';
import { color, icon, shape, size, space, spacing, state } from '../theme/tokens';
import Badge from './base/Badge';
import EmptySlot from './base/EmptySlot';
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
 * 250 g", and "Day N" from the roast date (no freshness meter at this stage,
 * gaps.md 8; nothing without a roast date). Then "Manage my beans  N / 5" →
 * 3d. No bag: an "Add a bag" slot (3d's vocabulary) → 3c.
 *
 * My gear (4a): every piece of gear, defaults first — name with a "Default"
 * badge, "Brewer · 2 cups" / "· not used yet". A kettle or scale is never on
 * a cup, so its line is the category alone. "Manage my gear" → 3b is not at
 * this stage: not shown. No gear: an "Add gear" slot → 3a.
 *
 * Thumbnails are FieldRow's swatch (size.field.height, 46): 4a / 4b draw 44,
 * which has no token (drift D-51).
 *
 * Props: onManageBeans, onAddBag, onAddGear
 */
const CATEGORY = { brewer: 'Brewer', grinder: 'Grinder', kettle: 'Kettle', scale: 'Scale' };

export default function ShelfBlock({ onManageBeans, onAddBag, onAddGear }) {
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
      <View style={styles.card}>{tab === 'beans' ? <Beans bags={shelf.bags} onManage={onManageBeans} onAdd={onAddBag} /> : <Gear gear={shelf.gear} onAdd={onAddGear} />}</View>
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
  if (!bags.length) return <EmptySlot icon="plus" iconToken={icon.sm} label="Add a bag" onPress={onAdd} />;
  return (
    <>
      {bags.map((bag, i) => (
        <View key={bag.id} style={[styles.row, i > 0 && styles.divided]}>
          <PhotoPlaceholder size={size.field.height} />
          <View style={styles.text}>
            <Text variant="label" truncate="name">
              {bag.name}
            </Text>
            <Text variant="bodySm" color="muted" truncate="meta">
              {[bag.roaster, bag.size_g ? `${bag.size_g} g` : null, bag.opened_at ? null : 'not opened yet'].filter(Boolean).join(' · ') || ' '}
            </Text>
          </View>
          {bag.roasted_at != null && daysSince(bag.roasted_at) >= 0 ? (
            <Text variant="labelCaps" color="muted">
              {`Day ${daysSince(bag.roasted_at)}`}
            </Text>
          ) : null}
        </View>
      ))}
      <Manage label="Manage my beans" count={`${bags.length} / ${OPEN_BAG_LIMIT}`} onPress={onManage} />
    </>
  );
}

function Gear({ gear, onAdd }) {
  if (!gear.length) return <EmptySlot icon="plus" iconToken={icon.sm} label="Add gear" onPress={onAdd} />;
  return gear.map((g, i) => {
    const used = g.category === 'brewer' || g.category === 'grinder';
    const line = used ? `${CATEGORY[g.category]} · ${g.cups ? `${g.cups} ${g.cups === 1 ? 'cup' : 'cups'}` : 'not used yet'}` : CATEGORY[g.category];
    return (
      <View key={g.id} style={[styles.row, i > 0 && styles.divided]}>
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
}

/** "Manage my beans   2 / 5  ›" — a whole row, so a chevron (§1 Tap affordance). */
function Manage({ label, count, onPress }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`${label}, ${count}`} style={({ pressed }) => [styles.manage, pressed && styles.pressed]}>
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
    paddingVertical: space[12],
  },
  divided: {
    borderTopWidth: shape.borderWidth.divider,
    borderTopColor: color.divider.hairline,
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
  manage: {
    minHeight: size.tapTarget,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: shape.borderWidth.divider,
    borderTopColor: color.divider.hairline,
  },
  manageEnd: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.gap.row,
  },
});
