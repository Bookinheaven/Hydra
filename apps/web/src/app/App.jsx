import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SettingsProvider, useSettings } from '../features/settings/context/SettingsContext.jsx';
import { Header } from '../features/ui/components/Header.jsx';
import { ConfigBar } from '../features/ui/components/ConfigBar.jsx';
import { Footer } from '../features/ui/components/Footer.jsx';
import { useEngine } from '../features/typing/hooks/useEngine.js';
import { useStats } from '../features/typing/hooks/useStats.js';
import { TypingArea } from '../features/typing/components/TypingArea.jsx';
import { generateLocalText, fetchPassageText } from '../utils/textGenerator.js';
import { SessionStatus } from '../features/typing/models/Session.js';
import { AuthProvider } from '../features/auth/context/AuthContext.jsx';
import { AuthModal } from '../features/ui/components/AuthModal.jsx';
import { ResultsModal } from '../features/typing/components/ResultsModal.jsx';
import { ProfileModal } from '../features/ui/components/ProfileModal.jsx';
import { LeaderboardModal } from '../features/ui/components/LeaderboardModal.jsx';

function TypingApp() {
  const { settings } = useSettings();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  
  const [initialText, setInitialText] = useState(() => {
    // Generate first passage synchronously so there's zero loading spinner on mount
    return generateLocalText(
      'time', 30,
      { punctuation: false, numbers: false }
    );
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const isAnyModalOpen = isAuthOpen || isProfileOpen || isLeaderboardOpen;
  const { session, passage, reset, endSession } = useEngine(initialText, !isAnyModalOpen);
  const stats = useStats(session, passage);
  const [timeLeft, setTimeLeft] = useState(0);

  // Snapshot of the settings that were used to generate the CURRENT passage.
  // This prevents mid-typing regeneration — we only regenerate when the user
  // changes mode or value (not when toggling punctuation/numbers during a test).
  const appliedSettingsRef = useRef({
    practiceMode: settings.practiceMode,
    modeValue: settings.modeValue,
  });

  // Generate new text ONLY when mode or modeValue changes.
  // Punctuation and numbers are applied at generation time but don't re-trigger on their own.
  useEffect(() => {
    // Only regenerate if mode/value actually changed
    const prev = appliedSettingsRef.current;
    if (prev.practiceMode === settings.practiceMode && prev.modeValue === settings.modeValue) {
      return;
    }
    appliedSettingsRef.current = {
      practiceMode: settings.practiceMode,
      modeValue: settings.modeValue,
    };

    let active = true;
    const load = async () => {
      if (settings.practiceMode === 'ai') setIsLoading(true);
      const text = await fetchPassageText(settings.practiceMode, settings.modeValue, {
        punctuation: settings.punctuation,
        numbers: settings.numbers,
      });
      if (active) {
        setInitialText(text);
        setIsLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [settings.practiceMode, settings.modeValue, settings.punctuation, settings.numbers]);

  // Reset engine whenever a new passage is set
  useEffect(() => {
    if (initialText) {
      reset();
    }
  }, [initialText]);

  // Timer countdown for time mode
  useEffect(() => {
    if (settings.practiceMode !== 'time') return;
    
    if (session.status === SessionStatus.IDLE) {
      setTimeLeft(settings.modeValue);
    } else if (session.status === SessionStatus.TYPING) {
      const elapsed = Math.floor((Date.now() - session.startTime) / 1000);
      const remaining = Math.max(0, settings.modeValue - elapsed);
      setTimeLeft(remaining);

      if (remaining === 0) {
        endSession();
      } else {
        const interval = setInterval(() => {
          const currentElapsed = Math.floor((Date.now() - session.startTime) / 1000);
          const currentRemaining = Math.max(0, settings.modeValue - currentElapsed);
          setTimeLeft(currentRemaining);
          if (currentRemaining === 0) {
            endSession();
          }
        }, 250);
        return () => clearInterval(interval);
      }
    }
  }, [session.status, session.startTime, settings.practiceMode, settings.modeValue, endSession]);

  // Restart: always generates fresh text with current settings (including punctuation/numbers)
  const handleRestart = useCallback(async () => {
    if (settings.practiceMode === 'ai') setIsLoading(true);
    const text = await fetchPassageText(settings.practiceMode, settings.modeValue, {
      punctuation: settings.punctuation,
      numbers: settings.numbers,
    });
    setInitialText(text);
    setIsLoading(false);
  }, [settings.practiceMode, settings.modeValue, settings.punctuation, settings.numbers]);

  // Esc to restart
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isAnyModalOpen) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        handleRestart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnyModalOpen, handleRestart]);

  const isIdle = session.status === SessionStatus.IDLE;
  const isTyping = session.status === SessionStatus.TYPING;

  return (
    <div className="flex flex-col min-h-screen w-screen justify-between items-center bg-[var(--bg-color)] text-[var(--text-color)] font-sans select-none overflow-hidden transition-colors duration-300">
      
      {/* Header */}
      <div className={`w-full transition-all duration-300 ease-out ${isTyping ? 'opacity-0 -translate-y-8 pointer-events-none max-h-0' : 'opacity-100 translate-y-0 max-h-24'}`}>
        <Header 
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
        />
      </div>
      
      {/* Config bar */}
      <div className={`w-full max-w-[1400px] mx-auto flex justify-center z-10 transition-all duration-300 ease-out ${isTyping ? 'opacity-0 -translate-y-4 pointer-events-none max-h-0 my-0' : 'opacity-100 translate-y-0 mt-2 mb-8 max-h-16'}`}>
        <ConfigBar isVisible={!isTyping} onRestart={handleRestart} />
      </div>

      {/* Main typing workspace */}
      <main className="w-full max-w-[1400px] flex-grow flex flex-col justify-center items-center px-10 my-auto relative font-mono">
        
        {/* Language tag */}
        <div className={`flex items-center gap-2 text-[11px] font-semibold text-[var(--text-color)] lowercase tracking-widest transition-all duration-200 ${isTyping ? 'opacity-0 h-0 mb-0' : 'opacity-50 h-auto mb-6'}`}>
          <span>english</span>
        </div>

        {/* Live HUD */}
        <div className={`w-full mb-4 flex justify-between items-baseline font-mono transition-all duration-200 ${!isTyping ? 'opacity-0 pointer-events-none h-0 mb-0' : 'opacity-100 h-auto mb-4'}`}>
          <div className="font-black text-4xl text-[var(--main-color)] tracking-tight tabular-nums">
            {settings.practiceMode === 'time' && <span>{timeLeft}</span>}
            {settings.practiceMode === 'words' && (
              <span>{session.currentWordIndex}<span className="text-lg font-normal text-[var(--text-color)] opacity-50">/{passage.words.length}</span></span>
            )}
            {settings.practiceMode === 'quote' && (
              <span>{session.currentWordIndex}<span className="text-lg font-normal text-[var(--text-color)] opacity-50">/{passage.words.length}</span></span>
            )}
            {settings.practiceMode === 'ai' && (
              <span>{session.currentWordIndex}</span>
            )}
          </div>
          
          <div className="flex gap-6 items-baseline tabular-nums">
            <div className="flex items-baseline gap-1">
              <span className="text-[10px] text-[var(--text-color)] opacity-40 uppercase tracking-widest">wpm</span>
              <span className="text-2xl font-bold text-[var(--sub-color)]">{stats.wpm}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-[10px] text-[var(--text-color)] opacity-40 uppercase tracking-widest">acc</span>
              <span className="text-2xl font-bold text-[var(--sub-color)]">{stats.accuracy}%</span>
            </div>
          </div>
        </div>
        
        {/* Passage */}
        {isLoading ? (
          <div className="w-full py-16 flex items-center justify-center gap-3 text-[var(--text-color)] font-mono text-base lowercase opacity-60">
            <div className="w-5 h-5 border-2 border-[var(--main-color)] border-t-transparent rounded-full animate-spin"></div>
            <span>loading...</span>
          </div>
        ) : (
          <TypingArea passage={passage} session={session} />
        )}
        
        {/* Restart */}
        <div className={`mt-8 transition-opacity duration-300 ${isTyping ? 'opacity-15 hover:opacity-80' : 'opacity-50 hover:opacity-100'}`}>
          <button 
            onClick={handleRestart}
            className="text-[var(--text-color)] hover:text-[var(--main-color)] transition-all p-3 rounded-xl focus:outline-none active:scale-90 group"
            title="Restart (Esc)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:rotate-180 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </main>

      {/* Footer */}
      <div className={`w-full transition-all duration-300 ease-out ${isTyping ? 'opacity-0 translate-y-8 pointer-events-none max-h-0' : 'opacity-100 translate-y-0 max-h-32'}`}>
        <Footer onRestart={handleRestart} />
      </div>

      {/* Modals */}
      {session.status === SessionStatus.COMPLETED && (
        <ResultsModal stats={stats} session={session} onRestart={handleRestart} />
      )}
      {isAuthOpen && <AuthModal onClose={() => setIsAuthOpen(false)} />}
      {isProfileOpen && <ProfileModal onClose={() => setIsProfileOpen(false)} />}
      {isLeaderboardOpen && <LeaderboardModal onClose={() => setIsLeaderboardOpen(false)} />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <TypingApp />
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;