import React, { useState } from 'react';
import { useAuth } from '../../auth/context/AuthContext.jsx';

export const AuthModal = ({ onClose }) => {
  const { login, register } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isLoginMode) {
        await login(username, password);
      } else {
        await register(username, password);
      }
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in select-none">
      <div className="bg-[var(--panel-color)] border border-[var(--border-color)] p-8 rounded-2xl w-full max-w-sm relative font-mono shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-[var(--text-color)] hover:text-[var(--sub-color)] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="bg-[var(--main-color)] text-[var(--bg-color)] font-black p-1 rounded text-sm">h</div>
          <h2 className="text-2xl font-black text-[var(--main-color)] tracking-wide lowercase">
            {isLoginMode ? 'login' : 'register'}
          </h2>
        </div>

        {error && (
          <div className="bg-[var(--error-color)]/20 text-[var(--error-color)] p-3 rounded-lg text-xs mb-4 border border-[var(--error-color)]/40 lowercase font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[var(--text-color)] text-xs lowercase mb-1 tracking-widest">username</label>
            <input 
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] text-[var(--sub-color)] rounded-xl p-3 outline-none focus:border-[var(--main-color)] transition-colors text-sm font-mono"
              required
            />
          </div>
          <div>
            <label className="block text-[var(--text-color)] text-xs lowercase mb-1 tracking-widest">password</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] text-[var(--sub-color)] rounded-xl p-3 outline-none focus:border-[var(--main-color)] transition-colors text-sm font-mono"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="mt-2 w-full bg-[var(--main-color)] hover:opacity-90 text-[var(--bg-color)] font-extrabold py-3.5 rounded-xl transition-all disabled:opacity-50 lowercase text-sm tracking-wide shadow-lg hover:shadow-[var(--main-color)]/20"
          >
            {isLoading ? '...' : isLoginMode ? 'sign in' : 'create account'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-xs text-[var(--text-color)] lowercase">
          {isLoginMode ? "don't have an account? " : "already have an account? "}
          <button 
            type="button"
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setError(null);
            }}
            className="text-[var(--main-color)] hover:underline font-bold"
          >
            {isLoginMode ? 'sign up' : 'login'}
          </button>
        </div>
      </div>
    </div>
  );
};
