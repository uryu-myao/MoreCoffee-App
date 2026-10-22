import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import AddButton from '../components/base/AddButton';
import Badge from '../components/base/Badge';
import Glyph from '../components/base/Glyph';
import IconButton from '../components/base/IconButton';
import PhotoPlaceholder from '../components/base/PhotoPlaceholder';
import Text from '../components/base/Text';
import { GEAR_CATEGORY, GEAR_LIMIT, onCups } from '../constants/gear';
import { useDatabase } from '../data/DatabaseProvider';
import { listGearWithUse, onCupsChanged, onShelfChanged } from '../data/repository';
import { color, icon, layout, size, space, spacing, state } from '../theme/tokens';
import ScreenFrame from './ScreenFrame';

/**
 * 3b — My gear (2026-10-22), from Home's "Manage my gear" (4a) and Profile's
 * My gear row (6a).
 *
 * Header: compact, Back, "N / 8 In my kit" in the stat (3b).
 * A row per piece of gear, defaults first, then oldest added
 * (listGearWithUse): thumbnail, name (title) with a "Default" badge, and
 * "Brewer · used in 2 cups" / "· not used yet" (3b's copy; 4a's shorter
 * "· 2 cups" stays on Home). A kettle or scale is never on a cup, so its
 * line is the category alone, as 4a.
 * The whole row opens 3e, with the row chevron (D-26: no ⋮, no sheet).
 * Pressed: state.pressed.row across the screen's width (out through the
 * gutter, as 3d's "Finished bags").
 * No item dividers (Design Round 9): 3b's 1.5 rule over the first row goes
 * with them.
 * "Add gear" (an AddButton, with "N slots left") → 3a; hidden at 8 / 8, as 3d.
 * The thumbnail is FieldRow's swatch (46); 3b draws 52, which has no token
 * (as 3d, drift D-51).
 */
export function gearLine(g) {
  if (!onCups(g.category)) return GEAR_CATEGORY[g.category];
  return `${GEAR_CATEGORY[g.category]} · ${g.cups ? `used in ${g.cups === 1 ? '1 cup' : `${g.cups} cups`}` : 'not used yet'}`;
}

export default function MyGearScreen({ onBack, onAddGear, onEditGear }) {
  const db = useDatabase();
  const [gear, setGear] = useState(null);

  useEffect(() => {
    const load = () => listGearWithUse(db).then(setGear, (error) => console.error('[3b] could not read gear', error));
    load();
    const offShelf = onShelfChanged(load);
    const offCups = onCupsChanged(load);
    return () => {
      offShelf();
      offCups();
    };
  }, [db]);

  const left = gear ? GEAR_LIMIT - gear.length : 0;
  return (
    <ScreenFrame
      scroll
      compact
      title="My gear"
      leading={<IconButton icon="chevronLeft" accessibilityLabel="Back" onPress={onBack} />}
      stat={gear ? { value: `${gear.length} / ${GEAR_LIMIT}`, label: 'In my kit' } : undefined}>
      <View style={styles.body}>
        <View>
          {(gear ?? []).map((g) => (
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
                <Glyph name="chevronRight" token={icon.md} color={color.icon.default} />
              </View>
            </Pressable>
          ))}
        </View>
        {gear && left > 0 ? <AddButton icon="plus" iconToken={icon.sm} label="Add gear" tag={left === 1 ? '1 slot left' : `${left} slots left`} onPress={onAddGear} /> : null}
      </View>
    </ScreenFrame>
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
