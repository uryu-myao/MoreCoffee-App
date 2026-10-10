import { forwardRef } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { resolveTextStyle } from '../../theme/fonts';
import { color, icon, shape, space, spacing, textStyle } from '../../theme/tokens';
import Glyph from './Glyph';

/**
 * Search field (catalogue #24), from 8l: a 2px ink frame on raised, padding
 * 12 / 14, the search glyph (icon.md, ink) then the input, caret color.caret.
 * 8l sets the query in 16 / 600, which no text style matches; `title`
 * (16 / 700) stands in, as for the form fields (drift D-44). Placeholder
 * text.secondary (gaps.md 23).
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
        placeholderTextColor={color.text.secondary}
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
    paddingVertical: space[12],
    paddingHorizontal: space[14],
  },
  input: {
    ...resolveTextStyle(textStyle.title),
    flex: 1,
    color: color.text.primary,
    paddingVertical: 0,
  },
});
