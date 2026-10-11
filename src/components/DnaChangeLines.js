import { StyleSheet, View } from 'react-native';
import { TASTE_AXES } from '../constants/tasteAxes';
import { spacing } from '../theme/tokens';
import Text from './base/Text';

/**
 * What one cup changed in Taste DNA, from its stored `dna_change` (never
 * recomputed): one line per moved axis. Shared by 5c and 2c's "Feeds my taste
 * DNA" (decided 2026-10-11).
 *
 *   moved        "Moved N points toward ‹pole›" — the pole labels drawn above
 *                every axis, so no new words (Body and Roast both start
 *                "light"; comparatives would collide)
 *   threshold    shown when the move rounds to 1 point or more; largest first
 *   first value  the axis had none before: a start, not a move
 *   nothing      no axis moved
 *
 * TODO(copy, PROVISIONAL): the first-value and nothing-moved lines wait for
 * Design (design-missing.md 11).
 */
const PROVISIONAL = {
  first: (axis) => `First note on ${axis.from} / ${axis.to}.`, // PROVISIONAL
  nothing: "This cup didn't move your taste DNA.", // PROVISIONAL
};

export function changeLines(change) {
  if (!change) return [];
  const lines = [];
  for (const axis of TASTE_AXES) {
    const before = change.before[axis.key]?.value ?? null;
    const after = change.after[axis.key]?.value ?? null;
    if (after == null) continue;
    if (before == null) {
      lines.push({ key: axis.key, size: Infinity, text: PROVISIONAL.first(axis) });
      continue;
    }
    const points = Math.round(Math.abs(after - before));
    if (points < 1) continue;
    lines.push({ key: axis.key, size: points, text: `Moved ${points} ${points === 1 ? 'point' : 'points'} toward ${after > before ? axis.to : axis.from}` });
  }
  return lines.sort((a, b) => b.size - a.size);
}

export default function DnaChangeLines({ change }) {
  const lines = changeLines(change);
  return (
    <View style={styles.lines}>
      {lines.length ? (
        lines.map((l) => (
          <Text key={l.key} variant="body" color="secondary">
            {l.text}
          </Text>
        ))
      ) : (
        <Text variant="body" color="secondary">
          {PROVISIONAL.nothing}
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
