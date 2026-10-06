/**
 * MoreCoffee design tokens — React Native.
 *
 * Reverse-extracted from 30 shipped screens (see design-system.md).
 * Source of truth: process/evidence.md · Date: 2026-09-20
 *
 * Conventions:
 *  - Every px value is a plain `number` (RN takes unitless numbers).
 *  - lineHeight is absolute px, already converted from the authored multiplier.
 *  - letterSpacing is absolute px, already converted from the authored em value.
 *  - Values marked UNDECLARED had no line-height in the source; nothing is invented.
 *    Omit the property and let the platform default apply.
 *  - No CSS variables, no Tailwind config, no em, no unitless line heights.
 */

export const color = {
  text: {
    primary: '#273D22',
    secondary: '#5C5049',
    muted: '#6B5D55',
    accent: '#9E5202',
    accentStrong: '#8A4602',
    link: '#05639C',
    success: '#4A6640',
    onInverse: '#F4EDEA',
    onAction: '#FFFFFF',
  },
  surface: {
    ground: '#F4EDEA',
    raised: '#FFFCFA',
    sunken: '#EFE4DC',
    inverse: '#273D22',
    muted: '#E4D6CC',
    mutedStrong: '#D9C7BB',
    mutedDark: '#CBB6A8',
  },
  border: {
    strong: '#273D22',
    muted: '#C8BCB4',
    soft: '#D8C9BF',
    subtle: '#E4D6CC',
    medium: '#B3A69E',
    accent: '#8A4602',
  },
  badge: {
    bg: {
      neutral: '#EDE4DF',
      accent: '#F1E3D6',
      success: '#E2EADC',
      info: '#E6EFF5',
      raised: '#FFFCFA',
      selected: '#273D22',
    },
    fg: {
      neutral: '#5C5049',
      accent: '#8A4602',
      success: '#2F4A28',
      info: '#0A5E92',
      selected: '#F4EDEA',
    },
  },
  icon: {
    default: '#273D22',
    muted: '#6B5D55',
    accent: '#9E5202',
    onAction: '#FFFFFF',
    rating: '#C9821A',
  },
  action: {
    bg: '#067BC2',
    fg: '#FFFFFF',
  },
  /** Text cursor. The only focus expression in the product. */
  caret: '#067BC2',
  /** Square bullet on a section heading. */
  marker: {
    required: '#9E5202',
    optional: '#C8BCB4',
  },
  /** divider.hairline is an alias of border.subtle — one hairline tier exists. */
  divider: {
    hairline: '#E4D6CC',
    hairlineStrong: '#D8C9BF',
  },
  /** Modal sheet scrim. The page behind it also drops to opacity 0.45. */
  scrim: 'rgba(39, 61, 34, 0.42)',
} as const;

/** Mechanism-bound state colors (class A: promoted regardless of frequency). */
export const state = {
  error: {
    border: '#9E5202',
    surface: '#EFD9C2',
    text: '#8A4602',
    shadow: { offsetX: 4, offsetY: 4, blur: 0, color: '#9E5202' },
    dashedBorder: { width: 1.5, style: 'dashed', color: '#9E5202' },
  },
  /** Archived bag thumbnails. RN has no style filter — see OQ-5. */
  archived: { filter: 'saturate(0.7)' },
  /** Scroll fade above a floating bar: transparent stop -> ground. */
  fade: { from: 'rgba(244, 237, 234, 0)', to: '#F4EDEA', height: 30 },
  /**
   * Pressed (Hard Rule, design-system.md §1) depends on whether the element has
   * a surface. With one (a fill, frame or box), the fill steps one tier darker:
   * surface / action below. Without one (a bare glyph), it scales: scale below,
   * over motion.press. Never opacity in either case — it would wash out
   * HardShadow and the borders on the warm ground.
   */
  pressed: {
    /** raised / ground / transparent-over-raised fills. Alias of surface.muted. */
    surface: color.surface.muted,
    /**
     * action.bg fill. Same value as color.text.link but a separate role (fill vs
     * link text) — cf. border.subtle and texture sharing #E4D6CC. Never merge.
     */
    action: '#05639C',
    /**
     * Surface-less elements (bare glyphs, e.g. the bottom-bar tab icons). 0.88
     * because ~0.95 is not perceptible on a 20–24px glyph. Visual only: the
     * touch area does not scale.
     */
    scale: 0.88,
  },
} as const;

