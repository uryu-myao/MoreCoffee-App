import { useEffect, useState } from 'react';
import { Alert, Keyboard, Pressable, StyleSheet, View } from 'react-native';
import BagForm from '../components/BagForm';
import BeanFreshness from '../components/BeanFreshness';
import DateSheet from '../components/DateSheet';
import DiscardSheet from '../components/DiscardSheet';
import ItemCups, { useFilteredCups } from '../components/ItemCups';
import SaveBar from '../components/SaveBar';
import BottomSheet from '../components/base/BottomSheet';
import Button from '../components/base/Button';
import Glyph from '../components/base/Glyph';
import IconButton from '../components/base/IconButton';
import PhotoPlaceholder from '../components/base/PhotoPlaceholder';
import SectionLabel from '../components/base/SectionLabel';
import Text from '../components/base/Text';
import { formatDay, startOfDay } from '../constants/dates';
import { bagFilter } from '../constants/search';
import { useDatabase } from '../data/DatabaseProvider';
import { deleteBag, finishBag, updateBag } from '../data/repository';
import { requestPush, requestShell } from '../navigation';
import { color, icon, layout, shape, size, space, spacing, state } from '../theme/tokens';
import ScreenFrame from './ScreenFrame';

/**
 * 3g — the bag page (Design Round 15, 19a / 19b; was "Edit bag", minimal,
 * 2026-10-14). A page arrived at to look, from a 3d card, a search result
 * (finished bags too) or a cup's bag; its details can be corrected in place.
 *
 * Header: compact, ‹ (a page you go back from, not a form you dismiss) and
 * the bag's name as the title (user data, 2 lines, as 2c). The "Cups logged"
 * count is gone from it: the cup list carries it.
 * Body, top to bottom (19a: status, cups, details, end actions):
 *   facts      under the title, each after its label (labelEyebrow muted,
 *              then the value in body): "ROASTER Blue Bottle  SIZE 250 g"
 *              (Uryu, 2026-10-28; 19a draws a bare "Blue Bottle · 250 g")
 *   status     the photo (a placeholder: no camera yet), then beanFreshness
 *              stacked (19a: the day and state over the bar) from the roast
 *              date being edited, and "Roasted Mar 30 ·
 *              opened Apr 6". Sealed: 3d's sealed line. Finished: "Finished
 *              Mar 2".
 *   cups       ItemCups: "Cups from this bag · N", 5 rows, "All N cups ›"
 *              (search with the bag as a block); none: "No cups from this
 *              bag yet." and, for an open bag, "Log a cup from it ›" (Log a
 *              cup with the bag preselected)
 *   details    "Details", then BagForm (minimal: Bean name, Roaster, Roasted
 *              on, Opened on for an opened bag). Photo, origin, region,
 *              process and size have no inputs yet.
 *   end        "Finish bag" (secondary, a normal step of a bag's life) for an
 *              open bag, then "Delete this bag" (the weak 1.5 frame) with
 *              "Not finish — erases it" (19a); where there is no Finish
 *              beside it (sealed, finished) its line stays Round 6's "For a
 *              bag added by mistake".
 * Save (19b): SaveBar, absent until the first edit; reverting the edits
 * takes it away. "Save changes", then "Applies to the N cups already logged
 * from this bag." when there are any (counts grouped, tabular). Saving
 * stays on the page: the bar goes, the title takes the new name.
 * Finish stays on the page too: the bag shows as finished.
 * Date limits (design-missing.md 33 / 34, Design Round 6):
 *   Roasted on  up to the first cup from the bag (or its opening, or today,
 *               whichever is first); the line under it names the limit when
 *               there is a cup — "Up to Apr 6, your first cup from it."
 *   Opened on   from the roast date to the first cup (no cups: today).
 * Leaving with edits asks first (Round 4's sheet; the bag's own body).
 * Delete: 11b's sheet with "bag" (Round 6, 36); back with 13b's notice.
 */
const countFormat = new Intl.NumberFormat('en-US');

