import { forwardRef } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { resolveTextStyle } from '../../theme/fonts';
import { color, icon, shape, size, space, spacing, textStyle } from '../../theme/tokens';
import Glyph from './Glyph';

/**
 * Search field (catalogue #24), from 8l: a 2px ink frame on raised, padding
 * 12 / 14, the search glyph (icon.md, ink) then the input, caret color.caret.
 * 8l sets the query in 16 / 600, which no text style matches; `title`
 * (16 / 700) stands in, as for the form fields (drift D-44). Placeholder
 * text.placeholder.
 * Height: a fixed size.field.height (46, as the form fields) with the input
 * stretched to it, so iOS centres the line in a box that fits it. Sized by
 * padding alone, the input took the font's line box, which on an iPhone 16
 * Pro / 15 Pro Max cut the text's lower half (2026-10-15).
 *
 * Props: value, onChangeText, placeholder, autoFocus, accessibilityLabel
 */
const SearchField = forwardRef(function SearchField({ value, onChangeText, placeholder, autoFocus, accessibilityLabel }, ref) {
  return (
    <View style={styles.frame}>
      <Glyph name="search" token={icon.md} color={color.text.primary} />
      <TextInput
        ref={ref}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={color.text.placeholder}
        autoFocus={autoFocus}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="done"
        clearButtonMode="never"
        selectionColor={color.caret}
        accessibilityLabel={accessibilityLabel ?? placeholder}
        style={styles.input}
      />
    </View>
  );
});

export default SearchField;

const styles = StyleSheet.create({
  frame: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.gap.row,
    borderWidth: shape.borderWidth.box,
    borderColor: color.border.strong,
    backgroundColor: color.surface.raised,
    height: size.field.height,
    paddingHorizontal: space[14],
  },
  input: {
    ...resolveTextStyle(textStyle.title),
    flex: 1,
    alignSelf: 'stretch',
    color: color.text.primary,
    paddingVertical: 0,
  },
});
