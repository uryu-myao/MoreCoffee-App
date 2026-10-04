import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import SectionLabel from '../../components/base/SectionLabel';
import StarRating from '../../components/base/StarRating';
import { spacing } from '../../theme/tokens';
import { HarnessCase, HarnessGroup, HarnessPage } from '../harness';

function Live() {
  const [value, setValue] = useState(0);
  return (
    <View style={styles.stack}>
      <SectionLabel label="How was it?" status={value ? 'set' : 'required'} />
      <StarRating
        value={value}
        onChange={setValue}
        caption={value ? `${value} of 5` : undefined}
        error={value ? undefined : "Tap a star — this is the one thing the app can't guess."}
      />
    </View>
  );
}

export default function StarRatingPage() {
  return (
    <HarnessPage>
      <HarnessGroup title="live — tap a star (haptic on device)">
        <HarnessCase label="starts in the 5d error state; clears once rated">
          <Live />
        </HarnessCase>
      </HarnessGroup>

      <HarnessGroup title="states">
        <HarnessCase label="rated + caption (5a)">
          <View style={styles.stack}>
            <SectionLabel label="How was it?" status="set" />
            <StarRating value={4} caption="Would order again" />
          </View>
        </HarnessCase>
        <HarnessCase label="unrated, no caption">
          <StarRating value={0} />
        </HarnessCase>
        <HarnessCase label="required — error (5d)">
          <View style={styles.stack}>
            <SectionLabel label="How was it?" status="required" />
            <StarRating value={0} error="Tap a star — this is the one thing the app can't guess." />
          </View>
        </HarnessCase>
      </HarnessGroup>

      <HarnessGroup title="values">
        {[1, 2, 3, 4, 5].map((n) => (
          <HarnessCase key={n} label={`value ${n}`}>
            <StarRating value={n} />
          </HarnessCase>
        ))}
      </HarnessGroup>

      <HarnessGroup title="long copy">
        <HarnessCase label="ja error wraps">
          <StarRating value={0} error="星をタップしてください。評価だけはアプリが推測できない唯一の項目です。" />
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
