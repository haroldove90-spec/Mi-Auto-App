import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, Role } from '../types';
import { USERS } from '../constants';

interface AuthContextType {
  user: User | null;
  role: Role | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);

  const login = (username: string, password: string): boolean => {
    const userData = USERS[username.toLowerCase()];
    if (userData && userData.password === password) {
      const loggedInUser: User = {
        username: username,
        role: userData.role,
        name: userData.name,
      };
      setUser(loggedInUser);
      setRole(userData.role);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
