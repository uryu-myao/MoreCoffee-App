import EmptySlot from '../../components/base/EmptySlot';
import { icon } from '../../theme/tokens';
import { HarnessCase, HarnessGroup, HarnessPage } from '../harness';

export default function EmptySlotPage() {
  return (
    <HarnessPage>
      <HarnessGroup title="default">
        <HarnessCase label="icon + label + tag (5a Add a photo)">
          <EmptySlot icon="camera" label="Add a photo" tag="Optional" onPress={() => {}} />
        </HarnessCase>
        <HarnessCase label="icon.sm plus + count tag (3b Add gear)">
          <EmptySlot icon="plus" iconToken={icon.sm} label="Add gear" tag="5 slots left" onPress={() => {}} />
        </HarnessCase>
        <HarnessCase label="no tag (3a)">
          <EmptySlot icon="plus" iconToken={icon.sm} label="Not listed — add your own" onPress={() => {}} />
        </HarnessCase>
      </HarnessGroup>

      <HarnessGroup title="pressed">
        <HarnessCase label="fill darkens — state.pressed.surface">
          <EmptySlot icon="camera" label="Add a photo" tag="Optional" testOnly_pressed onPress={() => {}} />
        </HarnessCase>
      </HarnessGroup>

      <HarnessGroup title="disabled (5d)">
        <HarnessCase label="dashed.emptyDisabled frame, muted glyph, secondary label">
          <EmptySlot icon="camera" label="Add a photo" tag="Optional" disabled onPress={() => {}} />
        </HarnessCase>
        <HarnessCase label="disabled does not respond to press">
          <EmptySlot icon="camera" label="Add a photo" tag="Optional" disabled testOnly_pressed onPress={() => {}} />
        </HarnessCase>
      </HarnessGroup>

      <HarnessGroup title="long copy">
        <HarnessCase label="long label wraps; tag keeps its width">
          <EmptySlot
            icon="plus"
            iconToken={icon.sm}
            label="Add the grinder you use most mornings"
            tag="5 slots left"
            onPress={() => {}}
          />
        </HarnessCase>
        <HarnessCase label="ja">
          <EmptySlot icon="camera" label="写真を追加" tag="任意" onPress={() => {}} />
        </HarnessCase>
      </HarnessGroup>
    </HarnessPage>
  );
}
