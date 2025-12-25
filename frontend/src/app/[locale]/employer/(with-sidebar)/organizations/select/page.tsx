"use client";

import { useEffect } from "react";
import { useOrganization } from "@/hooks/use-organizations";
import { OrganizationListWithTranslation } from "@/features/organizations/components/OrganizationListWithTranslation";

/**
 * Displays the organization selection page and clears any previously selected organization when mounted.
 *
 * Renders a translated organization list configured to hide personal organizations and to navigate to
 * "/de/employer/organizations/select" after creating a new organization.
 *
 * @returns The JSX element for the organization selection page.
 */
export default function OrganizationSelectPage() {
  const { clearSelectedOrganization } = useOrganization();

  // Clear any previously selected org when landing here
  useEffect(() => {
    clearSelectedOrganization();
  }, [clearSelectedOrganization]);

  return (
    <OrganizationListWithTranslation
      hidePersonal
      afterCreateOrganizationUrl="/de/employer/organizations/select"
    />
  );
}