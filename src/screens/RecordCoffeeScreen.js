import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import Button from '../components/base/Button';
import EmptySlot from '../components/base/EmptySlot';
import FieldRow from '../components/base/FieldRow';
import Glyph from '../components/base/Glyph';
import IconButton from '../components/base/IconButton';
import SectionLabel from '../components/base/SectionLabel';
import SegmentedControl from '../components/base/SegmentedControl';
import StarRating from '../components/base/StarRating';
import Text from '../components/base/Text';
import { useDatabase } from '../data/DatabaseProvider';
import { insertCup, loadRecordDefaults } from '../data/repository';
import { color, icon, motion, shape, size, space, spacing, state } from '../theme/tokens';
import ScreenFrame from './ScreenFrame';

/**
 * Record coffee — 5a "Log a cup". All three maker modes. Field sets show the
 * most recent bean / café / product / store from the database (dev builds
 * seed them on first run); rows render a chevron and do nothing yet.
 * SAVE THIS CUP inserts a cup row and dismisses — a local insert, so there is
 * no spinner, no disabled state and nothing to wait for. A genuine failure is
 * shown plainly and the overlay stays open, so the cup is never silently lost.
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
const RATING_COPY = {
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
        <Text variant="meta" color="muted">
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

function Section({ label, status, children }) {
  return (
    <View style={styles.section}>
      <SectionLabel label={label} status={status} />
      {children}
    </View>
  );
}

/**
 * Defaults with no table behind them yet (no gear or drink tables in V1): the
 * mock's values, written into the cup as-is.
 */
const DEFAULT_BREW_METHOD = 'V60';
const DEFAULT_GRINDER = 'Comandante C40';
const DEFAULT_DRINK = 'Flat white';

/** Shown for a field with no row behind it (an empty database). TODO(Step 5): pickers. */
const NONE = '—';

const DAY_MS = 86400000;

/*
 * Meta lines: only what the stored rows can back. The mock's history- and
 * location-derived lines ("drink now", "250 m away · your 4th visit", "What you
 * ordered here last time", "Bought twice in the last month") and 5e's
 * "Chilled, unsweetened" (not in the schema) wait for the features behind them.
 * TODO(Step 5): rows open their pickers; tapping does nothing yet.
 */
function beanMeta(bean) {
  if (!bean) return undefined;
  if (bean.opened_at == null) return bean.roaster ?? undefined;
  const day = Math.floor((Date.now() - bean.opened_at) / DAY_MS);
  return [bean.roaster, `day ${day}`].filter(Boolean).join(' · ');
}

const capitalise = (word) => word.charAt(0).toUpperCase() + word.slice(1);

function MadeItFields({ defaults }) {
  const { bean } = defaults;
  return (
    <Section label="From my shelf" status="prefilled">
      <View style={styles.card}>
        <FieldRow swatch label="Beans" value={bean?.name ?? NONE} meta={beanMeta(bean)} />
        <FieldRow divided label="Method" value={`${DEFAULT_BREW_METHOD} · ${DEFAULT_GRINDER}`} meta="Your default brewer" />
      </View>
    </Section>
  );
}

function BaristaFields({ defaults }) {
  return (
    <Section label="Café details" status="prefilled">
      <View style={styles.card}>
        <FieldRow icon="pin" label="Café" value={defaults.cafe?.name ?? NONE} />
        <FieldRow divided label="Drink" value={DEFAULT_DRINK} />
      </View>
    </Section>
  );
}

