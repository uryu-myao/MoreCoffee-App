import { StyleSheet, View } from 'react-native';
import { startOfDay } from '../constants/dates';
import { color, shape, space, spacing, textStyle } from '../theme/tokens';
import Text from './base/Text';

/**
 * 1b's count block: "Cups total" over the hero numeral, beside the "This
 * week" panel (count + a Monday-first strip of the week's days).
 *
 * Strip (catalogue #30): the weekday letter (text.weekday) over the date.
 * A day with a cup: date in accent; others (and days to come) muted. Today:
 * its letter in ink and a 2px ink underline under the date — 1b's export
 * draws it (gaps.md 9 asked whether it renders). The mock sets dates at
 * 13 / 700 and 13 / 500, which no style matches; `meta` stands in (D-52).
 * The week count is 44px serif in the mock; `displayLg` (40) stands in (D-52).
 *
 * Panel: surface.sunken. "Cups total" sits space.12 above the numeral (D-34;
 * §4: serif ink sets its own space).
 *
 * Not shown: the line under the block ("A slow start is still a start."),
 * one sentence with no rule for when it applies — Design (design-missing.md).
 *
 * Props: total, cupTimes (logged_at of this week's cups), now
 */
const LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

/*
 * The hero numeral's ink, not its box (§3, measured: Instrument Serif ascent
 * 990, descent 310 per 1000; digit ink −10 … 745). On iOS the numeral renders
 * on its natural box (§3.2), so (990 − 745) / 1000 em of space sits above the
 * digits and 310 / 1000 em below. These pull the box in to the ink, so
 * "Cups total" sits space.12 above the digits (D-34) and the digits' foot
 * meets the panel's foot. Formulas from the measured metrics, not tokens.
 */
const HERO = textStyle.numeralHero.fontSize;
const HERO_ABOVE_INK = ((990 - 745) / 1000) * HERO;
const HERO_BELOW_INK = (310 / 1000) * HERO;

/** Local midnight of this week's Monday. */
export function weekStart(now) {
  const d = new Date(now);
  const monday = (d.getDay() + 6) % 7; // 0 = Monday
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() - monday).getTime();
}

export default function HomeStats({ total, cupTimes, now }) {
  const start = weekStart(now);
  const today = startOfDay(new Date(now));
  const cupDays = new Set(cupTimes.map((t) => startOfDay(new Date(t))));
  const days = LETTERS.map((letter, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i); // calendar days, safe across DST
    const ms = d.getTime();
    return { letter, ms, date: d.getDate(), cup: cupDays.has(ms), today: ms === today };
  });
  return (
    <View style={styles.row}>
      <View style={styles.total}>
        <Text variant="labelEyebrow" color="primary" style={styles.totalLabel}>
          Cups total
        </Text>
        <Text variant="numeralHero" color="accent" style={styles.hero}>
          {String(total)}
        </Text>
      </View>
      <View style={styles.week}>
        <View style={styles.weekHead}>
          <Text variant="labelEyebrow" color="muted">
            This week
          </Text>
          <Text variant="displayLg" color="primary">
            {String(cupTimes.length)}
          </Text>
        </View>
        <View style={styles.strip}>
          {days.map((d) => (
            <View key={d.ms} style={styles.day} accessible accessibilityLabel={`${new Date(d.ms).toDateString()}${d.cup ? ', logged' : ''}${d.today ? ', today' : ''}`}>
              <Text variant="weekday" color={d.today ? 'primary' : 'muted'}>
                {d.letter}
              </Text>
              <View style={[styles.date, d.today ? styles.dateToday : styles.dateOther]}>
                <Text variant="meta" color={d.cup ? 'accent' : 'muted'}>
                  {String(d.date)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: space[14],
  },
  total: {
    flex: 1,
    // Centred against the week panel (on device it read low at the foot, 2026-10-12).
    justifyContent: 'center',
  },
  hero: {
    marginTop: -HERO_ABOVE_INK,
    marginBottom: -HERO_BELOW_INK,
  },
  totalLabel: {
    // §4: the hero numeral's ink fills its box, so the space is set here (D-34).
    marginBottom: space[12],
  },
  week: {
    width: '50%',
    backgroundColor: color.surface.sunken,
    padding: space[14],
    gap: spacing.gap.section,
  },
  weekHead: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: spacing.gap.row,
  },
  strip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  day: {
    alignItems: 'center',
    gap: spacing.gap.tight,
  },
  date: {
    paddingBottom: space[2],
  },
  dateToday: {
    borderBottomWidth: shape.borderWidth.box,
    borderBottomColor: color.border.strong,
  },
  // The underline's room on the other days, so every date sits on one line.
  dateOther: {
    marginBottom: shape.borderWidth.box,
  },
});
