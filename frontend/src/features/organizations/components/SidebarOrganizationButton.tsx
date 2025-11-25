import { Suspense, useEffect } from "react";
import { SidebarOrganizationButtonClient } from "./_SidebarOrganizationButtonClient";
import { useOrganization } from "@/hooks/use-organization";
import { useProfile } from "@/hooks/use-profile";

export const SidebarOrganizationButton = () => {
  return (
    <Suspense>
      <SidebarOrganizationSuspense />
    </Suspense>
  );
};

function SidebarOrganizationSuspense() {
  const { organizations, isLoading, error, fetchOrganizationsByUser } =
    useOrganization();
  const { currentUser } = useProfile();

  useEffect(() => {
    if (currentUser?.id) {
      fetchOrganizationsByUser(currentUser.id);
    }
  }, [currentUser?.id]);

  // Handle loading state
  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  // Handle error state
  if (error) {
    return <div className="text-center">Error loading organizations!</div>;
  }

  // Handle no selected organization
  if (!organizations || organizations.length === 0) {
    return <div className="text-center">No organization found!</div>;
  }

  return (
    <SidebarOrganizationButtonClient
      orgName={organizations[0].orgName}
      imageUrl={organizations[0].imageUrl}
    />
  );
}
