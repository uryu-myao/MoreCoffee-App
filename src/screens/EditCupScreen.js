import { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import AxisReadout from '../components/base/AxisReadout';
import Badge from '../components/base/Badge';
import BottomSheet from '../components/base/BottomSheet';
import Button from '../components/base/Button';
import DashedRule from '../components/base/DashedRule';
import FieldRow from '../components/base/FieldRow';
import IconButton from '../components/base/IconButton';
import SectionLabel from '../components/base/SectionLabel';
import Text from '../components/base/Text';
import DateSheet from '../components/DateSheet';
import DiscardSheet from '../components/DiscardSheet';
import NoteField from '../components/NoteField';
import PickerSheet from '../components/PickerSheet';
import { dayLine, dayTimeLine } from '../components/WhenMeta';
import { cupTitle } from '../constants/cups';
import { formatDay, startOfDay } from '../constants/dates';
import { TASTE_AXES } from '../constants/tasteAxes';
import { useDatabase } from '../data/DatabaseProvider';
import { deleteCup, deleteDropsLockIn, getBag, listGear, listOpenBags, updateCup } from '../data/repository';
import { color, dashed, shape, space, spacing } from '../theme/tokens';
import { Stars } from './CupRecordScreen';
import { RATING_COPY } from './RecordCoffeeScreen';
import ScreenFrame from './ScreenFrame';

/**
 * 11a — Edit cup (Design 2026-10-12, approved 2026-10-13). Pushed over 2c by
 * its pencil.
 *
 * Editable, as FieldRows with a chevron: the bag and the method (From my
 * shelf), the date and time (When), My words (the optional bullet). The date
 * row states its own limit, so the date sheet never refuses silently.
 * "As logged": the rating, axes and flavours in 2c's read-only display (§1:
 * values shown, not disabled), under a plain heading and the line that gives
 * the way out. Taste DNA counted them at save; they never change here.
 * Footer: "Save changes" (primary), "Delete this cup" (text action, ink,
 * underlined, no warning colour), which opens 11b.
 *
 * The bag picker (11c): the date wins. A bag roasted after this cup's day is
 * shown, not hidden, in §1's disabled look, its meta saying why ("roasted
 * Apr 12, after this cup"). No "Add a bag": a new bag can't predate a past cup.
 *
 * Design Round 4 (2026-10-13, design-missing 19–26):
 *   - leaving with changes (Back or the edge swipe; PushedScreen's leave
 *     guard) opens "Discard your changes?" — the 11b shape; with none it
 *     leaves at once
 *   - the pickers' first rows: "No bag" ("This cup wasn't from a bag."),
 *     "No brewer", "No grinder" — so each can be cleared; no "Add gear"
 *     (editing corrects a record, it doesn't stock the shelf)
 *   - the date row's second line only with a roast date
 *   - this cup's own bag, if finished: listed first, selectable, its meta
 *     starting "Finished ‹day› ·"
 *   - Packaged / Barista: no shelf block (until design-missing 6)
 *   - Save is always pressable (§1); with nothing changed it writes nothing
 */
const bagMeta = (bag) => [bag.roaster, bag.roasted_at != null ? `roasted ${formatDay(bag.roasted_at)}` : null].filter(Boolean).join(' · ') || undefined;

/** The pickers' "No bag" / "No brewer" / "No grinder" row (Round 4, 20–21). */
const NONE_KEY = 'none';

/** The picker row for the cup's gear: by id, or by name for a cup that kept only the name (the dev seed's). */
const pickedGear = (gear, list) => gear.id ?? list.find((g) => g.name === gear.name)?.id ?? null;

/** 11c: a bag roasted after the cup's day cannot be chosen (the date wins). */
const roastedAfter = (bag, at) => bag.roasted_at != null && bag.roasted_at > startOfDay(new Date(at));

function Section({ label, variant, children }) {
  return (
    <View style={styles.section}>
      <SectionLabel label={label} variant={variant} />
      {children}
    </View>
  );
}

/** "As logged": 2c's read-only display of what Taste DNA counted. */
function AsLogged({ cup }) {
  return (
    <View style={[styles.section, styles.asLogged]}>
      <SectionLabel variant="plain" label="As logged" />
      <View style={[styles.card, styles.loggedCard]}>
        <Text variant="bodySm" color="muted">
          Your Taste DNA counted these when you saved. To change them, delete this cup and log it again.
        </Text>
        <DashedRule token={dashed.dividerSoft} />
        <View style={styles.ratingRow}>
          <Stars rating={cup.rating} size="sm" />
          <Text variant="meta" color="muted">
            {RATING_COPY[cup.rating]}
          </Text>
        </View>
        <DashedRule token={dashed.dividerSoft} />
        <View style={styles.axes}>
          {TASTE_AXES.map((axis) => {
            const value = cup[`axis_${axis.key}`];
            return (
              <View key={axis.key} style={styles.axis}>
                <View style={styles.poles}>
                  <Text variant="labelCaps" color="muted">
                    {axis.from}
                  </Text>
                  <Text variant="labelCaps" color="muted">
                    {axis.to}
                  </Text>
                </View>
                <AxisReadout
                  tone="entered"
                  value={value}
                  accessibilityLabel={`${axis.from} to ${axis.to}, ${value == null ? 'not noted' : axis.steps[Math.round(value / 25)]}`}
                />
              </View>
            );
          })}
        </View>
        {cup.flavours.length ? (
          <>
            <DashedRule token={dashed.dividerSoft} />
            <View style={styles.flavours}>
              {cup.flavours.map((w) => (
                <Badge key={w} label={w} tone="accent" placement="standalone" />
              ))}
            </View>
          </>
        ) : null}
      </View>
    </View>
  );
}

/**
 * 11b — the delete confirmation (§9 Bottom sheet, wrapping). Names the cup,
 * says what goes, that it can't be undone and that Taste DNA is recalculated;
 * a third line when the delete takes the profile out of Locked in.
 */
function DeleteSheet({ visible, onClose, cup, dropsLockIn, onDelete }) {
  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Text variant="displaySm" color="primary">
        Delete this cup?
      </Text>
      <Text variant="body" color="secondary">
        {`${cupTitle(cup).title} on ${dayLine(new Date(cup.logged_at))} goes, along with its rating, axes, flavours and My words. This can't be undone.`}
      </Text>
      <Text variant="body" color="secondary">
        Your Taste DNA is recalculated without it, so its values will change.
      </Text>
      {dropsLockIn ? (
        <Text variant="body" color="secondary">
          Your profile goes back to Early signs.
        </Text>
      ) : null}
      <View style={styles.sheetActions}>
        <Button label="Delete this cup" onPress={onDelete} />
        <Button variant="secondary" label="Keep it" onPress={onClose} />
      </View>
    </BottomSheet>
  );
}

