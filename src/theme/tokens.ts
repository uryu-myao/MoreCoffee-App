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
  /**
   * Taste axis slider, L3 + H1 (2026-10-08): rail 260 wide × 28 tall, centred
   * in its card; handle 16 × 40 → 5 stops 61pt apart ((260 − 16) / 4). 260
   * (was 240) fits the pole labels at label.caps: Low + High sweetness are 245
   * together, leaving ~15 between them. rail
   * was 20 (the mock); railWidth and handle are new with this layout.
   * needle (12 × 30) is the display axis's, until AxisReadout replaces it.
   */
  axis: { rail: 28, railWidth: 260, handle: { w: 16, h: 40 }, needle: { w: 12, h: 30 } },
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
 * dashed never means "draft". It has two uses, kept apart (design-system.md §8):
 *   addSlot / addSlotInert   an entry for adding something (nothing in it yet)
 *   track                    the axis rail of a value the user did not enter
 * What they share — "not something the user has settled" — is not one rule.
 */
export const dashed = {
  /**
   * an entry for adding something, and pressable: the empty slots ("Add a
   * photo", "Add gear") and 5b's "Search" opener. Renamed from empty
   * (2026-10-07): "an entry you can add through" is what it is. Colour:
   * #6B5D55 (icon.muted's value, same value, border role), two steps lighter
   * than ink on review — the ink dashes read as noise. The label and glyph
   * keep their own colour, so the slot still reads as pressable. ΔE00 32.6
   * from addSlotInert's border.muted, so the two never blur.
   */
  addSlot:       { width: 2, style: 'dashed', color: color.icon.muted },
  /**
   * an add entry that cannot be pressed now (5d's blocked add button), or a
   * frame that is not a thing to press at all (2a's empty list frame)
   */
  addSlotInert:  { width: 2, style: 'dashed', color: color.border.muted },
  /** secondary line inside a card */
  dividerSoft:   { width: 1.5, style: 'dashed', color: color.border.soft },
  /** the axis rail of a value the user did not enter (axis.rail.derived) — rails only, since 2026-10-07 */
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

/**
 * Taste axis parts (design-system.md §9 Taste axis slider). Defined apart so
 * component.axis.state can pair them; read them through the state map, not
 * one by one.
 */
const axisRail = {
  /**
   * The slider's one rail, in every state (2026-10-07): a weak frame (1.5,
   * border.muted) on a ground track. The rail states nothing; the needle does.
   * Superseded: the empty (ink dashed) and entered (ink solid) rails.
   */
  track: { width: shape.borderWidth.divider, style: 'solid', color: color.border.muted, background: color.surface.ground, texture: texture.rule },
  /** computed or historical (1b 4a 4b 5c) — to be replaced by AxisReadout, then removed */
  derived: { ...dashed.track, background: color.surface.ground, texture: texture.rule },
} as const;

const axisNeedle = {
  /** a computed / historical value */
  derived: { ...size.axis.needle, background: color.surface.muted, borderColor: color.border.medium, borderWidth: shape.borderWidth.divider },
  /**
   * Nothing entered. Same values as derived, different meaning (intentional).
   * Its position — 50 — is a PLACEHOLDER, NOT A VALUE: never save it, never
   * read it as "the default is 50". An empty axis has no value (null).
   */
  empty: { ...size.axis.handle, background: color.surface.muted, borderColor: color.border.medium, borderWidth: shape.borderWidth.divider, grip: color.border.medium },
  /** The user's own value: accent fill, 2px ink. Its grip turns white — "changed". */
  entered: { ...size.axis.handle, background: color.icon.accent, borderColor: color.border.strong, borderWidth: shape.borderWidth.box, grip: color.icon.onAction },
  /**
   * While the finger is on it: icon.rating (#C9821A, the same value under a
   * handle role), so it reads as "entered, brighter", not a third state.
   * Settles to entered on release (motion.press). Grip in ink: not yet changed.
   */
  lit: { ...size.axis.handle, background: color.icon.rating, borderColor: color.border.strong, borderWidth: shape.borderWidth.box, grip: color.border.strong },
} as const;

/**
 * The short vertical grip at the handle's centre (2026-10-08, from Uryu's
 * sketch): the handle's stroke width, the readout marker's 14 tall. It turns
 * white once the axis has been changed (entered); before that it takes the
 * handle's own stroke colour.
 */
const axisGrip = { w: shape.borderWidth.box, h: 14 } as const;

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
   * NO fill.
   *
   * The rail shows where the value came from — not whether it can be edited,
   * and not whether there is one:
   *   entered  ink solid: a value the user decided, themselves, for this cup
   *   empty    ink dashed: no value yet, one to be entered (operable)
   *   derived  muted dashed: computed profile (1b, 4a, 4b) or history (5c);
   *            never operable
   * This carries a core promise: Taste DNA is arithmetic on your own records,
   * not a guess, and the UI must always let you tell what you put in from what
   * came out of it. So the rail is provenance, not decoration: never unify the
   * states. (The dashed-vs-solid rule now lives in §8; the slider uses one solid rail.)
   *
   * state: ONE axis state decides rail and needle together, so a wrong pairing
   * cannot be built. The slider's rail is the same in every state (2026-10-07);
   * the needle carries the state: empty (muted), lit (while touched — gold),
   * entered (accent). derived belongs to the display axis, to be replaced by
   * AxisReadout.
   */
  axis: {
    state: {
      derived: { rail: axisRail.derived, needle: axisNeedle.derived },
      empty:   { rail: axisRail.track, needle: axisNeedle.empty },
      lit:     { rail: axisRail.track, needle: axisNeedle.lit },
      entered: { rail: axisRail.track, needle: axisNeedle.entered },
    },
    rail: { height: size.axis.rail, width: size.axis.railWidth },
    grip: axisGrip,
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
