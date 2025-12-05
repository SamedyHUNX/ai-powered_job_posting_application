"use client";

import { useAppSelector } from "@/store/hooks";
import { Loading } from "@/components/customs/Loading";
import { ReactNode } from "react";
import { useTranslations } from "next-intl";

export function GlobalLoadingProvider({ children }: { children: ReactNode }) {
  // Check all slices that have isLoading property
  const authLoading = useAppSelector((state) => state.auth.isLoading);
  const orgsLoading = useAppSelector((state) => state.organizations.isLoading);
  const jobsLoading = useAppSelector((state) => state.jobListings.isLoading);

  // Get translated loading message
  const t = useTranslations("common");

  const isGlobalLoading = authLoading || orgsLoading || jobsLoading;

  return (
    <>
      {isGlobalLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <Loading message={t("loading")} />
        </div>
      )}
      {children}
    </>
  );
}