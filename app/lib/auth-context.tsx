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
  login: (authResult: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      role: string;
      profileId?: string;
      firstName?: string;
      lastName?: string;
    };
  }) => Promise<void>;
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

  const login = async (authResult: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      role: string;
      profileId?: string;
      firstName?: string;
      lastName?: string;
    };
  }) => {
    // Normalize role from API format to internal format
    const normalizeRole = (role: string): string => {
      if (role === "JobSeeker") return "JOB_SEEKER";
      if (role === "Recruiter") return "RECRUITER";
      if (role === "Admin") return "ADMIN";
      return role.toUpperCase();
    };

    const normalizedRole = normalizeRole(authResult.user.role);

    // Store tokens in cookies immediately after login
    setAuthTokens(
      authResult.accessToken,
      authResult.refreshToken,
      normalizedRole
    );

    // Prepare user data with normalized role
    const userData: User = {
      id: authResult.user.id,
      email: authResult.user.email,
      role: normalizedRole,
      profileId: authResult.user.profileId || "",
      firstName: authResult.user.firstName,
      lastName: authResult.user.lastName,
    };

    // Store user data in cookies
    setUserData(userData);

    // Update user state
    setUser(userData);

    // Check profile completion and redirect accordingly
    const redirectPath = await checkProfileCompletion(normalizedRole);

    if (redirectPath) {
      router.push(redirectPath);
    } else {
      // Profile is complete, redirect to dashboard
      if (normalizedRole === "RECRUITER") {
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
        const path = await checkRecruiterProfileCompletion();
        return path || null;
      } else if (userRole === "JOB_SEEKER") {
        const path = await checkJobSeekerProfileCompletion();
        return path || null;
      }
    } catch (error) {
      console.error("Error checking profile completion:", error);
      // If profile check fails, redirect to profile page to be safe
      if (userRole === "RECRUITER") {
        return "/auth/employer/profile";
      } else if (userRole === "JOB_SEEKER") {
        return "/auth/jobseeker/profile";
      }
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
