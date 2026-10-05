import { StyleSheet, View } from 'react-native';
import { color, spacing } from '../../theme/tokens';
import Text from './Text';

/**
 * A chip that labels, never acts (design-system.md §9 Badge). Square, filled,
 * no border; uppercase label.eyebrow (the source's 11/700/.06em folds to it).
 *
 *   tone       neutral | accent | success | info | raised | selected —
 *              color.badge.bg.* with its paired color.badge.fg.*
 *   placement  inline (badge.inline, inside a list row) |
 *              standalone (badge.standalone, alone on a surface)
 *
 * Fixed copy only, on one line: it keeps its own width (flexShrink 0) rather
 * than wrapping, as the source's nowrap does. Long translated labels are
 * gaps.md 7.
 */
const FG = {
  neutral: color.badge.fg.neutral,
  accent: color.badge.fg.accent,
  success: color.badge.fg.success,
  info: color.badge.fg.info,
  raised: color.badge.fg.neutral,
  selected: color.badge.fg.selected,
};

export default function Badge({ label, tone = 'neutral', placement = 'inline' }) {
  return (
    <View style={[styles.badge, styles[placement], { backgroundColor: color.badge.bg[tone] }]}>
      <Text variant="labelEyebrow" color={FG[tone]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexShrink: 0,
    alignSelf: 'flex-start',
  },
  inline: {
    paddingVertical: spacing.badge.inline.v,
    paddingHorizontal: spacing.badge.inline.h,
  },
  standalone: {
    paddingVertical: spacing.badge.standalone.v,
    paddingHorizontal: spacing.badge.standalone.h,
  },
});
