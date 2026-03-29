import { StyleSheet, Text, View } from 'react-native';
import { typography } from '../theme/token';

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
    fontFamily: typography.family.bold,
    color: '#2f241f',
  },
  hint: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: typography.family.regular,
    color: '#75635b',
    textAlign: 'center',
  },
});

