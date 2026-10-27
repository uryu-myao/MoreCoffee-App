import { StyleSheet, View } from 'react-native';
import AxisReadout from '../../components/base/AxisReadout';
import Text from '../../components/base/Text';
import { spacing } from '../../theme/tokens';
import { HarnessCase, HarnessGroup, HarnessPage } from '../harness';

/** AxisReadout tones and 5c's ghost, side by side (decision aid, 2026-10-11). */
function Row({ label, ...p }) {
  return (
    <View style={styles.row}>
      <View style={styles.poles}>
        <Text variant="labelCaps" color="muted">
          Acid
        </Text>
        <Text variant="labelCaps" color="muted">
          Bitter
        </Text>
      </View>
      <AxisReadout {...p} />
      {label ? (
        <Text variant="meta" color="muted">
          {label}
        </Text>
      ) : null}
    </View>
  );
}

export default function AxisReadoutPage() {
  return (
    <HarnessPage>
      <HarnessGroup title="computed (1b / 4a / 4b / 8f)">
        <HarnessCase label="26 · 62 · 50 · null">
          <Row value={26} />
          <Row value={62} />
          <Row value={50} />
          <Row value={null} label="Not noted" />
        </HarnessCase>
      </HarnessGroup>
      <HarnessGroup title="entered (2c: this cup's own values)">
        <HarnessCase label="26 · 62 · 50 · null">
          <Row tone="entered" value={26} />
          <Row tone="entered" value={62} />
          <Row tone="entered" value={50} />
          <Row tone="entered" value={null} label="Not noted" />
        </HarnessCase>
      </HarnessGroup>
      <HarnessGroup title="5c per §9: both computed (profile before → after)">
        <HarnessCase label="44 → 38 (away from 50) · 30 → 36 (toward 50)">
          <Row previous={44} value={38} label="Moved 6 points toward Acid" />
          <Row previous={30} value={36} label="Moved 6 points toward Bitter" />
        </HarnessCase>
      </HarnessGroup>
      <HarnessGroup title="5c, the mixed idea: neutral ghost + brown current">
        <HarnessCase label="44 → 38 · 30 → 36">
          <Row tone="entered" previous={44} value={38} />
          <Row tone="entered" previous={30} value={36} />
        </HarnessCase>
      </HarnessGroup>
    </HarnessPage>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing.gap.row,
    marginBottom: spacing.gap.section,
  },
  poles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