/**
 * Two textures, one color, different geometry.
 * RN has no background-image: rebuild with react-native-svg <Pattern>. See OQ-2.
 * `base` is passed at use time (texture.rule sits on both raised and ground).
 */
export const texture = {
  dot: {
    color: '#E4D6CC',
    dotRadius: 1,
    tileWidth: 7,
    tileHeight: 7,
    css: 'radial-gradient(#E4D6CC 1px, transparent 1px) / 7px 7px',
  },
  rule: {
    color: '#E4D6CC',
    lineWidth: 1.5,
    spacingPercent: 25,
    angleDeg: 90,
    css: 'repeating-linear-gradient(90deg, #E4D6CC 0 1.5px, transparent 1.5px 25%)',
  },
} as const;

/**
 * 15 composite text styles. Do not patch a single property —
 * that is the signal to define a new style.
 */
export const textStyle = {
  displayLg:     { fontFamily: 'Instrument Serif', fontSize: 40, fontWeight: '400', lineHeight: 41 },
  displaySm:     { fontFamily: 'Instrument Serif', fontSize: 30, fontWeight: '400', lineHeight: 31 },
  numeralHero:   { fontFamily: 'Instrument Serif', fontSize: 96, fontWeight: '400', lineHeight: 79 },
  numeralInline: { fontFamily: 'Instrument Serif', fontSize: 22, fontWeight: '400', lineHeight: 22 },
  /**
   * The tasting-note input (5b "My words"): the product's only italic. Pair
   * with color.text.muted. Promoted from exceptions.md E-3 (2026-10-06).
   */
  note:          { fontFamily: 'Instrument Serif', fontSize: 20, fontWeight: '400', fontStyle: 'italic', lineHeight: 28 },

  /** lineHeight UNDECLARED in source */
  title:         { fontFamily: 'Archivo', fontSize: 16, fontWeight: '700' },
  /** lineHeight UNDECLARED in source */
  label:         { fontFamily: 'Archivo', fontSize: 15, fontWeight: '700' },
  body:          { fontFamily: 'Archivo', fontSize: 14, fontWeight: '500', lineHeight: 21 },
  bodySm:        { fontFamily: 'Archivo', fontSize: 12, fontWeight: '500', lineHeight: 18 },
  meta:          { fontFamily: 'Archivo', fontSize: 12, fontWeight: '600', lineHeight: 17 },
  /** lineHeight UNDECLARED · 0.08em x 12 */
  labelCaps:     { fontFamily: 'Archivo', fontSize: 12, fontWeight: '700', letterSpacing: 0.96, textTransform: 'uppercase' },
  /** lineHeight UNDECLARED · 0.16em x 10 */
  labelEyebrow:  { fontFamily: 'Archivo', fontSize: 10, fontWeight: '700', letterSpacing: 1.6, textTransform: 'uppercase' },
  /** lineHeight UNDECLARED · 0.06em x 16 */
  buttonCaps:    { fontFamily: 'Archivo', fontSize: 16, fontWeight: '700', letterSpacing: 0.96, textTransform: 'uppercase' },
  /**
   * Shares family/size/weight with labelEyebrow but is a separate style:
   * content is already a single capital letter (no textTransform) and the
   * letter spacing is 8x smaller to keep one glyph optically centred.
   * lineHeight UNDECLARED · 0.02em x 10
   */
  weekday:       { fontFamily: 'Archivo', fontSize: 10, fontWeight: '700', letterSpacing: 0.2 },
  /**
   * The only "this word is tappable" expression. Pair with color.text.link.
   * textDecorationColor is a separate RN prop — verify it inherits the text color.
   * lineHeight UNDECLARED · 0.08em x 11
   */
  inlineAction:  { fontFamily: 'Archivo', fontSize: 11, fontWeight: '700', letterSpacing: 0.88, textTransform: 'uppercase', textDecorationLine: 'underline' },
} as const;

