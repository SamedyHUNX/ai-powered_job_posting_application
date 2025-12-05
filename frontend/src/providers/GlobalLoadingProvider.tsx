"use client";

import { useAppSelector } from "@/store/hooks";
import { Loading } from "@/components/customs/Loading";
import { ReactNode } from "react";
import { useProfile } from "@/hooks/use-profile";
import { useParams } from "next/navigation";

export function GlobalLoadingProvider({ children }: { children: ReactNode }) {
  const { locale } = useParams();
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
      {isGlobalLoading && (
        <Loading
          message={
            locale === "de"
              ? "Lädt..."
              : locale === "kh"
              ? "កំពុងដំណើរការ..."
              : "Loading..."
          }
        />
      )}
      {children}
    </>
  );
}
