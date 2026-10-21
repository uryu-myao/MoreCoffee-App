/**
 * Records' order, groups (2b) and search (8l): pure functions over the list
 * listCups reads. Everything runs in memory: a few hundred cups a year.
 *
 * Neither the sort nor the search is remembered: each launch starts from
 * the defaults (data-model.md, V1 migration scope g).
 */

export const SORTS = [
  { key: 'newest', label: 'Newest first' },
  { key: 'oldest', label: 'Oldest first' },
  { key: 'rated', label: 'Highest rated' },
  { key: 'roaster', label: 'Roaster A–Z' },
];

export const GROUPS = [
  { value: 'month', label: 'Month' },
  { value: 'method', label: 'Brew method' },
  { value: 'roaster', label: 'Roaster' },
  { value: 'none', label: 'None' },
];

export const DEFAULT_SORT = 'newest';
export const DEFAULT_GROUP = 'month';

export const sortLabel = (key) => SORTS.find((s) => s.key === key).label;

/**
 * Cups with no roaster / no brewer go last (Design Round 10, 14), named by
 * what they are: "Packaged", then "Barista" (no café grouping in V1: the
 * café can't be entered yet). An I made it cup can have neither too (a bag
 * with no roaster; a cup logged from an empty shelf, which requires no bag
 * or gear). It is neither of those, so it keeps "No roaster" / "No brewer"
 * and comes first of the three (Uryu, 2026-10-21).
 * TODO(design): not yet seen by Design; goes in the next brief.
 */
const TAIL = { none: 1, packaged: 2, barista: 3 };
const tailKey = (cup) => (cup.mode === 'made_it' ? 'none' : cup.mode);
const TAIL_LABEL = { packaged: 'Packaged', barista: 'Barista' };
const NO_ROASTER = 'No roaster';
const NO_BREWER = 'No brewer';

const byNewest = (a, b) => b.logged_at - a.logged_at || b.id - a.id;
const compareText = (a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' });
/** The group of a cup with no roaster / no brewer. */
const tailGroup = (cup, noneLabel) => {
  const key = tailKey(cup);
  return { key, label: TAIL_LABEL[key] ?? noneLabel };
};
/** 0 for a cup with a roaster, else its place in the tail. */
const roasterRank = (cup) => (cup.bean_roaster ? 0 : TAIL[tailKey(cup)]);

const COMPARE = {
  newest: byNewest,
  oldest: (a, b) => -byNewest(a, b),
  // Ties (and the unrated) fall back to newest first.
  rated: (a, b) => (b.rating ?? 0) - (a.rating ?? 0) || byNewest(a, b),
  // After Z: I made it with no roaster, Packaged, Barista; newest first in each.
  roaster: (a, b) => {
    if (!a.bean_roaster || !b.bean_roaster) return roasterRank(a) - roasterRank(b) || byNewest(a, b);
    return compareText(a.bean_roaster, b.bean_roaster) || byNewest(a, b);
  },
};

/**
 * The list as 2a shows it: [{ key, label, cups }]. Design Round 10, 15.
 *   - Inside a group, cups follow the sort.
 *   - Month groups always follow the date (oldest month first only under
 *     "Oldest first"); "Highest rated" orders cups inside each month only.
 *   - Other groups come in the order their first cup has under the sort;
 *     then No roaster / No brewer, Packaged, Barista (TAIL).
 *   - "None" is one group with no label.
 */
export function arrangeCups(cups, sort, group, monthFormat) {
  const sorted = [...cups].sort(COMPARE[sort]);
  if (group === 'none') return sorted.length ? [{ key: 'all', label: null, cups: sorted }] : [];

  const keyOf = {
    month: (cup) => {
      const d = new Date(cup.logged_at);
      return { key: `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`, label: monthFormat.format(d) };
    },
    method: (cup) => (cup.brew_method ? { key: `m:${cup.brew_method}`, label: cup.brew_method } : tailGroup(cup, NO_BREWER)),
    roaster: (cup) => (cup.bean_roaster ? { key: `r:${cup.bean_roaster.toLowerCase()}`, label: cup.bean_roaster } : tailGroup(cup, NO_ROASTER)),
  }[group];

  const groups = new Map();
  for (const cup of sorted) {
    const { key, label } = keyOf(cup);
    if (!groups.has(key)) groups.set(key, { key, label, cups: [] });
    groups.get(key).cups.push(cup);
  }
  const list = [...groups.values()];
  if (group === 'month') {
    list.sort((a, b) => (sort === 'oldest' ? compareText(a.key, b.key) : compareText(b.key, a.key)));
  } else {
    // Map order is already "first cup under the sort"; only the tail moves
    // (a stable sort keeps the rest as they are).
    list.sort((a, b) => (TAIL[a.key] ?? 0) - (TAIL[b.key] ?? 0));
  }
  return list;
}

// Gear is hidden until 3b / 3e let gear be renamed: with only the generic
// names, it finds nothing and reads as broken (Design Round 10, 21). Its
// search and heading stay below; adding { value: 'gear', label: 'Gear' }
// back is all it takes.
export const SCOPES = [
  { value: 'words', label: 'Words' },
  { value: 'beans', label: 'Beans' },
];

/** The whole word around a match in free text: "so jui" → "juicy". */
function wordAround(text, at, length) {
  let start = at;
  let end = at + length;
  while (start > 0 && !/\s/.test(text[start - 1])) start -= 1;
  while (end < text.length && !/\s/.test(text[end])) end += 1;
  return text.slice(start, end).replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '') || text.slice(at, at + length);
}

