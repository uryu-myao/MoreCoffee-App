import { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import Badge from '../components/base/Badge';
import Button from '../components/base/Button';
import DashedRule from '../components/base/DashedRule';
import EmptySlot from '../components/base/EmptySlot';
import IconButton from '../components/base/IconButton';
import Text from '../components/base/Text';
import { daysSince, formatDay } from '../constants/dates';
import { useDatabase } from '../data/DatabaseProvider';
import { OPEN_BAG_LIMIT, finishBag, listOpenBags, onShelfChanged } from '../data/repository';
import { color, dashed, icon, layout, shape, size, space, spacing } from '../theme/tokens';
import ScreenFrame from './ScreenFrame';

/**
 * 3d — My beans: the open bags, from Home's "Manage my beans".
 *
 * Header: compact, as 3c (Back + title; "N / 5 Bags open" in the stat).
 * Card per bag (3d): thumbnail, name, the roast level as a Badge when the bag
 * has one, "roaster · 250 g · opened Apr 6", "Day N" from the roast date (no
 * freshness meter at this stage, gaps.md 8); under a dashed rule
 * (dashed.dividerSoft, as the star card's caption) "Finish bag": §9
 * secondary, size row (44), full width (D-25, D-29).
 *
 * Finish bag: no confirmation, no undo at this stage (gaps.md 17: 3f's
 * Reopen is not built; for own use a slip costs one slot, and the cups stay).
 *
 * Not at this stage: tapping a card (→ 3g), "Finished bags" (→ 3f).
 * "Add a bag" (an add slot, with "N slots left") → 3c; hidden at 5 / 5.
 * The thumbnail is FieldRow's swatch (46); 3d draws 56, which has no token
 * (drift D-51).
 */
const ROAST = { light: 'Light', medium: 'Medium', 'medium-dark': 'Medium-dark', dark: 'Dark' };

export default function MyBeansScreen({ onBack, onAddBag }) {
  const db = useDatabase();
  const [bags, setBags] = useState(null);

  useEffect(() => {
    const load = () => listOpenBags(db).then(setBags, (error) => console.error('[3d] could not read bags', error));
    load();
    return onShelfChanged(load);
  }, [db]);

  const finish = async (bag) => {
    try {
      await finishBag(db, bag.id);
    } catch (error) {
      console.error('[3d] could not finish', error);
      Alert.alert("Couldn't finish this bag", String(error?.message ?? error));
    }
  };

  const left = bags ? OPEN_BAG_LIMIT - bags.length : 0;
  return (
    <ScreenFrame
      scroll
      compact
      title="My beans"
      leading={<IconButton icon="chevronLeft" accessibilityLabel="Back" onPress={onBack} />}
      stat={bags ? { value: `${bags.length} / ${OPEN_BAG_LIMIT}`, label: 'Bags open' } : undefined}>
      <View style={styles.body}>
        {(bags ?? []).map((bag) => {
          const day = bag.roasted_at != null ? daysSince(bag.roasted_at) : null;
          return (
            <View key={bag.id} style={styles.card}>
              <View style={styles.top}>
                <View style={styles.thumb} />
                <View style={styles.text}>
                  <View style={styles.nameRow}>
                    <Text variant="title" truncate="name" style={styles.name}>
                      {bag.name}
                    </Text>
                    {bag.roast_level ? <Badge label={ROAST[bag.roast_level]} tone="neutral" /> : null}
                  </View>
                  <Text variant="bodySm" color="muted" truncate="meta">
                    {[bag.roaster, bag.size_g ? `${bag.size_g} g` : null, bag.opened_at ? `opened ${formatDay(bag.opened_at)}` : null].filter(Boolean).join(' · ')}
                  </Text>
                  {day != null && day >= 0 ? (
                    <Text variant="labelCaps" color="muted">
                      {`Day ${day}`}
                    </Text>
                  ) : null}
                </View>
              </View>
              <DashedRule token={dashed.dividerSoft} />
              <Button variant="secondary" size="row" label="Finish bag" onPress={() => finish(bag)} />
            </View>
          );
        })}
        {bags && left > 0 ? <EmptySlot icon="plus" iconToken={icon.sm} label="Add a bag" tag={left === 1 ? '1 slot left' : `${left} slots left`} onPress={onAddBag} /> : null}
      </View>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: space[14],
    // Room under the last block so the bottom bar never covers it (as 2a).
    paddingBottom: layout.empty.block,
  },
  card: {
    borderWidth: shape.borderWidth.box,
    borderColor: color.border.strong,
    backgroundColor: color.surface.raised,
    paddingVertical: spacing.inset.container.v,
    paddingHorizontal: spacing.inset.container.h,
    gap: spacing.gap.section,
  },
  top: {
    flexDirection: 'row',
    gap: space[12],
  },
  thumb: {
    width: size.field.height,
    height: size.field.height,
    backgroundColor: color.surface.muted,
    borderWidth: shape.borderWidth.divider,
    borderColor: color.border.muted,
  },
  text: {
    flex: 1,
    minWidth: 0,
    gap: spacing.gap.tight,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.gap.row,
  },
  name: {
    flexShrink: 1,
  },
});
