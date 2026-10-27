/**
 * Taste DNA: arithmetic on logged cups (design/taste-dna.md, decided
 * 2026-10-11). Pure functions, no I/O, so the app and migration 3's replay
 * (and scripts/check-schema.ts under node) share one implementation.
 *
 * Per axis, over rated cups logged on or after `resetAt` and no later than
 * `asOf`:
 *   value = Σ(w · v) / Σ(w), w = ratingWeight × 0.5^(age / halfLife)
 *   - a slider record contributes its value at weight w;
 *   - a bundled flavour word contributes its table value at w × strength;
 *   - an axis nobody noted has no value (never 50: untouched = unknown).
 *   - words are capped per axis at wordShareCap of the axis's total weight,
 *     by scaling every word on that axis by one factor (see DNA_TUNING).
 * Lock-in counts slider records only: an axis is locked at `lockIn`; the
 * profile is locked when every axis with a slider record is (option B), and
 * once locked it stays locked (decided 2026-10-11): a first note on a new axis
 * does not un-lock it. Worked out on read by walking the counted cups in
 * logged order, so no stored flag; deleting cups can undo a lock, since the
 * walk then never reaches it.
 */

export const AXES = ['acidity', 'body', 'roast', 'sweetness'] as const;
export type AxisKey = (typeof AXES)[number];

/**
 * TUNING — initial values, to be adjusted against real use (taste-dna.md
 * "These numbers are starting values"). If the profile disagrees with how the
 * cups felt, change these first. Keep every tuning number here; nowhere else.
 */
export const DNA_TUNING = {
  /** Confidence by stars, never direction. Unrated cups are ignored. */
  ratingWeight: { 1: 0.25, 2: 0.5, 3: 1, 4: 2, 5: 3 } as Record<number, number>,
  /** Recency: exponential decay. 30 days → 0.79, 8 months → 0.16. */
  halfLifeDays: 90,
  /** Slider records an axis needs to lock in (flavour words never count). */
  lockIn: 10,
  /**
   * Words may make up at most this share of an axis's total weight. Why
   * (taste-dna.md): one word is weak, but words are picked on nearly every
   * cup while sliders are moved only when noticed. Without a cap, an axis
   * with few slider records is decided by words alone. Do not remove it
   * because the number looks arbitrary; the asymmetry is the reason.
   * Applied by scaling all words on the axis by one factor, so their relative
   * strengths (Grapefruit 0.4 : Jasmine 0.2) never change. With no slider
   * record on an axis, words alone give it no value.
   */
  wordShareCap: 1 / 3,
  /**
   * The ten bundled words (and only those). A word is a weak record: a value
   * on the slider's step grid (Acid ↔ Bitter: 0 = acid) at a strength of at
   * most 0.4 of one slider record. Criterion: a predictable, one-way lean on
   * that axis when the word comes up. Cinnamon: none.
   */
  words: {
    jasmine: [{ axis: 'acidity', at: 25, strength: 0.2 }],
    peach: [
      { axis: 'acidity', at: 25, strength: 0.3 },
      { axis: 'sweetness', at: 75, strength: 0.3 },
    ],
    grapefruit: [{ axis: 'acidity', at: 0, strength: 0.4 }],
    blackcurrant: [
      { axis: 'acidity', at: 25, strength: 0.3 },
      { axis: 'sweetness', at: 75, strength: 0.2 },
    ],
    'black tea': [{ axis: 'body', at: 25, strength: 0.3 }],
    cocoa: [{ axis: 'roast', at: 75, strength: 0.3 }],
    walnut: [{ axis: 'roast', at: 75, strength: 0.2 }],
    caramel: [{ axis: 'sweetness', at: 75, strength: 0.4 }],
    smoke: [{ axis: 'roast', at: 100, strength: 0.4 }],
  } as Record<string, { axis: AxisKey; at: number; strength: number }[]>,
};

const DAY_MS = 86400000;

/** The cup fields the arithmetic reads. */
export type DnaCup = {
  rating: number | null;
  logged_at: number;
  axes: Record<AxisKey, number | null>;
  flavours: string[];
};

export type AxisDna = {
  /** 0–100, or null when nothing noted this axis */
  value: number | null;
  /** slider records (what lock-in counts) */
  n: number;
  /** total weight from sliders and from words: the words' share = words / (slider + words) */
  sliderWeight: number;
  wordWeight: number;
};

export type Dna = {
  axes: Record<AxisKey, AxisDna>;
  /** 'none': no axis has anything; 'early' / 'locked': option B */
  state: 'none' | 'early' | 'locked';
  /** slider records on the least-noted axis that has any (1b's "N more") */
  fewest: number | null;
  /** 8f's "From N cups": counted cups with an axis noted or a table word */
  cups: number;
};

const wordsOf = (cup: DnaCup) => cup.flavours.flatMap((w) => DNA_TUNING.words[w.toLowerCase()] ?? []);

