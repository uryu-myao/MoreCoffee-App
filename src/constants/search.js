/**
 * Search (Design Round 15 · Search, 18a–18f, 18x): pure functions over what
 * the screen reads (listCups, listAllBags, listGearWithUse). Everything runs
 * in memory, as Records' list: a few hundred cups a year.
 *
 * A search is one of two things, never both (18x: "one filter or one query
 * at a time this round, with no mixing"):
 *   filter  { type, value, label } — a block in the field, removable only:
 *             kind    a mode (18a's Kind chips; no "All")
 *             rating  1–5 (18a's Rating chips): cups rated exactly that
 *             bag     a bag's id (19a's "All N cups ›")
 *             gear    a gear id (19c's list, the same way)
 *           Its result is the archive's shape (18e): month groups, 2b's sort.
 *   query   typed text (or a flavour chip, a recent search, a term row):
 *           five tabs over beans, gear, words and cups (18d).
 * Matching is a plain case-insensitive substring, as 8l's was.
 */
import { formatDay } from './dates';
import { MODE_LABEL, cupTitle } from './cups';
import { GEAR_CATEGORY, onCups } from './gear';
import { freshnessOf } from '../data/freshness';

/** 18a's Kind: 2a's categories without "All" (in search, All is just 2a). */
export const KINDS = Object.entries(MODE_LABEL).map(([value, label]) => ({ value, label }));

export const RATINGS = [1, 2, 3, 4, 5];

/** 18a: "Flavours I use most": at most 6, each on at least 2 cups. */
const FLAVOUR_CHIPS = 6;
const FLAVOUR_MIN_CUPS = 2;

/**
 * The flavour tags on the most cups, lower case (18a: as tags are written in
 * the notes, and apart from the Kind chips). Grouped ignoring case; ties go
 * to the tag used most recently. `cups` newest first (listCups).
 */
export function flavourChips(cups) {
  const seen = new Map();
  cups.forEach((cup, at) => {
    for (const tag of new Set(cup.flavours.map((f) => f.toLowerCase()))) {
      const entry = seen.get(tag);
      if (entry) entry.count += 1;
      else seen.set(tag, { tag, count: 1, at });
    }
  });
  return [...seen.values()]
    .filter((e) => e.count >= FLAVOUR_MIN_CUPS)
    .sort((a, b) => b.count - a.count || a.at - b.at)
    .slice(0, FLAVOUR_CHIPS)
    .map((e) => e.tag);
}

/** What a filter's block says (18x): "Packaged", "3★", the bag's or gear's name. */
export function kindFilter(value) {
  return { type: 'kind', value, label: MODE_LABEL[value] };
}
export function ratingFilter(value) {
  return { type: 'rating', value, label: `${value}★` };
}
export function bagFilter(bag) {
  return { type: 'bag', value: bag.id, label: bag.name };
}
export function gearFilter(gear) {
  return { type: 'gear', value: gear.id, label: gear.name };
}

/** The cups a filter keeps, in the order given. */
export function cupsForFilter(cups, filter) {
  switch (filter.type) {
    case 'kind':
      return cups.filter((c) => c.mode === filter.value);
    case 'rating':
      return cups.filter((c) => c.rating === filter.value);
    case 'bag':
      return cups.filter((c) => c.bag_id === filter.value);
    case 'gear':
      return cups.filter((c) => c.brewer_id === filter.value || c.grinder_id === filter.value);
    default:
      return [];
  }
}

const cupsWord = (n) => (n === 1 ? '1 cup' : `${n} cups`);

/** E3's count line over a filter's result (18e: "14 cups"). TODO(i18n): plurals. */
export const cupCount = cupsWord;

/**
 * E4, a filter with no cups (18f): the line, and a second that points
 * somewhere — for a rating, the ratings given most ("Ratings you've given
 * most: 3★ and 4★."). A kind has no second line: 18f words only the first.
 */
export function filterEmpty(filter, cups) {
  if (filter.type === 'rating') {
    const counts = new Map();
    for (const c of cups) if (c.rating) counts.set(c.rating, (counts.get(c.rating) ?? 0) + 1);
    const top = [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || b[0] - a[0])
      .slice(0, 2)
      .map(([r]) => r)
      .sort((a, b) => a - b)
      .map((r) => `${r}★`);
    const hint = top.length === 2 ? `Ratings you've given most: ${top[0]} and ${top[1]}.` : top.length === 1 ? `Rating you've given most: ${top[0]}.` : null;
    return { line: `No ${filter.label} cups yet.`, hint };
  }
  if (filter.type === 'kind') return { line: `No ${filter.label} cups yet.`, hint: null };
  // A bag or gear block only comes from its page's "All N cups", so it has
  // cups; this is for one emptied since (its cups deleted).
  return { line: `No cups with ${filter.label} yet.`, hint: null };
}

const has = (value, q) => Boolean(value) && value.toLowerCase().includes(q);

/** A cup's name fields: what CUPS matches (its title, source and gear). */
const cupNames = (cup) => [cup.bean_name, cup.bean_roaster, cup.drink_type, cup.product_name, cup.place_name, cup.brew_method, cup.grinder];

/**
 * A text query over everything (18d): { beans, gear, words, cups }.
 *   beans  every bag, finished ones too: name, roaster, origin, region
 *   gear   name, maker
 *   words  cups whose My words or flavour tags hold the query
 *   cups   cups whose names hold it (bean, roaster, drink, product, café,
 *          brewer, grinder)
 * A cup can be in both WORDS and CUPS: each tab is its own question.
 * TODO(design): 18d draws WORDS with 0 only, so its rows aren't drawn; they
 * are 2a's cup rows here, as 8l's Words scope listed them.
 */
