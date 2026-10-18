import AddButton from '../../components/base/AddButton';
import { icon } from '../../theme/tokens';
import { HarnessCase, HarnessGroup, HarnessPage } from '../harness';

export default function AddButtonPage() {
  return (
    <HarnessPage>
      <HarnessGroup title="default">
        <HarnessCase label="icon + label + tag (5a Add a photo)">
          <AddButton icon="camera" label="Add a photo" tag="Optional" onPress={() => {}} />
        </HarnessCase>
        <HarnessCase label="icon.sm plus + count tag (3b Add gear)">
          <AddButton icon="plus" iconToken={icon.sm} label="Add gear" tag="5 slots left" onPress={() => {}} />
        </HarnessCase>
        <HarnessCase label="no tag (3a)">
          <AddButton icon="plus" iconToken={icon.sm} label="Not listed — add your own" onPress={() => {}} />
        </HarnessCase>
      </HarnessGroup>

      <HarnessGroup title="pressed">
        <HarnessCase label="fill darkens — state.pressed.surface">
          <AddButton icon="camera" label="Add a photo" tag="Optional" testOnly_pressed onPress={() => {}} />
        </HarnessCase>
      </HarnessGroup>

      <HarnessGroup title="disabled (5d)">
        <HarnessCase label="border.muted frame, muted glyph and label">
          <AddButton icon="camera" label="Add a photo" tag="Optional" disabled onPress={() => {}} />
        </HarnessCase>
        <HarnessCase label="disabled does not respond to press">
          <AddButton icon="camera" label="Add a photo" tag="Optional" disabled testOnly_pressed onPress={() => {}} />
        </HarnessCase>
      </HarnessGroup>

      <HarnessGroup title="long copy">
        <HarnessCase label="long label wraps; tag keeps its width">
          <AddButton
            icon="plus"
            iconToken={icon.sm}
            label="Add the grinder you use most mornings"
            tag="5 slots left"
            onPress={() => {}}
          />
        </HarnessCase>
        <HarnessCase label="ja">
          <AddButton icon="camera" label="写真を追加" tag="任意" onPress={() => {}} />
        </HarnessCase>
      </HarnessGroup>
    </HarnessPage>
  );
}
