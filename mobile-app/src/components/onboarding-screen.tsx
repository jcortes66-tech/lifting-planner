import { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { API_BASE_URL } from '@/constants/api';
import { FITNESS_LEVELS, FITNESS_LEVEL_KEY, GOALS_KEY } from '@/constants/profile-options';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/hooks/use-theme';

// Shown once, right after creating a brand-new account. Everything here can also be filled in or changed later 
export function OnboardingScreen() {
  const theme = useTheme();
  const { token, completeOnboarding } = useAuth();

  const [name, setName] = useState('');
  const [fitnessLevel, setFitnessLevel] = useState<string | null>(null);
  const [showLevelPicker, setShowLevelPicker] = useState(false);
  const [goals, setGoals] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSelectLevel = (level: string) => {
    setFitnessLevel(level);
    setShowLevelPicker(false);
  };

  const handleFinish = async () => {
    setSubmitting(true);
    try {
      if (fitnessLevel) {
        await SecureStore.setItemAsync(FITNESS_LEVEL_KEY, fitnessLevel);
      }
      if (goals.trim().length > 0) {
        await SecureStore.setItemAsync(GOALS_KEY, goals);
      }
      if (name.trim().length > 0) {
        try {
          await fetch(`${API_BASE_URL}/api/me`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name: name.trim() }),
          });
        } catch {
          // Name can always be added later from Profile — don't block on it.
        }
      }
    } finally {
      await completeOnboarding();
    }
  };

  const handleSkip = async () => {
    await completeOnboarding();
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={{ backgroundColor: theme.background }}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled">
          <ThemedText type="eyebrow" themeColor="textSecondary">
            Welcome
          </ThemedText>
          <ThemedText style={styles.title}>
            <ThemedText type="displayTitle">Let&apos;s set up </ThemedText>
            <ThemedText type="displayItalic" themeColor="textSecondary">
              your profile
            </ThemedText>
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.subtitle}>
            This helps personalize things, but it&apos;s optional — skip it and fill it in anytime from your
            Profile.
          </ThemedText>

          <ThemedText type="small" themeColor="textSecondary">
            Full Name
          </ThemedText>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Add your name"
            placeholderTextColor={theme.textSecondary}
            returnKeyType="done"
            style={[
              styles.input,
              { color: theme.text, backgroundColor: theme.background, borderColor: theme.border },
            ]}
          />

          <ThemedText type="small" themeColor="textSecondary" style={styles.fieldLabel}>
            Fitness Level
          </ThemedText>
          <Pressable
            onPress={() => setShowLevelPicker(true)}
            style={[styles.levelPicker, { borderColor: theme.border }]}>
            <ThemedText themeColor={fitnessLevel ? 'text' : 'textSecondary'}>
              {fitnessLevel ?? 'Choose level'}
            </ThemedText>
          </Pressable>

          <ThemedText type="small" themeColor="textSecondary" style={styles.fieldLabel}>
            Goals
          </ThemedText>
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
            onPress={handleFinish}
            disabled={submitting}
            style={[styles.button, { backgroundColor: theme.text, opacity: submitting ? 0.6 : 1 }]}>
            <ThemedText themeColor="background" type="smallBold">
              {submitting ? 'Saving…' : 'Finish'}
            </ThemedText>
          </Pressable>

          <Pressable onPress={handleSkip} style={styles.skip}>
            <ThemedText type="small" themeColor="textSecondary">
              Skip for now
            </ThemedText>
          </Pressable>
        </ScrollView>
      </TouchableWithoutFeedback>

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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.five,
    paddingVertical: Spacing.six,
    gap: Spacing.two,
  },
  title: {
    marginTop: Spacing.one,
  },
  subtitle: {
    marginBottom: Spacing.three,
  },
  fieldLabel: {
    marginTop: Spacing.two,
  },
  input: {
    borderRadius: Spacing.two,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
    marginBottom: Spacing.two,
  },
  levelPicker: {
    borderRadius: Spacing.two,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    marginBottom: Spacing.two,
  },
  goalsInput: {
    borderRadius: Spacing.two,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: Spacing.three,
  },
  button: {
    borderRadius: Spacing.two,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  skip: {
    alignItems: 'center',
    marginTop: Spacing.three,
    marginBottom: Spacing.three,
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