// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

// 1. Keep your original interfaces
interface User {
  username: string;
  fullName?: string;
  email?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null; // Added this so other components can grab the token easily!
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (token: string, username: string, role: string) => void;
  logout: () => void;
}

// 2. Create the Context
const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  isAuthenticated: false,
  isAdmin: false,
  login: () => {},
  logout: () => {},
});

// 3. The Provider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ON LOAD: Bother the backend to verify the token!
  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    // If there's no token in storage, don't even bother asking the backend
    if (!savedToken) {
        setLoading(false);
        return;
    }

    // Ask the backend if the token is still valid
    fetch('http://localhost:8080/api/auth/verify', { 
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${savedToken}` 
      }
    })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Token expired or invalid');
      })
      .then(data => {
        // Backend said the token is good! Restore the user session.
        setToken(savedToken);
        setUser({ username: data.username, role: data.role }); 
        setLoading(false);
      })
      .catch(() => {
        // Backend rejected the token. Clear everything out.
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        setToken(null);
        setUser(null);
        setLoading(false);
      });
  }, []);

  // Centralized Login Function 
  const login = (newToken: string, newUsername: string, newRole: string) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("username", newUsername);
    localStorage.setItem("role", newRole);
    
    // Update React state immediately
    setToken(newToken);
    setUser({ username: newUsername, role: newRole }); 
  };

  // Centralized Logout Function 
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setToken(null);
    setUser(null);
  };

  // Helper booleans for your components
  const isAuthenticated = user !== null;
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);