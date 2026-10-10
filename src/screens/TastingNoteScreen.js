import * as Haptics from 'expo-haptics';
import { memo, useCallback, useState } from 'react';
import { Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AxisSlider from '../components/base/AxisSlider';
import Button from '../components/base/Button';
import Glyph from '../components/base/Glyph';
import IconButton from '../components/base/IconButton';
import SectionLabel from '../components/base/SectionLabel';
import Text from '../components/base/Text';
import { useRecordDraft } from '../components/RecordDraft';
import { BUNDLED_FLAVOURS, FLAVOUR_LIMIT } from '../constants/flavours';
import { TASTE_AXES } from '../constants/tasteAxes';
import { resolveTextStyle } from '../theme/fonts';
import { color, dashed, icon, layout, shape, size, space, spacing, state, textStyle } from '../theme/tokens';
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

const NOOP = () => {};

const MODE_LABEL = { made_it: 'I made it', barista: 'Barista', packaged: 'Packaged' };
const timeFormat = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });

/** The cup being noted, from the draft: what it is, then mode · method · time. */
function cupSummary(defaults, mode) {
  if (mode === 'made_it') {
    const method = defaults.brewer?.name;
    return { name: defaults.bag?.name ?? 'No bag', meta: [MODE_LABEL.made_it, method, timeFormat.format(new Date())].filter(Boolean).join(' · ') };
  }
  if (mode === 'barista') return { name: 'Flat white', meta: [MODE_LABEL.barista, defaults.cafe?.name, timeFormat.format(new Date())].filter(Boolean).join(' · ') };
  const product = defaults.product ? [defaults.product.brand, defaults.product.name].filter(Boolean).join(' · ') : 'No product';
  return { name: product, meta: [MODE_LABEL.packaged, timeFormat.format(new Date())].join(' · ') };
}

/**
 * The flavour chips shown: the selected ones in the order chosen, then
 * unselected bundled words up to FLAVOUR_LIMIT in all (gaps.md 15: 5 shown,
 * plus Search). Stage 1: the bundled list in its own order; history and 8n's
 * ordering come later.
 */
function shownFlavours(selected) {
  const rest = BUNDLED_FLAVOURS.map((f) => f.word).filter((w) => !selected.includes(w));
  return [...selected.map((w) => ({ word: w, on: true })), ...rest.slice(0, Math.max(0, FLAVOUR_LIMIT - selected.length)).map((w) => ({ word: w, on: false }))];
}

/** "My words" field: min-height is local to the field (not a token, on review). */
const NOTE_MIN_HEIGHT = 84;

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
 * text.note, the one italic). TODO: the keyboard's effect on the header
 * collapse gets its own round.
 */
function MyWords({ noteRef, setNoteFilled }) {
  const [text, setText] = useState(noteRef.current);
  return (
    <TextInput
      value={text}
      onChangeText={(t) => {
        setText(t);
        // Lift only the empty ↔ non-empty change (for the Discard and save label).
        if (Boolean(t.trim()) !== Boolean(noteRef.current.trim())) setNoteFilled(Boolean(t.trim()));
        noteRef.current = t;
      }}
      multiline
      placeholder="Cooled down it turned into iced tea…"
      placeholderTextColor={color.text.muted}
      accessibilityLabel="My words"
      style={[styles.note, styles.noteInput]}
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

export default function TastingNoteScreen({ onBack }) {
  const insets = useSafeAreaInsets();
  const { defaults, mode, rating, axes, setAxis, flavours, toggleFlavour, noteRef, setNoteFilled, hasTastingInput, save } = useRecordDraft();
  if (!defaults) return null;
  const cup = cupSummary(defaults, mode);
  const atLimit = flavours.length >= FLAVOUR_LIMIT;
  return (
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
        <View style={styles.summaryThumb} />
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
          {shownFlavours(flavours).map((f) => (
            <Chip key={f.word} label={f.word} on={f.on} onPress={() => toggleFlavour(f.word)} />
          ))}
          {/* TODO(T-2): opens the search sheet once it exists; inert for now. */}
          <Chip label="Search" search locked={atLimit} onPress={NOOP} />
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
        <Button label="Save this cup" onPress={() => save({ withNote: true })} disabled={rating === 0} />
        {/* "Discard and save" once anything is entered: the verb says it drops
            input, where "without the note" left open what it covers (decided
            2026-10-10; overrides the mock's copy). Full width, so the swap
            never changes the button's size; the label is also what VoiceOver
            reads. */}
        <Button
          label={hasTastingInput ? 'Discard and save' : 'Save without the note'}
          variant="secondary"
          onPress={() => save({ withNote: false })}
          disabled={rating === 0}
        />
      </View>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
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
  summaryThumb: {
    width: size.thumbnail.summary,
    height: size.thumbnail.summary,
    backgroundColor: color.surface.muted,
    borderWidth: shape.borderWidth.divider,
    borderColor: color.border.muted,
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
  note: {
    minHeight: NOTE_MIN_HEIGHT,
    padding: space[16],
    borderWidth: shape.borderWidth.box,
    borderColor: color.border.strong,
    backgroundColor: color.surface.raised,
  },
  noteInput: {
    ...resolveTextStyle(textStyle.note),
    color: color.text.primary,
    textAlignVertical: 'top',
  },
  actions: {
    marginTop: space[28],
    gap: space[12],
  },
});
