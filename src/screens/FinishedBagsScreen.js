import { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import DashedRule from '../components/base/DashedRule';
import Glyph from '../components/base/Glyph';
import IconButton from '../components/base/IconButton';
import InlineAction from '../components/base/InlineAction';
import PhotoPlaceholder from '../components/base/PhotoPlaceholder';
import Text from '../components/base/Text';
import { formatDay } from '../constants/dates';
import { useDatabase } from '../data/DatabaseProvider';
import { OPEN_BAG_LIMIT, countOpenBags, listFinishedBags, onShelfChanged, reopenBag } from '../data/repository';
import { requestNotice } from '../navigation';
import { color, dashed, icon, layout, shape, size, space, spacing } from '../theme/tokens';
import ScreenFrame from './ScreenFrame';

/**
 * 3f — Finished bags, from 3d's entry at its foot (2026-10-14; minimal).
 * Finish bag's recovery (gaps.md 17 / 18): "Reopen bag" puts a bag back on
 * the shelf.
 *
 * Header: compact, as 3d; "N / Archived" in the stat. Under it 3f's line
 * "Archived bags free their slot but keep every cup and note."
 * Row (3f, with Design Round 6's details): the thumbnail, the name, "roaster
 * · Mar 2 → Apr 1" (opened → finished; dates only with no roaster); under a
 * dashed rule the cups ("3" + "cups", accent numeral as 3f) and their
 * average (★ 4.4), or "No cups"; "Reopen bag" (inlineAction, link) at the
 * right, its touch area padded to 44 (the line keeps 3f's 12 under the
 * rule). The frame is 3f's weaker 1.5 border.muted: an archive.
 * Latest finished first; no sort and no summary row in V1.
 *
 * All 5 slots taken (Round 6, 28): one line under the header — "5 of 5 slots
 * in use. Finish a bag in My beans to reopen one." — and every Reopen goes
 * text.muted, not underlined, not pressable. With a free slot both return.
 *
 * Reopen: the bag goes back to 3d with its opened date; 3f stays, and 13b's
 * notice says "‹name› reopened." (the verb is ours). Rows don't open 3g:
 * finished bags aren't edited (2026-10-14).
 */
export default function FinishedBagsScreen({ onBack }) {
  const db = useDatabase();
  const [data, setData] = useState(null); // { bags, open }

  useEffect(() => {
    const load = () =>
      Promise.all([listFinishedBags(db), countOpenBags(db)]).then(
        ([bags, open]) => setData({ bags, open }),
        (error) => console.error('[3f] could not read bags', error)
      );
    load();
    return onShelfChanged(load);
  }, [db]);

  const reopen = async (bag) => {
    try {
      await reopenBag(db, bag.id);
      requestNotice({ name: bag.name, verb: 'reopened' });
    } catch (error) {
      console.error('[3f] could not reopen', error);
      Alert.alert("Couldn't reopen this bag", String(error?.message ?? error));
    }
  };

  const full = data ? data.open >= OPEN_BAG_LIMIT : false;
  return (
    <ScreenFrame
      scroll
      compact
      title="Finished bags"
      leading={<IconButton icon="chevronLeft" accessibilityLabel="Back" onPress={onBack} />}
      stat={data ? { value: String(data.bags.length), label: 'Archived' } : undefined}>
      <View style={styles.body}>
        <View style={styles.lines}>
          <Text variant="meta" color="muted">
            Archived bags free their slot but keep every cup and note.
          </Text>
          {full ? (
            <Text variant="bodySm" color="secondary">
              {`${OPEN_BAG_LIMIT} of ${OPEN_BAG_LIMIT} slots in use. Finish a bag in My beans to reopen one.`}
            </Text>
          ) : null}
        </View>
        {(data?.bags ?? []).map((bag) => (
          <View key={bag.id} style={styles.card}>
            <View style={styles.top}>
              <PhotoPlaceholder size={size.field.height} />
              <View style={styles.text}>
                <Text variant="title" truncate="name">
                  {bag.name}
                </Text>
                <Text variant="bodySm" color="muted" truncate="meta">
                  {[bag.roaster, `${bag.opened_at != null ? formatDay(bag.opened_at) : '—'} → ${formatDay(bag.finished_at)}`].filter(Boolean).join(' · ')}
                </Text>
              </View>
            </View>
            <DashedRule token={dashed.dividerSoft} />
            <View style={styles.strip}>
              {bag.cups > 0 ? (
                <>
                  <View style={styles.count}>
                    <Text variant="numeralInline" color="accent">
                      {String(bag.cups)}
                    </Text>
                    <Text variant="labelEyebrow" color="muted">
                      {bag.cups === 1 ? 'cup' : 'cups'}
                    </Text>
                  </View>
                  <View style={styles.rating} accessible accessibilityLabel={`Average ${bag.avg_rating.toFixed(1)} of 5`}>
                    <Glyph name="star" token={icon.fill.sm} filled />
                    <Text variant="numeralInline">{bag.avg_rating.toFixed(1)}</Text>
                  </View>
                </>
              ) : (
                <Text variant="bodySm" color="muted">
                  No cups
                </Text>
              )}
              <InlineAction
                label="Reopen bag"
                onPress={() => reopen(bag)}
                disabled={full}
                accessibilityLabel={`Reopen ${bag.name}`}
                style={styles.reopen}
              />
            </View>
          </View>
        ))}
      </View>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: space[14],
    // Room under the last block so the bottom bar never covers it (as 3d).
    paddingBottom: layout.empty.block,
  },
  lines: {
    gap: spacing.gap.row,
  },
  card: {
    borderWidth: shape.borderWidth.divider,
    borderColor: color.border.muted,
    backgroundColor: color.surface.raised,
    paddingVertical: spacing.inset.container.v,
    paddingHorizontal: spacing.inset.container.h,
    gap: spacing.gap.section,
  },
  top: {
    flexDirection: 'row',
    gap: space[12],
  },
  text: {
    flex: 1,
    minWidth: 0,
    gap: spacing.gap.tight,
  },
  strip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[14],
  },
  count: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.gap.tight,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.gap.tight,
  },
  reopen: {
    marginLeft: 'auto',
  },
});
