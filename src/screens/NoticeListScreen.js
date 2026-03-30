import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, layout, spacing, typography } from '../theme/token';

function BackIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 38 38" fill="none">
      <Path d="M21.5 11L13.5 19L21.5 27" stroke={colors.brand.green} strokeWidth={4} />
    </Svg>
  );
}

function NoticeItem({ item, onPress }) {
  const isUnread = !item.read;

  return (
    <TouchableOpacity style={styles.item} onPress={() => onPress(item.id)} activeOpacity={0.7}>
      <View style={styles.itemInner}>
        <View style={styles.dotCol}>
          {isUnread && <View style={styles.unreadDot} />}
        </View>
        <View style={styles.itemContent}>
          <View style={styles.itemRow}>
            <Text style={[styles.itemTitle, !isUnread && styles.itemTitleRead]} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.itemDate}>{item.date}</Text>
          </View>
          <Text style={[styles.itemBody, !isUnread && styles.itemBodyRead]} numberOfLines={2}>
            {item.body}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function NoticeListScreen({ notices, onBack, onSelectNotice }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>What's New</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {notices.map((item) => (
          <View key={item.id}>
            <NoticeItem item={item} onPress={onSelectNotice} />
            <View style={styles.divider} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.page,
  },
  header: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    backgroundColor: '#fdfaf6',
    borderBottomWidth: 1,
    borderBottomColor: '#e7ded6',
  },
  backBtn: {
    width: 32,
    alignItems: 'flex-start',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: typography.family.bold,
    color: colors.brand.green,
  },
  headerRight: {
    width: 32,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: layout.bottomNavHeight,
  },
  divider: {
    height: 1,
    backgroundColor: '#e7ded6',
    marginLeft: layout.screenPadding + 20,
  },
  item: {
    paddingVertical: spacing.lg,
    paddingHorizontal: layout.screenPadding,
    backgroundColor: colors.background.page,
  },
  itemInner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  dotCol: {
    width: 20,
    alignItems: 'center',
    paddingTop: 6,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.brand.brown,
  },
  itemContent: {
    flex: 1,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  itemTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: typography.family.bold,
    color: colors.brand.green,
    marginRight: spacing.sm,
  },
  itemTitleRead: {
    color: colors.text.secondary,
  },
  itemDate: {
    fontSize: 13,
    fontFamily: typography.family.regular,
    color: colors.text.muted,
  },
  itemBody: {
    fontSize: 13,
    fontFamily: typography.family.regular,
    color: colors.text.secondary,
    lineHeight: 19,
  },
  itemBodyRead: {
    color: colors.text.muted,
  },
});
