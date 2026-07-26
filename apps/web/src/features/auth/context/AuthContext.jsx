import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../../../shared/services/apiClient.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('hydra_token') || null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem('hydra_token', token);
      fetchUser(token);
    } else {
      localStorage.removeItem('hydra_token');
      setUser(null);
      setIsLoading(false);
    }
  }, [token]);

  const fetchUser = async (authToken) => {
    try {
      const data = await api.auth.getMe(authToken);
      setUser(data.user);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username, password) => {
    const data = await api.auth.login(username, password);
    setToken(data.token);
    setUser(data.user);
  };

  const register = async (username, password) => {
    const data = await api.auth.register(username, password);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
