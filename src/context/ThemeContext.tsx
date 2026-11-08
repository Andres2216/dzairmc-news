import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type FontSizeScale = 'small' | 'medium' | 'large';

export interface ThemeColors {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
  accent: string;
  headerBg: string;
  cardBg: string;
  chipBg: string;
}

const lightColors: ThemeColors = {
  background: '#F3F4F6',
  surface: '#FFFFFF',
  text: '#111827',
  textSecondary: '#4B5563',
  border: '#E5E7EB',
  primary: '#2563EB',
  accent: '#D97706',
  headerBg: '#111827',
  cardBg: '#FFFFFF',
  chipBg: '#F3F4F6',
};

const darkColors: ThemeColors = {
  background: '#0F172A',
  surface: '#1E293B',
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  border: '#334155',
  primary: '#3B82F6',
  accent: '#F59E0B',
  headerBg: '#020617',
  cardBg: '#1E293B',
  chipBg: '#334155',
};

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  fontSize: FontSizeScale;
  setFontSize: (size: FontSizeScale) => void;
  fontMultiplier: number;
  colors: ThemeColors;
}

const THEME_STORAGE_KEY = '@dzairmc_theme_v1';
const FONT_STORAGE_KEY = '@dzairmc_fontsize_v1';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [fontSize, setFontSizeState] = useState<FontSizeScale>('medium');

  useEffect(() => {
    (async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        const savedFont = await AsyncStorage.getItem(FONT_STORAGE_KEY);
        if (savedTheme !== null) setIsDark(savedTheme === 'dark');
        if (savedFont === 'small' || savedFont === 'medium' || savedFont === 'large') {
          setFontSizeState(savedFont);
        }
      } catch (e) {
        console.warn('Failed to load theme preferences', e);
      }
    })();
  }, []);

  const toggleTheme = async () => {
    const next = !isDark;
    setIsDark(next);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, next ? 'dark' : 'light');
    } catch (e) {
      console.warn(e);
    }
  };

  const setFontSize = async (size: FontSizeScale) => {
    setFontSizeState(size);
    try {
      await AsyncStorage.setItem(FONT_STORAGE_KEY, size);
    } catch (e) {
      console.warn(e);
    }
  };

  const fontMultiplier = fontSize === 'small' ? 0.9 : fontSize === 'large' ? 1.2 : 1;
  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider
      value={{ isDark, toggleTheme, fontSize, setFontSize, fontMultiplier, colors }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      isDark: false,
      toggleTheme: () => {},
      fontSize: 'medium',
      setFontSize: () => {},
      fontMultiplier: 1,
      colors: lightColors,
    };
  }
  return context;
};
