import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, StyleSheet, View } from 'react-native';
import { onNoticeRequest } from '../navigation';
import { color, layout, motion, size, space, spacing } from '../theme/tokens';
import Text from './base/Text';
import { useFooterHeight } from './FooterNav';

/**
 * 13a / 13b — the one-line notice after a delete ("Ethiopia Guji deleted."),
 * Design Round 5 (2026-10-13). AppShell mounts it over the tabs. Also after
 * 3f's Reopen ("Kenya Kirinyaga reopened.", 2026-10-14; the verb is ours).
 *
 *   look     surface.inverse + text.onInverse, square, no border, no shadow;
 *            min size.notice.minHeight (48), padding 16 a side; gap.section
 *            (12) above the bottom bar
 *   width    the screen gutter on both sides. The mock's 90% is the old
 *            floating bar's width; the built bar runs the full width with its
 *            icons inside layout.gutter, so the notice aligns with them
 *   copy     the name (noticeName, 1 line, truncates) + "deleted." (notice,
 *            never truncates). The name is the cup's 2a title (cupTitle)
 *   timing   motion.expand in (fade + rise 8), motion.notice.hold, the same
 *            out. Reduce Motion: fade only. Not pressable: touches pass
 *            through. No Undo (11b: it can't be undone)
 *   a11y     the sentence is announced
 * A new notice replaces the one showing.
 */
const easing = Easing.bezier(...motion.expand.controlPoints);
const RISE = space[8];

export default function Notice() {
  const bottom = useFooterHeight() + spacing.gap.section;
  const [notice, setNotice] = useState(null); // { name, key }
  const opacity = useRef(new Animated.Value(0)).current;
  const lift = useRef(new Animated.Value(0)).current;

  useEffect(
    () =>
      onNoticeRequest(({ name, verb = 'deleted' }) => {
        setNotice({ name, verb, key: Date.now() });
        AccessibilityInfo.announceForAccessibility(`${name} ${verb}.`);
      }),
    []
  );

  useEffect(() => {
    if (!notice) return undefined;
    let alive = true;
    let run = null;
    AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (!alive) return;
      opacity.setValue(0);
      lift.setValue(reduce ? 0 : RISE);
      const timing = (value, toValue) => Animated.timing(value, { toValue, duration: motion.expand.duration, easing, useNativeDriver: true });
      run = Animated.sequence([
        Animated.parallel([timing(opacity, 1), timing(lift, 0)]),
        Animated.delay(motion.notice.hold),
        timing(opacity, 0),
      ]);
      run.start(({ finished }) => finished && alive && setNotice(null));
    });
    return () => {
      alive = false;
      run?.stop();
    };
  }, [notice, opacity, lift]);

  if (!notice) return null;
  return (
    <Animated.View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.notice, { bottom, opacity, transform: [{ translateY: lift }] }]}>
      <View style={styles.name}>
        <Text variant="noticeName" color="onInverse" truncate="meta">
          {notice.name}
        </Text>
      </View>
      <Text variant="notice" color="onInverse">
        {`${notice.verb}.`}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  notice: {
    position: 'absolute',
    left: layout.gutter,
    right: layout.gutter,
    minHeight: size.notice.minHeight,
    paddingHorizontal: space[16],
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[4],
    backgroundColor: color.surface.inverse,
  },
  name: {
    flexShrink: 1,
  },
});
