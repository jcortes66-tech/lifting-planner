import * as SecureStore from 'expo-secure-store';
import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { API_BASE_URL } from '@/constants/api';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { FITNESS_LEVELS, FITNESS_LEVEL_KEY, GOALS_KEY } from '@/constants/profile-options';
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/hooks/use-theme';

type Me = { id: number; email: string; name: string | null; created_at: string };
type LoggedSet = { id: number; logged_at: string };

function formatMemberSince(createdAt: string) {
  const date = new Date(createdAt.replace(' ', 'T') + 'Z');
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}

export default function ProfileScreen() {
  const theme = useTheme();
  const { token, email: authEmail, logout, updateEmail } = useAuth();

  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [logs, setLogs] = useState<LoggedSet[]>([]);

  const [fitnessLevel, setFitnessLevel] = useState<string | null>(null);
  const [showLevelPicker, setShowLevelPicker] = useState(false);

  const [goals, setGoals] = useState('');
  const [savedGoals, setSavedGoals] = useState('');
  const [isEditingGoals, setIsEditingGoals] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 401) {
          await logout();
          return;
        }
        if (response.ok && !cancelled) {
          const data: Me = await response.json();
          setMe(data);
        }
      } catch {
        // Nothing to show for the profile fields if the server's unreachable.
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
    let cancelled = false;
    fetch(`${API_BASE_URL}/api/logs`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => (response.ok ? response.json() : []))
      .then((data: LoggedSet[]) => {
        if (!cancelled) setLogs(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    SecureStore.getItemAsync(FITNESS_LEVEL_KEY).then((saved) => setFitnessLevel(saved));
  }, []);

  useEffect(() => {
    SecureStore.getItemAsync(GOALS_KEY).then((saved) => {
      setGoals(saved ?? '');
      setSavedGoals(saved ?? '');
      setIsEditingGoals(!saved);
    });
  }, []);

  const totalWorkouts = useMemo(() => {
    return new Set(logs.map((log) => log.logged_at.slice(0, 10))).size;
  }, [logs]);

  const goalLines = useMemo(
    () =>
      goals
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0),
    [goals]
  );

  const handleSelectLevel = async (level: string) => {
    await SecureStore.setItemAsync(FITNESS_LEVEL_KEY, level);
    setFitnessLevel(level);
    setShowLevelPicker(false);
  };

  const handleSaveGoals = async () => {
    await SecureStore.setItemAsync(GOALS_KEY, goals);
    setSavedGoals(goals);
    setIsEditingGoals(false);
  };

  const handleStartEdit = () => {
    setEditName(me?.name ?? '');
    setEditEmail(me?.email ?? '');
    setSaveError(null);
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    setSaveError(null);

    if (!editEmail.includes('@')) {
      setSaveError('Enter a valid email.');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: editName.trim(), email: editEmail.trim() }),
      });

      if (response.status === 401) {
        await logout();
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        setSaveError(data.error ?? 'Could not save your changes.');
        return;
      }

      setMe(data);
      if (data.email !== authEmail) {
        await updateEmail(data.email);
      }
      setIsEditing(false);
    } catch {
      setSaveError('Could not reach the server. Is it running?');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText themeColor="textSecondary">Loading…</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={{ backgroundColor: theme.background }} contentContainerStyle={styles.container}>
      <ThemedText type="eyebrow" themeColor="textSecondary">
        Your Account
      </ThemedText>
      <ThemedText style={styles.title}>
        <ThemedText type="displayTitle">Your </ThemedText>
        <ThemedText type="displayItalic" themeColor="textSecondary">
          profile
        </ThemedText>
      </ThemedText>

      {isEditing ? (
        <ThemedView style={styles.editBlock}>
          <ThemedText type="small" themeColor="textSecondary">
            Full Name
          </ThemedText>
          <TextInput
            value={editName}
            onChangeText={setEditName}
            placeholder="Add your name"
            placeholderTextColor={theme.textSecondary}
            style={[
              styles.input,
              { color: theme.text, backgroundColor: theme.background, borderColor: theme.border },
            ]}
          />
          <ThemedText type="small" themeColor="textSecondary">
            Email
          </ThemedText>
          <TextInput
            value={editEmail}
            onChangeText={setEditEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor={theme.textSecondary}
            style={[
              styles.input,
              { color: theme.text, backgroundColor: theme.background, borderColor: theme.border },
            ]}
          />
          {saveError && <ThemedText style={styles.error}>{saveError}</ThemedText>}
          <ThemedView style={styles.editActions}>
            <Pressable onPress={() => setIsEditing(false)} style={styles.cancelButton}>
              <ThemedText type="small" themeColor="textSecondary">
                Cancel
              </ThemedText>
            </Pressable>
            <Pressable
              onPress={handleSaveProfile}
              disabled={saving}
              style={[styles.button, { backgroundColor: theme.text, opacity: saving ? 0.6 : 1 }]}>
              <ThemedText themeColor="background" type="smallBold">
                {saving ? 'Saving…' : 'Save'}
              </ThemedText>
            </Pressable>
          </ThemedView>
        </ThemedView>
      ) : (
        <ThemedView style={[styles.profileBlock, { borderBottomColor: theme.border }]}>
          <ThemedText type="displayTitle" style={styles.name}>
            {me?.name && me.name.length > 0 ? me.name : 'Add your name'}
          </ThemedText>
          <ThemedText themeColor="textSecondary">{me?.email}</ThemedText>
          {me?.created_at && (
            <ThemedText type="small" themeColor="textSecondary" style={styles.memberSince}>
              Joined {formatMemberSince(me.created_at)}
            </ThemedText>
          )}
          <Pressable onPress={handleStartEdit} style={styles.editProfileButton}>
            <ThemedText type="small" themeColor="textSecondary">
              Edit Profile
            </ThemedText>
          </Pressable>
        </ThemedView>
      )}

      <Pressable
        onPress={() => setShowLevelPicker(true)}
        style={[styles.row, { borderBottomColor: theme.border }]}>
        <ThemedText type="small" themeColor="textSecondary">
          Fitness Level
        </ThemedText>
        <ThemedText type="smallBold">{fitnessLevel ?? 'Choose level'}</ThemedText>
      </Pressable>

      <ThemedView style={[styles.row, { borderBottomColor: theme.border }]}>
        <ThemedText type="small" themeColor="textSecondary">
          Training Days
        </ThemedText>
        <ThemedText type="smallBold">{totalWorkouts}</ThemedText>
      </ThemedView>

      <ThemedText type="eyebrow" themeColor="textSecondary" style={styles.sectionLabel}>
        What Matters
      </ThemedText>
      <ThemedText style={styles.sectionTitle}>
        <ThemedText type="displayTitle">Fitness </ThemedText>
        <ThemedText type="displayItalic" themeColor="textSecondary">
          goals
        </ThemedText>
      </ThemedText>

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

      <Pressable onPress={logout} style={[styles.logoutButton, { borderColor: theme.border }]}>
        <ThemedText type="smallBold">Log Out</ThemedText>
      </Pressable>

      <Modal
        visible={showLevelPicker}
        animationType="slide"
        transparent
        onRequestClose={() => setShowLevelPicker(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setShowLevelPicker(false)} />
        <ThemedView style={[styles.modalSheet, { backgroundColor: theme.background }]}>
          <ThemedText type="eyebrow" themeColor="textSecondary" style={styles.modalTitle}>
            Fitness Experience
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.modalSubtitle}>
            Choose the level that best describes your workout experience.
          </ThemedText>
          {FITNESS_LEVELS.map((item) => (
            <Pressable
              key={item.level}
              onPress={() => handleSelectLevel(item.level)}
              style={[styles.levelRow, { borderBottomColor: theme.border }]}>
              <ThemedText type={fitnessLevel === item.level ? 'smallBold' : 'default'}>{item.level}</ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.levelDescription}>
                {item.description}
              </ThemedText>
            </Pressable>
          ))}
        </ThemedView>
      </Modal>
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
  title: {
    marginBottom: Spacing.five,
  },
  profileBlock: {
    borderBottomWidth: 1,
    paddingBottom: Spacing.four,
    marginBottom: Spacing.four,
    gap: Spacing.half,
  },
  name: {
    fontSize: 32,
    lineHeight: 38,
  },
  memberSince: {
    marginTop: Spacing.one,
  },
  editProfileButton: {
    marginTop: Spacing.three,
  },
  editBlock: {
    marginBottom: Spacing.four,
    gap: Spacing.two,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: Spacing.three,
    marginTop: Spacing.one,
  },
  cancelButton: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
  },
  error: {
    color: '#c62828',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingVertical: Spacing.three,
  },
  sectionLabel: {
    marginTop: Spacing.four,
  },
  sectionTitle: {
    marginBottom: Spacing.three,
  },
  goalRow: {
    borderBottomWidth: 1,
    paddingVertical: Spacing.two,
  },
  editGoalsButton: {
    marginTop: Spacing.two,
    marginBottom: Spacing.four,
  },
  empty: {
    marginBottom: Spacing.three,
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
  input: {
    borderRadius: Spacing.two,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
    marginBottom: Spacing.two,
  },
  button: {
    borderRadius: Spacing.two,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
  },
  logoutButton: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalSheet: {
    maxHeight: '75%',
    borderTopLeftRadius: Spacing.four,
    borderTopRightRadius: Spacing.four,
    paddingHorizontal: Spacing.five,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.six,
  },
  modalTitle: {
    marginBottom: Spacing.one,
  },
  modalSubtitle: {
    marginBottom: Spacing.three,
  },
  levelRow: {
    borderBottomWidth: 1,
    paddingVertical: Spacing.three,
    gap: Spacing.half,
  },
  levelDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});