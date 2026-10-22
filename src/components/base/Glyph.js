import Svg, { Circle, Path, Rect } from 'react-native-svg';

/**
 * Glyph geometry copied verbatim from the design source (24×24 viewBox).
 * Every glyph is stroke-based except `star`, which is the one fill glyph.
 */
const SHAPES = {
  check: [<Path key="p" d="M5 12.5l4.5 4.5L19 7" />],
  search: [<Circle key="c" cx="11" cy="11" r="6.5" />, <Path key="p" d="M16 16l4.5 4.5" />],
  chevronRight: [<Path key="p" d="M9 6l6 6-6 6" />],
  chevronLeft: [<Path key="p" d="M15 6l-6 6 6 6" />],
  close: [<Path key="p" d="M6 6l12 12M18 6L6 18" />],
  // 2a's filter button (opens 2b), verbatim; drawn at icon.md (18 / 2.2) as in 2a.
  filter: [<Path key="p" d="M4 6h16M7 12h10M10 18h4" />],
  plus: [<Path key="a" d="M12 6v12" />, <Path key="b" d="M6 12h12" />],
  alert: [<Path key="a" d="M12 7v6" />, <Path key="b" d="M12 16.5h.01" />],
  // 15a's ⓘ on a status stamp (Design Round 8), verbatim.
  info: [<Circle key="c" cx="12" cy="12" r="9.5" />, <Path key="a" d="M12 11v6" />, <Path key="b" d="M12 7.2v.1" />],
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
  // 3d's unopened bag (2026-10-17): the bag, its seal across the top.
  sealed: [<Rect key="r" x="5" y="4" width="14" height="17" rx="1" />, <Path key="p" d="M5 8h14" />],
  bag: [<Path key="a" d="M4 9h16l-1 11H5z" />, <Path key="b" d="M9 9V6a3 3 0 0 1 6 0v3" />],
  // 10a's placeholder cup (Design 2026-10-12), verbatim.
  cup: [
    <Path key="a" d="M4 8h12.5v4a6.25 6.25 0 0 1-12.5 0z" />,
    <Path key="b" d="M16.5 9.5h1.25a2.5 2.5 0 0 1 0 5H16" />,
    <Path key="c" d="M3 20.5h15" />,
  ],
  star: [<Path key="p" d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />],
  // 6a's My shelf rows and 6b's Export my cups (2026-10-21), verbatim.
  dripper: [<Path key="a" d="M5 4h11l-1 6a5 5 0 0 1-9 0z" />, <Path key="b" d="M16 5h2.5a2.5 2.5 0 0 1 0 5H16" />, <Path key="c" d="M4 20h13" />],
  beanBag: [<Path key="a" d="M6 3h12v5a6 6 0 0 1-2 4.5V21H8v-8.5A6 6 0 0 1 6 8z" />, <Path key="b" d="M9 7h6" />],
  download: [<Path key="a" d="M12 4v11" />, <Path key="b" d="M7 11l5 5 5-5" />, <Path key="c" d="M4 20h16" />],
  // beanFreshness's clock (3d / 4b), verbatim.
  clock: [<Circle key="c" cx="12" cy="12" r="9" />, <Path key="p" d="M12 7v5l3.5 2" />],
  // 3g's Delete this bag (the bin), verbatim.
  trash: [<Path key="a" d="M5 7h14" />, <Path key="b" d="M9 7V4h6v3" />, <Path key="c" d="M7 7l1 13h8l1-13" />],
  // 2c's edit button (the pencil), verbatim.
  pencil: [<Path key="a" d="M4 20h4l10-10-4-4L4 16z" />, <Path key="b" d="M14 6l4 4" />],
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
/** Glyphs drawn with square caps and mitred joins (10a: the placeholder cup matches the zero-radius shapes). */
const SQUARE = new Set(['cup']);

export default function Glyph({ name, token, color, filled = false }) {
  const square = SQUARE.has(name);
  const paint = filled
    ? { fill: token.color, stroke: 'none' }
    : {
        fill: 'none',
        stroke: color,
        strokeWidth: token.strokeWidth,
        strokeLinecap: square ? 'square' : 'round',
        strokeLinejoin: square ? 'miter' : 'round',
      };

  return (
    <Svg width={token.size} height={token.size} viewBox="0 0 24 24" {...paint}>
      {SHAPES[name]}
    </Svg>
  );
}
