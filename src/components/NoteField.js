import { StyleSheet, TextInput } from 'react-native';
import { resolveTextStyle } from '../theme/fonts';
import { color, shape, space, textStyle } from '../theme/tokens';

/** "My words" field: min-height is local to the field (not a token, on review). */
const NOTE_MIN_HEIGHT = 84;

/**
 * My words, the free-text field (5b; 11a). A 2px ink frame on raised, the
 * text in text.note (upright: no italics in the app, design-system.md §3),
 * the placeholder in text.placeholder. Controlled: value / onChangeText.
 *
 * The return key is "Done" and closes the keyboard (on device, 2026-10-17: a
 * multiline field otherwise offers no way to finish). Lines still wrap; a
 * line break can no longer be typed. onFocus lets the screen scroll what
 * follows into view.
 */
export default function NoteField({ value, onChangeText, onFocus }) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      onFocus={onFocus}
      multiline
      returnKeyType="done"
      submitBehavior="blurAndSubmit"
      placeholder="Cooled down it turned into iced tea…"
      placeholderTextColor={color.text.placeholder}
      accessibilityLabel="My words"
      style={styles.note}
    />
  );
}

const styles = StyleSheet.create({
  note: {
    minHeight: NOTE_MIN_HEIGHT,
    padding: space[16],
    borderWidth: shape.borderWidth.box,
    borderColor: color.border.strong,
    backgroundColor: color.surface.raised,
    ...resolveTextStyle(textStyle.note),
    color: color.text.primary,
    textAlignVertical: 'top',
  },
});
