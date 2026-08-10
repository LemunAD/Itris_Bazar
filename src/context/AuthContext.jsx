import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem('itris_admin');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (username, password) => {
    // Standard mock verification (admin / admin123)
    if (username === 'admin' && password === 'admin123') {
      const adminData = { username, loggedAt: new Date().toISOString() };
      localStorage.setItem('itris_admin', JSON.stringify(adminData));
      setAdmin(adminData);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('itris_admin');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
}
