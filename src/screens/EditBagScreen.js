import { useEffect, useState } from 'react';
import { Alert, Keyboard, Pressable, StyleSheet, View } from 'react-native';
import BagForm from '../components/BagForm';
import BeanFreshness from '../components/BeanFreshness';
import DateSheet from '../components/DateSheet';
import DiscardSheet from '../components/DiscardSheet';
import BottomSheet from '../components/base/BottomSheet';
import Button from '../components/base/Button';
import DashedRule from '../components/base/DashedRule';
import IconButton from '../components/base/IconButton';
import Text from '../components/base/Text';
import { formatDay, startOfDay } from '../constants/dates';
import { useDatabase } from '../data/DatabaseProvider';
import { bagUse, deleteBag, updateBag } from '../data/repository';
import { color, dashed, shape, space, spacing, state } from '../theme/tokens';
import ScreenFrame from './ScreenFrame';

/**
 * 3g — Edit bag (minimal, 2026-10-14), from a 3d card's upper half. Open and
 * not-yet-opened bags; finished bags aren't edited.
 *
 * Header: compact, "N / Cups logged" in the stat (3g).
 * Fields (minimal): Bean name (required, as 3c), Roaster, Roasted on, and
 * Opened on for a bag that is open (an unopened bag is opened from 3d).
 * Photo, origin, region, roast level, process and size are not at this
 * stage (no inputs for them yet).
 * Date limits (design-missing.md 33 / 34, Design Round 6):
 *   Roasted on  up to the first cup from the bag (or its opening, or today,
 *               whichever is first); the line under it names the limit when
 *               there is a cup — "Up to Apr 6, your first cup from it."
 *   Opened on   from the roast date to the first cup (no cups: today) —
 *               "From Mar 30, the roast date, to Apr 6, your first cup from
 *               it." / "Up to Apr 6, …" with no roast date / no line with
 *               neither.
 * Under a dashed rule: beanFreshness from the date being edited, and
 * "Freshness on My beans counts from this date." (42), empty date or not.
 * Under the card: "Delete this bag" (1.5 border.muted frame, as 3g) with
 * "For a bag added by mistake" (Round 6). No Finish here: Finish is 3d's.
 * Footer: Save changes, and "Edits apply to the N cups already logged from
 * this bag." when there are any (35).
 * Leaving with changes asks first (Round 4's sheet; the bag's own body).
 * Delete: 11b's sheet with "bag" (Round 6, 36); back to 3d with 13b's
 * notice.
 */
