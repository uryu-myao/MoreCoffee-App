import * as Haptics from 'expo-haptics';
import { memo, useContext, useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { component, motion, size, spacing, state, textStyle, texture } from '../../theme/tokens';
import { AxisPagerGestureContext } from './axisGestureContext';
import Button from './Button';
import { GESTURE_LOG, logGesture } from './gestureLog';
import Text from './Text';

/**
 * Taste axis slider (design-system.md §9 Taste axis slider).
 *
 * FIVE STEPS (2026-10-07): Strongly {low} · Leaning {low} · Balanced ·
 * Leaning {high} · Strongly {high}. Stored as 0–100 integer points, step i =
 * round(i × 100 / 4) = 0 / 25 / 50 / 75 / 100, so the step count can change
 * later without migrating data (old values snap to the nearest step).
 *
 * One rail in every state (axis.state.*.rail = the track); the needle carries
 * the state:
 *   empty    value null — muted needle resting at Balanced, a PLACEHOLDER,
 *            never a value
 *   lit      while the finger is on it — gold (icon.rating), scaled to
 *            state.pressed.scale (the needle is under 44pt, so it presses by
 *            scale, §1); motion.press in and out
 *   entered  the user's own step — accent
 * Nothing commits while the finger is down: release commits (onChange); a
 * gesture taken away restores the committed step. Clear (entered only) is the
 * one way back to empty.
 *
 * The 5 stops and the 3 reference lines sit on a track inset by half a needle
 * (6pt) from each rail end, so the needle never overhangs the rail at 0 / 100.
 *
 * Runs on the UI thread (Reanimated + gesture-handler, §1 Animation systems).
 *
 * Props
 *   from, to    pole labels (low pole on the left)
 *   value       0–100 or null (empty; operable axes only)
 *   derived     display axis (1b 4a 4b 5c) — temporary, until AxisReadout
 *   previous, caption   derived only (5c)
 *   onChange    (value | null) => void — on release, on tap, on Clear
 */

// ── Device-tuning constants (design-system.md §9: check on device) ──────────
/** Horizontal travel (pt) before the touch becomes an axis drag. */
const ACTIVE_OFFSET_X = 10;
/** Vertical travel (pt) that hands the touch to the scroll view instead. Vertical wins ties. */
const FAIL_OFFSET_Y = 10;
/** A tap may wander this far (pt) and still count as tap-to-set. */
const TAP_MAX_DISTANCE = 8;
// ────────────────────────────────────────────────────────────────────────────

const STATE = component.axis.state;
const RAIL_H = component.axis.rail.height;
const BAND_PAD = (size.tapTarget - RAIL_H) / 2;
/**
 * The touch band is a REAL view, BAND_PAD larger than the rail on every side
 * (negative margins cancel its padding, so layout does not move).
 *
 * Device logs (2026-10-08): every unwanted sheet page came from a touch the
 * axis never received (no axis BEGAN), started just outside the rail — where
 * the needle sits at 0 / 100. A gesture-handler hitSlop was tried first and
 * did NOT help: across both logs no axis touch ever began outside the rail
 * (every BEGAN had 0 ≤ x ≤ rail width). On iOS a touch outside a view's bounds
 * is hit-tested to the view underneath, so the axis's recognizer never sees
 * it; the hit area has to be the view's own bounds. 12pt still keeps it clear
 * of the screen-edge swipe (the rail starts 40pt in).
 */
const HIT = BAND_PAD;
const STEPS = 5;
const LAST = STEPS - 1;
const MIDDLE = LAST / 2;
/** Stops sit inside the rail by half the widest needle, so 0 and 100 never overhang. */
const INSET = STATE.entered.needle.w / 2;
const PRESS_MS = motion.press.duration;
const pressEasing = Easing.bezier(...motion.press.controlPoints);

const stepToValue = (i) => Math.round((i * 100) / LAST);
const valueToStep = (v) => Math.min(LAST, Math.max(0, Math.round((v / 100) * LAST)));

/** "Strongly acid" … "Balanced" … "Strongly bitter" — the screen-reader value. */
export function stepName(step, from, to) {
  const low = from.toLowerCase();
  const high = to.toLowerCase();
  return ['Strongly ' + low, 'Leaning ' + low, 'Balanced', 'Leaning ' + high, 'Strongly ' + high][step];
}

const selectionHaptic = () => {
  if (Platform.OS !== 'web') Haptics.selectionAsync();
};

function Rail({ part, inset }) {
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        { borderWidth: part.width, borderStyle: part.style, borderColor: part.color, backgroundColor: part.background },
      ]}>
      {/* Reference lines at the inner stops, on the same inset track as the needle. */}
      <View style={[styles.track, { left: Math.max(0, inset - part.width), right: Math.max(0, inset - part.width) }]} pointerEvents="none">
        {[1, 2, 3].map((i) => (
          <View key={i} style={[styles.ruleLine, { left: `${(i / LAST) * 100}%` }]} />
        ))}
      </View>
    </View>
  );
}

