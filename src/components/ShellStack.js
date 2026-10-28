import { useEffect, useRef, useState } from 'react';
import AddBagScreen from '../screens/AddBagScreen';
import AddGearScreen from '../screens/AddGearScreen';
import CupRecordScreen from '../screens/CupRecordScreen';
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
import RecordsSearch from './RecordsSearch';

/**
 * Screens pushed over the tabs AND the bottom bar (AppShell mounts this after
 * FooterNav): the mocks of 3d (My beans; 17c / 17d since Round 14), 3c (Add a bag), 3a (Add gear) and
 * 11a (Edit cup) draw no bar, and their footer buttons sat under it
 * (device, 2026-10-13). 2c stays inside Records, under the bar (its mock has
 * one). Screens ask with requestPush({ name, ... }) (navigation.js).
 *
 * A screen is pushed at most once (a quick double tap pushed 'addBag' twice,
 * 2026-10-13) — the same screen of the same thing: two bag pages can stack
 * (a bag page, its cups' search, another bag; Design Round 15) — unless
 * that one is already leaving: a screen is marked
 * leaving the moment Back or a swipe commits, so a tap on "Manage my beans"
 * while 3d is still sliding out opens a new 3d (on device 2026-10-14 that
 * tap was swallowed). Each entry has its own key and pops itself by it.
 *   shelf     Gear & beans, 17c / 17d ({ side: 'gear' | 'beans' }; Round
 *             14 merged 3b and 3d), from Home's "See all gear & beans" and
 *             Profile's My gear / My beans
 *   addBag    3c — after adding, lands on the beans side (2026-10-12): Gear &
 *             beans goes under it if not there yet, then it slides out
 *   finished  3f, from the beans side's foot
 *   editBag   3g, the bag page ({ bag }), from a bean card or a search
 *             result; a delete returns with 13b's notice
 *   addGear   3a
 *   editGear  3e, the gear page ({ gear }), from a gear row or a search
 *             result; a removal returns with 13b's notice ("‹name› removed.")
 *   cup       2c ({ id }), from a bag or gear page's cup rows, or search
 *             opened from them (Design Round 15, 19a). Records' own 2c
 *             stays inside Records, under the bar.
 *   search    search with a block ({ filter }): a bag or gear page's "All N
 *             cups ›" (19a), in the archive's shape (18e)
 *   editCup   11a ({ cup }); a delete also closes the cup (in Records, or
 *             the pushed one) and shows 13b's notice ("‹title› deleted.")
 *   dna       8f, from Profile and 2c's "Feeds my taste DNA"
 */
/** What a pushed screen shows: one bag's page and another's are two screens. */
const subject = (e) => e.bag?.id ?? e.gear?.id ?? e.cup?.id ?? e.id ?? (e.filter ? `${e.filter.type}:${e.filter.value}` : null);
const sameScreen = (a, b) => a.name === b.name && subject(a) === subject(b);

export default function ShellStack() {
  const [stack, setStack] = useState([]);
  const nextKey = useRef(0);
  const push = (entry) =>
    setStack((s) => (s.some((e) => sameScreen(e, entry) && !e.leaving) ? s : [...s, { ...entry, key: (nextKey.current += 1) }]));
  const leaving = (key) => setStack((s) => s.map((e) => (e.key === key ? { ...e, leaving: true } : e)));
  const popKey = (key) => setStack((s) => s.filter((e) => e.key !== key));
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
              popKey(entry.key);
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
              popKey(entry.key);
              requestNotice({ name, verb: 'removed' });
            }}
          />
        );
      case 'cup':
        return <CupRecordScreen id={entry.id} onBack={goBack} onEdit={(cup) => push({ name: 'editCup', cup })} />;
      case 'search':
        return <RecordsSearch filter={entry.filter} autoFocus={false} onCancel={goBack} onOpenCup={(id) => push({ name: 'cup', id })} />;
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
              // This 11a, and the pushed 2c it was opened from, if any.
              setStack((s) => s.filter((e) => e.key !== entry.key && !(e.name === 'cup' && e.id === entry.cup.id)));
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
