// Taste DNA property check: the arithmetic's mathematical properties hold in
// src/data/tasteDna.ts, not just on paper (design/taste-dna.md "Properties").
//   1. Time alone never moves the profile (exponential decay cancels out).
//   2. Every axis value stays within 0–100; band edges at 0 and 100.
// Runs with check:schema on every commit. Run: npm run check:dna
import { AXES, bandOf, computeDna, DNA_TUNING, type Dna, type DnaCup } from '../src/data/tasteDna.ts';
import { TASTE_AXES } from '../src/constants/tasteAxes.js';

const problems: string[] = [];
const fail = (msg: string) => problems.push(msg);

const DAY = 86400000;
const T = 1790000000000;
const TABLE_WORDS = Object.keys(DNA_TUNING.words);

/** Seeded PRNG (mulberry32), so a failure reproduces. */
function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const cup = (rating: number | null, daysAgo: number, axes: Partial<Record<(typeof AXES)[number], number>>, flavours: string[] = []): DnaCup => ({
  rating,
  logged_at: T - daysAgo * DAY,
  axes: { acidity: null, body: null, roast: null, sweetness: null, ...axes },
  flavours,
});

/** A mixed record: unrated cups, axes left out, table and non-table words, ages up to ~3 years. */
function randomCups(seed: number, count: number, maxDays = 1100): DnaCup[] {
  const r = rng(seed);
  return Array.from({ length: count }, () => {
    const axes: Partial<Record<(typeof AXES)[number], number>> = {};
    for (const a of AXES) if (r() < 0.5) axes[a] = Math.round(r() * 4) * 25;
    const flavours = Array.from({ length: Math.floor(r() * 4) }, () => (r() < 0.8 ? TABLE_WORDS[Math.floor(r() * TABLE_WORDS.length)] : 'Juicy'));
    return cup(r() < 0.1 ? null : 1 + Math.floor(r() * 5), r() * maxDays, axes, flavours);
  });
}

// ── 1. Time alone never moves the profile ────────────────────────────────
// Every weight is multiplied by the same 0.5^(Δ / half-life), so Σ(w·v) / Σ(w)
// is unchanged. A weight floor, an N-day window, rounding or a non-exponential
// decay breaks this and the profile drifts daily.
const TIME_TOLERANCE = 1e-9;
let maxTimeError = 0;
{
  const sets: [string, DnaCup[], number | null][] = [
    ['mixed 40 cups', randomCups(1, 40), null],
    ['mixed 300 cups', randomCups(2, 300), null],
    ['mixed, with a reset', randomCups(3, 120), T - 400 * DAY],
    // Words heavy enough that the 1/3 cap binds on every axis.
    ['cap binding', [cup(5, 10, { acidity: 50, body: 50, roast: 50, sweetness: 50 }), ...Array.from({ length: 60 }, (_, i) => cup(4, i * 9, {}, ['Grapefruit', 'Smoke', 'Caramel', 'Black tea']))], null],
  ];
  const shifts = [1, 30, 365];
  for (const [label, cups, resetAt] of sets) {
    const base = computeDna(cups, T, resetAt);
    for (const d of shifts) {
      const later = computeDna(cups, T + d * DAY, resetAt);
      for (const a of AXES) {
        const v0 = base.axes[a].value;
        const v1 = later.axes[a].value;
        if ((v0 == null) !== (v1 == null)) {
          fail(`time: ${label}, +${d} days: ${a} went ${v0} → ${v1}`);
          continue;
        }
        if (v0 == null || v1 == null) continue;
        const err = Math.abs(v1 - v0);
        maxTimeError = Math.max(maxTimeError, err);
        if (err > TIME_TOLERANCE) fail(`time: ${label}, +${d} days: ${a} moved ${v0} → ${v1} (Δ ${err.toExponential(2)})`);
        if (bandOf(v1) !== bandOf(v0)) fail(`time: ${label}, +${d} days: ${a} band ${bandOf(v0)} → ${bandOf(v1)}`);
        if (later.axes[a].n !== base.axes[a].n) fail(`time: ${label}, +${d} days: ${a} n ${base.axes[a].n} → ${later.axes[a].n}`);
      }
      if (later.state !== base.state || later.cups !== base.cups || later.fewest !== base.fewest)
        fail(`time: ${label}, +${d} days: state/cups/fewest ${base.state}/${base.cups}/${base.fewest} → ${later.state}/${later.cups}/${later.fewest}`);
    }
  }
}

