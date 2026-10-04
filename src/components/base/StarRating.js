import * as Haptics from 'expo-haptics';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { color, dashed, icon, shape, size, spacing, state } from '../../theme/tokens';
import DashedRule from './DashedRule';
import Glyph from './Glyph';
import HardShadow from './HardShadow';
import Text from './Text';

const STARS = [1, 2, 3, 4, 5];

/**
 * The "How was it?" rating card (5a), with its required/error state (5d).
 * Five 52px (size.control.row) tap targets spread across the card; filled stars
 * are the icon.fill.xl glyph, empty stars the icon.xl stroke in border.muted.
 *
 * Props
 *   value     0–5 (0 = unrated)
 *   onChange  (n) => void — fires with a selection haptic
 *   caption   optional line under a dashed rule ("Would order again")
 *   error     optional message; switches the card to the 5d error state and
 *             replaces the caption
 */
export default function StarRating({ value = 0, onChange, caption, error }) {
  const press = (n) => {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    onChange?.(n);
  };

  const footer = error ? (
    <View style={styles.errorRow}>
      <Glyph name="alert" token={icon.sm} color={state.error.text} />
      <Text variant="meta" color={state.error.text} style={styles.errorText}>
        {error}
      </Text>
    </View>
  ) : caption ? (
    <Text variant="label">{caption}</Text>
  ) : null;

  return (
    <HardShadow shadow={error ? state.error.shadow : null}>
      <View style={[styles.card, error && styles.cardError]}>
        <View style={styles.stars}>
          {STARS.map((n) => {
            const filled = n <= value;
            return (
              <Pressable
                key={n}
                onPress={() => press(n)}
                accessibilityRole="button"
                accessibilityLabel={n === 1 ? '1 star' : `${n} stars`}
                accessibilityState={{ selected: n === value }}
                style={styles.star}>
                {filled ? (
                  <Glyph name="star" token={icon.fill.xl} filled />
                ) : (
                  <Glyph name="star" token={icon.xl} color={color.border.muted} />
                )}
              </Pressable>
            );
          })}
        </View>

        {footer ? (
          <View style={styles.footer}>
            <DashedRule token={dashed.dividerSoft} />
            {footer}
          </View>
        ) : null}
      </View>
    </HardShadow>
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
  cardError: {
    borderColor: state.error.border,
  },
  stars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  star: {
    width: size.control.row,
    height: size.control.row,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    gap: spacing.gap.section,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.gap.row,
  },
  errorText: {
    flex: 1,
  },
});
