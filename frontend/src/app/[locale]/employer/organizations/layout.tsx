"use client";

import { ReactNode } from "react";
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
import { NavBar } from "@/components/customs/Navbar";
import { BackHomeButton } from "@/components/customs/CustomButtons";
import PrivateRoute from "@/routes/PrivateRoute";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocale } from "next-intl";

export default function EmployerLayout({ children }: { children: ReactNode }) {
  const { selectedOrganization } = useOrganization();
  const locale = useLocale();
  const isMobile = useIsMobile();
  
  return (
    <PrivateRoute>
      <AppSidebar
        content={
          <>
            <SidebarGroup>
              <SidebarGroupLabel>Add Job Listing</SidebarGroupLabel>
              <SidebarGroupAction title="Add Job Listing" asChild>
                <Link href={"/employer/job-listings/new"}>
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
            <BackHomeButton variant="destructive" locale={locale} />
          )
        }
      >
        {!isMobile && <NavBar />}
        {children}
      </AppSidebar>
    </PrivateRoute>
  );
}
