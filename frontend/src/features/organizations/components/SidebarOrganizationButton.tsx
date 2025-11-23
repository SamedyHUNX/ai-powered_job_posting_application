import { Suspense } from "react";
import { useProfile } from "@/hooks/use-profile";
import { SidebarOrganizationButtonClient } from "./_SidebarOrganizationButtonClient";

export const SidebarOrganizationButton = () => {
  return (
    <Suspense>
      <SidebarOrganizationSuspense />
    </Suspense>
  );
};

function SidebarOrganizationSuspense() {
  const { Organization, isLoading, error } = useProfile();

  // Handle loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (error) {
    return <div>Error loading profile</div>;
  }

  // Handle undefined profile (no token or failed to load)
  if (!Organization) {
    return null;
  }

  return (
    <SidebarOrganizationButtonClient
      email={Organization.email}
      name={Organization.name}
      imageUrl={Organization.imageUrl}
    />
  );
}
