import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import Button from '../components/base/Button';
import EmptySlot from '../components/base/EmptySlot';
import FieldRow from '../components/base/FieldRow';
import Glyph from '../components/base/Glyph';
import IconButton from '../components/base/IconButton';
import SectionLabel from '../components/base/SectionLabel';
import SegmentedControl from '../components/base/SegmentedControl';
import StarRating from '../components/base/StarRating';
import Text from '../components/base/Text';
import { color, icon, motion, shape, size, space, spacing, state } from '../theme/tokens';
import ScreenFrame from './ScreenFrame';

/**
 * Record coffee — 5a "Log a cup", static pass. All three maker modes; every
 * field set is the mock's sample (5a for I made it / Barista, 5e for
 * Packaged). Nothing is read or saved; rows render a chevron and do nothing.
 *
 * Switching modes keeps the rating (it is about the cup, not who made it),
 * resets the conditional field set (keyed by mode), and keeps the photo slot.
 *
 * Section spacing is gap.section (12); the source's 16 / 18 / 20 is drift.md D-13.
 */
const MAKERS = [
  { value: 'mine', label: 'I made it' },
  { value: 'barista', label: 'Barista' },
  { value: 'packaged', label: 'Packaged' },
];

const expandEasing = Easing.bezier(...motion.expand.controlPoints);

/**
 * The intro line per mode, each naming who made the cup. I made it is 5a
 * verbatim. Packaged is 5e with "Bottled" → "Packaged" (drift.md D-14: the
 * rename wins over the mock). No mock has a Barista line (5d replaces it with
 * the error summary), so it is written to 5e's pattern.
 */
const INTRO = {
  mine: 'Marked fields are required — all of them start pre-filled.',
  barista: 'Cups made for you skip beans and brewing — two fields left.',
  packaged: 'Packaged cups skip brewing and café — two fields left.',
};

/**
 * Crossfades from the previous line to the new one with the product's one
 * motion, so the copy eases with the field block instead of popping. The old
 * line sits over the new one while it fades out.
 */
function IntroText({ text }) {
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
    <View style={styles.introText}>
      <Animated.View style={{ opacity: fade }}>
        <Text variant="meta" color="muted">
          {shown.current}
        </Text>
      </Animated.View>
      {shown.previous ? (
        <Animated.View style={[styles.introPrevious, { opacity: fade.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }]}>
          <Text variant="meta" color="muted">
            {shown.previous}
          </Text>
        </Animated.View>
      ) : null}
    </View>
  );
}

function Section({ label, status, children }) {
  return (
    <View style={styles.section}>
      <SectionLabel label={label} status={status} />
      {children}
    </View>
  );
}

/* TODO(Step 5): rows open their pickers; tapping does nothing yet. */
function MineFields() {
  return (
    <Section label="From my shelf" status="prefilled">
      <View style={styles.card}>
        <FieldRow swatch label="Beans" value="Ethiopia Guji" meta="Blue Bottle · day 7, drink now" />
        <FieldRow divided label="Method" value="V60 · Comandante C40" meta="Your default brewer" />
      </View>
    </Section>
  );
}

function BaristaFields() {
  return (
    <Section label="Café details" status="prefilled">
      <View style={styles.card}>
        <FieldRow icon="pin" label="Café" value="Fuglen Tomigaya" meta="250 m away · your 4th visit" />
        <FieldRow divided label="Drink" value="Flat white" meta="What you ordered here last time" />
      </View>
    </Section>
  );
}

function PackagedFields() {
  return (
    <View style={styles.fieldSets}>
      <Section label="Product" status="prefilled">
        <View style={styles.card}>
          <FieldRow icon="can" label="Brand" value="Boss Craft · Black" meta="Bought twice in the last month" />
          <FieldRow divided label="Package" value="Can · 185 ml" meta="Chilled, unsweetened" />
        </View>
      </Section>
      <Section label="Bought at" status="optional">
        {/* Inline composition, 5e only (design-system.md §9 Bought at row): weak
            1.5px frame, inline bag glyph, name, right-aligned value, no chevron.
            A second occurrence promotes it to a base component. */}
        <View style={styles.weakFrame}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Bought at 7-Eleven · Tomigaya, ¥180"
            style={({ pressed }) => [styles.inlineRow, pressed && styles.inlineRowPressed]}>
            <Glyph name="bag" token={icon.md} color={color.icon.muted} />
            <Text variant="label" truncate="name" style={styles.inlineName}>
              7-Eleven · Tomigaya
            </Text>
            <Text variant="label" color="secondary">
              ¥180
            </Text>
          </Pressable>
        </View>
      </Section>
    </View>
  );
}

