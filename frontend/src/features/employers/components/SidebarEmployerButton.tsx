import { Suspense, useEffect } from "react";
import { useOrganization } from "@/hooks/use-organization";
import { useProfile } from "@/hooks/use-profile";
import { BackHomeButton } from "@/components/customs/CustomButtons";
import { SidebarEmployerButtonClient } from "./_SidebarEmployerButton";

export const SidebarEmployerButton = () => {
  return (
    <Suspense>
      <SidebarEmployerSuspense />
    </Suspense>
  );
};

function SidebarEmployerSuspense() {
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
    return <BackHomeButton variant="destructive" />;
  }

  return <SidebarEmployerButtonClient user={currentUser} />;
}
