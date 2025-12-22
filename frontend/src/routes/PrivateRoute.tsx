"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function PrivateRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace("/auth/signin");
    }
  }, [isAuthenticated, isInitialized, router]);

  // Only render children if authenticated
  return <>{isAuthenticated && children}</>;
}
