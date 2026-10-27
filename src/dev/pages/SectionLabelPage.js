import SectionLabel from '../../components/base/SectionLabel';
import { HarnessCase, HarnessGroup, HarnessPage } from '../harness';

export default function SectionLabelPage() {
  return (
    <HarnessPage>
      <HarnessGroup title="statuses">
        <HarnessCase label="no status">
          <SectionLabel label="Tasting note" />
        </HarnessCase>
        <HarnessCase label="set (5a)">
          <SectionLabel label="How was it?" status="set" />
        </HarnessCase>
        <HarnessCase label="prefilled (5a)">
          <SectionLabel label="From my shelf" status="prefilled" />
        </HarnessCase>
        <HarnessCase label="required — error (5d)">
          <SectionLabel label="How was it?" status="required" />
        </HarnessCase>
        <HarnessCase label="missing — error, caller copy (5d)">
          <SectionLabel label="Café details" status="missing" statusLabel="1 of 2 missing" />
        </HarnessCase>
        <HarnessCase label="optional — grey bullet (5e)">
          <SectionLabel label="Bought at" status="optional" />
        </HarnessCase>
      </HarnessGroup>

      <HarnessGroup title="long copy">
        <HarnessCase label="long label wraps; status keeps its width" framed>
          <SectionLabel label="Where did you buy this bag and how much did it cost" status="prefilled" />
        </HarnessCase>
        <HarnessCase label="ja" framed>
          <SectionLabel label="誰が淹れた？" status="missing" statusLabel="2件中1件未入力" />
        </HarnessCase>
      </HarnessGroup>
    </HarnessPage>
  );
}
