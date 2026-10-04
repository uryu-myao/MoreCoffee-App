import { StyleSheet, View } from 'react-native';

/**
 * Blur-0, isotropic hard shadow (design-system.md §7, OQ-6 resolved).
 * RN shadow props cannot express zero blur on Android, so the shadow is an
 * ink-filled View the size of the element, offset behind it. The child must be
 * opaque and fill this wrapper.
 *
 * Props
 *   shadow   a shadow token ({ offsetX, offsetY, color }) or null for none
 *   style    layout for the wrapper
 */
export default function HardShadow({ shadow, style, children }) {
  return (
    <View style={style}>
      {shadow ? (
        <View
          style={[
            StyleSheet.absoluteFill,
            styles.layer,
            {
              backgroundColor: shadow.color,
              transform: [{ translateX: shadow.offsetX }, { translateY: shadow.offsetY }],
            },
          ]}
        />
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    pointerEvents: 'none',
  },
});
