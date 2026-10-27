import { memo, useMemo } from 'react';
import { Animated, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, Pattern, Rect } from 'react-native-svg';
import { texture } from '../../theme/tokens';

const { dot } = texture;

/**
 * The page's dot texture (texture.dot, design-system.md §2): a dot.dotRadius
 * dot centred in a dot.tileWidth × dot.tileHeight tile — CSS radial-gradient
 * centres by default, so the source's dot sits at the tile centre.
 *
 * One SVG <Pattern> filling its parent, behind everything. It takes no props
 * and is memoised, so it never re-renders on scroll; it is placed outside any
 * ScrollView, so it never moves with content. Touches pass through.
 * Opaque surfaces (cards, panels, the bottom bar) cover it.
 */
function DotTexture() {
  return (
    <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
      <Defs>
        <Pattern id="pageDots" patternUnits="userSpaceOnUse" width={dot.tileWidth} height={dot.tileHeight}>
          <Circle cx={dot.tileWidth / 2} cy={dot.tileHeight / 2} r={dot.dotRadius} fill={dot.color} />
        </Pattern>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#pageDots)" />
    </Svg>
  );
}

export default memo(DotTexture);

/**
 * The same texture inside an opaque block that moves over the page (2a's
 * pinned chips and headings, 2026-10-24), so the block hides what passes
 * under it yet reads as the page itself. `y` is the block's top in the
 * page's coordinates (an Animated value, from the screen's top); the
 * pattern moves back by y mod one tile, so its dots land on the page's.
 * The block must start at the page's left edge and clip (overflow hidden):
 * the pattern overhangs it by one tile below. The block keeps its own
 * surface.ground fill under the dots.
 */
export function AlignedDotTexture({ y }) {
  const back = useMemo(() => Animated.multiply(Animated.modulo(y, dot.tileHeight), -1), [y]);
  return (
    <Animated.View pointerEvents="none" style={[styles.aligned, { transform: [{ translateY: back }] }]}>
      <DotTexture />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  aligned: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: -dot.tileHeight,
  },
});
