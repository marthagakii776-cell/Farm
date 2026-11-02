import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/index.ts';
import { api } from '../services/api.ts';
import { INITIAL_USERS } from '../data/initialData.ts';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (data: Partial<User>) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  switchAccount: (roleOrEmail: string) => void;
  allDemoUsers: User[];
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register' | 'forgot';
  setAuthModalMode: (mode: 'login' | 'register' | 'forgot') => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [allDemoUsers, setAllDemoUsers] = useState<User[]>(INITIAL_USERS);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    // Load from localStorage or default to James Mwangi (Farmer)
    const saved = localStorage.getItem('fh_current_user');
    if (saved) {
      try {
        setCurrentUser(JSON.parse(saved));
      } catch {
        setCurrentUser(INITIAL_USERS[0]);
      }
    } else {
      // Default to farmer James Mwangi for immediate functional demonstration
      setCurrentUser(INITIAL_USERS[0]);
      localStorage.setItem('fh_current_user', JSON.stringify(INITIAL_USERS[0]));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password?: string) => {
    try {
      const res = await api.login(email, password);
      setCurrentUser(res.user);
      localStorage.setItem('fh_current_user', JSON.stringify(res.user));
      setIsAuthModalOpen(false);
    } catch (err: any) {
      // Local fallback if server unreachable
      const local = allDemoUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (local) {
        setCurrentUser(local);
        localStorage.setItem('fh_current_user', JSON.stringify(local));
        setIsAuthModalOpen(false);
      } else {
        throw new Error(err.message || 'Login failed');
      }
    }
  };

  const register = async (data: Partial<User>) => {
    try {
      const res = await api.register(data);
      setCurrentUser(res.user);
      setAllDemoUsers((prev) => [...prev, res.user]);
      localStorage.setItem('fh_current_user', JSON.stringify(res.user));
      setIsAuthModalOpen(false);
    } catch (err: any) {
      // Offline fallback
      const newUser: User = {
        id: `usr_${Date.now()}`,
        name: data.name || 'New Member',
        email: data.email || 'user@farmershub.co.ke',
        role: data.role || 'farmer',
        phone: data.phone || '+254 700 000 000',
        location: data.location || 'Kenya',
        farmName: data.farmName,
        bio: data.bio || '',
        verified: true,
        createdAt: new Date().toISOString(),
      };
      setCurrentUser(newUser);
      setAllDemoUsers((prev) => [...prev, newUser]);
      localStorage.setItem('fh_current_user', JSON.stringify(newUser));
      setIsAuthModalOpen(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('fh_current_user');
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!currentUser) return;
    try {
      const res = await api.updateProfile({ id: currentUser.id, ...data });
      setCurrentUser(res.user);
      localStorage.setItem('fh_current_user', JSON.stringify(res.user));
      setIsProfileModalOpen(false);
    } catch {
      const updated = { ...currentUser, ...data };
      setCurrentUser(updated);
      localStorage.setItem('fh_current_user', JSON.stringify(updated));
      setIsProfileModalOpen(false);
    }
  };

  const switchAccount = (roleOrEmail: string) => {
    const user = allDemoUsers.find(
      (u) =>
        u.role.toLowerCase() === roleOrEmail.toLowerCase() ||
        u.email.toLowerCase() === roleOrEmail.toLowerCase()
    );
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('fh_current_user', JSON.stringify(user));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        switchAccount,
        allDemoUsers,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        isProfileModalOpen,
        setIsProfileModalOpen,
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
