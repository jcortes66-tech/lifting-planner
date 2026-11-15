import { useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import type { TextInputInstance } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { API_BASE_URL } from '@/constants/api';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/hooks/use-theme';

type Exercise = { id: number; name: string; muscle_group: string | null };

// Show the user after they try to submit: either it worked, or it didn't
type Status = { type: 'success' | 'error'; message: string };

export default function LogScreen() {
  const theme = useTheme();
  const { token, logout } = useAuth();

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selected, setSelected] = useState<Exercise | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  // null = showing the category list; a category name = showing that category's exercises
  const [pickerCategory, setPickerCategory] = useState<string | null>(null);

  // Form fields are kept as strings
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [rpe, setRpe] = useState('');

  const [status, setStatus] = useState<Status | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const repsRef = useRef<TextInputInstance>(null);
  const rpeRef = useRef<TextInputInstance>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadExercises() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/exercises`);
        if (response.ok && !cancelled) {
          const data: Exercise[] = await response.json();
          setExercises(data);
          setSelected(
            (current) => current ?? data.find((e) => e.name === 'Barbell Bench Press') ?? data[0] ?? null
          );
        }
      } catch {
        // Picker just stays empty — handleSubmit catches the missing selection.
      }
    }
    loadExercises();
    return () => {
      cancelled = true;
    };
  }, []);

  // Muscle groups in the order they first appear 
  const categories = useMemo(() => {
    const seen: string[] = [];
    for (const exercise of exercises) {
      const group = exercise.muscle_group ?? 'Other';
      if (!seen.includes(group)) seen.push(group);
    }
    return seen;
  }, [exercises]);

  const exercisesInCategory = useMemo(() => {
    if (!pickerCategory) return [];
    return exercises.filter((e) => (e.muscle_group ?? 'Other') === pickerCategory);
  }, [exercises, pickerCategory]);

  const openPicker = () => {
    setPickerCategory(null);
    setShowPicker(true);
  };

  const handleSubmit = async () => {
    setStatus(null);

    if (!selected) {
      setStatus({ type: 'error', message: 'Choose an exercise first.' });
      return;
    }

    const weightValue = Number(weight);
    const repsValue = Number(reps);
    // RPE is optional — an empty field means "not provided", not "invalid".
    const rpeValue = rpe.trim() === '' ? undefined : Number(rpe);

    // Client-side validation mirrors the backend's rules
    if (!weight || Number.isNaN(weightValue) || weightValue <= 0) {
      setStatus({ type: 'error', message: 'Enter a valid weight.' });
      return;
    }
    if (!reps || Number.isNaN(repsValue) || !Number.isInteger(repsValue) || repsValue <= 0) {
      setStatus({ type: 'error', message: 'Enter a valid number of reps.' });
      return;
    }
    if (
      rpeValue !== undefined &&
      (Number.isNaN(rpeValue) || !Number.isInteger(rpeValue) || rpeValue < 1 || rpeValue > 10)
    ) {
      setStatus({ type: 'error', message: 'RPE must be a whole number between 1 and 10.' });
      return;
    }

    Keyboard.dismiss();
    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          exercise_id: selected.id,
          weight: weightValue,
          reps: repsValue,
          rpe: rpeValue,
        }),
      });

      if (response.status === 401) {
        await logout();
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        setStatus({ type: 'error', message: data.error ?? 'Something went wrong.' });
        return;
      }

      setStatus({ type: 'success', message: 'Set logged!' });
      setWeight('');
      setReps('');
      setRpe('');
    } catch {
      setStatus({ type: 'error', message: 'Could not reach the server. Is it running?' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ThemedView style={styles.container}>
          <View style={styles.header}>
            <ThemedText type="eyebrow" themeColor="textSecondary">
              Today&apos;s Work
            </ThemedText>
            <Pressable onPress={logout}>
              <ThemedText type="small" themeColor="textSecondary">
                Log Out
              </ThemedText>
            </Pressable>
          </View>
          <ThemedText>
            <ThemedText type="displayTitle">Log a </ThemedText>
            <ThemedText type="displayItalic" themeColor="textSecondary">
              set
            </ThemedText>
          </ThemedText>

          <Pressable
            onPress={openPicker}
            style={[styles.exercisePicker, { borderBottomColor: theme.border }]}>
            <ThemedText type="default" themeColor="textSecondary">
              {selected ? selected.name : 'Choose an exercise…'}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Change
            </ThemedText>
          </Pressable>

          <ThemedText type="small" themeColor="textSecondary">
            Weight (lbs)
          </ThemedText>
          <TextInput
            value={weight}
            onChangeText={setWeight}
            keyboardType="decimal-pad"
            placeholder="135"
            placeholderTextColor={theme.textSecondary}
            returnKeyType="next"
            onSubmitEditing={() => repsRef.current?.focus()}
            style={[
              styles.input,
              { color: theme.text, backgroundColor: theme.background, borderColor: theme.border },
            ]}
          />

          <ThemedText type="small" themeColor="textSecondary">
            Reps
          </ThemedText>
          <TextInput
            ref={repsRef}
            value={reps}
            onChangeText={setReps}
            keyboardType="number-pad"
            placeholder="8"
            placeholderTextColor={theme.textSecondary}
            returnKeyType="next"
            onSubmitEditing={() => rpeRef.current?.focus()}
            style={[
              styles.input,
              { color: theme.text, backgroundColor: theme.background, borderColor: theme.border },
            ]}
          />

          <ThemedText type="small" themeColor="textSecondary">
            RPE (optional, 1–10)
          </ThemedText>
          <TextInput
            ref={rpeRef}
            value={rpe}
            onChangeText={setRpe}
            keyboardType="number-pad"
            placeholder="7"
            placeholderTextColor={theme.textSecondary}
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
            style={[
              styles.input,
              { color: theme.text, backgroundColor: theme.background, borderColor: theme.border },
            ]}
          />

          <Pressable
            onPress={handleSubmit}
            disabled={submitting}
            style={[styles.button, { backgroundColor: theme.text, opacity: submitting ? 0.6 : 1 }]}>
            <ThemedText themeColor="background" type="smallBold">
              {submitting ? 'Logging…' : 'Log Set'}
            </ThemedText>
          </Pressable>

          {status && (
            <ThemedText
              style={[styles.status, status.type === 'error' ? styles.statusError : styles.statusSuccess]}>
              {status.message}
            </ThemedText>
          )}
        </ThemedView>
      </TouchableWithoutFeedback>

      <Modal visible={showPicker} animationType="slide" transparent onRequestClose={() => setShowPicker(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setShowPicker(false)} />
        <ThemedView style={[styles.modalSheet, { backgroundColor: theme.background }]}>
          {pickerCategory === null ? (
            <>
              <ThemedText type="eyebrow" themeColor="textSecondary" style={styles.modalTitle}>
                Choose a Category
              </ThemedText>
              <FlatList
                data={categories}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => setPickerCategory(item)}
                    style={[styles.exerciseRow, { borderBottomColor: theme.border }]}>
                    <ThemedText type="default">{item}</ThemedText>
                    <ThemedText themeColor="textSecondary">›</ThemedText>
                  </Pressable>
                )}
              />
            </>
          ) : (
            <>
              <Pressable onPress={() => setPickerCategory(null)} style={styles.modalBack}>
                <ThemedText type="small" themeColor="textSecondary">
                  ‹ Categories
                </ThemedText>
              </Pressable>
              <ThemedText type="eyebrow" themeColor="textSecondary" style={styles.modalTitle}>
                {pickerCategory}
              </ThemedText>
              <FlatList
                data={exercisesInCategory}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => {
                      setSelected(item);
                      setShowPicker(false);
                    }}
                    style={[styles.exerciseRow, { borderBottomColor: theme.border }]}>
                    <ThemedText type={selected?.id === item.id ? 'smallBold' : 'default'}>
                      {item.name}
                    </ThemedText>
                  </Pressable>
                )}
              />
            </>
          )}
        </ThemedView>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.five,
    gap: Spacing.two,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exercisePicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingVertical: Spacing.two,
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
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  status: {
    marginTop: Spacing.three,
    textAlign: 'center',
  },
  statusSuccess: {
    color: '#2e7d32',
  },
  statusError: {
    color: '#c62828',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalSheet: {
    maxHeight: '70%',
    borderTopLeftRadius: Spacing.four,
    borderTopRightRadius: Spacing.four,
    paddingHorizontal: Spacing.five,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.six,
  },
  modalTitle: {
    marginBottom: Spacing.three,
  },
  modalBack: {
    marginBottom: Spacing.two,
  },
  exerciseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
  },
});