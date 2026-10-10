import { useEffect, useState } from 'react';
import { Alert, Keyboard, StyleSheet, View } from 'react-native';
import BagForm from '../components/BagForm';
import DateSheet from '../components/DateSheet';
import Button from '../components/base/Button';
import IconButton from '../components/base/IconButton';
import Text from '../components/base/Text';
import { useRecordDraft } from '../components/RecordDraft';
import { useDatabase } from '../data/DatabaseProvider';
import { OPEN_BAG_LIMIT, countOpenBags, insertBag } from '../data/repository';
import { spacing } from '../theme/tokens';
import ScreenFrame from './ScreenFrame';

/**
 * 3c (minimal) — "Add a bag", pushed from 5a's "Add a bag" row inside the
 * Record sheet (design/components.md: the screen is 3c; its content is the
 * Bag form, minimal set). When the full 3c is built this screen becomes it,
 * with the same entry points.
 *
 * "Open this bag" stores the bag, opened now, makes it the cup's bag and goes
 * back to 5a. The name is the only required field. At 5 open bags the button
 * is disabled and the line under it says why (3c's copy).
 */
export default function AddBagScreen({ onBack }) {
  const db = useDatabase();
  const { chooseBag } = useRecordDraft();
  const [form, setForm] = useState({ name: '', roaster: '', roastedAt: null });
  const [picking, setPicking] = useState(false);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    let alive = true;
    countOpenBags(db).then((n) => alive && setOpen(n), () => alive && setOpen(0));
    return () => {
      alive = false;
    };
  }, [db]);

  const full = open != null && open >= OPEN_BAG_LIMIT;
  const free = open == null ? null : OPEN_BAG_LIMIT - open;
  const name = form.name.trim();

  const openBag = async () => {
    try {
      const bag = await insertBag(db, { name, roaster: form.roaster.trim() || null, roastedAt: form.roastedAt });
      chooseBag(bag);
      onBack();
    } catch (error) {
      console.error('[bag] could not add', error);
      Alert.alert("This bag wasn't added", `What you typed is still here. ${String(error?.message ?? error)}`);
    }
  };

  return (
    <View style={styles.screen}>
      <ScreenFrame
        scroll
        title="Add a bag"
        leading={<IconButton icon="chevronLeft" accessibilityLabel="Back" onPress={onBack} />}
        stat={open != null ? { value: `${open} / ${OPEN_BAG_LIMIT}`, label: 'Bags open' } : undefined}
        footer={
          <View style={styles.footer}>
            {/* Full: the line below says why, so a press warns (§1). An empty name
                has no reason on screen yet (gaps.md 12), so it stays silent. */}
            <Button label="Open this bag" onPress={openBag} disabled={!name || full || open == null} warnWhenDisabled={full} />
            {free != null ? (
              <Text variant="bodySm" color="secondary" style={styles.slots}>
                {full ? 'No slots free. Finish a bag to free one up.' : `${free} of ${OPEN_BAG_LIMIT} slots free. Finish a bag to free one up.`}
              </Text>
            ) : null}
          </View>
        }>
        <BagForm
          value={form}
          onChange={setForm}
          datePicking={picking}
          onPickDate={() => {
            Keyboard.dismiss();
            setPicking(true);
          }}
        />
      </ScreenFrame>
      <DateSheet
        visible={picking}
        onClose={() => setPicking(false)}
        label="Roasted on"
        value={form.roastedAt}
        maximum={new Date()}
        onChange={(roastedAt) => setForm((f) => ({ ...f, roastedAt }))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  footer: {
    gap: spacing.gap.row,
  },
  slots: {
    textAlign: 'center',
  },
});
