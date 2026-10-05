import PlaceholderScreen from './PlaceholderScreen';
import RecordsScreen from './RecordsScreen';

// Tabs show a placeholder until their screen is rebuilt from the mock.
// Records (2a) is rebuilt. The retired screens — HomeScreen, CoffeeListScreen, SearchScreen,
// ProfileScreen, NoticeListScreen, NoticeDetailScreen, AddCoffeeScreen — stay
// on disk, unreferenced and out of the bundle, as the record of what the old
// screens did.
const placeholder = (title) =>
  function Placeholder() {
    return <PlaceholderScreen title={title} />;
  };

export const SCREEN_COMPONENTS = {
  home: placeholder('Home'),
  records: RecordsScreen,
  tryNext: placeholder('Try next'),
  profile: placeholder('Profile'),
};
