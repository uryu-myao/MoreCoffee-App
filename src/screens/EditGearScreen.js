import { useEffect, useState } from 'react';
import { Alert, Keyboard, Pressable, StyleSheet, View } from 'react-native';
import { Field } from '../components/BagForm';
import DiscardSheet from '../components/DiscardSheet';
import ItemCups, { useFilteredCups } from '../components/ItemCups';
import SaveBar from '../components/SaveBar';
import BottomSheet from '../components/base/BottomSheet';
import Button from '../components/base/Button';
import DashedRule from '../components/base/DashedRule';
import Glyph from '../components/base/Glyph';
import IconButton from '../components/base/IconButton';
import SectionLabel from '../components/base/SectionLabel';
import Switch from '../components/base/Switch';
import Text from '../components/base/Text';
import { formatDay } from '../constants/dates';
import { GEAR_CATEGORY, onCups } from '../constants/gear';
import { gearFilter } from '../constants/search';
import { useDatabase } from '../data/DatabaseProvider';
import { removeGear, updateGear } from '../data/repository';
import { requestPush, requestShell } from '../navigation';
import { color, dashed, icon, layout, shape, space, spacing, state } from '../theme/tokens';
import ScreenFrame from './ScreenFrame';

/**
 * 3e — the gear page (Design Round 15, 19c; was "Edit gear", minimal,
 * 2026-10-22). The bag page's shape (EditBagScreen), from a 3b row or a
 * search result.
 *
 * Header: compact, ‹ and the gear's name as the title (user data, 2 lines).
 * The "Cups logged" count is gone from it: the cup list carries it.
 * Body, top to bottom:
 *   sub line   category · added date ("Grinder · added Apr 10"): 3e must say
 *              what the gear is (Design Round 12, 7)
 *   cups       a brewer or grinder only (19c; Round 15 B5: a cup can't hold
 *              a kettle or scale, so the list would always be empty):
 *              ItemCups, "Cups with this grinder · N", 5 rows, "All N cups ›";
 *              none: "No cups with this grinder yet." and "Log a cup with it
 *              ›" (Log a cup with this gear preselected)
 *   details    "Details", then the card (2px ink frame on raised): Name
 *              (required, BagForm's Field), Maker ("Optional"); for a brewer
 *              or grinder, under a dashed rule, "My default grinder" /
 *              "Preselected on every new cup." and the Switch (it turns off
 *              too: no default is a fair state; Uryu, 2026-10-22)
 *   end        "Remove from my gear" (3g's delete row; D-30 ink label) with
 *              "Frees 1 slot". It asks first in 11b's sheet (gaps.md 18;
 *              Design Round 12, 9). Back with 13b's notice. A removed
 *              default passes to nothing.
 * Not at this stage: the photo and 19c's "No photo yet. Tap to add one."
 * (no camera yet: the status block is left out); Category (cups hold gear
 * as brewer or grinder, so changing it would break their link; 19c draws
 * its chips); Added on as a field; My settings note (todo.md T-11).
 * Save (19b's behaviour): SaveBar, absent until the first edit; reverting
 * takes it away. "Save changes", then "Applies to the N cups already logged
 * with it." when there are any. Saving stays on the page.
 * Leaving with edits asks first (DiscardSheet).
 */
const countFormat = new Intl.NumberFormat('en-US');