export function searchText(query, { cups, bags, gear }) {
  const q = query.trim().toLowerCase();
  if (!q) return { beans: [], gear: [], words: [], cups: [] };
  return {
    beans: bags.filter((b) => [b.name, b.roaster, b.origin, b.region].some((v) => has(v, q))),
    gear: gear.filter((g) => [g.name, g.maker].some((v) => has(v, q))),
    words: cups.filter((c) => has(c.note, q) || c.flavours.some((f) => has(f, q))),
    cups: cups.filter((c) => cupNames(c).some((v) => has(v, q))),
  };
}

/** 18d's tabs, in order; ALL has no count. */
export const TABS = [
  { key: 'all', label: 'All' },
  { key: 'cups', label: 'Cups' },
  { key: 'words', label: 'Words' },
  { key: 'beans', label: 'Beans' },
  { key: 'gear', label: 'Gear' },
];

/** ALL's sections in their fixed order (18d), with the rows each shows. */
export const ALL_SECTIONS = [
  { key: 'beans', label: 'Beans', rows: 2 },
  { key: 'gear', label: 'Gear', rows: 2 },
  { key: 'words', label: 'Words', rows: 3 },
  { key: 'cups', label: 'Cups', rows: 3 },
];

/** E4 for a text query (18f): no match at all, and an empty tab. */
export const nothingMatches = (query) => `Nothing matches “${query.trim()}”.`;
export function noTabMatches(tab, query) {
  const what = { cups: 'No cups match', words: 'No words match', beans: 'No beans match', gear: 'No gear matches' }[tab];
  return `${what} “${query.trim()}”.`;
}

/**
 * A bag's meta line in BEANS (18d): "Blue Bottle · 250 g · day 7", a
 * finished bag "… · finished Mar 2". The day is the freshness day (3d's).
 */
export function bagLine(bag) {
  return [bag.roaster, bag.size_g ? `${bag.size_g} g` : null, bagStatus(bag)].filter(Boolean).join(' · ');
}

function bagStatus(bag) {
  if (bag.finished_at != null) return `finished ${formatDay(bag.finished_at)}`;
  if (bag.opened_at == null) return 'sealed';
  const f = freshnessOf(bag.roasted_at);
  return f ? `day ${f.day}` : null;
}

/** A gear row's meta line in GEAR: "Grinder · Timemore". */
export function gearSearchLine(g) {
  return [GEAR_CATEGORY[g.category], g.maker].filter(Boolean).join(' · ');
}

/**
 * While typing (18c), the hits: up to 3 things the text names, mixed kinds,
 * in ALL's order (beans, gear, cups). The meta line starts with the kind.
 *   Bag · Blue Bottle · day 7
 *   Gear · Grinder
 *   Cup · V60 · 4★        (title "Ethiopia Guji · Apr 8")
 */
const HITS = 3;
const TERMS = 3;

export function suggestions(query, data, history) {
  const q = query.trim().toLowerCase();
  if (!q) return { hits: [], terms: [] };
  const found = searchText(q, data);
  const hits = [
    ...found.beans.map((bag) => ({ key: `b${bag.id}`, type: 'bag', item: bag, title: bag.name, meta: ['Bag', bagLine(bag)].filter(Boolean).join(' · ') })),
    ...found.gear.map((g) => ({ key: `g${g.id}`, type: 'gear', item: g, title: g.name, meta: `Gear · ${gearSearchLine(g)}` })),
    ...found.cups.map((cup) => ({
      key: `c${cup.id}`,
      type: 'cup',
      item: cup,
      title: `${cupTitle(cup).title} · ${formatDay(cup.logged_at)}`,
      meta: ['Cup', cup.mode === 'made_it' ? cup.brew_method : MODE_LABEL[cup.mode], cup.rating ? `${cup.rating}★` : null].filter(Boolean).join(' · '),
    })),
  ].slice(0, HITS);
  return { hits, terms: completions(q, data, history) };
}

/**
 * 18c's terms: words and phrases the user has written that start with the
 * text, lower case (the typed part in ink, the rest muted). Recent searches
 * first, then by how often the word occurs. A term searches everything
 * (it lands on ALL), so it carries no kind.
 * TODO(design): 18c draws two terms and no cap; 3 here, as the hits.
 */
function completions(q, { cups, bags, gear }, history) {
  const score = new Map();
  const add = (text, weight = 1) => {
    if (!text) return;
    const phrase = text.trim().toLowerCase().replace(/\s+/g, ' ');
    if (!phrase) return;
    const words = phrase.split(' ').map((w) => w.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '')).filter(Boolean);
    for (const t of new Set([phrase, ...words])) {
      if (t.startsWith(q)) score.set(t, (score.get(t) ?? 0) + weight);
    }
  };
  history.forEach((h) => add(h, 1000));
  for (const c of cups) {
    c.flavours.forEach((f) => add(f));
    add(c.note);
    cupNames(c).forEach((v) => add(v));
  }
  for (const b of bags) [b.name, b.roaster, b.origin, b.region].forEach((v) => add(v));
  for (const g of gear) [g.name, g.maker].forEach((v) => add(v));
  // A phrase from a long note is not a term: keep up to three words.
  return [...score.entries()]
    .filter(([t]) => t.split(' ').length <= 3)
    .sort((a, b) => b[1] - a[1] || a[0].length - b[0].length || a[0].localeCompare(b[0]))
    .slice(0, TERMS)
    .map(([t]) => t);
}

/** Whether a gear page lists cups at all (19c: kettles and scales don't, Round 15 B5). */
export const gearHasCups = (gear) => onCups(gear.category);
