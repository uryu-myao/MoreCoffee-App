import { StyleSheet, View } from 'react-native';
import { TASTE_AXES } from '../constants/tasteAxes';
import { DNA_TUNING, bandOf } from '../data/tasteDna';
import { color, rotation, shape, spacing } from '../theme/tokens';
import AxisReadout from './base/AxisReadout';
import Badge from './base/Badge';
import Text from './base/Text';

/**
 * Taste DNA card (1b / 4a / 4b: Home, the same card on all three; not
 * pressable). From the mock: "My taste DNA" (display.sm, accent) with the
 * state as a tilted sticker badge beside it, one line under it, then the four
 * axes — pole labels over an AxisReadout (§9; replaces the mock's dashed
 * display rail and needle).
 *
 * State, one for the whole profile (taste-dna.md item 4, option B):
 *   early   "Early signs" — Badge accent (the mock's #F1E3D6 / #8A4602; its
 *           1.5px border is left out: a Badge has none, §9)
 *   locked  "Locked in" — Badge selected (6a / 8f)
 *   none    no badge: nothing noted yet
 * The mock's footer "3 of 5 cups" is Try next's progress (V2): not shown.
 *
 * All four axes always show (Design 10b, option A, decided 2026-10-12): an
 * axis with nothing noted is AxisReadout's empty track with "Not noted yet"
 * on it, never a value of 50. The card's height never depends on what has
 * been noted (design-system.md §9 Taste axis readout).
 *
 * The line under the title:
 *   early   Design's copy (2026-10-11, D-47): the least-noted axes and the
 *           notes they still need — "Body needs 3 more notes to lock in.",
 *           "Body and Roast need 3 more notes each to lock in." (to lock in
 *           also when tied, decided 2026-10-12), "1 more note". Notes,
 *           not cups: a cup that skips an axis does not count for it.
 *   TODO(copy, PROVISIONAL): none and locked have no copy from Design yet.
 */
const listNames = (names) => (names.length === 1 ? names[0] : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`);
const notes = (n) => `${n} more ${n === 1 ? 'note' : 'notes'}`;

function earlyLine(dna) {
  const short = TASTE_AXES.filter((a) => dna.axes[a.key].n > 0 && dna.axes[a.key].n === dna.fewest).map((a) => a.name);
  const n = DNA_TUNING.lockIn - dna.fewest;
  return short.length === 1 ? `${short[0]} needs ${notes(n)} to lock in.` : `${listNames(short)} need ${notes(n)} each to lock in.`;
}

const LINE = {
  none: () => 'Note what you taste on a cup to start it.', // PROVISIONAL
  early: earlyLine,
  locked: (dna) => `From ${dna.cups} ${dna.cups === 1 ? 'cup' : 'cups'}.`, // PROVISIONAL: 8f's "From 147 cups"
};

/** The profile's state as 1b's tilted sticker (none: nothing). Shared with 5c. */
export function DnaStateBadge({ state }) {
  if (state === 'none') return null;
  return (
    <View style={styles.sticker}>
      <Badge label={state === 'locked' ? 'Locked in' : 'Early signs'} tone={state === 'locked' ? 'selected' : 'accent'} placement="standalone" />
    </View>
  );
}

export default function TasteDnaCard({ dna }) {
  const line = LINE[dna.state](dna);
  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <Text variant="displaySm" color="accent" style={styles.title}>
          My taste DNA
        </Text>
        <DnaStateBadge state={dna.state} />
      </View>
      <Text variant="body" color="muted">
        {line}
      </Text>
      <View style={styles.axes}>
        {TASTE_AXES.map((axis) => {
          const value = dna.axes[axis.key].value;
          const band = value == null ? null : axis.steps[bandOf(value)];
          return (
            <View key={axis.key} style={styles.axis}>
              <View style={styles.poles}>
                <Text variant="labelCaps" color="muted">
                  {axis.from}
                </Text>
                <Text variant="labelCaps" color="muted">
                  {axis.to}
                </Text>
              </View>
              <AxisReadout value={value} accessibilityLabel={`${axis.from} to ${axis.to}, ${band ?? 'not noted'}`} />
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: shape.borderWidth.box,
    borderColor: color.border.strong,
    backgroundColor: color.surface.raised,
    paddingVertical: spacing.inset.container.v,
    paddingHorizontal: spacing.inset.container.h,
    gap: spacing.gap.row,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.gap.section,
  },
  title: {
    flex: 1,
  },
  sticker: {
    transform: [{ rotate: `${rotation.sticker}deg` }],
  },
  axes: {
    marginTop: spacing.gap.section,
    gap: spacing.gap.axis,
  },
  axis: {
    gap: spacing.gap.row,
  },
  poles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
