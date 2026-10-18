import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { component, icon, motion, space, spacing } from '../theme/tokens';
import Glyph from './base/Glyph';
import Text from './base/Text';

const bar = component.requiredBar;
const expandEasing = Easing.bezier(...motion.expand.controlPoints);

/**
 * Log a cup's Required bar (5e, Design Round 9, 2026-10-18), in every mode:
 * what this cup still needs, counted live. It replaces the intro line.
 *
 * A surface.muted box in a 1.5 border.muted frame. Header row: "Required"
 * (label.eyebrow, ink), a sub-line (body.sm, text.secondary; the mock's 11 /
 * 500 has no style, folded to 12) and the count, "1/2" → "2/2". Under it one
 * slot per required field, sharing the width: filled = the mint band with a
 * green check and label, empty = a 1.5 dashed text.muted frame, no fill,
 * muted label. The
 * colours are status colours, not the active ink: nothing here is pressable.
 *
 * The count is text.muted below full and green once every slot is filled
 * (confirmed by Design, 2026-10-18). The padding folds the mock's 8 / 10 / 7
 * to space.8.
 *
 * The sub-line crossfades with motion.expand when the mode changes, the old
 * line laid over the new one (as the intro line did).
 *
 * Props
 *   note   the sub-line (one line)
 *   slots  [{ key, label, filled }]
 */
export default function RequiredBar({ note, slots }) {
  const done = slots.filter((s) => s.filled).length;
  const complete = done === slots.length;
  const summary = slots.map((s) => `${s.label} ${s.filled ? 'done' : 'missing'}`).join(', ');

  return (
    <View style={styles.bar} accessible accessibilityLabel={`Required, ${done} of ${slots.length}. ${note}. ${summary}`}>
      <View style={styles.head}>
        <Text variant="labelEyebrow" color="primary">
          Required
        </Text>
        <CrossfadeNote text={note} />
        <Text variant="labelCaps" color={complete ? bar.slot.filled.ink : 'muted'}>
          {`${done}/${slots.length}`}
        </Text>
      </View>
      <View style={styles.slots}>
        {slots.map((s) => (
          <View key={s.key} style={[styles.slot, s.filled ? styles.slotFilled : styles.slotEmpty]}>
            {s.filled ? <Glyph name="check" token={icon.xs} color={bar.slot.filled.ink} /> : null}
            <Text variant="labelEyebrow" color={s.filled ? bar.slot.filled.ink : bar.slot.empty.ink} truncate="meta">
              {s.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function CrossfadeNote({ text }) {
  const [shown, setShown] = useState({ current: text, previous: null });
  const fade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (text === shown.current) return;
    setShown({ current: text, previous: shown.current });
    fade.setValue(0);
    Animated.timing(fade, {
      toValue: 1,
      duration: motion.expand.duration,
      easing: expandEasing,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) setShown((s) => ({ ...s, previous: null }));
    });
    // shown.current is read, not tracked: only a new text starts a fade.
  }, [text, fade]);

  return (
    <View style={styles.note}>
      <Animated.View style={{ opacity: fade }}>
        {/* Keyed by the copy: a new line gets a new text node. */}
        <Text key={shown.current} variant="bodySm" color="secondary" truncate="meta">
          {shown.current}
        </Text>
      </Animated.View>
      {shown.previous ? (
        <Animated.View style={[styles.notePrevious, { opacity: fade.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }]}>
          <Text variant="bodySm" color="secondary" truncate="meta">
            {shown.previous}
          </Text>
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: bar.background,
    borderWidth: bar.border.width,
    borderColor: bar.border.color,
    padding: space[8],
    gap: space[6],
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.gap.row,
  },
  note: {
    flex: 1,
    minWidth: 0,
  },
  notePrevious: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  slots: {
    flexDirection: 'row',
    gap: space[4],
  },
  slot: {
    flex: 1,
    minWidth: 0,
    height: bar.slot.height,
    paddingHorizontal: space[8],
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[6],
  },
  slotFilled: {
    backgroundColor: bar.slot.filled.background,
  },
  slotEmpty: {
    borderWidth: bar.slot.empty.border.width,
    borderStyle: bar.slot.empty.border.style,
    borderColor: bar.slot.empty.border.color,
  },
});
