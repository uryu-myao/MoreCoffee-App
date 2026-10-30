// CSV export check: "Export my cups" (src/data/csv.ts) writes a file a
// spreadsheet reads back cell for cell. Fixture cups with the hard cases —
// Japanese, My words with commas / quotes / line breaks, axes partly noted,
// free text starting with = + - @, a roast date after the cup — go through
// cupsCsv, then through a strict RFC 4180 reader written here (not the
// writer's own code), and every cell is compared with what it should be.
// Runs with check:schema on every commit. Run: npm run check:csv
import { CSV_HEADER, FLAVOUR_JOIN, cupsCsv, type CsvCup } from '../src/data/csv.ts';
import { TASTE_AXES } from '../src/constants/tasteAxes.js';

const problems: string[] = [];
const fail = (msg: string) => problems.push(msg);

/**
 * RFC 4180, strictly: CRLF between records, a quoted field may hold anything
 * with its quotes doubled, an unquoted field holds no quote, comma, CR or LF.
 * Anything else is an error, so a writer that bends the rules fails here.
 */
function parse(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let i = 0;
  const n = text.length;
  while (i < n) {
    let cell = '';
    if (text[i] === '"') {
      i += 1;
      for (;;) {
        if (i >= n) throw new Error('unclosed quote');
        if (text[i] === '"') {
          if (text[i + 1] === '"') {
            cell += '"';
            i += 2;
            continue;
          }
          i += 1;
          break;
        }
        cell += text[i];
        i += 1;
      }
    } else {
      while (i < n && text[i] !== ',' && text[i] !== '\r' && text[i] !== '\n') {
        if (text[i] === '"') throw new Error(`a quote inside an unquoted field, at ${i}`);
        cell += text[i];
        i += 1;
      }
    }
    row.push(cell);
    if (text[i] === ',') {
      i += 1;
      continue;
    }
    if (text[i] === '\r' && text[i + 1] === '\n') {
      rows.push(row);
      row = [];
      i += 2;
      continue;
    }
    if (i >= n) throw new Error('the last record has no CRLF');
    throw new Error(`expected a comma or CRLF after a field, at ${i} (${JSON.stringify(text.slice(i, i + 10))})`);
  }
  return rows;
}

const base: CsvCup = {
  id: 0, logged_at: 0, mode: 'made_it', rating: 4, note: null, flavours: [],
  bean_name: null, bean_roaster: null, bean_origin: null, bean_region: null, bean_process: null, bean_roast_level: null, bean_roasted_at: null,
  brew_method: null, grinder: null, axis_acidity: null, axis_body: null, axis_roast: null, axis_sweetness: null,
  drink_type: null, place_name: null, product_name: null,
};
// Local times, as the sheet writes them.
const at = (y: number, mo: number, d: number, h = 0, mi = 0) => new Date(y, mo - 1, d, h, mi).getTime();

const cups: CsvCup[] = [
  {
    ...base, id: 3, logged_at: at(2026, 10, 28, 8, 20),
    bean_name: 'エチオピア グジ', bean_roaster: '丸山珈琲', bean_origin: 'Ethiopia', bean_region: 'Guji',
    bean_process: 'washed', bean_roast_level: 'medium-dark', bean_roasted_at: at(2026, 10, 21),
    brew_method: 'Hario V60 02', grinder: 'Comandante C40', axis_acidity: 0, axis_body: 75,
    flavours: ['juicy', 'ベルガモット', 'stone fruit'],
    note: '明るい酸味, でも後味が "苦い"。\n2行目, comma\r\nCRLF line',
  },
  { ...base, id: 1, logged_at: at(2026, 10, 1, 19, 5), rating: 2, note: '- too roasty', bean_name: '=SUM(A1)', bean_roaster: '@roaster', grinder: '\tTab', flavours: ['+bitter'], axis_roast: 100, axis_sweetness: 25 },
  { ...base, id: 2, logged_at: at(2026, 10, 10, 12), mode: 'barista', rating: 5, drink_type: 'Flat white', place_name: 'Fuglen, Tokyo', bean_roasted_at: at(2026, 10, 12) },
  { ...base, id: 4, logged_at: at(2026, 10, 15, 7), mode: 'packaged', rating: 3, product_name: 'BOSS "Craft" Black', axis_acidity: 50, axis_body: 50, axis_roast: 50, axis_sweetness: 50 },
];

const text = cupsCsv(cups);

