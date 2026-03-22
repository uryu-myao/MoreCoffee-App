import { StyleSheet, Text, View } from 'react-native';

export default function AddCoffeeScreen() {
  return (
    <View style={styles.content}>
      <Text style={styles.title}>AddCoffee</Text>
      <Text style={styles.hint}>Create a new coffee record here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#2f241f',
  },
  hint: {
    marginTop: 10,
    fontSize: 16,
    color: '#75635b',
    textAlign: 'center',
  },
});