export default function EditCupScreen({ cup, onBack, onDeleted, guardLeave }) {
  const db = useDatabase();
  const [bag, setBag] = useState(() =>
    cup.bag_id != null || cup.bean_name ? { id: cup.bag_id, name: cup.bean_name, roaster: cup.bean_roaster, roasted_at: cup.bean_roasted_at } : null
  );
  const [brewer, setBrewer] = useState(() => (cup.brew_method ? { id: cup.brewer_id, name: cup.brew_method } : null));
  const [grinder, setGrinder] = useState(() => (cup.grinder ? { id: cup.grinder_id, name: cup.grinder } : null));
  const [loggedAt, setLoggedAt] = useState(cup.logged_at);
  const [note, setNote] = useState(cup.note ?? '');
  // 'bag' | 'gear' | 'date' | 'delete' | 'discard' | null
  const [sheet, setSheet] = useState(null);
  const [shelf, setShelf] = useState({ bags: [], brewers: [], grinders: [] });
  const [dropsLockIn, setDropsLockIn] = useState(false);
  const [busy, setBusy] = useState(false);

  // The pickers' rows: the open bags (as 5a), with this cup's own bag first
  // when it has left the shelf; the gear by category.
  useEffect(() => {
    let alive = true;
    Promise.all([listOpenBags(db), listGear(db, 'brewer'), listGear(db, 'grinder'), cup.bag_id != null ? getBag(db, cup.bag_id) : null]).then(
      ([bags, brewers, grinders, own]) => {
        if (!alive) return;
        const all = own && !bags.some((b) => b.id === own.id) ? [own, ...bags] : bags;
        setShelf({ bags: all, brewers, grinders });
      },
      (error) => console.error('[edit] could not read the shelf', error)
    );
    return () => {
      alive = false;
    };
  }, [db, cup.bag_id]);

  const madeIt = cup.mode === 'made_it';
  const method = [brewer?.name, grinder?.name].filter(Boolean).join(' · ');
  const roastDay = madeIt && bag?.roasted_at != null ? bag.roasted_at : null;
  const noteValue = note.trim() ? note : null;
  const dirty =
    (bag?.id ?? null) !== cup.bag_id ||
    (bag?.name ?? null) !== cup.bean_name ||
    (brewer?.id ?? null) !== cup.brewer_id ||
    (brewer?.name ?? null) !== cup.brew_method ||
    (grinder?.id ?? null) !== cup.grinder_id ||
    (grinder?.name ?? null) !== cup.grinder ||
    loggedAt !== cup.logged_at ||
    noteValue !== (cup.note ?? null);

  // Back and the edge swipe ask first while there are changes (19).
  useEffect(() => {
    guardLeave?.(dirty && !busy, () => setSheet('discard'));
  }, [guardLeave, dirty, busy]);
  const leave = () => onBack({ force: true });

  const save = async () => {
    if (busy) return;
    // 25: nothing changed — back to 2c without writing.
    if (!dirty) {
      leave();
      return;
    }
    setBusy(true);
    try {
      await updateCup(db, cup.id, {
        bagId: madeIt ? (bag?.id ?? null) : cup.bag_id,
        brewerId: madeIt ? (brewer?.id ?? null) : cup.brewer_id,
        brewMethod: madeIt ? (brewer?.name ?? null) : cup.brew_method,
        grinderId: madeIt ? (grinder?.id ?? null) : cup.grinder_id,
        grinder: madeIt ? (grinder?.name ?? null) : cup.grinder,
        loggedAt,
        note: noteValue,
      });
      leave();
    } catch (error) {
      console.error('[edit] could not save', error);
      Alert.alert("Couldn't save your changes", String(error?.message ?? error));
      setBusy(false);
    }
  };

  const askDelete = async () => {
    try {
      setDropsLockIn(await deleteDropsLockIn(db, cup.id));
    } catch (error) {
      console.error('[edit] could not check lock-in', error);
    }
    setSheet('delete');
  };

  const remove = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await deleteCup(db, cup.id);
      setSheet(null);
      onDeleted();
    } catch (error) {
      console.error('[edit] could not delete', error);
      Alert.alert("Couldn't delete this cup", String(error?.message ?? error));
      setBusy(false);
    }
  };

  return (
    <View style={styles.screen}>
      <ScreenFrame
        scroll
        compact
        title="Edit cup"
        leading={<IconButton icon="chevronLeft" accessibilityLabel="Back" onPress={onBack} />}
        footer={
          <>
            <Button label="Save changes" onPress={save} />
            <Button variant="text" stacked label="Delete this cup" onPress={askDelete} />
          </>
        }>
        <View style={styles.sections}>
          {madeIt ? (
            <Section label="From my shelf">
              <View style={styles.card}>
                {bag ? (
                  <FieldRow swatch label="Bag" value={bag.name} meta={bagMeta(bag)} onPress={() => setSheet('bag')} />
                ) : (
                  <FieldRow swatch label="Bag" value="No bag noted" placeholder onPress={() => setSheet('bag')} />
                )}
                {method ? (
                  <FieldRow divided label="Method" value={method} onPress={() => setSheet('gear')} />
                ) : (
                  <FieldRow divided label="Method" value="No gear noted" placeholder onPress={() => setSheet('gear')} />
                )}
              </View>
            </Section>
          ) : null}

          <Section label="When">
            <View style={styles.card}>
              <FieldRow
                label="Date & time"
                value={dayTimeLine(new Date(loggedAt))}
                meta={roastDay != null ? `From ${formatDay(roastDay)}, the bag's roast date, to today` : undefined}
                onPress={() => setSheet('date')}
              />
            </View>
          </Section>

          <Section label="My words" variant="optional">
            <NoteField value={note} onChangeText={setNote} />
          </Section>

          <AsLogged cup={cup} />
        </View>
      </ScreenFrame>

      <PickerSheet
        visible={sheet === 'bag'}
        onClose={() => setSheet(null)}
        label="Bag"
        closeOnPick
        sections={[
          {
            items: [
              { key: NONE_KEY, label: 'No bag', meta: "This cup wasn't from a bag." },
              ...shelf.bags.map((b) => {
                const after = roastedAfter(b, loggedAt);
                const meta = after ? [b.roaster, `roasted ${formatDay(b.roasted_at)}, after this cup`].filter(Boolean).join(' · ') : bagMeta(b);
                return {
                  key: b.id,
                  label: b.name,
                  // 23: only this cup's own bag can be a finished one here.
                  meta: b.finished_at != null ? [`Finished ${formatDay(b.finished_at)}`, meta].filter(Boolean).join(' · ') : meta,
                  swatch: true,
                  disabled: after,
                  disabledHint: after ? 'Roasted after this cup' : undefined,
                };
              }),
            ],
            selected: bag ? bag.id : NONE_KEY,
            onPick: (id) => setBag(id === NONE_KEY ? null : shelf.bags.find((b) => b.id === id)),
          },
        ]}
      />
      <PickerSheet
        visible={sheet === 'gear'}
        onClose={() => setSheet(null)}
        label="Method"
        sections={[
          {
            label: 'Brewer',
            items: [
              { key: NONE_KEY, label: 'No brewer' },
              ...shelf.brewers.map((g) => ({ key: g.id, label: g.name, badge: g.is_default ? 'Default' : undefined })),
            ],
            selected: brewer ? pickedGear(brewer, shelf.brewers) : NONE_KEY,
            onPick: (id) => setBrewer(id === NONE_KEY ? null : shelf.brewers.find((g) => g.id === id)),
          },
          {
            label: 'Grinder',
            items: [
              { key: NONE_KEY, label: 'No grinder' },
              ...shelf.grinders.map((g) => ({ key: g.id, label: g.name, badge: g.is_default ? 'Default' : undefined })),
            ],
            selected: grinder ? pickedGear(grinder, shelf.grinders) : NONE_KEY,
            onPick: (id) => setGrinder(id === NONE_KEY ? null : shelf.grinders.find((g) => g.id === id)),
          },
        ]}
      />
      <DateSheet
        visible={sheet === 'date'}
        onClose={() => setSheet(null)}
        label="Date & time"
        mode="datetime"
        value={loggedAt}
        minimum={roastDay != null ? new Date(roastDay) : undefined}
        maximum={new Date()}
        onChange={setLoggedAt}
      />
      <DiscardSheet
        visible={sheet === 'discard'}
        onClose={() => setSheet(null)}
        body="Your edits to this cup won't be saved. The cup stays as it was."
        onDiscard={() => {
          setSheet(null);
          leave();
        }}
      />
      <DeleteSheet visible={sheet === 'delete'} onClose={() => setSheet(null)} cup={cup} dropsLockIn={dropsLockIn} onDelete={remove} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  sections: {
    gap: spacing.gap.section,
  },
  section: {
    gap: spacing.gap.row,
  },
  // 11a: "As logged" sits a step further from the fields above (margin-top 8).
  asLogged: {
    marginTop: space[8],
  },
  card: {
    borderWidth: shape.borderWidth.box,
    borderColor: color.border.strong,
    backgroundColor: color.surface.raised,
  },
  loggedCard: {
    paddingVertical: spacing.inset.container.v,
    paddingHorizontal: spacing.inset.container.h,
    gap: spacing.gap.section,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
  },
  axes: {
    gap: spacing.gap.axis,
  },
  axis: {
    gap: spacing.gap.row,
  },
  poles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flavours: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.gap.row,
  },
  // 11b: the buttons sit a step under the copy (margin-top 8 over the sheet's gap).
  sheetActions: {
    marginTop: space[8],
    gap: spacing.gap.section,
  },
});
