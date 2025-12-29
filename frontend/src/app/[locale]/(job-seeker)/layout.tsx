"use client";

import { ReactNode } from "react";
import {
  BrainCircuitIcon,
  ClipboardListIcon,
  LayoutDashboard,
} from "lucide-react";
import { SidebarUserButton } from "@/features/users/components/SidebarUserButton";
import { SidebarNavMenuGroup } from "@/components/sidebar/sidebar-nav-menu-group";
import { useOrganizations } from "@/hooks/use-organizations";
import { useTranslations } from "next-intl";
import { useProfile } from "@/hooks/use-profile";
import { AppSidebar } from "@/components/sidebar/appsidebar";

export default function JobSeekerLayout({ children }: { children: ReactNode }) {
  const { selectedOrganization } = useOrganizations();
  const { currentUser } = useProfile();
  const sidebarT = useTranslations("sidebar.navMenuGroups");
  const isSuperAdmin = currentUser?.userRole === "SUPER-ADMIN";

  const href = selectedOrganization
    ? `/employer/organizations/${selectedOrganization.slug}`
    : "/employer/organizations/select";

  return (
    <AppSidebar
      content={
        <SidebarNavMenuGroup
          className="mt-auto"
          items={
            [
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
                authStatus: currentUser ? "signedIn" : "signedOut",
              },
              isSuperAdmin && {
                href: "/super-admin/dashboard",
                icon: <LayoutDashboard />,
                label: sidebarT("superAdminDashboard"),
                authStatus: currentUser ? "signedIn" : "signedOut",
              },
            ].filter(Boolean) as any[]
          }
        />
      }
      footerButton={<SidebarUserButton />}
    >
      {children}
    </AppSidebar>
  );
}
