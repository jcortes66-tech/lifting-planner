import * as SecureStore from 'expo-secure-store';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { FITNESS_LEVEL_KEY, GOALS_KEY } from '@/constants/profile-options';

// Keys used to save data on the device.
const TOKEN_KEY = 'auth_token';
const EMAIL_KEY = 'auth_email';
// Set right after a brand-new signup, cleared once the onboarding questionnaire is completed or skipped. This lets the app know to show the onboarding screen next time the user opens the app.
const ONBOARDING_PENDING_KEY = 'onboarding_pending';

type AuthContextValue = {
  token: string | null;
  email: string | null;
  // True only while we're checking SecureStore
  isLoading: boolean;
  // True right after a new account is created, until the onboarding questionnaire is finished or skipped.
  needsOnboarding: boolean;
  login: (token: string, email: string, options?: { isNewAccount?: boolean }) => Promise<void>;
  logout: () => Promise<void>;
  updateEmail: (newEmail: string) => Promise<void>;
  completeOnboarding: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  // On app launch, check whether a session was saved from last time.
  useEffect(() => {
    Promise.all([
      SecureStore.getItemAsync(TOKEN_KEY),
      SecureStore.getItemAsync(EMAIL_KEY),
      SecureStore.getItemAsync(ONBOARDING_PENDING_KEY),
    ])
      .then(([savedToken, savedEmail, pendingOnboarding]) => {
        setToken(savedToken);
        setEmail(savedEmail);
        setNeedsOnboarding(pendingOnboarding === 'true');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (newToken: string, newEmail: string, options?: { isNewAccount?: boolean }) => {
    await SecureStore.setItemAsync(TOKEN_KEY, newToken);
    await SecureStore.setItemAsync(EMAIL_KEY, newEmail);
    setToken(newToken);
    setEmail(newEmail);

    if (options?.isNewAccount) {
      // Goals and Fitness Level are saved locally on the device, not tied to a specific account 
      await SecureStore.deleteItemAsync(GOALS_KEY);
      await SecureStore.deleteItemAsync(FITNESS_LEVEL_KEY);
      await SecureStore.setItemAsync(ONBOARDING_PENDING_KEY, 'true');
      setNeedsOnboarding(true);
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(EMAIL_KEY);
    setToken(null);
    setEmail(null);
  };

  const updateEmail = async (newEmail: string) => {
    await SecureStore.setItemAsync(EMAIL_KEY, newEmail);
    setEmail(newEmail);
  };

  const completeOnboarding = async () => {
    await SecureStore.deleteItemAsync(ONBOARDING_PENDING_KEY);
    setNeedsOnboarding(false);
  };

  return (
    <AuthContext.Provider
      value={{ token, email, isLoading, needsOnboarding, login, logout, updateEmail, completeOnboarding }}>
      {children}
    </AuthContext.Provider>
  );
}

// Lets any screen read the current session or call login()/logout()
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
}