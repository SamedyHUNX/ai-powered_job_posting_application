"use client";

import { ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Loading } from "@/components/customs/loading";
import { useAuth } from "@/hooks/use-auth";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, isInitialized } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // remove leading locale segment
  const localePattern = new RegExp(`^/(${routing.locales.join("|")})(/|$)`);
  const normalizedPath = pathname.replace(localePattern, "/");

  useEffect(() => {
    if (!isInitialized) return;

    if (isAuthenticated && normalizedPath.startsWith("/auth")) {
      router.replace("/"); // will resolve to /en/ automatically if you push with locale
    } else if (!isAuthenticated && !normalizedPath.startsWith("/auth")) {
      router.replace("/auth/signin");
    }
  }, [isAuthenticated, isInitialized, normalizedPath, router]);

  if (!isInitialized) {
    return <Loading />;
  }

  return <>{children}</>;
}
