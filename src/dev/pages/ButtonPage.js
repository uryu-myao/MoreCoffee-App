import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Button from '../../components/base/Button';
import Text from '../../components/base/Text';
import { spacing } from '../../theme/tokens';
import { HarnessCase, HarnessGroup, HarnessPage } from '../harness';

function Live() {
  const [count, setCount] = useState(0);
  return (
    <View style={styles.stack}>
      <Button label="Save this cup" onPress={() => setCount((c) => c + 1)} />
      <Text variant="meta" color="muted">{`pressed ${count}×`}</Text>
    </View>
  );
}

export default function ButtonPage() {
  return (
    <HarnessPage>
      <HarnessGroup title="variants">
        <HarnessCase label="primary (5a Save this cup)">
          <Button label="Save this cup" onPress={() => {}} />
        </HarnessCase>
        <HarnessCase label="secondary">
          <Button variant="secondary" label="Add tasting note" onPress={() => {}} />
        </HarnessCase>
      </HarnessGroup>

      <HarnessGroup title="pressed (fill darkens; outline, label, shadow stay)">
        <HarnessCase label="primary, pressed — state.pressed.action">
          <Button label="Save this cup" testOnly_pressed onPress={() => {}} />
        </HarnessCase>
        <HarnessCase label="secondary, pressed — state.pressed.surface">
          <Button variant="secondary" label="Add tasting note" testOnly_pressed onPress={() => {}} />
        </HarnessCase>
      </HarnessGroup>

      <HarnessGroup title="disabled">
        <HarnessCase label="primary, disabled (does not respond to press)">
          <Button label="Save this cup" disabled testOnly_pressed onPress={() => {}} />
        </HarnessCase>
        <HarnessCase label="secondary, disabled">
          <Button variant="secondary" label="Add tasting note" disabled onPress={() => {}} />
        </HarnessCase>
      </HarnessGroup>

      <HarnessGroup title="trailing icon (5a Add tasting note →)">
        <HarnessCase label="secondary + arrowRight">
          <Button variant="secondary" label="Add tasting note" trailingIcon="arrowRight" onPress={() => {}} />
        </HarnessCase>
        <HarnessCase label="primary + arrowRight (icon takes onAction)">
          <Button label="Save this cup" trailingIcon="arrowRight" onPress={() => {}} />
        </HarnessCase>
        <HarnessCase label="secondary + icon, pressed">
          <Button variant="secondary" label="Add tasting note" trailingIcon="arrowRight" testOnly_pressed onPress={() => {}} />
        </HarnessCase>
        <HarnessCase label="secondary + icon, disabled (icon muted)">
          <Button variant="secondary" label="Add tasting note" trailingIcon="arrowRight" disabled onPress={() => {}} />
        </HarnessCase>
        <HarnessCase label="long label + icon">
          <Button variant="secondary" label="Add a tasting note for this cup" trailingIcon="arrowRight" onPress={() => {}} />
        </HarnessCase>
      </HarnessGroup>

      <HarnessGroup title="in a footer stack (5a)">
        <HarnessCase label="primary over secondary — gap.section">
          <View style={styles.footer}>
            <Button label="Save this cup" onPress={() => {}} />
            <Button variant="secondary" label="Add tasting note" trailingIcon="arrowRight" onPress={() => {}} />
          </View>
        </HarnessCase>
      </HarnessGroup>

      <HarnessGroup title="live">
        <HarnessCase label="onPress counts taps">
          <Live />
        </HarnessCase>
      </HarnessGroup>

      <HarnessGroup title="long copy">
        <HarnessCase label="ja">
          <Button label="この一杯を保存する" onPress={() => {}} />
        </HarnessCase>
      </HarnessGroup>
    </HarnessPage>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: spacing.gap.row,
  },
  footer: {
    gap: spacing.gap.section,
  },
});
