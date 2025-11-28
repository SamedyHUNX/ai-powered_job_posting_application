"use client";

import { Suspense, use, useEffect } from "react";
import { OrganizationList } from "@/features/organizations/components/OrganizationList";
import { useOrganization } from "@/hooks/use-organization";

type Props = {
  searchParams: Promise<{ redirect?: string }>;
};

export default async function OrganizationSelectPage(props: Props) {
  return (
    <Suspense>
      <SuspendedPage {...props} />
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
    <OrganizationList
      hidePersonal
      hideSlug
      afterSelectOrganizationUrl={redirect}
      afterCreateOrganizationUrl={redirect ?? "/employer/organizations/:slug"}
    />
  );
}
