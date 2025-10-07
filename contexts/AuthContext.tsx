import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
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
  const getInitialUsersState = () => {
    try {
        const storedUsers = localStorage.getItem('users');
        if (storedUsers) {
            return JSON.parse(storedUsers);
        }
    } catch (error) {
        console.error("Failed to parse users from localStorage", error);
    }
    return initialUsers;
  };
  
  const [users, setUsers] = useState<Record<string, UserData>>(getInitialUsersState());
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    try {
        localStorage.setItem('users', JSON.stringify(users));
    } catch (error) {
        console.error("Failed to save users to localStorage", error);
    }
  }, [users]);


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
        isVerified: false,
        phone: userData.phone,
        dateOfBirth: userData.dateOfBirth,
        licenseNumber: userData.licenseNumber
    };

    setUsers(prevUsers => ({
        ...prevUsers,
        [username]: newUser
    }));

    // FIX: Manually set the user state to log them in immediately after registration.
    // The previous call to login() failed because the 'users' state update is asynchronous.
    const loggedInUser: User = {
      username: username,
      role: newUser.role,
      name: newUser.name,
      avatarUrl: newUser.avatarUrl,
      memberSince: newUser.memberSince,
      averageRating: newUser.averageRating,
      isVerified: newUser.isVerified,
      phone: newUser.phone,
      dateOfBirth: newUser.dateOfBirth,
      licenseNumber: newUser.licenseNumber,
    };
    setUser(loggedInUser);
    setRole(newUser.role);

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