export default function EditBagScreen({ bag, onBack, onDeleted, guardLeave }) {
  const db = useDatabase();
  const [form, setForm] = useState({ name: bag.name, roaster: bag.roaster ?? '', roastedAt: bag.roasted_at });
  const [openedAt, setOpenedAt] = useState(bag.opened_at);
  const [use, setUse] = useState({ cups: 0, firstCupAt: null });
  const [nameMissing, setNameMissing] = useState(false);
  // 'roasted' | 'opened' | 'discard' | 'delete' | null
  const [sheet, setSheet] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    bagUse(db, bag.id).then(
      (u) => alive && setUse(u),
      (error) => console.error('[3g] could not read the cups', error)
    );
    return () => {
      alive = false;
    };
  }, [db, bag.id]);

  const name = form.name.trim();
  const roaster = form.roaster.trim() || null;
  const dirty = name !== bag.name || roaster !== (bag.roaster ?? null) || form.roastedAt !== bag.roasted_at || openedAt !== bag.opened_at;
  useEffect(() => {
    guardLeave?.(dirty && !busy, () => {
      Keyboard.dismiss();
      setSheet('discard');
    });
  }, [guardLeave, dirty, busy]);
  const leave = () => onBack({ force: true });

  // Limits. The first cup's day and today are whole days (the sheets pick days).
  const today = startOfDay(new Date());
  const firstCupDay = use.firstCupAt != null ? startOfDay(new Date(use.firstCupAt)) : null;
  const cupLimit = firstCupDay ?? today;
  const openedDay = openedAt != null ? startOfDay(new Date(openedAt)) : null;
  const roastMax = Math.min(cupLimit, openedDay ?? cupLimit);
  const firstCupLine = firstCupDay != null ? `${formatDay(firstCupDay)}, your first cup from it` : null;
  let roastedHint;
  if (openedDay != null && openedDay < cupLimit) roastedHint = `Up to ${formatDay(openedDay)}, the day it was opened.`;
  else if (firstCupLine) roastedHint = `Up to ${firstCupLine}.`;
  let openedHint;
  if (form.roastedAt != null) openedHint = `From ${formatDay(form.roastedAt)}, the roast date, to ${firstCupLine ?? 'today'}.`;
  else if (firstCupLine) openedHint = `Up to ${firstCupLine}.`;

  const save = async () => {
    if (busy) return;
    if (!name) {
      setNameMissing(true);
      return;
    }
    if (!dirty) {
      leave();
      return;
    }
    setBusy(true);
    try {
      await updateBag(db, bag.id, { name, roaster, roastedAt: form.roastedAt, openedAt });
      leave();
    } catch (error) {
      console.error('[3g] could not save', error);
      Alert.alert("Couldn't save your changes", String(error?.message ?? error));
      setBusy(false);
    }
  };

  const remove = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await deleteBag(db, bag.id);
      setSheet(null);
      onDeleted(bag.name);
    } catch (error) {
      console.error('[3g] could not delete', error);
      Alert.alert("Couldn't delete this bag", String(error?.message ?? error));
      setBusy(false);
    }
  };

  const cupsWord = `${use.cups} ${use.cups === 1 ? 'cup' : 'cups'}`;
  return (
    <View style={styles.screen}>
      <ScreenFrame
        scroll
        compact
        title="Edit bag"
        leading={<IconButton icon="chevronLeft" accessibilityLabel="Back" onPress={onBack} />}
        stat={{ value: String(use.cups), label: 'Cups logged' }}
        footer={
          <View style={styles.footer}>
            <Button label="Save changes" onPress={save} />
            {use.cups > 0 ? (
              <Text variant="bodySm" color="secondary" style={styles.centred}>
                {`Edits apply to the ${use.cups === 1 ? 'cup' : `${use.cups} cups`} already logged from this bag.`}
              </Text>
            ) : null}
          </View>
        }>
        <View style={styles.body}>
          <BagForm
            value={form}
            onChange={(next) => {
              if (next.name.trim()) setNameMissing(false);
              setForm(next);
            }}
            nameMissing={nameMissing}
            autoFocusName={false}
            roastedPlaceholder="Optional"
            roastedHint={roastedHint}
            onPickDate={() => {
              Keyboard.dismiss();
              setSheet('roasted');
            }}
            datePicking={sheet === 'roasted'}
            opened={
              bag.opened_at != null
                ? {
                    value: openedAt,
                    hint: openedHint,
                    picking: sheet === 'opened',
                    onPick: () => {
                      Keyboard.dismiss();
                      setSheet('opened');
                    },
                  }
                : undefined
            }>
            <View style={styles.freshness}>
              <DashedRule token={dashed.dividerSoft} />
              <BeanFreshness roastedAt={form.roastedAt} />
              <Text variant="meta" color="muted">
                Freshness on My beans counts from this date.
              </Text>
            </View>
          </BagForm>

          <Pressable
            onPress={() => {
              Keyboard.dismiss();
              setSheet('delete');
            }}
            accessibilityRole="button"
            accessibilityHint="For a bag added by mistake"
            style={({ pressed }) => [styles.delete, pressed && styles.pressed]}>
            <Text variant="labelCaps" color="primary">
              Delete this bag
            </Text>
            <Text variant="bodySm" color="muted">
              For a bag added by mistake
            </Text>
          </Pressable>
        </View>
      </ScreenFrame>

      <DateSheet
        visible={sheet === 'roasted'}
        onClose={() => setSheet(null)}
        label="Roasted on"
        value={form.roastedAt}
        maximum={new Date(roastMax)}
        onChange={(roastedAt) => setForm((f) => ({ ...f, roastedAt }))}
      />
      <DateSheet
        visible={sheet === 'opened'}
        onClose={() => setSheet(null)}
        label="Opened on"
        value={openedDay}
        minimum={form.roastedAt != null ? new Date(form.roastedAt) : undefined}
        maximum={new Date(cupLimit)}
        // The same day keeps the stored moment (3c stores when it was opened).
        onChange={(day) => setOpenedAt(bag.opened_at != null && day === startOfDay(new Date(bag.opened_at)) ? bag.opened_at : day)}
      />
      <DiscardSheet
        visible={sheet === 'discard'}
        onClose={() => setSheet(null)}
        body="Your edits to this bag won't be saved. The bag stays as it was."
        onDiscard={() => {
          setSheet(null);
          leave();
        }}
      />
      {/* 36: 11b's sheet with "bag". */}
      <BottomSheet visible={sheet === 'delete'} onClose={() => setSheet(null)}>
        <Text variant="displaySm" color="primary">
          Delete this bag?
        </Text>
        <Text variant="body" color="secondary">
          {use.cups > 0
            ? `It's removed from My beans for good. Your ${cupsWord === '1 cup' ? 'logged cup keeps' : `${use.cups} logged cups keep`} its details.`
            : "It's removed from My beans for good."}
        </Text>
        {bag.opened_at != null ? (
          <Text variant="body" color="secondary">
            Drank it? Finish it instead. A finished bag can be reopened.
          </Text>
        ) : null}
        <View style={styles.sheetActions}>
          <Button label="Delete this bag" onPress={remove} />
          <Button variant="secondary" label="Keep it" onPress={() => setSheet(null)} />
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  body: {
    gap: space[20],
  },
  freshness: {
    gap: spacing.gap.row,
  },
  // 3g: the delete row, the weak 1.5 frame (it's not the screen's main act).
  delete: {
    borderWidth: shape.borderWidth.divider,
    borderColor: color.border.muted,
    paddingVertical: spacing.inset.container.v,
    paddingHorizontal: spacing.inset.container.h,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.gap.row,
  },
  pressed: {
    backgroundColor: state.pressed.surface,
  },
  footer: {
    gap: spacing.gap.row,
  },
  centred: {
    textAlign: 'center',
  },
  sheetActions: {
    marginTop: space[8],
    gap: spacing.gap.section,
  },
});
