import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { formatDay } from '../constants/dates';
import { resolveTextStyle } from '../theme/fonts';
import { color, shape, size, spacing, textStyle } from '../theme/tokens';
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
 * text.secondary (gaps.md 23).
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
 */
export default function BagForm({ value, onChange, onPickDate, datePicking = false }) {
  return (
    <View style={styles.card}>
      <Field label="Bean name" value={value.name} onChangeText={(name) => onChange({ ...value, name })} autoFocus />
      <Field label="Roaster" value={value.roaster} placeholder="Optional" onChangeText={(roaster) => onChange({ ...value, roaster })} />
      <DayField
        label="Roasted on"
        value={value.roastedAt}
        placeholder="Optional — for freshness"
        onPress={onPickDate}
        focused={datePicking}
      />
    </View>
  );
}

function Field({ label, value = '', placeholder, onChangeText, editable = true, autoFocus = false }) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.field}>
      <Text variant="labelEyebrow" color="muted">
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={color.text.secondary}
        editable={editable}
        autoFocus={autoFocus}
        autoCorrect={false}
        selectionColor={color.caret}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        accessibilityLabel={label}
        style={[styles.input, focused && styles.inputFocused]}
      />
    </View>
  );
}

/** A field whose value is picked, not typed: the same line, as a button. */
function DayField({ label, value, placeholder, onPress, focused }) {
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
        <Text variant="title" color={filled ? 'primary' : 'secondary'}>
          {filled ? formatDay(value) : placeholder}
        </Text>
      </Pressable>
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
  inputFocused: {
    borderBottomColor: color.border.strong,
  },
});
