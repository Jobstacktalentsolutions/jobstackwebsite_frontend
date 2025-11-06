"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import {
  getAccessToken,
  getRefreshToken,
  getUserRole,
  setAuthTokens,
  clearAuthTokens,
  getUserData,
  setUserData,
} from "./cookies";
import {
  checkJobSeekerProfileCompletion,
  checkRecruiterProfileCompletion,
  fetchJobSeekerProfile,
  fetchRecruiterProfile,
  type JobSeekerProfile,
  type RecruiterProfile,
} from "./profile-completion";

export interface User {
  id: string;
  email: string;
  role: string;
  profileId: string;
  firstName?: string;
  lastName?: string;
}

export interface UserProfile {
  jobSeeker?: JobSeekerProfile;
  recruiter?: RecruiterProfile;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    accessToken: string,
    refreshToken: string,
    user: User
  ) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  refreshProfile: () => Promise<void>;
  checkProfileCompletion: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load user from cookies on mount
  useEffect(() => {
    const loadUser = () => {
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();
      const role = getUserRole();
      const userData = getUserData();

      if (accessToken && refreshToken && role) {
        if (userData) {
          setUser(userData);
        } else {
          // Fallback if no user data in cookies
          setUser({
            id: "",
            email: "",
            role,
            profileId: "",
          });
        }
      }

      setIsLoading(false);
    };

    loadUser();
  }, []);

  // Fetch profile when user changes
  useEffect(() => {
    if (user && user.id) {
      refreshProfile();
    }
  }, [user?.id]);

  const refreshProfile = useCallback(async () => {
    if (!user) return;

    try {
      if (user.role === "JOB_SEEKER") {
        const jobSeekerProfile = await fetchJobSeekerProfile();
        setProfile({ jobSeeker: jobSeekerProfile });
      } else if (user.role === "RECRUITER") {
        const recruiterProfile = await fetchRecruiterProfile();
        setProfile({ recruiter: recruiterProfile });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }, [user]);

  const login = async (
    accessToken: string,
    refreshToken: string,
    userData: User
  ) => {
    // Store tokens in cookies
    setAuthTokens(accessToken, refreshToken, userData.role);

    // Store user data in cookies
    setUserData(userData);

    // Update user state
    setUser(userData);

    // Check profile completion
    const redirectPath = await checkProfileCompletion(userData.role);

    if (redirectPath) {
      router.push(redirectPath);
    } else {
      // Profile is complete, redirect to dashboard
      if (userData.role === "RECRUITER") {
        router.push("/dashboard/employers");
      } else {
        router.push("/dashboard");
      }
    }
  };

  const logout = useCallback(() => {
    clearAuthTokens();
    setUser(null);
    setProfile(null);
    router.push("/");
  }, [router]);

  const updateUser = useCallback((userData: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...userData };
      setUserData(updated);
      return updated;
    });
  }, []);

  const checkProfileCompletion = async (
    role?: string
  ): Promise<string | null> => {
    const userRole = role || user?.role;

    if (!userRole) return null;

    try {
      if (userRole === "RECRUITER") {
        return await checkRecruiterProfileCompletion();
      } else if (userRole === "JOB_SEEKER") {
        return await checkJobSeekerProfileCompletion();
      }
    } catch (error) {
      console.error("Error checking profile completion:", error);
    }

    return null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateUser,
        refreshProfile,
        checkProfileCompletion,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Convenience hook to get user profile
export function useProfile() {
  const { profile, refreshProfile } = useAuth();
  return { profile, refreshProfile };
}

// Convenience hook to get current user
export function useUser() {
  const { user, updateUser } = useAuth();
  return { user, updateUser };
}
