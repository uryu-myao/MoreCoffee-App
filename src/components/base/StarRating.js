import * as Haptics from 'expo-haptics';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { color, dashed, icon, shape, size, spacing, state } from '../../theme/tokens';
import DashedRule from './DashedRule';
import Glyph from './Glyph';
import HardShadow from './HardShadow';
import Text from './Text';

const STARS = [1, 2, 3, 4, 5];

/**
 * Pressed disc. A circle because the star is a radial control — press feedback
 * follows the shape of the element (design-system.md §1 Shape). Single use, so
 * these are local values, not tokens. The disc sits inside the 52px tap
 * target and is centred on the star's optical centre: the glyph is centred on
 * its viewBox, which puts the star's mass ~0.8px below the box centre, so the
 * disc moves 1px DOWN (tuned by eye at 3x; design-system.md §9 Star rating).
 */
const PRESSED_DISC = { diameter: 48, opticalOffsetY: 1 };

/**
 * The "How was it?" rating card (5a), with its required/error state (5d).
 * Five 52px (size.control.row) tap targets spread across the card; filled stars
 * are the icon.fill.xl glyph, empty stars the icon.xl stroke in border.muted.
 *
 * Props
 *   value     0–5 (0 = unrated)
 *   onChange  (n) => void — fires with a selection haptic
 *   caption   optional line under a dashed rule. Pass a string (even '') to
 *             reserve the line: it is always exactly one line tall, so the
 *             card never changes height as the caption changes or empties.
 *   error     optional message; switches the card to the 5d error state and
 *             replaces the caption
 *   testOnly_pressedStar   force the pressed look on star n (dev harness)
 *
 * Pressed: a 48px disc in state.pressed.surface appears behind the star (Hard
 * Rule, design-system.md §1). The 52px touch target is unchanged.
 */
export default function StarRating({ value = 0, onChange, caption, error, testOnly_pressedStar }) {
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
  ) : caption !== undefined ? (
    // One line, fixed: truncate="meta" holds it to a single line, and the
    // no-break space keeps that line's height when the caption is empty.
    // Sized for the English copy, which fits one line at 390pt. If a
    // translation overflows (it would ellipsize), revisit — a two-line
    // reserve was rejected because ja / zh likely fit one line and would
    // carry a permanent empty line.
    <Text variant="label" truncate="meta">
      {caption || '\u00A0'}
    </Text>
  ) : null;

  return (
    <HardShadow shadow={error ? state.error.shadow : null}>
      <View style={[styles.card, error && styles.cardError]}>
        <View style={styles.stars} accessibilityRole="radiogroup">
          {STARS.map((n) => {
            const filled = n <= value;
            return (
              <Pressable
                key={n}
                onPress={() => press(n)}
                accessibilityRole="radio"
                accessibilityLabel={n === 1 ? '1 star' : `${n} stars`}
                accessibilityState={{ checked: n === value }}
                testOnly_pressed={n === testOnly_pressedStar}
                style={styles.star}>
                {({ pressed }) => (
                  <>
                    {pressed ? <View style={styles.pressedDisc} /> : null}
                    {/* The View keeps the glyph above the absolute disc on web too,
                        where positioned elements otherwise paint over plain siblings. */}
                    <View>
                      {filled ? (
                        <Glyph name="star" token={icon.fill.xl} filled />
                      ) : (
                        <Glyph name="star" token={icon.xl} color={color.border.muted} />
                      )}
                    </View>
                  </>
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
  pressedDisc: {
    position: 'absolute',
    top: (size.control.row - PRESSED_DISC.diameter) / 2 + PRESSED_DISC.opticalOffsetY,
    left: (size.control.row - PRESSED_DISC.diameter) / 2,
    width: PRESSED_DISC.diameter,
    height: PRESSED_DISC.diameter,
    borderRadius: PRESSED_DISC.diameter / 2,
    backgroundColor: state.pressed.surface,
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
