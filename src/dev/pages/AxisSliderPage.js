import { useState } from 'react';
import AxisSlider from '../../components/base/AxisSlider';
import EmptySlot from '../../components/base/EmptySlot';
import { HarnessCase, HarnessGroup, HarnessPage } from '../harness';

/**
 * AxisSlider states (five steps, one rail; the needle carries the state),
 * plus the dashed borders left in the product — border.addSlot (#6B5D55) and
 * .inert — and the old derived display axis, until AxisReadout replaces it.
 */
export default function AxisSliderPage() {
  const [empty, setEmpty] = useState(null);
  const [entered, setEntered] = useState(38);

  return (
    <HarnessPage>
      <HarnessGroup title="operable (drag, tap, Clear)">
        <HarnessCase label="empty — muted needle resting at Balanced (a placeholder)">
          <AxisSlider from="Low sweetness" to="High sweetness" value={empty} onChange={setEmpty} />
        </HarnessCase>
        <HarnessCase label="entered — accent needle, Clear; touch lights it gold">
          <AxisSlider from="Light body" to="Full body" value={entered} onChange={setEntered} />
        </HarnessCase>
      </HarnessGroup>

      <HarnessGroup title="derived (display only)">
        <HarnessCase label="1b — muted 1.5px dashed, no touch band">
          <AxisSlider derived from="Acid" to="Bitter" value={58} />
        </HarnessCase>
        <HarnessCase label="5c — ghost + delta + movement line">
          <AxisSlider derived from="Acid" to="Bitter" value={38} previous={44} caption="Moved 6 points brighter" />
        </HarnessCase>
      </HarnessGroup>

      <HarnessGroup title="dashed borders side by side (device check)">
        <HarnessCase label="border.addSlot — #6B5D55 2px dashed (Add a photo)">
          <EmptySlot icon="camera" label="Add a photo" tag="Optional" onPress={() => {}} />
        </HarnessCase>
        <HarnessCase label="border.addSlot.inert — muted 2px dashed (5d)">
          <EmptySlot icon="camera" label="Add a photo" tag="Optional" disabled onPress={() => {}} />
        </HarnessCase>
      </HarnessGroup>
    </HarnessPage>
  );
}
