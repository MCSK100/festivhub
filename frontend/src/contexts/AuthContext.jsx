import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

function safeParseUser(raw) {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && parsed.email) return parsed;
    return null;
  } catch {
    localStorage.removeItem('user');
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Validate stored token on mount — don't trust stale localStorage
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('token');
      const storedUser = safeParseUser(localStorage.getItem('user'));
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      if (storedUser) setUser(storedUser); // optimistic, then verify
      try {
        const response = await api.get('/auth/me');
        const fresh = response.data?.user || response.data;
        if (fresh && fresh.email) {
          setUser(fresh);
          localStorage.setItem('user', JSON.stringify(fresh));
        } else if (!storedUser) {
          setUser(null);
        }
      } catch {
        // Token invalid/expired → clear, stay logged out (interceptor skips /auth/me)
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', {
        email: String(email || '').toLowerCase().trim(),
        password,
      });
      const { token, user: userData } = response.data;
      if (!token || !userData) return { success: false, error: 'Unexpected server response' };
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Login failed. Check email/password.' };
    }
  };

  const register = async (email, password, role = 'customer', name = '') => {    try {
      const response = await api.post('/auth/register', {
        email: String(email || '').toLowerCase().trim(),
        password,
        role,
        name: String(name || '').trim(),
      });
      const { token, user: userData } = response.data;
      if (!token || !userData) return { success: false, error: 'Unexpected server response' };
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      const msg = error.response?.data?.error
        || error.response?.data?.errors?.[0]?.message
        || 'Registration failed';
      return { success: false, error: msg };
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  // Google SSO: exchange GIS ID token for our JWT (role only applies to new users)
  const loginWithGoogle = async (idToken, role = 'customer') => {
    try {
      const response = await api.post('/auth/google', { idToken, role });
      const { token, user: userData } = response.data;
      if (!token || !userData) return { success: false, error: 'Unexpected server response' };
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Google sign-in failed' };
    }
  };

  const fetchUser = async () => {
    try {
      const response = await api.get('/auth/me');
      const fresh = response.data?.user || response.data;
      setUser(fresh);
      localStorage.setItem('user', JSON.stringify(fresh));
      return fresh;
    } catch (error) {
      logout();
      return null;
    }
  };

  const dashboardPath = user?.role === 'vendor' ? '/vendor-dashboard' : '/customer-dashboard';

  const value = {
    user,
    loading,
    login,
    register,
    loginWithGoogle,
    logout,
    fetchUser,
    dashboardPath,
    isVendor: user?.role === 'vendor',
    isCustomer: user?.role === 'customer',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
