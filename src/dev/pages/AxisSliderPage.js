import { useState } from 'react';
import AxisSlider from '../../components/base/AxisSlider';
import EmptySlot from '../../components/base/EmptySlot';
import { TASTE_AXES } from '../../constants/tasteAxes';
import { HarnessCase, HarnessGroup, HarnessPage } from '../harness';

/**
 * AxisSlider states (five steps, one track; the square handle carries the state),
 * plus the dashed borders left in the product — border.addSlot (#6B5D55) and
 * .inert.
 */
const [, BODY, , SWEET] = TASTE_AXES;

export default function AxisSliderPage() {
  const [empty, setEmpty] = useState(null);
  const [entered, setEntered] = useState(25);

  return (
    <HarnessPage>
      <HarnessGroup title="operable (drag, tap, Clear)">
        <HarnessCase label="empty — muted square resting at Balanced (a placeholder)">
          <AxisSlider from={SWEET.from} to={SWEET.to} steps={SWEET.steps} value={empty} onChange={setEmpty} />
        </HarnessCase>
        <HarnessCase label="entered — accent square, Clear; touch scales it">
          <AxisSlider from={BODY.from} to={BODY.to} steps={BODY.steps} value={entered} onChange={setEntered} />
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
