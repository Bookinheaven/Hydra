import React, { useEffect } from 'react';
import { useSettings } from '../../settings/context/SettingsContext.jsx';
import { useAuth } from '../../auth/context/AuthContext.jsx';
import { ThemeService } from '../services/ThemeService.js';
import { SoundService } from '../../typing/services/SoundService.js';

export const Header = ({ onOpenAuth, onOpenLeaderboard, onOpenProfile }) => {
  const { settings } = useSettings();
  const { user, logout } = useAuth();

  useEffect(() => {
    ThemeService.applyTheme(settings.theme);
    SoundService.enabled = settings.soundEnabled;
    SoundService.setProfile(settings.soundProfile || 'mechanical');
  }, [settings.theme, settings.soundEnabled, settings.soundProfile]);

  return (
    <header className="w-full max-w-[1400px] mx-auto flex justify-between items-center py-5 px-8 select-none font-mono">
      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <h1 className="text-2xl font-black tracking-tight text-[var(--sub-color)] lowercase leading-none">
          hydra<span className="text-[var(--main-color)]">.</span>type
        </h1>
      </div>

      {/* Nav links */}
      <div className="flex items-center gap-5 text-[11px] text-[var(--text-color)] font-semibold tracking-wider">
        <button
          onClick={onOpenLeaderboard}
          title="Leaderboard"
          className="hover:text-[var(--main-color)] transition-colors lowercase"
        >
          leaderboard
        </button>
      </div>

      {/* User area */}
      <div className="flex items-center gap-3">
        {user ? (
          <div className="flex items-center gap-3 text-[11px] font-semibold">
            <button 
              onClick={onOpenProfile}
              className="text-[var(--sub-color)] hover:text-[var(--main-color)] transition-colors flex items-center gap-1.5"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--main-color)]"></div>
              <span className="lowercase">{user.username}</span>
            </button>
            <button 
              onClick={logout}
              className="text-[var(--text-color)] hover:text-[var(--error-color)] transition-colors"
              title="Sign out"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ) : (
          <button 
            onClick={onOpenAuth}
            className="text-[var(--text-color)] hover:text-[var(--main-color)] transition-colors text-[11px] font-semibold lowercase tracking-wider"
          >
            sign in
          </button>
        )}
      </div>
    </header>
  );
};
