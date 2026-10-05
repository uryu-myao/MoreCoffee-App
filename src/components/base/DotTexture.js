import { memo } from 'react';
import { StyleSheet } from 'react-native';
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
