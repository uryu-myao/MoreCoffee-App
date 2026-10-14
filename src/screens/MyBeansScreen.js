import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import Badge from '../components/base/Badge';
import Button from '../components/base/Button';
import DashedRule from '../components/base/DashedRule';
import EmptySlot from '../components/base/EmptySlot';
import Glyph from '../components/base/Glyph';
import IconButton from '../components/base/IconButton';
import PhotoPlaceholder from '../components/base/PhotoPlaceholder';
import Text from '../components/base/Text';
import BeanFreshness from '../components/BeanFreshness';
import { formatDay } from '../constants/dates';
import { useDatabase } from '../data/DatabaseProvider';
import { OPEN_BAG_LIMIT, countFinishedBags, finishBag, listShelfBags, onShelfChanged, openBag } from '../data/repository';
import { color, dashed, icon, layout, shape, size, space, spacing, state } from '../theme/tokens';
import ScreenFrame from './ScreenFrame';

/**
 * 3d — My beans: the open bags, from Home's "Manage my beans".
 *
 * Header: compact, as 3c (Back + title; "N / 5 Bags open" in the stat).
 * Card per bag (3d): thumbnail, name, the roast level as a Badge when the bag
 * has one, "roaster · 250 g · opened Apr 6", then beanFreshness ("Day 7 ·
 * drink now" and its bar, from the roast date; nothing without one; gaps.md
 * 8, decided 2026-10-14); under a dashed rule
 * (dashed.dividerSoft, as the star card's caption) "Finish bag": §9
 * secondary, size row (44), full width (D-25, D-29).
 *
 * A bag added without opening (3c, 2026-10-12) reads "not opened yet" and
 * has "Open this bag" in Finish bag's place; it takes a slot like the rest.
 *
 * Finish bag: no confirmation, no undo at this stage (gaps.md 17: 3f's
 * Reopen is not built; for own use a slip costs one slot, and the cups stay).
 *
 * "Finished bags" (3d's foot, 2026-10-14) → 3f: a 1.5 border.soft rule, the
 * name in display.xs, "N archived — still counted in my taste DNA" and a
 * chevron. Shown once a bag is finished (no entry to an empty 3f).
 * Not at this stage: tapping a card (→ 3g).
 * "Add a bag" (an add slot, with "N slots left") → 3c; hidden at 5 / 5.
 * The thumbnail is FieldRow's swatch (46); 3d draws 56, which has no token
 * (drift D-51).
 */
const ROAST = { light: 'Light', medium: 'Medium', 'medium-dark': 'Medium-dark', dark: 'Dark' };

export default function MyBeansScreen({ onBack, onAddBag, onFinished }) {
  const db = useDatabase();
  const [bags, setBags] = useState(null);
  const [finished, setFinished] = useState(0);

  useEffect(() => {
    const load = () =>
      Promise.all([listShelfBags(db), countFinishedBags(db)]).then(
        ([shelf, done]) => {
          setBags(shelf);
          setFinished(done);
        },
        (error) => console.error('[3d] could not read bags', error)
      );
    load();
    return onShelfChanged(load);
  }, [db]);

  const open = async (bag) => {
    try {
      await openBag(db, bag.id);
    } catch (error) {
      console.error('[3d] could not open', error);
      Alert.alert("Couldn't open this bag", String(error?.message ?? error));
    }
  };

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
          return (
            <View key={bag.id} style={styles.card}>
              <View style={styles.top}>
                <PhotoPlaceholder size={size.field.height} />
                <View style={styles.text}>
                  <View style={styles.nameRow}>
                    <Text variant="title" truncate="name" style={styles.name}>
                      {bag.name}
                    </Text>
                    {bag.roast_level ? <Badge label={ROAST[bag.roast_level]} tone="neutral" /> : null}
                  </View>
                  <Text variant="bodySm" color="muted" truncate="meta">
                    {[bag.roaster, bag.size_g ? `${bag.size_g} g` : null, bag.opened_at ? `opened ${formatDay(bag.opened_at)}` : 'not opened yet'].filter(Boolean).join(' · ')}
                  </Text>
                </View>
              </View>
              <BeanFreshness roastedAt={bag.roasted_at} />
              <DashedRule token={dashed.dividerSoft} />
              {/* Not opened yet: "Open this bag" in Finish bag's place (2026-10-12). */}
              {bag.opened_at ? (
                <Button variant="secondary" size="row" label="Finish bag" onPress={() => finish(bag)} />
              ) : (
                <Button variant="secondary" size="row" label="Open this bag" onPress={() => open(bag)} />
              )}
            </View>
          );
        })}
        {bags && left > 0 ? <EmptySlot icon="plus" iconToken={icon.sm} label="Add a bag" tag={left === 1 ? '1 slot left' : `${left} slots left`} onPress={onAddBag} /> : null}
        {finished > 0 ? (
          <Pressable
            onPress={onFinished}
            accessibilityRole="button"
            accessibilityLabel={`Finished bags, ${finished} archived`}
            style={({ pressed }) => [styles.finished, pressed && styles.pressed]}>
            <View style={styles.finishedText}>
              <Text variant="displayXs">Finished bags</Text>
              <Text variant="bodySm" color="secondary">
                {`${finished} archived — still counted in my taste DNA`}
              </Text>
            </View>
            <Glyph name="chevronRight" token={icon.md} color={color.icon.default} />
          </Pressable>
        ) : null}
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
  // 3d's foot: the entry to 3f, under a 1.5 rule.
  finished: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space[12],
    marginTop: spacing.gap.section,
    paddingTop: space[16],
    borderTopWidth: shape.borderWidth.divider,
    borderTopColor: color.border.soft,
  },
  finishedText: {
    flex: 1,
    gap: spacing.gap.tight,
  },
  pressed: {
    backgroundColor: state.pressed.surface,
  },
});
