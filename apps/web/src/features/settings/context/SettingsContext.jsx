import React, { createContext, useContext, useState } from 'react';

const SettingsContext = createContext(null);

const DEFAULT_SETTINGS = {
  backspaceMode: 'free', // 'strict' | 'free'
  practiceMode: 'time', // 'time' | 'words' | 'quote' | 'ai'
  modeValue: 30, // seconds or word count
  theme: 'serika',
  soundEnabled: true,
  soundProfile: 'mechanical', // 'mechanical' | 'typewriter' | 'cherry' | 'soft' | 'neon'
  ghostEnabled: true,
  ghostWpm: 60,
  punctuation: false,
  numbers: false,
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('hydra_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const updateSettings = (newSettings) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('hydra_settings', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save settings:', err);
      }
      return updated;
    });
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
