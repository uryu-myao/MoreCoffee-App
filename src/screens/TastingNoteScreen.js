import * as Haptics from 'expo-haptics';
import { memo, useCallback, useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AxisSlider from '../components/base/AxisSlider';
import Button from '../components/base/Button';
import Glyph from '../components/base/Glyph';
import IconButton from '../components/base/IconButton';
import PhotoPlaceholder from '../components/base/PhotoPlaceholder';
import SectionLabel from '../components/base/SectionLabel';
import Text from '../components/base/Text';
import NoteField from '../components/NoteField';
import { useRecordDraft } from '../components/RecordDraft';
import { partOfDay } from '../constants/dates';
import SearchSheet from '../components/SearchSheet';
import { useDatabase } from '../data/DatabaseProvider';
import { listFlavourHistory } from '../data/repository';
import { BUNDLED_FLAVOURS, FLAVOUR_LIMIT, normalizeFlavour } from '../constants/flavours';
import { TASTE_AXES } from '../constants/tasteAxes';
import { color, dashed, icon, layout, shape, size, space, spacing, state } from '../theme/tokens';
import ScreenFrame from './ScreenFrame';

/**
 * Tasting note (5b) — step 2 of 2 in the Record sheet, opened by "Add tasting
 * note" (AddCoffeeOverlay). Back returns to step 1.
 *   - the axes are live AxisSliders (drag, tap, Clear) — held in screen state,
 *     not saved yet
 *   - "My words" is a frame + placeholder, no keyboard
 *   - the chips and both save buttons press (with feedback) but do nothing
 * Content is 5b's mock copy verbatim; no database.
 *
 * The flavour chips and the cup summary row are still drawn here; they become
 * components later (design-system.md §9 Component catalog — pending).
 *
 * TODO: save flow and the "My words" keyboard in later rounds; the keyboard
 * gets its own round because it can interfere with the header collapse.
 */


const MODE_LABEL = { made_it: 'I made it', barista: 'Barista', packaged: 'Packaged' };
const timeFormat = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });

/** The cup being noted, from the draft: what it is, then mode · method · time. */
function cupSummary(defaults, mode) {
  if (mode === 'made_it') {
    const method = defaults.brewer?.name;
    // As cupTitle: no bag → the brewer, then the grinder (2026-10-12).
    return { name: defaults.bag?.name ?? defaults.brewer?.name ?? defaults.grinder?.name ?? `${partOfDay(new Date())} cup`, meta: [MODE_LABEL.made_it, method, timeFormat.format(new Date())].filter(Boolean).join(' · ') };
  }
  // No fixed drink (2026-10-11): Barista records none until it has an input.
  if (mode === 'barista') return { name: 'No drink', meta: [MODE_LABEL.barista, defaults.cafe?.name, timeFormat.format(new Date())].filter(Boolean).join(' · ') };
  const product = defaults.product ? [defaults.product.brand, defaults.product.name].filter(Boolean).join(' · ') : 'No product';
  return { name: product, meta: [MODE_LABEL.packaged, timeFormat.format(new Date())].join(' · ') };
}

/**
 * The flavour chips shown: the selected ones in the order chosen, then
 * unselected words up to FLAVOUR_LIMIT in all (gaps.md 15: 5 shown, plus
 * Search), in the search sheet's order (decided 2026-10-11): history first,
 * then the bundled list. With no history yet that is the bundled list's
 * interleaved order; the more you log, the more the five are your own words.
 */
function shownFlavours(selected, history) {
  const rest = searchItems(history, []).map((i) => i.key).filter((w) => !selected.includes(w));
  return [...selected.map((w) => ({ word: w, on: true })), ...rest.slice(0, Math.max(0, FLAVOUR_LIMIT - selected.length)).map((w) => ({ word: w, on: false }))];
}

/**
 * The four axes. Their values live in the Record sheet's draft (shared with
 * 5a, kept when going back). An axis commits on release only, so a commit
 * re-renders rarely; AxisRow is memoised so the other three stay put.
 */
const Axes = memo(function Axes({ axes, setAxis }) {
  return (
    <View style={styles.axes}>
      {TASTE_AXES.map((a) => (
        <AxisRow key={a.key} axis={a} value={axes[a.key]} setAxis={setAxis} />
      ))}
    </View>
  );
});

/** One axis; memoised so committing one leaves the other three alone. */
const AxisRow = memo(function AxisRow({ axis, value, setAxis }) {
  const onChange = useCallback((v) => setAxis(axis.key, v), [axis.key, setAxis]);
  return <AxisSlider from={axis.from} to={axis.to} steps={axis.steps} value={value} onChange={onChange} />;
});

