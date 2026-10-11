import { StyleSheet, View } from 'react-native';
import { partOfDay } from '../constants/dates';
import { spacing } from '../theme/tokens';
import Text from './base/Text';

/**
 * The compact header's meta column for a moment: the date (label.caps, muted)
 * over "time · part of day" (label.caps, accent) — 5a's "Wed, Apr 8 /
 * 08:20 · Morning". Shared by 5a (now) and 2c (the cup's logged time), so no
 * screen builds its own header (2026-10-11).
 */
const dateFormat = new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
const timeFormat = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });

/** One line: "Wed, Apr 8 · 08:20 · Morning" (2c). */
export const whenLine = (at) => `${dateFormat.format(at)} · ${timeFormat.format(at)} · ${partOfDay(at)}`;

export default function WhenMeta({ at }) {
  return (
    <View style={styles.when}>
      <Text variant="labelCaps" color="muted">
        {dateFormat.format(at)}
      </Text>
      <Text variant="labelCaps" color="accent" style={styles.time}>
        {`${timeFormat.format(at)} · ${partOfDay(at)}`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  when: {
    alignItems: 'flex-end',
  },
  time: {
    marginTop: spacing.gap.tight,
  },
});
