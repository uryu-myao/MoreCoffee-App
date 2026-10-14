import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import Button from '../components/base/Button';
import FieldRow from '../components/base/FieldRow';
import Glyph from '../components/base/Glyph';
import HardShadow from '../components/base/HardShadow';
import IconButton from '../components/base/IconButton';
import SectionLabel from '../components/base/SectionLabel';
import SegmentedControl from '../components/base/SegmentedControl';
import StarRating from '../components/base/StarRating';
import Text from '../components/base/Text';
import PickerSheet from '../components/PickerSheet';
import { useRecordDraft } from '../components/RecordDraft';
import WhenMeta from '../components/WhenMeta';
import { useDatabase } from '../data/DatabaseProvider';
import { listGear, listOpenBags } from '../data/repository';
import { color, icon, motion, shape, size, space, spacing, state } from '../theme/tokens';
import ScreenFrame from './ScreenFrame';
import { FRESHNESS_WORDS, freshnessOf } from '../data/freshness';

/**
 * Record coffee — 5a "Log a cup". All three maker modes. The cup being
 * recorded is the Record sheet's draft (components/RecordDraft.js), shared
 * with 5b. Field sets show the latest open bag and the default gear (I made
 * it), or the most recent café / product / store; rows render a chevron and do
 * nothing yet (pickers: stage 3).
 * SAVE THIS CUP saves everything entered so far — including anything entered
 * in 5b before coming back (design-system.md §1 Saving a cup) — and dismisses.
 * A genuine failure is shown plainly and the sheet stays open.
 *
 * Switching modes keeps the rating (it is about the cup, not who made it),
 * resets the conditional field set (keyed by mode), and keeps the photo slot.
 *
 * Section spacing is gap.section (12); the source's 16 / 18 / 20 is drift.md D-13.
 */
/** Values are cups.mode (design/data-model.md). */
const MAKERS = [
  { value: 'made_it', label: 'I made it' },
  { value: 'barista', label: 'Barista' },
  { value: 'packaged', label: 'Packaged' },
];

const expandEasing = Easing.bezier(...motion.expand.controlPoints);

/**
 * The intro line per mode, each naming who made the cup. I made it is 5a
 * verbatim. Packaged is 5e with "Bottled" → "Packaged" (drift.md D-14: the
 * rename wins over the mock). No mock has a Barista line (5d replaces it with
 * the error summary), so it is written to 5e's pattern.
 */
/** I made it with an empty shelf (no bag or no gear): Design, 2026-10-11. */
const INTRO_EMPTY_SHELF = 'Marked fields are required. Add a bag and your gear once — after that they start pre-filled.';

const INTRO = {
  made_it: 'Marked fields are required — all of them start pre-filled.',
  barista: 'Cups made for you skip beans and brewing — two fields left.',
  packaged: 'Packaged cups skip brewing and café — two fields left.',
};

/**
 * One line per rating, shown the moment a star is set (design-system.md §9
 * Star rating). Mode-neutral ("have", not "order": the cup may be one I made),
 * subject dropped, sentence case, never "Your"; rises monotonically. 4 is 5a's
 * "Would order again" with the verb made mode-neutral.
 */
export const RATING_COPY = {
  1: 'Not for me',
  2: 'Not again',
  3: 'Does the job',
  4: 'Would have again',
  5: 'One to remember',
};

/**
 * Crossfades from the previous line to the new one with the product's one
 * motion, so the copy eases with the field block instead of popping. The old
 * line sits over the new one while it fades out.
 */