// ── 2. Every axis value stays within 0–100 ───────────────────────────────
// A weighted average never leaves the range of its inputs; words also sit at
// 0–100 and the cap only scales them by k ≤ 1. Floating point can land an
// ulp outside (100.00000000000003 with the cap applied); that is allowed and
// reported, anything a display could show is not.
const RANGE_TOLERANCE = 1e-9;
let maxOvershoot = 0;
const inRange = (label: string, dna: Dna) => {
  for (const a of AXES) {
    const v = dna.axes[a].value;
    if (v == null) continue;
    const over = Math.max(0 - v, v - 100, 0);
    maxOvershoot = Math.max(maxOvershoot, over);
    if (!(over <= RANGE_TOLERANCE)) fail(`range: ${label}: ${a} = ${v}`);
  }
};
const near = (label: string, got: number | null, want: number) => {
  if (got == null || Math.abs(got - want) > 1e-9) fail(`range: ${label}: expected ${want}, got ${got}`);
};
{
  const all = (v: number) => Array.from({ length: 100 }, (_, i) => cup(5, i * 3.7, { acidity: v, body: v, roast: v, sweetness: v }));
  const zero = computeDna(all(0), T);
  const hundred = computeDna(all(100), T);
  for (const a of AXES) {
    near(`100 cups 5★ at 0, ${a}`, zero.axes[a].value, 0);
    near(`100 cups 5★ at 100, ${a}`, hundred.axes[a].value, 100);
  }
  inRange('all 0', zero);
  inRange('all 100', hundred);

  // Half and half at equal weights (paired: same rating, same time).
  const half = Array.from({ length: 100 }, (_, i) => cup(1 + (Math.floor(i / 2) % 5), Math.floor(i / 2) * 5, { acidity: i % 2 ? 100 : 0, roast: i % 2 ? 0 : 100 }));
  const h = computeDna(half, T);
  near('0 and 100 half and half, acidity', h.axes.acidity.value, 50);
  near('0 and 100 half and half, roast', h.axes.roast.value, 50);

  // Weights skewed hard both ways: 1 new 5★ against 99 one-year-old 1★.
  for (const [newV, oldV] of [[100, 0], [0, 100]]) {
    const skew = [cup(5, 0, { acidity: newV }), ...Array.from({ length: 99 }, () => cup(1, 365, { acidity: oldV }))];
    inRange(`skewed, new ${newV} / old ${oldV}`, computeDna(skew, T));
  }

  // Words only: no slider record means no value at all (never a word-made one).
  const wordsOnly = Array.from({ length: 500 }, (_, i) => cup(5, i * 0.5, {}, ['Grapefruit', 'Smoke', 'Caramel', 'Black tea', 'Peach']));
  const w = computeDna(wordsOnly, T);
  for (const a of AXES) if (w.axes[a].value !== null) fail(`range: 500 words-only cups: ${a} should have no value, got ${w.axes[a].value}`);
  // One slider record under 500 cups of extreme words: the cap rescales, the value stays in range, words ≤ 1/3.
  for (const sliderAt of [0, 50, 100]) {
    const flooded = [cup(1, 300, { acidity: sliderAt, body: sliderAt, roast: sliderAt, sweetness: sliderAt }), ...wordsOnly];
    const f = computeDna(flooded, T);
    inRange(`1 slider at ${sliderAt} + 500 words-only cups`, f);
    for (const a of AXES) {
      const s = f.axes[a];
      const share = s.wordWeight / (s.sliderWeight + s.wordWeight);
      if (share > DNA_TUNING.wordShareCap + 1e-12) fail(`range: words' share on ${a} is ${share}, above the cap`);
    }
  }

  // Fuzz: random records, random "today".
  for (let seed = 100; seed < 1100; seed++) {
    const r = rng(seed);
    const cups = randomCups(seed, 1 + Math.floor(r() * 200));
    inRange(`fuzz seed ${seed}`, computeDna(cups, T + r() * 500 * DAY));
  }
}

// ── Band edges ───────────────────────────────────────────────────────────
// Five steps, edges 12.5 / 37.5 / 62.5 / 87.5: 0 is the first step (Very
// bright), 100 the last (Very bitter); each value in exactly one band.
{
  const acidity = TASTE_AXES.find((x) => x.key === 'acidity')!;
  if (acidity.steps[bandOf(0)] !== 'Very bright') fail(`band: 0 → ${acidity.steps[bandOf(0)]}, expected Very bright`);
  if (acidity.steps[bandOf(100)] !== 'Very bitter') fail(`band: 100 → ${acidity.steps[bandOf(100)]}, expected Very bitter`);
  const edges: [number, number][] = [[0, 0], [12.499999, 0], [12.5, 1], [37.499999, 1], [37.5, 2], [62.499999, 2], [62.5, 3], [87.499999, 3], [87.5, 4], [100, 4]];
  for (const [v, want] of edges) if (bandOf(v) !== want) fail(`band: ${v} → ${bandOf(v)}, expected ${want}`);
  let prev = 0;
  for (let i = 0; i <= 10000; i++) {
    const b = bandOf(i / 100);
    if (!Number.isInteger(b) || b < 0 || b > 4) fail(`band: ${i / 100} → ${b}, outside 0–4`);
    if (b < prev || b > prev + 1) fail(`band: ${i / 100} → ${b} after ${prev} (not one step at a time)`);
    prev = b;
  }
  for (const x of TASTE_AXES) if (x.steps.length !== 5) fail(`band: ${x.key} has ${x.steps.length} step names, bandOf gives 5`);
}

if (problems.length) {
  console.error(`check:dna FAILED (${problems.length})\n  - ${problems.slice(0, 30).join('\n  - ')}`);
  process.exit(1);
}
console.log(`check:dna OK — time shifts +1/+30/+365 days leave the profile unchanged (max float drift ${maxTimeError.toExponential(1)}); values within 0–100 (max float overshoot ${maxOvershoot.toExponential(1)}); band edges hold.`);
