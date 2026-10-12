import type { SQLiteDatabase } from 'expo-sqlite';
import type { Bag, CupMode, Gear, GearCategory, Place, Product, Row } from './schema';
import { changeOf, computeDna, dnaCupFromRow, type Dna } from './tasteDna';

/**
 * The reference rows Record coffee pre-fills its field sets with. Until the
 * pickers land (Step 5 TODOs): the most recently opened bag that is still open,
 * the default brewer and grinder, and the most recent café / product / store.
 * Any of them can be null on a database with no rows yet.
 */
export type RecordDefaults = {
  bag: Bag | null;
  brewer: Gear | null;
  grinder: Gear | null;
  cafe: Place | null;
  product: Product | null;
  store: Place | null;
};

export async function loadRecordDefaults(db: SQLiteDatabase): Promise<RecordDefaults> {
  // Café, product and store are NOT pre-filled (2026-10-11): no V1 screen lets
  // the user choose or create one, so "the newest row" could only ever be the
  // dev seed's, and a cup would record a café / product nobody picked. A
  // record must be a fact. They come back with their pickers (Packaged's
  // product name: design-missing.md 6; Barista: not at this stage).
  const [bag, brewer, grinder] = await Promise.all([
    db.getFirstAsync<Bag & { notes: string }>('SELECT * FROM bags WHERE finished_at IS NULL AND opened_at IS NOT NULL ORDER BY opened_at DESC, id DESC LIMIT 1'),
    db.getFirstAsync<Gear>("SELECT * FROM gear WHERE category = 'brewer' AND is_default = 1"),
    db.getFirstAsync<Gear>("SELECT * FROM gear WHERE category = 'grinder' AND is_default = 1"),
  ]);
  const cafe: Place | null = null;
  const product: Product | null = null;
  const store: Place | null = null;
  return {
    bag: bag ? { ...bag, notes: JSON.parse(bag.notes as unknown as string) } : null,
    brewer: brewer ?? null,
    grinder: grinder ?? null,
    cafe: cafe ?? null,
    product: product ?? null,
    store: store ?? null,
  };
}

/**
 * At most this many bags on the shelf at once (3c / 3d "2 / 5"), opened or
 * not yet (decided 2026-10-12: an unopened bag takes a slot too). Finishing
 * frees one.
 */
export const OPEN_BAG_LIMIT = 5;

/** Bags not finished yet, opened or not: what takes the 5 slots. */
export async function countOpenBags(db: SQLiteDatabase): Promise<number> {
  const row = await db.getFirstAsync<{ n: number }>('SELECT COUNT(*) AS n FROM bags WHERE finished_at IS NULL');
  return row?.n ?? 0;
}

/** What 3c's Bag form hands over (minimal set: name required, the rest optional). */
export type NewBag = { name: string; roaster: string | null; roastedAt: number | null; open: boolean };

/**
 * Add a bag: opened now (3c "Open this bag"), or not yet (3c "Add without
 * opening", 2026-10-12; opened later from 3d). Returns the stored row, so the
 * Record sheet can pre-fill an opened one at once. Refuses past the limit
 * (the screen disables the buttons there too).
 */
export async function insertBag(db: SQLiteDatabase, bag: NewBag): Promise<Bag> {
  if ((await countOpenBags(db)) >= OPEN_BAG_LIMIT) throw new Error(`All ${OPEN_BAG_LIMIT} slots are taken. Finish a bag to free one up.`);
  const result = await db.runAsync('INSERT INTO bags (name, roaster, roasted_at, opened_at) VALUES (?, ?, ?, ?)', [
    bag.name,
    bag.roaster,
    bag.roastedAt,
    bag.open ? Date.now() : null,
  ]);
  const row = await db.getFirstAsync<Bag & { notes: string }>('SELECT * FROM bags WHERE id = ?', [result.lastInsertRowId]);
  if (!row) throw new Error('The bag was not stored.');
  notifyShelfChanged();
  return { ...row, notes: JSON.parse(row.notes as unknown as string) };
}

/** Taste DNA now, from every counted cup (computed on read, never stored). */
export async function loadTasteDna(db: SQLiteDatabase): Promise<Dna> {
  const settings = await db.getFirstAsync<{ reset_at: number | null }>('SELECT reset_at FROM settings');
  const rows = await db.getAllAsync<Parameters<typeof dnaCupFromRow>[0]>(
    'SELECT rating, logged_at, axis_acidity, axis_body, axis_roast, axis_sweetness, flavours FROM cups ORDER BY logged_at, id'
  );
  return computeDna(rows.map(dnaCupFromRow), Date.now(), settings?.reset_at ?? null);
}

