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
    /**
     * 1–5. Nullable since migration 2 so a draft (5d "Keep as draft") can exist
     * later; Taste DNA ignores unrated cups (8g). Save still requires it.
     */
    rating: { type: 'INTEGER', nullable: true },
    /**
     * Structural, so required: it decides which mode-specific columns mean
     * anything. The UI's internal "mine" becomes "made_it" when it is wired up.
     */
    mode: { type: 'TEXT', nullable: false, values: ['made_it', 'barista', 'packaged'] },
    photo_uri: { type: 'TEXT', nullable: true },
    /** My words (5b): stored as written, never rewritten (8h's merges live elsewhere). */
    note: { type: 'TEXT', nullable: true },
    /** Flavour tags (5b): the words themselves, in the order chosen, at most 5. Not ids. */
    flavours: { type: 'TEXT', nullable: false, json: 'string[]' },
    /** The four axes (5b), points 0–100 on 5 steps; NULL = not noted. Keys as constants/tasteAxes.js. */
    axis_acidity: { type: 'INTEGER', nullable: true },
    axis_body: { type: 'INTEGER', nullable: true },
    axis_roast: { type: 'INTEGER', nullable: true },
    axis_sweetness: { type: 'INTEGER', nullable: true },

    // mode = made_it
    /** The bag it was logged from. A reference only: display and Taste DNA read the copies below. */
    bag_id: { type: 'INTEGER', nullable: true, references: 'bags' },
    /**
     * The bag's details, COPIED at logging (data-model.md). A cup is a fact:
     * deleting the bag never strips them. Editing the bag rewrites them on Save,
     * explicitly (3g's footer) — never a live reference. Do not "simplify" this
     * back to reading through bag_id.
     */
    bean_name: { type: 'TEXT', nullable: true },
    bean_roaster: { type: 'TEXT', nullable: true },
    bean_origin: { type: 'TEXT', nullable: true },
    bean_region: { type: 'TEXT', nullable: true },
    bean_process: { type: 'TEXT', nullable: true, values: ['washed', 'natural', 'honey', 'anaerobic'] },
    bean_roast_level: { type: 'TEXT', nullable: true, values: ['light', 'medium', 'medium-dark', 'dark'] },
    /** The roast date itself, never a day count ("day 7 when brewed" is computed). */
    bean_roasted_at: { type: 'INTEGER', nullable: true },
    /** Gear: a reference plus the text as shown, the same shape as the bag. */
    brewer_id: { type: 'INTEGER', nullable: true, references: 'gear' },
    brew_method: { type: 'TEXT', nullable: true },
    grinder_id: { type: 'INTEGER', nullable: true, references: 'gear' },
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
    /**
     * Taste DNA before / after this cup, as of its logged time (tasteDna.ts
     * DnaChange), stored at save and never recomputed. 5c and 8f's shifts read
     * it. Cups from before migration 3 were replayed once.
     */
    dna_change: { type: 'TEXT', nullable: true },

    /*
     * NO PRICE COLUMN — deliberate. A hand-entered price is always partial, and
     * partial price data cannot support spend reporting while still costing UI
     * space and user attention. Do not add one as an obvious-looking addition.
     * design/data-model.md.
     */
  },

  /** One bag bought (§1 Words: bag = the unit acted on). Formerly `beans`. */
  bags: {
    id: { type: 'INTEGER', nullable: false, pk: true },
    name: { type: 'TEXT', nullable: false },
    roaster: { type: 'TEXT', nullable: true },
    /** origin, region and process feed Try Next. Nullable, but the UI should encourage them. */
    origin: { type: 'TEXT', nullable: true },
    region: { type: 'TEXT', nullable: true },
    /** NULL = unset or unknown (no "other": it compares to nothing). */
    process: { type: 'TEXT', nullable: true, values: ['washed', 'natural', 'honey', 'anaerobic'] },
    /**
     * Transcribed from the label: 4 steps, DELIBERATELY uneven against the 5-step
     * Roast axis (perceived). Do not add medium-light. NULL = unset. data-model.md.
     */
    roast_level: { type: 'TEXT', nullable: true, values: ['light', 'medium', 'medium-dark', 'dark'] },
    /**
     * The bag's printed flavours. Kept for one use: the first flavour suggestions
     * when a cup is logged from this bag (todo.md). Never copied to cups.
     */
    notes: { type: 'TEXT', nullable: false, json: 'string[]' },
    /** Freshness day and the resting state count from here (gaps.md 8). */
    roasted_at: { type: 'INTEGER', nullable: true },
    /** Staleness counts from here (8i, "around day 21 after opening"). */
    opened_at: { type: 'INTEGER', nullable: true },
    /** NULL = open (takes one of the 5 slots); set = finished, in 3f. Reopen clears it. */
    finished_at: { type: 'INTEGER', nullable: true },
    size_g: { type: 'INTEGER', nullable: true },
    photo_uri: { type: 'TEXT', nullable: true },
  },

  /** Registered gear (3a 3b 3e, 8c). One default per category (a partial unique index). */
  gear: {
    id: { type: 'INTEGER', nullable: false, pk: true },
    name: { type: 'TEXT', nullable: false },
    category: { type: 'TEXT', nullable: false, values: ['brewer', 'grinder', 'kettle', 'scale'] },
    maker: { type: 'TEXT', nullable: true },
    /** 3e "My settings note": free text, the user's own. */
    settings_note: { type: 'TEXT', nullable: true },
    /** 0 / 1. 5a pre-fills the default brewer and grinder. */
    is_default: { type: 'INTEGER', nullable: false },
    photo_uri: { type: 'TEXT', nullable: true },
    added_at: { type: 'INTEGER', nullable: false },
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

  /**
   * The two V1 settings, one row (id = 1), both from first setup and NULL when
   * skipped (data-model.md):
   *   drinks_out    8c "I mostly drink out" (0 / 1): read once, for the first
   *                 cup's mode; later cups take the last cup's mode
   *   coffee_style  8n "How do you take your coffee?": read on every cup, to
   *                 order the flavour suggestions (not the axes). No settings
   *                 screen in V1 (gaps.md 22)
   */
  settings: {
    id: { type: 'INTEGER', nullable: false, pk: true },
    drinks_out: { type: 'INTEGER', nullable: true },
    coffee_style: { type: 'TEXT', nullable: true, values: ['black', 'with_milk', 'depends'] },
    /** Reset my taste DNA (V1.5): only cups logged from this time count. */
    reset_at: { type: 'INTEGER', nullable: true },
    /** 0 / 1: the first setup (8a / 8n / 8c / 8o) was finished or skipped. */
    setup_done: { type: 'INTEGER', nullable: false },
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
export type Bag = Row<'bags'>;
export type Gear = Row<'gear'>;
export type Settings = Row<'settings'>;
export type Place = Row<'places'>;
export type Product = Row<'products'>;

export type CupMode = NonNullable<Cup['mode']>;
export type BagProcess = NonNullable<Bag['process']>;
export type GearCategory = Gear['category'];
export type PlaceKind = Place['kind'];
export type ProductContainer = NonNullable<Product['container']>;