export default function EditGearScreen({ gear, onBack, onRemoved, guardLeave }) {
  const db = useDatabase();
  // The gear as stored: the title and what counts as an edit.
  const [stored, setStored] = useState(gear);
  const [form, setForm] = useState({ name: gear.name, maker: gear.maker ?? '', isDefault: Boolean(gear.is_default) });
  const cupList = useFilteredCups(gearFilter(gear));
  const cups = cupList?.length ?? 0;
  const [nameMissing, setNameMissing] = useState(false);
  // 'discard' | 'remove' | null
  const [sheet, setSheet] = useState(null);
  const [busy, setBusy] = useState(false);
  const usable = onCups(gear.category);
  const kind = GEAR_CATEGORY[gear.category].toLowerCase();

  const name = form.name.trim();
  const maker = form.maker.trim() || null;
  const dirty = name !== stored.name || maker !== (stored.maker ?? null) || form.isDefault !== Boolean(stored.is_default);
  useEffect(() => {
    guardLeave?.(dirty && !busy, () => {
      Keyboard.dismiss();
      setSheet('discard');
    });
  }, [guardLeave, dirty, busy]);
  const leave = () => onBack({ force: true });

  const save = async () => {
    if (busy || !dirty) return;
    if (!name) {
      setNameMissing(true);
      return;
    }
    setBusy(true);
    try {
      await updateGear(db, gear.id, { name, maker, isDefault: form.isDefault });
      Keyboard.dismiss();
      setStored((g) => ({ ...g, name, maker, is_default: form.isDefault ? 1 : 0 }));
      setForm((f) => ({ ...f, name, maker: maker ?? '' }));
    } catch (error) {
      console.error('[3e] could not save', error);
      Alert.alert("Couldn't save your changes", String(error?.message ?? error));
    }
    setBusy(false);
  };

  const remove = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await removeGear(db, gear.id);
      setSheet(null);
      onRemoved(stored.name);
    } catch (error) {
      console.error('[3e] could not remove', error);
      Alert.alert("Couldn't remove this gear", String(error?.message ?? error));
      setBusy(false);
    }
  };

  const cupsWord = cups === 1 ? 'cup' : `${countFormat.format(cups)} cups`;
  return (
    <View style={styles.screen}>
      <View style={styles.page}>
        <ScreenFrame scroll compact userTitle title={stored.name} leading={<IconButton icon="chevronLeft" accessibilityLabel="Back" onPress={onBack} />}>
          <View style={styles.body}>
            <Text variant="bodySm" color="secondary">
              {`${GEAR_CATEGORY[gear.category]} · added ${formatDay(gear.added_at)}`}
            </Text>

            {usable && cupList ? (
              <ItemCups
                cups={cupList}
                heading={`Cups with this ${kind}`}
                emptyLine={`No cups with this ${kind} yet.`}
                logLabel="Log a cup with it"
                onLog={() => requestShell({ record: { [gear.category]: stored } })}
                onOpen={(id) => requestPush({ name: 'cup', id })}
                onAll={() => requestPush({ name: 'search', filter: gearFilter(stored) })}
              />
            ) : null}

            <View style={styles.details}>
              <SectionLabel variant="plain" label="Details" />
              <View style={styles.card}>
                <Field
                  label="Name"
                  value={form.name}
                  placeholder={GEAR_CATEGORY[gear.category]}
                  onChangeText={(next) => {
                    if (next.trim()) setNameMissing(false);
                    setForm((f) => ({ ...f, name: next }));
                  }}
                  error={nameMissing}
                />
                <Field label="Maker" value={form.maker} placeholder="Optional" onChangeText={(next) => setForm((f) => ({ ...f, maker: next }))} />
                {usable ? (
                  <>
                    <DashedRule token={dashed.dividerSoft} />
                    <View style={styles.defaultRow}>
                      <View style={styles.defaultText}>
                        <Text variant="label" color="primary">
                          {`My default ${kind}`}
                        </Text>
                        <Text variant="bodySm" color="secondary">
                          Preselected on every new cup.
                        </Text>
                      </View>
                      <Switch
                        value={form.isDefault}
                        onValueChange={(isDefault) => setForm((f) => ({ ...f, isDefault }))}
                        accessibilityLabel={`My default ${kind}`}
                      />
                    </View>
                  </>
                ) : null}
              </View>
            </View>

            <Pressable
              onPress={() => {
                Keyboard.dismiss();
                setSheet('remove');
              }}
              accessibilityRole="button"
              accessibilityHint="Frees 1 slot"
              style={({ pressed }) => [styles.remove, pressed && styles.pressed]}>
              {/* 3e: the bin (icon.accent; 3e draws 17, icon.md is 18) before the label. */}
              <View style={styles.removeLabel}>
                <Glyph name="trash" token={icon.md} color={color.icon.accent} />
                <Text variant="labelCaps" color="primary">
                  Remove from my gear
                </Text>
              </View>
              <Text variant="bodySm" color="muted">
                Frees 1 slot
              </Text>
            </Pressable>
          </View>
        </ScreenFrame>
      </View>

      <SaveBar visible={dirty}>
        <Button label="Save changes" onPress={save} />
        {cups > 0 ? (
          <Text variant="bodySmTabular" color="secondary" style={styles.centred}>
            {`Applies to the ${cupsWord} already logged with it.`}
          </Text>
        ) : null}
      </SaveBar>

      <DiscardSheet
        visible={sheet === 'discard'}
        onClose={() => setSheet(null)}
        body={`Your edits to this ${kind} won't be saved. It stays as it was.`}
        onDiscard={() => {
          setSheet(null);
          leave();
        }}
      />
      {/* gaps.md 18: 11b's sheet, as 3g's delete. */}
      <BottomSheet visible={sheet === 'remove'} onClose={() => setSheet(null)} swipeToClose>
        <Text variant="displaySm" color="primary">
          {`Remove this ${kind}?`}
        </Text>
        <Text variant="body" color="secondary">
          {cups > 0
            ? `It's removed from My gear for good. Your ${cups === 1 ? 'logged cup keeps' : `${countFormat.format(cups)} logged cups keep`} its name.`
            : "It's removed from My gear for good."}
        </Text>
        {stored.is_default ? (
          <Text variant="body" color="secondary">
            {`It's your default ${kind}. New cups start without one until you pick another.`}
          </Text>
        ) : null}
        <View style={styles.sheetActions}>
          <Button label="Remove from my gear" onPress={remove} />
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
  page: {
    flex: 1,
  },
  body: {
    gap: space[20],
    // Room under Remove, off the home indicator (as 2c, 3f).
    paddingBottom: layout.empty.block,
  },
  details: {
    gap: spacing.gap.row,
  },
  card: {
    borderWidth: shape.borderWidth.box,
    borderColor: color.border.strong,
    backgroundColor: color.surface.raised,
    paddingVertical: spacing.inset.container.v,
    paddingHorizontal: spacing.inset.container.h,
    gap: spacing.gap.section,
  },
  defaultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space[14],
  },
  defaultText: {
    flex: 1,
    minWidth: 0,
    gap: spacing.gap.tight,
  },
  // 3e: the remove row, the weak 1.5 frame (as 3g's delete).
  remove: {
    borderWidth: shape.borderWidth.divider,
    borderColor: color.border.muted,
    paddingVertical: spacing.inset.container.v,
    paddingHorizontal: spacing.inset.container.h,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.gap.row,
  },
  removeLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[8],
  },
  pressed: {
    backgroundColor: state.pressed.surface,
  },
  centred: {
    textAlign: 'center',
  },
  sheetActions: {
    marginTop: space[8],
    gap: spacing.gap.section,
  },
});
