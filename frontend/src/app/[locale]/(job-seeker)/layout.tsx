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
import { useProfile } from "@/hooks/use-profile";
import { Loading } from "@/components/customs/Loading";

export default function JobSeekerLayout({ children }: { children: ReactNode }) {
  const { selectedOrganization } = useOrganization();
  const { currentUser, isFetchingCurrentUser } = useProfile();
  const jobSeekerT = useTranslations("jobSeeker");
  const sidebarT = useTranslations("jobSeeker.sidebar.navMenuGroups");

  if (isFetchingCurrentUser) {
    return <Loading message={jobSeekerT("loading")} />;
  }

  const href = selectedOrganization
    ? `/employer/organizations/${selectedOrganization.orgName}`
    : "/employer/organizations/select";

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
              authStatus: currentUser ? "signedIn" : "signedOut",
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
