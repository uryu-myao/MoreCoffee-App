import Svg, { Circle, Path, Rect } from 'react-native-svg';

/**
 * Glyph geometry copied verbatim from the design source (24×24 viewBox).
 * Every glyph is stroke-based except `star`, which is the one fill glyph.
 */
const SHAPES = {
  check: [<Path key="p" d="M5 12.5l4.5 4.5L19 7" />],
  chevronRight: [<Path key="p" d="M9 6l6 6-6 6" />],
  chevronLeft: [<Path key="p" d="M15 6l-6 6 6 6" />],
  close: [<Path key="p" d="M6 6l12 12M18 6L6 18" />],
  plus: [<Path key="a" d="M12 6v12" />, <Path key="b" d="M6 12h12" />],
  alert: [<Path key="a" d="M12 7v6" />, <Path key="b" d="M12 16.5h.01" />],
  pin: [
    <Path key="p" d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />,
    <Circle key="c" cx="12" cy="10" r="2.4" />,
  ],
  can: [<Rect key="r" x="7" y="4" width="10" height="17" rx="2" />, <Path key="p" d="M7 9h10" />],
  camera: [
    <Path key="p" d="M3 8.5A1.5 1.5 0 0 1 4.5 7h3L9 4.5h6L16.5 7h3A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5z" />,
    <Circle key="c" cx="12" cy="12.5" r="3.2" />,
  ],
  arrowRight: [<Path key="a" d="M5 12h14" />, <Path key="b" d="M13 6l6 6-6 6" />],
  bag: [<Path key="a" d="M4 9h16l-1 11H5z" />, <Path key="b" d="M9 9V6a3 3 0 0 1 6 0v3" />],
  star: [<Path key="p" d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />],
};

export const GLYPH_NAMES = Object.keys(SHAPES);

/**
 * Props
 *   name     key of SHAPES
 *   token    an icon token: { size, strokeWidth } for stroke glyphs,
 *            or { size, color } for fill glyphs (icon.fill.*)
 *   color    stroke colour for stroke glyphs (ignored when filled)
 *   filled   render as a fill glyph using token.color
 */
export default function Glyph({ name, token, color, filled = false }) {
  const paint = filled
    ? { fill: token.color, stroke: 'none' }
    : {
        fill: 'none',
        stroke: color,
        strokeWidth: token.strokeWidth,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      };

  return (
    <Svg width={token.size} height={token.size} viewBox="0 0 24 24" {...paint}>
      {SHAPES[name]}
    </Svg>
  );
}
