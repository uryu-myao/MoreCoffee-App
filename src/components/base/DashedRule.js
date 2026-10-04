import { StyleSheet, View } from 'react-native';

/**
 * A horizontal dashed line from a `dashed` token (e.g. dashed.dividerSoft).
 * iOS cannot draw a dashed border on a single side, so a fully dashed box is
 * clipped down to its top edge.
 */
export default function DashedRule({ token }) {
  return (
    <View style={[styles.clip, { height: token.width }]}>
      <View
        style={[
          styles.box,
          { borderWidth: token.width, borderStyle: token.style, borderColor: token.color },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  clip: {
    overflow: 'hidden',
  },
  box: {
    // Tall enough that only the top edge falls inside the clip.
    height: '400%',
  },
});
