import * as SecureStore from 'expo-secure-store';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

// Keys used to save data on the device. 
const TOKEN_KEY = 'auth_token';
const EMAIL_KEY = 'auth_email';

type AuthContextValue = {
  token: string | null;
  email: string | null;
  // True only while we're checking SecureStore 
  isLoading: boolean;
  login: (token: string, email: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On app launch, check whether a session was saved from last time.
  useEffect(() => {
    Promise.all([SecureStore.getItemAsync(TOKEN_KEY), SecureStore.getItemAsync(EMAIL_KEY)])
      .then(([savedToken, savedEmail]) => {
        setToken(savedToken);
        setEmail(savedEmail);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (newToken: string, newEmail: string) => {
    await SecureStore.setItemAsync(TOKEN_KEY, newToken);
    await SecureStore.setItemAsync(EMAIL_KEY, newEmail);
    setToken(newToken);
    setEmail(newEmail);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(EMAIL_KEY);
    setToken(null);
    setEmail(null);
  };

  return (
    <AuthContext.Provider value={{ token, email, isLoading, login, logout }}>
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