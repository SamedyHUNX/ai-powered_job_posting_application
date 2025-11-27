import { Suspense } from "react";
import { SidebarOrganizationButtonClient } from "./_SidebarOrganizationButtonClient";
import { useOrganization } from "@/hooks/use-organization";
import { useProfile } from "@/hooks/use-profile";
import { BackHomeButton } from "@/components/customs/CustomButtons";

export const SidebarOrganizationButton = () => {
  return (
    <Suspense>
      <SidebarOrganizationSuspense />
    </Suspense>
  );
};

function SidebarOrganizationSuspense() {
  const { selectedOrganization, isLoading, error } = useOrganization();
  const { currentUser } = useProfile();

  // Handle loading state
  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  // Handle no selected organization
  if (!currentUser || error) {
    return <BackHomeButton variant="destructive" />;
  }

  return (
    <SidebarOrganizationButtonClient
      user={currentUser}
      orgName={selectedOrganization?.orgName ?? null}
      imageUrl={selectedOrganization?.imageUrl ?? null}
    />
  );
}
