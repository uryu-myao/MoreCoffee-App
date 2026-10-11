import { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import AxisReadout from '../components/base/AxisReadout';
import Badge from '../components/base/Badge';
import FieldRow from '../components/base/FieldRow';
import Glyph from '../components/base/Glyph';
import IconButton from '../components/base/IconButton';
import SectionLabel from '../components/base/SectionLabel';
import Text from '../components/base/Text';
import DnaChangeLines from '../components/DnaChangeLines';
import { whenLine } from '../components/WhenMeta';
import { MODE_LABEL, NONE, cupTitle } from '../constants/cups';
import { daysBetween } from '../constants/dates';
import { FLAVOUR_LIMIT } from '../constants/flavours';
import { TASTE_AXES } from '../constants/tasteAxes';
import { useDatabase } from '../data/DatabaseProvider';
import { getCup, onCupsChanged } from '../data/repository';
import { color, icon, layout, shape, space, spacing } from '../theme/tokens';
import { RATING_COPY } from './RecordCoffeeScreen';
import ScreenFrame from './ScreenFrame';

/**
 * 2c — one cup, read only (in V1, decided 2026-10-11). Opened from a 2a row;
 * 5c's "See this record" will open it too.
 *
 * Header: ScreenFrame's compact header, as 5a (2026-10-11, on device: the
 * stacked Back + title made the header too tall): Back and the cup's name on
 * one row, 2 lines at most (user data). No meta column: with 5a's date / time
 * column beside it, even "Ethiopia Guji" wrapped to two lines. The body opens
 * with the date line (2c's "Wed, Apr 8 · 08:20 · Morning", accent) and the
 * mode Badge on one row, then the roaster line and the stars.
 *
 * Not shown in V1 (decided 2026-10-11):
 *   - the pencil (cup edit, waiting for Design: design-missing.md 1)
 *   - share (no mock says what it shares; gaps.md 32)
 *   - the photo area (no camera in V1; a placeholder is Design's: design-missing.md 6)
 *   - "22 clicks" and "My default brewer" (gaps.md 33)
 * "Feeds my taste DNA" is plain lines, not the mock's dashed link (D-48).
 *
 * "Where it sat" draws this cup's own values: AxisReadout's entered (brown)
 * tone — the only place it is used (§9).
 */
/** "Blue Bottle · day 7 when brewed": day only with a roast date, never negative. */
function subtitle(cup) {
  if (cup.mode !== 'made_it') return cupTitle(cup).source;
  const day = cup.bean_roasted_at != null ? daysBetween(cup.bean_roasted_at, cup.logged_at) : null;
  return [cup.bean_roaster, day != null && day >= 0 ? `day ${day} when brewed` : null].filter(Boolean).join(' · ') || undefined;
}

function Stars({ rating }) {
  return (
    <View style={styles.stars} accessible accessibilityLabel={`${rating} of 5`}>
      {[1, 2, 3, 4, 5].map((n) =>
        n <= rating ? (
          <Glyph key={n} name="star" token={icon.fill.sm} filled />
        ) : (
          <Glyph key={n} name="star" token={icon.xs} color={color.border.muted} />
        )
      )}
    </View>
  );
}

/** "What I logged": the shelf part for I made it; Barista / Packaged rows until Design draws them. */
function Logged({ cup }) {
  if (cup.mode === 'made_it') {
    const method = [cup.brew_method, cup.grinder].filter(Boolean).join(' · ');
    return (
      <View style={styles.card}>
        <FieldRow
          readOnly
          swatch
          label="Bag"
          value={cup.bean_name ?? NONE}
          // "from my shelf": the cup still points at a bag on the shelf.
          meta={[cup.bean_roaster, cup.bag_id != null ? 'from my shelf' : null].filter(Boolean).join(' · ') || undefined}
        />
        <FieldRow readOnly divided label="Method" value={method || NONE} />
      </View>
    );
  }
  // TODO(design): 2c is drawn for I made it only (design-missing.md 2); these
  // rows follow 5a's fields for the mode.
  if (cup.mode === 'barista') {
    return (
      <View style={styles.card}>
        <FieldRow readOnly icon="pin" label="Café" value={cup.place_name ?? NONE} />
        <FieldRow readOnly divided label="Drink" value={cup.drink_type ?? NONE} />
      </View>
    );
  }
  return (
    <View style={styles.card}>
      <FieldRow readOnly icon="can" label="Product" value={[cup.product_brand, cup.product_name].filter(Boolean).join(' · ') || NONE} />
      <FieldRow readOnly divided label="Bought at" value={cup.bought_at_name ?? NONE} />
    </View>
  );
}

export default function CupRecordScreen({ id, onBack }) {
  const db = useDatabase();
  const [cup, setCup] = useState(null);

  useEffect(() => {
    const load = () =>
      getCup(db, id).then(setCup, (error) => {
        console.error('[cup] could not read', error);
        Alert.alert("Couldn't read this cup", String(error?.message ?? error));
      });
    load();
    return onCupsChanged(load);
  }, [db, id]);

  if (!cup) return null;
  const noted = TASTE_AXES.filter((a) => cup[`axis_${a.key}`] != null).length;
  const change = cup.dna_change ? JSON.parse(cup.dna_change) : null;
  const sub = subtitle(cup);

  return (
    <ScreenFrame
      scroll
      compact
      userTitle
      title={cupTitle(cup).title}
      leading={<IconButton icon="chevronLeft" accessibilityLabel="Back" onPress={onBack} />}>
      <View style={styles.body}>
        <View style={styles.lead}>
          <View style={styles.whenRow}>
            <Text variant="labelEyebrow" color="accent" style={styles.when}>
              {whenLine(new Date(cup.logged_at))}
            </Text>
            <Badge label={MODE_LABEL[cup.mode]} tone="selected" placement="standalone" />
          </View>
          {sub ? (
            <Text variant="body" color="muted" truncate="meta">
              {sub}
            </Text>
          ) : null}
          {cup.rating ? (
            <View style={styles.ratingRow}>
              <Stars rating={cup.rating} />
              <Text variant="labelCaps" color="muted">
                {RATING_COPY[cup.rating]}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.section}>
          <SectionLabel variant="plain" label="What I logged" />
          <Logged cup={cup} />
        </View>

        <View style={styles.card}>
          <View style={styles.cardInner}>
            <Text variant="displaySm" color="accent">
              Where it sat
            </Text>
            <Text variant="body" color="muted">
              {`${noted} of 4 axes noted. Untouched ones stay out of my taste DNA.`}
            </Text>
            <View style={styles.axes}>
              {TASTE_AXES.map((axis) => {
                const value = cup[`axis_${axis.key}`];
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
                    <AxisReadout
                      tone="entered"
                      value={value}
                      accessibilityLabel={`${axis.from} to ${axis.to}, ${value == null ? 'not noted' : axis.steps[Math.round(value / 25)]}`}
                    />
                    {value == null ? (
                      <Text variant="meta" color="muted">
                        Not noted
                      </Text>
                    ) : null}
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {cup.flavours.length ? (
          <View style={styles.section}>
            <SectionLabel variant="plain" label="Flavors" status="count" statusLabel={`${cup.flavours.length} of ${FLAVOUR_LIMIT}`} />
            {/* Display only: Badges (fill, no frame), so they never look like
                5b's pressable chips (§1 Tap affordance; drift D-50). */}
            <View style={styles.flavours}>
              {cup.flavours.map((w) => (
                <Badge key={w} label={w} tone="accent" placement="standalone" />
              ))}
            </View>
          </View>
        ) : null}

        {cup.note ? (
          <View style={styles.section}>
            <SectionLabel variant="plain" label="My words" />
            <Text variant="note" color="primary">
              {cup.note}
            </Text>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text variant="labelCaps" color="accent">
            Feeds my taste DNA
          </Text>
          <DnaChangeLines change={change} />
        </View>
      </View>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: space[20],
    // Room under the last block so the bottom bar never covers it (as 2a).
    paddingBottom: layout.empty.block,
  },
  whenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.gap.section,
  },
  when: {
    flex: 1,
  },
  lead: {
    gap: spacing.gap.row,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[14],
  },
  stars: {
    flexDirection: 'row',
    gap: spacing.gap.tight,
  },
  section: {
    gap: spacing.gap.row,
  },
  card: {
    borderWidth: shape.borderWidth.box,
    borderColor: color.border.strong,
    backgroundColor: color.surface.raised,
  },
  cardInner: {
    paddingVertical: spacing.inset.container.v,
    paddingHorizontal: spacing.inset.container.h,
    gap: spacing.gap.row,
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
  flavours: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.gap.row,
  },
});
