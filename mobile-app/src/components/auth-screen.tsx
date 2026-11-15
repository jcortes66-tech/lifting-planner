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
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/hooks/use-theme';

type Mode = 'login' | 'signup';
type Status = { type: 'success' | 'error'; message: string };

export function AuthScreen() {
  const theme = useTheme();
  const { login } = useAuth();

  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<Status | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const passwordRef = useRef<TextInputInstance>(null);

  const handleSubmit = async () => {
    setStatus(null);

    if (!email.trim() || !email.includes('@')) {
      setStatus({ type: 'error', message: 'Enter a valid email.' });
      return;
    }
    if (!password || password.length < 8) {
      setStatus({ type: 'error', message: 'Password must be at least 8 characters.' });
      return;
    }

    Keyboard.dismiss();
    setSubmitting(true);
    try {
      if (mode === 'signup') {
        // Create the account first. Registration doesn't hand back a
        // token on its own, so we follow it with a normal login below.
        const registerResponse = await fetch(`${API_BASE_URL}/api/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const registerData = await registerResponse.json();
        if (!registerResponse.ok) {
          setStatus({ type: 'error', message: registerData.error ?? 'Could not create account.' });
          return;
        }
      }

      const loginResponse = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        setStatus({ type: 'error', message: loginData.error ?? 'Incorrect email or password.' });
        return;
      }

      // Saves the token and flips the root layout over to the tabs.
      await login(loginData.token, loginData.user.email);
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
          <ThemedText type="eyebrow" themeColor="textSecondary">
            {mode === 'login' ? 'Welcome Back' : 'Get Started'}
          </ThemedText>

          <ThemedText style={styles.title}>
            <ThemedText type="displayTitle">{mode === 'login' ? 'Log ' : 'Create '}</ThemedText>
            <ThemedText type="displayItalic" themeColor="textSecondary">
              {mode === 'login' ? 'in' : 'account'}
            </ThemedText>
          </ThemedText>

          <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
            Lifting Overload Generator
          </ThemedText>

          <ThemedText type="small" themeColor="textSecondary">
            Email
          </ThemedText>
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            placeholder="you@example.com"
            placeholderTextColor={theme.textSecondary}
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            style={[
              styles.input,
              { color: theme.text, backgroundColor: theme.background, borderColor: theme.border },
            ]}
          />

          <ThemedText type="small" themeColor="textSecondary">
            Password
          </ThemedText>
          <TextInput
            ref={passwordRef}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            placeholder="At least 8 characters"
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
              {submitting ? 'Please wait…' : mode === 'login' ? 'Log In' : 'Create Account'}
            </ThemedText>
          </Pressable>

          <Pressable
            onPress={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              setStatus(null);
            }}
            style={styles.toggle}>
            <ThemedText themeColor="textSecondary" type="small">
              {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
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
  title: {
    marginTop: Spacing.one,
  },
  subtitle: {
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
  toggle: {
    alignItems: 'center',
    marginTop: Spacing.three,
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
});