const FIELD_SETS = { mine: MineFields, barista: BaristaFields, packaged: PackagedFields };

/**
 * The block's height follows its content with the product's one motion
 * (motion.expand) — 5a's own mechanism: the new field set lays out at full
 * height inside a clipped wrapper, and the wrapper animates to it, so
 * everything below slides rather than jumps.
 */
function ExpandingBlock({ children }) {
  const height = useRef(new Animated.Value(0)).current;
  const [measured, setMeasured] = useState(false);
  const target = useRef(null);

  const onContentLayout = (e) => {
    const next = e.nativeEvent.layout.height;
    if (target.current === next) return;
    const first = target.current == null;
    target.current = next;
    if (first) {
      height.setValue(next);
      setMeasured(true);
      return;
    }
    Animated.timing(height, {
      toValue: next,
      duration: motion.expand.duration,
      easing: expandEasing,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => () => height.stopAnimation(), [height]);

  return (
    <Animated.View style={[styles.clip, measured && { height }]}>
      <View onLayout={onContentLayout}>{children}</View>
    </Animated.View>
  );
}

export default function RecordCoffeeScreen({ onClose }) {
  const [rating, setRating] = useState(4);
  const [maker, setMaker] = useState('mine');
  const Fields = FIELD_SETS[maker];

  return (
    <ScreenFrame
      scroll
      compact
      title="Log a cup"
      leading={<IconButton icon="close" accessibilityLabel="Close" onPress={onClose} />}
      meta={
        <View style={styles.when}>
          <Text variant="labelCaps" color="muted">
            Wed, Apr 8
          </Text>
          <Text variant="labelCaps" color="accent">
            08:20 · Morning
          </Text>
        </View>
      }
      footer={
        <>
          {/* TODO(Step 5): saving lands with the data layer; inert for now. */}
          <Button label="Save this cup" />
          {/* TODO(Step 5): opens the tasting note (5b). */}
          <Button variant="secondary" label="Add tasting note" trailingIcon="arrowRight" />
        </>
      }>
      <View style={styles.sections}>
        <ExpandingBlock>
          <View style={styles.hint}>
            <View style={styles.bullet} />
            <IntroText text={INTRO[maker]} />
          </View>
        </ExpandingBlock>

        <Section label="How was it?" status="set">
          <StarRating value={rating} onChange={setRating} caption="Would order again" />
        </Section>

        <Section label="Who made it?" status="set">
          <SegmentedControl options={MAKERS} value={maker} onChange={setMaker} />
        </Section>

        <ExpandingBlock>
          {/* Keyed by mode: a switch remounts the field set, so nothing carries over. */}
          <Fields key={maker} />
        </ExpandingBlock>

        {/* TODO(Step 5): opens the camera / library; inert for now. */}
        <EmptySlot icon="camera" label="Add a photo" tag="Optional" />
      </View>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  when: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: spacing.gap.row,
  },
  sections: {
    gap: spacing.gap.section,
  },
  fieldSets: {
    gap: spacing.gap.section,
  },
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.gap.row,
  },
  bullet: {
    width: size.dot.bullet,
    height: size.dot.bullet,
    backgroundColor: color.marker.required,
  },
  introText: {
    // Full row width, so the outgoing line never re-wraps to the new one's width.
    flex: 1,
  },
  introPrevious: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  section: {
    gap: spacing.gap.row,
  },
  card: {
    borderWidth: shape.borderWidth.box,
    borderColor: color.border.strong,
    backgroundColor: color.surface.raised,
  },
  clip: {
    overflow: 'hidden',
  },
  weakFrame: {
    borderWidth: shape.borderWidth.divider,
    borderColor: color.border.muted,
    backgroundColor: color.surface.raised,
  },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
    paddingVertical: spacing.inset.control.v,
    paddingHorizontal: spacing.inset.control.h,
  },
  inlineRowPressed: {
    backgroundColor: state.pressed.surface,
  },
  inlineName: {
    flex: 1,
  },
});
