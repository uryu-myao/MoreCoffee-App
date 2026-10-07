import * as Haptics from 'expo-haptics';
import { memo, useContext, useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { component, motion, size, spacing, textStyle, texture } from '../../theme/tokens';
import { AxisPagerGestureContext } from './axisGestureContext';
import Button from './Button';
import Text from './Text';

/**
 * Taste axis slider (design-system.md §9 Taste axis slider).
 *
 * One axis state decides rail and needle together (component.axis.state):
 *   derived      computed / historical value — display only, never operable
 *   empty        no value yet (value null) — operable
 *   provisional  an empty axis while the finger is on it: needle entered,
 *                rail still empty, nothing committed (internal, never a prop)
 *   entered      the user's own value — operable; adjusting it stays entered
 *
 * The state is not a prop: `derived` plus `value` decide it (null → empty,
 * a number → entered), so a state and a value can never disagree.
 *
 * Values are integer points 0–100. Nothing commits while the finger is down:
 * release commits (onChange), and a gesture taken over by scroll reverts.
 * Clear (entered only) is the one way back to empty.
 *
 * The drag runs on the UI thread (Reanimated + gesture-handler, §1 Animation
 * systems). JS sees only the commit and the revert.
 *
 * Props
 *   from, to    pole labels (low pole on the left)
 *   value       0–100, or null (empty; operable axes only)
 *   derived     display axis (1b 4a 4b 5c): not operable, no touch band
 *   previous    derived only: the earlier value — draws the ghost + delta (5c)
 *   caption     derived only: the line under the rail (5c's movement copy)
 *   onChange    (value | null) => void — on release, on tap, on Clear
 *   onGestureActive  (active: boolean) => void — touch down / finalize, so a
 *               parent horizontal pager can stand aside (the Record sheet)
 */

// ── Device-tuning constants (design-system.md §9: check on device) ──────────
/**
 * Empty → entered crossfade. motion.expand (340ms) is the spec. For the device
 * comparison set CROSSFADE_DEBUG_MS = 150 and reload; null uses the spec.
 */
const CROSSFADE_DEBUG_MS = null;
/** Horizontal travel (pt) before the touch becomes an axis drag. gesture-handler's common value. */
const ACTIVE_OFFSET_X = 10;
/** Vertical travel (pt) that hands the touch to the scroll view instead. Vertical wins ties (§9). */
const FAIL_OFFSET_Y = 10;
/** A tap may wander this far (pt) and still count as a tap-to-set. */
const TAP_MAX_DISTANCE = 8;
// ────────────────────────────────────────────────────────────────────────────

const STATE = component.axis.state;
const RAIL_H = component.axis.rail.height;
/** The touch band reaches size.tapTarget (44) around the 20pt rail. */
const BAND_PAD = (size.tapTarget - RAIL_H) / 2;
const RULE_STOPS = [0.25, 0.5, 0.75];
/** Pole emphasis: inside 45–55 neither pole lights (the middle). */
const DEAD_LOW = 45;
const DEAD_HIGH = 55;
/** The empty needle's resting place. A placeholder, never a value. */
const PLACEHOLDER = 50;
const CROSSFADE_MS = CROSSFADE_DEBUG_MS ?? motion.expand.duration;
const crossfadeEasing = Easing.bezier(...motion.expand.controlPoints);

const selectionHaptic = () => {
  if (Platform.OS !== 'web') Haptics.selectionAsync();
};

function Rail({ part }) {
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        { borderWidth: part.width, borderStyle: part.style, borderColor: part.color, backgroundColor: part.background },
      ]}>
      {RULE_STOPS.map((p) => (
        <View
          key={p}
          style={[styles.ruleLine, { left: `${p * 100}%` }]}
        />
      ))}
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

/** A pole label: muted, with an ink copy laid over it that lights while leaning. */
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

