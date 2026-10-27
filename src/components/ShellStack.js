import { useEffect, useRef, useState } from 'react';
import AddBagScreen from '../screens/AddBagScreen';
import AddGearScreen from '../screens/AddGearScreen';
import EditBagScreen from '../screens/EditBagScreen';
import EditCupScreen from '../screens/EditCupScreen';
import EditGearScreen from '../screens/EditGearScreen';
import FinishedBagsScreen from '../screens/FinishedBagsScreen';
import GearBeansScreen from '../screens/GearBeansScreen';
import TasteDnaScreen from '../screens/TasteDnaScreen';
import { ScreenBackdropContext } from '../screens/ScreenFrame';
import { cupTitle } from '../constants/cups';
import { onPushRequest, requestCloseCup, requestNotice } from '../navigation';
import PushedScreen from './PushedScreen';

/**
 * Screens pushed over the tabs AND the bottom bar (AppShell mounts this after
 * FooterNav): the mocks of 3d (My beans; 17c / 17d since Round 14), 3c (Add a bag), 3a (Add gear) and
 * 11a (Edit cup) draw no bar, and their footer buttons sat under it
 * (device, 2026-10-13). 2c stays inside Records, under the bar (its mock has
 * one). Screens ask with requestPush({ name, ... }) (navigation.js).
 *
 * A screen is pushed at most once (a quick double tap pushed 'addBag' twice,
 * 2026-10-13) — unless that one is already leaving: a screen is marked
 * leaving the moment Back or a swipe commits, so a tap on "Manage my beans"
 * while 3d is still sliding out opens a new 3d (on device 2026-10-14 that
 * tap was swallowed). Each entry has its own key and pops itself by it.
 *   shelf     Gear & beans, 17c / 17d ({ side: 'gear' | 'beans' }; Round
 *             14 merged 3b and 3d), from Home's "See all gear & beans" and
 *             Profile's My gear / My beans
 *   addBag    3c — after adding, lands on the beans side (2026-10-12): Gear &
 *             beans goes under it if not there yet, then it slides out
 *   finished  3f, from the beans side's foot
 *   editBag   3g ({ bag }), from a bean card; a delete returns to Gear &
 *             beans with 13b's notice
 *   addGear   3a
 *   editGear  3e ({ gear }), from a gear row; a removal returns to Gear &
 *             beans with 13b's notice ("‹name› removed.")
 *   editCup   11a ({ cup }); a delete also closes the cup in Records and
 *             shows 13b's notice ("‹title› deleted.")
 *   dna       8f, from Profile and 2c's "Feeds my taste DNA"
 */
export default function ShellStack() {
  const [stack, setStack] = useState([]);
  const nextKey = useRef(0);
  const push = (entry) =>
    setStack((s) => (s.some((e) => e.name === entry.name && !e.leaving) ? s : [...s, { ...entry, key: (nextKey.current += 1) }]));
  const leaving = (key) => setStack((s) => s.map((e) => (e.key === key ? { ...e, leaving: true } : e)));
  const popKey = (key) => setStack((s) => s.filter((e) => e.key !== key));
  const pop = (name) => setStack((s) => s.filter((e) => e.name !== name || e.leaving));
  useEffect(() => onPushRequest(push), []);

  const render = (entry, goBack, guardLeave) => {
    switch (entry.name) {
      case 'shelf':
        return (
          <GearBeansScreen
            side={entry.side}
            onBack={goBack}
            onAddGear={() => push({ name: 'addGear' })}
            onEditGear={(gear) => push({ name: 'editGear', gear })}
            onAddBag={() => push({ name: 'addBag' })}
            onFinished={() => push({ name: 'finished' })}
            onEditBag={(bag) => push({ name: 'editBag', bag })}
          />
        );
      case 'editBag':
        return (
          <EditBagScreen
            bag={entry.bag}
            onBack={goBack}
            guardLeave={guardLeave}
            onDeleted={(name) => {
              pop('editBag');
              requestNotice({ name });
            }}
          />
        );
      case 'finished':
        return <FinishedBagsScreen onBack={goBack} />;
      case 'addGear':
        return <AddGearScreen onBack={goBack} />;
      case 'editGear':
        return (
          <EditGearScreen
            gear={entry.gear}
            onBack={goBack}
            guardLeave={guardLeave}
            onRemoved={(name) => {
              pop('editGear');
              requestNotice({ name, verb: 'removed' });
            }}
          />
        );
      case 'dna':
        return <TasteDnaScreen onBack={goBack} />;
      case 'addBag':
        return (
          <AddBagScreen
            onBack={goBack}
            onAdded={() => {
              setStack((s) => (s.some((e) => e.name === 'shelf' && !e.leaving) ? s : [{ name: 'shelf', side: 'beans', key: (nextKey.current += 1) }, ...s]));
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
        <PushedScreen key={entry.key} onLeave={() => leaving(entry.key)} onBack={() => popKey(entry.key)}>
          {(goBack, guardLeave) => render(entry, goBack, guardLeave)}
        </PushedScreen>
      ))}
    </ScreenBackdropContext.Provider>
  );
}