/** One cup as 2c shows it: every stored field, with its place / product names. */
export type CupRecord = Row<'cups'> & {
  place_name: string | null;
  product_brand: string | null;
  product_name: string | null;
  bought_at_name: string | null;
};

export async function getCup(db: SQLiteDatabase, id: number): Promise<CupRecord | null> {
  const row = await db.getFirstAsync<CupRecord & { flavours: string }>(
    `SELECT c.*, p.name AS place_name, pr.brand AS product_brand, pr.name AS product_name, bp.name AS bought_at_name
       FROM cups c
       LEFT JOIN places p ON p.id = c.place_id
       LEFT JOIN products pr ON pr.id = c.product_id
       LEFT JOIN places bp ON bp.id = c.bought_at_place_id
      WHERE c.id = ?`,
    [id]
  );
  return row ? { ...row, flavours: JSON.parse(row.flavours as unknown as string) } : null;
}

/** Opened, not finished bags, newest opened first: the bag picker's rows (a cup is logged from an opened bag). */
export async function listOpenBags(db: SQLiteDatabase): Promise<Bag[]> {
  const rows = await db.getAllAsync<Bag & { notes: string }>(
    'SELECT * FROM bags WHERE finished_at IS NULL AND opened_at IS NOT NULL ORDER BY opened_at DESC, id DESC'
  );
  return rows.map((row) => ({ ...row, notes: JSON.parse(row.notes as unknown as string) }));
}

/** Every bag on the shelf (Home's My beans, 3d): opened ones newest first, then those not opened yet. */
export async function listShelfBags(db: SQLiteDatabase): Promise<Bag[]> {
  const rows = await db.getAllAsync<Bag & { notes: string }>(
    'SELECT * FROM bags WHERE finished_at IS NULL ORDER BY opened_at IS NULL, opened_at DESC, id DESC'
  );
  return rows.map((row) => ({ ...row, notes: JSON.parse(row.notes as unknown as string) }));
}

/** Open a bag that was added without opening (3d "Open this bag"). */
export async function openBag(db: SQLiteDatabase, id: number): Promise<void> {
  await db.runAsync('UPDATE bags SET opened_at = ? WHERE id = ? AND opened_at IS NULL', [Date.now(), id]);
  notifyShelfChanged();
}

/** Finish a bag (3d): it leaves the open bags and frees its slot; its cups keep their copies. */
export async function finishBag(db: SQLiteDatabase, id: number): Promise<void> {
  await db.runAsync('UPDATE bags SET finished_at = ? WHERE id = ? AND finished_at IS NULL', [Date.now(), id]);
  notifyShelfChanged();
}

/** Every piece of gear with the cups logged with it (4a: "Brewer · 2 cups"); defaults first. */
export async function listGearWithUse(db: SQLiteDatabase): Promise<(Gear & { cups: number })[]> {
  return db.getAllAsync<Gear & { cups: number }>(
    `SELECT g.*, (SELECT COUNT(*) FROM cups c WHERE c.brewer_id = g.id OR c.grinder_id = g.id) AS cups
       FROM gear g ORDER BY g.is_default DESC, g.added_at, g.id`
  );
}

/** Gear of one category, defaults first, then oldest added: the Method picker's rows. */
export async function listGear(db: SQLiteDatabase, category: GearCategory): Promise<Gear[]> {
  return db.getAllAsync<Gear>('SELECT * FROM gear WHERE category = ? ORDER BY is_default DESC, added_at, id', [category]);
}

/** Gear on the shelf: what takes 3a's 8 slots. */
export async function countGear(db: SQLiteDatabase): Promise<number> {
  const row = await db.getFirstAsync<{ n: number }>('SELECT COUNT(*) AS n FROM gear');
  return row?.n ?? 0;
}

/**
 * Add gear (3a minimal). The first gear of a category becomes its default, so
 * 5a's Method fills at once. One transaction; refuses past `limit`. Returns
 * the defaults after the insert.
 */
