"use client";

import { useAppSelector } from "@/store/hooks";
import { Loading } from "@/components/customs/Loading";
import { ReactNode } from "react";

export function GlobalLoadingProvider({ children }: { children: ReactNode }) {
  // Only check slices that have isLoading property
  const orgsLoading = useAppSelector((state) => state.organizations.isLoading);
  const jobsLoading = useAppSelector((state) => state.jobListings.isLoading);

  const isGlobalLoading = orgsLoading || jobsLoading;

  return (
    <>
      {isGlobalLoading && <Loading />}
      {children}
    </>
  );
}
