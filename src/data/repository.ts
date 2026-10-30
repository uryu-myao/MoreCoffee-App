import type { SQLiteDatabase } from 'expo-sqlite';
import type { Bag, CupMode, Gear, GearCategory, Place, Row } from './schema';
import { changeOf, computeDna, dnaCupFromRow, lastShift, type Dna, type DnaShift } from './tasteDna';

/**
 * The reference rows Record coffee pre-fills its field sets with. Until the
 * pickers land (Step 5 TODOs): the most recently opened bag that is still open,
 * the default brewer and grinder, and the most recent café / store.
 * Any of them can be null on a database with no rows yet.
 */
export type RecordDefaults = {
  bag: Bag | null;
  brewer: Gear | null;
  grinder: Gear | null;
  cafe: Place | null;
  store: Place | null;
};

export async function loadRecordDefaults(db: SQLiteDatabase): Promise<RecordDefaults> {
  // Café, product and store are NOT pre-filled (2026-10-11): no V1 screen lets
  // the user choose or create one, so "the newest row" could only ever be the
  // dev seed's, and a cup would record a café / product nobody picked. A
  // record must be a fact. Packaged's product name (design-missing.md 6)
  // and Barista's café (2026-10-30) have their own sheets and start empty:
  // a café is never guessed from where the phone is.
  const [bag, brewer, grinder] = await Promise.all([
    db.getFirstAsync<Bag & { notes: string }>('SELECT * FROM bags WHERE finished_at IS NULL AND opened_at IS NOT NULL ORDER BY opened_at DESC, id DESC LIMIT 1'),
    db.getFirstAsync<Gear>("SELECT * FROM gear WHERE category = 'brewer' AND is_default = 1"),
    db.getFirstAsync<Gear>("SELECT * FROM gear WHERE category = 'grinder' AND is_default = 1"),
  ]);
  const cafe: Place | null = null;
  const store: Place | null = null;
  return {
    bag: bag ? { ...bag, notes: JSON.parse(bag.notes as unknown as string) } : null,
    brewer: brewer ?? null,
    grinder: grinder ?? null,
    cafe: cafe ?? null,
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

/** How many flavour tags "Flavours I pick most" lists (Design Round 11, B). */
export const TOP_FLAVOURS = 4;

/**
 * The flavour tags picked most, from the cups' lists (newest cup first):
 * [{ name, count }], at most `n`. Ties go to the tag picked most recently.
 */
export function topFlavours(lists: string[][], n = TOP_FLAVOURS): { name: string; count: number }[] {
  const seen = new Map<string, { name: string; count: number; at: number }>();
  lists.forEach((list, at) => {
    for (const name of list) {
      const entry = seen.get(name);
      if (entry) entry.count += 1;
      else seen.set(name, { name, count: 1, at });
    }
  });
  return [...seen.values()]
    .sort((a, b) => b.count - a.count || a.at - b.at)
    .slice(0, n)
    .map(({ name, count }) => ({ name, count }));
}

/**
 * 8f (My taste DNA): the profile, the last shift from the stored changes,
 * and the flavour tags picked most, all from the cups counted since the
 * reset (computeDna's rule: a cup logged before reset_at is left out).
 */
export async function loadDnaPage(
  db: SQLiteDatabase
): Promise<{ dna: Dna; shift: DnaShift | null; flavours: { name: string; count: number }[] }> {
  const settings = await db.getFirstAsync<{ reset_at: number | null }>('SELECT reset_at FROM settings');
  const resetAt = settings?.reset_at ?? null;
  const [dna, rows, picks] = await Promise.all([
    loadTasteDna(db),
    db.getAllAsync<{ logged_at: number; dna_change: string }>(
      'SELECT logged_at, dna_change FROM cups WHERE dna_change IS NOT NULL AND (? IS NULL OR logged_at >= ?) ORDER BY logged_at DESC, id DESC',
      [resetAt, resetAt]
    ),
    db.getAllAsync<{ flavours: string }>(
      "SELECT flavours FROM cups WHERE flavours != '[]' AND (? IS NULL OR logged_at >= ?) ORDER BY logged_at DESC, id DESC",
      [resetAt, resetAt]
    ),
  ]);
  return { dna, shift: lastShift(rows), flavours: topFlavours(picks.map((r) => JSON.parse(r.flavours) as string[])) };
}

/**
 * 6a's personal card: every bag ever added (finished ones too, beside the
 * all-time cup count) and every cup's time (the first gives "Logging
 * since", all of them the week streak).
 */
export async function loadProfile(db: SQLiteDatabase): Promise<{ bags: number; cupTimes: number[] }> {
  const [bags, cups] = await Promise.all([
    db.getFirstAsync<{ n: number }>('SELECT COUNT(*) AS n FROM bags'),
    db.getAllAsync<{ logged_at: number }>('SELECT logged_at FROM cups ORDER BY logged_at'),
  ]);
  return { bags: bags?.n ?? 0, cupTimes: cups.map((c) => c.logged_at) };
}

/** One cup as 2c shows it: every stored field, with its place names. */
export type CupRecord = Row<'cups'> & {
  place_name: string | null;
  bought_at_name: string | null;
};

export async function getCup(db: SQLiteDatabase, id: number): Promise<CupRecord | null> {
  const row = await db.getFirstAsync<CupRecord & { flavours: string }>(
    `SELECT c.*, p.name AS place_name, bp.name AS bought_at_name
       FROM cups c
       LEFT JOIN places p ON p.id = c.place_id
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

/**
 * Every bag, finished ones too (search's BEANS, Design Round 15, 18d): the
 * shelf's order (listShelfBags), then finished bags, the latest finished
 * first.
 */
export async function listAllBags(db: SQLiteDatabase): Promise<Bag[]> {
  const rows = await db.getAllAsync<Bag & { notes: string }>(
    `SELECT * FROM bags
      ORDER BY finished_at IS NOT NULL, finished_at DESC, opened_at IS NULL, opened_at DESC, id DESC`
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

/** A finished bag with what was logged from it (3f's row). */
export type FinishedBag = Bag & { cups: number; avg_rating: number | null };

/** Finished bags, latest finished first (3f; Design Round 6: a fixed order, no sort). */
export async function listFinishedBags(db: SQLiteDatabase): Promise<FinishedBag[]> {
  const rows = await db.getAllAsync<FinishedBag & { notes: string }>(
    `SELECT b.*, COUNT(c.id) AS cups, AVG(c.rating) AS avg_rating
       FROM bags b LEFT JOIN cups c ON c.bag_id = b.id
      WHERE b.finished_at IS NOT NULL
      GROUP BY b.id
      ORDER BY b.finished_at DESC, b.id DESC`
  );
  return rows.map((row) => ({ ...row, notes: JSON.parse(row.notes as unknown as string) }));
}

/** How many bags are finished (3d's "Finished bags" entry). */
export async function countFinishedBags(db: SQLiteDatabase): Promise<number> {
  const row = await db.getFirstAsync<{ n: number }>('SELECT COUNT(*) AS n FROM bags WHERE finished_at IS NOT NULL');
  return row?.n ?? 0;
}

/**
 * Reopen a finished bag (3f "Reopen bag"): back on the shelf with its
 * opened date, so its Day N carries on. It takes a slot: refused at the
 * limit (3f disables the button there and says why).
 */
export async function reopenBag(db: SQLiteDatabase, id: number): Promise<void> {
  if ((await countOpenBags(db)) >= OPEN_BAG_LIMIT) throw new Error(`All ${OPEN_BAG_LIMIT} slots are taken. Finish a bag to free one.`);
  await db.runAsync('UPDATE bags SET finished_at = NULL WHERE id = ? AND finished_at IS NOT NULL', [id]);
  notifyShelfChanged();
}

/** What 3g (minimal) edits. */
export type BagEdit = { name: string; roaster: string | null; roastedAt: number | null; openedAt: number | null };

/**
 * Save 3g. The cups logged from the bag carry copies of its details
 * (data-model.md, the copy rule); an edit rewrites those copies in the same
 * transaction (decided 2026-10-09, option B: "Edits apply to the N cups
 * already logged from this bag"). Refuses a roast or open date after the
 * first cup from the bag or in the future, and an open date before the
 * roast (the date sheets stop there too).
 */
export async function updateBag(db: SQLiteDatabase, id: number, edit: BagEdit): Promise<void> {
  const endOfToday = new Date(new Date().setHours(23, 59, 59, 999)).getTime();
  await db.withExclusiveTransactionAsync(async (tx) => {
    const first = await tx.getFirstAsync<{ first: number | null }>('SELECT MIN(logged_at) AS first FROM cups WHERE bag_id = ?', [id]);
    const latest = first?.first ?? endOfToday;
    for (const at of [edit.roastedAt, edit.openedAt]) {
      if (at != null && at > latest) throw new Error("A date can't be after the first cup from this bag, or in the future.");
    }
    if (edit.roastedAt != null && edit.openedAt != null && edit.openedAt < edit.roastedAt) throw new Error("A bag can't be opened before it was roasted.");
    await tx.runAsync('UPDATE bags SET name = ?, roaster = ?, roasted_at = ?, opened_at = ? WHERE id = ?', [
      edit.name,
      edit.roaster,
      edit.roastedAt,
      edit.openedAt,
      id,
    ]);
    await tx.runAsync('UPDATE cups SET bean_name = ?, bean_roaster = ?, bean_roasted_at = ? WHERE bag_id = ?', [
      edit.name,
      edit.roaster,
      edit.roastedAt,
      id,
    ]);
  });
  notifyShelfChanged();
  notifyCupsChanged();
}

/**
 * Delete a bag (3g, Design Round 6): for a bag added by mistake. Its cups
 * keep their copies of its details (the copy rule); only their link goes
 * (bag_id → NULL by the foreign key), so Taste DNA is unchanged.
 */
export async function deleteBag(db: SQLiteDatabase, id: number): Promise<void> {
  await db.runAsync('DELETE FROM bags WHERE id = ?', [id]);
  notifyShelfChanged();
  notifyCupsChanged();
}

/**
 * The packaged coffees logged before, most used first, then most recent:
 * the product-name sheet's completions (as the flavour sheet's history).
 * Grouped ignoring case; the latest spelling is shown.
 */
export async function listProductHistory(db: SQLiteDatabase): Promise<{ name: string; uses: number }[]> {
  return db.getAllAsync<{ name: string; uses: number }>(
    `SELECT (SELECT c2.product_name FROM cups c2 WHERE lower(c2.product_name) = lower(c.product_name) ORDER BY c2.logged_at DESC LIMIT 1) AS name,
            COUNT(*) AS uses
       FROM cups c
      WHERE c.product_name IS NOT NULL
      GROUP BY lower(c.product_name)
      ORDER BY uses DESC, MAX(c.logged_at) DESC`
  );
}

/**
 * A Barista cup's café as the café sheet hands it over, before Save: one
 * already stored (id), or one from the map or typed by hand (id null; stored
 * by placeIdFor on Save, so a pick that is never saved leaves no row).
 */
export type CafeChoice = {
  id: number | null;
  name: string;
  /** MapKit's identifier; null when typed by hand (or before iOS 18). */
  externalId: string | null;
  lat: number | null;
  lng: number | null;
};

/**
 * The places row for a café: its own id when stored; else the row with the
 * same MapKit id, whatever its kind (one row per MapKit place: external_id is
 * unique, so a store already in the table is used as it is); else, for a
 * name with no MapKit id, the row typed by hand with that name (ignoring
 * case), so a café typed twice has one history. Otherwise a new row.
 *
 * A row is never renamed here: cups read the café's name through place_id,
 * so renaming a row would rename it on every past cup (design/data-model.md).
 */
async function placeIdFor(tx: SQLiteDatabase, cafe: CafeChoice | null): Promise<number | null> {
  if (!cafe) return null;
  if (cafe.id != null) return cafe.id;
  const found = cafe.externalId
    ? await tx.getFirstAsync<{ id: number }>('SELECT id FROM places WHERE external_id = ?', [cafe.externalId])
    : await tx.getFirstAsync<{ id: number }>('SELECT id FROM places WHERE external_id IS NULL AND lower(name) = lower(?) ORDER BY id LIMIT 1', [cafe.name]);
  if (found) return found.id;
  const result = await tx.runAsync("INSERT INTO places (name, kind, lat, lng, external_id) VALUES (?, 'cafe', ?, ?, ?)", [
    cafe.name,
    cafe.lat,
    cafe.lng,
    cafe.externalId,
  ]);
  return result.lastInsertRowId;
}

/** A café with Barista cups logged at it (the café sheet's first rows). */
export type LoggedCafe = Place & { visits: number; last_visit: number };

/** Every café a cup was logged at, the latest visit first, with how many cups. */
export async function listLoggedCafes(db: SQLiteDatabase): Promise<LoggedCafe[]> {
  return db.getAllAsync<LoggedCafe>(
    `SELECT p.*, COUNT(c.id) AS visits, MAX(c.logged_at) AS last_visit
       FROM places p JOIN cups c ON c.place_id = p.id
      GROUP BY p.id
      ORDER BY last_visit DESC, p.id DESC`
  );
}

/**
 * The drinks logged before, for the drink sheet (Uryu, 2026-10-30: at the
 * same café the same drink is ordered most often):
 *   here  this café's drinks, the last one ordered first
 *   all   every drink, most used first, then most recent
 * Grouped ignoring case; the latest spelling is shown.
 */
export async function listDrinkHistory(db: SQLiteDatabase, placeId: number | null): Promise<{ here: string[]; all: string[] }> {
  const [here, all] = await Promise.all([
    placeId == null
      ? []
      : db.getAllAsync<{ name: string }>(
          `SELECT (SELECT c2.drink_type FROM cups c2 WHERE c2.place_id = c.place_id AND lower(c2.drink_type) = lower(c.drink_type)
                    ORDER BY c2.logged_at DESC, c2.id DESC LIMIT 1) AS name
             FROM cups c
            WHERE c.place_id = ? AND c.drink_type IS NOT NULL
            GROUP BY lower(c.drink_type)
            ORDER BY MAX(c.logged_at) DESC, MAX(c.id) DESC`,
          [placeId]
        ),
    db.getAllAsync<{ name: string }>(
      `SELECT (SELECT c2.drink_type FROM cups c2 WHERE lower(c2.drink_type) = lower(c.drink_type) ORDER BY c2.logged_at DESC, c2.id DESC LIMIT 1) AS name
         FROM cups c
        WHERE c.drink_type IS NOT NULL
        GROUP BY lower(c.drink_type)
        ORDER BY COUNT(*) DESC, MAX(c.logged_at) DESC`
    ),
  ]);
  return { here: here.map((r) => r.name), all: all.map((r) => r.name) };
}

/** The last drink logged at a café: 5a pre-fills it once the café is picked ("What you ordered here last time"). */
export async function lastDrinkAt(db: SQLiteDatabase, placeId: number): Promise<string | null> {
  const row = await db.getFirstAsync<{ drink_type: string }>(
    'SELECT drink_type FROM cups WHERE place_id = ? AND drink_type IS NOT NULL ORDER BY logged_at DESC, id DESC LIMIT 1',
    [placeId]
  );
  return row?.drink_type ?? null;
}

export type GearWithUse = Gear & { cups: number; last_used_at: number | null };

/**
 * Every piece of gear with the cups logged with it and the latest one's
 * logged_at (Home's status column, Round 14 §4: "2 cups · Last · today");
 * defaults first, then oldest added (3b's order).
 */
export async function listGearWithUse(db: SQLiteDatabase): Promise<GearWithUse[]> {
  return db.getAllAsync<GearWithUse>(
    `SELECT g.*, COUNT(c.id) AS cups, MAX(c.logged_at) AS last_used_at
       FROM gear g LEFT JOIN cups c ON c.brewer_id = g.id OR c.grinder_id = g.id
      GROUP BY g.id
      ORDER BY g.is_default DESC, g.added_at, g.id`
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

/** What 3e (minimal) edits. Category is not editable: cups hold gear as brewer or grinder. */
export type GearEdit = { name: string; maker: string | null; isDefault: boolean };

/**
 * Save 3e. As updateBag: the cups logged with the gear carry its name as a
 * copy (brew_method / grinder), rewritten in the same transaction ("Edits
 * apply to the N cups already logged with it"). Turning the default on
 * takes it from the category's other gear (one default per category, a
 * partial unique index); turning it off leaves the category with none, so
 * 5a's Method starts empty (Uryu, 2026-10-22).
 */
export async function updateGear(db: SQLiteDatabase, id: number, edit: GearEdit): Promise<void> {
  await db.withExclusiveTransactionAsync(async (tx) => {
    const gear = await tx.getFirstAsync<Gear>('SELECT * FROM gear WHERE id = ?', [id]);
    if (!gear) throw new Error('This gear is no longer on your shelf.');
    if (edit.isDefault) await tx.runAsync('UPDATE gear SET is_default = 0 WHERE category = ? AND id != ?', [gear.category, id]);
    await tx.runAsync('UPDATE gear SET name = ?, maker = ?, is_default = ? WHERE id = ?', [edit.name, edit.maker, edit.isDefault ? 1 : 0, id]);
    await tx.runAsync('UPDATE cups SET brew_method = ? WHERE brewer_id = ?', [edit.name, id]);
    await tx.runAsync('UPDATE cups SET grinder = ? WHERE grinder_id = ?', [edit.name, id]);
  });
  notifyShelfChanged();
  notifyCupsChanged();
}

/**
 * Remove gear (3e). Its cups keep their copy of its name; only their link
 * goes (brewer_id / grinder_id → NULL by the foreign key). A removed default
 * is not passed on to other gear: that would change the next cup without
 * the user choosing it (Uryu, 2026-10-22).
 */
export async function removeGear(db: SQLiteDatabase, id: number): Promise<void> {
  await db.runAsync('DELETE FROM gear WHERE id = ?', [id]);
  notifyShelfChanged();
  notifyCupsChanged();
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
  /** Barista: the café as chosen (stored on Save, placeIdFor). */
  cafe: CafeChoice | null;
  drinkType: string | null;
  /** Packaged: the name as typed, brand included. */
  productName: string | null;
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
 * A Barista cup's café is stored or matched here, in the same transaction.
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
    const placeId = barista ? await placeIdFor(tx, cup.cafe) : null;
    const result = await tx.runAsync(
      `INSERT INTO cups (rating, mode, note, flavours, axis_acidity, axis_body, axis_roast, axis_sweetness,
                         bag_id, bean_name, bean_roaster, bean_origin, bean_region, bean_process, bean_roast_level, bean_roasted_at,
                         brewer_id, brew_method, grinder_id, grinder,
                         place_id, drink_type, product_name, bought_at_place_id)
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
        placeId,
        barista ? cup.drinkType : null,
        packaged ? cup.productName : null,
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

/** One bag by id, finished or not (11a: the cup's own bag, which may have left the shelf). */
export async function getBag(db: SQLiteDatabase, id: number): Promise<Bag | null> {
  const row = await db.getFirstAsync<Bag & { notes: string }>('SELECT * FROM bags WHERE id = ?', [id]);
  return row ? { ...row, notes: JSON.parse(row.notes as unknown as string) } : null;
}

/**
 * What 11a can change on a cup: the bag, the gear, when, My words; a
 * Packaged cup's product, a Barista cup's café and drink. The
 * rating, axes and flavours are not editable (Taste DNA counted them at save).
 */
export type CupEdit = {
  bagId: number | null;
  brewerId: number | null;
  brewMethod: string | null;
  grinderId: number | null;
  grinder: string | null;
  loggedAt: number;
  note: string | null;
  /** Packaged: the product name as typed. */
  productName: string | null;
  /** Barista: a café chosen in 11a; undefined keeps the cup's own. */
  cafe?: CafeChoice | null;
  drinkType: string | null;
};

/**
 * Save 11a's changes. A new bag is copied onto the cup as at logging
 * (data-model.md); an unchanged bag keeps the cup's own copy. Refuses a time
 * in the future or before the bag's roast day (the date sheet stops there
 * too: the date wins over the bag, 11c).
 *
 * dna_change is NOT recomputed (taste-dna.md item 5: stored at save, never
 * recomputed); the profile itself is computed on read, so it follows the new
 * time at once.
 */
export async function updateCup(db: SQLiteDatabase, id: number, edit: CupEdit): Promise<void> {
  if (edit.loggedAt > Date.now()) throw new Error('A cup cannot be logged in the future.');
  await db.withExclusiveTransactionAsync(async (tx) => {
    const cup = await tx.getFirstAsync<{ bag_id: number | null; place_id: number | null }>('SELECT bag_id, place_id FROM cups WHERE id = ?', [id]);
    if (!cup) throw new Error('This cup is no longer stored.');
    if (edit.bagId != null) {
      const bag = await tx.getFirstAsync<{ roasted_at: number | null }>('SELECT roasted_at FROM bags WHERE id = ?', [edit.bagId]);
      if (bag?.roasted_at != null && edit.loggedAt < bag.roasted_at) throw new Error("A cup can't be logged before its bag was roasted.");
    }
    if (edit.bagId !== cup.bag_id) {
      await tx.runAsync(
        `UPDATE cups SET (bag_id, bean_name, bean_roaster, bean_origin, bean_region, bean_process, bean_roast_level, bean_roasted_at) =
           (SELECT b.id, b.name, b.roaster, b.origin, b.region, b.process, b.roast_level, b.roasted_at
              FROM (SELECT 1) LEFT JOIN bags b ON b.id = ?)
         WHERE id = ?`,
        [edit.bagId, id]
      );
    }
    const placeId = edit.cafe === undefined ? cup.place_id : await placeIdFor(tx, edit.cafe);
    await tx.runAsync(
      'UPDATE cups SET brewer_id = ?, brew_method = ?, grinder_id = ?, grinder = ?, logged_at = ?, note = ?, product_name = ?, place_id = ?, drink_type = ? WHERE id = ?',
      [edit.brewerId, edit.brewMethod, edit.grinderId, edit.grinder, edit.loggedAt, edit.note, edit.productName, placeId, edit.drinkType, id]
    );
  });
  notifyCupsChanged();
}

/**
 * Whether deleting this cup takes the profile out of Locked in (11b's third
 * line, "Your profile goes back to Early signs."): lock-in is sticky, but is
 * recomputed from the cups that remain, so a delete can mean it was never met.
 */
export async function deleteDropsLockIn(db: SQLiteDatabase, id: number): Promise<boolean> {
  const settings = await db.getFirstAsync<{ reset_at: number | null }>('SELECT reset_at FROM settings');
  const rows = await db.getAllAsync<Parameters<typeof dnaCupFromRow>[0] & { id: number }>(
    'SELECT id, rating, logged_at, axis_acidity, axis_body, axis_roast, axis_sweetness, flavours FROM cups ORDER BY logged_at, id'
  );
  const resetAt = settings?.reset_at ?? null;
  const now = computeDna(rows.map(dnaCupFromRow), Date.now(), resetAt);
  if (now.state !== 'locked') return false;
  const without = computeDna(rows.filter((r) => r.id !== id).map(dnaCupFromRow), Date.now(), resetAt);
  return without.state !== 'locked';
}

/** Delete a cup (11b). Taste DNA is computed on read, so it follows at once. */
export async function deleteCup(db: SQLiteDatabase, id: number): Promise<void> {
  await db.runAsync('DELETE FROM cups WHERE id = ?', [id]);
  notifyCupsChanged();
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
  /** Flavour tags, parsed: search's WORDS reads them with the note. */
  flavours: string[];
  /** The links, for the bag and gear pages' cup lists (Design Round 15, 19a / 19c). */
  bag_id: number | null;
  brewer_id: number | null;
  grinder_id: number | null;
  drink_type: string | null;
  bean_name: string | null;
  bean_roaster: string | null;
  bean_process: Bag['process'];
  brew_method: string | null;
  grinder: string | null;
  place_name: string | null;
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
  const rows = await db.getAllAsync<CupListItem>(
    `SELECT c.id, c.logged_at, c.rating, c.mode, c.note, c.flavours, c.drink_type,
            c.bean_name, c.bean_roaster, c.bean_process, c.brew_method, c.grinder,
            c.bag_id, c.brewer_id, c.grinder_id,
            c.product_name, p.name AS place_name
       FROM cups c
       LEFT JOIN places p ON p.id = c.place_id
      ORDER BY c.logged_at DESC, c.id DESC`
  );
  return rows.map((row) => ({ ...row, flavours: JSON.parse(row.flavours as unknown as string) }));
}

/**
 * Search's "Recent searches" (Design Round 15, 18a): the last terms typed,
 * newest first. Kept to SEARCH_HISTORY rows; a term searched again (any
 * case) moves to the top with the spelling just typed.
 */
export const SEARCH_HISTORY = 5;

export async function listSearchTerms(db: SQLiteDatabase): Promise<string[]> {
  const rows = await db.getAllAsync<{ term: string }>('SELECT term FROM search_history ORDER BY searched_at DESC, id DESC LIMIT ?', [SEARCH_HISTORY]);
  return rows.map((r) => r.term);
}

export async function addSearchTerm(db: SQLiteDatabase, term: string): Promise<void> {
  const t = term.trim();
  if (!t) return;
  await db.withExclusiveTransactionAsync(async (tx) => {
    await tx.runAsync('DELETE FROM search_history WHERE lower(term) = lower(?)', [t]);
    await tx.runAsync('INSERT INTO search_history (term, searched_at) VALUES (?, ?)', [t, Date.now()]);
    await tx.runAsync(
      'DELETE FROM search_history WHERE id NOT IN (SELECT id FROM search_history ORDER BY searched_at DESC, id DESC LIMIT ?)',
      [SEARCH_HISTORY]
    );
  });
}

/** "Clear": at once, no confirm (18a: a typed term is cheap to lose). */
export async function clearSearchTerms(db: SQLiteDatabase): Promise<void> {
  await db.runAsync('DELETE FROM search_history');
}
