import * as Haptics from 'expo-haptics';
import { memo, useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { component, motion, size, spacing, state, textStyle } from '../../theme/tokens';
import Button from './Button';
import { GESTURE_LOG, logGesture } from './gestureLog';
import Text from './Text';

/**
 * Taste axis slider (design-system.md §9 Taste axis slider).
 *
 * FIVE STEPS: stored as 0–100 integer points, step i = round(i × 100 / 4) =
 * 0 / 25 / 50 / 75 / 100, so the step count can change later without migrating
 * data (old values snap to the nearest step). Each step has a name per axis
 * (`steps`, src/constants/tasteAxes.js), read by the screen reader.
 *
 * Look (2026-10-08, Uryu's screenshots, size B): a 260 × 34 track with a 2px
 * frame and a dot at each of the 5 stops; a SQUARE 26 handle inset 2 inside
 * it — the Switch knob's geometry. Dots say where you can stop, the handle
 * says where you are. The handle is always opaque and simply covers the dot
 * under it. The handle carries the state:
 *   empty    value null — muted square resting at Balanced, a PLACEHOLDER,
 *            never a value
 *   entered  the user's own step — accent square, ink frame
 * While the finger is down the handle scales to state.pressed.scale (it is
 * under 44pt, §1) for the whole touch; there is no lit colour any more. Steps
 * give a selection haptic. Nothing commits while the finger is down: release
 * commits (onChange); a gesture taken away restores the committed step.
 * Clear (entered only) is the one way back to empty. It sits right-aligned
 * under the track with "Not noted", and hides while dragging.
 *
 * Runs on the UI thread (Reanimated + gesture-handler, §1 Animation systems).
 *
 * Props
 *   from, to    pole labels (low pole on the left)
 *   steps       the five step names, low to high
 *   value       0–100 or null (empty)
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
/** A fixed-width track centred in its card; the pole labels sit at its ends. */
const RAIL_W = component.axis.rail.width;
const GRIP = component.axis.grip;
const DOT = component.axis.rail.dot;
const BORDER = STATE.entered.rail.width;
const HANDLE = STATE.entered.needle.w;
/**
 * Stops sit inside the frame by the inset plus half the handle, so the handle
 * never touches the frame at 0 / 100 (the Switch knob's 2pt). STOP0 is stop
 * 0's distance from the track's outer edge (17); the gestures use it.
 */
const TRACK_INSET = component.axis.rail.inset + HANDLE / 2;
const STOP0 = BORDER + TRACK_INSET;
const BAND_PAD = (size.tapTarget - RAIL_H) / 2;
/**
 * The touch band is a REAL view, BAND_PAD larger than the track on every side
 * (negative margins cancel its padding, so layout does not move). A
 * gesture-handler hitSlop does not work for this on iOS: a touch outside a
 * view's bounds is hit-tested to the view underneath (device logs, 2026-10-08).
 */
const HIT = BAND_PAD;
const STEPS = 5;
const LAST = STEPS - 1;
const MIDDLE = LAST / 2;
const PRESS_MS = motion.press.duration;
const pressEasing = Easing.bezier(...motion.press.controlPoints);

const stepToValue = (i) => Math.round((i * 100) / LAST);
const valueToStep = (v) => Math.min(LAST, Math.max(0, Math.round((v / 100) * LAST)));

const selectionHaptic = () => {
  if (Platform.OS !== 'web') Haptics.selectionAsync();
};

function Rail({ part }) {
  const innerH = RAIL_H - 2 * part.width;
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        { borderWidth: part.width, borderStyle: part.style, borderColor: part.color, backgroundColor: part.background },
      ]}>
      {/* A dot at every stop; the handle covers the one it sits on. */}
      <View style={[styles.track, { left: TRACK_INSET, right: TRACK_INSET }]} pointerEvents="none">
        {[0, 1, 2, 3, 4].map((i) => (
          <View key={i} style={[styles.dot, { left: `${(i / LAST) * 100}%`, top: (innerH - DOT) / 2, backgroundColor: part.dot }]} />
        ))}
      </View>
    </View>
  );
}

function Needle({ part, railWidth, style }) {
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.needle,
        {
          width: part.w,
          height: part.h,
          marginLeft: -part.w / 2,
          top: (RAIL_H - 2 * railWidth - part.h) / 2,
          backgroundColor: part.background,
          borderWidth: part.borderWidth,
          borderColor: part.borderColor,
        },
        style,
      ]}>
      {/* The grip: a short centre line, the handle's stroke wide. */}
      {part.grip ? <View style={[styles.grip, { backgroundColor: part.grip }]} /> : null}
    </Animated.View>
  );
}

function Pole({ label, align }) {
  return (
    <Text variant="labelCaps" color="muted" style={align === 'right' ? styles.textRight : null}>
      {label}
    </Text>
  );
}

