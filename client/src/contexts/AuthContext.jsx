import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getCurrentSession,
  loginUser as performLogin,
  registerUser as performRegister,
  logoutUser as performLogout,
} from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const session = getCurrentSession();
    return session?.user || null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const result = await performLogin(credentials);
      if (result.ok) {
        setCurrentUser(result.user);
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const result = await performRegister(userData);
      if (result.ok) {
        setCurrentUser(result.user);
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    performLogout();
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, register, logout, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;

