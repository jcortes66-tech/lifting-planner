import { useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import type { TextInputInstance } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { API_BASE_URL } from '@/constants/api';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// Only one exercise exists in the database right now (seeded by the backend on startup).
const EXERCISE_ID = 1;
const EXERCISE_NAME = 'Bench Press';

// What we show the user after they try to submit: either it worked, or it didn't and here's why.
type Status = { type: 'success' | 'error'; message: string };

export default function LogScreen() {
  const theme = useTheme();

  // Form fields are kept as strings (not numbers) 
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [rpe, setRpe] = useState('');

  // null = no message showing yet (fresh screen, or user is still typing).
  const [status, setStatus] = useState<Status | null>(null);

  // Disables the button and shows "Logging…" while the request is in flight, so the user doesn't accidentally submit twice.
  const [submitting, setSubmitting] = useState(false);

  // Refs let the "next" key on the keyboard jump straight to the next field instead of closing the keyboard.
  const repsRef = useRef<TextInputInstance>(null);
  const rpeRef = useRef<TextInputInstance>(null);

  const handleSubmit = async () => {
    setStatus(null);

    const weightValue = Number(weight);
    const repsValue = Number(reps);
    // RPE is optional — an empty field means "not provided", not "invalid".
    const rpeValue = rpe.trim() === '' ? undefined : Number(rpe);

    // Client-side validation mirrors the backend's rules (see backend/index.js POST /api/logs) so the user gets instant feedback instead of waiting
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
      // Sends the set to the backend's POST /api/logs endpoint.
      const response = await fetch(`${API_BASE_URL}/api/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exercise_id: EXERCISE_ID,
          weight: weightValue,
          reps: repsValue,
          rpe: rpeValue,
        }),
      });

      const data = await response.json();

      // response.ok is false for 4xx/5xx
      // errors. data.error is the message the backend sent back in that case.
      if (!response.ok) {
        setStatus({ type: 'error', message: data.error ?? 'Something went wrong.' });
        return;
      }

      // Success — clear the form so it's ready for the next set.
      setStatus({ type: 'success', message: 'Set logged!' });
      setWeight('');
      setReps('');
      setRpe('');
    } catch {
      // fetch throws (rather than resolving with an error response)
      setStatus({ type: 'error', message: 'Could not reach the server. Is it running?' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ThemedView style={styles.container}>
          <ThemedText type="title">Log a Set</ThemedText>
          <ThemedText type="subtitle" themeColor="textSecondary" style={styles.exercise}>
            {EXERCISE_NAME}
          </ThemedText>

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
            style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement }]}
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
            style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement }]}
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
            style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement }]}
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
  exercise: {
    marginBottom: Spacing.three,
  },
  input: {
    borderRadius: Spacing.two,
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
  // These two colors are intentionally fixed (not theme-based) since
  // success/error green and red should read the same in light or dark mode.
  statusSuccess: {
    color: '#2e7d32',
  },
  statusError: {
    color: '#c62828',
  },
});