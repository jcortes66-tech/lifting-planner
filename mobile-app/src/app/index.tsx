import { Image } from 'expo-image';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { API_BASE_URL } from '@/constants/api';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { GOALS_KEY } from '@/constants/profile-options';
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/hooks/use-theme';


// A new quote each day, cycling through the list
const QUOTES = [
  "Discipline is choosing between what you want now and what you want most.",
  "The only bad workout is the one that didn't happen.",
  "Strength grows in the moments you don't think you can go on.",
  "Small, consistent effort compounds into real progress.",
  "You don't have to be great to start, but you have to start to be great.",
  'Progress, not perfection.',
  "The weight doesn't care about your excuses — show up anyway.",
  'Every rep is a vote for the person you want to become.',
  'Consistency beats intensity in the long run.',
  'Your only competition is who you were yesterday.',
];

function getQuoteOfTheDay() {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const diff = Date.now() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return QUOTES[dayOfYear % QUOTES.length];
}

// Matches the shape returned by GET /api/logs in backend/index.js.
type LoggedSet = {
  id: number;
  exercise_name: string;
  weight: number;
  reps: number;
  rpe: number | null;
  logged_at: string;
};

export default function OverviewScreen() {
  const theme = useTheme();
  const { token, logout } = useAuth();

  const [logs, setLogs] = useState<LoggedSet[]>([]);
  const [loading, setLoading] = useState(true);

  const [goals, setGoals] = useState('');
  const [savedGoals, setSavedGoals] = useState('');
  // Whether the Goals box is showing the editable text field (true) or
  // the saved goals as a bulleted list with an Edit button (false).
  const [isEditingGoals, setIsEditingGoals] = useState(false);

  const quote = useMemo(() => getQuoteOfTheDay(), []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/logs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 401) {
          await logout();
          return;
        }
        if (response.ok && !cancelled) {
          setLogs(await response.json());
        }
      } catch {
        // If the server's unreachable show zeros instead of an error message.
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [token, logout]);

  useEffect(() => {
    SecureStore.getItemAsync(GOALS_KEY).then((saved) => {
      setGoals(saved ?? '');
      setSavedGoals(saved ?? '');
      // Start in edit mode only if there's nothing saved yet.
      setIsEditingGoals(!saved);
    });
  }, []);

  const handleSaveGoals = async () => {
    await SecureStore.setItemAsync(GOALS_KEY, goals);
    setSavedGoals(goals);
    setIsEditingGoals(false);
  };

  const goalLines = useMemo(
    () =>
      goals
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0),
    [goals]
  );

  const liftsLogged = logs.length;

  const trainingDays = useMemo(() => {
    return new Set(logs.map((log) => log.logged_at.slice(0, 10))).size;
  }, [logs]);

  const topSets = useMemo(() => {
    return [...logs].sort((a, b) => b.weight - a.weight).slice(0, 5);
  }, [logs]);

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator color={theme.text} />
      </ThemedView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        style={{ backgroundColor: theme.background }}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled">
        <ThemedText type="eyebrow" themeColor="textSecondary">
          Your Training Journal
        </ThemedText>
        <ThemedText style={styles.title}>
          <ThemedText type="displayTitle">The art of </ThemedText>
          <ThemedText type="displayItalic" themeColor="textSecondary">
            showing up.
          </ThemedText>
        </ThemedText>

        <ThemedText type="displayItalic" themeColor="textSecondary" style={styles.quote}>
          {quote}
        </ThemedText>

        <Image source={require('@/assets/images/hero.png')} style={styles.hero} contentFit="cover" />

        <ThemedView style={[styles.statsRow, { borderColor: theme.border }]}>
          <ThemedView style={styles.statTile}>
            <ThemedText type="displayTitle" style={styles.statNumber}>
              {liftsLogged}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Lifts Logged
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.statTile}>
            <ThemedText type="displayTitle" style={styles.statNumber}>
              {trainingDays}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Training Days
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedText type="eyebrow" themeColor="textSecondary" style={styles.sectionLabel}>
          Personal Bests
        </ThemedText>
        <ThemedText style={styles.sectionTitle}>
          <ThemedText type="displayTitle">Top 5 </ThemedText>
          <ThemedText type="displayItalic" themeColor="textSecondary">
            heaviest sets
          </ThemedText>
        </ThemedText>

        {topSets.length === 0 ? (
          <ThemedText themeColor="textSecondary" style={styles.empty}>
            Log your first set to start seeing your personal bests here.
          </ThemedText>
        ) : (
          topSets.map((set) => (
            <ThemedView key={set.id} style={[styles.row, { borderBottomColor: theme.border }]}>
              <ThemedText type="smallBold">{set.exercise_name}</ThemedText>
              <ThemedText themeColor="textSecondary">
                {set.weight} lbs × {set.reps} reps
                {set.rpe != null ? ` · RPE ${set.rpe}` : ''}
              </ThemedText>
            </ThemedView>
          ))
        )}

        <View style={styles.goalsHeader}>
          <View>
            <ThemedText type="eyebrow" themeColor="textSecondary" style={styles.sectionLabel}>
              What Matters
            </ThemedText>
            <ThemedText style={styles.sectionTitle}>
              <ThemedText type="displayTitle">Your </ThemedText>
              <ThemedText type="displayItalic" themeColor="textSecondary">
                goals
              </ThemedText>
            </ThemedText>
          </View>
        </View>

        {isEditingGoals ? (
          <>
            <TextInput
              value={goals}
              onChangeText={setGoals}
              multiline
              placeholder="What are you training toward? Add one goal per line."
              placeholderTextColor={theme.textSecondary}
              style={[
                styles.goalsInput,
                { color: theme.text, backgroundColor: theme.background, borderColor: theme.border },
              ]}
            />
            <Pressable
              onPress={handleSaveGoals}
              disabled={goals === savedGoals}
              style={[styles.button, { backgroundColor: theme.text, opacity: goals === savedGoals ? 0.5 : 1 }]}>
              <ThemedText themeColor="background" type="smallBold">
                {goals === savedGoals ? 'Saved' : 'Save Goals'}
              </ThemedText>
            </Pressable>
          </>
        ) : (
          <>
            {goalLines.length === 0 ? (
              <ThemedText themeColor="textSecondary" style={styles.empty}>
                Add what you&apos;re training toward.
              </ThemedText>
            ) : (
              goalLines.map((line, i) => (
                <ThemedView key={i} style={[styles.goalRow, { borderBottomColor: theme.border }]}>
                  <ThemedText themeColor="textSecondary">•  {line}</ThemedText>
                </ThemedView>
              ))
            )}
            <Pressable onPress={() => setIsEditingGoals(true)} style={styles.editGoalsButton}>
              <ThemedText type="small" themeColor="textSecondary">
                {goalLines.length === 0 ? 'Add Goals' : 'Edit Goals'}
              </ThemedText>
            </Pressable>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
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
  title: {
    marginBottom: Spacing.four,
  },
  quote: {
    fontSize: 20,
    lineHeight: 28,
    marginBottom: Spacing.four,
  },
  hero: {
    width: '100%',
    aspectRatio: 1199 / 1312,
    borderRadius: Spacing.three,
    marginBottom: Spacing.four,
  },
  statsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: Spacing.three,
    marginBottom: Spacing.four,
  },
  statTile: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.half,
  },
  statNumber: {
    fontSize: 32,
    lineHeight: 38,
  },
  sectionLabel: {
    marginTop: Spacing.two,
  },
  sectionTitle: {
    marginBottom: Spacing.three,
  },
  empty: {
    marginBottom: Spacing.four,
  },
  row: {
    borderBottomWidth: 1,
    paddingVertical: Spacing.three,
    gap: Spacing.half,
  },
  goalsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  goalRow: {
    borderBottomWidth: 1,
    paddingVertical: Spacing.two,
  },
  editGoalsButton: {
    marginTop: Spacing.two,
    marginBottom: Spacing.four,
  },
  goalsInput: {
    borderRadius: Spacing.two,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginTop: Spacing.two,
    marginBottom: Spacing.three,
  },
  button: {
    borderRadius: Spacing.two,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
});