import { Suspense, useEffect } from "react";
import { SidebarOrganizationButtonClient } from "./_SidebarOrganizationButtonClient";
import { useOrganization } from "@/hooks/use-organization";
import { useProfile } from "@/hooks/use-profile";
import { SignOutButton } from "@/components/customs/SignOutButton";

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

  // Handle no selected organization
  if (!organizations || organizations.length === 0 || !currentUser || error) {
    return <SignOutButton />;
  }

  return (
    <SidebarOrganizationButtonClient
      user={currentUser}
      orgName={organizations[0].orgName}
      imageUrl={organizations[0].imageUrl}
    />
  );
}