function Needle({ part, style }) {
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.needle,
        {
          width: part.w,
          height: part.h,
          marginLeft: -part.w / 2,
          top: (RAIL_H - part.h) / 2,
          backgroundColor: part.background,
          borderWidth: part.borderWidth,
          borderColor: part.borderColor,
        },
        style,
      ]}
    />
  );
}

/** A pole label: muted, with an ink copy over it that lights while leaning. */
function Pole({ label, litStyle, align }) {
  return (
    <View style={align === 'right' ? styles.poleRight : null}>
      <Text variant="labelEyebrow" color="muted">
        {label}
      </Text>
      <Animated.View style={[StyleSheet.absoluteFill, litStyle]} pointerEvents="none">
        <Text variant="labelEyebrow" color="primary" style={align === 'right' ? styles.textRight : null}>
          {label}
        </Text>
      </Animated.View>
    </View>
  );
}

function AxisSlider({ from, to, value = null, derived = false, previous, caption, onChange }) {
  const operable = !derived;
  const isEntered = operable && value != null;
  const committedStep = value == null ? MIDDLE : valueToStep(value);
  const pagerGesture = useContext(AxisPagerGestureContext);
  const who = `axis:${from}`;

  const trackW = useSharedValue(0); // the inset track the stops sit on
  const step = useSharedValue(committedStep);
  const dragging = useSharedValue(0);
  const enteredOn = useSharedValue(isEntered ? 1 : 0);
  const litOn = useSharedValue(0);
  const press = useSharedValue(1);

  useEffect(() => {
    step.value = committedStep;
    enteredOn.value = isEntered ? 1 : 0;
  }, [committedStep, enteredOn, isEntered, step]);

  const commit = (s) => onChange?.(stepToValue(s));
  const log = (st, extra) => logGesture(who, st, extra);

  const pressIn = () => {
    'worklet';
    litOn.value = withTiming(1, { duration: PRESS_MS, easing: pressEasing });
    press.value = withTiming(state.pressed.scale, { duration: PRESS_MS, easing: pressEasing });
  };
  const pressOut = () => {
    'worklet';
    litOn.value = withTiming(0, { duration: PRESS_MS, easing: pressEasing });
    press.value = withTiming(1, { duration: PRESS_MS, easing: pressEasing });
  };

  /** Move to the step under x (pt within the rail). Haptic per step change. */
  const setFromX = (x, logEnds) => {
    'worklet';
    if (trackW.value <= 0) return;
    const next = Math.min(LAST, Math.max(0, Math.round(((x - INSET) / trackW.value) * LAST)));
    if (next !== step.value) {
      step.value = next;
      scheduleOnRN(selectionHaptic);
      if (logEnds && (next === 0 || next === LAST)) scheduleOnRN(log, 'pan AT_END', `step=${next}`);
    }
  };

  const pan = Gesture.Pan()
    .enabled(operable)
    .activeOffsetX([-ACTIVE_OFFSET_X, ACTIVE_OFFSET_X])
    .failOffsetY([-FAIL_OFFSET_Y, FAIL_OFFSET_Y])

    .onBegin((e) => {
      pressIn();
      if (GESTURE_LOG) scheduleOnRN(log, 'pan BEGAN', `x=${(e.x - HIT).toFixed(1)}`);
    })
    .onStart((e) => {
      dragging.value = 1;
      setFromX(e.x - HIT, false);
      if (GESTURE_LOG) scheduleOnRN(log, 'pan ACTIVE', `x=${(e.x - HIT).toFixed(1)} step=${step.value}`);
    })
    .onUpdate((e) => {
      setFromX(e.x - HIT, GESTURE_LOG);
    })
    .onEnd((e, success) => {
      if (success) {
        enteredOn.value = 1; // stay entered across the JS round trip
        scheduleOnRN(commit, step.value);
      } else {
        step.value = committedStep; // taken away: back to exactly before
      }
      if (GESTURE_LOG) scheduleOnRN(log, success ? 'pan END' : 'pan CANCELLED', `x=${(e.x - HIT).toFixed(1)} step=${step.value}`);
    })
    .onFinalize((e, success) => {
      dragging.value = 0;
      pressOut();
      if (GESTURE_LOG && !success) scheduleOnRN(log, 'pan FAILED (finalize, never ended successfully)', `x=${(e.x - HIT).toFixed(1)}`);
    });

  const tap = Gesture.Tap()
    .enabled(operable)
    .maxDistance(TAP_MAX_DISTANCE)

    .onBegin(() => {
      if (GESTURE_LOG) scheduleOnRN(log, 'tap BEGAN');
    })
    .onEnd((e, success) => {
      if (!success) return;
      setFromX(e.x - HIT, false);
      enteredOn.value = 1;
      scheduleOnRN(commit, step.value);
      if (GESTURE_LOG) scheduleOnRN(log, 'tap END', `step=${step.value}`);
    })
    .onFinalize((e, success) => {
      if (GESTURE_LOG && !success) scheduleOnRN(log, 'tap FAILED');
    });

  // An enclosing pager (the Record sheet) waits for this axis to fail first.
  if (pagerGesture) {
    pan.blocksExternalGesture(pagerGesture);
    tap.blocksExternalGesture(pagerGesture);
  }
  const gesture = Gesture.Exclusive(pan, tap);

  const move = useAnimatedStyle(() => ({
    transform: [
      { translateX: withTiming((step.value / LAST) * trackW.value, { duration: PRESS_MS, easing: pressEasing }) },
      { scale: press.value },
    ],
  }));
  const enteredStyle = useAnimatedStyle(() => ({ opacity: enteredOn.value }));
  const litStyle = useAnimatedStyle(() => ({ opacity: litOn.value }));
  const lowLit = useAnimatedStyle(() => ({ opacity: dragging.value && step.value < MIDDLE ? 1 : 0 }));
  const highLit = useAnimatedStyle(() => ({ opacity: dragging.value && step.value > MIDDLE ? 1 : 0 }));

  // ── Screen reader: one step per swipe, the value read as the step's name ──
  const a11y = operable
    ? {
        accessible: true,
        accessibilityRole: 'adjustable',
        accessibilityLabel: `${from} to ${to}`,
        accessibilityValue: { text: value == null ? 'Not entered yet' : stepName(committedStep, from, to) },
        accessibilityActions: [{ name: 'increment' }, { name: 'decrement' }, ...(isEntered ? [{ name: 'clear', label: 'Clear' }] : [])],
        onAccessibilityAction: (e) => {
          // The first adjustment of an empty axis starts from Balanced.
          const base = value == null ? MIDDLE : committedStep;
          if (e.nativeEvent.actionName === 'increment') onChange?.(stepToValue(Math.min(LAST, base + 1)));
          if (e.nativeEvent.actionName === 'decrement') onChange?.(stepToValue(Math.max(0, base - 1)));
          if (e.nativeEvent.actionName === 'clear') onChange?.(null);
        },
      }
    : { accessible: true, accessibilityLabel: `${from} to ${to}`, accessibilityValue: { text: `${value} points` } };

  const rail = (
    <View style={styles.rail}>
      <Rail part={derived ? STATE.derived.rail : STATE.empty.rail} inset={derived ? 0 : INSET} />
      {derived && previous != null ? <GhostAndDelta from={previous} to={value} /> : null}
      <View
        style={[styles.track, { left: derived ? 0 : INSET, right: derived ? 0 : INSET }]}
        pointerEvents="none"
        onLayout={(e) => {
          trackW.value = e.nativeEvent.layout.width;
        }}>
        {derived ? (
          <Needle part={STATE.derived.needle} style={{ left: `${value}%` }} />
        ) : (
          <>
            <Needle part={STATE.empty.needle} style={move} />
            <Animated.View style={[StyleSheet.absoluteFill, enteredStyle]} pointerEvents="none">
              <Needle part={STATE.entered.needle} style={move} />
            </Animated.View>
            <Animated.View style={[StyleSheet.absoluteFill, litStyle]} pointerEvents="none">
              <Needle part={STATE.lit.needle} style={move} />
            </Animated.View>
          </>
        )}
      </View>
    </View>
  );

  const slot = derived ? (
    caption ? (
      <View style={styles.slot}>
        <Text variant="meta" color="muted">
          {caption}
        </Text>
      </View>
    ) : null
  ) : (
    <View style={styles.slot}>
      {isEntered ? (
        <Button variant="text" label="Clear" accessibilityLabel={`Clear ${from} to ${to}`} onPress={() => onChange?.(null)} />
      ) : (
        <Text variant="meta" color="muted">
          Not noted
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.axis} {...a11y}>
      <View style={styles.poles}>
        <Pole label={from} litStyle={lowLit} />
        <Pole label={to} litStyle={highLit} align="right" />
      </View>
      {operable ? (
        <GestureDetector gesture={gesture}>
          <View
            style={styles.hitArea}
            onLayout={
              GESTURE_LOG
                ? (e) => {
                    e.target?.measureInWindow?.((x, y, w, h) =>
                      logGesture(who, 'hit area', `window x ${x.toFixed(1)}–${(x + w).toFixed(1)}, y ${y.toFixed(1)}–${(y + h).toFixed(1)}`)
                    );
                  }
                : undefined
            }>
            {rail}
          </View>
        </GestureDetector>
      ) : (
        rail
      )}
      {slot}
    </View>
  );
}

export default memo(AxisSlider);

/** 5c: a ghost at the earlier value and a delta bar to the current one. (Until AxisReadout.) */
function GhostAndDelta({ from, to }) {
  const lo = Math.min(from, to);
  const hi = Math.max(from, to);
  const { ghost, delta } = component.axis;
  return (
    <>
      <View
        pointerEvents="none"
        style={{ position: 'absolute', left: `${lo}%`, width: `${hi - lo}%`, top: (RAIL_H - delta.height) / 2, height: delta.height, backgroundColor: delta.background }}
      />
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: `${from}%`,
          marginLeft: -ghost.w / 2,
          top: (RAIL_H - ghost.h) / 2,
          width: ghost.w,
          height: ghost.h,
          borderWidth: STATE.derived.rail.width,
          borderColor: ghost.borderColor,
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  axis: {
    gap: spacing.gap.row,
  },
  poles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  poleRight: {
    alignItems: 'flex-end',
  },
  textRight: {
    textAlign: 'right',
  },
  rail: {
    height: RAIL_H,
  },
  /** The real touch band: HIT bigger than the rail on every side, layout unchanged. */
  hitArea: {
    margin: -HIT,
    padding: HIT,
  },
  track: {
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
  ruleLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    marginLeft: -texture.rule.lineWidth / 2,
    width: texture.rule.lineWidth,
    backgroundColor: texture.rule.color,
  },
  needle: {
    position: 'absolute',
    left: 0,
  },
  /** Fixed height (one meta line): Not noted / Clear / caption swap without a jump. */
  slot: {
    height: textStyle.meta.lineHeight,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
});
