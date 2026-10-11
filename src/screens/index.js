import { useEffect, useState } from 'react';
import { useDatabase } from '../data/DatabaseProvider';
import { countCups, onCupsChanged } from '../data/repository';
import HomeTabScreen from './HomeTabScreen';
import PlaceholderScreen from './PlaceholderScreen';
import RecordsScreen from './RecordsScreen';

// Tabs show a placeholder until their screen is rebuilt from the mock.
// Records (2a) is rebuilt; Home (1b) has its Taste DNA card. The retired screens — HomeScreen, CoffeeListScreen, SearchScreen,
// ProfileScreen, NoticeListScreen, NoticeDetailScreen, AddCoffeeScreen — stay
// on disk, unreferenced and out of the bundle, as the record of what the old
// screens did.
//
// Each tab carries its mock's eyebrow verbatim: 1b "MoreCoffee", 6a
// "Morecoffee" (both render uppercase), 8d "Based on 147 cups" with the real
// count.
const placeholder = (title, eyebrow) =>
  function Placeholder() {
    return <PlaceholderScreen title={title} eyebrow={eyebrow} />;
  };

const countFormat = new Intl.NumberFormat();

function TryNextPlaceholder() {
  const db = useDatabase();
  const [count, setCount] = useState(null);

  useEffect(() => {
    const load = () => countCups(db).then(setCount, (error) => console.error('[try next] could not count cups', error));
    load();
    return onCupsChanged(load);
  }, [db]);

  // TODO(i18n): plural rules beyond English's one / other.
  const eyebrow = count == null ? undefined : `Based on ${countFormat.format(count)} ${count === 1 ? 'cup' : 'cups'}`;
  return <PlaceholderScreen title="Try next" eyebrow={eyebrow} />;
}

export const SCREEN_COMPONENTS = {
  home: HomeTabScreen,
  records: RecordsScreen,
  tryNext: TryNextPlaceholder,
  profile: placeholder('Profile', 'Morecoffee'),
};