function IntroText({ text }) {
  const [shown, setShown] = useState({ current: text, previous: null });
  const fade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (text === shown.current) return;
    setShown({ current: text, previous: shown.current });
    fade.setValue(0);
    Animated.timing(fade, {
      toValue: 1,
      duration: motion.expand.duration,
      easing: expandEasing,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) setShown((s) => ({ ...s, previous: null }));
    });
    // shown.current is read, not tracked: only a new text starts a fade.
  }, [text, fade]);

  return (
    <View style={styles.introText}>
      <Animated.View style={{ opacity: fade }}>
        {/* Keyed by the copy: a new line gets a new text node. Updating the
            node in place kept the old line's one-line height, so a longer
            line was clipped instead of wrapping (found 2026-10-11). */}
        <Text key={shown.current} variant="meta" color="muted">
          {shown.current}
        </Text>
      </Animated.View>
      {shown.previous ? (
        <Animated.View style={[styles.introPrevious, { opacity: fade.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }]}>
          <Text variant="meta" color="muted">
            {shown.previous}
          </Text>
        </Animated.View>
      ) : null}
    </View>
  );
}

function Section({ label, status, plain, children }) {
  return (
    <View style={styles.section}>
      <SectionLabel label={label} status={status} variant={plain ? 'plain' : 'marked'} />
      {children}
    </View>
  );
}


/** Shown for a field with no row behind it (an empty database). TODO(Step 5): pickers. */
const NONE = '—';

/*
 * Meta lines: only what the stored rows can back. The mock's history- and
 * location-derived lines ("drink now", "250 m away · your 4th visit", "What you
 * ordered here last time", "Bought twice in the last month") and 5e's
 * "Chilled, unsweetened" (not in the schema) wait for the features behind them.
 * TODO(Step 5): rows open their pickers; tapping does nothing yet.
 */
/** "Blue Bottle · day 7, drink now" (5a's mock): the day and state from the roast date (data/freshness.ts); roaster alone without one. */
function bagMeta(bag) {
  if (!bag) return undefined;
  const f = freshnessOf(bag.roasted_at);
  return [bag.roaster, f ? `day ${f.day}, ${FRESHNESS_WORDS[f.state]}` : null].filter(Boolean).join(' · ') || undefined;
}

/**
 * I made it: the bag and the method, off the shelf. With no bag or no gear the
 * row says "Add a bag" / "Add gear" (placeholder look, text.secondary) and the
 * section drops its required mark: a mark promises "always filled", and an
 * empty shelf cannot keep that promise (design-system.md §1 Required marks).
 * Neither blocks Save. "Add a bag" opens 3c (minimal), "Add gear" 3a (minimal).
 */
function MadeItFields({ defaults, onAddBag, onAddGear, onPick }) {
  const { bag, brewer, grinder } = defaults;
  const method = [brewer?.name, grinder?.name].filter(Boolean).join(' · ');
  const filled = Boolean(bag && method);
  return (
    <Section label="From my shelf" status={filled ? 'prefilled' : undefined} plain={!filled}>
      <View style={styles.card}>
        {bag ? (
          <FieldRow swatch label="Bag" value={bag.name} meta={bagMeta(bag)} onPress={() => onPick('bag')} />
        ) : (
          <FieldRow swatch label="Bag" value="Add a bag" placeholder onPress={onAddBag} />
        )}
        {method ? (
          <FieldRow divided label="Method" value={method} meta={brewer?.is_default ? 'Your default brewer' : undefined} onPress={() => onPick('gear')} />
        ) : (
          <FieldRow divided label="Method" value="Add gear" placeholder onPress={onAddGear} />
        )}
      </View>
    </Section>
  );
}

/**
 * Barista (not at this stage): selectable, but nothing to enter yet — the
 * café and drink stay empty ("—") and are saved empty. No required mark and no
 * "Pre-filled": nothing here can be filled (§1 Required marks).
 */
function BaristaFields({ defaults }) {
  const filled = Boolean(defaults.cafe);
  return (
    <Section label="Café details" status={filled ? 'prefilled' : undefined} plain={!filled}>
      <View style={styles.card}>
        {/* readOnly: no picker yet, so no chevron (§1 Tap affordance). */}
        <FieldRow readOnly icon="pin" label="Café" value={defaults.cafe?.name ?? NONE} />
        <FieldRow readOnly divided label="Drink" value={NONE} />
      </View>
    </Section>
  );
}

