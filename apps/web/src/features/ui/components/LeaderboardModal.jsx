import React, { useEffect, useState } from 'react';
import { api } from '../../../shared/services/apiClient.js';

export const LeaderboardModal = ({ onClose }) => {
  const [scores, setScores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchLeaderboard = async () => {
      try {
        const data = await api.scores.getLeaderboard();
        if (active) setScores(data.scores || []);
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
      } finally {
        if (active) setIsLoading(false);
      }
    };
    fetchLeaderboard();
    return () => { active = false; };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in select-none">
      <div className="bg-[var(--panel-color)] border border-[var(--border-color)] p-8 rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl relative font-mono">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-[var(--text-color)] hover:text-[var(--sub-color)] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-center gap-3 mb-6 pr-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[var(--main-color)]" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 3.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L5 10.274zm10 0l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L15 10.274z" clipRule="evenodd" />
          </svg>
          <h2 className="text-3xl font-black text-[var(--main-color)] tracking-wide lowercase">
            all-time<span className="text-[var(--text-color)]">.leaderboard</span>
          </h2>
        </div>

        <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
          {isLoading ? (
            <div className="py-16 text-center text-[var(--text-color)] animate-pulse lowercase">loading top scores...</div>
          ) : scores.length === 0 ? (
            <div className="py-16 text-center text-[var(--text-color)] bg-[var(--bg-color)] rounded-xl border border-[var(--border-color)] lowercase">
              no leaderboard scores yet. be the first to set a record!
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {scores.map((s, index) => {
                let rankStyle = "bg-[var(--bg-color)] border-[var(--border-color)] text-[var(--text-color)]";
                if (index === 0) rankStyle = "bg-[var(--main-color)]/10 border-[var(--main-color)]/50 text-[var(--main-color)] font-bold shadow-lg shadow-[var(--main-color)]/10";
                if (index === 1) rankStyle = "bg-[var(--sub-color)]/10 border-[var(--sub-color)]/40 text-[var(--sub-color)] font-bold";
                if (index === 2) rankStyle = "bg-[var(--error-color)]/10 border-[var(--error-color)]/40 text-[var(--error-color)] font-bold";

                return (
                  <div key={s.id} className={`border p-3.5 rounded-xl flex items-center justify-between text-sm transition-all ${rankStyle}`}>
                    <div className="flex items-center gap-4">
                      <span className="font-black w-6 text-center text-base">#{index + 1}</span>
                      <span className="font-bold tracking-wide text-[var(--sub-color)] text-base lowercase">{s.user?.username || 'anonymous'}</span>
                      <span className="bg-[var(--panel-color)] border border-[var(--border-color)] px-2 py-0.5 rounded text-xs text-[var(--text-color)] lowercase">
                        {s.mode} {s.modeValue}
                      </span>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-sm opacity-80">{s.accuracy}% acc</span>
                      <span className="text-xl font-black text-[var(--main-color)]">{s.wpm} wpm</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
