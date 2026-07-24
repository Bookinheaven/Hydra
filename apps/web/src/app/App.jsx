import React from 'react';
import { useEngine } from '../features/typing/hooks/useEngine.js';
import { useStats } from '../features/typing/hooks/useStats.js';
import { TypingArea } from '../features/typing/components/TypingArea.jsx';

const DEFAULT_TEXT = "the quick brown fox jumps over the lazy dog and the typing engine responds with extreme speed and zero lag.";

function App() {
  const { session, passage, reset } = useEngine(DEFAULT_TEXT);
  const stats = useStats(session, passage);

  return (
    <div className="flex flex-col h-screen w-screen items-center justify-center bg-zinc-950 text-zinc-300 font-sans p-8">
      <header className="mb-12 text-center w-full max-w-5xl flex justify-between items-center">
        <h1 className="text-4xl font-bold text-teal-400">Hydra</h1>
        <div className="text-zinc-500 flex gap-6 text-lg">
          <div>WPM: <span className="text-zinc-300 font-bold">{stats.wpm}</span></div>
          <div>Acc: <span className="text-zinc-300 font-bold">{stats.accuracy}%</span></div>
          <button 
            onClick={reset}
            className="hover:text-teal-400 transition-colors"
          >
            Restart
          </button>
        </div>
      </header>

      <main className="w-full flex-grow flex items-center">
        <TypingArea passage={passage} session={session} />
      </main>
    </div>
  );
}

export default App;