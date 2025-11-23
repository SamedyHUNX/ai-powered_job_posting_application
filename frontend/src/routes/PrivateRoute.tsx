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

  // Show nothing while checking auth state
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Only render children if authenticated
  return <>{isAuthenticated && children}</>;
}
