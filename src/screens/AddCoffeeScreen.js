import { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { colors, radius, shadows, spacing, typography } from '../theme/token';

const SOURCE_OPTIONS = ['Café', 'Home', 'Bottled'];
const WAY_OPTIONS = ['Black', 'with Sugar', 'with Milk', 'Hot', 'Iced', 'with Chocolate'];
const THUMB_SIZE = 36;

function SectionHeader({ label, filled }) {
  return (
    <View style={styles.sectionRow}>
      <View
        style={[
          styles.dot,
          { backgroundColor: filled ? colors.brand.lightBlue : colors.brand.brown },
        ]}
      />
      <Text style={styles.sectionLabel}>{label}</Text>
    </View>
  );
}

function StarRating({ value, onChange }) {
  return (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map(star => (
        <Pressable key={star} onPress={() => onChange(star)} hitSlop={6}>
          <Text style={[styles.star, star <= value && styles.starFilled]}>★</Text>
        </Pressable>
      ))}
    </View>
  );
}

function SliderRow({ leftLabel, rightLabel, value, onChange }) {
  const [trackWidth, setTrackWidth] = useState(0);
  const trackWidthRef = useRef(0);
  const startValRef = useRef(value);
  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        startValRef.current = valueRef.current;
      },
      onPanResponderMove: (_, g) => {
        const range = trackWidthRef.current - THUMB_SIZE;
        if (range <= 0) return;
        const delta = (g.dx / range) * 100;
        const next = Math.round(Math.max(0, Math.min(100, startValRef.current + delta)));
        onChange(next);
      },
    })
  ).current;

  const thumbLeft = trackWidth > 0 ? (value / 100) * (trackWidth - THUMB_SIZE) : 0;
  const fillWidth = Math.max(0, thumbLeft + THUMB_SIZE / 2);

  return (
    <View style={styles.sliderRow}>
      <Text style={styles.sliderLabel}>{leftLabel}</Text>
      <View
        style={styles.sliderTrack}
        onLayout={e => {
          trackWidthRef.current = e.nativeEvent.layout.width;
          setTrackWidth(e.nativeEvent.layout.width);
        }}>
        <View style={styles.sliderTrackBg} />
        <View style={[styles.sliderTrackFill, { width: fillWidth }]} />
        <View
          style={[styles.sliderThumb, { left: thumbLeft }]}
          {...panResponder.panHandlers}>
          <Text style={styles.sliderThumbText}>{value}</Text>
        </View>
      </View>
      <Text style={[styles.sliderLabel, styles.sliderLabelRight]}>{rightLabel}</Text>
    </View>
  );
}

