// src/hooks/useAuth.ts

import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../api/auth";

export const useAuth = () => {
  // 🔥 CHECK TOKEN FIRST
  const token = localStorage.getItem("access");

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["me"],

    // 🔥 ONLY CALL API IF TOKEN EXISTS
    queryFn: getCurrentUser,

    enabled: !!token, // 🔥 CRITICAL FIX

    retry: false,

    // 🔥 PREVENT AUTO REFETCH LOOP
    refetchOnWindowFocus: false,
  });

  /* ============================
     🔐 ROLE HANDLING
  ============================ */
  const role = user?.role?.toUpperCase();

  return {
    user,

    isLoading,
    isError,

    isAuthenticated: !!user && !!token,

    isAdmin: role === "ORG_ADMIN",
    isHR: role === "HR",
    isDeveloper: role === "DEVELOPER",
    isTester: role === "TESTER",
    isSuperuser: role === "SUPERADMIN" || user?.username === "sattuadmin",
    hasRole: (expectedRole: string) => role === expectedRole.toUpperCase(),
  };
};
