import { useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import SegmentedControl from '../components/SegmentedControl';
import {
  colors,
  layout,
  radius,
  shadows,
  spacing,
  typography,
} from '../theme/token';

const CATEGORIES = ['All', 'Café', 'Home', 'Bottled'];
const SORT_OPTIONS = ['Date', 'Rating', 'Name', 'Type'];

const MOCK_RECORDS = [
  {
    id: '1',
    name: 'Drip Coffee',
    date: 'Apr 2',
    category: 'Café',
    tags: ['Black', 'Iced'],
    rating: 4,
    flavor: { acid: 60, body: 40, roast: 70 },
  },
  {
    id: '2',
    name: 'Drip Coffee',
    date: 'Apr 2',
    category: 'Café',
    tags: ['Black'],
    rating: 4,
    flavor: { acid: 30, body: 70, roast: 50 },
  },
  {
    id: '3',
    name: 'Ethiopia Yirgacheffe',
    date: 'Apr 1',
    category: 'Home',
    tags: ['with Sugar', 'Hot', 'Chemex'],
    rating: 5,
    flavor: { acid: 80, body: 30, roast: 20 },
  },
  {
    id: '4',
    name: 'Blue Bottle Latte',
    date: 'Mar 30',
    category: 'Bottled',
    tags: ['with Milk'],
    rating: 3,
    flavor: { acid: 40, body: 60, roast: 60 },
  },
  {
    id: '5',
    name: 'Flat White',
    date: 'Mar 28',
    category: 'Café',
    tags: ['with Milk', 'Hot', 'with Sugar'],
    rating: 5,
    flavor: { acid: 45, body: 75, roast: 55 },
  },
  {
    id: '6',
    name: 'Colombia Huila',
    date: 'Mar 25',
    category: 'Home',
    tags: ['Black'],
    rating: 4,
    flavor: { acid: 70, body: 50, roast: 40 },
  },
];

function SearchIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 21 21" fill="none">
      <Path
        d="M18.5 18.5L13.5 13.5M1.5 8.5C1.5 9.41925 1.68106 10.3295 2.03284 11.1788C2.38463 12.0281 2.90024 12.7997 3.55025 13.4497C4.20026 14.0998 4.97194 14.6154 5.82122 14.9672C6.6705 15.3189 7.58075 15.5 8.5 15.5C9.41925 15.5 10.3295 15.3189 11.1788 14.9672C12.0281 14.6154 12.7997 14.0998 13.4497 13.4497C14.0998 12.7997 14.6154 12.0281 14.9672 11.1788C15.3189 10.3295 15.5 9.41925 15.5 8.5C15.5 7.58075 15.3189 6.6705 14.9672 5.82122C14.6154 4.97194 14.0998 4.20026 13.4497 3.55025C12.7997 2.90024 12.0281 2.38463 11.1788 2.03284C10.3295 1.68106 9.41925 1.5 8.5 1.5C7.58075 1.5 6.6705 1.68106 5.82122 2.03284C4.97194 2.38463 4.20026 2.90024 3.55025 3.55025C2.90024 4.20026 2.38463 4.97194 2.03284 5.82122C1.68106 6.6705 1.5 7.58075 1.5 8.5Z"
        stroke={colors.text.primary}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ThumbnailPlaceholder() {
  return (
    <View style={styles.thumbnail}>
      <Text style={styles.thumbnailEmoji}>☕</Text>
    </View>
  );
}

function StarRow({ rating }) {
  return (
    <View style={styles.starRow}>
      <Text style={styles.starMiniActive}>★</Text>
      <Text style={styles.starRatingNum}>{rating}</Text>
    </View>
  );
}

function FlavorMini({ acid, body, roast }) {
  return (
    <View style={styles.flavorMini}>
      {[acid, body, roast].map((val, i) => (
        <View key={i} style={styles.flavorBarTrack}>
          <View style={[styles.flavorBarFill, { width: `${val}%` }]} />
        </View>
      ))}
    </View>
  );
}

// Category tag (blue) + up to 2 secondary tags (lightBlue), then "…" if more
function TagRow({ category, tags }) {
  const MAX_SECONDARY = 2;
  const visible = tags.slice(0, MAX_SECONDARY);
  const hasMore = tags.length > MAX_SECONDARY;

  return (
    <View style={styles.tagRow}>
      <View style={[styles.tagChip, styles.tagChipPrimary]}>
        <Text style={[styles.tagText, styles.tagTextPrimary]}>{category}</Text>
      </View>
      {visible.map((t, i) => (
        <View key={i} style={[styles.tagChip, styles.tagChipSecondary]}>
          <Text style={[styles.tagText, styles.tagTextSecondary]}>{t}</Text>
        </View>
      ))}
      {hasMore && (
        <View style={[styles.tagChip, styles.tagChipSecondary]}>
          <Text style={[styles.tagText, styles.tagTextSecondary]}>…</Text>
        </View>
      )}
    </View>
  );
}

function RecordRow({ item }) {
  return (
    <TouchableOpacity style={styles.recordCard} activeOpacity={0.75}>
      <ThumbnailPlaceholder />
      <View style={styles.recordMid}>
        <Text style={styles.recordName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.recordDate}>{item.date}</Text>
        <TagRow category={item.category} tags={item.tags} />
      </View>
      <View style={styles.recordRight}>
        <StarRow rating={item.rating} />
        <FlavorMini
          acid={item.flavor.acid}
          body={item.flavor.body}
          roast={item.flavor.roast}
        />
      </View>
    </TouchableOpacity>
  );
}

export default function CoffeeListScreen() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Date');
  const [sortOpen, setSortOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
  const sortBtnRef = useRef(null);

  const filtered = useMemo(() => {
    const base =
      activeCategory === 'All'
        ? MOCK_RECORDS
        : MOCK_RECORDS.filter((r) => r.category === activeCategory);

    return [...base].sort((a, b) => {
      switch (sortBy) {
        case 'Rating':
          return b.rating - a.rating;
        case 'Name':
          return a.name.localeCompare(b.name);
        case 'Type':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });
  }, [activeCategory, sortBy]);

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Records</Text>
        <TouchableOpacity style={styles.searchBtn} activeOpacity={0.7}>
          <SearchIcon />
        </TouchableOpacity>
      </View>

      {/* Category tabs */}
      <View style={styles.categoryRow}>
        <SegmentedControl
          options={CATEGORIES}
          value={activeCategory}
          onChange={setActiveCategory}
        />
      </View>

      {/* Stats + sort */}
      <View style={styles.statsBar}>
        <Text style={styles.statsCount}>
          <Text style={styles.statsNum}>{filtered.length}</Text> logs
        </Text>
        <TouchableOpacity
          ref={sortBtnRef}
          style={styles.sortBtn}
          onPress={() => {
            if (sortOpen) {
              setSortOpen(false);
              return;
            }
            sortBtnRef.current.measure((_x, _y, _w, h, _px, py) => {
              setDropdownPos({ top: py + h + 4, right: spacing.lg });
              setSortOpen(true);
            });
          }}
          activeOpacity={0.75}>
          <Text style={styles.sortBtnText}>{sortBy}</Text>
          <Text style={styles.sortArrow}>▾</Text>
        </TouchableOpacity>
      </View>

      {/* Record list */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RecordRow item={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Sort dropdown — rendered above FlatList */}
      {sortOpen && (
        <>
          <Pressable
            style={styles.dropdownBackdrop}
            onPress={() => setSortOpen(false)}
          />
          <View
            style={[
              styles.sortDropdown,
              { top: dropdownPos.top, right: dropdownPos.right },
            ]}>
            {SORT_OPTIONS.map((opt) => (
              <Pressable
                key={opt}
                style={[
                  styles.sortOption,
                  opt === sortBy && styles.sortOptionActive,
                ]}
                onPress={() => {
                  setSortBy(opt);
                  setSortOpen(false);
                }}>
                <Text
                  style={[
                    styles.sortOptionText,
                    opt === sortBy && styles.sortOptionTextActive,
                  ]}>
                  {opt}
                </Text>
              </Pressable>
            ))}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background.page,
  },

  // Header
  header: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: '#e7ded6',
    backgroundColor: '#fdfaf6',
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: typography.family.bold,
    color: '#2f241f',
  },
  searchBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Category tabs
  categoryRow: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: '#fdfaf6',
    borderBottomWidth: 1,
    borderBottomColor: '#e7ded6',
  },

  // Stats + sort bar
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
  },
  statsCount: {
    fontSize: 16,
    fontFamily: typography.family.semibold,
    color: colors.text.muted,
  },
  statsNum: {
    fontFamily: typography.family.semibold,
    color: colors.text.secondary,
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.background.card,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  sortBtnText: {
    fontSize: 13,
    fontFamily: typography.family.medium,
    color: colors.text.secondary,
  },
  sortArrow: {
    fontSize: 10,
    color: colors.text.muted,
  },
  dropdownBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sortDropdown: {
    position: 'absolute',
    backgroundColor: colors.background.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border.default,
    minWidth: 108,
    ...shadows.card,
  },
  sortOption: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  sortOptionActive: {
    backgroundColor: '#EBF5FC',
  },
  sortOptionText: {
    fontSize: 13,
    fontFamily: typography.family.regular,
    color: colors.text.secondary,
  },
  sortOptionTextActive: {
    color: colors.brand.blue,
    fontFamily: typography.family.medium,
  },

  // List
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: layout.bottomNavHeight + spacing.lg,
  },

  // Record card
  recordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: radius.md,
    padding: spacing.xs,
    marginBottom: spacing.sm + 2,
    gap: spacing.md,
    ...shadows.card,
  },

  // Thumbnail
  thumbnail: {
    width: 90,
    height: 90,
    borderRadius: radius.sm,
    backgroundColor: colors.brand.cream,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  thumbnailEmoji: {
    fontSize: 22,
  },

  // Record middle
  recordMid: {
    flex: 1,
    gap: 3,
    overflow: 'hidden',
  },
  recordName: {
    fontSize: 16,
    fontFamily: typography.family.semibold,
    color: colors.text.primary,
  },
  recordDate: {
    fontSize: 12,
    fontFamily: typography.family.regular,
    color: colors.text.muted,
    marginBottom: spacing.sm,
  },

  // Tags
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: 4,
    overflow: 'hidden',
  },
  tagChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
    flexShrink: 0,
  },
  tagChipPrimary: {
    backgroundColor: colors.brand.blue,
  },
  tagChipSecondary: {
    backgroundColor: colors.brand.lightBlue,
  },
  tagText: {
    fontSize: 12,
    fontFamily: typography.family.medium,
  },
  tagTextPrimary: {
    color: colors.brand.white,
  },
  tagTextSecondary: {
    color: colors.text.secondary,
  },

  // Record right column
  recordRight: {
    alignItems: 'flex-end',
    gap: 6,
    flexShrink: 0,
  },

  // Rating display
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  starMiniActive: {
    fontSize: 12,
    color: colors.brand.gold,
  },
  starRatingNum: {
    fontSize: 12,
    fontFamily: typography.family.semibold,
    color: colors.text.secondary,
  },

  // Mini flavor bars
  flavorMini: {
    width: 48,
    gap: 3,
  },
  flavorBarTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border.default,
    overflow: 'hidden',
  },
  flavorBarFill: {
    height: '100%',
    backgroundColor: colors.brand.brown,
    borderRadius: 2,
  },
});