function AxisSlider({ from, to, value = null, derived = false, previous, caption, onChange, onGestureActive }) {
  const operable = !derived;
  const isEntered = operable && value != null;
  const pagerGesture = useContext(AxisPagerGestureContext);

  const width = useSharedValue(0);
  const pos = useSharedValue(value ?? PLACEHOLDER); // points, on the UI thread
  const dragging = useSharedValue(0);
  const committed = useSharedValue(isEntered ? 1 : 0); // needle shows entered
  const railEntered = useSharedValue(isEntered ? 1 : 0); // rail crossfade

  // Props are the committed truth; follow them when they change.
  useEffect(() => {
    pos.value = value ?? PLACEHOLDER;
    committed.value = isEntered ? 1 : 0;
    railEntered.value = withTiming(isEntered ? 1 : 0, { duration: CROSSFADE_MS, easing: crossfadeEasing });
  }, [committed, isEntered, pos, railEntered, value]);

  const commit = (v) => onChange?.(v);
  const gestureActive = (active) => onGestureActive?.(active);

  const setFromX = (x) => {
    'worklet';
    if (width.value <= 0) return;
    const next = Math.min(100, Math.max(0, Math.round((x / width.value) * 100)));
    const prev = pos.value;
    // A selection haptic per reference line crossed (25 / 50 / 75); no snapping.
    for (let i = 0; i < RULE_STOPS.length; i++) {
      const tick = RULE_STOPS[i] * 100;
      if ((prev < tick && next >= tick) || (prev > tick && next <= tick)) {
        scheduleOnRN(selectionHaptic);
        break;
      }
    }
    pos.value = next;
  };

  const committedValue = value;
  const pan = Gesture.Pan()
    .enabled(operable)
    .activeOffsetX([-ACTIVE_OFFSET_X, ACTIVE_OFFSET_X])
    .failOffsetY([-FAIL_OFFSET_Y, FAIL_OFFSET_Y])
    .hitSlop({ top: BAND_PAD, bottom: BAND_PAD })
    .onTouchesDown(() => {
      scheduleOnRN(gestureActive, true);
    })
    .onStart((e) => {
      dragging.value = 1; // empty → provisional (needle entered, rail untouched)
      setFromX(e.x);
    })
    .onUpdate((e) => {
      setFromX(e.x);
    })
    .onEnd((e, success) => {
      if (success) {
        committed.value = 1; // keep the entered needle across the JS round trip
        scheduleOnRN(commit, pos.value);
      } else {
        pos.value = committedValue ?? PLACEHOLDER; // taken over: back to exactly before
      }
    })
    .onFinalize(() => {
      dragging.value = 0;
      scheduleOnRN(gestureActive, false);
    });

  const tap = Gesture.Tap()
    .enabled(operable)
    .maxDistance(TAP_MAX_DISTANCE)
    .hitSlop({ top: BAND_PAD, bottom: BAND_PAD })
    .onEnd((e, success) => {
      if (!success) return;
      setFromX(e.x);
      committed.value = 1;
      scheduleOnRN(commit, pos.value);
    });

  // An enclosing pager (the Record sheet) waits for this axis to fail first.
  if (pagerGesture) {
    pan.blocksExternalGesture(pagerGesture);
    tap.blocksExternalGesture(pagerGesture);
  }
  const gesture = Gesture.Exclusive(pan, tap);

  const needleMove = useAnimatedStyle(() => ({ transform: [{ translateX: (pos.value / 100) * width.value }] }));
  const enteredNeedle = useAnimatedStyle(() => ({
    opacity: Math.max(committed.value, dragging.value),
    transform: [{ translateX: (pos.value / 100) * width.value }],
  }));
  const enteredRail = useAnimatedStyle(() => ({ opacity: railEntered.value }));
  const lowLit = useAnimatedStyle(() => ({ opacity: dragging.value && pos.value < DEAD_LOW ? 1 : 0 }));
  const highLit = useAnimatedStyle(() => ({ opacity: dragging.value && pos.value > DEAD_HIGH ? 1 : 0 }));

  // ── Screen reader ───────────────────────────────────────────────────────
  const lean = value == null ? '' : value < DEAD_LOW ? `, leaning ${from.toLowerCase()}` : value > DEAD_HIGH ? `, leaning ${to.toLowerCase()}` : ', middle';
  const a11yText = value == null ? 'Not entered yet' : `${value} points${lean}`;
  const a11y = operable
    ? {
        accessible: true,
        accessibilityRole: 'adjustable',
        accessibilityLabel: `${from} to ${to}`,
        accessibilityValue: { min: 0, max: 100, now: value ?? undefined, text: a11yText },
        accessibilityActions: [{ name: 'increment' }, { name: 'decrement' }, ...(isEntered ? [{ name: 'clear', label: 'Clear' }] : [])],
        onAccessibilityAction: (e) => {
          const base = value ?? PLACEHOLDER; // the first adjustment of an empty axis starts from 50
          if (e.nativeEvent.actionName === 'increment') onChange?.(Math.min(100, base + 5));
          if (e.nativeEvent.actionName === 'decrement') onChange?.(Math.max(0, base - 5));
          if (e.nativeEvent.actionName === 'clear') onChange?.(null);
        },
      }
    : { accessible: true, accessibilityLabel: `${from} to ${to}`, accessibilityValue: { text: `${value} points` } };

  const rail = (
    <View
      style={styles.rail}
      onLayout={(e) => {
        width.value = e.nativeEvent.layout.width;
      }}>
      {derived ? (
        <Rail part={STATE.derived.rail} />
      ) : (
        <>
          <Rail part={STATE.empty.rail} />
          <Animated.View style={[StyleSheet.absoluteFill, enteredRail]} pointerEvents="none">
            <Rail part={STATE.entered.rail} />
          </Animated.View>
        </>
      )}
      {derived && previous != null ? <GhostAndDelta from={previous} to={value} /> : null}
      <Needle part={derived ? STATE.derived.needle : STATE.empty.needle} style={needleMove} />
      {operable ? <Needle part={STATE.entered.needle} style={enteredNeedle} /> : null}
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
      {operable ? <GestureDetector gesture={gesture}>{rail}</GestureDetector> : rail}
      {slot}
    </View>
  );
}

export default memo(AxisSlider);

/** 5c: a ghost at the earlier value and a delta bar to the current one. */
function GhostAndDelta({ from, to }) {
  const lo = Math.min(from, to);
  const hi = Math.max(from, to);
  const { ghost, delta } = component.axis;
  return (
    <>
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: `${lo}%`,
          width: `${hi - lo}%`,
          top: (RAIL_H - delta.height) / 2,
          height: delta.height,
          backgroundColor: delta.background,
        }}
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
