import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { API_BASE_URL } from '@/constants/api';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// Matches the shape returned by GET /api/logs in backend/index.js — one row per logged set, joined with its exercise name.
type LoggedSet = {
  id: number;
  user_id: number;
  exercise_id: number;
  exercise_name: string;
  weight: number;
  reps: number;
  rpe: number | null;
  logged_at: string;
};

// Datetime('now') gives "YYYY-MM-DD HH:MM:SS" in UTC with no timezone marker
function formatLoggedAt(logged_at: string) {
  const date = new Date(`${logged_at.replace(' ', 'T')}Z`);
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function ProgressScreen() {
  const theme = useTheme();
  const [logs, setLogs] = useState<LoggedSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/logs`);
      if (!response.ok) {
        setError('Something went wrong loading your history.');
        return;
      }
      const data = await response.json();
      setLogs(data);
    } catch {
      // Same failure mode as the Log tab 
      setError('Could not reach the server. Is it running?');
    }
  }, []);

  // Load once when the screen first mounts.
  useEffect(() => {
    fetchLogs().finally(() => setLoading(false));
  }, [fetchLogs]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchLogs();
    setRefreshing(false);
  }, [fetchLogs]);

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator color={theme.text} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Progress
      </ThemedText>

      {error && (
        <ThemedText style={styles.error} themeColor="textSecondary">
          {error}
        </ThemedText>
      )}

      {!error && logs.length === 0 && (
        <ThemedText style={styles.empty} themeColor="textSecondary">
          No sets logged yet. Log your first set on the Log tab.
        </ThemedText>
      )}

      <FlatList
        data={logs}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.text} />
        }
        renderItem={({ item }) => (
          <ThemedView type="backgroundElement" style={styles.row}>
            <ThemedText type="smallBold">{item.exercise_name}</ThemedText>
            <ThemedText themeColor="textSecondary">
              {item.weight} lbs × {item.reps} reps
              {item.rpe != null ? ` · RPE ${item.rpe}` : ''}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={styles.date}>
              {formatLoggedAt(item.logged_at)}
            </ThemedText>
          </ThemedView>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Spacing.six,
    paddingHorizontal: Spacing.five,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: Spacing.three,
  },
  error: {
    marginBottom: Spacing.three,
  },
  empty: {
    marginBottom: Spacing.three,
  },
  listContent: {
    gap: Spacing.two,
    paddingBottom: Spacing.five,
  },
  row: {
    borderRadius: Spacing.two,
    padding: Spacing.three,
    gap: Spacing.half,
  },
  date: {
    marginTop: Spacing.half,
  },
});