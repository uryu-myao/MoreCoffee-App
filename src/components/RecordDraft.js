import * as Haptics from 'expo-haptics';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { FLAVOUR_LIMIT } from '../constants/flavours';
import { useDatabase } from '../data/DatabaseProvider';
import { insertCup, loadRecordDefaults } from '../data/repository';

/**
 * The one cup being recorded, shared by both steps of the Record sheet: 5a
 * (Log a cup) and 5b (Tasting note). It lives in AddCoffeeOverlay, so it lasts
 * while the sheet is open and is discarded when it closes — no drafts in V1.
 *
 * Going back from 5b to 5a keeps everything: the two steps are one record.
 * Saving is ONE insert, at whichever Save is pressed (design-system.md §1
 * "Saving a cup"):
 *   5a Save this cup            everything entered so far (incl. 5b's input)
 *   5b Save this cup            everything
 *   5b Save without the note    5a's part only — the one, explicit way to
 *                               drop the axes, flavour tags and My words
 * Required fields, per mode (`required`, Design Round 9, 2026-10-18 — 5a's
 * Required bar shows them):
 *   made_it    the rating; the bag and the method too when the shelf fills
 *              them (a required mark promises "always filled", §1 Required
 *              marks, so with an empty shelf they are not required)
 *   barista    the rating (café and drink can't be entered at this stage)
 *   packaged   the rating and the product name (required since Round 9)
 * They are required on both steps. Save stays pressable (5d, decided
 * 2026-10-11): with any missing, save() saves nothing, sets `missing` and
 * returns 'missing'; 5a then shows 5d's state, and 5b goes back to 5a.
 * Filling the last one ends it. A failed save is shown plainly and the sheet stays open
 * with everything still entered (nothing is lost).
 *
 * My words is typed often, so its text lives in a ref (noteRef): the field
 * keeps its own state and typing never re-renders either step. Only the
 * empty ↔ non-empty transition is lifted (noteFilled), for hasTastingInput.
 *
 * hasTastingInput: any axis entered, any flavour, or any words. 5b's second
 * button reads "Discard and save" then, "Save without the note" otherwise
 * (decided 2026-10-10, design-system.md §1 Saving a cup).
 */
const RecordDraftContext = createContext(null);

const EMPTY_DEFAULTS = { bag: null, brewer: null, grinder: null, cafe: null, store: null };
const EMPTY_AXES = { acidity: null, body: null, roast: null, sweetness: null };

/** [{ key, label, filled }] — what this cup needs before it can be saved (see above). */
function requiredFields(mode, defaults, rating, productName) {
  const fields = [{ key: 'rating', label: 'Rating', filled: rating > 0 }];
  if (mode === 'made_it' && defaults?.bag && (defaults.brewer || defaults.grinder)) {
    fields.push({ key: 'bag', label: 'Bag', filled: true }, { key: 'method', label: 'Method', filled: true });
  }
  if (mode === 'packaged') fields.push({ key: 'product', label: 'Product', filled: Boolean(productName) });
  return fields;
}