/**
 * Packaged: nothing to show until the product-name input exists
 * (design-missing.md 6, migration 4). Brand / Package / Bought at read "—"
 * and couldn't be filled, so they are gone (2026-10-14, §1: no field that
 * can't be filled); the whole block goes too — a "Product" heading over
 * nothing read as a page still loading.
 */
function PackagedFields() {
  return null;
}

const FIELD_SETS = { made_it: MadeItFields, barista: BaristaFields, packaged: PackagedFields };

/**
 * The block's height follows its content with the product's one motion
 * (motion.expand) — 5a's own mechanism: the new field set lays out at full
 * height inside a clipped wrapper, and the wrapper animates to it, so
 * everything below slides rather than jumps.
 */
function ExpandingBlock({ children }) {
  const height = useRef(new Animated.Value(0)).current;
  const [measured, setMeasured] = useState(false);
  const target = useRef(null);

  const onContentLayout = (e) => {
    const next = e.nativeEvent.layout.height;
    if (target.current === next) return;
    const first = target.current == null;
    target.current = next;
    if (first) {
      height.setValue(next);
      setMeasured(true);
      return;
    }
    Animated.timing(height, {
      toValue: next,
      duration: motion.expand.duration,
      easing: expandEasing,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => () => height.stopAnimation(), [height]);

  // Once measured, the content is laid out absolutely (top / left / right),
  // so it is measured free of the clip's animated height. In the flow it was
  // measured against that height, and a longer line (Barista's intro) was cut
  // to the previous line's single line instead of wrapping (found 2026-10-11).
  return (
    <Animated.View style={[styles.clip, measured && { height }]}>
      <View onLayout={onContentLayout} style={measured && styles.clipContent}>
        {children}
      </View>
    </Animated.View>
  );
}


/*
 * Header date / time: the live clock, since it is what Save stores (created_at,
 * and logged_at with it). Formatted by Intl in the device locale — ja / zh
 * order these differently — in 5a's shape: "Wed, Apr 8" / "08:20 · Morning".
 */


/** Re-renders on each minute boundary, so the header never shows a stale minute. */
function useMinuteClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    let timer;
    const tick = () => {
      const current = new Date();
      setNow(current);
      timer = setTimeout(tick, 60000 - (current.getSeconds() * 1000 + current.getMilliseconds()));
    };
    timer = setTimeout(tick, 60000 - (now.getSeconds() * 1000 + now.getMilliseconds()));
    return () => clearTimeout(timer);
    // Started once; tick reschedules itself.
  }, []);
  return now;
}

/**
 * 5d in V1 (design/components.md "5d in V1"): Save pressed with no rating.
 * Rating only — the mock's café is out of scope. No "Keep as draft" (no
 * drafts in V1, gaps.md 30).
 *
 * Copy: Design, 2026-10-11 (design-missing.md 11) — promises no draft, does
 * not count, does not repeat the star card's line.
 */
const MISSING_COPY = {
  title: 'Still needs a rating',
  body: "A cup can't be saved without one. What you've entered stays while you're here; closing loses it.",
  footer: 'No rating yet.',
};
/** 5d's line under the stars (verbatim). */
const STAR_HINT = "Tap a star — this is the one thing the app can't guess.";

/** 5d's reminder card, in place of the intro block: the error set (§2 state.error). */
function MissingCard() {
  return (
    <HardShadow shadow={state.error.shadow}>
      <View style={styles.missingCard} accessibilityRole="alert">
        <Glyph name="alert" token={icon.md} color={state.error.text} />
        <View style={styles.missingText}>
          <Text variant="label" color={state.error.text}>
            {MISSING_COPY.title}
          </Text>
          <Text variant="bodySm" color="secondary">
            {MISSING_COPY.body}
          </Text>
        </View>
      </View>
    </HardShadow>
  );
}

