import { Suspense } from "react";
import { SidebarOrganizationButtonClient } from "./_SidebarOrganizationButtonClient";
import { useOrganization } from "@/hooks/use-organization";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const SidebarOrganizationButton = () => {
  return (
    <Suspense>
      <SidebarOrganizationSuspense />
    </Suspense>
  );
};

function SidebarOrganizationSuspense() {
  const { selectedOrganization, isLoading, error } = useOrganization();

  // Handle loading state
  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  // Handle error state
  if (error) {
    return <div className="text-center">Error loading organization!</div>;
  }

  // Handle undefined profile (no token or failed to load)
  if (!selectedOrganization) {
    return <div className="text-center">No organization found!</div>;
  }

  return (
    <SidebarOrganizationButtonClient
      orgName={selectedOrganization.orgName}
      imageUrl={selectedOrganization.imageUrl}
    />
  );
}
