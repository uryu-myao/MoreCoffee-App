import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Glyph from '../components/base/Glyph';
import { resolveTextStyle } from '../theme/fonts';
import {
  color,
  component,
  icon,
  layout,
  shape,
  size,
  space,
  spacing,
  state,
  textStyle,
  texture,
} from '../theme/tokens';

/**
 * Validator for tokens.ts: renders every colour token, every text style, the
 * spacing primitives and the icon pairs straight from the token object, so a
 * wrong value shows up here before it shows up on a screen.
 */

const isColor = (v) => typeof v === 'string' && /^(#|rgba?\()/.test(v);

/** Flatten nested token groups into [path, value] pairs for every colour leaf. */
function collectColors(node, path, out) {
  Object.entries(node).forEach(([key, value]) => {
    // `css` is the authoring reference string; `texture` inside component.axis
    // re-embeds the texture token, which is already listed on its own.
    if (key === 'css' || (key === 'texture' && path.length > 1)) return;
    const next = [...path, key];
    if (isColor(value)) out.push([next.join('.'), value]);
    else if (value && typeof value === 'object' && !Array.isArray(value)) collectColors(value, next, out);
  });
  return out;
}

const COLOR_GROUPS = [
  ['color', collectColors(color, ['color'], [])],
  ['state', collectColors(state, ['state'], [])],
  ['texture', collectColors(texture, ['texture'], [])],
  ['component', collectColors(component, ['component'], [])],
];

const SAMPLE = {
  displayLg: 'Log a cup',
  displaySm: 'My shelf',
  numeralHero: '128',
  numeralInline: '08:00 · 92° · 4.5',
  title: 'Ethiopia Guji',
  label: 'Would order again',
  body: 'Cooled down it turned into iced tea, bright and clean.',
  bodySm: 'Blue Bottle · day 7, drink now',
  meta: '250 m away · your 4th visit',
  labelCaps: 'I made it',
  labelEyebrow: 'How was it?',
  buttonCaps: 'Save this cup',
  weekday: 'W',
  inlineAction: 'Go to first',
};

function specLine(t) {
  const lh = t.lineHeight ?? '—';
  const ls = t.letterSpacing ? ` · ls ${t.letterSpacing}` : '';
  const tf = t.textTransform ? ` · ${t.textTransform}` : '';
  return `${t.fontFamily} ${t.fontSize}/${lh} · ${t.fontWeight}${ls}${tf}`;
}

function Heading({ children }) {
  return <Text style={[resolveTextStyle(textStyle.labelEyebrow), styles.heading]}>{children}</Text>;
}

export default function TokenSheet() {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      {COLOR_GROUPS.map(([group, entries]) => (
        <View key={group} style={styles.section}>
          <Heading>{`Colour · ${group} (${entries.length})`}</Heading>
          {entries.map(([name, value]) => (
            <View key={name} style={styles.colorRow}>
              <View style={[styles.swatch, { backgroundColor: value }]} />
              <View style={styles.colorText}>
                <Text style={[resolveTextStyle(textStyle.meta), styles.ink]}>{name}</Text>
                <Text style={[resolveTextStyle(textStyle.bodySm), styles.muted]}>{value}</Text>
              </View>
            </View>
          ))}
        </View>
      ))}

      <View style={styles.section}>
        <Heading>{`Text styles (${Object.keys(textStyle).length})`}</Heading>
        {Object.entries(textStyle).map(([name, t]) => (
          <View key={name} style={styles.textRow}>
            <Text style={[resolveTextStyle(textStyle.meta), styles.muted]}>
              {`${name} — ${specLine(t)}`}
            </Text>
            <Text style={[resolveTextStyle(t), styles.ink]}>
              {SAMPLE[name]}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Heading>{`Spacing primitives (${Object.keys(space).length})`}</Heading>
        {Object.entries(space).map(([name, value]) => (
          <View key={name} style={styles.spaceRow}>
            <View style={[styles.spaceBar, { width: value }]} />
            <Text style={[resolveTextStyle(textStyle.meta), styles.muted]}>{`space.${name} — ${value}`}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Heading>Icon pairs (5 stroke + 2 fill)</Heading>
        {['xs', 'sm', 'md', 'lg', 'xl'].map((name) => (
          <View key={name} style={styles.iconRow}>
            <Glyph name="check" token={icon[name]} color={color.icon.default} />
            <Glyph name="chevronRight" token={icon[name]} color={color.icon.default} />
            <Glyph name="pin" token={icon[name]} color={color.icon.accent} />
            <Text style={[resolveTextStyle(textStyle.meta), styles.muted]}>
              {`icon.${name} — ${icon[name].size} / ${icon[name].strokeWidth}`}
            </Text>
          </View>
        ))}
        {['sm', 'xl'].map((name) => (
          <View key={name} style={styles.iconRow}>
            <Glyph name="star" token={icon.fill[name]} filled />
            <Text style={[resolveTextStyle(textStyle.meta), styles.muted]}>
              {`icon.fill.${name} — ${icon.fill[name].size} · ${icon.fill[name].color}`}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: layout.gutter,
    paddingBottom: layout.screen.bottom,
    gap: space[28],
  },
  section: {
    gap: spacing.gap.row,
  },
  heading: {
    color: color.text.accent,
  },
  ink: {
    color: color.text.primary,
  },
  muted: {
    color: color.text.muted,
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.gap.section,
  },
  swatch: {
    width: size.field.height,
    height: size.field.height,
    borderWidth: shape.borderWidth.divider,
    borderColor: color.border.soft,
  },
  colorText: {
    flex: 1,
    gap: spacing.gap.tight,
  },
  textRow: {
    gap: spacing.gap.tight,
    paddingBottom: spacing.gap.row,
    borderBottomWidth: shape.borderWidth.divider,
    borderBottomColor: color.divider.hairline,
  },
  spaceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.gap.section,
  },
  spaceBar: {
    height: space[8],
    backgroundColor: color.text.primary,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.gap.section,
  },
});
