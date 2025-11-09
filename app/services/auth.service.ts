import { rcLogin, rcRegister, rcLogout } from "@/app/api/auth-recruiter.api";
import { jsLogin, jsRegister, jsLogout } from "@/app/api/auth-jobseeker.api";
import type { LoginDto } from "@/app/types/auth.type";
import type { RecruiterRegistrationDto } from "@/app/types/recruiter.type";
import type { JobSeekerRegistrationDto } from "@/app/types/jobseeker.type";

export class AuthService {
  // Recruiter auth methods
  static async loginRecruiter(dto: LoginDto) {
    return await rcLogin(dto);
  }

  static async registerRecruiter(dto: RecruiterRegistrationDto) {
    return await rcRegister(dto);
  }

  static async logoutRecruiter() {
    return await rcLogout();
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