export function RecordDraftProvider({ onSaved, children }) {
  const db = useDatabase();
  const [defaults, setDefaults] = useState(null);
  const [rating, setRating] = useState(0);
  const [mode, setMode] = useState('made_it');
  const [axes, setAxes] = useState(EMPTY_AXES);
  const [flavours, setFlavours] = useState([]);
  // Packaged: the product name as typed or picked from past ones (never pre-filled).
  const [productName, setProductName] = useState(null);
  const noteRef = useRef('');
  const [noteFilled, setNoteFilled] = useState(false);
  const [missing, setMissing] = useState(false);
  const required = useMemo(() => requiredFields(mode, defaults, rating, productName), [mode, defaults, rating, productName]);
  const missingFields = useMemo(() => required.filter((f) => !f.filled), [required]);
  useEffect(() => {
    if (missingFields.length === 0) setMissing(false);
  }, [missingFields]);
  const saving = useRef(false);

  useEffect(() => {
    let alive = true;
    loadRecordDefaults(db).then(
      (d) => alive && setDefaults(d),
      (error) => {
        console.error('[record] could not read defaults', error);
        if (!alive) return;
        setDefaults(EMPTY_DEFAULTS);
        Alert.alert("Couldn't read your bags and gear", String(error?.message ?? error));
      }
    );
    return () => {
      alive = false;
    };
  }, [db]);

  const setAxis = useCallback((key, value) => setAxes((prev) => ({ ...prev, [key]: value })), []);

  /** This cup's bag: one just added (3c), or picked (the bag picker). */
  const chooseBag = useCallback((bag) => setDefaults((prev) => ({ ...(prev ?? EMPTY_DEFAULTS), bag })), []);

  /**
   * This cup's gear: { brewer?, grinder? }. From 3a (the defaults it leaves)
   * or the Method picker (this cup only; the shelf's defaults stay).
   */
  const chooseGear = useCallback((gear) => setDefaults((prev) => ({ ...(prev ?? EMPTY_DEFAULTS), ...gear })), []);

  /** Select / deselect a flavour. Reaching the limit gives one light impact (§1 Selection limit). */
  const toggleFlavour = useCallback((word) => {
    setFlavours((prev) => {
      if (prev.includes(word)) return prev.filter((w) => w !== word);
      if (prev.length >= FLAVOUR_LIMIT) return prev;
      const next = [...prev, word];
      if (next.length === FLAVOUR_LIMIT && Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      return next;
    });
  }, []);

  const save = useCallback(
    async ({ withNote }) => {
      if (missingFields.length > 0) {
        setMissing(true);
        return 'missing';
      }
      if (saving.current || !defaults) return undefined;
      saving.current = true;
      const note = noteRef.current.trim();
      try {
        const id = await insertCup(db, {
          rating,
          mode,
          bagId: defaults.bag?.id ?? null,
          brewerId: defaults.brewer?.id ?? null,
          brewMethod: defaults.brewer?.name ?? null,
          grinderId: defaults.grinder?.id ?? null,
          grinder: defaults.grinder?.name ?? null,
          placeId: defaults.cafe?.id ?? null,
          // Never a fixed drink: a cup records only what was entered
          // (2026-10-11; "Flat white" was written for every Barista cup).
          drinkType: null,
          productName,
          boughtAtPlaceId: defaults.store?.id ?? null,
          ...(withNote ? { axes, flavours, note: note || null } : {}),
        });
        onSaved(id);
        return 'saved';
      } catch (error) {
        // Never drop a cup silently: say so, and keep the sheet open with
        // everything still entered so the user can try again.
        // Copy: Design, 2026-10-11 (design-missing.md 14). The technical error
        // goes to the log only. "Cancel" is iOS's own dismiss, not Design's
        // copy: without it a lasting failure would trap the user in retries.
        // Retrying any number of times, and closing (which loses the input,
        // no drafts): gaps.md 30.
        console.error('[record] save failed', error);
        Alert.alert("Couldn't save this cup", "Your phone couldn't store it. Everything you entered is still here — try again.", [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Try again', isPreferred: true, onPress: () => saveRef.current?.({ withNote }) },
        ]);
        return 'failed';
      } finally {
        saving.current = false;
      }
    },
    [axes, db, defaults, flavours, missingFields, mode, onSaved, productName, rating]
  );

  const saveRef = useRef(null);
  saveRef.current = save;

  const hasTastingInput = noteFilled || flavours.length > 0 || Object.values(axes).some((v) => v != null);

  const value = useMemo(
    () => ({
      defaults,
      chooseBag,
      chooseGear,
      productName,
      setProductName,
      rating,
      setRating,
      mode,
      setMode,
      axes,
      setAxis,
      flavours,
      toggleFlavour,
      noteRef,
      setNoteFilled,
      hasTastingInput,
      required,
      missing,
      missingFields,
      save,
    }),
    [axes, defaults, flavours, hasTastingInput, missing, missingFields, mode, productName, rating, required, save, setAxis, toggleFlavour, chooseBag, chooseGear]
  );
  return <RecordDraftContext.Provider value={value}>{children}</RecordDraftContext.Provider>;
}

/** The draft when inside the Record sheet, else null (3c / 3a also open from Home). */
export function useRecordDraftIfAny() {
  return useContext(RecordDraftContext);
}

export function useRecordDraft() {
  const draft = useContext(RecordDraftContext);
  if (!draft) throw new Error('useRecordDraft must be used inside RecordDraftProvider (AddCoffeeOverlay)');
  return draft;
}
