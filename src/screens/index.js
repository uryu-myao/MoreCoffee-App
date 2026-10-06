import { useEffect, useState } from 'react';
import { useDatabase } from '../data/DatabaseProvider';
import { countCups, onCupsChanged } from '../data/repository';
import PlaceholderScreen from './PlaceholderScreen';
import RecordsScreen from './RecordsScreen';
import TastingNoteScreen from './TastingNoteScreen';

// Tabs show a placeholder until their screen is rebuilt from the mock.
// Records (2a) is rebuilt. The retired screens — HomeScreen, CoffeeListScreen, SearchScreen,
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
  home: placeholder('Home', 'MoreCoffee'),
  records: RecordsScreen,
  // VERIFICATION ONLY (2026-10-06): Tasting note (5b) stands in for Try next so
  // its header collapse and the bottom bar's hide / reveal can be checked inside
  // the tab pager. 5b belongs in the Record overlay (Record coffee → 5b), where
  // the bar is covered; see design/todo.md.
  // To revert: set this back to TryNextPlaceholder and drop the
  // TastingNoteScreen import above (TryNextPlaceholder is kept, unused, for it).
  tryNext: TastingNoteScreen,
  profile: placeholder('Profile', 'Morecoffee'),
};
