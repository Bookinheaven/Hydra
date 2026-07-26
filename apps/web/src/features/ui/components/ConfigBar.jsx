import React from 'react';
import { useSettings } from '../../settings/context/SettingsContext.jsx';

export const ConfigBar = ({ isVisible = true, onRestart }) => {
  const { settings, updateSettings } = useSettings();

  const handleModeChange = (mode, defaultVal) => {
    updateSettings({ practiceMode: mode, modeValue: defaultVal });
  };

  const handleValueChange = (val) => {
    updateSettings({ modeValue: val });
  };

  const togglePunctuation = () => {
    updateSettings({ punctuation: !settings.punctuation });
    // Regenerate text immediately with the new modifier
    if (onRestart) setTimeout(onRestart, 0);
  };

  const toggleNumbers = () => {
    updateSettings({ numbers: !settings.numbers });
    // Regenerate text immediately with the new modifier
    if (onRestart) setTimeout(onRestart, 0);
  };

  return (
    <div 
      className={`transition-all duration-300 ease-in-out select-none ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}
    >
      <div className="inline-flex items-center gap-6 bg-[var(--panel-color)]/80 border border-[var(--border-color)]/80 px-6 py-2.5 rounded-2xl shadow-xl backdrop-blur-md font-mono text-xs">
        {/* Modifiers (Left) */}
        <div className="flex items-center gap-4 border-r border-[var(--border-color)] pr-6">
          <button
            onClick={togglePunctuation}
            className={`transition-all flex items-center gap-1.5 font-bold ${
              settings.punctuation ? 'text-[var(--main-color)] scale-105' : 'text-[var(--text-color)] hover:text-[var(--sub-color)]'
            }`}
          >
            <span>@</span> punctuation
          </button>
          <button
            onClick={toggleNumbers}
            className={`transition-all flex items-center gap-1.5 font-bold ${
              settings.numbers ? 'text-[var(--main-color)] scale-105' : 'text-[var(--text-color)] hover:text-[var(--sub-color)]'
            }`}
          >
            <span>#</span> numbers
          </button>
        </div>

        {/* Primary Modes (Center) */}
        <div className="flex items-center gap-5 border-r border-[var(--border-color)] pr-6">
          <button 
            className={`transition-all flex items-center gap-1.5 font-bold ${
              settings.practiceMode === 'time' ? 'text-[var(--main-color)] scale-105' : 'text-[var(--text-color)] hover:text-[var(--sub-color)]'
            }`}
            onClick={() => handleModeChange('time', 30)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            time
          </button>
          <button 
            className={`transition-all flex items-center gap-1.5 font-bold ${
              settings.practiceMode === 'words' ? 'text-[var(--main-color)] scale-105' : 'text-[var(--text-color)] hover:text-[var(--sub-color)]'
            }`}
            onClick={() => handleModeChange('words', 25)}
          >
            <span className="text-sm">A</span> words
          </button>
          <button 
            className={`transition-all flex items-center gap-1.5 font-bold ${
              settings.practiceMode === 'quote' ? 'text-[var(--main-color)] scale-105' : 'text-[var(--text-color)] hover:text-[var(--sub-color)]'
            }`}
            onClick={() => handleModeChange('quote', 1)}
          >
            <span>❝</span> quote
          </button>
          <button 
            className={`transition-all flex items-center gap-1.5 font-bold ${
              settings.practiceMode === 'ai' ? 'text-[var(--main-color)] scale-105' : 'text-[var(--text-color)] hover:text-[var(--sub-color)]'
            }`}
            onClick={() => handleModeChange('ai', 30)}
          >
            <span>✧</span> ai
          </button>
        </div>

        {/* Mode Values (Right) */}
        <div className="flex items-center gap-3 font-bold">
          {settings.practiceMode === 'time' && (
            <>
              {[15, 30, 60, 120].map((val) => (
                <button 
                  key={val}
                  className={`transition-all px-1.5 py-0.5 rounded ${
                    settings.modeValue === val ? 'text-[var(--main-color)] bg-[var(--main-color)]/10 scale-110' : 'text-[var(--text-color)] hover:text-[var(--sub-color)]'
                  }`}
                  onClick={() => handleValueChange(val)}
                >
                  {val}
                </button>
              ))}
            </>
          )}
          {settings.practiceMode === 'words' && (
            <>
              {[10, 25, 50, 100].map((val) => (
                <button 
                  key={val}
                  className={`transition-all px-1.5 py-0.5 rounded ${
                    settings.modeValue === val ? 'text-[var(--main-color)] bg-[var(--main-color)]/10 scale-110' : 'text-[var(--text-color)] hover:text-[var(--sub-color)]'
                  }`}
                  onClick={() => handleValueChange(val)}
                >
                  {val}
                </button>
              ))}
            </>
          )}
          {settings.practiceMode === 'quote' && (
            <span className="text-[var(--sub-color)] font-normal tracking-wide">random</span>
          )}
          {settings.practiceMode === 'ai' && (
            <>
              {[15, 30, 50].map((val) => (
                <button 
                  key={val}
                  className={`transition-all px-1.5 py-0.5 rounded ${
                    settings.modeValue === val ? 'text-[var(--main-color)] bg-[var(--main-color)]/10 scale-110' : 'text-[var(--text-color)] hover:text-[var(--sub-color)]'
                  }`}
                  onClick={() => handleValueChange(val)}
                >
                  {val}w
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