function PackagedFields({ defaults }) {
  const { product, store } = defaults;
  const brand = product ? [product.brand, product.name].filter(Boolean).join(' · ') : NONE;
  const pack = product
    ? [product.container && capitalise(product.container), product.volume_ml && `${product.volume_ml} ml`].filter(Boolean).join(' · ') || NONE
    : NONE;
  return (
    <View style={styles.fieldSets}>
      <Section label="Product" status="prefilled">
        <View style={styles.card}>
          <FieldRow icon="can" label="Brand" value={brand} />
          <FieldRow divided label="Package" value={pack} />
        </View>
      </Section>
      <Section label="Bought at" status="optional">
        {/* Inline composition, 5e only (design-system.md §9 Bought at row): weak
            1.5px frame, inline bag glyph, store name, no chevron. 5e's ¥180 is
            dropped — there is no price in the data model (drift.md D-15).
            A second occurrence promotes it to a base component. */}
        <View style={styles.weakFrame}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Bought at ${store?.name ?? NONE}`}
            style={({ pressed }) => [styles.inlineRow, pressed && styles.inlineRowPressed]}>
            <Glyph name="bag" token={icon.md} color={color.icon.muted} />
            <Text variant="label" truncate="name" style={styles.inlineName}>
              {store?.name ?? NONE}
            </Text>
          </Pressable>
        </View>
      </Section>
    </View>
  );
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

  return (
    <Animated.View style={[styles.clip, measured && { height }]}>
      <View onLayout={onContentLayout}>{children}</View>
    </Animated.View>
  );
}

const EMPTY_DEFAULTS = { bean: null, cafe: null, product: null, store: null };

/*
 * Header date / time: the live clock, since it is what Save stores (created_at,
 * and logged_at with it). Formatted by Intl in the device locale — ja / zh
 * order these differently — in 5a's shape: "Wed, Apr 8" / "08:20 · Morning".
 */
const dateFormat = new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
const timeFormat = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });

/**
 * Part of day, as 5a / 5e word it ("Morning", "Afternoon"). Intl has no
 * equivalent of these words (its dayPeriod gives "in the morning"), so this is
 * copy. TODO(i18n): translate with the other strings; the hour boundaries are
 * an assumption, not from a mock.
 */
function partOfDay(date) {
  const h = date.getHours();
  if (h >= 5 && h < 12) return 'Morning';
  if (h >= 12 && h < 17) return 'Afternoon';
  if (h >= 17 && h < 22) return 'Evening';
  return 'Night';
}

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

export default function RecordCoffeeScreen({ onClose, onAddNote }) {
  const db = useDatabase();
  // 0 = not rated yet. Rating is the one required field (the database rejects
  // anything outside 1–5), so Save stays disabled until a star is tapped.
  const [rating, setRating] = useState(0);
  const now = useMinuteClock();
  const [maker, setMaker] = useState('made_it');
  const [defaults, setDefaults] = useState(null);
  const Fields = FIELD_SETS[maker];

  useEffect(() => {
    let alive = true;
    loadRecordDefaults(db).then(
      (d) => alive && setDefaults(d),
      (error) => {
        console.error('[record] could not read defaults', error);
        if (!alive) return;
        setDefaults(EMPTY_DEFAULTS);
        Alert.alert("Couldn't read your beans and places", String(error?.message ?? error));
      }
    );
    return () => {
      alive = false;
    };
  }, [db]);

  const save = async () => {
    try {
      await insertCup(db, {
        rating,
        mode: maker,
        beanId: defaults?.bean?.id ?? null,
        brewMethod: DEFAULT_BREW_METHOD,
        grinder: DEFAULT_GRINDER,
        placeId: defaults?.cafe?.id ?? null,
        drinkType: DEFAULT_DRINK,
        productId: defaults?.product?.id ?? null,
        boughtAtPlaceId: defaults?.store?.id ?? null,
      });
      onClose();
    } catch (error) {
      // Never drop a cup silently: say so, and keep the overlay open with
      // everything still filled in so the user can try again.
      console.error('[record] save failed', error);
      Alert.alert("This cup wasn't saved", String(error?.message ?? error));
    }
  };

  // The defaults are a local read (milliseconds); render once they are in, so
  // the field sets never flash empty values while the sheet slides up.
  if (!defaults) return null;

  return (
    <ScreenFrame
      scroll
      compact
      title="Log a cup"
      leading={<IconButton icon="close" accessibilityLabel="Close" onPress={onClose} />}
      meta={
        <View style={styles.when}>
          <Text variant="labelCaps" color="muted">
            {dateFormat.format(now)}
          </Text>
          <Text variant="labelCaps" color="accent" style={styles.whenTime}>
            {`${timeFormat.format(now)} · ${partOfDay(now)}`}
          </Text>
        </View>
      }
      footer={
        <>
          {/* Minimum viable validation: the full 5d error state comes later. */}
          <Button label="Save this cup" onPress={save} disabled={rating === 0} />
          {/* Opens the tasting note (5b), step 2 of 2 in this sheet. */}
          <Button variant="secondary" label="Add tasting note" trailingIcon="arrowRight" onPress={onAddNote} />
        </>
      }>
      <View style={styles.sections}>
        <ExpandingBlock>
          <View style={styles.hint}>
            <View style={styles.bullet} />
            <IntroText text={INTRO[maker]} />
          </View>
        </ExpandingBlock>

        {/* SET only once a star is tapped. The caption line is reserved while
            unrated, so the first tap does not grow the card. */}
        <Section label="How was it?" status={rating > 0 ? 'set' : undefined}>
          <StarRating value={rating} onChange={setRating} caption={RATING_COPY[rating] ?? ''} />
        </Section>

        <Section label="Who made it?" status="set">
          <SegmentedControl options={MAKERS} value={maker} onChange={setMaker} />
        </Section>

        <ExpandingBlock>
          {/* Keyed by mode: a switch remounts the field set, so nothing carries over. */}
          <Fields key={maker} defaults={defaults} />
        </ExpandingBlock>

        {/* TODO(Step 5): opens the camera / library; inert for now. */}
        <EmptySlot icon="camera" label="Add a photo" tag="Optional" />
      </View>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  // 5a: date over time, right-aligned at the header's right.
  when: {
    alignItems: 'flex-end',
  },
  whenTime: {
    marginTop: spacing.gap.tight,
  },
  sections: {
    gap: spacing.gap.section,
  },
  fieldSets: {
    gap: spacing.gap.section,
  },
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.gap.row,
  },
  bullet: {
    width: size.dot.bullet,
    height: size.dot.bullet,
    backgroundColor: color.marker.required,
  },
  introText: {
    // Full row width, so the outgoing line never re-wraps to the new one's width.
    flex: 1,
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
  weakFrame: {
    borderWidth: shape.borderWidth.divider,
    borderColor: color.border.muted,
    backgroundColor: color.surface.raised,
  },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
    paddingVertical: spacing.inset.control.v,
    paddingHorizontal: spacing.inset.control.h,
  },
  inlineRowPressed: {
    backgroundColor: state.pressed.surface,
  },
  inlineName: {
    flex: 1,
  },
});
