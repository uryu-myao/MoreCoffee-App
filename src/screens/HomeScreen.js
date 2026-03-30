import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, spacing, typography } from '../theme/token';
import NoticeDetailScreen from './NoticeDetailScreen';
import NoticeListScreen from './NoticeListScreen';

const INITIAL_NOTICES = [
  {
    id: '1',
    title: "What's New title!",
    body: "Lorem ipsum dolor sit amet consect...Lorem ipsum dolor sit amet consect...",
    fullBody:
      "Lorem ipsum dolor sit amet consectetur. Vulputate euismod iaculis sem egestas leo ultricies viverra sed. In ultricies lacus laoreet aliquet nunc at.\n\nLorem ipsum dolor sit amet consectetur. Vulputate euismod iaculis sem egestas leo ultricies viverra sed. In ultricies lacus laoreet aliquet nunc at nulla iaculis ullamcorper. Sit proin imperdiet faucibus est eget tristique hac amet sed. Luctus nisl aliquet placerat lectus nunc viverra. Arcu nunc nulla ultricies urna blandit. Diam in eget condimentum egestas malesuada tortor in nulla amet. Feugiat convallis platea tellus magna gravida euismod in sit. Eu augue in commodo adipiscing aliquam duis non. Elit hac feugiat diam sapien elementum vel ut.",
    date: 'Apr 2',
    read: false,
  },
  {
    id: '2',
    title: "What's New title!",
    body: 'Lorem ipsum dolor sit amet consect.',
    fullBody:
      "Lorem ipsum dolor sit amet consectetur. Vulputate euismod iaculis sem egestas leo ultricies viverra sed. In ultricies lacus laoreet aliquet nunc at.\n\nLorem ipsum dolor sit amet consectetur. Vulputate euismod iaculis sem egestas leo ultricies viverra sed.",
    date: 'Apr 2',
    read: true,
  },
  {
    id: '3',
    title: "What's New title!",
    body: "Lorem ipsum dolor sit amet consect...Lorem ipsum dolor sit amet consect...",
    fullBody:
      "Lorem ipsum dolor sit amet consectetur. Vulputate euismod iaculis sem egestas leo ultricies viverra sed. In ultricies lacus laoreet aliquet nunc at.\n\nLorem ipsum dolor sit amet consectetur. Vulputate euismod iaculis sem egestas leo ultricies viverra sed. In ultricies lacus laoreet aliquet nunc at nulla iaculis ullamcorper.",
    date: 'Apr 2',
    read: false,
  },
  {
    id: '4',
    title: "What's New title!",
    body: "Lorem ipsum dolor sit amet consect...Lorem ipsum dolor sit amet consect...",
    fullBody:
      "Lorem ipsum dolor sit amet consectetur. Vulputate euismod iaculis sem egestas leo ultricies viverra sed. In ultricies lacus laoreet aliquet nunc at.\n\nLorem ipsum dolor sit amet consectetur.",
    date: 'Apr 2',
    read: true,
  },
  {
    id: '5',
    title: "What's New title!",
    body: "Lorem ipsum dolor sit amet consect...Lorem ipsum dolor sit amet consect...",
    fullBody:
      "Lorem ipsum dolor sit amet consectetur. Vulputate euismod iaculis sem egestas leo ultricies viverra sed. In ultricies lacus laoreet aliquet nunc at.\n\nLorem ipsum dolor sit amet consectetur. Vulputate euismod iaculis sem egestas.",
    date: 'Apr 2',
    read: true,
  },
];

function NoticeIcon() {
  return (
    <Svg width={20} height={21} viewBox="0 0 20 21" fill="none">
      <Path
        d="M1.81771 7.875C1.81771 5.78642 2.67977 3.78338 4.21425 2.30653C5.74872 0.829685 7.82992 0 10 0C12.1701 0 14.2513 0.829685 15.7857 2.30653C17.3202 3.78338 18.1823 5.78642 18.1823 7.875V11.2061L19.9351 15.4254C19.9902 15.5581 20.0107 15.7018 19.9948 15.8439C19.9788 15.9859 19.927 16.1221 19.8437 16.2405C19.7605 16.3588 19.6484 16.4557 19.5173 16.5228C19.3861 16.5898 19.2399 16.6249 19.0914 16.625H0.908568C0.760077 16.6249 0.61387 16.5898 0.482725 16.5228C0.351581 16.4557 0.239492 16.3588 0.156257 16.2405C0.0730222 16.1221 0.0211746 15.9859 0.00524603 15.8439C-0.0106825 15.7018 0.00979303 15.5581 0.0648831 15.4254L1.81771 11.2061V7.875ZM6.47707 18.375C6.67728 19.1273 7.13242 19.7939 7.77047 20.2694C8.40853 20.7448 9.19308 21.0019 10 21C10.8069 21.0019 11.5915 20.7448 12.2295 20.2694C12.8676 19.7939 13.3227 19.1273 13.5229 18.375H6.47707Z"
        fill={colors.brand.green}
      />
    </Svg>
  );
}

export default function HomeScreen() {
  const [view, setView] = useState('home');
  const [notices, setNotices] = useState(INITIAL_NOTICES);
  const [selectedNoticeId, setSelectedNoticeId] = useState(null);

  const unreadCount = notices.filter((n) => !n.read).length;
  const selectedNotice = notices.find((n) => n.id === selectedNoticeId);

  function openNoticeList() {
    setView('notice-list');
  }

  function openNoticeDetail(id) {
    setNotices((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    setSelectedNoticeId(id);
    setView('notice-detail');
  }

  function goBack() {
    if (view === 'notice-detail') {
      setView('notice-list');
    } else {
      setView('home');
    }
  }

  if (view === 'notice-list') {
    return (
      <NoticeListScreen notices={notices} onBack={goBack} onSelectNotice={openNoticeDetail} />
    );
  }

  if (view === 'notice-detail') {
    return <NoticeDetailScreen notice={selectedNotice} onBack={goBack} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Home</Text>
        {/* TODO: v-next — notice entry, unhide when notification system is ready */}
      </View>
      <View style={styles.pageWrap}>
        <Text style={styles.pageSubtitle}>Overview of your coffee activity.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 64,
    borderBottomWidth: 1,
    borderBottomColor: '#e7ded6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    backgroundColor: '#fdfaf6',
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: typography.family.bold,
    color: '#2f241f',
  },
  noticeBtn: {
    position: 'relative',
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E03A3A',
  },
  pageWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  pageSubtitle: {
    fontSize: 16,
    fontFamily: typography.family.regular,
    color: '#75635b',
    textAlign: 'center',
  },
});
