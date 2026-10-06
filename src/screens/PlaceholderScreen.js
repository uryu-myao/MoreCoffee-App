import Text from '../components/base/Text';
import ScreenFrame from './ScreenFrame';

/**
 * Scaffolding for screens not yet rebuilt from their mocks: the screen name and
 * one line of copy. Deliberately not an empty-state design — each screen's
 * empty state is designed when the screen itself is rebuilt.
 */
export default function PlaceholderScreen({ title, eyebrow, leading }) {
  return (
    <ScreenFrame title={title} eyebrow={eyebrow} leading={leading}>
      <Text variant="body" color="muted">
        This screen is being rebuilt.
      </Text>
    </ScreenFrame>
  );
}
