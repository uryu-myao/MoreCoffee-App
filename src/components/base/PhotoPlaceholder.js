import { StyleSheet, View } from 'react-native';
import { color, icon } from '../../theme/tokens';
import Glyph from './Glyph';

/**
 * Photo placeholder (Design 10a, 2026-10-12): how "no photo" looks wherever a
 * thumbnail is. There is no camera at this stage, so this is every cup's and
 * bag's look. Fill surface.mutedStrong (its role: placeholder thumbs), a cup
 * glyph in icon.muted (3.9:1 on the fill), no frame (a frame would read as a
 * slot to press), square caps. The glyph takes the icon token for the size:
 *   210 (2c's photo area) icon.xl 38 · 66 (2a) icon.lg 22 ·
 *   46 (5a, the picker, the shelf) icon.md 18 · 40 (5b) icon.sm 16.
 * Bags use the same cup for now (Design's open question: a bag glyph).
 *
 * Props: size (the square's side, from a size token)
 */
function tokenFor(size) {
  if (size >= 200) return icon.xl;
  if (size >= 60) return icon.lg;
  if (size >= 46) return icon.md;
  return icon.sm;
}

export default function PhotoPlaceholder({ size }) {
  return (
    <View style={[styles.box, { width: size, height: size }]} accessible={false}>
      <Glyph name="cup" token={tokenFor(size)} color={color.icon.muted} />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.surface.mutedStrong,
  },
});
