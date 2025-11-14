/**
 * Authentication helper functions
 */

import { jsLogin, jsVerifyEmail } from "@/app/api/auth-jobseeker.api";
import { empLogin, empVerifyEmail } from "@/app/api/auth-employer.api";
import { setAuthTokens } from "./cookies";
import {
  checkJobSeekerProfileCompletion,
  checkEmployerProfileCompletion,
} from "./profile-completion";
import type {
  LoginDto,
  EmailVerificationConfirmDto,
} from "@/app/types/auth.type";

export interface LoginResult {
  success: boolean;
  redirectPath: string;
  user?: {
    id: string;
    email: string;
    role: string;
    profileId?: string;
    firstName?: string;
    lastName?: string;
  };
}

/**
 * Handle job seeker login with profile completion check
 */
export async function handleJobSeekerLogin(
  dto: LoginDto
): Promise<LoginResult> {
  try {
    const authResult = await jsLogin(dto);

    // Store tokens
    setAuthTokens(
      authResult.accessToken,
      authResult.refreshToken,
      authResult.user.role
    );

    // Check profile completion
    const redirectPath = await checkJobSeekerProfileCompletion();

    return {
      success: true,
      redirectPath: redirectPath || "/",
      user: authResult.user,
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Handle employer login with profile completion check
 */
export async function handleEmployerLogin(dto: LoginDto): Promise<LoginResult> {
  try {
    const authResult = await empLogin(dto);

    // Store tokens
    setAuthTokens(
      authResult.accessToken,
      authResult.refreshToken,
      authResult.user.role
    );

    // Check profile completion
    const redirectPath = await checkEmployerProfileCompletion();

    return {
      success: true,
      redirectPath: redirectPath || "/pages/employer",
      user: authResult.user,
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Handle job seeker email verification with profile completion check
 */
export async function handleJobSeekerEmailVerification(
  dto: EmailVerificationConfirmDto
): Promise<{ verified: boolean; redirectPath?: string }> {
  try {
    await jsVerifyEmail(dto);

    // After email verification, check if they need to complete profile
    // This assumes they're already logged in (have tokens)
    const redirectPath = await checkJobSeekerProfileCompletion();

    return {
      verified: true,
      redirectPath: redirectPath || undefined,
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Handle employer email verification with profile completion check
 */
export async function handleEmployerEmailVerification(
  dto: EmailVerificationConfirmDto
): Promise<{ verified: boolean; redirectPath?: string }> {
  try {
    await empVerifyEmail(dto);

    // After email verification, check if they need to complete profile
    const redirectPath = await checkEmployerProfileCompletion();

    return {
      verified: true,
      redirectPath: redirectPath || undefined,
    };
  } catch (error) {
    throw error;
  }
}
