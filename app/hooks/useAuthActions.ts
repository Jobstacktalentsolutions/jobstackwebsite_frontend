import { useAuth } from "@/app/lib/auth-context";
import { AuthService } from "@/app/services/auth.service";
import type { LoginDto } from "@/app/types/auth.type";
import type { EmployerRegistrationDto } from "@/app/types/employer.type";
import type { JobSeekerRegistrationDto } from "@/app/types/jobseeker.type";

export function useAuthActions() {
  const { login, logout } = useAuth();

  const loginEmployer = async (dto: LoginDto) => {
    const authResult = await AuthService.loginEmployer(dto);
    login(authResult);
    return authResult;
  };

  const registerEmployer = async (dto: EmployerRegistrationDto) => {
    const authResult = await AuthService.registerEmployer(dto);
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
        AuthService.logoutEmployer(),
        AuthService.logoutJobSeeker(),
      ]);
    } finally {
      // Always clear local auth state
      logout();
    }
  };

  return {
    loginEmployer,
    registerEmployer,
    loginJobSeeker,
    registerJobSeeker,
    logout: logoutUser,
  };
}
