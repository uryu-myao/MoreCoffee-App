import { StyleSheet, View } from 'react-native';
import { color, icon, size, spacing, state } from '../../theme/tokens';
import Glyph from './Glyph';
import Text from './Text';

/**
 * Section heading: square bullet + eyebrow label + optional right-side status.
 * Source: 5a (Set / Pre-filled), 5d (Required / 1 of 2 missing), 5e (Optional).
 *
 * Two variants (design-system.md §9 Section heading):
 *   marked  with the square bullet — the Record coffee form (5a, 5d, 5e)
 *   plain   no bullet — every other section heading (5b, 2c, 6a, 6b, 6c, 7a,
 *           8d, 8e, …)
 *
 *   set, prefilled     success check + success text
 *   required, missing  error state — label and status both take state.error.text
 *   optional           grey bullet (marker.optional), muted status text
 */
const STATUS = {
  set:       { label: 'Set',        tone: 'success', check: true },
  prefilled: { label: 'Pre-filled', tone: 'success', check: true },
  required:  { label: 'Required',   tone: 'error' },
  // Copy carries the counts ("1 of 2 missing"), so the caller supplies it.
  missing:   { label: null,         tone: 'error' },
  optional:  { label: 'Optional',   tone: 'muted' },
  // A neutral count ("3 of 5", 5b Flavors); the caller supplies the copy.
  count:     { label: null,         tone: 'muted' },
  // The same count at a selection limit ("5 of 5"): it turns accent to explain
  // why the rest are locked (design-system.md §1 Selection limit).
  limit:     { label: null,         tone: 'accent' },
};

const TONE_COLOR = {
  success: color.text.success,
  error: state.error.text,
  muted: color.text.muted,
  accent: color.text.accent,
};

/**
 * Props
 *   label        section name (fixed copy)
 *   variant      'marked' (default) | 'plain'
 *   status       'set' | 'prefilled' | 'required' | 'missing' | 'optional' | 'count' | 'limit' | undefined
 *   statusLabel  overrides the status copy; required for 'missing', 'count' and 'limit'
 */
export default function SectionLabel({ label, variant = 'marked', status, statusLabel }) {
  const s = status ? STATUS[status] : null;
  const isError = s?.tone === 'error';
  const statusText = statusLabel ?? s?.label;
  // TODO: status copy is English-only until i18n lands.

  return (
    <View
      style={styles.row}
      accessible
      accessibilityRole="header"
      accessibilityLabel={statusText ? `${label}, ${statusText}` : label}>
      {variant === 'marked' ? (
        <View style={[styles.bullet, status === 'optional' ? styles.bulletOptional : styles.bulletRequired]} />
      ) : null}
      <Text variant="labelEyebrow" color={isError ? state.error.text : 'muted'} style={styles.label}>
        {label}
      </Text>
      {s && statusText ? (
        <View style={styles.status}>
          {s.check ? <Glyph name="check" token={icon.xs} color={TONE_COLOR.success} /> : null}
          <Text variant="labelEyebrow" color={TONE_COLOR[s.tone]}>
            {statusText}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.gap.row,
    // Reserve the status glyph's height on every row. The check (icon.xs, 14)
    // is taller than the eyebrow line box (~11), so without this a row grew 3pt
    // when SET / PRE-FILLED appeared and everything below it moved — e.g. on the
    // first star tap. Same height for every status and for none.
    minHeight: icon.xs.size,
  },
  bullet: {
    width: size.dot.bullet,
    height: size.dot.bullet,
  },
  bulletRequired: {
    backgroundColor: color.marker.required,
  },
  bulletOptional: {
    backgroundColor: color.marker.optional,
  },
  label: {
    flexShrink: 1,
  },
  status: {
    marginLeft: 'auto',
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.gap.tight,
  },
});
