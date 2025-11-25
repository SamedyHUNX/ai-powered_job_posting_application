import { Suspense } from "react";
import { SidebarOrganizationButtonClient } from "./_SidebarOrganizationButtonClient";
import { useOrganization } from "@/hooks/use-organization";

export const SidebarOrganizationButton = () => {
  return (
    <Suspense>
      <SidebarOrganizationSuspense />
    </Suspense>
  );
};

function SidebarOrganizationSuspense() {
  const { organizations, isLoading, fetchOrganizationsByUser, error } =
    useOrganization();

  // Handle loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (error) {
    return <div>Error loading profile</div>;
  }

  // Handle undefined profile (no token or failed to load)
  if (!fetchOrganizationsByUser) {
    return null;
  }

  return (
    <SidebarOrganizationButtonClient
      email={organization.email}
      name={organization.name}
      imageUrl={organization.imageUrl}
    />
  );
}