export default function EditBagScreen({ bag, onBack, onDeleted, guardLeave }) {
  const db = useDatabase();
  // The bag as stored: the title, the sub line and what counts as an edit.
  const [stored, setStored] = useState(bag);
  const [form, setForm] = useState({ name: bag.name, roaster: bag.roaster ?? '', roastedAt: bag.roasted_at });
  const [openedAt, setOpenedAt] = useState(bag.opened_at);
  const cups = useFilteredCups(bagFilter(bag));
  const [nameMissing, setNameMissing] = useState(false);
  // 'roasted' | 'opened' | 'discard' | 'delete' | null
  const [sheet, setSheet] = useState(null);
  const [busy, setBusy] = useState(false);

  const cupCount = cups?.length ?? 0;
  const firstCupAt = cups?.length ? cups[cups.length - 1].logged_at : null;
  const finished = stored.finished_at != null;
  const opened = stored.opened_at != null;
  const open = opened && !finished;

  const name = form.name.trim();
  const roaster = form.roaster.trim() || null;
  const dirty = name !== stored.name || roaster !== (stored.roaster ?? null) || form.roastedAt !== stored.roasted_at || openedAt !== stored.opened_at;
  useEffect(() => {
    guardLeave?.(dirty && !busy, () => {
      Keyboard.dismiss();
      setSheet('discard');
    });
  }, [guardLeave, dirty, busy]);
  const leave = () => onBack({ force: true });

  // Limits. The first cup's day and today are whole days (the sheets pick days).
  const today = startOfDay(new Date());
  const firstCupDay = firstCupAt != null ? startOfDay(new Date(firstCupAt)) : null;
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
    if (busy || !dirty) return;
    if (!name) {
      setNameMissing(true);
      return;
    }
    setBusy(true);
    try {
      await updateBag(db, bag.id, { name, roaster, roastedAt: form.roastedAt, openedAt });
      Keyboard.dismiss();
      setStored((s) => ({ ...s, name, roaster, roasted_at: form.roastedAt, opened_at: openedAt }));
      setForm((f) => ({ ...f, name, roaster: roaster ?? '' }));
    } catch (error) {
      console.error('[3g] could not save', error);
      Alert.alert("Couldn't save your changes", String(error?.message ?? error));
    }
    setBusy(false);
  };

  const finish = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await finishBag(db, bag.id);
      setStored((s) => ({ ...s, finished_at: Date.now() }));
    } catch (error) {
      console.error('[3g] could not finish', error);
      Alert.alert("Couldn't finish this bag", String(error?.message ?? error));
    }
    setBusy(false);
  };

  const remove = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await deleteBag(db, bag.id);
      setSheet(null);
      onDeleted(stored.name);
    } catch (error) {
      console.error('[3g] could not delete', error);
      Alert.alert("Couldn't delete this bag", String(error?.message ?? error));
      setBusy(false);
    }
  };

  // Under the title, each fact after its own label (Uryu, 2026-10-28: a bare
  // "Blue Bottle · 250 g" hung there unexplained).
  const facts = [stored.roaster ? { label: 'Roaster', value: stored.roaster } : null, stored.size_g ? { label: 'Size', value: `${stored.size_g} g` } : null].filter(Boolean);
  const dates = [form.roastedAt != null ? `Roasted ${formatDay(form.roastedAt)}` : null, openedAt != null ? `opened ${formatDay(openedAt)}` : null]
    .filter(Boolean)
    .join(' · ');
  return (
    <View style={styles.screen}>
      <View style={styles.page}>
        <ScreenFrame scroll compact userTitle title={stored.name} leading={<IconButton icon="chevronLeft" accessibilityLabel="Back" onPress={onBack} />}>
          <View style={styles.body}>
            {facts.length ? (
              <View style={styles.facts}>
                {facts.map((f) => (
                  <View key={f.label} style={styles.fact} accessible accessibilityLabel={`${f.label}, ${f.value}`}>
                    <Text variant="labelEyebrow" color="muted">
                      {f.label}
                    </Text>
                    <Text variant="body" color="primary" numberOfLines={1} style={styles.factValue}>
                      {f.value}
                    </Text>
                  </View>
                ))}
              </View>
            ) : null}

            <View style={styles.status}>
              {/* TODO(photos): the bag's photo once photos can be added. */}
              <PhotoPlaceholder size={size.thumbnail.list} />
              <View style={styles.statusText}>
                {finished ? (
                  <Text variant="meterLabel" color="muted">
                    {`Finished ${formatDay(stored.finished_at)}`}
                  </Text>
                ) : !opened ? (
                  <BeanFreshness sealed />
                ) : (
                  <BeanFreshness roastedAt={form.roastedAt} stacked />
                )}
                {dates ? (
                  <Text variant="bodySm" color="muted">
                    {dates}
                  </Text>
                ) : null}
              </View>
            </View>

            {cups ? (
              <ItemCups
                cups={cups}
                heading="Cups from this bag"
                emptyLine="No cups from this bag yet."
                logLabel="Log a cup from it"
                // A cup is logged from an opened bag; Log a cup takes this one.
                onLog={open ? () => requestShell({ record: { bag: stored } }) : undefined}
                onOpen={(id) => requestPush({ name: 'cup', id })}
                onAll={() => requestPush({ name: 'search', filter: bagFilter(stored) })}
              />
            ) : null}

            <View style={styles.details}>
              <SectionLabel variant="plain" label="Details" />
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
                  opened
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
                }
              />
            </View>

            <View style={styles.end}>
              {open ? <Button variant="secondary" label="Finish bag" onPress={finish} /> : null}
              <Pressable
                onPress={() => {
                  Keyboard.dismiss();
                  setSheet('delete');
                }}
                accessibilityRole="button"
                accessibilityHint={open ? 'Not finish — erases it' : 'For a bag added by mistake'}
                style={({ pressed }) => [styles.delete, pressed && styles.pressed]}>
                {/* 3g: the bin (icon.accent; 3g draws 17, icon.md is 18) before the label. */}
                <View style={styles.deleteLabel}>
                  <Glyph name="trash" token={icon.md} color={color.icon.accent} />
                  <Text variant="labelCaps" color="primary">
                    Delete this bag
                  </Text>
                </View>
                <Text variant="bodySm" color="muted" style={styles.deleteHint}>
                  {open ? 'Not finish — erases it' : 'For a bag added by mistake'}
                </Text>
              </Pressable>
            </View>
          </View>
        </ScreenFrame>
      </View>

      <SaveBar visible={dirty}>
        <Button label="Save changes" onPress={save} />
        {cupCount > 0 ? (
          <Text variant="bodySmTabular" color="secondary" style={styles.centred}>
            {`Applies to the ${cupCount === 1 ? 'cup' : `${countFormat.format(cupCount)} cups`} already logged from this bag.`}
          </Text>
        ) : null}
      </SaveBar>

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
        onChange={(day) => setOpenedAt(stored.opened_at != null && day === startOfDay(new Date(stored.opened_at)) ? stored.opened_at : day)}
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
      <BottomSheet visible={sheet === 'delete'} onClose={() => setSheet(null)} swipeToClose>
        <Text variant="displaySm" color="primary">
          Delete this bag?
        </Text>
        <Text variant="body" color="secondary">
          {cupCount > 0
            ? `It's removed from My beans for good. Your ${cupCount === 1 ? 'logged cup keeps' : `${countFormat.format(cupCount)} logged cups keep`} its details.`
            : "It's removed from My beans for good."}
        </Text>
        {open ? (
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
  page: {
    flex: 1,
  },
  body: {
    gap: space[20],
    // Room under the end actions, off the home indicator (as 2c, 3f).
    paddingBottom: layout.empty.block,
  },
  // Roaster, then Size, on one line; wraps when a roaster's name is long.
  facts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: space[20],
    rowGap: spacing.gap.tight,
  },
  fact: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexShrink: 1,
    gap: spacing.gap.row,
  },
  factValue: {
    flexShrink: 1,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[14],
  },
  statusText: {
    flex: 1,
    minWidth: 0,
    gap: spacing.gap.row,
  },
  details: {
    gap: spacing.gap.row,
  },
  end: {
    gap: spacing.gap.section,
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
  deleteLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[8],
  },
  deleteHint: {
    flexShrink: 1,
    textAlign: 'right',
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
