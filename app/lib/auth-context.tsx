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
  checkEmployerProfileCompletion,
  fetchJobSeekerProfile,
  fetchEmployerProfile,
  type JobSeekerProfile,
  type EmployerProfile,
} from "./profile-completion";
import { ApprovalStatus, VerificationStatus, UserRole } from "./enums";

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
  employer?: EmployerProfile;
}

export interface AuthContextType {
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
      if (user.role === UserRole.JOB_SEEKER) {
        const jobSeekerProfile = await fetchJobSeekerProfile();
        setProfile({ jobSeeker: jobSeekerProfile });

        // Check if approvalStatus is NOT_STARTED
        if (jobSeekerProfile.approvalStatus === ApprovalStatus.NOT_STARTED) {
          const currentPath = window.location.pathname;
          if (!currentPath.includes("/pages/jobseeker/auth/complete-profile")) {
            router.push("/pages/jobseeker/auth/complete-profile");
            return;
          }
        }

        // Check for required profile fields - redirect if any are missing
        const requiredFields = [
          jobSeekerProfile.address,
          jobSeekerProfile.jobTitle,
          jobSeekerProfile.brief,
          jobSeekerProfile.preferredLocation,
          jobSeekerProfile.state,
          jobSeekerProfile.city,
          jobSeekerProfile.cvDocumentId,
        ];

        const hasMissingFields = requiredFields.some(
          (field) => field === null || field === undefined || field === ""
        );

        if (hasMissingFields) {
          const currentPath = window.location.pathname;
          if (!currentPath.includes("/pages/jobseeker/auth/complete-profile")) {
            router.push("/pages/jobseeker/auth/complete-profile");
          }
        }
      } else if (user.role === UserRole.EMPLOYER) {
        const employerProfile = await fetchEmployerProfile();
        setProfile({ employer: employerProfile });

        // Only redirect to onboarding if verification status is NOT_STARTED
        const verification = employerProfile.verification;
        if (
          !verification ||
          verification.status === VerificationStatus.NOT_STARTED
        ) {
          // Only redirect if not already on profile page
          const currentPath = window.location.pathname;
          if (!currentPath.includes(" /pages/employer/authcomplete-profile")) {
            router.push(" /pages/employer/auth/complete-profile");
          }
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }, [user, router]);

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
    // Backend now sends consistent role values (JOBSEEKER, EMPLOYER, ADMIN)
    // No normalization needed - use role as-is
    const userRole = authResult.user.role as UserRole;

    // Store tokens in cookies immediately after login
    setAuthTokens(authResult.accessToken, authResult.refreshToken, userRole);

    // Prepare user data
    const userData: User = {
      id: authResult.user.id,
      email: authResult.user.email,
      role: userRole,
      profileId: authResult.user.profileId || "",
      firstName: authResult.user.firstName,
      lastName: authResult.user.lastName,
    };

    // Store user data in cookies
    setUserData(userData);

    // Update user state
    setUser(userData);

    // Check profile completion and redirect accordingly
    const redirectPath = await checkProfileCompletion(userRole);

    if (redirectPath) {
      router.push(redirectPath);
    } else {
      // Profile is complete, redirect to dashboard
      if (userRole === UserRole.EMPLOYER) {
        router.push("/pages/employer/dashboard");
      } else {
        router.push("/pages/jobseeker/dashboard");
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
      if (userRole === UserRole.EMPLOYER) {
        const path = await checkEmployerProfileCompletion();
        return path || null;
      } else if (userRole === UserRole.JOB_SEEKER) {
        const path = await checkJobSeekerProfileCompletion();
        return path || null;
      }
    } catch (error) {
      console.error("Error checking profile completion:", error);
      // If profile check fails, redirect to profile page to be safe
      if (userRole === UserRole.EMPLOYER) {
        return " /pages/employer/auth/complete-profile";
      } else if (userRole === UserRole.JOB_SEEKER) {
        return "/pages/jobseeker/auth/complete-profile";
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
