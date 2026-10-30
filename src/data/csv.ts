/**
 * "Export my cups" as CSV (6b's row, 2026-10-28): one cup a row, one wide
 * sheet, for Uryu's own analysis in a spreadsheet (the rating spread, one
 * bag's axes over time). Pure, no I/O: export.ts reads the cups and shares
 * the file; scripts can run this under node.
 *
 * Columns (27), oldest cup first:
 *   Logged at       "2026-10-28 08:20", local time, no T, no zone: the form
 *                   Excel, Numbers and Sheets read as a date and time. The
 *                   machine-exact form is the JSON backup's.
 *   Kind            I made it / Barista / Packaged (MODE_LABEL)
 *   Rating          1–5
 *   Bean … Roasted on   the cup's own copies of its bag (data-model.md, the
 *                   copy rule), not the bag as it is now
 *   Roast day       days from the roast to the cup, as 2c's "day 7 when
 *                   brewed": empty with no roast date, and never negative
 *   Brewer, Grinder the cup's copies of its gear's names
 *   per axis        "Acidity (0–100)", the stored value (Taste DNA's own
 *                   scale, so its sums can be checked), then "Acidity", the
 *                   step's name (TASTE_AXES, as 2c reads it). Not noted:
 *                   both empty, never 0 (0 is "Very bright").
 *   Flavours        the tags in their order, joined by "; "
 *   My words        as written, line breaks kept
 *   Drink, Café     Barista's; Product: Packaged's
 *   Cup id          to find the cup in the JSON backup
 * Left out: grind setting, water temperature and ratio (no input in V1, so
 * always empty); the bags' and gear's own records (size, default, finished
 * on): the backup has them.
 *
 * Encoding (RFC 4180): UTF-8 with a BOM (Excel reads Japanese bean names
 * and words only with it), CRLF between records, a field quoted when it
 * holds a comma, a double quote, CR or LF, its quotes doubled.
 * Free text the user typed (bean, roaster, origin, region, brewer, grinder,
 * flavours, My words, drink, café, product) starting with = + - @ (or a tab
 * or CR) gets a leading ' (OWASP's CSV injection advice): Excel would read
 * "- juicy" as a formula and show #NAME?. Numbers and Sheets show the '.
 * Values the app writes (dates, Kind, step names, numbers) are left as they
 * are.
 */
import { MODE_LABEL } from '../constants/cups.js';
import { daysBetween } from '../constants/dates.js';
import { TASTE_AXES } from '../constants/tasteAxes.js';

/** What the sheet reads of a cup (export.ts's query: the cup and its café's name). */
export type CsvCup = {
  id: number;
  logged_at: number;
  mode: 'made_it' | 'barista' | 'packaged';
  rating: number | null;
  note: string | null;
  flavours: string[];
  bean_name: string | null;
  bean_roaster: string | null;
  bean_origin: string | null;
  bean_region: string | null;
  bean_process: string | null;
  bean_roast_level: string | null;
  bean_roasted_at: number | null;
  brew_method: string | null;
  grinder: string | null;
  axis_acidity: number | null;
  axis_body: number | null;
  axis_roast: number | null;
  axis_sweetness: number | null;
  drink_type: string | null;
  place_name: string | null;
  product_name: string | null;
};

const BOM = '﻿';
const EOL = '\r\n';
export const FLAVOUR_JOIN = '; ';

/** Free text that a spreadsheet would read as a formula. */
const FORMULA_START = /^[=+\-@\t\r]/;
const NEEDS_QUOTES = /[",\r\n]/;

type Cell = string | number | null | undefined;
/** A typed value: may need the leading '. */
const typed = (s: string | null | undefined): { text: string } | null => (s == null || s === '' ? null : { text: s });

function field(value: Cell | { text: string }): string {
  if (value == null) return '';
  let s: string;
  if (typeof value === 'object') s = FORMULA_START.test(value.text) ? `'${value.text}` : value.text;
  else s = String(value);
  return NEEDS_QUOTES.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

const pad = (n: number) => String(n).padStart(2, '0');
const localDay = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const localMinute = (d: Date) => `${localDay(d)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
const capitalise = (s: string | null) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : null);

/** A stored axis value's step, as 2c names it (0 / 25 / … / 100 → the five names). */
const stepName = (steps: readonly string[], value: number | null) => (value == null ? null : steps[Math.round(value / 25)] ?? null);

export const CSV_HEADER = [
  'Logged at',
  'Kind',
  'Rating',
  'Bean',
  'Roaster',
  'Origin',
  'Region',
  'Process',
  'Roast level',
  'Roasted on',
  'Roast day',
  'Brewer',
  'Grinder',
  ...TASTE_AXES.flatMap((a) => [`${a.name} (0–100)`, a.name]),
  'Flavours',
  'My words',
  'Drink',
  'Café',
  'Product',
  'Cup id',
];

function row(cup: CsvCup): (Cell | { text: string })[] {
  const day = cup.bean_roasted_at != null ? daysBetween(cup.bean_roasted_at, cup.logged_at) : null;
  return [
    localMinute(new Date(cup.logged_at)),
    MODE_LABEL[cup.mode],
    cup.rating,
    typed(cup.bean_name),
    typed(cup.bean_roaster),
    typed(cup.bean_origin),
    typed(cup.bean_region),
    capitalise(cup.bean_process),
    capitalise(cup.bean_roast_level),
    cup.bean_roasted_at != null ? localDay(new Date(cup.bean_roasted_at)) : null,
    day != null && day >= 0 ? day : null,
    typed(cup.brew_method),
    typed(cup.grinder),
    ...TASTE_AXES.flatMap((a) => {
      const value = cup[`axis_${a.key}` as keyof CsvCup] as number | null;
      return [value, stepName(a.steps, value)];
    }),
    typed(cup.flavours.join(FLAVOUR_JOIN)),
    typed(cup.note),
    typed(cup.drink_type),
    typed(cup.place_name),
    typed(cup.product_name),
    cup.id,
  ];
}

/** The whole file's text, BOM first. Cups in any order; the sheet is oldest first. */
export function cupsCsv(cups: CsvCup[]): string {
  const sorted = [...cups].sort((a, b) => a.logged_at - b.logged_at || a.id - b.id);
  const lines = [CSV_HEADER.map((h) => field(h)), ...sorted.map((c) => row(c).map(field))];
  return BOM + lines.map((cells) => cells.join(',')).join(EOL) + EOL;
}
