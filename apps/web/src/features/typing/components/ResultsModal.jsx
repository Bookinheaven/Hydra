import React, { useEffect, useState } from 'react';
import { useAuth } from '../../auth/context/AuthContext.jsx';
import { useSettings } from '../../settings/context/SettingsContext.jsx';
import { api } from '../../../shared/services/apiClient.js';

export const ResultsModal = ({ stats, session, onRestart }) => {
  const { user, token } = useAuth();
  const { settings } = useSettings();
  const [syncStatus, setSyncStatus] = useState('idle'); // 'idle' | 'syncing' | 'saved' | 'error'

  useEffect(() => {
    let active = true;
    const saveScore = async () => {
      if (!user || !token || syncStatus !== 'idle') return;
      setSyncStatus('syncing');
      try {
        await api.scores.create({
          wpm: stats.wpm,
          accuracy: stats.accuracy,
          mode: settings.practiceMode,
          modeValue: String(settings.modeValue)
        }, token);
        if (active) setSyncStatus('saved');
      } catch (err) {
        if (active) setSyncStatus('error');
      }
    };

    saveScore();
    return () => { active = false; };
  }, [user, token, stats, settings, syncStatus]);

  const timeElapsed = session.endTime && session.startTime 
    ? ((session.endTime - session.startTime) / 1000).toFixed(1) 
    : 0;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in select-none">
      <div className="bg-[var(--panel-color)] border border-[var(--border-color)] p-10 rounded-2xl w-full max-w-xl shadow-2xl relative flex flex-col items-center font-mono">
        <h2 className="text-3xl font-black tracking-wider text-[var(--main-color)] mb-8 lowercase">
          result<span className="text-[var(--text-color)]">.stats</span>
        </h2>

        <div className="grid grid-cols-2 gap-6 w-full mb-8">
          <div className="bg-[var(--bg-color)] border border-[var(--border-color)] p-6 rounded-xl flex flex-col items-center justify-center">
            <span className="text-[var(--text-color)] text-xs lowercase mb-1 tracking-widest">wpm</span>
            <span className="text-6xl font-black text-[var(--main-color)]">{stats.wpm}</span>
          </div>
          <div className="bg-[var(--bg-color)] border border-[var(--border-color)] p-6 rounded-xl flex flex-col items-center justify-center">
            <span className="text-[var(--text-color)] text-xs lowercase mb-1 tracking-widest">accuracy</span>
            <span className="text-6xl font-black text-[var(--sub-color)]">{stats.accuracy}%</span>
          </div>
          <div className="bg-[var(--bg-color)] border border-[var(--border-color)] p-4 rounded-xl flex flex-col items-center justify-center">
            <span className="text-[var(--text-color)] text-xs lowercase mb-1 tracking-widest">time</span>
            <span className="text-3xl font-bold text-[var(--sub-color)]">{timeElapsed}s</span>
          </div>
          <div className="bg-[var(--bg-color)] border border-[var(--border-color)] p-4 rounded-xl flex flex-col items-center justify-center">
            <span className="text-[var(--text-color)] text-xs lowercase mb-1 tracking-widest">mistakes</span>
            <span className="text-3xl font-bold text-[var(--error-color)]">{session.mistakes}</span>
          </div>
        </div>

        {user ? (
          <div className="mb-8 flex items-center gap-2 text-sm font-semibold">
            {syncStatus === 'syncing' && <span className="text-[var(--text-color)] animate-pulse">saving to leaderboard...</span>}
            {syncStatus === 'saved' && (
              <span className="text-[var(--main-color)] flex items-center gap-1.5 bg-[var(--main-color)]/10 border border-[var(--main-color)]/30 px-4 py-1.5 rounded-full text-xs font-bold lowercase">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                saved to leaderboard
              </span>
            )}
            {syncStatus === 'error' && <span className="text-[var(--error-color)] text-xs">failed to save score online</span>}
          </div>
        ) : (
          <div className="mb-8 text-xs text-[var(--text-color)] bg-[var(--bg-color)] border border-[var(--border-color)] px-4 py-2.5 rounded-lg lowercase">
            log in to save your results to the global leaderboard
          </div>
        )}

        <button
          onClick={onRestart}
          className="w-full bg-[var(--main-color)] hover:opacity-90 text-[var(--bg-color)] font-extrabold py-4 rounded-xl transition-all shadow-lg hover:shadow-[var(--main-color)]/20 active:scale-[0.98] flex items-center justify-center gap-2 text-base font-mono lowercase"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          next test
        </button>
      </div>
    </div>
  );
};
