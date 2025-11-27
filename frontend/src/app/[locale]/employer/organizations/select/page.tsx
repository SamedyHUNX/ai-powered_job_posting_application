import { OrganizationList } from "@/features/organizations/components/OrganizationList";
import { Suspense } from "react";

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

async function SuspendedPage({ searchParams }: Props) {
  const { redirect } = await searchParams;
  const redirectUrl = redirect ?? "/employer/dashboard";

  return (
    <OrganizationList
      hidePersonal
      hideSlug
      afterSelectOrganizationUrl={redirectUrl}
      afterCreateOrganizationUrl={redirectUrl}
    />
  );
}
