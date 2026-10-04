import { StyleSheet, View } from 'react-native';
import FieldRow from '../../components/base/FieldRow';
import HardShadow from '../../components/base/HardShadow';
import SectionLabel from '../../components/base/SectionLabel';
import { color, shape, spacing, state } from '../../theme/tokens';
import { HarnessCase, HarnessGroup, HarnessPage } from '../harness';
import { SAMPLE } from '../samples';

/** The 2px-outlined card FieldRows sit in (design-system.md §9 Card). Harness-only. */
function Group({ error = false, children }) {
  return (
    <HardShadow shadow={error ? state.error.shadow : null}>
      <View style={[styles.group, error && styles.groupError]}>{children}</View>
    </HardShadow>
  );
}

export default function FieldRowPage() {
  return (
    <HarnessPage>
      <HarnessGroup title="leading">
        <HarnessCase label="empty swatch + meta (5a Beans)">
          <Group>
            <FieldRow swatch label="Beans" value="Ethiopia Guji" meta="Blue Bottle · day 7, drink now" />
          </Group>
        </HarnessCase>
        <HarnessCase label="icon in swatch (5a Café / Brand)">
          <Group>
            <FieldRow icon="pin" label="Café" value="Fuglen Tomigaya" meta="250 m away · your 4th visit" />
            <FieldRow divided icon="can" label="Brand" value="Boss Craft · Black" meta="Bought twice in the last month" />
          </Group>
        </HarnessCase>
        <HarnessCase label="no leading, divided (5a Method)">
          <Group>
            <FieldRow swatch label="Beans" value="Ethiopia Guji" meta="Blue Bottle · day 7, drink now" />
            <FieldRow divided label="Method" value="V60 · Comandante C40" meta="Your default brewer" />
          </Group>
        </HarnessCase>
        <HarnessCase label="no meta (5d Drink)">
          <Group>
            <FieldRow label="Drink" value="Flat white" />
          </Group>
        </HarnessCase>
      </HarnessGroup>

      <HarnessGroup title="error (5d)">
        <HarnessCase label="missing field with a valid sibling">
          <View style={styles.stack}>
            <SectionLabel label="Café details" status="missing" statusLabel="1 of 2 missing" />
            <Group error>
              <FieldRow
                error
                icon="pin"
                label="Café · required"
                value="Which café?"
                meta="Fuglen Tomigaya is 250 m away — or type a new one."
              />
              <FieldRow divided label="Drink" value="Flat white" />
            </Group>
          </View>
        </HarnessCase>
      </HarnessGroup>

      <HarnessGroup title="truncation">
        <HarnessCase label="long value (2 lines) + long meta (1 line) · en">
          <Group>
            <FieldRow swatch label="Beans" value={SAMPLE.name.en} meta={SAMPLE.meta.en} />
          </Group>
        </HarnessCase>
        <HarnessCase label="ja">
          <Group>
            <FieldRow icon="pin" label="Café" value={SAMPLE.cafe.ja} meta={SAMPLE.meta.ja} />
            <FieldRow divided swatch label="Beans" value={SAMPLE.name.ja} meta={SAMPLE.meta.ja} />
          </Group>
        </HarnessCase>
      </HarnessGroup>
    </HarnessPage>
  );
}

const styles = StyleSheet.create({
  group: {
    borderWidth: shape.borderWidth.box,
    borderColor: color.border.strong,
    backgroundColor: color.surface.raised,
  },
  groupError: {
    borderColor: state.error.border,
  },
  stack: {
    gap: spacing.gap.row,
  },
});
