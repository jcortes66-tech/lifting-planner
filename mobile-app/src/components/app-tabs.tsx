import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelStyle={{ selected: { color: colors.text } }}>
      {/* "index" Overview screen */}
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Overview</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/overview.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>
      {/* "log" the logging screen */}
      <NativeTabs.Trigger name="log">
        <NativeTabs.Trigger.Label>Log</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/log.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>
      {/* "explore" the progress screen */}
      <NativeTabs.Trigger name="explore">
        <NativeTabs.Trigger.Label>Progress</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/progress.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>
      {/* "guides" refers to app/guides.tsx */}
      <NativeTabs.Trigger name="guides">
        <NativeTabs.Trigger.Label>Guides</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/guides.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>
      {/* "profile" refers to app/profile.tsx */}
      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/profile.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}