export default function AddCoffeeScreen({ onClose }) {
  const [activeTab, setActiveTab] = useState('quick');

  // Quick log
  const [source, setSource] = useState(null);
  const [coffeeName, setCoffeeName] = useState('');
  const [rating, setRating] = useState(0);
  const [saveAttempted, setSaveAttempted] = useState(false);

  // Tasting note
  const [flavor, setFlavor] = useState({ acid: 50, body: 50, roast: 50 });
  const [ways, setWays] = useState([]);
  const [memo, setMemo] = useState('');

  const quickComplete = source !== null && coffeeName.trim() !== '' && rating > 0;

  function handleQuickSave() {
    if (!quickComplete) {
      setSaveAttempted(true);
      return;
    }
    // TODO: persist record
    onClose?.();
  }

  function handleTastingSave() {
    // TODO: persist tasting note
    onClose?.();
  }

  function toggleWay(way) {
    setWays(prev =>
      prev.includes(way) ? prev.filter(w => w !== way) : [...prev, way]
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Record</Text>
        <Pressable
          style={styles.closeBtn}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close">
          <Text style={styles.closeBtnText}>✕</Text>
        </Pressable>
      </View>

      {/* Tab switcher */}
      <View style={styles.tabRow}>
        <Pressable
          style={[styles.tabBtn, activeTab === 'quick' && styles.tabBtnActive]}
          onPress={() => setActiveTab('quick')}>
          {quickComplete && <View style={styles.tabCheckDot} />}
          <Text style={[styles.tabLabel, activeTab === 'quick' && styles.tabLabelActive]}>
            Quick log
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.tabBtn,
            activeTab === 'tasting' && styles.tabBtnActive,
            !quickComplete && styles.tabBtnLocked,
          ]}
          onPress={() => {
            if (!quickComplete) {
              setSaveAttempted(true);
              return;
            }
            setActiveTab('tasting');
          }}>
          <Text style={[styles.tabLabel, activeTab === 'tasting' && styles.tabLabelActive, !quickComplete && styles.tabLabelLocked]}>
            Tasting note
          </Text>
        </Pressable>
      </View>

      {activeTab === 'quick' ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          {/* Where was it from */}
          <View style={styles.card}>
            <SectionHeader label="Where was it from?" filled={source !== null} />
            <View style={styles.pillsRow}>
              {SOURCE_OPTIONS.map(opt => (
                <Pressable
                  key={opt}
                  style={[styles.pill, source === opt && styles.pillActive]}
                  onPress={() => setSource(prev => (prev === opt ? null : opt))}>
                  <Text style={[styles.pillText, source === opt && styles.pillTextActive]}>
                    {opt}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Coffee name */}
          <View style={styles.card}>
            <SectionHeader label="Coffee name" filled={coffeeName.trim() !== ''} />
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Ethiopia Yirgacheffe"
              placeholderTextColor={colors.text.muted}
              value={coffeeName}
              onChangeText={setCoffeeName}
              returnKeyType="done"
            />
          </View>

          {/* Overall rating */}
          <View style={styles.card}>
            <SectionHeader label="Overall rating" filled={rating > 0} />
            <StarRating value={rating} onChange={setRating} />
          </View>

          {/* Validation warning */}
          {saveAttempted && !quickComplete && (
            <Text style={styles.warningText}>
              Fill in all required fields to save
            </Text>
          )}

          {/* Save button */}
          <Pressable style={styles.saveBtn} onPress={handleQuickSave}>
            <Text style={styles.saveBtnText}>Save</Text>
          </Pressable>

          {/* Continue button */}
          <Pressable
            style={[styles.continueBtn, !quickComplete && styles.continueBtnDisabled]}
            onPress={() => quickComplete && setActiveTab('tasting')}
            disabled={!quickComplete}>
            <Text
              style={[
                styles.continueBtnText,
                !quickComplete && styles.continueBtnTextDisabled,
              ]}>
              Continue to tasting note →
            </Text>
          </Pressable>

          <Text style={styles.footerText}>
            You can update these details anytime.
          </Text>
        </ScrollView>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          {/* Flavor profile */}
          <View style={styles.card}>
            <Text style={styles.cardSectionTitle}>Flavor profile</Text>
            <SliderRow
              leftLabel="Acid"
              rightLabel="Bitter"
              value={flavor.acid}
              onChange={v => setFlavor(f => ({ ...f, acid: v }))}
            />
            <View style={styles.sliderDivider} />
            <SliderRow
              leftLabel="Light body"
              rightLabel="Full body"
              value={flavor.body}
              onChange={v => setFlavor(f => ({ ...f, body: v }))}
            />
            <View style={styles.sliderDivider} />
            <SliderRow
              leftLabel="Light roast"
              rightLabel="Dark roast"
              value={flavor.roast}
              onChange={v => setFlavor(f => ({ ...f, roast: v }))}
            />
          </View>

          {/* How did you have it */}
          <View style={styles.card}>
            <View style={styles.cardTitleRow}>
              <Text style={styles.cardSectionTitle}>How did you have it?</Text>
              <Text style={styles.manageLink}>Manage ways &gt;</Text>
            </View>
            <View style={styles.pillsRow}>
              {WAY_OPTIONS.map(way => (
                <Pressable
                  key={way}
                  style={[styles.pill, ways.includes(way) && styles.pillActive]}
                  onPress={() => toggleWay(way)}>
                  <Text style={[styles.pillText, ways.includes(way) && styles.pillTextActive]}>
                    {way}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Memo */}
          <View style={styles.card}>
            <Text style={styles.cardSectionTitle}>Memo</Text>
            <TextInput
              style={[styles.textInput, styles.memoInput]}
              placeholder="Any thoughts about this coffee…"
              placeholderTextColor={colors.text.muted}
              value={memo}
              onChangeText={setMemo}
              multiline
              returnKeyType="done"
            />
          </View>

          {/* Save button */}
          <Pressable style={styles.saveBtn} onPress={handleTastingSave}>
            <Text style={styles.saveBtnText}>Save</Text>
          </Pressable>

          <Text style={styles.footerText}>
            You can update these details anytime.
          </Text>
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background.page,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    flex: 1,
    fontSize: 22,
    fontFamily: typography.family.bold,
    color: colors.text.primary,
  },
  closeBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 18,
    color: colors.text.secondary,
    fontFamily: typography.family.medium,
  },

  // Tab switcher
  tabRow: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.background.card,
    borderRadius: radius.pill,
    padding: 3,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    gap: 6,
  },
  tabBtnActive: {
    backgroundColor: colors.brand.blue,
  },
  tabLabel: {
    fontSize: 14,
    fontFamily: typography.family.medium,
    color: colors.text.secondary,
  },
  tabLabelActive: {
    color: colors.brand.white,
  },
  tabBtnLocked: {
    opacity: 0.4,
  },
  tabLabelLocked: {
    color: colors.text.muted,
  },
  tabCheckDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.brand.white,
  },

  // Scroll
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: 40,
  },

  // Section header with dot
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sectionLabel: {
    fontSize: 15,
    fontFamily: typography.family.semibold,
    color: colors.text.primary,
  },

  // Card
  card: {
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.card,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  // Pills
  pill: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.border.default,
  },
  pillActive: {
    borderColor: colors.brand.blue,
    backgroundColor: '#EBF5FC',
  },
  pillText: {
    fontSize: 14,
    fontFamily: typography.family.medium,
    color: colors.text.secondary,
  },
  pillTextActive: {
    color: colors.brand.blue,
  },

  // Text input
  textInput: {
    fontSize: 15,
    fontFamily: typography.family.regular,
    color: colors.text.primary,
    backgroundColor: colors.brand.cream,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  memoInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },

  // Stars
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  star: {
    fontSize: 32,
    color: colors.border.default,
  },
  starFilled: {
    color: colors.brand.gold,
  },

  // Warning
  warningText: {
    marginTop: spacing.md,
    fontSize: 13,
    fontFamily: typography.family.regular,
    color: colors.brand.brown,
    textAlign: 'center',
  },

  // Save button
  saveBtn: {
    marginTop: spacing.xl,
    backgroundColor: colors.brand.blue,
    borderRadius: radius.pill,
    paddingVertical: spacing.md + 2,
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: 16,
    fontFamily: typography.family.semibold,
    color: colors.brand.white,
  },

  // Continue button
  continueBtn: {
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  continueBtnDisabled: {
    opacity: 0.35,
  },
  continueBtnText: {
    fontSize: 14,
    fontFamily: typography.family.medium,
    color: colors.brand.blue,
  },
  continueBtnTextDisabled: {
    color: colors.text.muted,
  },

  // Footer
  footerText: {
    marginTop: spacing.lg,
    fontSize: 12,
    fontFamily: typography.family.regular,
    color: colors.text.muted,
    textAlign: 'center',
  },

  // Tasting note
  cardSectionTitle: {
    marginBottom: spacing.md,
    fontSize: 15,
    fontFamily: typography.family.semibold,
    color: colors.text.primary,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  manageLink: {
    fontSize: 12,
    fontFamily: typography.family.regular,
    color: colors.text.link,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  sliderLabel: {
    width: 60,
    fontSize: 11,
    fontFamily: typography.family.regular,
    color: colors.text.muted,
  },
  sliderLabelRight: {
    textAlign: 'right',
  },
  sliderTrack: {
    flex: 1,
    height: THUMB_SIZE,
    justifyContent: 'center',
  },
  sliderTrackBg: {
    position: 'absolute',
    left: THUMB_SIZE / 2,
    right: THUMB_SIZE / 2,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border.default,
  },
  sliderTrackFill: {
    position: 'absolute',
    left: THUMB_SIZE / 2,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.brand.blue,
  },
  sliderThumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: colors.brand.blue,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  sliderThumbText: {
    fontSize: 11,
    fontFamily: typography.family.semibold,
    color: colors.brand.white,
  },
  sliderDivider: {
    height: 1,
    backgroundColor: colors.background.page,
    marginVertical: spacing.xs,
  },
});
