import { Suspense } from "react";
import { SidebarOrganizationButtonClient } from "./_SidebarOrganizationButtonClient";
import { useOrganization } from "@/hooks/use-organization";
import { Button } from "@/components/ui/button";

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
    return <div>Loading...</div>;
  }

  // Handle error state
  if (error) {
    return <div>Error loading organization!</div>;
  }

  // Handle undefined profile (no token or failed to load)
  if (!selectedOrganization) {
    return <Button className="w-full">Create an organization</Button>;
  }

  return (
    <SidebarOrganizationButtonClient
      orgName={selectedOrganization.orgName}
      imageUrl={selectedOrganization.imageUrl}
    />
  );
}
