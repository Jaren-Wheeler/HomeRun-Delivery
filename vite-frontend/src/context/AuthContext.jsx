import { createContext, useContext, useState } from 'react';
import authService from '../api/authService';
import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Normalize user object so FE always has user.id
  const normalizeUser = (raw) => {
    if (!raw) return null;
    return {
      ...raw,
      id: raw.id || raw.user_id, // ⭐ Map DB field → FE field
    };
  };

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    const safeUser = normalizeUser(data.user);

    setUser(safeUser);
    localStorage.setItem('user', JSON.stringify(safeUser));
    localStorage.setItem('token', data.token);

    return safeUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  const setAuth = (rawUser, token) => {
    const safeUser = normalizeUser(rawUser);

    setUser(safeUser);
    localStorage.setItem('user', JSON.stringify(safeUser));
    if (token) localStorage.setItem('token', token);
  };

  return (
    <AuthContext.Provider value={{ user, login, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
