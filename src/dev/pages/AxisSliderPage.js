import { useState } from 'react';
import AxisSlider from '../../components/base/AxisSlider';
import { TASTE_AXES } from '../../constants/tasteAxes';
import { HarnessCase, HarnessGroup, HarnessPage } from '../harness';

/** AxisSlider states (five steps, one track; the square handle carries the state). */
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
    </HarnessPage>
  );
}
