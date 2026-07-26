import React, { useEffect, useState } from 'react';
import { useAuth } from '../../auth/context/AuthContext.jsx';
import { api } from '../../../shared/services/apiClient.js';

export const ProfileModal = ({ onClose }) => {
  const { user, token, logout } = useAuth();
  const [scores, setScores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchScores = async () => {
      if (!token) return;
      try {
        const data = await api.scores.getMyScores(token);
        if (active) setScores(data.scores || []);
      } catch (err) {
        console.error("Failed to fetch user scores:", err);
      } finally {
        if (active) setIsLoading(false);
      }
    };
    fetchScores();
    return () => { active = false; };
  }, [token]);

  const bestWpm = scores.length > 0 ? Math.max(...scores.map(s => s.wpm)) : 0;
  const avgWpm = scores.length > 0 ? Math.round(scores.reduce((acc, s) => acc + s.wpm, 0) / scores.length) : 0;
  const avgAcc = scores.length > 0 ? (scores.reduce((acc, s) => acc + s.accuracy, 0) / scores.length).toFixed(1) : 0;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in select-none">
      <div className="bg-[var(--panel-color)] border border-[var(--border-color)] p-8 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl relative font-mono">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-[var(--text-color)] hover:text-[var(--sub-color)] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-center justify-between mb-8 pr-12">
          <div>
            <h2 className="text-3xl font-black text-[var(--main-color)] tracking-wide lowercase">{user?.username}</h2>
            <span className="text-xs text-[var(--text-color)] font-mono lowercase">member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
          </div>
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="bg-[var(--error-color)]/10 hover:bg-[var(--error-color)]/20 text-[var(--error-color)] border border-[var(--error-color)]/30 px-4 py-2 rounded-lg text-xs font-bold transition-colors lowercase"
          >
            sign out
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[var(--bg-color)] border border-[var(--border-color)] p-4 rounded-xl flex flex-col items-center justify-center">
            <span className="text-[var(--text-color)] text-xs lowercase mb-1 tracking-widest">personal best</span>
            <span className="text-3xl font-black text-[var(--main-color)]">{bestWpm} wpm</span>
          </div>
          <div className="bg-[var(--bg-color)] border border-[var(--border-color)] p-4 rounded-xl flex flex-col items-center justify-center">
            <span className="text-[var(--text-color)] text-xs lowercase mb-1 tracking-widest">average speed</span>
            <span className="text-3xl font-black text-[var(--sub-color)]">{avgWpm} wpm</span>
          </div>
          <div className="bg-[var(--bg-color)] border border-[var(--border-color)] p-4 rounded-xl flex flex-col items-center justify-center">
            <span className="text-[var(--text-color)] text-xs lowercase mb-1 tracking-widest">avg accuracy</span>
            <span className="text-3xl font-black text-[var(--sub-color)]">{avgAcc}%</span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-[var(--sub-color)] mb-4 lowercase tracking-wide">recent tests ({scores.length})</h3>

        <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
          {isLoading ? (
            <div className="py-12 text-center text-[var(--text-color)] animate-pulse lowercase">loading history...</div>
          ) : scores.length === 0 ? (
            <div className="py-12 text-center text-[var(--text-color)] bg-[var(--bg-color)] rounded-xl border border-[var(--border-color)] lowercase">
              no typing tests completed yet. go type something!
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {scores.map((s) => (
                <div key={s.id} className="bg-[var(--bg-color)] border border-[var(--border-color)] p-3.5 rounded-xl flex items-center justify-between text-sm hover:border-[var(--text-color)] transition-colors">
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-[var(--main-color)] text-lg w-20">{s.wpm} wpm</span>
                    <span className="text-[var(--text-color)]">{s.accuracy}% acc</span>
                    <span className="bg-[var(--panel-color)] border border-[var(--border-color)] px-2.5 py-0.5 rounded text-xs text-[var(--text-color)] lowercase">
                      {s.mode} {s.modeValue}
                    </span>
                  </div>
                  <span className="text-xs text-[var(--text-color)]">
                    {new Date(s.createdAt).toLocaleDateString()} {new Date(s.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
