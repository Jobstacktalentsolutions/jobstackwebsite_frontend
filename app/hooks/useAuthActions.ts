import { useAuth } from "@/app/lib/auth-context";
import { AuthService } from "@/app/services/auth.service";
import type { LoginDto } from "@/app/types/auth.type";
import type { RecruiterRegistrationDto } from "@/app/types/recruiter.type";
import type { JobSeekerRegistrationDto } from "@/app/types/jobseeker.type";

export function useAuthActions() {
  const { login, logout } = useAuth();

  // Get token from cookies instead of context
  const getToken = () => {
    if (typeof window !== "undefined") {
      return document.cookie
        .split("; ")
        .find((row) => row.startsWith("jobstack_access_token="))
        ?.split("=")[1];
    }
    return null;
  };

  const loginRecruiter = async (dto: LoginDto) => {
    const authResult = await AuthService.loginRecruiter(dto);
    login(authResult);
    return authResult;
  };

  const registerRecruiter = async (dto: RecruiterRegistrationDto) => {
    const authResult = await AuthService.registerRecruiter(dto);
    login(authResult);
    return authResult;
  };

  const loginJobSeeker = async (dto: LoginDto) => {
    const authResult = await AuthService.loginJobSeeker(dto);
    login(authResult);
    return authResult;
  };

  const registerJobSeeker = async (dto: JobSeekerRegistrationDto) => {
    const registerResponse = await AuthService.registerJobSeeker(dto);
    // Job seeker registration returns a different structure
    if (registerResponse.data) {
      login(registerResponse.data);
    }
    return registerResponse;
  };

  const logoutUser = async () => {
    try {
      // Try to logout from server (we don't know the user type, so we'll try both)
      // The interceptor will automatically add the auth token from cookies
      await Promise.allSettled([
        AuthService.logoutRecruiter(),
        AuthService.logoutJobSeeker(),
      ]);
    } finally {
      // Always clear local auth state
      logout();
    }
  };

  return {
    loginRecruiter,
    registerRecruiter,
    loginJobSeeker,
    registerJobSeeker,
    logout: logoutUser,
  };
}
