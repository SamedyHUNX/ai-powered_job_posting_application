"use client";

import { Suspense, use, useEffect } from "react";
import { useOrganization } from "@/hooks/use-organization";
import { OrganizationListWithTranslation } from "@/features/organizations/components/OrganizationListWithTranslation";

type Props = {
  searchParams: Promise<{ redirect?: string }>;
};

export default function OrganizationSelectPage({ searchParams }: Props) {
  return (
    <Suspense>
      <SuspendedPage searchParams={searchParams} />
    </Suspense>
  );
}

function SuspendedPage({ searchParams }: Props) {
  const params = use(searchParams);
  const redirect = params?.redirect;
  const { clearSelectedOrganization } = useOrganization();

  // Whenever the user reaches this page
  // Clear the selected organization
  useEffect(() => {
    clearSelectedOrganization();
  }, [clearSelectedOrganization]);

  return (
    <OrganizationListWithTranslation
      hidePersonal
      afterSelectOrganizationUrl={redirect}
      afterCreateOrganizationUrl={redirect ?? "/employer/organizations/:slug"}
    />
  );
}