/**
 * Primitive spacing scale — 9 steps. Implementation vocabulary only;
 * designers pick from `spacing` below.
 * NOT a 4pt grid: 14 is a deliberate exception (exact midpoint of 12 and 16,
 * so its nearest step is not uniquely determined). Do not normalise. Do not add steps.
 */
export const space = {
  2: 2, 4: 4, 6: 6, 8: 8, 12: 12, 14: 14, 16: 16, 20: 20, 28: 28,
} as const;

/** Semantic spacing. Two axes, because padding is authored as `v h`. */
export const spacing = {
  inset: {
    container: { v: space[14], h: space[16] },
    control:   { v: space[14], h: space[16] },
  },
  badge: {
    /** chips that sit inside a list row */
    inline:     { v: space[4], h: space[8] },
    /** chips that sit alone on a surface */
    standalone: { v: space[8], h: space[12] },
  },
  gap: {
    /** within one meaning unit (label + value, heading + caption) */
    tight:   space[4],
    /** between items */
    row:     space[8],
    /** between sections, between cards, and inside an enclosed surface */
    section: space[12],
    /** taste-axis groups only — an internal rhythm of the axis component */
    axis:    space[20],
  },
  /**
   * margin.container has NO default: 66 uses across 13 values, mode = 20%.
   * Pick a primitive explicitly at the point of use. See OQ-9.
   */
} as const;

/** Screen chrome — roughly one use per screen. Not part of the component scale. */
export const layout = {
  gutter: 22,
  screen: { top: 60, bottom: 34 },
  section: { gap: 56 },
  fade: { top: 30 },
  empty: { block: 100 },
} as const;

/** Optical compensations, kept verbatim. Never snap these to the scale. */
export const opticalMargin = {
  nudge: -2,
  handle: -6,
  reset: [-12, -14],
} as const;

/** Fixed element dimensions. NEVER subject to the spacing scale. */
export const size = {
  /** minimum hit area — 26 screens / 79 uses */
  tapTarget: 44,
  button: { primary: 56, compact: 40, small: 36 },
  control: { row: 52 },
  field: { height: 46 },
  /** list: the list row (2a). summary: the one-cup summary row (5b). */
  thumbnail: { list: 66, summary: 40 },
  avatar: 88,
  tabBar: { height: 60 },
  badge: { numeral: 22 },
  checkbox: 24,
  weekday: { column: 68 },
  axis: { rail: 20, needle: { w: 12, h: 30 } },
  meter: { track: 4 },
  marker: { line: { w: 2, h: 14 } },
  dot: { bullet: 6 },
  sheet: { handle: { w: 56, h: 5 } },
} as const;

/**
 * Icons are stroke-based and take currentColor.
 * Stroke width is inversely correlated with size — always use the pair.
 */
export const icon = {
  xs: { size: 14, strokeWidth: 3.4 },
  sm: { size: 16, strokeWidth: 2.6 },
  /** default */
  md: { size: 18, strokeWidth: 2.2 },
  lg: { size: 22, strokeWidth: 1.8 },
  /** decorative large glyph — stroke widens back */
  xl: { size: 38, strokeWidth: 2.0 },
  /** fill icons are a separate system: no stroke, fixed color, rating stars only */
  fill: {
    sm: { size: 14, color: color.icon.rating },
    xl: { size: 38, color: color.icon.rating },
  },
} as const;

/**
 * Hard shadows: blur 0, isotropic offset, single ink. Offset scales with the element.
 * RN cannot reproduce blur-0 shadows with standard props (Android elevation has no
 * zero-blur form). Layer an absolutely-positioned View, or draw with react-native-svg.
 * See OQ-6.
 */
export const shadow = {
  /** inline controls, 40-48px tall */
  control:  { offsetX: 3, offsetY: 3, blur: 0, color: color.text.primary },
  /** width-flexible or floating elements */
  floating: { offsetX: 4, offsetY: 4, blur: 0, color: color.text.primary },
  /** full-width primary buttons (h56, w100%) */
  primary:  { offsetX: 5, offsetY: 5, blur: 0, color: color.text.primary },
} as const;

