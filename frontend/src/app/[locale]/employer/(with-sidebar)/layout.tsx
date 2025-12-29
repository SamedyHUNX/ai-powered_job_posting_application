"use client";

import { ReactNode } from "react";
import { ClipboardListIcon } from "lucide-react";
import { SidebarNavMenuGroup } from "@/components/sidebar/sidebar-nav-menu-group";
import { SidebarOrganizationButton } from "@/features/organizations/components/sidebar-organization-button";
import { BackHomeButton } from "@/components/customs/custom-buttons";
import { useLocale } from "next-intl";
import { useOrganizations } from "@/hooks/use-organizations";
import { AppSidebar } from "@/components/sidebar/appsidebar";

export default function EmployerLayout({ children }: { children: ReactNode }) {
  const { selectedOrganization } = useOrganizations();
  const locale = useLocale();
  return (
    <AppSidebar
      content={
        <>
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
      {children}
    </AppSidebar>
  );
}
