import { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import Button from '../components/base/Button';
import IconButton from '../components/base/IconButton';
import Text from '../components/base/Text';
import CheckboxList from '../components/CheckboxList';
import { useRecordDraft } from '../components/RecordDraft';
import { GEAR_LIMIT, GEAR_TYPES } from '../constants/gear';
import { useDatabase } from '../data/DatabaseProvider';
import { countGear, insertGear } from '../data/repository';
import { spacing } from '../theme/tokens';
import ScreenFrame from './ScreenFrame';

/**
 * 3a (minimal) — "Add gear", pushed from 5a's "Add gear" row inside the
 * Record sheet (design/components.md: the screen is 3a; its content is the
 * Gear pick list, 8c's generic gear). One tap per piece, no typing. When the
 * full 3a (catalogue, search, models, cap 8) is built this screen becomes it.
 *
 * Save adds the checked gear; the first of a category becomes its default, so
 * 5a's Method fills at once. Count and copy follow 3a: "N / 8 Selected" counts
 * the shelf after saving (gear already owned + checked), "N slots left" under
 * the button, "Save N items".
 * TODO: 3a's mock does not say whether "Selected" counts gear already owned;
 * read here as the whole shelf, since the cap is the shelf's.
 */
export default function AddGearScreen({ onBack }) {
  const db = useDatabase();
  const { chooseGear } = useRecordDraft();
  const [owned, setOwned] = useState(null);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    let alive = true;
    countGear(db).then((n) => alive && setOwned(n), () => alive && setOwned(0));
    return () => {
      alive = false;
    };
  }, [db]);

  const total = (owned ?? 0) + selected.length;
  const left = GEAR_LIMIT - total;
  const toggle = (name) => setSelected((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));

  const save = async () => {
    try {
      const items = GEAR_TYPES.filter((g) => selected.includes(g.name)).map(({ name, category }) => ({ name, category }));
      chooseGear(await insertGear(db, items, GEAR_LIMIT));
      onBack();
    } catch (error) {
      console.error('[gear] could not add', error);
      Alert.alert("This gear wasn't added", `Your picks are still here. ${String(error?.message ?? error)}`);
    }
  };

  const n = selected.length;
  return (
    <ScreenFrame
      scroll
      title="Add gear"
      leading={<IconButton icon="chevronLeft" accessibilityLabel="Back" onPress={onBack} />}
      stat={owned != null ? { value: `${total} / ${GEAR_LIMIT}`, label: 'Selected' } : undefined}
      footer={
        <View style={styles.footer}>
          {/* "Save 0 items" says why it is off, so a press warns (§1). */}
          <Button label={n === 1 ? 'Save 1 item' : `Save ${n} items`} onPress={save} disabled={n === 0 || owned == null} warnWhenDisabled={n === 0} />
          {owned != null ? (
            <Text variant="bodySm" color="secondary" style={styles.slots}>
              {left === 1 ? '1 slot left' : `${left} slots left`}
            </Text>
          ) : null}
        </View>
      }>
      <CheckboxList items={GEAR_TYPES} selected={selected} locked={owned == null || left <= 0} onToggle={toggle} />
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  footer: {
    gap: spacing.gap.row,
  },
  slots: {
    textAlign: 'center',
  },
});