export async function insertGear(
  db: SQLiteDatabase,
  items: { name: string; category: GearCategory }[],
  limit: number
): Promise<{ brewer: Gear | null; grinder: Gear | null }> {
  await db.withExclusiveTransactionAsync(async (tx) => {
    const row = await tx.getFirstAsync<{ n: number }>('SELECT COUNT(*) AS n FROM gear');
    if ((row?.n ?? 0) + items.length > limit) throw new Error(`Your shelf holds ${limit} pieces of gear.`);
    for (const item of items) {
      const taken = await tx.getFirstAsync('SELECT 1 FROM gear WHERE category = ? AND is_default = 1', [item.category]);
      await tx.runAsync('INSERT INTO gear (name, category, is_default, added_at) VALUES (?, ?, ?, ?)', [
        item.name,
        item.category,
        taken ? 0 : 1,
        Date.now(),
      ]);
    }
  });
  notifyShelfChanged();
  const [brewer, grinder] = await Promise.all([
    db.getFirstAsync<Gear>("SELECT * FROM gear WHERE category = 'brewer' AND is_default = 1"),
    db.getFirstAsync<Gear>("SELECT * FROM gear WHERE category = 'grinder' AND is_default = 1"),
  ]);
  return { brewer: brewer ?? null, grinder: grinder ?? null };
}

/**
 * Flavour words used before, most used first, then most recently used
 * (the search sheet's order, report 2026-10-10: words used once sink).
 * Grouped ignoring case; the latest spelling is shown.
 */
export async function listFlavourHistory(db: SQLiteDatabase): Promise<{ word: string; uses: number }[]> {
  return db.getAllAsync<{ word: string; uses: number }>(
    `SELECT (SELECT j2.value FROM cups c2, json_each(c2.flavours) j2
              WHERE lower(j2.value) = lower(j.value) ORDER BY c2.logged_at DESC LIMIT 1) AS word,
            COUNT(*) AS uses
       FROM cups c, json_each(c.flavours) j
      GROUP BY lower(j.value)
      ORDER BY uses DESC, MAX(c.logged_at) DESC`
  );
}

/** What Record coffee hands over on Save. Mode-specific fields are only read for their mode. */
export type NewCup = {
  rating: number;
  mode: CupMode;
  bagId: number | null;
  brewerId: number | null;
  brewMethod: string | null;
  grinderId: number | null;
  grinder: string | null;
  placeId: number | null;
  drinkType: string | null;
  productId: number | null;
  boughtAtPlaceId: number | null;
  /** The tasting note (5b). Absent = saved without it. */
  axes?: { acidity: number | null; body: number | null; roast: number | null; sweetness: number | null };
  flavours?: string[];
  note?: string | null;
};

/**
 * Insert a cup. A local SQLite insert: it completes in milliseconds and has
 * nothing to wait on. Only the active mode's columns are written; the others
 * stay NULL. created_at defaults to now and logged_at follows it (trigger).
 *
 * The bag's details are COPIED onto the cup here, at logging (data-model.md):
 * the cup keeps them even if the bag is later deleted. One statement, so the
 * copy is the bag as it is at this moment.
 *
 * Throws on a genuine failure (disk full, corrupt database) — callers surface it.
 */
export async function insertCup(db: SQLiteDatabase, cup: NewCup): Promise<number> {
  const madeIt = cup.mode === 'made_it';
  const barista = cup.mode === 'barista';
  const packaged = cup.mode === 'packaged';
  const bagId = madeIt ? cup.bagId : null;
  let id = 0;
  await db.withExclusiveTransactionAsync(async (tx) => {
    const result = await tx.runAsync(
      `INSERT INTO cups (rating, mode, note, flavours, axis_acidity, axis_body, axis_roast, axis_sweetness,
                         bag_id, bean_name, bean_roaster, bean_origin, bean_region, bean_process, bean_roast_level, bean_roasted_at,
                         brewer_id, brew_method, grinder_id, grinder,
                         place_id, drink_type, product_id, bought_at_place_id)
       SELECT ?, ?, ?, ?, ?, ?, ?, ?,
              b.id, b.name, b.roaster, b.origin, b.region, b.process, b.roast_level, b.roasted_at,
              ?, ?, ?, ?,
              ?, ?, ?, ?
         FROM (SELECT 1) LEFT JOIN bags b ON b.id = ?`,
      [
        cup.rating,
        cup.mode,
        cup.note ?? null,
        JSON.stringify(cup.flavours ?? []),
        cup.axes?.acidity ?? null,
        cup.axes?.body ?? null,
        cup.axes?.roast ?? null,
        cup.axes?.sweetness ?? null,
        madeIt ? cup.brewerId : null,
        madeIt ? cup.brewMethod : null,
        madeIt ? cup.grinderId : null,
        madeIt ? cup.grinder : null,
        barista ? cup.placeId : null,
        barista ? cup.drinkType : null,
        packaged ? cup.productId : null,
        packaged ? cup.boughtAtPlaceId : null,
        bagId,
      ]
    );
    id = result.lastInsertRowId;
    // Taste DNA before / after this cup, as of its own logged time, stored now
    // and never recomputed (taste-dna.md item 5). The same arithmetic as
    // migration 3's replay: the cups logged before it, then with it.
    const DNA_COLS = 'id, rating, logged_at, axis_acidity, axis_body, axis_roast, axis_sweetness, flavours';
    const self = await tx.getFirstAsync<Parameters<typeof dnaCupFromRow>[0]>(`SELECT ${DNA_COLS} FROM cups WHERE id = ?`, [id]);
    const settings = await tx.getFirstAsync<{ reset_at: number | null }>('SELECT reset_at FROM settings');
    const earlier = await tx.getAllAsync<Parameters<typeof dnaCupFromRow>[0]>(
      `SELECT ${DNA_COLS} FROM cups WHERE logged_at < ? OR (logged_at = ? AND id < ?) ORDER BY logged_at, id`,
      [self!.logged_at, self!.logged_at, id]
    );
    const change = changeOf(earlier.map(dnaCupFromRow), dnaCupFromRow(self!), settings?.reset_at ?? null);
    await tx.runAsync('UPDATE cups SET dna_change = ? WHERE id = ?', [JSON.stringify(change), id]);
  });
  notifyCupsChanged();
  return id;
}

