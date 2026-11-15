import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#3D2B1F',             
    background: '#FAF3E8',       
    backgroundElement: '#F0E2CC', 
    backgroundSelected: '#E3CBA3', 
    textSecondary: '#8B6F52',  
    border: '#E8D9C0', 
  },
  dark: {
    text: '#F3E4CF', 
    background: '#231812', 
    backgroundElement: '#342417',
    backgroundSelected: '#4A3522',
    textSecondary: '#B79B7B',
    border: '#3A2A1C',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const DisplayFonts = {
  regular: 'PlayfairDisplay_400Regular',
  italic: 'PlayfairDisplay_400Regular_Italic',
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;