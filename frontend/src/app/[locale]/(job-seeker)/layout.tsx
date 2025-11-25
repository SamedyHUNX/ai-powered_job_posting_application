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

export default function JobSeekerLayout({ children }: { children: ReactNode }) {
  return (
    <AppSidebar
      content={
        <SidebarNavMenuGroup
          className="mt-auto"
          items={[
            {
              href: "/",
              icon: <ClipboardListIcon />,
              label: "Find Jobs",
              authStatus: "signedIn",
            },
            {
              href: "/ai-search",
              icon: <BrainCircuitIcon />,
              label: "AI Search",
              authStatus: "signedIn",
            },
            {
              href: "/employer",
              icon: <LayoutDashboard />,
              label: "Employer Dashboard",
              authStatus: "signedIn",
            },
          ]}
        />
      }
      footerButton={<SidebarUserButton />}
    >
      {children}
    </AppSidebar>
  );
}
