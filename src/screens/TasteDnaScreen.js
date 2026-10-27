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
import { bandOf } from '../data/tasteDna';
import { requestDnaInfo } from '../navigation';
import { color, layout, shape, space, spacing } from '../theme/tokens';
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
 *   summary  the profile in two band names, "Bright, light-bodied" (dnaSummary;
 *            Design Round 10, D12): display.lg, ink, as 8f's. None when no
 *            axis is left.
 *   meta     "From N cups · shifted N days ago" (meta, accent). The shift part
 *            only when there was one. With nothing noted, one line under it:
 *            "Rate a cup and note one taste to start." (Design Round 11, B).
 *   axes     the Taste DNA card's axes in a 2px frame on raised, each with its
 *            band name under it (DnaAxes bands).
 *   Flavours I pick most  (Design Round 11, B) the top 4 flavour tags with
 *            their counts, "Peach 12", from the cups the profile counts.
 *            Heading label.caps (Design's word); tags as 8f's word tags (1.5
 *            border.muted on raised, the count in accent). Not pressable.
 *            Hidden until a tag has been picked. When 8h brings "What you
 *            keep saying" under it, each block gets its sub-heading ("From
 *            the flavour list" / "In my own words"); alone, it needs none.
 *   Last shift  one line per axis that moved: "Sweetness moved from Lightly
 *            sweet to Medium sweet on Oct 17." Band names, not the mock's "low
 *            to medium" (written before the bands were). The mock's cause
 *            ("after three naturals in August") is not built: there is no rule
 *            for it, and the app doesn't guess (Uryu, 2026-10-21; Design
 *            Round 11, B). A plain section, no frame (Round 11, C).
 *
 * Not built in V1:
 *   - "What you keep saying": My words' counts (8h); it comes with 8h.
 *     Tapping a word will open 8l's Words search for it.
 *   - the footer's "How it is built" (8g) and "Try next" (8d): out of V1, so
 *     no footer; the page ends after its last block.
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

/**
 * The profile in words (Design Round 10, D12): band names only. Of the noted
 * axes, drop those in the middle band (Medium …, Balanced), keep the two
 * farthest from 50, farthest first; the first word capitalised, the rest
 * lowercase, joined by ", ". Ties keep the axes' order (ours). Null when no
 * axis is left.
 */
export function dnaSummary(dna) {
  const words = TASTE_AXES.map((a) => ({ a, value: dna.axes[a.key].value }))
    .filter(({ value }) => value != null && bandOf(value) !== MIDDLE_BAND)
    .sort((x, y) => Math.abs(y.value - 50) - Math.abs(x.value - 50))
    .slice(0, 2)
    .map(({ a, value }) => a.steps[bandOf(value)].toLowerCase());
  if (!words.length) return null;
  words[0] = words[0][0].toUpperCase() + words[0].slice(1);
  return words.join(', ');
}
const MIDDLE_BAND = 2;

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
  const summary = dna ? dnaSummary(dna) : null;
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
          <View style={styles.head}>
            {summary ? (
              <Text variant="displayLg" color="primary">
                {summary}
              </Text>
            ) : null}
            <Text variant="meta" color="accent">
              {meta}
            </Text>
            {dna.state === 'none' ? (
              <Text variant="body" color="secondary">
                Rate a cup and note one taste to start.
              </Text>
            ) : null}
          </View>
          <View style={styles.card}>
            <DnaAxes dna={dna} bands />
          </View>
          {data.flavours.length ? (
            <View style={styles.section}>
              <Text variant="labelCaps" color="muted" accessibilityRole="header">
                Flavours I pick most
              </Text>
              <View style={styles.tags}>
                {data.flavours.map(({ name, count }) => (
                  <View key={name} style={styles.tag} accessible accessibilityLabel={`${name}, ${count}`}>
                    <Text variant="meta" color="secondary">
                      {name}
                    </Text>
                    <Text variant="meta" color="accent">
                      {String(count)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}
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
  head: {
    gap: spacing.gap.row,
  },
  section: {
    gap: spacing.gap.row,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.gap.row,
  },
  // 8f's word tag: 1.5 border.muted on raised, the count beside the word.
  tag: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: space[6],
    paddingVertical: space[8],
    paddingHorizontal: space[12],
    borderWidth: shape.borderWidth.divider,
    borderColor: color.border.muted,
    backgroundColor: color.surface.raised,
  },
});