/**
 * My words. The text stays in this field's own state and is mirrored into the
 * draft's ref, so typing re-renders this field only (design-system.md §3:
 * text.note, upright: no italics in the app). TODO: the keyboard's effect on the header
 * collapse gets its own round.
 */
function MyWords({ noteRef, setNoteFilled }) {
  const [text, setText] = useState(noteRef.current);
  return (
    <NoteField
      value={text}
      onChangeText={(t) => {
        setText(t);
        // Lift only the empty ↔ non-empty change (for the Discard and save label).
        if (Boolean(t.trim()) !== Boolean(noteRef.current.trim())) setNoteFilled(Boolean(t.trim()));
        noteRef.current = t;
      }}
    />
  );
}

/**
 * A locked Search answers a press with the warning haptic (§1 Haptics, the
 * exception under Selection limit): it opens a sheet, and a press that opens
 * nothing otherwise gave no sign. Still no visual press feedback.
 */
const warnLocked = () => {
  if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
};

function Chip({ label, on, search, locked, onPress }) {
  return (
    <Pressable
      onPress={locked ? (search ? warnLocked : undefined) : onPress}
      disabled={locked && !search}
      // Multi-select: each flavour is a checkbox to a screen reader; Search opens.
      accessibilityRole={search ? 'button' : 'checkbox'}
      accessibilityState={search ? { disabled: Boolean(locked) } : { checked: on }}
      accessibilityHint={locked ? `Limit reached, ${FLAVOUR_LIMIT} of ${FLAVOUR_LIMIT}. Deselect a flavour to choose another.` : undefined}>
      {({ pressed }) => (
        <View
          style={[
            styles.chip,
            on && styles.chipOn,
            search && styles.chipSearch,
            // At the limit Search is locked like the other options (§1 Selection
            // limit): the inert dashed frame, muted label, no press response.
            locked && styles.chipSearchLocked,
            // Bordered chip = a surface → the fill darkens (§1 Pressed).
            pressed && !locked && styles.chipPressed,
          ]}>
          <Text variant="labelCaps" color={on ? 'accentStrong' : search || locked ? 'muted' : 'secondary'}>
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

/**
 * The search sheet's words (decided 2026-10-10): words used before (most used,
 * then most recent), then the bundled words not among them, in their order.
 * Words selected in this cup but not in either (just added) lead, so a new
 * word stays visible and can be unticked.
 */
function searchItems(history, selected) {
  const seen = new Set();
  const out = [];
  const push = (word) => {
    const k = word.toLowerCase();
    if (seen.has(k)) return;
    seen.add(k);
    out.push({ key: word, label: word });
  };
  const known = new Set([...history.map((h) => h.word.toLowerCase()), ...BUNDLED_FLAVOURS.map((f) => f.word.toLowerCase())]);
  selected.filter((w) => !known.has(w.toLowerCase())).forEach(push);
  history.forEach((h) => push(h.word));
  BUNDLED_FLAVOURS.forEach((f) => push(f.word));
  return out;
}

export default function TastingNoteScreen({ onBack }) {
  const insets = useSafeAreaInsets();
  const db = useDatabase();
  const { defaults, mode, rating, axes, setAxis, flavours, toggleFlavour, noteRef, setNoteFilled, hasTastingInput, save } = useRecordDraft();
  const [searching, setSearching] = useState(false);
  const [history, setHistory] = useState([]);
  // Read on open and again whenever the search sheet opens; history only
  // changes on save, so this is fresh enough.
  useEffect(() => {
    let alive = true;
    listFlavourHistory(db).then(
      (rows) => alive && setHistory(rows),
      (error) => console.error('[flavours] could not read history', error)
    );
    return () => {
      alive = false;
    };
  }, [db, searching]);
  if (!defaults) return null;
  const saveOrGoBack = async (options) => {
    if ((await save(options)) === 'missing') onBack();
  };
  const cup = cupSummary(defaults, mode);
  const atLimit = flavours.length >= FLAVOUR_LIMIT;
  return (
    <View style={styles.screen}>
      <ScreenFrame
        scroll
        compact
        title="Tasting note"
        leading={<IconButton icon="chevronLeft" accessibilityLabel="Back" onPress={onBack} />}
        meta={
          <View style={styles.headerMeta}>
            <Text variant="labelEyebrow" color="muted">
              Step 2 of 2
            </Text>
            <Text variant="labelCaps" color="accent" style={styles.skippable}>
              Skippable
            </Text>
          </View>
        }>
        {/* The cup being noted (5b's summary row; a component later). */}
        <View style={styles.summary}>
          <PhotoPlaceholder size={size.thumbnail.summary} />
          <View style={styles.summaryText}>
            <Text variant="label" truncate="name">
              {cup.name}
            </Text>
            <Text variant="bodySm" color="muted" truncate="meta">
              {cup.meta}
            </Text>
          </View>
          <View style={styles.summaryRating}>
            <Glyph name="star" token={icon.fill.sm} filled />
            <Text variant="numeralInline">{rating > 0 ? String(rating) : '–'}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text variant="displaySm" color="accent">
            Where did it sit?
          </Text>
          <Text variant="body" color="muted" style={styles.cardIntro}>
            Drag only what you noticed. Untouched axes are left out.
          </Text>
          <Axes axes={axes} setAxis={setAxis} />
        </View>

        <View style={styles.section}>
          <SectionLabel variant="plain" label="Flavors" status={atLimit ? 'limit' : 'count'} statusLabel={`${flavours.length} of ${FLAVOUR_LIMIT}`} />
          <View style={styles.chips}>
            {shownFlavours(flavours, history).map((f) => (
              <Chip key={f.word} label={f.word} on={f.on} onPress={() => toggleFlavour(f.word)} />
            ))}
            <Chip label="Search" search locked={atLimit} onPress={() => setSearching(true)} />
          </View>
        </View>

        <View style={styles.section}>
          <SectionLabel variant="plain" label="My words" />
          <MyWords noteRef={noteRef} setNoteFilled={setNoteFilled} />
        </View>

        {/* 5b's buttons sit on the ground (no footer panel). The mock's 52pt
            secondary is right; Button still renders it at 56 (gaps.md 4). */}
        <View style={[styles.actions, { paddingBottom: Math.max(insets.bottom, layout.screen.bottom) }]}>
          {/* Save this cup saves everything; Save without the note is the one,
              explicit way to drop the axes, flavours and My words (§1). The
              rating is required on both steps. */}
          {/* No rating: back to 5a in 5d's state (an automatic "Go to first",
              decided 2026-10-11); everything entered here stays in the draft. */}
          <Button label="Save this cup" onPress={() => saveOrGoBack({ withNote: true })} />
          {/* "Discard and save" once anything is entered: the verb says it drops
              input, where "without the note" left open what it covers (decided
              2026-10-10; overrides the mock's copy). Full width, so the swap
              never changes the button's size; the label is also what VoiceOver
              reads. */}
          <Button
            label={hasTastingInput ? 'Discard and save' : 'Save without the note'}
            variant="secondary"
            onPress={() => saveOrGoBack({ withNote: false })}
          />
        </View>
      </ScreenFrame>
      <SearchSheet
        visible={searching}
        onClose={() => setSearching(false)}
        placeholder="Search flavors"
        items={searchItems(history, flavours)}
        selected={flavours}
        limit={FLAVOUR_LIMIT}
        onToggle={toggleFlavour}
        onAdd={toggleFlavour}
        normalize={normalizeFlavour}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  headerMeta: {
    alignItems: 'flex-end',
  },
  skippable: {
    marginTop: spacing.gap.tight,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
    paddingBottom: space[14],
    borderBottomWidth: shape.borderWidth.divider,
    borderBottomColor: color.divider.hairlineStrong,
  },
  summaryText: {
    flex: 1,
    gap: space[2],
  },
  summaryRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.gap.tight,
  },
  card: {
    marginTop: space[20],
    borderWidth: shape.borderWidth.box,
    borderColor: color.border.strong,
    backgroundColor: color.surface.raised,
    // inset.container (14 / 16), as StarRating's card: drift D-18, decided
    // 2026-10-10 (the mocks' 20 / 18 is the drift, not the token).
    paddingVertical: spacing.inset.container.v,
    paddingHorizontal: spacing.inset.container.h,
  },
  cardIntro: {
    marginTop: space[6],
  },
  axes: {
    marginTop: space[20],
    gap: spacing.gap.axis,
  },
  section: {
    marginTop: space[20],
    gap: spacing.gap.row,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.gap.row,
  },
  chip: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.inset.control.v,
    // The mock's 14 (space.14), not inset.control's 16: at 16 the five chips
    // wrap to 3 rows at 390pt, at 14 they keep the mock's 2 (2026-10-08).
    paddingHorizontal: space[14],
    borderWidth: shape.borderWidth.divider,
    borderColor: color.border.muted,
  },
  chipOn: {
    borderColor: color.border.accent,
    backgroundColor: color.badge.bg.accent,
  },
  // An entry for adding more: border.addSlot (2px ink dashed; the mock's
  // 1.5px muted is drift D-21).
  chipSearch: {
    borderWidth: dashed.addSlot.width,
    borderStyle: dashed.addSlot.style,
    borderColor: dashed.addSlot.color,
  },
  chipSearchLocked: {
    borderColor: dashed.addSlotInert.color,
  },
  chipPressed: {
    backgroundColor: state.pressed.surface,
  },
  actions: {
    marginTop: space[28],
    gap: space[12],
  },
});
