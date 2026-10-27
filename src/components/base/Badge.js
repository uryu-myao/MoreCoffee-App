import { StyleSheet, View } from 'react-native';
import { color, icon, space, spacing } from '../../theme/tokens';
import Glyph from './Glyph';
import Text from './Text';

/**
 * A chip that labels, never acts (design-system.md §9 Badge). Square, filled,
 * no border; uppercase label.eyebrow (the source's 11/700/.06em folds to it).
 *
 *   tone       neutral | accent | success | info | raised | selected —
 *              color.badge.bg.* with its paired color.badge.fg.*
 *   placement  inline (badge.inline, inside a list row) |
 *              standalone (badge.standalone, alone on a surface)
 *   icon       optional leading Glyph (icon.stamp, the label's colour, gap 6):
 *              the ⓘ of a status stamp that opens an explanation (15a,
 *              Design Round 8; the stamp's button is DnaStamp, the Badge
 *              itself still never acts). The left padding is 2 less, to
 *              balance the glyph. Status words only, never plain labels.
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

export default function Badge({ label, tone = 'neutral', placement = 'inline', icon: glyph }) {
  return (
    <View
      style={[
        styles.badge,
        styles[placement],
        glyph && [styles.withIcon, { paddingLeft: styles[placement].paddingHorizontal - space[2] }],
        { backgroundColor: color.badge.bg[tone] },
      ]}>
      {glyph ? <Glyph name={glyph} token={icon.stamp} color={FG[tone]} /> : null}
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
  withIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[6],
  },
});
