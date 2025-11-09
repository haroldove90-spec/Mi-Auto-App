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
    address?: string;
    documents?: Record<string, string>;
};

interface AuthContextType {
  user: User | null;
  role: Role | null;
  users: Record<string, UserData>;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  register: (userData: Omit<User, 'memberSince' | 'averageRating' | 'isVerified' | 'role' | 'avatarUrl' | 'documents' | 'address'> & {password: string}) => boolean;
  updateUser: (name: string, avatar?: string) => void;
  toggleUserVerification: (username: string) => void;
  upgradeToLessor: (username: string, documents: Record<string, string>) => void;
  switchRole: (username: 'cliente' | 'arrendador' | 'admin') => void;
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
        address: userData.address,
        documents: userData.documents,
      };
      setUser(loggedInUser);
      setRole(userData.role);
      return true;
    }
    return false;
  };
  
  const register = (userData: Omit<User, 'memberSince' | 'averageRating' | 'isVerified' | 'role' | 'avatarUrl' | 'documents' | 'address'> & {password: string}): boolean => {
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

  const toggleUserVerification = (username: string) => {
    setUsers(prevUsers => {
        const userToUpdate = prevUsers[username];
        if (userToUpdate && userToUpdate.role === 'arrendador') {
            return {
                ...prevUsers,
                [username]: {
                    ...userToUpdate,
                    isVerified: !userToUpdate.isVerified,
                }
            };
        }
        return prevUsers;
    });
  };

  const upgradeToLessor = (username: string, documents: Record<string, string>) => {
      setUsers(prevUsers => {
          const userToUpdate = prevUsers[username];
          if (userToUpdate) {
              const updatedUser = {
                  ...userToUpdate,
                  role: 'arrendador' as Role,
                  isVerified: false, // Must be approved by admin
                  documents,
              };
              
              if (user && user.username === username) {
                  setUser(prevUser => ({
                      ...prevUser!,
                      role: 'arrendador',
                      isVerified: false,
                      documents,
                  }));
                  setRole('arrendador');
              }

              return {
                  ...prevUsers,
                  [username]: updatedUser,
              };
          }
          return prevUsers;
      });
  };
  
  const switchRole = (username: 'cliente' | 'arrendador' | 'admin') => {
    const userData = users[username];
    if (userData && userData.password) {
        // Log out the current user and log in as the new one
        login(username, userData.password);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, users, login, logout, register, updateUser, toggleUserVerification, upgradeToLessor, switchRole }}>
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