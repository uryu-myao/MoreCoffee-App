import { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import IconButton from '../components/base/IconButton';
import SectionLabel from '../components/base/SectionLabel';
import Text from '../components/base/Text';
import { DnaAxes, DnaStamp } from '../components/TasteDnaCard';
import { formatDay, daysSince } from '../constants/dates';
import { TASTE_AXES } from '../constants/tasteAxes';
import { useDatabase } from '../data/DatabaseProvider';
import { loadDnaPage, onCupsChanged } from '../data/repository';
import { requestDnaInfo } from '../navigation';
import { color, layout, shape, spacing } from '../theme/tokens';
import ScreenFrame from './ScreenFrame';

/**
 * 8f — My taste DNA, pushed over the tabs and the bar (ShellStack 'dna').
 * Reached from Profile (6a's card; until 6a, the placeholder's row) and 2c's
 * "Feeds my taste DNA" (D-48).
 *
 *   header   compact, Back, "My taste DNA", the state's stamp (DnaStamp: its ⓘ
 *            opens 15b's sheet, Design Round 8). 8f draws the stamp small
 *            (9px on surface.inverse); the shared stamp is kept: there is no
 *            9px style.
 *   meta     "From N cups · shifted N days ago" (meta, accent). The shift part
 *            only when there was one.
 *   axes     the Taste DNA card's axes in a 2px frame on raised, each with its
 *            band name under it (DnaAxes bands).
 *   Last shift  one line per axis that moved: "Sweetness moved from Lightly
 *            sweet to Medium sweet on Oct 17." Band names, not the mock's "low
 *            to medium" (written before the bands were). The mock's cause
 *            ("after three naturals in August") is not built: there is no rule
 *            for it, and the app doesn't guess (Uryu, 2026-10-21).
 *
 * Not built in V1:
 *   - the summary line ("Bright, juicy, lightly sweet"): TODO(design): Round
 *     10, 12 (and 11) — its rule is Design's.
 *   - "What you keep saying": My words' counts (8h), not flavour tags; it
 *     comes with 8h. Tapping a word will open 8l's Words search for it.
 *   - the footer's "How it is built" (8g) and "Try next" (8d): out of V1, so
 *     no footer; the page ends after its last block.
 * Last shift's frame: 8f draws it dashed, which §8 keeps for empty states
 * only, so it is a plain section like 2c's (TODO(design): next brief).
 *
 * The shift is read from the stored changes (taste-dna.md item 5), so its
 * "to" band can differ from today's: the profile is computed on read.
 */
export const cupsLabel = (n) => (n === 1 ? '1 cup' : `${n} cups`);

/** "shifted 4 days ago" (8f); 6a puts "last " before it. */
export function shiftedLabel(at) {
  const days = daysSince(at);
  return days <= 0 ? 'shifted today' : days === 1 ? 'shifted 1 day ago' : `shifted ${days} days ago`;
}

function shiftLines(shift) {
  const day = formatDay(shift.at);
  return shift.axes.map(({ axis, from, to }) => {
    const a = TASTE_AXES.find((t) => t.key === axis);
    return `${a.name} moved from ${a.steps[from]} to ${a.steps[to]} on ${day}.`;
  });
}

export default function TasteDnaScreen({ onBack }) {
  const db = useDatabase();
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () =>
      loadDnaPage(db).then(setData, (error) => {
        console.error('[dna] could not read', error);
        Alert.alert("Couldn't read your taste DNA", String(error?.message ?? error));
      });
    load();
    return onCupsChanged(load);
  }, [db]);

  const dna = data?.dna;
  const meta = dna ? [`From ${cupsLabel(dna.cups)}`, data.shift ? shiftedLabel(data.shift.at) : null].filter(Boolean).join(' · ') : null;

  return (
    <ScreenFrame
      scroll
      compact
      title="My taste DNA"
      leading={<IconButton icon="chevronLeft" accessibilityLabel="Back" onPress={onBack} />}
      trailing={dna ? <DnaStamp state={dna.state} onPress={() => requestDnaInfo(dna)} /> : undefined}>
      {dna ? (
        <View style={styles.body}>
          <Text variant="meta" color="accent">
            {meta}
          </Text>
          <View style={styles.card}>
            <DnaAxes dna={dna} bands />
          </View>
          {data.shift ? (
            <View style={styles.section}>
              <SectionLabel variant="plain" label="Last shift" />
              {shiftLines(data.shift).map((line) => (
                <Text key={line} variant="body" color="secondary">
                  {line}
                </Text>
              ))}
            </View>
          ) : null}
        </View>
      ) : null}
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: spacing.gap.axis,
    paddingBottom: layout.screen.bottom,
  },
  card: {
    borderWidth: shape.borderWidth.box,
    borderColor: color.border.strong,
    backgroundColor: color.surface.raised,
    paddingVertical: spacing.inset.container.v,
    paddingHorizontal: spacing.inset.container.h,
  },
  section: {
    gap: spacing.gap.row,
  },
});
