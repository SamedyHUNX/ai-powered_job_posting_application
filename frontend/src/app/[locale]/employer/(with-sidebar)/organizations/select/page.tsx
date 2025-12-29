"use client";

import { useEffect } from "react";
import { useOrganizations } from "@/hooks/use-organizations";
import { OrganizationListWithTranslation } from "@/features/organizations/components/OrganizationListWithTranslation";

export default function OrganizationSelectPage() {
  const { clearSelectedOrganization } = useOrganizations();

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