export function computeDna(cups: readonly DnaCup[], asOf: number, resetAt: number | null = null): Dna {
  const sum = Object.fromEntries(AXES.map((a) => [a, { sliderWV: 0, wordWV: 0, sliderW: 0, wordW: 0, n: 0 }])) as Record<
    AxisKey,
    { sliderWV: number; wordWV: number; sliderW: number; wordW: number; n: number }
  >;
  let counted = 0;
  for (const cup of cups) {
    const rw = cup.rating ? DNA_TUNING.ratingWeight[cup.rating] : undefined;
    if (!rw || cup.logged_at > asOf || (resetAt != null && cup.logged_at < resetAt)) continue;
    const w = rw * Math.pow(0.5, (asOf - cup.logged_at) / (DNA_TUNING.halfLifeDays * DAY_MS));
    let used = false;
    for (const a of AXES) {
      const v = cup.axes[a];
      if (v == null) continue;
      sum[a].sliderWV += w * v;
      sum[a].sliderW += w;
      sum[a].n += 1;
      used = true;
    }
    for (const { axis, at, strength } of wordsOf(cup)) {
      sum[axis].wordWV += w * strength * at;
      sum[axis].wordW += w * strength;
      used = true;
    }
    if (used) counted += 1;
  }

  const axes = Object.fromEntries(
    AXES.map((a) => {
      const s = sum[a];
      // Cap: words ≤ cap × (sliders + words) ⇔ words ≤ sliders × cap / (1 − cap).
      // One factor for every word on the axis keeps their ratios.
      const cap = DNA_TUNING.wordShareCap;
      const allowed = (s.sliderW * cap) / (1 - cap);
      const k = s.wordW > allowed ? allowed / s.wordW : 1;
      const wordW = s.wordW * k;
      const total = s.sliderW + wordW;
      return [a, { value: total > 0 ? (s.sliderWV + k * s.wordWV) / total : null, n: s.n, sliderWeight: s.sliderW, wordWeight: wordW }];
    })
  ) as Record<AxisKey, AxisDna>;

  const noted = AXES.map((a) => axes[a].n).filter((n) => n > 0);
  const fewest = noted.length ? Math.min(...noted) : null;
  const anything = AXES.some((a) => axes[a].value != null);
  const state = !anything ? 'none' : everLocked(cups, asOf, resetAt) ? 'locked' : 'early';
  return { axes, state, fewest, cups: counted };
}

/** Whether, at any point in logged order, every noted axis had `lockIn` slider records. */
function everLocked(cups: readonly DnaCup[], asOf: number, resetAt: number | null): boolean {
  const counts = Object.fromEntries(AXES.map((a) => [a, 0])) as Record<AxisKey, number>;
  const ordered = cups
    .filter((c) => c.rating && DNA_TUNING.ratingWeight[c.rating] && c.logged_at <= asOf && (resetAt == null || c.logged_at >= resetAt))
    .slice()
    .sort((a, b) => a.logged_at - b.logged_at);
  for (const cup of ordered) {
    for (const a of AXES) if (cup.axes[a] != null) counts[a] += 1;
    const noted = AXES.filter((a) => counts[a] > 0);
    if (noted.length && noted.every((a) => counts[a] >= DNA_TUNING.lockIn)) return true;
  }
  return false;
}

/** Band on the slider's five steps (edges 12.5 / 37.5 / 62.5 / 87.5): 0–4. */
export function bandOf(value: number): number {
  return value < 12.5 ? 0 : value < 37.5 ? 1 : value < 62.5 ? 2 : value < 87.5 ? 3 : 4;
}

/** What a cup stores at save time (cups.dna_change): per axis value (0.1) and slider count. */
export type DnaSnapshot = Record<AxisKey, { value: number | null; n: number }>;
export type DnaChange = { before: DnaSnapshot; after: DnaSnapshot };

export const snapshotOf = (dna: Dna): DnaSnapshot =>
  Object.fromEntries(
    AXES.map((a) => [a, { value: dna.axes[a].value == null ? null : Math.round(dna.axes[a].value * 10) / 10, n: dna.axes[a].n }])
  ) as DnaSnapshot;

/**
 * The change one cup made, as of its own logged time: the profile from the
 * cups before it, then with it. Deterministic: no clock is read.
 */
export function changeOf(earlier: readonly DnaCup[], cup: DnaCup, resetAt: number | null = null): DnaChange {
  return {
    before: snapshotOf(computeDna(earlier, cup.logged_at, resetAt)),
    after: snapshotOf(computeDna([...earlier, cup], cup.logged_at, resetAt)),
  };
}

/** A cups row (as stored) → the fields the arithmetic reads. */
export function dnaCupFromRow(row: {
  rating: number | null;
  logged_at: number;
  axis_acidity: number | null;
  axis_body: number | null;
  axis_roast: number | null;
  axis_sweetness: number | null;
  flavours: string;
}): DnaCup {
  return {
    rating: row.rating,
    logged_at: row.logged_at,
    axes: { acidity: row.axis_acidity, body: row.axis_body, roast: row.axis_roast, sweetness: row.axis_sweetness },
    flavours: JSON.parse(row.flavours),
  };
}

/** One axis that crossed into another band (taste-dna.md "Shifts"): band indexes 0–4. */
export type AxisShift = { axis: AxisKey; from: number; to: number };
export type DnaShift = { at: number; axes: AxisShift[] };

/**
 * 8f's last shift: the latest cup (by logged time) whose stored change moved
 * an axis into another band (bandOf), read from cups.dna_change, never
 * recomputed (taste-dna.md item 5). An axis noted for the first time (before
 * null) has no band to leave, so it is not a shift. Rows newest first.
 */
export function lastShift(rows: readonly { logged_at: number; dna_change: string }[]): DnaShift | null {
  for (const row of rows) {
    const change = JSON.parse(row.dna_change) as DnaChange;
    const axes: AxisShift[] = [];
    for (const axis of AXES) {
      const before = change.before[axis].value;
      const after = change.after[axis].value;
      if (before == null || after == null) continue;
      const from = bandOf(before);
      const to = bandOf(after);
      if (from !== to) axes.push({ axis, from, to });
    }
    if (axes.length) return { at: row.logged_at, axes };
  }
  return null;
}
