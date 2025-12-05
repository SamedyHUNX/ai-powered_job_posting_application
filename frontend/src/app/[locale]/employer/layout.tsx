"use client";

import { ReactNode, Suspense } from "react";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { ClipboardListIcon, PlusIcon } from "lucide-react";
import { SidebarNavMenuGroup } from "@/components/sidebar/SidebarNavMenuGroup";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { SidebarOrganizationButton } from "@/features/organizations/components/SidebarOrganizationButton";
import { useOrganization } from "@/hooks/use-organization";

import { Loading } from "@/components/customs/Loading";
import { NavBar } from "@/components/customs/Navbar";
import { BackHomeButton } from "@/components/customs/CustomButtons";
import PrivateRoute from "@/routes/PrivateRoute";

export default function EmployerDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <PrivateRoute>
      <Suspense fallback={<Loading />}>
        <DashboardLayoutContent>{children}</DashboardLayoutContent>
      </Suspense>
    </PrivateRoute>
  );
}

function DashboardLayoutContent({ children }: { children: ReactNode }) {
  const { selectedOrganization } = useOrganization();
  return (
    <AppSidebar
      content={
        <>
          <SidebarGroup>
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
      }
      footerButton={
        selectedOrganization ? (
          <SidebarOrganizationButton />
        ) : (
          <BackHomeButton variant="destructive" />
        )
      }
    >
      <NavBar />
      {children}
    </AppSidebar>
  );
}
