import PlaceholderScreen from './PlaceholderScreen';

// Every tab shows a placeholder until its screen is rebuilt from the mock
// (Step 5). The retired screens — HomeScreen, CoffeeListScreen, SearchScreen,
// ProfileScreen, NoticeListScreen, NoticeDetailScreen, AddCoffeeScreen — stay
// on disk, unreferenced and out of the bundle, as the record of what the old
// screens did.
const placeholder = (title) =>
  function Placeholder() {
    return <PlaceholderScreen title={title} />;
  };

export const SCREEN_COMPONENTS = {
  home: placeholder('Home'),
  records: placeholder('Records'),
  tryNext: placeholder('Try next'),
  profile: placeholder('Profile'),
};