function AxisSlider({ from, to, steps, value = null, onChange }) {
  const isEntered = value != null;
  const committedStep = value == null ? MIDDLE : valueToStep(value);
  const who = `axis:${from}`;

  const trackW = useSharedValue(0); // stop 0 to stop 4
  const step = useSharedValue(committedStep);
  const dragging = useSharedValue(0);
  const enteredOn = useSharedValue(isEntered ? 1 : 0);
  const press = useSharedValue(1);

  useEffect(() => {
    step.value = committedStep;
    enteredOn.value = isEntered ? 1 : 0;
  }, [committedStep, enteredOn, isEntered, step]);

  const commit = (s) => onChange?.(stepToValue(s));
  const log = (st, extra) => logGesture(who, st, extra);

  const pressIn = () => {
    'worklet';
    press.value = withTiming(state.pressed.scale, { duration: PRESS_MS, easing: pressEasing });
  };
  const pressOut = () => {
    'worklet';
    press.value = withTiming(1, { duration: PRESS_MS, easing: pressEasing });
  };

  /** Move to the step under x (pt from the track's outer left edge). Haptic per step change. */
  const setFromX = (x, logEnds) => {
    'worklet';
    if (trackW.value <= 0) return;
    const next = Math.min(LAST, Math.max(0, Math.round(((x - STOP0) / trackW.value) * LAST)));
    if (next !== step.value) {
      step.value = next;
      scheduleOnRN(selectionHaptic);
      if (logEnds && (next === 0 || next === LAST)) scheduleOnRN(log, 'pan AT_END', `step=${next}`);
    }
  };

  const pan = Gesture.Pan()
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

  const gesture = Gesture.Exclusive(pan, tap);

  const move = useAnimatedStyle(() => ({
    transform: [
      { translateX: withTiming((step.value / LAST) * trackW.value, { duration: PRESS_MS, easing: pressEasing }) },
      { scale: press.value },
    ],
  }));
  const enteredStyle = useAnimatedStyle(() => ({ opacity: enteredOn.value }));
  /** Clear hides while dragging. */
  const clearStyle = useAnimatedStyle(() => ({
    opacity: withTiming(dragging.value ? 0 : 1, { duration: PRESS_MS, easing: pressEasing }),
  }));

  // ── Screen reader: one step per swipe, the value read as the step's name ──
  const a11y = {
        accessible: true,
        accessibilityRole: 'adjustable',
        accessibilityLabel: `${from} to ${to}`,
        accessibilityValue: { text: value == null ? 'Not entered yet' : steps[committedStep] },
        accessibilityActions: [{ name: 'increment' }, { name: 'decrement' }, ...(isEntered ? [{ name: 'clear', label: 'Clear' }] : [])],
        onAccessibilityAction: (e) => {
          // The first adjustment of an empty axis starts from Balanced.
          const base = value == null ? MIDDLE : committedStep;
          if (e.nativeEvent.actionName === 'increment') onChange?.(stepToValue(Math.min(LAST, base + 1)));
          if (e.nativeEvent.actionName === 'decrement') onChange?.(stepToValue(Math.max(0, base - 1)));
          if (e.nativeEvent.actionName === 'clear') onChange?.(null);
        },
      };

  const railPart = STATE.empty.rail;
  const rail = (
    <View style={styles.rail}>
      <Rail part={railPart} />
      <View
        // The handle's layer sits INSIDE the 2px frame, like the dots' layer (a
        // child of the framed view). It used to start at the frame's outer edge,
        // which put the handle 2pt high and up to 1pt off the dots (2026-10-09).
        style={[styles.track, styles.trackOperable]}
        pointerEvents="none"
        onLayout={(e) => {
          trackW.value = e.nativeEvent.layout.width;
        }}>
        <Needle part={STATE.empty.needle} railWidth={railPart.width} style={move} />
        <Animated.View style={[StyleSheet.absoluteFill, enteredStyle]} pointerEvents="none">
          <Needle part={STATE.entered.needle} railWidth={railPart.width} style={move} />
        </Animated.View>
      </View>
    </View>
  );

  const slot = (
    <View style={styles.slot}>
      {isEntered ? (
        <Animated.View style={clearStyle}>
          <Button variant="text" small label="Clear" accessibilityLabel={`Clear ${from} to ${to}`} onPress={() => onChange?.(null)} />
        </Animated.View>
      ) : (
        <Text variant="meta" color="muted">
          Not noted
        </Text>
      )}
    </View>
  );

  return (
    <View style={[styles.axis, styles.axisSized]} {...a11y}>
      <View style={styles.poles}>
        <Pole label={from} />
        <Pole label={to} align="right" />
      </View>
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
      {slot}
    </View>
  );
}

export default memo(AxisSlider);


const styles = StyleSheet.create({
  axis: {},
  axisSized: {
    width: RAIL_W,
    alignSelf: 'center',
  },
  poles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.gap.row,
  },
  textRight: {
    textAlign: 'right',
  },
  rail: {
    height: RAIL_H,
  },
  /** The real touch band: HIT bigger than the track on every side, layout unchanged. */
  hitArea: {
    margin: -HIT,
    padding: HIT,
  },
  track: {
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
  trackOperable: {
    left: STOP0,
    right: STOP0,
    top: BORDER,
    bottom: BORDER,
  },
  needle: {
    position: 'absolute',
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grip: {
    width: GRIP.w,
    height: GRIP.h,
  },
  dot: {
    position: 'absolute',
    marginLeft: -DOT / 2,
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
  },
  /**
   * Fixed height (one meta line): Not noted / Clear / caption swap without a
   * jump. Right-aligned under the track (2026-10-08), gap.tight below it
   * (2026-10-09; was gap.row): the status belongs to its track.
   */
  slot: {
    marginTop: spacing.gap.tight,
    height: textStyle.meta.lineHeight,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
});
