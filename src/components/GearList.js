import { Pressable, StyleSheet, View } from 'react-native';
import AddButton from './base/AddButton';
import Badge from './base/Badge';
import Chevron from './base/Chevron';
import PhotoPlaceholder from './base/PhotoPlaceholder';
import Text from './base/Text';
import { GEAR_CATEGORY, GEAR_LIMIT, onCups } from '../constants/gear';
import { icon, layout, size, space, spacing, state } from '../theme/tokens';

/**
 * 3b's list — the gear side of Gear & beans (Round 14, 17c; 3b's own header
 * went with the merge: its "N / 8 In my kit" is the tab row's slot count).
 *
 * A row per piece of gear, defaults first, then oldest added
 * (listGearWithUse): thumbnail, name (title) with a "Default" badge, and
 * "Brewer · used in 2 cups" / "· not used yet" (3b's copy). A kettle or
 * scale is never on a cup, so its line is the category alone, as 4a.
 * The whole row opens 3e, with the row chevron (D-26: no ⋮, no sheet).
 * Pressed: state.pressed.row across the screen's width (out through the
 * gutter, as 3d's "Finished bags").
 * No item dividers (Design Round 9), and no rule over the first row either:
 * 17c draws one for the tab's underline to land on; on device the rows sit
 * under the underline instead (Uryu, 2026-10-27).
 * "Add gear" (an AddButton, with "N slots left") → 3a; hidden at 8 / 8, as 3d.
 * The thumbnail is FieldRow's swatch (46); 3b draws 52, which has no token
 * (as 3d, drift D-51).
 *
 * Props: gear (listGearWithUse), onAddGear, onEditGear(gear)
 */
export function gearLine(g) {
  if (!onCups(g.category)) return GEAR_CATEGORY[g.category];
  return `${GEAR_CATEGORY[g.category]} · ${g.cups ? `used in ${g.cups === 1 ? '1 cup' : `${g.cups} cups`}` : 'not used yet'}`;
}

export default function GearList({ gear, onAddGear, onEditGear }) {
  const left = GEAR_LIMIT - gear.length;
  return (
    <View style={styles.body}>
      <View>
        {gear.map((g) => (
          <Pressable
            key={g.id}
            onPress={() => onEditGear(g)}
            accessibilityRole="button"
            accessibilityLabel={[g.name, g.is_default ? 'Default' : null, gearLine(g)].filter(Boolean).join(', ')}
            accessibilityHint="Edit name and details"
            style={({ pressed }) => [styles.touch, pressed && styles.pressed]}>
            <View style={styles.row}>
              <PhotoPlaceholder size={size.field.height} />
              <View style={styles.text}>
                <View style={styles.nameRow}>
                  <Text variant="title" truncate="name" style={styles.name}>
                    {g.name}
                  </Text>
                  {g.is_default ? <Badge label="Default" tone="selected" /> : null}
                </View>
                <Text variant="bodySm" color="muted" truncate="meta">
                  {gearLine(g)}
                </Text>
              </View>
              <Chevron />
            </View>
          </Pressable>
        ))}
      </View>
      {left > 0 ? <AddButton icon="plus" iconToken={icon.sm} label="Add gear" tag={left === 1 ? '1 slot left' : `${left} slots left`} onPress={onAddGear} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: space[14],
    // Room under the last block so the bottom bar never covers it (as 2a).
    paddingBottom: layout.empty.block,
  },
  // The touch area spans the screen (out through the gutter, padded back in).
  touch: {
    marginHorizontal: -layout.gutter,
    paddingHorizontal: layout.gutter,
  },
  pressed: {
    backgroundColor: state.pressed.row,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
    paddingVertical: spacing.inset.listRow.v,
  },
  text: {
    flex: 1,
    minWidth: 0,
    gap: spacing.gap.tight,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.gap.row,
  },
  name: {
    flexShrink: 1,
  },
});
