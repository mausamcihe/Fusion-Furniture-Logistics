import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loginAsDriver: (driverId: string, pin: string, remember: boolean) => Promise<{ success: boolean; error?: string }>;
  loginAsAdmin: (adminEmail: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  simulateRfidScan: () => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const DRIVER_USER: User = {
  id: 'DRV-4092',
  name: 'Michael Chen',
  email: 'michael.c@fusionlogistics.com',
  role: 'DRIVER',
  vehicleId: 'VAN-01 (Ford Transit)',
  depot: 'SE Metro Distribution Center / Canberra Depot 01',
  badgeNumber: 'NFC-8841-FL',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
};

const ADMIN_USER: User = {
  id: 'ADM-101',
  name: 'Sarah Jenkins',
  email: 'sarah.jenkins@fusionlogistics.com',
  role: 'ADMIN',
  depot: 'Canberra Depot 01 (Central Control)',
  badgeNumber: 'HQ-DISPATCH-LEAD',
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('fusion_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // Default to authenticated driver as depicted in the mockups
    return DRIVER_USER;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('fusion_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('fusion_auth_user');
    }
  }, [user]);

  const loginAsDriver = async (driverId: string, pin: string, _remember: boolean) => {
    // Accepts DRV-4092, michael.c@fusionlogistics.com, or test pin '1234' / '4092' / any
    if (!driverId.trim()) {
      return { success: false, error: 'Please enter your Driver ID or Fleet Email' };
    }
    setUser(DRIVER_USER);
    return { success: true };
  };

  const loginAsAdmin = async (adminEmail: string, _pass: string) => {
    if (!adminEmail.trim()) {
      return { success: false, error: 'Please enter Administrator Email' };
    }
    setUser(ADMIN_USER);
    return { success: true };
  };

  const simulateRfidScan = async () => {
    setUser(DRIVER_USER);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (role: UserRole) => {
    setUser(role === 'ADMIN' ? ADMIN_USER : DRIVER_USER);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loginAsDriver,
        loginAsAdmin,
        simulateRfidScan,
        logout,
        switchRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
