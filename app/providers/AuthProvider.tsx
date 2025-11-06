"use client";

import { AuthProvider } from "@/app/contexts/AuthContext";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return <AuthProvider>{children}</AuthProvider>;
}
