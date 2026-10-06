import type { SQLiteDatabase } from 'expo-sqlite';
import type { Bean, CupMode, Place, Product } from './schema';

/**
 * The reference rows Record coffee pre-fills its field sets with. Until the
 * pickers land (Step 5 TODOs), each set takes the most recent row of its kind;
 * any of them can be null on a database with no rows yet.
 */
export type RecordDefaults = {
  bean: Bean | null;
  cafe: Place | null;
  product: Product | null;
  store: Place | null;
};

export async function loadRecordDefaults(db: SQLiteDatabase): Promise<RecordDefaults> {
  const [bean, cafe, product, store] = await Promise.all([
    db.getFirstAsync<Bean & { notes: string }>('SELECT * FROM beans ORDER BY opened_at DESC, id DESC LIMIT 1'),
    db.getFirstAsync<Place>("SELECT * FROM places WHERE kind = 'cafe' ORDER BY id DESC LIMIT 1"),
    db.getFirstAsync<Product>('SELECT * FROM products ORDER BY id DESC LIMIT 1'),
    db.getFirstAsync<Place>("SELECT * FROM places WHERE kind = 'store' ORDER BY id DESC LIMIT 1"),
  ]);
  return {
    bean: bean ? { ...bean, notes: JSON.parse(bean.notes as unknown as string) } : null,
    cafe: cafe ?? null,
    product: product ?? null,
    store: store ?? null,
  };
}

/** What Record coffee hands over on Save. Mode-specific fields are only read for their mode. */
export type NewCup = {
  rating: number;
  mode: CupMode;
  beanId: number | null;
  brewMethod: string | null;
  grinder: string | null;
  placeId: number | null;
  drinkType: string | null;
  productId: number | null;
  boughtAtPlaceId: number | null;
};

/**
 * Insert a cup. A local SQLite insert: it completes in milliseconds and has
 * nothing to wait on. Only the active mode's columns are written; the others
 * stay NULL. created_at defaults to now and logged_at follows it (trigger).
 * Throws on a genuine failure (disk full, corrupt database) — callers surface it.
 */
export async function insertCup(db: SQLiteDatabase, cup: NewCup): Promise<number> {
  const madeIt = cup.mode === 'made_it';
  const barista = cup.mode === 'barista';
  const packaged = cup.mode === 'packaged';
  const result = await db.runAsync(
    `INSERT INTO cups (rating, mode, bean_id, brew_method, grinder, place_id, drink_type, product_id, bought_at_place_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      cup.rating,
      cup.mode,
      madeIt ? cup.beanId : null,
      madeIt ? cup.brewMethod : null,
      madeIt ? cup.grinder : null,
      barista ? cup.placeId : null,
      barista ? cup.drinkType : null,
      packaged ? cup.productId : null,
      packaged ? cup.boughtAtPlaceId : null,
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

/** A cup with the names it points at, for the Records list (2a). */
export type CupListItem = {
  id: number;
  logged_at: number;
  rating: number;
  mode: CupMode;
  note: string | null;
  drink_type: string | null;
  bean_name: string | null;
  bean_roaster: string | null;
  bean_process: Bean['process'];
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
            b.name AS bean_name, b.roaster AS bean_roaster, b.process AS bean_process,
            p.name AS place_name,
            pr.brand AS product_brand, pr.name AS product_name
       FROM cups c
       LEFT JOIN beans b ON b.id = c.bean_id
       LEFT JOIN places p ON p.id = c.place_id
       LEFT JOIN products pr ON pr.id = c.product_id
      ORDER BY c.logged_at DESC, c.id DESC`
  );
}
