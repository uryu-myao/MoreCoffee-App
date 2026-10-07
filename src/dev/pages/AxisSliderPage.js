import { useState } from 'react';
import AxisSlider from '../../components/base/AxisSlider';
import EmptySlot from '../../components/base/EmptySlot';
import { HarnessCase, HarnessGroup, HarnessPage } from '../harness';

/**
 * AxisSlider states, plus the device check of dashed lines (design-system.md
 * §9: 6:3 dashes on iOS). The ink 2px dashes (empty rail, add slot) sit next
 * to the muted 1.5px dashes (derived rail) on one screen, so all of the
 * product's dashed borders can be compared on a phone.
 */
export default function AxisSliderPage() {
  const [empty, setEmpty] = useState(null);
  const [entered, setEntered] = useState(38);

  return (
    <HarnessPage>
      <HarnessGroup title="operable (drag, tap, Clear)">
        <HarnessCase label="empty — ink 2px dashed, needle placeholder at 50">
          <AxisSlider from="Low sweetness" to="High sweetness" value={empty} onChange={setEmpty} />
        </HarnessCase>
        <HarnessCase label="entered — ink solid, accent needle, Clear">
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
        <HarnessCase label="border.addSlot — ink 2px dashed (Add a photo)">
          <EmptySlot icon="camera" label="Add a photo" tag="Optional" onPress={() => {}} />
        </HarnessCase>
        <HarnessCase label="border.addSlot.inert — muted 2px dashed (5d)">
          <EmptySlot icon="camera" label="Add a photo" tag="Optional" disabled onPress={() => {}} />
        </HarnessCase>
      </HarnessGroup>
    </HarnessPage>
  );
}
