import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { formatDay } from '../constants/dates';
import { resolveTextStyle } from '../theme/fonts';
import { color, shape, size, spacing, state, textStyle } from '../theme/tokens';
import ClearButton from './base/ClearButton';
import Text from './base/Text';

/**
 * Bag form (design/components.md "Adding a bag…"): the fields of one bag.
 * Two field sets, one component:
 *   minimal  Bean name (required), Roaster, Roasted on — 8o's set; 3c (minimal)
 *   full     + Roast level, Size, Photo, Origin / Region / Process — 3c / 3g;
 *            not built yet (the screen keeps its entry points when it grows)
 *
 * Fields follow 3c / 3g: an eyebrow label over a 46pt line with a 2px
 * underline — ink while focused, border.muted otherwise.
 * Text: the mocks set a focused / entered value at 16 / 700 (`title`) and an
 * idle field at 16 / 500, which has no text style (drift D-44), so every
 * value uses `title`. Entered text is text.primary, placeholders
 * text.placeholder (2026-10-12). Bean name's example is Uryu's (2026-10-12).
 *
 * Field is exported: 3e (Edit gear) builds its Name and Maker from it.
 *
 * A typed field with text shows ClearButton's × at the underline's right end
 * (2026-10-17, ours): it empties the field.
 *
 * Roasted on is a day, picked in a sheet (DateSheet): the field shows it as
 * "Apr 1" and opens the sheet; the screen hosts the sheet, since it covers
 * the whole screen.
 *
 * Props
 *   value       { name, roaster, roastedAt (ms of a local midnight, or null) }
 *   onChange    (next) => void
 *   onPickDate  open the date sheet for Roasted on
 *   datePicking the sheet is open (the field shows focus)
 *   roastedPlaceholder  Roasted on's empty text (3c: what it gives, Design
 *             Round 7; 3g: "Optional" — 3g corrects, it doesn't ask)
 *   roastedHint a line under Roasted on (3g: its limit)
 *   opened      3g: { value, hint, onPick, picking } — an Opened on field
 *               under Roasted on, for a bag that is open
 *   children    3g: drawn last inside the card (the freshness block)
 *   autoFocusName  3c: the keyboard comes up on Bean name; 3g: off (it opens to correct, not to type)
 *   nameMissing "Open this bag" was pressed with no name: Bean name takes 5d's
 *             error vocabulary — the label reads "Bean name · required" and
 *             it and the underline take the error colour (no mock draws an
 *             inline input error, gaps.md 6; for Design to check)
 */
export default function BagForm({
  value,
  onChange,
  onPickDate,
  datePicking = false,
  nameMissing = false,
  roastedPlaceholder = "Add it to see when it's at its best.",
  roastedHint,
  opened,
  children,
  autoFocusName = true,
}) {
  return (
    <View style={styles.card}>
      <Field label="Bean name" value={value.name} placeholder="e.g. Ethiopia Guji" onChangeText={(name) => onChange({ ...value, name })} autoFocus={autoFocusName} error={nameMissing} />
      <Field label="Roaster" value={value.roaster} placeholder="Optional" onChangeText={(roaster) => onChange({ ...value, roaster })} />
      <DayField
        label="Roasted on"
        value={value.roastedAt}
        // 3c: says what it gives, not that it's optional (Design Round 7, 41).
        placeholder={roastedPlaceholder}
        hint={roastedHint}
        onPress={onPickDate}
        focused={datePicking}
      />
      {opened ? <DayField label="Opened on" value={opened.value} hint={opened.hint} onPress={opened.onPick} focused={opened.picking} /> : null}
      {children}
    </View>
  );
}

export function Field({ label, value = '', placeholder, onChangeText, editable = true, autoFocus = false, error = false }) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.field}>
      <Text variant="labelEyebrow" color={error ? state.error.text : 'muted'}>
        {error ? `${label} · required` : label}
      </Text>
      <View style={[styles.input, styles.typed, focused && styles.inputFocused, error && styles.inputError]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={color.text.placeholder}
          editable={editable}
          autoFocus={autoFocus}
          autoCorrect={false}
          selectionColor={color.caret}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          accessibilityLabel={label}
          style={styles.typedInput}
        />
        {editable && value ? <ClearButton onPress={() => onChangeText('')} accessibilityLabel={`Clear ${label}`} /> : null}
      </View>
    </View>
  );
}

/** A field whose value is picked, not typed: the same line, as a button. */
function DayField({ label, value, placeholder, hint, onPress, focused }) {
  const filled = value != null;
  return (
    <View style={styles.field}>
      <Text variant="labelEyebrow" color="muted">
        {label}
      </Text>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${label}, ${filled ? formatDay(value) : 'not set'}`}
        style={[styles.input, styles.dayField, focused && styles.inputFocused]}>
        <Text variant="title" color={filled ? 'primary' : 'placeholder'}>
          {filled ? formatDay(value) : placeholder}
        </Text>
      </Pressable>
      {hint ? (
        <Text variant="meta" color="muted">
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: shape.borderWidth.box,
    borderColor: color.border.strong,
    backgroundColor: color.surface.raised,
    paddingVertical: spacing.inset.container.v,
    paddingHorizontal: spacing.inset.container.h,
    gap: spacing.gap.section,
  },
  field: {
    gap: spacing.gap.tight,
  },
  input: {
    ...resolveTextStyle(textStyle.title),
    color: color.text.primary,
    height: size.field.height,
    borderBottomWidth: shape.borderWidth.box,
    borderBottomColor: color.border.muted,
    paddingVertical: 0,
  },
  dayField: {
    justifyContent: 'center',
  },
  // A typed field: the line (styles.input) holds the input and the clear ×.
  typed: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typedInput: {
    ...resolveTextStyle(textStyle.title),
    flex: 1,
    alignSelf: 'stretch',
    color: color.text.primary,
    paddingVertical: 0,
  },
  inputFocused: {
    borderBottomColor: color.border.strong,
  },
  inputError: {
    borderBottomColor: state.error.border,
  },
});
