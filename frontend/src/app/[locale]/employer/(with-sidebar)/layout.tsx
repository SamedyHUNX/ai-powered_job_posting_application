"use client";

import { ReactNode } from "react";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { ClipboardListIcon } from "lucide-react";
import { SidebarNavMenuGroup } from "@/components/sidebar/SidebarNavMenuGroup";
import { SidebarOrganizationButton } from "@/features/organizations/components/SidebarOrganizationButton";
import { useOrganization } from "@/hooks/use-organization";
import { NavBar } from "@/components/customs/Navbar";
import { BackHomeButton } from "@/components/customs/CustomButtons";
import PrivateRoute from "@/routes/PrivateRoute";
import { useIsMobile } from "@/hooks/use-mobile";

export default function EmployerLayout({ children }: { children: ReactNode }) {
  const { selectedOrganization } = useOrganization();
  const isMobile = useIsMobile();
  return (
    <PrivateRoute>
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
            <BackHomeButton variant="destructive" />
          )
        }
      >
        {!isMobile && <NavBar />}
        {children}
      </AppSidebar>
    </PrivateRoute>
  );
}
