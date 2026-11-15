import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export default function ProfileScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="eyebrow" themeColor="textSecondary">
        Your Account
      </ThemedText>
      <ThemedText>
        <ThemedText type="displayTitle">Your </ThemedText>
        <ThemedText type="displayItalic" themeColor="textSecondary">
          profile
        </ThemedText>
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Spacing.six,
    paddingHorizontal: Spacing.five,
  },
});