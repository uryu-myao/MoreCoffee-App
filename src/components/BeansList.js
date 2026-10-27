import { Alert, Pressable, StyleSheet, View } from 'react-native';
import Button from './base/Button';
import DashedRule from './base/DashedRule';
import AddButton from './base/AddButton';
import Chevron from './base/Chevron';
import PhotoPlaceholder from './base/PhotoPlaceholder';
import Text from './base/Text';
import BeanFreshness from './BeanFreshness';
import { formatDay } from '../constants/dates';
import { useDatabase } from '../data/DatabaseProvider';
import { OPEN_BAG_LIMIT, finishBag, openBag } from '../data/repository';
import { color, dashed, icon, layout, shape, size, space, spacing, state } from '../theme/tokens';

/**
 * 3d's body — the beans side of Gear & beans (Round 14, 17d; 3d's own header
 * went with the merge: its "N / 5 On the shelf" is the tab row's slot count,
 * counting the bags you have, opened or not; Design Round 7, 18).
 *
 * Card per bag (3d): thumbnail, name, "roaster · 250 g · opened Apr 6" (the
 * roast level's badge is gone: Round 14, no roast data), then beanFreshness ("Day 7 ·
 * drink now" and its bar, from the roast date; nothing without one; gaps.md
 * 8, decided 2026-10-14); under a dashed rule
 * (dashed.dividerSoft, as the star card's caption) "Finish bag": §9
 * secondary, size row (44), full width (D-25, D-29).
 *
 * A bag added without opening (3c, 2026-10-12) reads "not opened yet" and
 * takes a slot like the rest. Told apart from an open bag (2026-10-17, the
 * mock): the card's frame is dashed (dashed.sealed), the freshness line reads
 * "Sealed · clock starts when opened", and "Open this bag" in Finish bag's
 * place is the primary row button, raised — the one thing to do with it.
 *
 * Finish bag: no confirmation, no undo at this stage (gaps.md 17: 3f's
 * Reopen is not built; for own use a slip costs one slot, and the cups stay).
 *
 * "Finished bags" (3d's foot, 2026-10-14) → 3f: a 1.5 border.soft rule, the
 * name in display.xs, "N archived — still counted in my taste DNA" and a
 * chevron. Shown once a bag is finished (no entry to an empty 3f).
 * A card's upper half (D-29) opens 3g, with the row chevron at its right;
 * the lower strip is Finish bag only.
 * Pressed (state.pressed.row, 2026-10-18): the card's upper half fills out
 * to the card's frame (sides and top) and halfway to the dashed rule; the
 * "Finished bags" row fills the screen's width, its rule keeping the
 * content width.
 * "Add a bag" (an AddButton, with "N slots left") → 3c; hidden at 5 / 5.
 * The thumbnail is FieldRow's swatch (46); 3d draws 56, which has no token
 * (drift D-51).
 *
 * Props: bags (listShelfBags), finished (countFinishedBags), onAddBag,
 * onFinished, onEditBag(bag)
 */
export default function BeansList({ bags, finished, onAddBag, onFinished, onEditBag }) {
  const db = useDatabase();

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

  const left = OPEN_BAG_LIMIT - bags.length;
  return (
    <View style={styles.body}>
      {bags.map((bag) => {
        return (
          <View key={bag.id} style={[styles.card, !bag.opened_at && styles.cardSealed]}>
            {/* D-29: the upper half opens 3g. */}
            <Pressable
              onPress={() => onEditBag(bag)}
              accessibilityRole="button"
              accessibilityLabel={`Edit ${bag.name}`}
              style={({ pressed }) => [styles.info, pressed && styles.rowPressed]}>
              <View style={styles.infoText}>
                <View style={styles.top}>
                  <PhotoPlaceholder size={size.field.height} />
                  <View style={styles.text}>
                    <View style={styles.nameRow}>
                      <Text variant="title" truncate="name" style={styles.name}>
                        {bag.name}
                      </Text>
                    </View>
                    <Text variant="bodySm" color="muted" truncate="meta">
                      {[bag.roaster, bag.size_g ? `${bag.size_g} g` : null, bag.opened_at ? `opened ${formatDay(bag.opened_at)}` : 'not opened yet'].filter(Boolean).join(' · ')}
                    </Text>
                  </View>
                </View>
                <BeanFreshness roastedAt={bag.roasted_at} sealed={!bag.opened_at} />
              </View>
              <Chevron />
            </Pressable>
            <DashedRule token={dashed.dividerSoft} />
            {/* Not opened yet: "Open this bag" in Finish bag's place (2026-10-12),
                primary and raised (2026-10-17). */}
            {bag.opened_at ? (
              <Button variant="secondary" size="row" label="Finish bag" onPress={() => finish(bag)} />
            ) : (
              <Button size="row" raised label="Open this bag" onPress={() => open(bag)} />
            )}
          </View>
        );
      })}
      {/* Once, under the last card (Design Round 7, 40): the freshness
          windows are a guide. Only when some card draws one: an opened bag
          with a roast date (a sealed card has no bar). */}
      {bags.some((b) => b.opened_at && b.roasted_at != null) ? (
        <Text variant="bodySm" color="secondary">
          The windows are a rough guide. Your own taste is the better judge.
        </Text>
      ) : null}
      {left > 0 ? <AddButton icon="plus" iconToken={icon.sm} label="Add a bag" tag={left === 1 ? '1 slot left' : `${left} slots left`} onPress={onAddBag} /> : null}
      {finished > 0 ? (
        <Pressable
          onPress={onFinished}
          accessibilityRole="button"
          accessibilityLabel={`Finished bags, ${finished} archived`}
          style={({ pressed }) => [styles.finishedTouch, pressed && styles.rowPressed]}>
          <View style={styles.finished}>
            <View style={styles.finishedText}>
              <Text variant="displayXs">Finished bags</Text>
              <Text variant="bodySm" color="secondary">
                {`${finished} archived — still counted in my taste DNA`}
              </Text>
            </View>
            <Chevron />
          </View>
        </Pressable>
      ) : null}
    </View>
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
  cardSealed: {
    borderStyle: dashed.sealed.style,
    borderColor: dashed.sealed.color,
  },
  // Out through the card's padding to its frame (sides, top) and halfway to
  // the rule (gap.section / 2), padded back in: the content stays put.
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
    marginHorizontal: -spacing.inset.container.h,
    paddingHorizontal: spacing.inset.container.h,
    marginTop: -spacing.inset.container.v,
    paddingTop: spacing.inset.container.v,
    marginBottom: -space[6],
    paddingBottom: space[6],
  },
  infoText: {
    flex: 1,
    minWidth: 0,
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
  // 3d's foot: the entry to 3f, under a 1.5 rule. The touch area spans the
  // screen (out through the gutter, padded back in); the rule keeps the
  // content width.
  finishedTouch: {
    marginTop: spacing.gap.section,
    marginHorizontal: -layout.gutter,
    paddingHorizontal: layout.gutter,
  },
  finished: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space[12],
    paddingVertical: space[16],
    borderTopWidth: shape.borderWidth.divider,
    borderTopColor: color.border.soft,
  },
  finishedText: {
    flex: 1,
    gap: spacing.gap.tight,
  },
  rowPressed: {
    backgroundColor: state.pressed.row,
  },
});
