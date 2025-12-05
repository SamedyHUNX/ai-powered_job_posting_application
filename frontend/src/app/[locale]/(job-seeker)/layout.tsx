"use client";

import { ReactNode } from "react";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import {
  BrainCircuitIcon,
  ClipboardListIcon,
  LayoutDashboard,
} from "lucide-react";
import { SidebarUserButton } from "@/features/users/components/SidebarUserButton";
import { SidebarNavMenuGroup } from "@/components/sidebar/SidebarNavMenuGroup";
import { NavBar } from "@/components/customs/Navbar";
import { useOrganization } from "@/hooks/use-organization";
import { useTranslations } from "next-intl";

export default function JobSeekerLayout({ children }: { children: ReactNode }) {
  const { selectedOrganization } = useOrganization();
  const sidebarT = useTranslations("jobSeeker.sidebar.navMenuGroups");

  let href = "";
  if (selectedOrganization) {
    href = `/employer/organizations/${selectedOrganization.orgName}`;
  } else {
    href = "/employer/organizations/select";
  }

  return (
    <AppSidebar
      content={
        <SidebarNavMenuGroup
          className="mt-auto"
          items={[
            {
              href: "/",
              icon: <ClipboardListIcon />,
              label: sidebarT("findJobs"),
            },
            {
              href: "/ai-search",
              icon: <BrainCircuitIcon />,
              label: sidebarT("aiSearch"),
            },
            {
              href,
              icon: <LayoutDashboard />,
              label: sidebarT("employerDashboard"),
              authStatus: "signedIn",
            },
          ]}
        />
      }
      footerButton={<SidebarUserButton />}
    >
      <NavBar />
      {children}
    </AppSidebar>
  );
}
