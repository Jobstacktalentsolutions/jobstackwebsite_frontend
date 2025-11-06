"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getAuthToken, storeAuthToken, removeAuthToken } from "@/app/lib/utils";
import type { AuthResult, UserRole } from "@/app/types/auth.type";

interface User {
  id: string;
  email: string;
  role: UserRole;
  profileId?: string;
  firstName?: string;
  lastName?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (authResult: AuthResult) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!getAuthToken();

  // Initialize auth state on mount
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      // TODO: You might want to validate the token or fetch user data here
      // For now, we'll just set loading to false
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = (authResult: AuthResult) => {
    // Store the token
    storeAuthToken(authResult.accessToken);

    // Set user data
    setUser({
      id: authResult.user.id,
      email: authResult.user.email,
      role: authResult.user.role,
      profileId: authResult.user.profileId,
      firstName: authResult.user.firstName,
      lastName: authResult.user.lastName,
    });

    setIsLoading(false);
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...userData } : null));
  };

  const getToken = () => {
    return getAuthToken();
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
    getToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
