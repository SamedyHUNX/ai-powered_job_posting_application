"use client";

import { useEffect } from "react";
import { useOrganization } from "@/hooks/use-organization";
import { OrganizationListWithTranslation } from "@/features/organizations/components/OrganizationListWithTranslation";

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
