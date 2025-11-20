"use client";

import { UserRole } from "@/app/lib/enums";

const PROFILE_SKIP_KEYS: Record<UserRole, string> = {
  [UserRole.ADMIN]: "jobstack:skip-admin-profile", // unused but kept for completeness
  [UserRole.EMPLOYER]: "jobstack:skip-employer-profile",
  [UserRole.JOB_SEEKER]: "jobstack:skip-jobseeker-profile",
};

function canUseSessionStorage() {
  return typeof window !== "undefined" && typeof sessionStorage !== "undefined";
}

export function markProfileSkipSession(role: UserRole) {
  if (!canUseSessionStorage()) return;
  sessionStorage.setItem(PROFILE_SKIP_KEYS[role], "true");
}

export function hasProfileSkipSession(role: UserRole): boolean {
  if (!canUseSessionStorage()) return false;
  return sessionStorage.getItem(PROFILE_SKIP_KEYS[role]) === "true";
}

export function clearProfileSkipSession(role: UserRole) {
  if (!canUseSessionStorage()) return;
  sessionStorage.removeItem(PROFILE_SKIP_KEYS[role]);
}

export function clearAllProfileSkipSessions() {
  if (!canUseSessionStorage()) return;
  Object.values(PROFILE_SKIP_KEYS).forEach((key) =>
    sessionStorage.removeItem(key)
  );
}
