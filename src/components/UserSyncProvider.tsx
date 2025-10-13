"use client";

import { useUserSync } from "@/hooks/useUserSync";

interface UserSyncProviderProps {
  children: React.ReactNode;
}

export function UserSyncProvider({ children }: UserSyncProviderProps) {
  // This hook synchronizes Better Auth session data with Redux store
  useUserSync();

  return <>{children}</>;
}
