import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { TASTE_AXES } from '../constants/tasteAxes';
import { DNA_TUNING } from '../data/tasteDna';
import { onDnaInfoRequest } from '../navigation';
import { color, size, space, spacing } from '../theme/tokens';
import BottomSheet from './base/BottomSheet';
import Button from './base/Button';
import Text from './base/Text';

/**
 * 15b — what the Taste DNA stamp means (Design Round 8, 2026-10-17): the §9
 * bottom sheet the stamp opens (DnaStamp), on Home and on 5c.
 *
 * Fixed order: eyebrow "My taste DNA" (label.eyebrow, accent) → the status as
 * the title → body copy (body, text.secondary; free length) → the progress
 * box → "Got it" (secondary; no primary: it's information). At most
 * size.sheet.info.maxHeight (78%) of the window; the body scrolls past it.
 * Closes on Got it, a scrim tap, or a swipe down.
 *
 * Progress box: surface.ground (the mock's #F4EDEA), the live sentence that
 * used to sit under the card's title. No frame (on device, 2026-10-17): the
 * mock's 2px ink frame made it read as a second button over "Got it".
 *   early   the least-noted axes and the notes they still need — "Body needs
 *           3 more notes.", "Body and Roast need 9 more notes each." (15b's
 *           wording: the sheet already says what the notes are for)
 *   locked  "From 147 cups." (8f; PROVISIONAL, as on the card before)
 * TODO(V2): the box's first row, "3 of 5 cups" + five cup glyphs, is Try
 * next's threshold — not shown at this stage (design-missing.md 13), so the
 * box holds the sentence alone.
 *
 * Title: display.sm, as every sheet title (§9 Bottom sheet). The mock's 34 is
 * not in the type scale.
 */
const listNames = (names) => (names.length === 1 ? names[0] : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`);
const notes = (n) => `${n} more ${n === 1 ? 'note' : 'notes'}`;

function earlyProgress(dna) {
  const short = TASTE_AXES.filter((a) => dna.axes[a.key].n > 0 && dna.axes[a.key].n === dna.fewest).map((a) => a.name);
  const n = DNA_TUNING.lockIn - dna.fewest;
  return short.length === 1 ? `${short[0]} needs ${notes(n)}.` : `${listNames(short)} need ${notes(n)} each.`;
}

/**
 * TODO(copy, PROVISIONAL): Design's final copy is TBD (Round 8). 15b's second
 * paragraph ("At 5 cups it locks in … and Try next starts using it") is
 * rewritten to what V1 does: lock-in is 10 slider notes per axis
 * (DNA_TUNING.lockIn), and Try next is V2. The locked copy is ours.
 */
const COPY = {
  early: {
    title: 'Early signs',
    body: [
      'Your profile is built from the axes you note on each cup. With only a few cups, one cup can swing it a lot. Read it as a hint, not a verdict.',
      `It locks in once every axis you note has ${DNA_TUNING.lockIn} notes. From then on it moves slowly.`,
    ],
    progress: earlyProgress,
  },
  locked: {
    title: 'Locked in',
    body: [
      `Every axis you note has ${DNA_TUNING.lockIn} notes or more, so one cup no longer swings it much.`,
      'It still moves as your taste does: recent cups count for more than old ones.',
    ],
    progress: (dna) => `From ${dna.cups} ${dna.cups === 1 ? 'cup' : 'cups'}.`,
  },
};

/**
 * Props
 *   visible, onClose
 *   dna      the profile (loadTasteDna); its state picks the copy. Kept while
 *            the sheet animates out.
 */
export default function DnaInfoSheet({ visible, onClose, dna }) {
  // The body scrolls only when it doesn't fit; otherwise the whole sheet
  // takes the swipe down.
  const [frame, setFrame] = useState(0);
  const [content, setContent] = useState(0);
  const copy = dna ? COPY[dna.state] : null;
  return (
    <BottomSheet visible={visible && copy != null} onClose={onClose} maxHeight={size.sheet.info.maxHeight} swipeToClose>
      {copy ? (
        <>
          <View style={styles.heading}>
            <Text variant="labelEyebrow" color="accent">
              My taste DNA
            </Text>
            <Text variant="displaySm" color="primary" accessibilityRole="header">
              {copy.title}
            </Text>
          </View>
          <ScrollView
            style={styles.body}
            contentContainerStyle={styles.bodyContent}
            scrollEnabled={content > frame + 0.5}
            onLayout={(e) => setFrame(e.nativeEvent.layout.height)}
            onContentSizeChange={(_, h) => setContent(h)}>
            {copy.body.map((p) => (
              <Text key={p} variant="body" color="secondary">
                {p}
              </Text>
            ))}
            <View style={styles.progress}>
              <Text variant="meta" color="primary">
                {copy.progress(dna)}
              </Text>
            </View>
          </ScrollView>
          <View style={styles.action}>
            <Button variant="secondary" label="Got it" onPress={onClose} />
          </View>
        </>
      ) : null}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  // 15b: eyebrow over title, 6 apart.
  heading: {
    gap: space[6],
  },
  body: {
    flexShrink: 1,
  },
  bodyContent: {
    gap: spacing.gap.section,
  },
  progress: {
    backgroundColor: color.surface.ground,
    paddingVertical: spacing.inset.container.v,
    paddingHorizontal: spacing.inset.container.h,
  },
  // 15b: the button sits 4 further down than the sheet's gap.
  action: {
    marginTop: space[4],
  },
});

/** AppShell's copy of the sheet, for Home's stamp (requestDnaInfo): over the tabs and the bar. */
export function DnaInfoHost() {
  const [shown, setShown] = useState({ visible: false, dna: null });
  useEffect(() => onDnaInfoRequest((dna) => setShown({ visible: true, dna })), []);
  return <DnaInfoSheet visible={shown.visible} dna={shown.dna} onClose={() => setShown((s) => ({ ...s, visible: false }))} />;
}
