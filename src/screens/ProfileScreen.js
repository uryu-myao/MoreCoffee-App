import { useRef, useState } from 'react';
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, radius, spacing, typography } from '../theme/token';
import {
  ArrowListIcon,
  CoffeeDonateIcon,
  CsvIcon,
  EditAvatarIcon,
  ExternalLinkIcon,
  FeedbackIcon,
  PolicyIcon,
  RateIcon,
  ReportIcon,
  ShareAppIcon,
} from '../components/icons/ProfileIcons';

const AVATAR = require('../assets/icons/icon-avatar-default.png');
const APP_ICON = require('../../assets/icon.png');

export default function ProfileScreen() {
  const [username, setUsername] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  function handleSave(name) {
    setUsername(name);
    setShowEditModal(false);
  }

  const displayName = username || 'Edit profile';
  const isLoggedIn = !!username;

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [56, 48],
    extrapolate: 'clamp',
  });
  const solidBgOpacity = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  const blurBgOpacity = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const borderOpacity = scrollY.interpolate({
    inputRange: [0, 40],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  const titleFontSize = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [24, 18],
    extrapolate: 'clamp',
  });
  const titlePaddingBottom = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [8, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.screen}>
      <Animated.View style={[styles.headerContainer, { height: headerHeight }]}>
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            styles.solidBackground,
            { opacity: solidBgOpacity },
          ]}
        />
        <Animated.View
          style={[StyleSheet.absoluteFillObject, { opacity: blurBgOpacity }]}>
          <BlurView
            intensity={60}
            tint="light"
            style={StyleSheet.absoluteFillObject}
          />
          <View style={[StyleSheet.absoluteFillObject, styles.blurTint]} />
        </Animated.View>
        <Animated.View
          style={[styles.bottomBorder, { opacity: borderOpacity }]}
        />
        <Animated.View
          style={[styles.headerContent, { paddingBottom: titlePaddingBottom }]}>
          <Animated.Text
            style={[styles.headerTitle, { fontSize: titleFontSize }]}
            numberOfLines={1}>
            Profile
          </Animated.Text>
        </Animated.View>
      </Animated.View>

      <Animated.ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}>
        <UserCard
          isLoggedIn={isLoggedIn}
          displayName={displayName}
          onEdit={() => setShowEditModal(true)}
        />

        <View style={styles.sections}>
          <MenuSection title="Data">
            <MenuItem icon={<CsvIcon />} label="Export by CSV" type="arrow" />
          </MenuSection>

          <MenuSection title="Help & Feedback">
            <MenuItem
              icon={<FeedbackIcon />}
              label="Send Feedback"
              type="external"
            />
            <MenuItem
              icon={<ReportIcon />}
              label="Report a problem"
              type="external"
            />
          </MenuSection>

          <MenuSection title="Support Us">
            <MenuItem
              icon={<RateIcon />}
              label="Rate MoreCoffee"
              type="arrow"
            />
            <MenuItem
              icon={<ShareAppIcon />}
              label="Share the App"
              type="arrow"
            />
            <MenuItem
              icon={<CoffeeDonateIcon />}
              label="Buy me a coffee"
              type="external"
            />
          </MenuSection>

          <MenuSection title="Legal">
            <MenuItem
              icon={<PolicyIcon />}
              label="Privacy policy"
              type="external"
            />
          </MenuSection>
        </View>

        <Text style={styles.joinLink}>Join MoreCoffee 21 days</Text>

        <View style={styles.appFooter}>
          <Image source={APP_ICON} style={styles.logoSmall} />
          <Text style={styles.tagline}>
            {'Made with passion\nfor coffee life!'}
          </Text>
          <Text style={styles.version}>Version 1.0.0</Text>
          <Text style={styles.copyright}>Copyright 2026 MoreCoffee</Text>
        </View>
      </Animated.ScrollView>

      {showEditModal && (
        <Modal
          visible
          transparent
          animationType="fade"
          onRequestClose={() => setShowEditModal(false)}>
          <EditProfileModal
            initialName={username}
            onSave={handleSave}
            onClose={() => setShowEditModal(false)}
          />
        </Modal>
      )}
    </View>
  );
}

