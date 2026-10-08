import { memo, useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AxisSlider from '../components/base/AxisSlider';
import Button from '../components/base/Button';
import Glyph from '../components/base/Glyph';
import IconButton from '../components/base/IconButton';
import SectionLabel from '../components/base/SectionLabel';
import Text from '../components/base/Text';
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

const NOOP = () => {};

/** 5b's cup, verbatim. */
const CUP = { name: 'Ethiopia Guji', meta: 'I made it · V60 · 08:20', rating: 4 };

/**
 * 5b's four axes: points 0–100 on five steps; null = not entered yet (empty).
 * The mock's 26 / 38 / 18 snap to the nearest step (25 / 50 / 25).
 */
const AXES = [
  { from: 'Acid', to: 'Bitter', value: 25 },
  { from: 'Light body', to: 'Full body', value: 50 },
  { from: 'Light roast', to: 'Dark roast', value: 25 },
  { from: 'Low sweetness', to: 'High sweetness', value: null },
];

/** 5b's flavour chips, verbatim; "Search" is the dashed opener. */
const FLAVORS = [
  { label: 'Jasmine', on: true },
  { label: 'White peach', on: true },
  { label: 'Black tea', on: true },
  { label: 'Cocoa', on: false },
  { label: 'Citrus', on: false },
];

/** "My words" field: min-height is local to the field (not a token, on review). */
const NOTE_MIN_HEIGHT = 84;

/**
 * The four axes own their state, so a commit re-renders the axes only — not
 * the whole screen (ScreenFrame, the header collapse, the chips).
 */
const Axes = memo(function Axes() {
  const [values, setValues] = useState(() => AXES.map((a) => a.value));
  const setAt = useCallback((i, v) => setValues((prev) => prev.map((x, j) => (j === i ? v : x))), []);
  return (
    <View style={styles.axes}>
      {AXES.map((a, i) => (
        <AxisRow key={a.from} index={i} axis={a} value={values[i]} setAt={setAt} />
      ))}
    </View>
  );
});

/** One axis; memoised so committing one leaves the other three alone. */
const AxisRow = memo(function AxisRow({ index, axis, value, setAt }) {
  const onChange = useCallback((v) => setAt(index, v), [index, setAt]);
  return <AxisSlider from={axis.from} to={axis.to} value={value} onChange={onChange} />;
});

function Chip({ label, on, search }) {
  return (
    <Pressable
      onPress={NOOP}
      // Multi-select: each flavour is a checkbox to a screen reader; Search opens.
      accessibilityRole={search ? 'button' : 'checkbox'}
      accessibilityState={search ? undefined : { checked: on }}>
      {({ pressed }) => (
        <View
          style={[
            styles.chip,
            on && styles.chipOn,
            search && styles.chipSearch,
            // Bordered chip = a surface → the fill darkens (§1 Pressed).
            pressed && styles.chipPressed,
          ]}>
          <Text variant="labelCaps" color={on ? 'accentStrong' : search ? 'muted' : 'secondary'}>
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

export default function TastingNoteScreen({ onBack }) {
  const insets = useSafeAreaInsets();
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
            {CUP.name}
          </Text>
          <Text variant="bodySm" color="muted" truncate="meta">
            {CUP.meta}
          </Text>
        </View>
        <View style={styles.summaryRating}>
          <Glyph name="star" token={icon.fill.sm} filled />
          <Text variant="numeralInline">{String(CUP.rating)}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text variant="displaySm" color="accent">
          Where did it sit?
        </Text>
        <Text variant="body" color="muted" style={styles.cardIntro}>
          Drag only what you noticed. Untouched axes are left out.
        </Text>
        <Axes />
      </View>

      <View style={styles.section}>
        <SectionLabel variant="plain" label="Flavors" status="count" statusLabel="3 of 5" />
        <View style={styles.chips}>
          {FLAVORS.map((f) => (
            <Chip key={f.label} {...f} />
          ))}
          <Chip label="Search" search />
        </View>
      </View>

      <View style={styles.section}>
        <SectionLabel variant="plain" label="My words" />
        {/* A field: frame + placeholder only, no keyboard yet. A surface → darkens on press. */}
        <Pressable onPress={NOOP} accessibilityRole="button" accessibilityLabel="My words">
          {({ pressed }) => (
            <View style={[styles.note, pressed && styles.notePressed]}>
              <Text variant="note" color="muted">
                Cooled down it turned into iced tea…
              </Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* 5b's buttons sit on the ground (no footer panel). The mock's 52pt
          secondary is right; Button still renders it at 56 (gaps.md 4). */}
      <View style={[styles.actions, { paddingBottom: Math.max(insets.bottom, layout.screen.bottom) }]}>
        <Button label="Save this cup" onPress={NOOP} />
        <Button label="Save without the note" variant="secondary" onPress={NOOP} />
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
    paddingVertical: space[20],
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
  notePressed: {
    backgroundColor: state.pressed.surface,
  },
  actions: {
    marginTop: space[28],
    gap: space[12],
  },
});
