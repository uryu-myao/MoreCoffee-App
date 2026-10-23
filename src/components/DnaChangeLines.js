import { StyleSheet, View } from 'react-native';
import { TASTE_AXES } from '../constants/tasteAxes';
import { bandOf } from '../data/tasteDna';
import { spacing } from '../theme/tokens';
import Text from './base/Text';

/**
 * What one cup changed in Taste DNA, from its stored `dna_change` (never
 * recomputed). Shared by 5c and 2c's "Feeds my taste DNA". Copy: Design,
 * 2026-10-11 (design-missing.md 12).
 *
 *   moved        "Moved N points toward ‹pole›" — when the move rounds to 1
 *                point or more; largest first. A move that rounds to 0 is
 *                "nothing moved" (no separate wording).
 *   first value  "Starts at ‹step name›": a position, not a direction. A
 *                one-cup profile is that cup's value, so a step always exists.
 *   summary      "This cup pushed you ‹phrases›." — the two axes that moved
 *                most (never a first value), joined with "and" (Design Round
 *                12; Uryu kept the phrases below). The rest go unnamed: each
 *                moved axis has its own line under it. Ties keep the axes'
 *                order.
 *   nothing      "Your Taste DNA stays where it was — nothing on this cup
 *                moves it."
 */
const PHRASE = {
  acidity: { low: 'brighter', high: 'more bitter' },
  // Body and Roast both start "light": each takes its noun, or it reads
  // "lighter and lighter".
  body: { low: 'lighter-bodied', high: 'fuller-bodied' },
  roast: { low: 'toward lighter roasts', high: 'toward darker roasts' },
  sweetness: { low: 'less sweet', high: 'sweeter' },
};

const SUMMARY_AXES = 2;

export const NOTHING_MOVED = 'Your Taste DNA stays where it was — nothing on this cup moves it.';

/** [{ key, size, text, first, phrase }], largest move first, first values last. */
export function changeLines(change) {
  if (!change) return [];
  const lines = [];
  for (const axis of TASTE_AXES) {
    const before = change.before[axis.key]?.value ?? null;
    const after = change.after[axis.key]?.value ?? null;
    if (after == null) continue;
    if (before == null) {
      lines.push({ key: axis.key, size: -1, first: true, text: `Starts at ${axis.steps[bandOf(after)]}` });
      continue;
    }
    const points = Math.round(Math.abs(after - before));
    if (points < 1) continue;
    const up = after > before;
    lines.push({
      key: axis.key,
      size: points,
      text: `Moved ${points} ${points === 1 ? 'point' : 'points'} toward ${up ? axis.to : axis.from}`,
      phrase: PHRASE[axis.key][up ? 'high' : 'low'],
    });
  }
  return lines.sort((a, b) => b.size - a.size);
}

/** "This cup pushed you brighter and lighter-bodied." — or null when no axis moved. */
export function changeSummary(lines) {
  // lines come largest first, so the first two phrases are the two largest moves.
  const phrases = lines.filter((l) => l.phrase).slice(0, SUMMARY_AXES).map((l) => l.phrase);
  if (!phrases.length) return null;
  return `This cup pushed you ${phrases.join(' and ')}.`;
}

/** 2c: the summary (when something moved), then one line per axis. */
export default function DnaChangeLines({ change }) {
  const lines = changeLines(change);
  const summary = changeSummary(lines);
  return (
    <View style={styles.lines}>
      {lines.length ? (
        <>
          {summary ? (
            <Text variant="body" color="primary">
              {summary}
            </Text>
          ) : null}
          {lines.map((l) => (
            <Text key={l.key} variant="body" color="secondary">
              {l.text}
            </Text>
          ))}
        </>
      ) : (
        <Text variant="body" color="secondary">
          {NOTHING_MOVED}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  lines: {
    gap: spacing.gap.tight,
  },
});
