"use client";

import { ReactNode, Suspense } from "react";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { ClipboardListIcon, PlusIcon } from "lucide-react";
import { SidebarNavMenuGroup } from "@/components/sidebar/SidebarNavMenuGroup";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { SidebarOrganizationButton } from "@/features/organizations/components/SidebarOrganizationButton";
import { useOrganization } from "@/hooks/use-organization";

import { Loading } from "@/components/customs/Loading";

export default function EmployerDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Suspense fallback={<Loading />}>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
}

function DashboardLayoutContent({ children }: { children: ReactNode }) {
  const {
    selectedOrganization,
    isFetchingOrganizations,
    isFetchingOrganizationsError,
  } = useOrganization();

  if (isFetchingOrganizations) {
    return <Loading />;
  }

  if (isFetchingOrganizationsError) {
    return <div className="error">Error: {isFetchingOrganizationsError}</div>;
  }

  return (
    <>
      <AppSidebar
        content={
          selectedOrganization ? (
            <>
              <SidebarGroup>
                {/* <SidebarGroupLabel>Job Listings</SidebarGroupLabel>
                <SidebarGroupAction title="Add Job Listing" asChild>
                  <Link href={"/employer/job-listings/new"}>
                    <PlusIcon />
                    <span className="sr-only">Add Job Listing</span>
                  </Link>
                </SidebarGroupAction> */}
                <SidebarGroupLabel>Create Organization</SidebarGroupLabel>
                <SidebarGroupAction title="Add Job Listing" asChild>
                  <Link href={"/employer/organizations/new"}>
                    <PlusIcon />
                    <span className="sr-only">Add Organization</span>
                  </Link>
                </SidebarGroupAction>
              </SidebarGroup>
              <SidebarNavMenuGroup
                className="mt-auto"
                items={[
                  {
                    href: "/",
                    icon: <ClipboardListIcon />,
                    label: "Job Board",
                  },
                ]}
              />
            </>
          ) : undefined
        }
        footerButton={<SidebarOrganizationButton />}
      >
        {children}
      </AppSidebar>
    </>
  );
}
