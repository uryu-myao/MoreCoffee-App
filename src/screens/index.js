import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import Button from '../components/base/Button';
import { useDatabase } from '../data/DatabaseProvider';
import { shareExport } from '../data/export';
import { countCups, onCupsChanged } from '../data/repository';
import { requestPush } from '../navigation';
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

/**
 * Profile, still 6a's placeholder, carries two interim entries until 6a is
 * built (todo.md T-8: both move then):
 *   - "My taste DNA" opens 8f (2026-10-21), 6a's Taste DNA card's place.
 *   - the export (2026-10-20): every table as one JSON file to the share
 *     sheet (data/export.ts). 6b designs export / backup under Profile; until
 *     then this is the only way out.
 *     TODO(design): 6b replaces this button; label and failure copy are ours.
 */
function ProfilePlaceholder() {
  const db = useDatabase();
  const [busy, setBusy] = useState(false);
  const onExport = async () => {
    setBusy(true);
    try {
      await shareExport(db);
    } catch (error) {
      console.error('[export] failed', error);
      Alert.alert("Couldn't export", String(error?.message ?? error));
    } finally {
      setBusy(false);
    }
  };
  return (
    <PlaceholderScreen title="Profile" eyebrow="Morecoffee">
      <Button variant="secondary" label="My taste DNA" onPress={() => requestPush({ name: 'dna' })} />
      <Button variant="secondary" label="Export my log (JSON)" disabled={busy} onPress={onExport} />
    </PlaceholderScreen>
  );
}

export const SCREEN_COMPONENTS = {
  home: HomeTabScreen,
  records: RecordsScreen,
  tryNext: TryNextPlaceholder,
  profile: ProfilePlaceholder,
};
