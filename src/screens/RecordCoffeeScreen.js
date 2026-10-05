import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Button from '../components/base/Button';
import EmptySlot from '../components/base/EmptySlot';
import FieldRow from '../components/base/FieldRow';
import IconButton from '../components/base/IconButton';
import SectionLabel from '../components/base/SectionLabel';
import SegmentedControl from '../components/base/SegmentedControl';
import StarRating from '../components/base/StarRating';
import Text from '../components/base/Text';
import { color, shape, size, spacing } from '../theme/tokens';
import ScreenFrame from './ScreenFrame';

/**
 * Record coffee — 5a "Log a cup", static pass, I MADE IT mode only.
 * All content is the 5a sample; nothing is read or saved.
 *
 * Section spacing is gap.section (12); the source's 16 / 20 is drift.md D-13.
 */
const MAKERS = [
  { value: 'mine', label: 'I made it' },
  { value: 'barista', label: 'Barista' },
  { value: 'packaged', label: 'Packaged' },
];

function Section({ label, status, children }) {
  return (
    <View style={styles.section}>
      <SectionLabel label={label} status={status} />
      {children}
    </View>
  );
}

export default function RecordCoffeeScreen({ onClose }) {
  const [rating, setRating] = useState(4);
  const [maker, setMaker] = useState('mine');

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
        <View style={styles.hint}>
          <View style={styles.bullet} />
          <Text variant="meta" color="muted" style={styles.hintText}>
            Marked fields are required — all of them start pre-filled.
          </Text>
        </View>

        <Section label="How was it?" status="set">
          <StarRating value={rating} onChange={setRating} caption="Would order again" />
        </Section>

        <Section label="Who made it?" status="set">
          <SegmentedControl options={MAKERS} value={maker} onChange={setMaker} />
        </Section>

        {/* TODO(Step 5): Barista (café details) and Packaged (product) field
            sets, with the height expand (motion.expand) on switch. Until then,
            those modes show nothing here. */}
        {maker === 'mine' ? (
          <Section label="From my shelf" status="prefilled">
            <View style={styles.card}>
              {/* TODO(Step 5): rows open their pickers; tapping does nothing yet. */}
              <FieldRow swatch label="Beans" value="Ethiopia Guji" meta="Blue Bottle · day 7, drink now" />
              <FieldRow divided label="Method" value="V60 · Comandante C40" meta="Your default brewer" />
            </View>
          </Section>
        ) : null}

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
  hintText: {
    flexShrink: 1,
  },
  section: {
    gap: spacing.gap.row,
  },
  card: {
    borderWidth: shape.borderWidth.box,
    borderColor: color.border.strong,
    backgroundColor: color.surface.raised,
  },
});
