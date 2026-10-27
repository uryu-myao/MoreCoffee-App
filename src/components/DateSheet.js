import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { color } from '../theme/tokens';
import { startOfDay } from '../constants/dates';
import BottomSheet from './base/BottomSheet';
import Button from './base/Button';
import Text from './base/Text';

/**
 * A day picked in the bottom sheet (3c Roasted on; later 3g's dates), or a
 * day and time (11a's Date & time, `mode="datetime"`).
 *
 * iOS's spinner, decided 2026-10-10: compact (a rounded pill + popover) and
 * inline (a month grid with a round selected day) both bring the OS's round
 * shapes against the square-only rule; the spinner is wheels and text, whose
 * colour is set to text.primary. Light theme always.
 *
 * Header: the field's label (label.eyebrow, muted) and "Done" (text button) on
 * the right — the slot beside a sheet title already says "action" (§1).
 * The day changes as the wheels turn; Done, the dimmed page or a swipe down
 * closes (2026-10-22). The wheels keep their vertical drags; the swipe starts
 * only outside them (checked on device, 2026-10-23). With no value yet the
 * wheels start on today, and Done takes it.
 * TODO: no way to clear a picked date yet; no mock shows one.
 *
 * Props
 *   visible, onClose
 *   label     the field's label ("Roasted on")
 *   value     ms of a local midnight (date), or of a moment (datetime); or null
 *   minimum   earliest pickable moment (Date), optional (11a: the bag's roast day)
 *   maximum   latest pickable day (Date); the roast date stops at today (T-5)
 *   mode      'date' (default) | 'datetime'
 *   onChange  (ms) => void — a local midnight in date mode
 */
export default function DateSheet({ visible, onClose, label, value, minimum, maximum, mode = 'date', onChange }) {
  const pick = (date) => (mode === 'date' ? startOfDay(date) : date.getTime());
  const [shown, setShown] = useState(() => new Date(value ?? Date.now()));
  useEffect(() => {
    if (visible) setShown(new Date(value ?? Date.now()));
  }, [visible, value]);

  return (
    <BottomSheet visible={visible} onClose={onClose} swipeToClose>
      <View style={styles.header}>
        {/* The sheet's title in display.sm, as the picker's (decided 2026-10-12). */}
        <Text variant="displaySm" color="primary">
          {label}
        </Text>
        <Button
          variant="text"
          label="Done"
          onPress={() => {
            onChange(pick(shown));
            onClose();
          }}
        />
      </View>
      <DateTimePicker
        value={shown}
        mode={mode}
        display="spinner"
        minimumDate={minimum}
        maximumDate={maximum}
        themeVariant="light"
        textColor={color.text.primary}
        onValueChange={(_, date) => {
          if (!date) return;
          setShown(date);
          onChange(pick(date));
        }}
      />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
