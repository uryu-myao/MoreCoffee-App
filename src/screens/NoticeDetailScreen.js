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

export default function NoticeDetailScreen({ notice, onBack }) {
  if (!notice) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <BackIcon />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{notice.title}</Text>
        {notice.fullBody.split('\n\n').map((paragraph, index) => (
          <Text key={index} style={styles.body}>
            {paragraph}
          </Text>
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
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    backgroundColor: '#fdfaf6',
    borderBottomWidth: 1,
    borderBottomColor: '#e7ded6',
  },
  backBtn: {
    alignSelf: 'flex-start',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing['2xl'],
    paddingBottom: layout.bottomNavHeight,
  },
  title: {
    fontSize: 26,
    fontFamily: typography.family.bold,
    color: colors.brand.green,
    marginBottom: spacing.xl,
    lineHeight: 34,
  },
  body: {
    fontSize: 14,
    fontFamily: typography.family.regular,
    color: colors.text.secondary,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
});
