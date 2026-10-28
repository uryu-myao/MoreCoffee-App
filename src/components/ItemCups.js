import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { formatDay, partOfDay } from '../constants/dates';
import { cupsForFilter } from '../constants/search';
import { useDatabase } from '../data/DatabaseProvider';
import { listCups, onCupsChanged } from '../data/repository';
import { spacing } from '../theme/tokens';
import Button from './base/Button';
import ItemRow from './base/ItemRow';
import SectionLabel from './base/SectionLabel';
import Text from './base/Text';

/**
 * The bag and gear pages' cup list (Design Round 15, 19a / 19c). It sits
 * above the details: arriving to look means wanting "what came of it"
 * first, and the ~480 form would push it below the fold.
 *
 *   heading  "Cups from this bag · 3" / "Cups with this grinder · 3"; with
 *            no cups, the heading alone (19c)
 *   rows     the latest 5 (ItemRow): date · method as the title (the bean
 *            is the page, so it isn't repeated), the flavour tags, rating
 *            over the part of day. Each opens 2c.
 *   more     past 5, "All N cups ›": search with this bag or gear as a
 *            block, in the archive's shape (18e)
 *   empty    one line, "No cups with this grinder yet.", then "Log a cup
 *            with it ›" (Log a cup with the item preselected), when there is
 *            a way to log one
 *
 * Props: cups (newest first), heading, emptyLine, logLabel, onLog (optional),
 *        onOpen(id), onAll
 */
const ROWS = 5;

/**
 * The cups a search block keeps (bagFilter / gearFilter), newest first,
 * re-read whenever a cup changes. null until read.
 */
export function useFilteredCups(filter) {
  const db = useDatabase();
  const [cups, setCups] = useState(null);
  const { type, value } = filter;
  useEffect(() => {
    let alive = true;
    const load = () =>
      listCups(db).then(
        (all) => alive && setCups(cupsForFilter(all, { type, value })),
        (error) => console.error('[cups] could not read', error)
      );
    load();
    const off = onCupsChanged(load);
    return () => {
      alive = false;
      off();
    };
  }, [db, type, value]);
  return cups;
}

/** A cup's title on its bag's or gear's page: "Apr 8 · V60". */
const rowTitle = (cup) => [formatDay(cup.logged_at), cup.brew_method].filter(Boolean).join(' · ');

export default function ItemCups({ cups, heading, emptyLine, logLabel, onLog, onOpen, onAll }) {
  return (
    <View style={styles.section}>
      <SectionLabel variant="plain" label={cups.length ? `${heading} · ${cups.length}` : heading} />
      {cups.length ? (
        <>
          <View>
            {cups.slice(0, ROWS).map((cup) => (
              <ItemRow
                key={cup.id}
                title={rowTitle(cup)}
                meta={cup.flavours.length ? cup.flavours.join(', ') : undefined}
                rating={cup.rating}
                label={partOfDay(new Date(cup.logged_at))}
                onPress={() => onOpen(cup.id)}
              />
            ))}
          </View>
          {cups.length > ROWS ? (
            <View style={styles.action}>
              <Button variant="text" label={`All ${cups.length} cups`} trailingIcon="chevronRight" onPress={onAll} />
            </View>
          ) : null}
        </>
      ) : (
        <>
          <Text variant="body" color="secondary">
            {emptyLine}
          </Text>
          {onLog ? (
            <View style={styles.action}>
              <Button variant="text" label={logLabel} trailingIcon="chevronRight" onPress={onLog} />
            </View>
          ) : null}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.gap.tight,
  },
  action: {
    alignItems: 'flex-start',
  },
});
