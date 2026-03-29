export const colors = {
  brand: {
    green: '#273D22',
    brown: '#9E5202',
    gold: '#BA7517',
    blue: '#067BC2',
    yellow: '#ECC30C',
    lightBlue: '#D6D3F0',
    cream: '#F4EDEA',
    white: '#FFFFFF',
  },

  text: {
    primary: '#273D22',
    secondary: '#6F6A64',
    muted: '#A39C95',
    inverse: '#FFFFFF',
    link: '#067BC2',
  },

  background: {
    page: '#F3EEEA',
    card: '#FFFFFF',
  },

  border: {
    default: '#D6D3F0',
    strong: '#067BC2',
  },

  chart: {
    primary: '#ECC30C',
    secondary: '#9E5202',
    grid: '#D9CCE5',
  },

  state: {
    success: '#BA7517',
    warning: '#ECC30C',
    info: '#067BC2',
    disabled: '#CFC7C1',
  },

  tab: {
    active: '#067BC2',
    inactive: '#C8BCD9',
    background: '#F8F5FA',
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

export const typography = {
  family: {
    regular: 'Poppins_400Regular',
    medium: 'Poppins_500Medium',
    semibold: 'Poppins_600SemiBold',
    bold: 'Poppins_700Bold',
  },
  size: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 28,
    '2xl': 32,
    '3xl': 40,
  },
  weight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: 1.1,
    normal: 1.4,
    relaxed: 1.6,
  },
} as const;

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  soft: {
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  hard: {
    light: {
      shadowColor: '#D6D3F0',
      shadowOpacity: 1,
      shadowRadius: 0,
      shadowOffset: { width: 0, height: 3 },
      elevation: 3,
    },
    dark: {
      shadowColor: '#273D22',
      shadowOpacity: 1,
      shadowRadius: 0,
      shadowOffset: { width: 0, height: 3 },
      elevation: 3,
    },
  },
} as const;

export const iconSize = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const;

export const layout = {
  screenPadding: 16,
  cardGap: 12,
  sectionGap: 20,
  listItemGap: 10,
  cardMinHeight: 120,
  bottomNavHeight: 72,
} as const;

export const semantic = {
  pageBg: colors.background.page,
  cardBg: colors.background.card,
  cardBorder: colors.border.default,

  title: colors.text.primary,
  body: colors.text.secondary,
  caption: colors.text.muted,

  primaryAction: colors.brand.blue,
  accentWarm: colors.brand.yellow,
  accentCoffee: colors.brand.brown,

  chartHighlight: colors.chart.primary,
  chartBar: colors.chart.secondary,
} as const;

export const textStyles = {
  screenTitle: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  sectionTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  cardTitle: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  body: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.regular,
    color: colors.text.secondary,
  },
  caption: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.regular,
    color: colors.text.muted,
  },
  metricLarge: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  button: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.text.inverse,
  },
} as const;
