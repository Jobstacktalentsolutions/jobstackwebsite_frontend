/**
 * Cookie utility functions for managing authentication tokens using js-cookie
 */

import Cookies from "js-cookie";

const COOKIE_NAMES = {
  ACCESS_TOKEN: "jobstack_access_token",
  REFRESH_TOKEN: "jobstack_refresh_token",
  USER_ROLE: "jobstack_user_role",
  USER_DATA: "jobstack_user_data",
} as const;

const isProduction = process.env.NODE_ENV === "production";

/**
 * Store authentication tokens in cookies
 */
export function setAuthTokens(
  accessToken: string,
  refreshToken: string,
  role: string
): void {
  // Access token expires in 2 days
  Cookies.set(COOKIE_NAMES.ACCESS_TOKEN, accessToken, {
    expires: 2,
    secure: isProduction,
    sameSite: "strict",
    path: "/",
  });

  // Refresh token expires in 7 days
  Cookies.set(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, {
    expires: 7,
    secure: isProduction,
    sameSite: "strict",
    path: "/",
  });

  // Store user role
  Cookies.set(COOKIE_NAMES.USER_ROLE, role, {
    expires: 7,
    secure: isProduction,
    sameSite: "strict",
    path: "/",
  });
}

/**
 * Get the access token from cookies
 */
export function getAccessToken(): string | undefined {
  return Cookies.get(COOKIE_NAMES.ACCESS_TOKEN);
}

/**
 * Get the refresh token from cookies
 */
export function getRefreshToken(): string | undefined {
  return Cookies.get(COOKIE_NAMES.REFRESH_TOKEN);
}

/**
 * Get the user role from cookies
 */
export function getUserRole(): string | undefined {
  return Cookies.get(COOKIE_NAMES.USER_ROLE);
}

/**
 * Store user data in cookies
 */
export function setUserData(userData: any): void {
  Cookies.set(COOKIE_NAMES.USER_DATA, JSON.stringify(userData), {
    expires: 7,
    secure: isProduction,
    sameSite: "strict",
    path: "/",
  });
}

/**
 * Get user data from cookies
 */
export function getUserData(): any | null {
  const data = Cookies.get(COOKIE_NAMES.USER_DATA);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

/**
 * Clear all authentication cookies
 */
export function clearAuthTokens(): void {
  Cookies.remove(COOKIE_NAMES.ACCESS_TOKEN, { path: "/" });
  Cookies.remove(COOKIE_NAMES.REFRESH_TOKEN, { path: "/" });
  Cookies.remove(COOKIE_NAMES.USER_ROLE, { path: "/" });
  Cookies.remove(COOKIE_NAMES.USER_DATA, { path: "/" });
}

/**
 * Check if user is authenticated (has tokens)
 */
export function isAuthenticated(): boolean {
  return !!getAccessToken() && !!getRefreshToken();
}
