import { View } from 'react-native';
import Badge from '../../components/base/Badge';
import RecordRow from '../../components/base/RecordRow';
import { spacing } from '../../theme/tokens';
import { HarnessCase, HarnessGroup, HarnessPage } from '../harness';
import { SAMPLE } from '../samples';

export default function RecordRowPage() {
  return (
    <HarnessPage>
      <HarnessGroup title="Badge · tones (inline)">
        <HarnessCase label="success (I made it) · info (Barista) · neutral (Packaged) · accent · raised · selected">
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.gap.row }}>
            <Badge label="I made it" tone="success" />
            <Badge label="Barista" tone="info" />
            <Badge label="Packaged" tone="neutral" />
            <Badge label="Accent" tone="accent" />
            <Badge label="Raised" tone="raised" />
            <Badge label="Selected" tone="selected" />
          </View>
        </HarnessCase>
        <HarnessCase label="standalone placement">
          <Badge label="Early signs" tone="accent" placement="standalone" />
        </HarnessCase>
      </HarnessGroup>

      <HarnessGroup title="RecordRow · by mode (2a, D-16 source lines)">
        <HarnessCase label="made_it — bean, roaster · process, note">
          <RecordRow title="Ethiopia Guji" badges={[{ label: 'I made it', tone: 'success' }]} source="Blue Bottle · Washed" note="Floral, peach" rating={4} date="Apr 8" />
        </HarnessCase>
        <HarnessCase label="barista — drink, place only">
          <RecordRow title="House espresso" badges={[{ label: 'Barista', tone: 'info' }]} source="Fuglen Tomigaya" note="Cocoa, walnut" rating={5} date="Apr 7" />
        </HarnessCase>
        <HarnessCase label="packaged — product, brand only, no note">
          <RecordRow title="Black" badges={[{ label: 'Packaged', tone: 'neutral' }]} source="Boss Craft" rating={3} date="Apr 6" />
        </HarnessCase>
      </HarnessGroup>

      <HarnessGroup title="RecordRow · edges">
        <HarnessCase label="no source, no note">
          <RecordRow title="Flat white" badges={[{ label: 'Barista', tone: 'info' }]} rating={1} date="Oct 5" />
        </HarnessCase>
        <HarnessCase label="long title (2 lines) + long note (3 lines) · en">
          <RecordRow title={SAMPLE.name.en} badges={[{ label: 'I made it', tone: 'success' }]} source={SAMPLE.meta.en} note={SAMPLE.note.en} rating={2} date="Sep 30" />
        </HarnessCase>
        <HarnessCase label="ja">
          <RecordRow title={SAMPLE.name.ja} badges={[{ label: 'I made it', tone: 'success' }]} source={SAMPLE.meta.ja} note={SAMPLE.note.ja} rating={5} date="10月5日" />
        </HarnessCase>
      </HarnessGroup>
    </HarnessPage>
  );
}
