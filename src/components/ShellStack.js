import { useEffect, useState } from 'react';
import AddBagScreen from '../screens/AddBagScreen';
import AddGearScreen from '../screens/AddGearScreen';
import EditCupScreen from '../screens/EditCupScreen';
import FinishedBagsScreen from '../screens/FinishedBagsScreen';
import MyBeansScreen from '../screens/MyBeansScreen';
import { ScreenBackdropContext } from '../screens/ScreenFrame';
import { cupTitle } from '../constants/cups';
import { onPushRequest, requestCloseCup, requestNotice } from '../navigation';
import PushedScreen from './PushedScreen';

/**
 * Screens pushed over the tabs AND the bottom bar (AppShell mounts this after
 * FooterNav): the mocks of 3d (My beans), 3c (Add a bag), 3a (Add gear) and
 * 11a (Edit cup) draw no bar, and their footer buttons sat under it
 * (device, 2026-10-13). 2c stays inside Records, under the bar (its mock has
 * one). Screens ask with requestPush({ name, ... }) (navigation.js).
 *
 * A screen is pushed at most once (a quick double tap pushed 'addBag' twice,
 * 2026-10-13); each pops itself by name when it has slid out.
 *   beans     3d
 *   addBag    3c — after adding, lands on My beans (2026-10-12): My beans
 *             goes under it if not there yet, then it slides out
 *   finished  3f, from 3d's foot
 *   addGear   3a
 *   editCup   11a ({ cup }); a delete also closes the cup in Records and
 *             shows 13b's notice ("‹title› deleted.")
 */
export default function ShellStack() {
  const [stack, setStack] = useState([]);
  const push = (entry) => setStack((s) => (s.some((e) => e.name === entry.name) ? s : [...s, entry]));
  const pop = (name) => setStack((s) => s.filter((e) => e.name !== name));
  useEffect(() => onPushRequest(push), []);

  const render = (entry, goBack, guardLeave) => {
    switch (entry.name) {
      case 'beans':
        return <MyBeansScreen onBack={goBack} onAddBag={() => push({ name: 'addBag' })} onFinished={() => push({ name: 'finished' })} />;
      case 'finished':
        return <FinishedBagsScreen onBack={goBack} />;
      case 'addGear':
        return <AddGearScreen onBack={goBack} />;
      case 'addBag':
        return (
          <AddBagScreen
            onBack={goBack}
            onAdded={() => {
              setStack((s) => (s.some((e) => e.name === 'beans') ? s : [{ name: 'beans' }, ...s]));
              goBack();
            }}
          />
        );
      case 'editCup':
        return (
          <EditCupScreen
            cup={entry.cup}
            onBack={goBack}
            guardLeave={guardLeave}
            onDeleted={() => {
              requestCloseCup();
              pop('editCup');
              requestNotice({ name: cupTitle(entry.cup).title });
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ScreenBackdropContext.Provider value={false}>
      {stack.map((entry) => (
        <PushedScreen key={entry.name} onBack={() => pop(entry.name)}>
          {(goBack, guardLeave) => render(entry, goBack, guardLeave)}
        </PushedScreen>
      ))}
    </ScreenBackdropContext.Provider>
  );
}
