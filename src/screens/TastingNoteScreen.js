import { Pressable, StyleSheet, View } from 'react-native';
import Button from '../components/base/Button';
import Glyph from '../components/base/Glyph';
import IconButton from '../components/base/IconButton';
import SectionLabel from '../components/base/SectionLabel';
import Text from '../components/base/Text';
import { color, component, dashed, icon, layout, shape, size, space, spacing, state, texture } from '../theme/tokens';
import ScreenFrame from './ScreenFrame';

/**
 * Tasting note (5b) — STATIC SHELL for the scroll / collapse / bottom-bar
 * checks. Everything shows; nothing edits yet:
 *   - the axes are drawn, not dragged
 *   - "My words" is a frame + placeholder, no keyboard
 *   - Back, the chips and both save buttons press (with feedback) but do nothing
 * Content is 5b's mock copy verbatim; no database.
 *
 * Drawn here rather than as components, on review (2026-10-06): the axis
 * slider, the flavour chips and the cup summary row become components in a
 * later round (design-system.md §9 Component catalog — pending).
 *
 * TODO: input (axis drag, "My words" keyboard, save flow) in later rounds; the
 * keyboard gets its own round because it can interfere with the header
 * collapse.
 */

const NOOP = () => {};

/** 5b's cup, verbatim. */
const CUP = { name: 'Ethiopia Guji', meta: 'I made it · V60 · 08:20', rating: 4 };

/** 5b's four axes, verbatim. `at` is the needle position (0–1); null = not noted. */
const AXES = [
  { from: 'Acid', to: 'Bitter', at: 0.26 },
  { from: 'Light body', to: 'Full body', at: 0.38 },
  { from: 'Light roast', to: 'Dark roast', at: 0.18 },
  { from: 'Low sweetness', to: 'High sweetness', at: null },
];

/** 5b's flavour chips, verbatim; "Search" is the dashed opener. */
const FLAVORS = [
  { label: 'Jasmine', on: true },
  { label: 'White peach', on: true },
  { label: 'Black tea', on: true },
  { label: 'Cocoa', on: false },
  { label: 'Citrus', on: false },
];

/**
 * The needle of an axis that HAS a value (5b's three set axes). Local, not a
 * token, on review: it is promoted (or not) when the axis becomes a component.
 * Accent fill, 2px ink border, 12 × 32 — two taller than the unset needle
 * (component.axis.needle, 12 × 30).
 */
const SET_NEEDLE = {
  w: component.axis.needle.w,
  h: 32,
  fill: color.icon.accent,
  borderWidth: shape.borderWidth.box,
  borderColor: color.border.strong,
};

/** "My words" field: min-height is local to the field (not a token, on review). */
const NOTE_MIN_HEIGHT = 84;

/** texture.rule: vertical lines every 25%; the 0% line sits under the left border. */
const RULE_STOPS = [0.25, 0.5, 0.75];

function Axis({ from, to, at }) {
  const set = at != null;
  // entered: the user's own value for this cup; derived: anything else (here, not noted).
  const rail = set ? component.axis.rail.entered : component.axis.rail.derived;
  const needle = set
    ? SET_NEEDLE
    : { ...component.axis.needle, fill: component.axis.needle.background, borderWidth: shape.borderWidth.divider };
  const railH = component.axis.rail.height;
  const borderW = rail.width;
  return (
    <View style={styles.axis}>
      <View style={styles.axisEnds}>
        <Text variant="labelEyebrow" color="muted">
          {from}
        </Text>
        <Text variant="labelEyebrow" color="muted">
          {to}
        </Text>
      </View>
      <View
        style={[
          styles.rail,
          { height: railH, borderWidth: borderW, borderStyle: rail.style, borderColor: rail.color, backgroundColor: rail.background },
        ]}>
        {RULE_STOPS.map((p) => (
          <View key={p} style={[styles.ruleLine, { left: `${p * 100}%` }]} />
        ))}
        <View
          style={{
            position: 'absolute',
            left: `${(set ? at : 0.5) * 100}%`,
            marginLeft: -needle.w / 2,
            // Centred on the rail; offsets are from inside its border.
            top: (railH - needle.h) / 2 - borderW,
            width: needle.w,
            height: needle.h,
            backgroundColor: needle.fill,
            borderWidth: needle.borderWidth,
            borderColor: needle.borderColor,
          }}
        />
      </View>
      {set ? null : (
        <Text variant="meta" color="muted">
          Not noted
        </Text>
      )}
    </View>
  );
}

function Chip({ label, on, search }) {
  return (
    <Pressable onPress={NOOP} accessibilityRole="button" accessibilityState={search ? undefined : { selected: on }}>
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

export default function TastingNoteScreen() {
  return (
    <ScreenFrame
      scroll
      title="Tasting note"
      leading={<IconButton icon="chevronLeft" accessibilityLabel="Back" onPress={NOOP} />}
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
        <View style={styles.axes}>
          {AXES.map((a) => (
            <Axis key={a.from} {...a} />
          ))}
        </View>
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
      <View style={styles.actions}>
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
  axis: {
    gap: spacing.gap.row,
  },
  axisEnds: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rail: {
    position: 'relative',
  },
  ruleLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: texture.rule.lineWidth,
    backgroundColor: texture.rule.color,
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
    paddingHorizontal: spacing.inset.control.h,
    borderWidth: shape.borderWidth.divider,
    borderColor: color.border.muted,
  },
  chipOn: {
    borderColor: color.border.accent,
    backgroundColor: color.badge.bg.accent,
  },
  chipSearch: {
    borderStyle: dashed.track.style,
    borderColor: dashed.track.color,
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
    // In the tab pager (verification placement) the bottom bar sits over the
    // last content when shown; same clearance as the Records list.
    paddingBottom: layout.empty.block,
  },
});
