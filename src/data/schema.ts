/**
 * MoreCoffee data model — the single source for column shapes and row types.
 *
 * Every table's columns are declared once here; the TypeScript row types below
 * are derived from these declarations, so they cannot drift from them. The DDL
 * lives in migrations.ts (migrations are immutable history, so they cannot be
 * generated from the current shape); `npm run check:schema` applies every
 * migration to a scratch database and fails if the result differs from this
 * file. Reasoning for every decision: design/data-model.md.
 *
 * Conventions
 *   - ids are INTEGER PRIMARY KEY (SQLite rowid alias).
 *   - timestamps are INTEGER milliseconds since the Unix epoch, UTC.
 *   - `values` lists the allowed TEXT values; the migration enforces them with
 *     a CHECK constraint.
 */

type ColumnDef = {
  readonly type: 'INTEGER' | 'REAL' | 'TEXT';
  readonly nullable: boolean;
  readonly pk?: true;
  readonly values?: readonly string[];
  readonly references?: string;
  /** Filled from another column when inserted as NULL (an AFTER INSERT trigger). */
  readonly defaultFrom?: string;
  /** TEXT holding JSON; the row type describes the decoded value. */
  readonly json?: 'string[]';
};

export const schema = {
  cups: {
    id: { type: 'INTEGER', nullable: false, pk: true },
    created_at: { type: 'INTEGER', nullable: false },
    /** When the cup was drunk. Separate from created_at so a cup can be back-dated. */
    logged_at: { type: 'INTEGER', nullable: false, defaultFrom: 'created_at' },
    /** 1–5. The only required field besides ids and timestamps. */
    rating: { type: 'INTEGER', nullable: false },
    mode: { type: 'TEXT', nullable: true, values: ['made_it', 'barista', 'packaged'] },
    photo_uri: { type: 'TEXT', nullable: true },
    note: { type: 'TEXT', nullable: true },

    // mode = made_it
    bean_id: { type: 'INTEGER', nullable: true, references: 'beans' },
    brew_method: { type: 'TEXT', nullable: true },
    grinder: { type: 'TEXT', nullable: true },
    /**
     * V1.5 COLUMNS — NOT DEAD. grind_setting, water_temp_c and ratio have no UI
     * in V1. They exist so V1.5's parameter-tuning suggestions have history to
     * learn from. Do not remove them as unused. design/data-model.md.
     */
    grind_setting: { type: 'REAL', nullable: true },
    water_temp_c: { type: 'REAL', nullable: true },
    /** water : coffee, by weight (16 means 1:16). */
    ratio: { type: 'REAL', nullable: true },

    // mode = barista
    place_id: { type: 'INTEGER', nullable: true, references: 'places' },
    drink_type: { type: 'TEXT', nullable: true },

    // mode = packaged
    product_id: { type: 'INTEGER', nullable: true, references: 'products' },
    bought_at_place_id: { type: 'INTEGER', nullable: true, references: 'places' },

    /*
     * NO PRICE COLUMN — deliberate. A hand-entered price is always partial, and
     * partial price data cannot support spend reporting while still costing UI
     * space and user attention. Do not add one as an obvious-looking addition.
     * design/data-model.md.
     */
  },

  beans: {
    id: { type: 'INTEGER', nullable: false, pk: true },
    name: { type: 'TEXT', nullable: false },
    roaster: { type: 'TEXT', nullable: true },
    /** origin, region and process feed Try Next. Nullable, but the UI should encourage them. */
    origin: { type: 'TEXT', nullable: true },
    region: { type: 'TEXT', nullable: true },
    process: { type: 'TEXT', nullable: true, values: ['washed', 'natural', 'honey', 'other'] },
    roast_level: { type: 'TEXT', nullable: true },
    /**
     * Flavour tags, a JSON array of strings — deliberately not a join table:
     * per-user volume is in the hundreds, and Try Next can scan. data-model.md.
     */
    notes: { type: 'TEXT', nullable: false, json: 'string[]' },
    opened_at: { type: 'INTEGER', nullable: true },
  },

  places: {
    id: { type: 'INTEGER', nullable: false, pk: true },
    name: { type: 'TEXT', nullable: false },
    /** One table for both: a convenience store and a café differ only by kind. */
    kind: { type: 'TEXT', nullable: false, values: ['cafe', 'store'] },
    lat: { type: 'REAL', nullable: true },
    lng: { type: 'REAL', nullable: true },
    /** MapKit identifier — matches a place on a later visit instead of duplicating it. */
    external_id: { type: 'TEXT', nullable: true },
  },

  products: {
    id: { type: 'INTEGER', nullable: false, pk: true },
    brand: { type: 'TEXT', nullable: false },
    name: { type: 'TEXT', nullable: true },
    container: { type: 'TEXT', nullable: true, values: ['can', 'bottle', 'carton', 'pouch'] },
    volume_ml: { type: 'INTEGER', nullable: true },
  },
} as const satisfies Record<string, Record<string, ColumnDef>>;

export type TableName = keyof typeof schema;

type Decoded<C> = C extends { json: 'string[]' }
  ? string[]
  : C extends { values: readonly (infer V)[] }
    ? V
    : C extends { type: 'TEXT' }
      ? string
      : number;

type Value<C> = C extends { nullable: true } ? Decoded<C> | null : Decoded<C>;

/** A row as the app sees it (JSON columns decoded). */
export type Row<T extends TableName> = {
  -readonly [K in keyof (typeof schema)[T]]: Value<(typeof schema)[T][K]>;
};

export type Cup = Row<'cups'>;
export type Bean = Row<'beans'>;
export type Place = Row<'places'>;
export type Product = Row<'products'>;

export type CupMode = NonNullable<Cup['mode']>;
export type BeanProcess = NonNullable<Bean['process']>;
export type PlaceKind = Place['kind'];
export type ProductContainer = NonNullable<Product['container']>;
