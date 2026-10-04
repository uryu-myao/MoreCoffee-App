import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import SectionLabel from '../../components/base/SectionLabel';
import SegmentedControl from '../../components/base/SegmentedControl';
import { spacing } from '../../theme/tokens';
import { HarnessCase, HarnessGroup, HarnessPage } from '../harness';

const MAKERS = [
  { value: 'mine', label: 'I made it' },
  { value: 'barista', label: 'Barista' },
  { value: 'packaged', label: 'Packaged' },
];

const MAKERS_JA = [
  { value: 'mine', label: '自分で淹れた' },
  { value: 'barista', label: 'バリスタ' },
  { value: 'packaged', label: '市販品' },
];

// Only 市販品 / 市售 are decided (design/i18n-notes.md); the rest are placeholders.
const MAKERS_ZH = [
  { value: 'mine', label: '自己冲的' },
  { value: 'barista', label: '咖啡师' },
  { value: 'packaged', label: '市售' },
];

function Live({ options, initial }) {
  const [value, setValue] = useState(initial);
  return <SegmentedControl options={options} value={value} onChange={setValue} />;
}

export default function SegmentedControlPage() {
  return (
    <HarnessPage>
      <HarnessGroup title="in context (5a)">
        <HarnessCase label="live — tap a chip">
          <View style={styles.stack}>
            <SectionLabel label="Who made it?" status="set" />
            <Live options={MAKERS} initial="mine" />
          </View>
        </HarnessCase>
      </HarnessGroup>

      <HarnessGroup title="selected">
        <HarnessCase label="mine">
          <SegmentedControl options={MAKERS} value="mine" onChange={() => {}} />
        </HarnessCase>
        <HarnessCase label="barista (5d)">
          <SegmentedControl options={MAKERS} value="barista" onChange={() => {}} />
        </HarnessCase>
        <HarnessCase label="packaged">
          <SegmentedControl options={MAKERS} value="packaged" onChange={() => {}} />
        </HarnessCase>
        <HarnessCase label="none selected">
          <SegmentedControl options={MAKERS} value={null} onChange={() => {}} />
        </HarnessCase>
      </HarnessGroup>

      <HarnessGroup title="translated copy (gaps.md 7)">
        <HarnessCase label="ja" framed>
          <Live options={MAKERS_JA} initial="barista" />
        </HarnessCase>
        <HarnessCase label="zh" framed>
          <Live options={MAKERS_ZH} initial="packaged" />
        </HarnessCase>
      </HarnessGroup>
    </HarnessPage>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: spacing.gap.row,
  },
});
