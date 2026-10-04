import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import SectionLabel from '../../components/base/SectionLabel';
import SegmentedControl from '../../components/base/SegmentedControl';
import { spacing } from '../../theme/tokens';
import { HarnessCase, HarnessGroup, HarnessPage } from '../harness';

const MAKERS = [
  { value: 'mine', label: 'I made it' },
  { value: 'barista', label: 'Barista' },
  { value: 'rtd', label: 'Ready-to-drink' },
];

const MAKERS_JA = [
  { value: 'mine', label: '自分で淹れた' },
  { value: 'barista', label: 'バリスタ' },
  { value: 'rtd', label: 'レディ・トゥ・ドリンク（缶・ボトル）' },
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
        <HarnessCase label="rtd">
          <SegmentedControl options={MAKERS} value="rtd" onChange={() => {}} />
        </HarnessCase>
        <HarnessCase label="none selected">
          <SegmentedControl options={MAKERS} value={null} onChange={() => {}} />
        </HarnessCase>
      </HarnessGroup>

      <HarnessGroup title="long copy (gaps.md 7)">
        <HarnessCase label="ja — chips wrap to a new row" framed>
          <Live options={MAKERS_JA} initial="barista" />
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
