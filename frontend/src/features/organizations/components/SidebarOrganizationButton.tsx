import { SidebarOrganizationButtonClient } from "./_SidebarOrganizationButtonClient";
import { useOrganization } from "@/hooks/use-organizations";
import { useProfile } from "@/hooks/use-profile";
import { BackHomeButton } from "@/components/customs/custom-buttons";

export const SidebarOrganizationButton = () => {
  const { selectedOrganization } = useOrganization();
  const { currentUser } = useProfile();

  // Handle no selected organization
  if (!currentUser || !selectedOrganization) {
    return <BackHomeButton variant="destructive" />;
  }

  return (
    <SidebarOrganizationButtonClient
      user={currentUser}
      orgName={selectedOrganization?.orgName ?? null}
      imageUrl={selectedOrganization?.imageUrl ?? null}
    />
  );
};
