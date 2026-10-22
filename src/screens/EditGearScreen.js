import { useEffect, useState } from 'react';
import { Alert, Keyboard, Pressable, StyleSheet, View } from 'react-native';
import { Field } from '../components/BagForm';
import DiscardSheet from '../components/DiscardSheet';
import BottomSheet from '../components/base/BottomSheet';
import Button from '../components/base/Button';
import DashedRule from '../components/base/DashedRule';
import Glyph from '../components/base/Glyph';
import IconButton from '../components/base/IconButton';
import Switch from '../components/base/Switch';
import Text from '../components/base/Text';
import { GEAR_CATEGORY, onCups } from '../constants/gear';
import { useDatabase } from '../data/DatabaseProvider';
import { gearUse, removeGear, updateGear } from '../data/repository';
import { color, dashed, icon, shape, space, spacing, state } from '../theme/tokens';
import ScreenFrame from './ScreenFrame';

/**
 * 3e — Edit gear (minimal, 2026-10-22), from a 3b row. Built as 3g.
 *
 * Header: compact, Back (as 3g; 3e draws ×), "N / Cups logged" in the stat.
 * Card (2px ink frame on raised, D-6's gap.section): Name (required, BagForm's
 * Field and its "· required" error), Maker ("Optional"); then, for a brewer
 * or grinder, under a dashed rule (it splits one block, §8) "My default
 * grinder" / "Preselected on every new cup." and the Switch. The switch
 * turns off too: no default is a fair state (Uryu, 2026-10-22).
 * Not at this stage:
 *   - the photo (no camera yet, as 3g);
 *   - Category: cups hold gear as brewer or grinder, so changing it would
 *     break their link; 3a adds only those two;
 *   - Added on;
 *   - My settings note: its line promises to prefill the grind field, which
 *     V1 has no input for (todo.md T-11).
 * Under the card: "Remove from my gear" (3g's delete row; D-30 ink label) with
 * "Frees 1 slot". It asks first in 11b's sheet (gaps.md 18); TODO(design):
 * the sheet's copy and the notice's "removed" are ours. Back to 3b with 13b's
 * notice. A removed default passes to nothing.
 * Footer: Save changes, and "Edits apply to the N cups already logged with
 * it." when there are any: a rename rewrites their copies (updateGear).
 * Leaving with changes asks first (DiscardSheet).
 */
export default function EditGearScreen({ gear, onBack, onRemoved, guardLeave }) {
  const db = useDatabase();
  const [form, setForm] = useState({ name: gear.name, maker: gear.maker ?? '', isDefault: Boolean(gear.is_default) });
  const [cups, setCups] = useState(0);
  const [nameMissing, setNameMissing] = useState(false);
  // 'discard' | 'remove' | null
  const [sheet, setSheet] = useState(null);
  const [busy, setBusy] = useState(false);
  const usable = onCups(gear.category);
  const kind = GEAR_CATEGORY[gear.category].toLowerCase();

  useEffect(() => {
    let alive = true;
    gearUse(db, gear.id).then(
      (n) => alive && setCups(n),
      (error) => console.error('[3e] could not read the cups', error)
    );
    return () => {
      alive = false;
    };
  }, [db, gear.id]);

  const name = form.name.trim();
  const maker = form.maker.trim() || null;
  const dirty = name !== gear.name || maker !== (gear.maker ?? null) || form.isDefault !== Boolean(gear.is_default);
  useEffect(() => {
    guardLeave?.(dirty && !busy, () => {
      Keyboard.dismiss();
      setSheet('discard');
    });
  }, [guardLeave, dirty, busy]);
  const leave = () => onBack({ force: true });

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
      await updateGear(db, gear.id, { name, maker, isDefault: form.isDefault });
      leave();
    } catch (error) {
      console.error('[3e] could not save', error);
      Alert.alert("Couldn't save your changes", String(error?.message ?? error));
      setBusy(false);
    }
  };

  const remove = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await removeGear(db, gear.id);
      setSheet(null);
      onRemoved(gear.name);
    } catch (error) {
      console.error('[3e] could not remove', error);
      Alert.alert("Couldn't remove this gear", String(error?.message ?? error));
      setBusy(false);
    }
  };

  const cupsWord = cups === 1 ? 'cup' : `${cups} cups`;
  return (
    <View style={styles.screen}>
      <ScreenFrame
        scroll
        compact
        title="Edit gear"
        leading={<IconButton icon="chevronLeft" accessibilityLabel="Back" onPress={onBack} />}
        stat={usable ? { value: String(cups), label: 'Cups logged' } : undefined}
        footer={
          <View style={styles.footer}>
            <Button label="Save changes" onPress={save} />
            {cups > 0 ? (
              <Text variant="bodySm" color="secondary" style={styles.centred}>
                {`Edits apply to the ${cupsWord} already logged with it.`}
              </Text>
            ) : null}
          </View>
        }>
        <View style={styles.body}>
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
            ? `It's removed from My gear for good. Your ${cups === 1 ? 'logged cup keeps' : `${cups} logged cups keep`} its name.`
            : "It's removed from My gear for good."}
        </Text>
        {gear.is_default ? (
          <Text variant="body" color="secondary">
            {`It's your default ${kind}, so new cups start without one until you choose another.`}
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
  body: {
    gap: space[20],
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
