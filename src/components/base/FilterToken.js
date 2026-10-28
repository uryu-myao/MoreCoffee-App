import { useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import { component, motion, size, state } from '../../theme/tokens';
import Glyph from './Glyph';
import Text from './Text';

/**
 * FilterToken (Design Round 15, 18x; new component): a filter held in the
 * search field — a Kind ("PACKAGED"), a Rating ("3★"), a bag or a piece of
 * gear. It can only be removed: a filter is not text, and editing "3★" into
 * "3★x" would make it a string search. A flavour is never a block (it is a
 * word query, plain text in the field).
 *
 *   look     component.filterToken: 30 tall, ink fill, label.caps on
 *            inverse, then the × (icon.xs)
 *   remove   the ×, whose touch area is size.tapTarget (44) around the
 *            glyph; the field also removes it on backspace (RecordsSearch)
 *   pressed  the × scales (state.pressed.scale over motion.press): it has no
 *            surface of its own (§1 Pressed)
 *
 * Props: label, onRemove
 */
const t = component.filterToken;
const pressEasing = Easing.bezier(...motion.press.controlPoints);
// The × reaches past the block to the 44 target on every side.
const SLOP_V = (size.tapTarget - t.height) / 2;
const SLOP_H = (size.tapTarget - t.close.size) / 2;
const HIT_SLOP = { top: SLOP_V, bottom: SLOP_V, left: SLOP_H, right: SLOP_H };

export default function FilterToken({ label, onRemove }) {
  const scale = useRef(new Animated.Value(1)).current;
  const scaleTo = (toValue) =>
    Animated.timing(scale, { toValue, duration: motion.press.duration, easing: pressEasing, useNativeDriver: true }).start();
  return (
    <View style={styles.token} accessible={false}>
      <Text variant="labelCaps" color={t.label} numberOfLines={1} style={styles.label}>
        {label}
      </Text>
      <Pressable
        onPress={onRemove}
        onPressIn={() => scaleTo(state.pressed.scale)}
        onPressOut={() => scaleTo(1)}
        hitSlop={HIT_SLOP}
        accessibilityRole="button"
        accessibilityLabel={`Remove ${label}`}>
        <Animated.View style={{ transform: [{ scale }] }}>
          <Glyph name="close" token={t.close} color={t.label} />
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  token: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    gap: t.gap,
    height: t.height,
    paddingHorizontal: t.inset.h,
    backgroundColor: t.background,
  },
  label: {
    flexShrink: 1,
  },
});
