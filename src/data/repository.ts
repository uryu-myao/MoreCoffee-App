import type { SQLiteDatabase } from 'expo-sqlite';
import type { Bag, CupMode, Gear, Place, Product } from './schema';

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
  const [bag, brewer, grinder, cafe, product, store] = await Promise.all([
    db.getFirstAsync<Bag & { notes: string }>('SELECT * FROM bags WHERE finished_at IS NULL ORDER BY opened_at DESC, id DESC LIMIT 1'),
    db.getFirstAsync<Gear>("SELECT * FROM gear WHERE category = 'brewer' AND is_default = 1"),
    db.getFirstAsync<Gear>("SELECT * FROM gear WHERE category = 'grinder' AND is_default = 1"),
    db.getFirstAsync<Place>("SELECT * FROM places WHERE kind = 'cafe' ORDER BY id DESC LIMIT 1"),
    db.getFirstAsync<Product>('SELECT * FROM products ORDER BY id DESC LIMIT 1'),
    db.getFirstAsync<Place>("SELECT * FROM places WHERE kind = 'store' ORDER BY id DESC LIMIT 1"),
  ]);
  return {
    bag: bag ? { ...bag, notes: JSON.parse(bag.notes as unknown as string) } : null,
    brewer: brewer ?? null,
    grinder: grinder ?? null,
    cafe: cafe ?? null,
    product: product ?? null,
    store: store ?? null,
  };
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
  const result = await db.runAsync(
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
  notifyCupsChanged();
  return result.lastInsertRowId;
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
