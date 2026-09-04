import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('freelance_os_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem('freelance_os_token');
  });
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = async () => {
    try {
      if (!localStorage.getItem('freelance_os_token')) {
        setIsLoading(false);
        return;
      }
      const res = await api.get('/auth/profile');
      if (res.data.success) {
        setUser(res.data.data);
        localStorage.setItem('freelance_os_user', JSON.stringify(res.data.data));
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      const { user: userData, token: tokenData } = res.data.data;
      setUser(userData);
      setToken(tokenData);
      localStorage.setItem('freelance_os_token', tokenData);
      localStorage.setItem('freelance_os_user', JSON.stringify(userData));
    }
  };

  const register = async (data) => {
    const res = await api.post('/auth/register', data);
    if (res.data.success) {
      const { user: userData, token: tokenData } = res.data.data;
      setUser(userData);
      setToken(tokenData);
      localStorage.setItem('freelance_os_token', tokenData);
      localStorage.setItem('freelance_os_user', JSON.stringify(userData));
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('freelance_os_token');
    localStorage.removeItem('freelance_os_user');
  };

  const updateProfile = async (data) => {
    const res = await api.put('/auth/profile', data);
    if (res.data.success) {
      setUser(res.data.data);
      localStorage.setItem('freelance_os_user', JSON.stringify(res.data.data));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        refreshProfile,
      }}
    >
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