// Encoding and framing.
if (!text.startsWith('﻿')) fail('no BOM: Excel would read the Japanese as mojibake');
if (/[^\r]\n/.test(text.replace(/"(?:[^"]|"")*"/g, ''))) fail('a record ends in a bare LF, not CRLF');

let rows: string[][] = [];
try {
  rows = parse(text.slice(1));
} catch (error) {
  fail(`not RFC 4180: ${(error as Error).message}`);
}

if (rows.length) {
  const [head, ...body] = rows;
  if (head.length !== 27) fail(`header has ${head.length} columns, expected 27`);
  if (JSON.stringify(head) !== JSON.stringify(CSV_HEADER)) fail('header differs from CSV_HEADER');
  for (const a of TASTE_AXES) {
    if (!head.includes(`${a.name} (0–100)`) || !head.includes(a.name)) fail(`axis ${a.key}: no value / step column pair`);
  }
  body.forEach((r, i) => r.length !== head.length && fail(`row ${i + 1} has ${r.length} cells, header ${head.length}`));
  if (body.length !== cups.length) fail(`${body.length} rows for ${cups.length} cups`);

  const col = (name: string) => head.indexOf(name);
  const ids = body.map((r) => r[col('Cup id')]);
  if (ids.join() !== '1,2,4,3') fail(`rows not oldest first: ${ids.join()}`);

  // Typed text keeps what was typed; a leading = + - @ tab CR gets one '.
  const typed = (s: string | null) => (s == null ? '' : /^[=+\-@\t\r]/.test(s) ? `'${s}` : s);
  for (const r of body) {
    const cup = cups.find((c) => String(c.id) === r[col('Cup id')])!;
    const expect: Record<string, string> = {
      Bean: typed(cup.bean_name),
      Roaster: typed(cup.bean_roaster),
      Origin: typed(cup.bean_origin),
      Region: typed(cup.bean_region),
      Brewer: typed(cup.brew_method),
      Grinder: typed(cup.grinder),
      Flavours: typed(cup.flavours.length ? cup.flavours.join(FLAVOUR_JOIN) : null),
      'My words': typed(cup.note),
      Drink: typed(cup.drink_type),
      'Café': typed(cup.place_name),
      Product: typed(cup.product_name),
      Rating: cup.rating == null ? '' : String(cup.rating),
    };
    for (const a of TASTE_AXES) {
      const v = cup[`axis_${a.key}` as keyof CsvCup] as number | null;
      // Not noted: both cells empty. Never 0: 0 is "Very bright".
      expect[`${a.name} (0–100)`] = v == null ? '' : String(v);
      expect[a.name] = v == null ? '' : a.steps[v / 25];
    }
    for (const [name, want] of Object.entries(expect)) {
      const got = r[col(name)];
      if (got !== want) fail(`cup ${cup.id} ${name}: ${JSON.stringify(got)}, expected ${JSON.stringify(want)}`);
    }
  }

  const byId = (id: number) => body.find((r) => r[col('Cup id')] === String(id))!;
  const cup3 = byId(3);
  if (cup3[col('Logged at')] !== '2026-10-28 08:20') fail(`Logged at: ${cup3[col('Logged at')]}, expected 2026-10-28 08:20`);
  if (cup3[col('Roasted on')] !== '2026-10-21') fail(`Roasted on: ${cup3[col('Roasted on')]}`);
  if (cup3[col('Roast day')] !== '7') fail(`Roast day: ${cup3[col('Roast day')]}, expected 7`);
  if (cup3[col('Process')] !== 'Washed' || cup3[col('Roast level')] !== 'Medium-dark') fail('process / roast level not written as words');
  if (cup3[col('Kind')] !== 'I made it') fail(`Kind: ${cup3[col('Kind')]}`);
  // Roasted after the cup: no negative day (as 2c). No roast date: empty.
  if (byId(2)[col('Roast day')] !== '') fail(`Roast day for a roast after the cup: ${byId(2)[col('Roast day')]}, expected empty`);
  if (byId(4)[col('Roast day')] !== '') fail('Roast day with no roast date is not empty');
}

if (problems.length) {
  console.error(`check:csv FAILED (${problems.length})\n  - ${problems.slice(0, 30).join('\n  - ')}`);
  process.exit(1);
}
console.log(`check:csv OK — ${cups.length} cups round-trip through a strict RFC 4180 reader: BOM, CRLF, ${CSV_HEADER.length} columns, quoting, formula guard, empty axes, roast day.`);