/** The first field of `values` that contains q, as the row's tag shows it. */
function firstMatch(values, q) {
  for (const value of values) {
    if (value && value.toLowerCase().includes(q)) return value;
  }
  return null;
}

/**
 * 8l: the cups matching the query in a scope, newest first, each with the
 * text that matched (the row's tag): [{ cup, match }].
 *   words  My words (the whole word around the match) and the flavour tags
 *          (Design Round 10, 20); a cup matching both is listed once.
 *   beans  bean name, roaster
 *   gear   brewer, grinder (hidden from SCOPES until 3b / 3e)
 * fourUp (4★ and up): a switch, rating ≥ 4, with any scope (Design Round
 * 10, 23). With no query it lists every 4★+ cup, untagged. Matching is a
 * plain case-insensitive substring.
 */
export function searchCups(cups, { query, scope, fourUp }) {
  const q = query.trim().toLowerCase();
  if (!q && !fourUp) return [];
  const found = [];
  for (const cup of [...cups].sort(byNewest)) {
    if (fourUp && !(cup.rating >= 4)) continue;
    if (!q) {
      found.push({ cup, match: null });
      continue;
    }
    let match = null;
    if (scope === 'words') {
      const at = cup.note ? cup.note.toLowerCase().indexOf(q) : -1;
      match = at >= 0 ? wordAround(cup.note, at, q.length) : firstMatch(cup.flavours, q);
    } else if (scope === 'beans') {
      match = firstMatch([cup.bean_name, cup.bean_roaster], q);
    } else {
      match = firstMatch([cup.brew_method, cup.grinder], q);
    }
    if (match) found.push({ cup, match });
  }
  return found;
}

/**
 * The result heading (Design Round 10, 19; "q" is the typed text, curly-quoted):
 *   words  "9 cups say "q"" / "1 cup says "q""
 *   beans  "5 cups of "q""
 *   gear   "4 cups brewed with "q"" (scope hidden for now)
 *   4★ on, field empty  "12 cups rated 4★ and up"
 *   4★ on, with text    the line + " · 4★ and up"
 *   no results          "Nothing matches "q""
 * Two cases Design doesn't name are ours: no results with 4★ on also gets
 * " · 4★ and up" (it narrowed the search), and 4★ alone with no cups reads
 * "No cups rated 4★ and up". TODO(design): confirm both.
 */
export function searchHeading(count, { query, scope, fourUp }) {
  const q = query.trim();
  const cups = count === 1 ? '1 cup' : `${count === 0 ? 'No' : count} cups`;
  if (!q) return `${cups} rated 4★ and up`;
  const quoted = `“${q}”`;
  const line =
    count === 0
      ? `Nothing matches ${quoted}`
      : scope === 'words'
        ? `${cups} ${count === 1 ? 'says' : 'say'} ${quoted}`
        : scope === 'beans'
          ? `${cups} of ${quoted}`
          : `${cups} brewed with ${quoted}`;
  return fourUp ? `${line} · 4★ and up` : line;
}
