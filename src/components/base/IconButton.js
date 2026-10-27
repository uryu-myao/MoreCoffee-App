import { Pressable, StyleSheet } from 'react-native';
import { color, icon, shape, size, state } from '../../theme/tokens';
import Glyph from './Glyph';

/**
 * Square icon-only button — the header close / back control.
 * Source: 44×44, 2px ink outline on surface.raised, icon.md glyph — 3a–3f, 5a,
 * 5b, 5d, 5e, and the same button on 6d, 7a, 7b, 8e–8m where the caller adds
 * the opticalMargin.nudge (−2) at the point of use. The 1.5px border.muted and
 * badge.bg.accent variants (3b, 8e) are not built. 2a's filter button is this
 * ordinary one (drift D-24, 2026-10-09); 3b's ⋮ is under review.
 *
 * Pressed: the fill darkens to state.pressed.surface (Hard Rule, design-system.md §1).
 *
 * Props
 *   icon                Glyph name ('close', 'chevronLeft', …)
 *   accessibilityLabel  required — the button has no visible text
 *   onPress
 *   testOnly_pressed    force the pressed look (dev harness)
 */
export default function IconButton({ icon: iconName, accessibilityLabel, onPress, testOnly_pressed }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      testOnly_pressed={testOnly_pressed}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <Glyph name={iconName} token={icon.md} color={color.icon.default} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: size.tapTarget,
    height: size.tapTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: shape.borderWidth.box,
    borderColor: color.border.strong,
    backgroundColor: color.surface.raised,
  },
  pressed: {
    backgroundColor: state.pressed.surface,
  },
});
