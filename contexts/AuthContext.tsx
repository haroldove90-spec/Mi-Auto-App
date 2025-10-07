import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, Role } from '../types';
import { USERS as initialUsers } from '../constants';

type UserData = {
    password?: string;
    role: Role;
    name: string;
    avatarUrl: string;
    memberSince: string;
    averageRating: number;
    isVerified: boolean;
    phone?: string;
    dateOfBirth?: string;
    licenseNumber?: string;
};

interface AuthContextType {
  user: User | null;
  role: Role | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  register: (userData: Omit<User, 'memberSince' | 'averageRating' | 'isVerified' | 'role' | 'avatarUrl'> & {password: string}) => boolean;
  updateUser: (name: string, avatar?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<Record<string, UserData>>(initialUsers);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);

  const login = (username: string, password: string): boolean => {
    const userData = users[username.toLowerCase()];
    if (userData && userData.password === password) {
      const loggedInUser: User = {
        username: username,
        role: userData.role,
        name: userData.name,
        avatarUrl: userData.avatarUrl,
        memberSince: userData.memberSince,
        averageRating: userData.averageRating,
        isVerified: userData.isVerified,
        phone: userData.phone,
        dateOfBirth: userData.dateOfBirth,
        licenseNumber: userData.licenseNumber,
      };
      setUser(loggedInUser);
      setRole(userData.role);
      return true;
    }
    return false;
  };
  
  const register = (userData: Omit<User, 'memberSince' | 'averageRating' | 'isVerified' | 'role' | 'avatarUrl'> & {password: string}): boolean => {
    const username = userData.username.toLowerCase();
    if (users[username]) {
        // User already exists
        return false;
    }

    const newUser: UserData = {
        password: userData.password,
        role: 'cliente',
        name: userData.name,
        avatarUrl: `https://i.pravatar.cc/150?u=${username}`,
        memberSince: new Date().toISOString(),
        averageRating: 0,
        isVerified: false, // Clients are not verified by default this way
        phone: userData.phone,
        dateOfBirth: userData.dateOfBirth,
        licenseNumber: userData.licenseNumber
    };

    setUsers(prevUsers => ({
        ...prevUsers,
        [username]: newUser
    }));

    // Automatically log in the new user
    login(username, userData.password);

    return true;
  };


  const logout = () => {
    setUser(null);
    setRole(null);
  };

  const updateUser = (name: string, avatar?: string) => {
    if (user) {
        setUser({ ...user, name, avatarUrl: avatar || user.avatarUrl });
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout, register, updateUser }}>
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