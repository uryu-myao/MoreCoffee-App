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
  return result.lastInsertRowId;
}
