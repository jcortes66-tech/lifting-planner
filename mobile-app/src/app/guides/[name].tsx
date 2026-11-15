import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { EXERCISE_GUIDES } from '@/constants/exercise-guides';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function ExerciseGuideScreen() {
  const theme = useTheme();
  const { name } = useLocalSearchParams<{ name: string }>();
  const decodedName = decodeURIComponent(name ?? '');

  const exercise = EXERCISE_GUIDES.flatMap((group) => group.exercises).find(
    (item) => item.name === decodedName
  );

  if (!exercise) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText themeColor="textSecondary">Exercise not found.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={{ backgroundColor: theme.background }} contentContainerStyle={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.back}>
        <ThemedText type="small" themeColor="textSecondary">
          ‹ Guides
        </ThemedText>
      </Pressable>

      <ThemedText type="displayTitle" style={styles.title}>
        {exercise.name}
      </ThemedText>
      <ThemedText themeColor="textSecondary" style={styles.description}>
        {exercise.description}
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary" style={styles.meta}>
        {exercise.equipment} · {exercise.difficulty} · {exercise.primaryMuscles}
      </ThemedText>

      <ThemedView style={[styles.divider, { backgroundColor: theme.border }]} />

      <ThemedText type="displayTitle" style={styles.sectionHeading}>
        Set up
      </ThemedText>
      {exercise.setup.map((line, i) => (
        <ThemedText key={i} themeColor="textSecondary" style={styles.bullet}>
          •  {line}
        </ThemedText>
      ))}

      <ThemedView style={[styles.divider, { backgroundColor: theme.border }]} />

      <ThemedText type="displayTitle" style={styles.sectionHeading}>
        The movement
      </ThemedText>
      {exercise.movement.map((line, i) => (
        <ThemedView key={i} style={styles.movementRow}>
          <ThemedText type="displayItalic" style={styles.movementNumber}>
            {i + 1}
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.movementText}>
            {line}
          </ThemedText>
        </ThemedView>
      ))}

      <ThemedView style={[styles.divider, { backgroundColor: theme.border }]} />

      <ThemedText type="displayTitle" style={styles.sectionHeading}>
        Common mistakes
      </ThemedText>
      {exercise.commonMistakes.map((line, i) => (
        <ThemedText key={i} themeColor="textSecondary" style={styles.bullet}>
          •  {line}
        </ThemedText>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    paddingTop: Spacing.six,
    paddingHorizontal: Spacing.five,
    paddingBottom: Spacing.six + BottomTabInset,
  },
  back: {
    marginBottom: Spacing.four,
  },
  title: {
    marginBottom: Spacing.two,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: Spacing.two,
  },
  meta: {
    marginBottom: Spacing.four,
  },
  divider: {
    height: 1,
    marginBottom: Spacing.four,
  },
  sectionHeading: {
    fontSize: 28,
    lineHeight: 34,
    marginBottom: Spacing.three,
  },
  bullet: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: Spacing.two,
  },
  movementRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
    marginBottom: Spacing.three,
  },
  movementNumber: {
    fontSize: 32,
    lineHeight: 36,
    width: 32,
  },
  movementText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    marginTop: Spacing.one,
  },
});