import { useEffect, useRef, useState } from 'react';
import { nearbyCafes, placeSearchAvailable, searchPlaces } from '../../modules/place-search';
import { distanceLine, distanceMetres, visitsHint } from '../constants/places';
import { useDatabase } from '../data/DatabaseProvider';
import { locate } from '../data/location';
import { listLoggedCafes } from '../data/repository';
import SearchSheet, { defaultMatch } from './SearchSheet';

/**
 * The café sheet (5a's and 11a's Café row; built 2026-10-30, confirmed in
 * Design Round 16, B1–B2 in words, not drawn). The search sheet in single
 * mode, one list with no headings:
 *   - the cafés logged before first (the latest visit first; meta "N visits"
 *     and the distance when known), filtered as typed;
 *   - then MapKit's cafés (no other category; Uryu, 2026-10-30): with
 *     nothing typed, those within 1 km (needs the location); typed, those
 *     within 5 km of the phone, never further (Uryu, 2026-10-30: "only
 *     nearby"; a café far away is typed by hand). Without the location the
 *     map can't be kept near, so the search is not limited. A map place
 *     already logged shows as the logged row, once;
 *   - Add "‹typed›" last, with "Saved by name only" under it (B1): the way
 *     out that always works — no location, no network, or a café the map
 *     doesn't know.
 *
 * The location is asked for here, on the first open (data/location.ts), never
 * before. Nothing is stored until the cup is saved (repository placeIdFor).
 *
 * Status lines (B2): searching; can't search ("Add it by name below.", the
 * Add row); location off, ending in "Open Settings".
 *
 * Props
 *   visible, onClose
 *   selected   the CafeChoice shown in the row, or null
 *   onPick     (CafeChoice & { visits, distance }) => void
 */
/** Wait this long after a keystroke before asking the map (Apple limits how often an app may search). */
const SEARCH_DELAY = 300;
/** A typed search keeps to this far around the phone; "nearby" lists this far. */
const SEARCH_RADIUS = 5000;
const NEARBY_RADIUS = 1000;

const STATUS = {
  searching: 'Searching the map…',
  failed: "Can't search the map right now. Add it by name below.",
  off: "Location is off, so nearby cafés aren't shown.",
};

const loggedKey = (id) => `p:${id}`;
const mapKey = (place) => `m:${place.id ?? `${place.name}|${place.lat}|${place.lng}`}`;

export default function CafeSheet({ visible, onClose, selected, onPick }) {
  const db = useDatabase();
  const [logged, setLogged] = useState([]);
  const [located, setLocated] = useState(null);
  const [nearby, setNearby] = useState([]);
  const [query, setQuery] = useState('');
  // { query, places } for the last typed search answered; failed: the last one failed.
  const [found, setFound] = useState({ query: '', places: [] });
  const [failed, setFailed] = useState(false);
  const seq = useRef(0);
  const here = located?.here ?? null;

  // On open: the cafés logged, then where the phone is (asks the first
  // time), then the cafés around it.
  useEffect(() => {
    if (!visible) return undefined;
    let alive = true;
    listLoggedCafes(db).then(
      (rows) => alive && setLogged(rows),
      (error) => console.error('[cafe] could not read the cafés logged', error)
    );
    locate().then((result) => {
      if (!alive) return;
      setLocated(result);
      if (result.here && placeSearchAvailable) {
        nearbyCafes({ ...result.here, radius: NEARBY_RADIUS }).then(
          (places) => alive && setNearby(places),
          (error) => console.warn('[cafe] nearby search failed', error)
        );
      }
    });
    return () => {
      alive = false;
    };
  }, [db, visible]);

  // Typed: ask the map once typing pauses; only the latest answer is kept.
  const q = query.trim();
  useEffect(() => {
    if (!q) {
      setFailed(false);
      return undefined;
    }
    const mine = ++seq.current;
    const timer = setTimeout(() => {
      // MapKit keeps to the square around the point; the circle is ours.
      const search = here
        ? searchPlaces(q, { ...here, radius: SEARCH_RADIUS }).then((places) => places.filter((p) => distanceMetres(here, p) <= SEARCH_RADIUS))
        : searchPlaces(q, null);
      search.then(
        (places) => {
          if (seq.current !== mine) return;
          setFound({ query: q, places });
          setFailed(false);
        },
        (error) => {
          if (seq.current !== mine) return;
          console.warn('[cafe] map search failed', error);
          setFound({ query: q, places: [] });
          setFailed(true);
        }
      );
    }, SEARCH_DELAY);
    return () => clearTimeout(timer);
  }, [q, here]);

  const answered = found.query === q;
  const mapPlaces = q ? (answered ? found.places : []) : nearby;
  const loggedIds = new Set(logged.map((p) => p.external_id).filter(Boolean));
  const items = [
    ...logged.map((p) => ({
      key: loggedKey(p.id),
      label: p.name,
      hint: [visitsHint(p.visits), distanceLine(distanceMetres(here, p))].filter(Boolean).join(' · ') || undefined,
      cafe: { id: p.id, name: p.name, externalId: p.external_id, lat: p.lat, lng: p.lng, visits: p.visits, distance: distanceMetres(here, p) },
    })),
    ...mapPlaces
      .filter((m) => !(m.id && loggedIds.has(m.id)))
      .map((m) => ({
        key: mapKey(m),
        label: m.name,
        hint: [m.address, distanceLine(distanceMetres(here, m))].filter(Boolean).join(' · ') || undefined,
        fromMap: true,
        cafe: { id: null, name: m.name, externalId: m.id ?? null, lat: m.lat, lng: m.lng, visits: 0, distance: distanceMetres(here, m) },
      })),
  ];

  let status;
  if (q && !placeSearchAvailable) status = STATUS.failed;
  else if (q && !answered) status = STATUS.searching;
  else if (q && failed) status = STATUS.failed;
  else if (!q && located?.reason === 'off') status = STATUS.off;

  const selectedKey = !selected ? null : selected.id != null ? loggedKey(selected.id) : items.find((i) => i.cafe.externalId && i.cafe.externalId === selected.externalId)?.key ?? null;

  return (
    <SearchSheet
      visible={visible}
      onClose={onClose}
      mode="single"
      placeholder="Café name"
      items={items}
      // The map's places matched already (often on what the name doesn't show).
      match={(item, text) => (item.fromMap ? 1 : defaultMatch(item, text))}
      onQueryChange={setQuery}
      status={status}
      statusSettings={status === STATUS.off}
      addHint="Saved by name only"
      selected={selectedKey}
      onPick={(key) => {
        const item = items.find((i) => i.key === key);
        if (item) onPick(item.cafe);
      }}
      onAdd={(name) => onPick({ id: null, name, externalId: null, lat: null, lng: null, visits: 0, distance: null })}
    />
  );
}
