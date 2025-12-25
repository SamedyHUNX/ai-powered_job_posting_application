"use client";

import { useAppSelector } from "@/store/hooks";
import { ReactNode } from "react";
import { useProfile } from "@/hooks/use-profile";
import { useLocale } from "next-intl";
import { Loading } from "@/components/customs/loading";

export function GlobalLoadingProvider({ children }: { children: ReactNode }) {
  const locale = useLocale();
  const { isFetchingCurrentUser } = useProfile();
  const authLoading = useAppSelector(
    (state) =>
      state.auth.isLoading &&
      state.auth.isInitialized &&
      !state.auth.isAuthenticated
  );
  const orgsLoading = useAppSelector((state) => state.organizations.isLoading);
  const jobsLoading = useAppSelector((state) => state.jobListings.isLoading);

  const isGlobalLoading =
    orgsLoading || jobsLoading || authLoading || isFetchingCurrentUser;

  return (
    <>
      {isGlobalLoading && <Loading locale={locale} />}
      {children}
    </>
  );
}
