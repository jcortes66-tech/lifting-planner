import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { EXERCISE_GUIDES } from '@/constants/exercise-guides';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function GuidesIndexScreen() {
  const theme = useTheme();

  return (
    <ScrollView style={{ backgroundColor: theme.background }} contentContainerStyle={styles.container}>
      <ThemedText type="eyebrow" themeColor="textSecondary">
        How To
      </ThemedText>
      <ThemedText style={styles.title}>
        <ThemedText type="displayTitle">Exercise </ThemedText>
        <ThemedText type="displayItalic" themeColor="textSecondary">
          guides
        </ThemedText>
      </ThemedText>

      {EXERCISE_GUIDES.map((group) => (
        <ThemedView key={group.muscleGroup} style={styles.group}>
          <ThemedText type="eyebrow" themeColor="textSecondary" style={styles.groupLabel}>
            {group.muscleGroup}
          </ThemedText>

          {group.exercises.map((exercise) => (
            <Pressable
              key={exercise.name}
              onPress={() => router.push(`/guides/${encodeURIComponent(exercise.name)}`)}
              style={[styles.row, { borderBottomColor: theme.border }]}>
              <ThemedText type="default">{exercise.name}</ThemedText>
              <ThemedText themeColor="textSecondary">›</ThemedText>
            </Pressable>
          ))}
        </ThemedView>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Spacing.six,
    paddingHorizontal: Spacing.five,
    paddingBottom: Spacing.six + BottomTabInset,
  },
  title: {
    marginBottom: Spacing.five,
  },
  group: {
    marginBottom: Spacing.four,
  },
  groupLabel: {
    marginBottom: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingVertical: Spacing.three,
  },
});