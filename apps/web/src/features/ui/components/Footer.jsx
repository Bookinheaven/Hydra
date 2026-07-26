import React from 'react';
import { useSettings } from '../../settings/context/SettingsContext.jsx';
import { THEMES } from '../services/ThemeService.js';
import { SoundService } from '../../typing/services/SoundService.js';

const THEME_KEYS = Object.keys(THEMES);

export const Footer = ({ onRestart }) => {
  const { settings, updateSettings } = useSettings();

  const cycleTheme = () => {
    const currentIndex = THEME_KEYS.indexOf(settings.theme);
    const nextIndex = (currentIndex + 1) % THEME_KEYS.length;
    updateSettings({ theme: THEME_KEYS[nextIndex] });
  };

  const toggleSound = () => {
    const newEnabled = !settings.soundEnabled;
    updateSettings({ soundEnabled: newEnabled });
    SoundService.enabled = newEnabled;
    if (newEnabled) SoundService.playClick();
  };

  const cycleSoundProfile = () => {
    const profiles = SoundService.getProfileNames();
    const currentIdx = profiles.indexOf(settings.soundProfile || 'mechanical');
    const nextIdx = (currentIdx + 1) % profiles.length;
    const next = profiles[nextIdx];
    updateSettings({ soundProfile: next });
    SoundService.setProfile(next);
    SoundService.playClick();
  };

  return (
    <footer className="w-full max-w-[1400px] mx-auto flex flex-col items-center gap-5 py-6 px-8 select-none font-mono">
      {/* Keyboard shortcut hints */}
      <div className="flex items-center gap-3 text-[11px] text-[var(--text-color)] opacity-50">
        <div className="flex items-center gap-1">
          <kbd className="bg-[var(--panel-color)] px-1.5 py-0.5 rounded text-[10px] border border-[var(--border-color)] text-[var(--sub-color)] font-semibold">tab</kbd>
          <span>+</span>
          <kbd className="bg-[var(--panel-color)] px-1.5 py-0.5 rounded text-[10px] border border-[var(--border-color)] text-[var(--sub-color)] font-semibold">enter</kbd>
          <span className="ml-0.5">restart</span>
        </div>
        <span className="text-[var(--border-color)]">•</span>
        <div className="flex items-center gap-1">
          <kbd className="bg-[var(--panel-color)] px-1.5 py-0.5 rounded text-[10px] border border-[var(--border-color)] text-[var(--sub-color)] font-semibold">esc</kbd>
          <span className="ml-0.5">reset</span>
        </div>
      </div>

      {/* Footer controls bar */}
      <div className="w-full flex justify-between items-center text-[11px] text-[var(--text-color)] border-t border-[var(--border-color)]/20 pt-4">
        <div className="flex items-center gap-5">
          <button 
            onClick={cycleTheme}
            className="hover:text-[var(--main-color)] transition-colors flex items-center gap-1.5 font-semibold"
            title="Change theme"
          >
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--main-color)' }}></span>
            <span className="lowercase">{settings.theme}</span>
          </button>

          <span className="text-[var(--border-color)] opacity-30">|</span>

          <button 
            onClick={toggleSound}
            className="hover:text-[var(--main-color)] transition-colors flex items-center gap-1.5 font-semibold"
            title="Toggle sound"
          >
            <span>{settings.soundEnabled ? '🔊' : '🔇'}</span>
            <span className="lowercase">{settings.soundEnabled ? 'on' : 'off'}</span>
          </button>

          {settings.soundEnabled && (
            <>
              <span className="text-[var(--border-color)] opacity-30">|</span>
              <button 
                onClick={cycleSoundProfile}
                className="hover:text-[var(--main-color)] transition-colors flex items-center gap-1.5 font-semibold"
                title="Change sound profile"
              >
                <span>⌨</span>
                <span className="lowercase">{settings.soundProfile || 'mechanical'}</span>
              </button>
            </>
          )}
        </div>

        <span className="text-[var(--text-color)] opacity-40 font-semibold lowercase tracking-wider">v0.1 hydra</span>
      </div>
    </footer>
  );
};