// ─── User card ────────────────────────────────────────────────────────────────

function UserCard({ isLoggedIn, displayName, onEdit }) {
  return (
    <View style={styles.userCard}>
      <Pressable onPress={onEdit} style={styles.avatarWrap}>
        <Image source={AVATAR} style={styles.avatar} />
      </Pressable>
      <Pressable onPress={onEdit}>
        <Text style={[styles.userName, !isLoggedIn && styles.userNameEdit]}>
          {displayName}
        </Text>
      </Pressable>
      <Text style={styles.flavourLabel}>Flavour profile</Text>

      {isLoggedIn ? (
        <>
          <View style={styles.tagsRow}>
            <FlavorTag label="Medium to Dark" />
            <FlavorTag label="Balance" />
            <FlavorTag label="Bitter" />
          </View>
          <View style={styles.statsRow}>
            <StatBox value="120" label="cups total" />
            <StatBox value="8" label="this week" />
            <StatBox value="2" label="day streak" />
          </View>
        </>
      ) : (
        <>
          <View style={styles.tagsRow}>
            <View style={styles.emptyTag}>
              <Text style={styles.emptyTagText}>
                Record coffee to get flavor tag
              </Text>
            </View>
          </View>
          <Pressable style={styles.recordButton} onPress={onEdit}>
            <Text style={styles.recordButtonText}>+ Record coffee</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

// ─── Card sub-components ─────────────────────────────────────────────────────

function FlavorTag({ label }) {
  return (
    <View style={styles.flavorTag}>
      <Text style={styles.flavorTagText}>{label}</Text>
    </View>
  );
}

function StatBox({ value, label }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// ─── Menu ────────────────────────────────────────────────────────────────────

function MenuSection({ title, children }) {
  return (
    <View style={styles.menuSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function MenuItem({ icon, label, type }) {
  return (
    <Pressable style={styles.listItem}>
      <View style={styles.listIcon}>{icon}</View>
      <Text style={styles.listLabel}>{label}</Text>
      {type === 'arrow' ? <ArrowListIcon /> : <ExternalLinkIcon />}
    </Pressable>
  );
}

// ─── Edit profile modal ───────────────────────────────────────────────────────

function EditProfileModal({ initialName, onSave, onClose }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(initialName);
  const inputRef = useRef(null);

  function handleTitlePress() {
    setIsEditing(true);
  }

  function handleSave() {
    onSave(draftName.trim());
  }

  return (
    <KeyboardAvoidingView
      style={styles.modalOverlay}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.modalCard}>
        <View style={styles.modalAvatarWrap}>
          <Image source={AVATAR} style={styles.modalAvatar} />
          <View style={styles.editAvatarBadge}>
            <EditAvatarIcon />
          </View>
        </View>

        {isEditing ? (
          <TextInput
            ref={inputRef}
            style={styles.modalTitleInput}
            value={draftName}
            onChangeText={setDraftName}
            placeholder="Enter username"
            placeholderTextColor={FLAVOUR_LABEL_COLOR}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleSave}
          />
        ) : (
          <Pressable onPress={handleTitlePress}>
            <Text style={styles.modalTitle}>{draftName || 'Edit profile'}</Text>
          </Pressable>
        )}

        <Text style={styles.modalDesc}>
          You can change your avatar and username{'\n'}at any time.
        </Text>
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>save</Text>
        </Pressable>
        <Pressable onPress={onClose} style={styles.cancelWrap}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const STAT_BORDER = 'rgba(39, 61, 34, 0.10)';
const SECTION_TITLE_COLOR = 'rgba(39, 61, 34, 0.35)';
const FLAVOUR_LABEL_COLOR = 'rgba(39, 61, 34, 0.20)';
const FOOTER_MUTED = 'rgba(39, 61, 34, 0.35)';
const FOOTER_VERY_MUTED = 'rgba(39, 61, 34, 0.20)';

const styles = StyleSheet.create({
  // Screen
  screen: {
    flex: 1,
    backgroundColor: colors.background.page,
  },
  headerContainer: {
    width: '100%',
    overflow: 'hidden',
    zIndex: 10,
  },
  solidBackground: {
    backgroundColor: colors.background.page,
  },
  blurTint: {
    backgroundColor:
      Platform.OS === 'android'
        ? 'rgba(243, 238, 234, 0.92)'
        : 'rgba(243, 238, 234, 0.55)',
  },
  bottomBorder: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#E8E8E8',
  },
  headerContent: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.lg,
  },
  headerTitle: {
    fontFamily: typography.family.bold,
    color: colors.text.primary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: spacing.lg,
    paddingBottom: spacing['3xl'],
  },

  // User card
  userCard: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    alignItems: 'center',
  },
  avatarWrap: {
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userName: {
    fontSize: typography.size.xl,
    lineHeight: 34,
    fontFamily: typography.family.bold,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  userNameEdit: {
    color: colors.brand.green,
  },
  flavourLabel: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.medium,
    color: FLAVOUR_LABEL_COLOR,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },

  // Flavor tags
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  flavorTag: {
    backgroundColor: colors.background.page,
    paddingHorizontal: 10,
    height: 24,
    borderRadius: radius.pill,
    justifyContent: 'center',
  },
  flavorTagText: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.bold,
    color: colors.brand.gold,
  },
  emptyTag: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.brand.gold,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: colors.background.page,
    marginBottom: spacing.md,
  },
  emptyTagText: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.medium,
    color: colors.brand.gold,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    width: '100%',
  },
  statBox: {
    flex: 1,
    height: 80,
    borderWidth: 1,
    borderColor: STAT_BORDER,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  statValue: {
    fontSize: typography.size.xl,
    fontFamily: typography.family.bold,
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.medium,
    color: colors.text.primary,
    textAlign: 'center',
  },

  // Record coffee button (not-logged state)
  recordButton: {
    width: '100%',
    height: 36,
    backgroundColor: colors.brand.blue,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  recordButtonText: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.bold,
    color: colors.brand.white,
  },

  // Menu sections
  sections: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing['2xl'],
    gap: spacing.lg,
  },
  menuSection: {
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.bold,
    color: SECTION_TITLE_COLOR,
  },
  listItem: {
    height: 50,
    backgroundColor: colors.background.card,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    marginBottom: 0,
  },
  listIcon: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  listLabel: {
    flex: 1,
    fontSize: typography.size.sm,
    fontFamily: typography.family.medium,
    color: colors.text.primary,
  },

  // Join link
  joinLink: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.bold,
    color: colors.brand.blue,
    textAlign: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing['3xl'],
  },

  // App footer
  appFooter: {
    alignItems: 'center',
    gap: spacing.xs,
    paddingBottom: spacing.lg,
  },
  logoSmall: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginBottom: spacing.sm,
  },
  tagline: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.bold,
    color: FOOTER_MUTED,
    textAlign: 'center',
    lineHeight: 16,
  },
  version: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.medium,
    color: FOOTER_MUTED,
    textAlign: 'center',
  },
  copyright: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.medium,
    color: FOOTER_VERY_MUTED,
    textAlign: 'center',
  },

  // Edit profile modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.30)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['3xl'],
  },
  modalCard: {
    width: 328,
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing['2xl'],
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },
  modalAvatarWrap: {
    marginBottom: spacing.lg,
  },
  modalAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editAvatarBadge: {
    position: 'absolute',
    width: 32,
    height: 32,
    right: -4,
    bottom: -4,
  },
  modalTitle: {
    fontSize: typography.size.xl,
    fontFamily: typography.family.bold,
    lineHeight: 34,
    color: colors.brand.lightBlue,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  modalTitleInput: {
    fontSize: typography.size.xl,
    fontFamily: typography.family.bold,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.brand.blue,
    paddingBottom: spacing.xs,
    minWidth: 200,
  },
  modalDesc: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.medium,
    color: colors.text.primary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: spacing.lg,
  },
  saveButton: {
    width: '100%',
    height: 36,
    backgroundColor: colors.brand.blue,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  saveButtonText: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.bold,
    color: colors.brand.white,
  },
  cancelWrap: {
    paddingVertical: spacing.xs,
  },
  cancelText: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.bold,
    color: colors.brand.blue,
    textAlign: 'center',
  },
});
