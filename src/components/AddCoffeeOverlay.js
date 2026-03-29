import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import AddCoffeeScreen from '../screens/AddCoffeeScreen';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function AddCoffeeOverlay({ visible, onClose }) {
  const [mounted, setMounted] = useState(false);
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      translateY.setValue(SCREEN_HEIGHT);
      Animated.timing(translateY, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }).start();
    }
  }, [translateY, visible]);

  const closeWithAnimation = () => {
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: 220,
      useNativeDriver: true,
    }).start(() => {
      setMounted(false);
      onClose();
    });
  };

  if (!mounted) return null;

  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          transform: [{ translateY }],
        },
      ]}>
      <SafeAreaView style={styles.container}>
        <AddCoffeeScreen onClose={closeWithAnimation} />
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    zIndex: 30,
  },
  container: {
    flex: 1,
  },
});