/** 5d's footer line: the count square, what is missing, "Go to first". */
function MissingLine({ onGoToFirst }) {
  return (
    <View style={styles.missingLine}>
      <View style={styles.missingCount}>
        <Text variant="labelCaps" color={color.surface.raised}>
          1
        </Text>
      </View>
      <Text variant="meta" color={state.error.text} style={styles.missingLineText}>
        {MISSING_COPY.footer}
      </Text>
      <Pressable onPress={onGoToFirst} accessibilityRole="button" hitSlop={GO_TO_FIRST_SLOP}>
        <Text variant="inlineAction" color="link">
          Go to first
        </Text>
      </Pressable>
    </View>
  );
}
// inlineAction's ~13pt line padded out to the 44pt tap target.
const GO_TO_FIRST_SLOP = { top: space[16], bottom: space[16], left: space[8], right: space[8] };

export default function RecordCoffeeScreen({ onClose, onAddNote, onAddBag, onAddGear }) {
  const { defaults, chooseBag, chooseGear, rating, setRating, mode: maker, setMode: setMaker, missing, save } = useRecordDraft();
  const db = useDatabase();
  // Stage 3's picker (decided 2026-10-11): the Bag / Method rows open the
  // shelf's open bags / gear for this cup. 'bag' | 'gear' | null.
  const [picking, setPicking] = useState(null);
  const [shelf, setShelf] = useState({ bags: [], brewers: [], grinders: [] });
  const openPicker = useCallback(
    async (kind) => {
      try {
        const [bags, brewers, grinders] = await Promise.all([listOpenBags(db), listGear(db, 'brewer'), listGear(db, 'grinder')]);
        setShelf({ bags, brewers, grinders });
        setPicking(kind);
      } catch (error) {
        console.error('[record] could not read the shelf', error);
      }
    },
    [db]
  );
  const now = useMinuteClock();
  const Fields = FIELD_SETS[maker];
  const scrollRef = useRef(null);
  // 5d: whenever the state starts (Save here, or a bounce back from 5b), bring
  // the rating into view — the automatic "Go to first".
  const goToFirst = useCallback(() => scrollRef.current?.scrollTo({ y: 0, animated: true }), []);
  useEffect(() => {
    if (missing) goToFirst();
  }, [missing, goToFirst]);

  // The defaults are a local read (milliseconds); render once they are in, so
  // the field sets never flash empty values while the sheet slides up.
  if (!defaults) return null;

  return (
    <View style={styles.screen}>
      <ScreenFrame
        scroll
        compact
        scrollRef={scrollRef}
        footerTone={missing ? 'error' : undefined}
        title="Log a cup"
        leading={<IconButton icon="close" accessibilityLabel="Close" onPress={onClose} />}
        meta={<WhenMeta at={now} />}
        footer={
          <>
            {missing ? <MissingLine onGoToFirst={goToFirst} /> : null}
            {/* Always pressable: with no rating it shows 5d instead (§1, 2026-10-11). */}
            <Button label="Save this cup" onPress={() => save({ withNote: true })} />
            {/* Opens the tasting note (5b), step 2 of 2 in this sheet. */}
            <Button variant="secondary" label="Add tasting note" trailingIcon="arrowRight" onPress={onAddNote} />
          </>
        }>
        <View style={styles.sections}>
          {/* 5d's card sits outside the expanding block, whose clip would cut
              its 4pt hard shadow. */}
          {missing ? (
            <MissingCard />
          ) : (
            <ExpandingBlock>
              {/* The intro line (decided 2026-10-11): on surface.raised, no frame,
                  no leading square (5a's mock draws a 6pt accent square and no
                  background). */}
              <View style={styles.hint}>
                <IntroText
                text={maker === 'made_it' && !(defaults.bag && (defaults.brewer || defaults.grinder)) ? INTRO_EMPTY_SHELF : INTRO[maker]}
              />
              </View>
            </ExpandingBlock>
          )}

          {/* SET only once a star is tapped. The caption line is reserved while
              unrated, so the first tap does not grow the card. */}
          <Section label="How was it?" status={rating > 0 ? 'set' : missing ? 'required' : undefined}>
            <StarRating value={rating} onChange={setRating} caption={RATING_COPY[rating] ?? ''} error={missing ? STAR_HINT : undefined} />
          </Section>

          <Section label="Who made it?" status="set">
            <SegmentedControl options={MAKERS} value={maker} onChange={setMaker} />
          </Section>

          <ExpandingBlock>
            {/* Keyed by mode: a switch remounts the field set, so nothing carries over. */}
            <Fields key={maker} defaults={defaults} onAddBag={onAddBag} onAddGear={onAddGear} onPick={openPicker} />
          </ExpandingBlock>

          {/* "Add a photo" is not shown at this stage (decided 2026-10-11):
              there is no camera, and a dashed add slot that does nothing breaks
              §1 Tap affordance. It returns with photos (5a's mock). */}
        </View>
      </ScreenFrame>
      <PickerSheet
        visible={picking === 'bag'}
        onClose={() => setPicking(null)}
        label="Bag"
        closeOnPick
        sections={[
          {
            items: shelf.bags.map((b) => ({ key: b.id, label: b.name, meta: bagMeta(b), swatch: true })),
            selected: defaults.bag?.id ?? null,
            onPick: (id) => chooseBag(shelf.bags.find((b) => b.id === id)),
            add: {
              label: 'Add a bag',
              onPress: () => {
                setPicking(null);
                onAddBag();
              },
            },
          },
        ]}
      />
      <PickerSheet
        visible={picking === 'gear'}
        onClose={() => setPicking(null)}
        label="Method"
        sections={[
          {
            label: 'Brewer',
            items: shelf.brewers.map((g) => ({ key: g.id, label: g.name, badge: g.is_default ? 'Default' : undefined })),
            selected: defaults.brewer?.id ?? null,
            onPick: (id) => chooseGear({ brewer: shelf.brewers.find((g) => g.id === id) }),
          },
          {
            label: 'Grinder',
            items: shelf.grinders.map((g) => ({ key: g.id, label: g.name, badge: g.is_default ? 'Default' : undefined })),
            selected: defaults.grinder?.id ?? null,
            onPick: (id) => chooseGear({ grinder: shelf.grinders.find((g) => g.id === id) }),
          },
          {
            // Its own row after every category: 3a adds any gear, not a grinder only.
            items: [],
            selected: null,
            onPick: () => {},
            add: {
              label: 'Add gear',
              onPress: () => {
                setPicking(null);
                onAddGear();
              },
            },
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  // 5a: date over time, right-aligned at the header's right.
  sections: {
    gap: spacing.gap.section,
  },
  fieldSets: {
    gap: spacing.gap.section,
  },
  missingCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space[12],
    borderWidth: shape.borderWidth.box,
    borderColor: state.error.border,
    backgroundColor: state.error.surface,
    paddingVertical: spacing.inset.control.v,
    paddingHorizontal: spacing.inset.control.h,
  },
  missingText: {
    flex: 1,
    gap: spacing.gap.tight,
  },
  missingLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.gap.row,
  },
  missingCount: {
    width: size.badge.numeral,
    height: size.badge.numeral,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: state.error.border,
  },
  missingLineText: {
    flex: 1,
  },
  hint: {
    // A column since the leading square went (D-46): in a row the text took
    // the row's measured width and was clipped instead of wrapping.
    backgroundColor: color.surface.raised,
    paddingVertical: spacing.inset.control.v,
    paddingHorizontal: spacing.inset.control.h,
  },
  introText: {
    // Full width, so the outgoing line never re-wraps to the new one's width.
    width: '100%',
  },
  introPrevious: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  section: {
    gap: spacing.gap.row,
  },
  card: {
    borderWidth: shape.borderWidth.box,
    borderColor: color.border.strong,
    backgroundColor: color.surface.raised,
  },
  clip: {
    overflow: 'hidden',
  },
  clipContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});
