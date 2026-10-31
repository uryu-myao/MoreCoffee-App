import { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import DashedRule from '../components/base/DashedRule';
import IconButton from '../components/base/IconButton';
import SectionLabel from '../components/base/SectionLabel';
import Text from '../components/base/Text';
import { TASTE_AXES } from '../constants/tasteAxes';
import { useDatabase } from '../data/DatabaseProvider';
import { loadDnaBuilt, onCupsChanged } from '../data/repository';
import { DNA_TUNING } from '../data/tasteDna';
import { color, dashed, layout, shape, size, space, spacing } from '../theme/tokens';
import ScreenFrame from './ScreenFrame';
import { cupsLabel } from './TasteDnaScreen';

/**
 * 8g — How my DNA is built, pushed over the tabs and the bar (ShellStack
 * 'dnaBuilt', 2026-10-30). Reached from 8f's footer, 6b's row on Profile and
 * 15b's way on (Home's and 8f's, not 5c's).
 *
 *   header    compact, Back, "How it is built" (8g), as 8f's.
 *   opening   8g's two lines as drawn (display.lg, then body): they hold in V1.
 *   My numbers  not in the mock (Uryu, 2026-10-30; Design Round 17, B2): one
 *            row per axis with its slider notes, then the cups the profile
 *            stands on. Numbers before the rules, never mixed into them.
 *   rules    8g's list look: a 2px ink rule over rows split by dashed
 *            dividerSoft, each a square bullet, a bold line and one line
 *            under it. The words are ours (Round 17, B1): 8g's four
 *            described rules V1 doesn't have (taste-dna.md; Round 17, A2).
 *
 * Not built: "Read my words" (My words never shape the profile in V1,
 * gaps.md 31) and "Reset my taste DNA" with its line (V1.5).
 *
 * The bullet is SectionLabel's (size.dot.bullet, 6); 8g draws 9, which has
 * no token.
 */

/**
 * TODO(copy, PROVISIONAL): Design Round 17, B1. Each line is checked against
 * taste-dna.md and DNA_TUNING: 5★ 3.0 / 3★ 1.0 is "three times"; a 90-day
 * half-life halves at three months and quarters at six; wordShareCap 1/3;
 * lockIn 10. Change the words with the numbers.
 */
const RULES = [
  {
    title: 'Higher-rated cups weigh more',
    line: 'A 5★ cup counts three times a 3★. Low ratings count too: they record what you tasted, not what you liked.',
  },
  {
    title: 'Recent cups weigh more',
    line: "A cup counts half as much after three months. Rated the same, today's cup pulls four times as hard as one from six months ago. It moves only when your cups do, never with time alone.",
  },
  {
    title: 'Each axis on its own',
    line: "An axis you skip isn't counted as the middle; it isn't counted. Roast is the roast you tasted, not the one on the bag.",
  },
  {
    title: 'Flavour tags nudge, sliders decide',
    line: "Peach leans brighter and sweeter. Tags make up at most a third of an axis. Your own words don't count.",
  },
  {
    title: 'Ten notes per axis to lock in',
    line: "Each axis needs ten slider notes; tags don't count. Once locked, it stays locked, unless you delete cups.",
  },
];

const notesLabel = (n) => (n === 1 ? '1 note' : `${n} notes`);

/**
 * TODO(copy, PROVISIONAL): Design Round 17, B2. "N more to lock in" only
 * while the profile is Early signs: after the lock, an axis first noted later
 * shows its notes alone, so the page never contradicts the Locked in stamp.
 */
function axisLine(n, state) {
  if (n === 0) return 'Not noted yet';
  if (n >= DNA_TUNING.lockIn || state === 'locked') return notesLabel(n);
  return `${notesLabel(n)} · ${DNA_TUNING.lockIn - n} more to lock in`;
}

/** "From 47 cups. 2 had nothing noted, so they don't count." (PROVISIONAL, Round 17, B2) */
function cupsLine(counted, idle) {
  const from = counted ? `From ${cupsLabel(counted)}.` : 'No cups count yet.';
  if (!idle) return from;
  return `${from} ${idle} had nothing noted, so ${idle === 1 ? "it doesn't" : "they don't"} count.`;
}

function MyNumbers({ dna, idle }) {
  return (
    <View style={styles.section}>
      {/* TODO(copy, PROVISIONAL): the heading is ours (Round 17, B2). */}
      <SectionLabel variant="plain" label="My numbers" />
      <View style={styles.card}>
        {TASTE_AXES.map((a) => {
          const axis = dna.axes[a.key];
          const line = axisLine(axis.n, dna.state);
          return (
            <View
              key={a.key}
              style={styles.axis}
              accessible
              accessibilityLabel={[a.name, line, axis.capped ? 'Tags are at their limit here' : null].filter(Boolean).join(', ')}>
              <View style={styles.axisRow}>
                <Text variant="label" color="primary">
                  {a.name}
                </Text>
                <Text variant="meta" color={axis.n ? 'accent' : 'muted'} style={styles.axisValue}>
                  {line}
                </Text>
              </View>
              {axis.capped ? (
                <Text variant="bodySm" color="muted">
                  Tags are at their limit here.
                </Text>
              ) : null}
            </View>
          );
        })}
        <DashedRule token={dashed.dividerSoft} />
        <Text variant="bodySm" color="secondary">
          {cupsLine(dna.cups, idle)}
        </Text>
      </View>
    </View>
  );
}

export default function DnaBuiltScreen({ onBack }) {
  const db = useDatabase();
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () =>
      loadDnaBuilt(db).then(setData, (error) => {
        console.error('[dna] could not read', error);
        Alert.alert("Couldn't read your taste DNA", String(error?.message ?? error));
      });
    load();
    return onCupsChanged(load);
  }, [db]);

  return (
    <ScreenFrame scroll compact title="How it is built" leading={<IconButton icon="chevronLeft" accessibilityLabel="Back" onPress={onBack} />}>
      <View style={styles.body}>
        <View style={styles.head}>
          <Text variant="displayLg" color="primary">
            Nothing here is a guess about you.
          </Text>
          <Text variant="body" color="secondary">
            Your profile is arithmetic on cups you logged. No taste quiz, no crowd averages.
          </Text>
        </View>
        {data ? <MyNumbers dna={data.dna} idle={data.idle} /> : null}
        <View style={styles.rules}>
          {RULES.map((rule, i) => (
            <View key={rule.title}>
              {i > 0 ? <DashedRule token={dashed.dividerSoft} /> : null}
              <View style={styles.rule} accessible accessibilityLabel={`${rule.title}. ${rule.line}`}>
                <View style={styles.bullet} />
                <View style={styles.ruleText}>
                  <Text variant="label" color="primary">
                    {rule.title}
                  </Text>
                  <Text variant="body" color="secondary">
                    {rule.line}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: spacing.gap.axis,
    paddingBottom: layout.screen.bottom,
  },
  head: {
    gap: spacing.gap.row,
  },
  section: {
    gap: spacing.gap.row,
  },
  // 8f's axes card: 2px ink on raised.
  card: {
    gap: spacing.gap.section,
    borderWidth: shape.borderWidth.box,
    borderColor: color.border.strong,
    backgroundColor: color.surface.raised,
    paddingVertical: spacing.inset.container.v,
    paddingHorizontal: spacing.inset.container.h,
  },
  axis: {
    gap: spacing.gap.tight,
  },
  axisRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.gap.row,
  },
  axisValue: {
    flex: 1,
    textAlign: 'right',
  },
  // 8g: a 2px ink rule over the list, no frame around it.
  rules: {
    borderTopWidth: shape.borderWidth.box,
    borderTopColor: color.border.strong,
  },
  rule: {
    flexDirection: 'row',
    gap: space[12],
    paddingVertical: space[16],
  },
  bullet: {
    width: size.dot.bullet,
    height: size.dot.bullet,
    // centred on the bold line's first line (label: 15, ~18 tall)
    marginTop: space[6],
    backgroundColor: color.marker.required,
  },
  ruleText: {
    flex: 1,
    gap: spacing.gap.tight,
  },
});
