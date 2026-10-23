import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import Badge from '../components/base/Badge';
import DashedRule from '../components/base/DashedRule';
import Chevron from '../components/base/Chevron';
import MenuRow from '../components/base/MenuRow';
import Text from '../components/base/Text';
import { weekStreak } from '../components/HomeStats';
import { GEAR_LIMIT } from '../constants/gear';
import { daysBetween } from '../constants/dates';
import { TASTE_AXES } from '../constants/tasteAxes';
import { useDatabase } from '../data/DatabaseProvider';
import { shareExport } from '../data/export';
import { OPEN_BAG_LIMIT, countGear, countOpenBags, loadDnaPage, loadProfile, onCupsChanged, onShelfChanged } from '../data/repository';
import { bandOf } from '../data/tasteDna';
import { requestPush } from '../navigation';
import { color, dashed, layout, shape, space, spacing, state } from '../theme/tokens';
import ScreenFrame from './ScreenFrame';
import { cupsLabel, dnaSummary, shiftedLabel } from './TasteDnaScreen';

/**
 * 6a — Profile, the upper part (2026-10-21). 6b (the lower part: DNA
 * settings, My data, Reset, Account) and 6c are not built, except 6b's
 * "Export my cups" row (below).
 *
 *   header       "Morecoffee" over "My profile". 6a's "Edit" leads to 6d (Edit
 *                profile), not built: not shown.
 *   card         the personal card without its identity row: 6d holds the
 *                name and avatar, and the "Home brewer" badge has no rule
 *                (Design Round 11, D2). What V1 has: "Logging since ‹month› ·
 *                N weeks" (the first cup) over Cups / Bags / Week streak.
 *                Bags: every bag ever added. Week streak: ours (weekStreak).
 *   Taste DNA    a link to 8f, the whole card (6a; Design Round 11, C: the
 *                one framed block that is pressable). Its stamp is a plain
 *                Badge, no ⓘ, no tap of its own: no button in a button
 *                (Design Round 8). Under the heading, the summary line
 *                (dnaSummary, Round 10, D12) at display.xs: 6a draws it 27,
 *                which has no style (8f's is display.lg). Then the band
 *                names 8f uses, one per noted axis, as Badges (Round 11, D6),
 *                and "Built from N cups · last shifted N days ago".
 *   My shelf     My gear "N of 8" (6a's "of 3" contradicts 3a / 4a, gaps.md
 *                24) → 3b (2026-10-22); My beans "N of 5" → 3d
 *                (every bag on the shelf, opened or not: "On the shelf",
 *                Design Round 7, 18; no "1 stale": staleness isn't built).
 *                My words is 8h's, out of V1: not shown, so the heading now
 *                holds gear and beans only, which "shelf" means (§1 Words).
 *                When 8h comes, My words gets its own heading, "My words"
 *                (Design Round 11, D1).
 *   My data      6b's "Export my cups" row, alone (todo.md T-8): the only way
 *                to get the data out. JSON of every table, not 6b's CSV.
 *
 * Each section: label.eyebrow heading (muted) over a 2px ink frame on raised;
 * rows are MenuRow.
 * Pressable blocks follow Design Round 11, C (todo.md T-10): MenuRow's rows
 * end in the shared chevron; the Taste DNA card is the app's one framed
 * block that is pressable (chevron on its heading line, the pressed fill
 * inside the frame).
 */
const sinceFormat = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' });

function sinceLine(first, now) {
  const weeks = Math.floor(daysBetween(first, now) / 7);
  const since = `Logging since ${sinceFormat.format(new Date(first))}`;
  return weeks > 0 ? `${since} · ${weeks === 1 ? '1 week' : `${weeks} weeks`}` : since;
}

function Stat({ value, label, accent = false, first = false }) {
  return (
    <View style={[styles.stat, !first && styles.statDivided]} accessible accessibilityLabel={`${value} ${label}`}>
      <Text variant="displaySm" color={accent ? 'accent' : 'primary'}>
        {String(value)}
      </Text>
      <Text variant="labelEyebrow" color="muted">
        {label}
      </Text>
    </View>
  );
}

function PersonalCard({ profile, now }) {
  const first = profile.cupTimes[0];
  return (
    <View style={styles.frame}>
      {first != null ? (
        <>
          <View style={styles.since}>
            <Text variant="bodySm" color="muted">
              {sinceLine(first, now)}
            </Text>
          </View>
          <DashedRule token={dashed.dividerSoft} />
        </>
      ) : null}
      <View style={styles.stats}>
        <Stat first value={profile.cupTimes.length} label="Cups" />
        <Stat value={profile.bags} label="Bags" />
        <Stat accent value={weekStreak(profile.cupTimes, now)} label="Week streak" />
      </View>
    </View>
  );
}

