import { StyleSheet, Text, View } from 'react-native';

export default function ScreenFrame({ title, subtitle }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>

      <View style={styles.pageWrap}>
        <Text style={styles.pageSubtitle}>{subtitle}</Text>
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
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fdfaf6',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2f241f',
  },
  pageWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  pageSubtitle: {
    fontSize: 16,
    color: '#75635b',
    textAlign: 'center',
  },
});