/* ── Change signal ─────────────────────────────────────────────────────────
 * Screens that read cups subscribe; every write notifies. A screen left
 * mounted under the Record overlay (the Records tab) refreshes after a save.
 */
type Listener = () => void;
const cupListeners = new Set<Listener>();

export function onCupsChanged(listener: Listener): () => void {
  cupListeners.add(listener);
  return () => {
    cupListeners.delete(listener);
  };
}

function notifyCupsChanged() {
  cupListeners.forEach((listener) => listener());
}

/** The shelf (bags, gear) changed: Home's My beans / My gear and 3d refresh. */
const shelfListeners = new Set<Listener>();

export function onShelfChanged(listener: Listener): () => void {
  shelfListeners.add(listener);
  return () => {
    shelfListeners.delete(listener);
  };
}

function notifyShelfChanged() {
  shelfListeners.forEach((listener) => listener());
}

/** A cup with the names it points at, for the Records list (2a). The bean names are the cup's own copies. */
export type CupListItem = {
  id: number;
  logged_at: number;
  rating: number;
  mode: CupMode;
  note: string | null;
  drink_type: string | null;
  bean_name: string | null;
  bean_roaster: string | null;
  bean_process: Bag['process'];
  place_name: string | null;
  product_brand: string | null;
  product_name: string | null;
};

/** How many cups are logged (Records' header count, Try next's eyebrow). */
export async function countCups(db: SQLiteDatabase): Promise<number> {
  const row = await db.getFirstAsync<{ n: number }>('SELECT COUNT(*) AS n FROM cups');
  return row?.n ?? 0;
}

/** Which cup this is, counting from the first logged (5c's "Cup 4"). */
/** When each cup since `from` was logged: 1b's week count and strip. */
export async function cupTimesSince(db: SQLiteDatabase, from: number): Promise<number[]> {
  const rows = await db.getAllAsync<{ logged_at: number }>('SELECT logged_at FROM cups WHERE logged_at >= ?', [from]);
  return rows.map((r) => r.logged_at);
}

export async function cupOrdinal(db: SQLiteDatabase, id: number): Promise<number> {
  const row = await db.getFirstAsync<{ n: number }>(
    `SELECT COUNT(*) AS n FROM cups c, (SELECT logged_at, id FROM cups WHERE id = ?) t
      WHERE c.logged_at < t.logged_at OR (c.logged_at = t.logged_at AND c.id <= t.id)`,
    [id]
  );
  return row?.n ?? 0;
}

/** Every cup, newest first (by when it was drunk, then by insertion). */
export async function listCups(db: SQLiteDatabase): Promise<CupListItem[]> {
  return db.getAllAsync<CupListItem>(
    `SELECT c.id, c.logged_at, c.rating, c.mode, c.note, c.drink_type,
            c.bean_name, c.bean_roaster, c.bean_process,
            p.name AS place_name,
            pr.brand AS product_brand, pr.name AS product_name
       FROM cups c
       LEFT JOIN places p ON p.id = c.place_id
       LEFT JOIN products pr ON pr.id = c.product_id
      ORDER BY c.logged_at DESC, c.id DESC`
  );
}
