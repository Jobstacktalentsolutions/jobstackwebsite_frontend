import { empLogin, empRegister, empLogout } from "@/app/api/auth-employer.api";
import { jsLogin, jsRegister, jsLogout } from "@/app/api/auth-jobseeker.api";
import type { LoginDto } from "@/app/types/auth.type";
import type { EmployerRegistrationDto } from "@/app/types/employer.type";
import type { JobSeekerRegistrationDto } from "@/app/types/jobseeker.type";

export class AuthService {
  // Employer auth methods
  static async loginEmployer(dto: LoginDto) {
    return await empLogin(dto);
  }

  static async registerEmployer(dto: EmployerRegistrationDto) {
    return await empRegister(dto);
  }

  static async logoutEmployer() {
    return await empLogout();
  }

  // Job seeker auth methods
  static async loginJobSeeker(dto: LoginDto) {
    return await jsLogin(dto);
  }

  static async registerJobSeeker(dto: JobSeekerRegistrationDto) {
    return await jsRegister(dto);
  }

  static async logoutJobSeeker() {
    return await jsLogout();
  }
}
