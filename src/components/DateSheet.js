import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { color } from '../theme/tokens';
import { startOfDay } from '../constants/dates';
import BottomSheet from './base/BottomSheet';
import Button from './base/Button';
import Text from './base/Text';

/**
 * A day picked in the bottom sheet (3c Roasted on; later 3g's dates).
 *
 * iOS's spinner, decided 2026-10-10: compact (a rounded pill + popover) and
 * inline (a month grid with a round selected day) both bring the OS's round
 * shapes against the square-only rule; the spinner is wheels and text, whose
 * colour is set to text.primary. Light theme always.
 *
 * Header: the field's label (label.eyebrow, muted) and "Done" (text button) on
 * the right — the slot beside a sheet title already says "action" (§1).
 * The day changes as the wheels turn; Done (or the dimmed page) closes. With
 * no value yet the wheels start on today, and Done takes it.
 * TODO: no way to clear a picked date yet; no mock shows one.
 *
 * Props
 *   visible, onClose
 *   label     the field's label ("Roasted on")
 *   value     ms of a local midnight, or null
 *   maximum   latest pickable day (Date); the roast date stops at today (T-5)
 *   onChange  (ms of local midnight) => void
 */
export default function DateSheet({ visible, onClose, label, value, maximum, onChange }) {
  const [shown, setShown] = useState(() => new Date(value ?? Date.now()));
  useEffect(() => {
    if (visible) setShown(new Date(value ?? Date.now()));
  }, [visible, value]);

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.header}>
        <Text variant="labelEyebrow" color="muted">
          {label}
        </Text>
        <Button
          variant="text"
          label="Done"
          onPress={() => {
            onChange(startOfDay(shown));
            onClose();
          }}
        />
      </View>
      <DateTimePicker
        value={shown}
        mode="date"
        display="spinner"
        maximumDate={maximum}
        themeVariant="light"
        textColor={color.text.primary}
        onValueChange={(_, date) => {
          if (!date) return;
          setShown(date);
          onChange(startOfDay(date));
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