function DnaLink({ dna, shift }) {
  const bands = TASTE_AXES.filter((a) => dna.axes[a.key].value != null).map((a) => a.steps[bandOf(dna.axes[a.key].value)]);
  const stamp = dna.state === 'none' ? null : dna.state === 'locked' ? 'Locked in' : 'Early signs';
  const summary = dnaSummary(dna);
  const meta = [`Built from ${cupsLabel(dna.cups)}`, shift ? `last ${shiftedLabel(shift.at)}` : null].filter(Boolean).join(' · ');
  // Round 11, C: the one framed block that is pressable. The frame is the
  // View, so the pressed fill (state.pressed.row, laid over raised) stays
  // inside it.
  return (
    <View style={styles.frame}>
      <Pressable
        onPress={() => requestPush({ name: 'dna' })}
        accessibilityRole="button"
        accessibilityLabel={['My taste DNA', stamp, summary, bands.join(', '), meta].filter(Boolean).join(', ')}
        style={({ pressed }) => [styles.dna, pressed && styles.rowPressed]}>
        <View style={styles.dnaHead}>
          <Text variant="labelEyebrow" color="muted">
            My taste DNA
          </Text>
          {stamp ? <Badge label={stamp} tone={dna.state === 'locked' ? 'selected' : 'accent'} placement="standalone" /> : null}
          <View style={styles.chevron}>
            <Chevron />
          </View>
        </View>
        {summary ? (
          <Text variant="displayXs" color="primary">
            {summary}
          </Text>
        ) : null}
        {bands.length ? (
          <>
            <DashedRule token={dashed.dividerSoft} />
            <View style={styles.bands}>
              {bands.map((b) => (
                <Badge key={b} label={b} tone="neutral" placement="standalone" />
              ))}
            </View>
          </>
        ) : null}
        <Text variant="bodySm" color="secondary">
          {meta}
        </Text>
      </Pressable>
    </View>
  );
}

function Section({ title, caption, children }) {
  return (
    <View style={styles.section}>
      <Text variant="labelEyebrow" color="muted" accessibilityRole="header">
        {title}
      </Text>
      <View style={styles.frame}>{children}</View>
      {caption ? (
        <Text variant="bodySm" color="secondary">
          {caption}
        </Text>
      ) : null}
    </View>
  );
}

export default function ProfileTabScreen() {
  const db = useDatabase();
  const [data, setData] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const load = () =>
      Promise.all([loadProfile(db), loadDnaPage(db), countGear(db), countOpenBags(db)]).then(
        ([profile, page, gear, bags]) => setData({ profile, page, gear, bags, now: Date.now() }),
        (error) => console.error('[profile] could not read', error)
      );
    load();
    const offCups = onCupsChanged(load);
    const offShelf = onShelfChanged(load);
    return () => {
      offCups();
      offShelf();
    };
  }, [db]);

  // TODO(design): 6b replaces this row's interim form; failure copy is ours.
  const onExport = async () => {
    setBusy(true);
    try {
      await shareExport(db);
    } catch (error) {
      console.error('[export] failed', error);
      Alert.alert("Couldn't export", String(error?.message ?? error));
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScreenFrame scroll eyebrow="Morecoffee" title="My profile">
      {data ? (
        <View style={styles.body}>
          <PersonalCard profile={data.profile} now={data.now} />
          <DnaLink dna={data.page.dna} shift={data.page.shift} />
          <Section title="My shelf" caption="The shelf is what keeps a log down to 15 seconds.">
            <MenuRow icon="dripper" label="My gear" value={`${data.gear} of ${GEAR_LIMIT}`} onPress={() => requestPush({ name: 'gear' })} />
            <MenuRow icon="beanBag" label="My beans" value={`${data.bags} of ${OPEN_BAG_LIMIT}`} onPress={() => requestPush({ name: 'beans' })} />
          </Section>
          <Section title="My data">
            <MenuRow
              icon="download"
              label="Export my cups"
              sub={`${cupsLabel(data.profile.cupTimes.length)} as JSON, notes included`}
              onPress={onExport}
              disabled={busy}
            />
          </Section>
        </View>
      ) : null}
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: space[20],
    // Room under the last block so the bottom bar never covers it (as 2a).
    paddingBottom: layout.empty.block,
  },
  frame: {
    borderWidth: shape.borderWidth.box,
    borderColor: color.border.strong,
    backgroundColor: color.surface.raised,
  },
  rowPressed: {
    backgroundColor: state.pressed.row,
  },
  since: {
    paddingVertical: spacing.inset.container.v,
    paddingHorizontal: spacing.inset.container.h,
  },
  stats: {
    flexDirection: 'row',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.gap.tight,
    paddingVertical: space[14],
    paddingHorizontal: space[8],
  },
  statDivided: {
    borderLeftWidth: shape.borderWidth.divider,
    borderLeftColor: color.border.subtle,
  },
  dna: {
    paddingVertical: spacing.inset.container.v,
    paddingHorizontal: spacing.inset.container.h,
    gap: spacing.gap.section,
  },
  dnaHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.gap.row,
  },
  chevron: {
    marginLeft: 'auto',
  },
  bands: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.gap.row,
  },
  section: {
    gap: spacing.gap.row,
  },
});
