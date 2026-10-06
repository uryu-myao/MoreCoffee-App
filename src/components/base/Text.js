import { Text as RNText, StyleSheet } from 'react-native';
import { resolveTextStyle } from '../../theme/fonts';
import { color as colorTokens, textStyle } from '../../theme/tokens';

/**
 * Truncation policy (design-system.md §3.1). One vocabulary, not free-form
 * line counts, so every surface that shows the same kind of user string clips
 * it the same way. Form is always a tail ellipsis — never shrink-to-fit, which
 * would patch the composite text style, and never a silent parent clip.
 *
 *   name   2 lines  user-supplied names: café, bean, roaster, gear, drink, profile
 *   meta   1 line   provenance / secondary line under a name
 *   note   3 lines  tasting-note and memo previews
 *   none   —        fixed copy, and detail screens where the full text belongs
 *
 * The full text is reached through the detail screen the row already leads
 * to; there is no tap-to-expand.
 */
export const TRUNCATION = {
  name: 2,
  meta: 1,
  note: 3,
  none: undefined,
};

const TYPOGRAPHY_KEYS = ['fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'lineHeight', 'letterSpacing', 'textTransform'];

const resolved = Object.fromEntries(
  Object.entries(textStyle).map(([name, token]) => [name, resolveTextStyle(token)])
);

/**
 * Props
 *   variant    key of textStyle (default 'body')
 *   color      key of color.text (default 'primary'), or any colour value from tokens.ts
 *   truncate   'name' | 'meta' | 'note' | 'none' (default 'none')
 *   style      layout only (margin, flex, alignment) — text styles are composite
 *              and must not be patched; pick another variant instead
 */
export default function Text({
  variant = 'body',
  color = 'primary',
  truncate = 'none',
  style,
  children,
  ...rest
}) {
  if (__DEV__) {
    const flat = StyleSheet.flatten(style) ?? {};
    const patched = TYPOGRAPHY_KEYS.filter((k) => k in flat);
    if (patched.length) {
      console.warn(`[Text] ${variant} patched with ${patched.join(', ')} — define a new text style instead.`);
    }
  }

  const lines = TRUNCATION[truncate];

  return (
    <RNText
      {...rest}
      style={[resolved[variant], { color: colorTokens.text[color] ?? color }, style]}
      numberOfLines={lines}
      ellipsizeMode={lines ? 'tail' : undefined}
      // CJK: 'standard' turns on the system line-break rules UILabel uses
      // (kinsoku: no line-leading 。、」 and no line-ending 「). RN's default is 'none'.
      lineBreakStrategyIOS="standard"
      // Android: keep highQuality breaking (RN default) and never hyphenate —
      // hyphenation inserts '-' into romanised names.
      textBreakStrategy="highQuality"
      android_hyphenationFrequency="none">
      {children}
    </RNText>
  );
}
