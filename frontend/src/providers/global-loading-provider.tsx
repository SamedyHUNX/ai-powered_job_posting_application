"use client";

import { useAppSelector } from "@/store/hooks";
import { ReactNode } from "react";
import { useProfile } from "@/hooks/use-profile";
import { Loading } from "@/components/customs/loading";
import { useLocale } from "next-intl";

export function GlobalLoadingProvider({ children }: { children: ReactNode }) {
  const { isInitialized } = useAppSelector((state) => state.auth);
  const { isFetchingCurrentUser } = useProfile();
  const locale = useLocale();

  // Show loading only if auth is not initialized yet or actively fetching user
  const isGlobalLoading = !isInitialized || isFetchingCurrentUser;

  return (
    <>
      {isGlobalLoading && <Loading locale={locale} />}
      {children}
    </>
  );
}