/** Shape rules are absolute. */
export const shape = {
  /** 0 occurrences of border-radius across all 30 screens. */
  radius: 0,
  borderWidth: {
    /** the outline of a box */
    box: 2,
    /** an internal divider or weak frame */
    divider: 1.5,
  },
} as const;

/**
 * dashed = "a surface that is not real content" (never "draft").
 */
export const dashed = {
  /** an empty slot waiting to be filled — always a button */
  empty:         { width: 2, style: 'dashed', color: color.border.strong },
  emptyDisabled: { width: 2, style: 'dashed', color: color.border.muted },
  /** secondary line inside a card */
  dividerSoft:   { width: 1.5, style: 'dashed', color: color.border.soft },
  /** measuring rail / placeholder frame */
  track:         { width: 1.5, style: 'dashed', color: color.border.muted },
} as const;

/**
 * Two motions, one easing. CSS transitions do not exist in RN — reproduce with
 * Easing.bezier(...controlPoints). See OQ-7.
 *   expand  height expand / collapse, crossfades between states (the source's
 *           one motion, 5a)
 *   press   press feedback only (state.pressed.scale in and out). 340ms reads
 *           as lag under a finger. Same easing as expand.
 * Do not use press for expansion or expand for press feedback.
 */
export const motion = {
  expand: { duration: 340, controlPoints: [0.22, 0.61, 0.36, 1] as const },
  press: { duration: 100, controlPoints: [0.22, 0.61, 0.36, 1] as const },
} as const;

/** Tilted sticker badge. Format as `${rotation.sticker}deg` at use. */
export const rotation = {
  sticker: -3,
} as const;

/** Component anatomies whose parts are mechanism-bound. */
export const component = {
  /**
   * Elapsed time since a bag was opened: track + peak band + elapsed fill +
   * today marker, 4px tall. Single-directional, has a notion of completion.
   * todayMarker is intentionally one step darker than the fill it stands on.
   * peakBand's state dependence is UNRESOLVED — see OQ-3.
   */
  beanFreshness: {
    track: color.surface.muted,
    drinkNow: { peakBand: '#CFDCC8', elapsed: '#7E9675', todayMarker: '#4A6640' },
    pastPeak: { peakBand: '#E4D6CC', elapsed: '#C2B4AB', todayMarker: '#8C7E76' },
    height: size.meter.track,
  },
  /**
   * Taste axis slider: rail + needle (+ ghost + delta), 20px tall, bipolar,
   * NO fill. Readonly rails are dashed, the editable rail is solid —
   * consistent with the dashed semantics.
   */
  axis: {
    rail: {
      readonly: { ...dashed.track, background: color.surface.ground, texture: texture.rule },
      editable: { width: shape.borderWidth.box, style: 'solid', color: color.border.strong, background: color.surface.raised, texture: texture.rule },
      height: size.axis.rail,
    },
    needle: { ...size.axis.needle, background: color.surface.muted, borderColor: color.border.medium },
    /** previous value */
    ghost:  { w: 10, h: 10, borderColor: color.border.medium },
    /** movement since the last value */
    delta:  { height: 2, background: color.border.medium },
  },
  /**
   * Bottom tab bar, carried by the floating bar (design-system.md §9).
   * Four tab slots + one wider add slot, centred in the bar.
   * The two raw icon colours were missed by the original extraction (lowercase
   * hex in the source) and added 2026-10-04: 6 and 5 screens, see changelog.
   */
  tabBar: {
    slot: { w: 60, h: 40 },
    addSlot: { w: 68, h: 40 },
    icon: {
      active: color.action.bg,
      inactive: '#9B8F87',
      /** the calendar glyph's binding marks */
      accentInactive: '#C6BBD3',
      accentActive: color.text.primary,
    },
    /** the add button: ink square with a ground-coloured plus */
    add: { background: color.surface.inverse, mark: color.text.onInverse },
  },
} as const;

export const tokens = {
  color, state, texture, textStyle, space, spacing, layout, opticalMargin,
  size, icon, shadow, shape, dashed, motion, rotation, component,
} as const;

export default tokens;
