"use client";

import { ReactNode, Suspense, useEffect, useState } from "react";
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
import { useRouter } from "next/navigation";
import { CustomDialog } from "@/components/customs/CustomDialog";

const benefits = [
  "Post and manage job listings",
  "Track applications",
  "Build your employer brand",
  "Collaborate with team members",
];

export default function EmployerLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense>
      <LayoutSuspense>{children}</LayoutSuspense>
    </Suspense>
  );
}

function LayoutSuspense({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { selectedOrganization } = useOrganization();
  const [showOrgDialog, setShowOrgDialog] = useState(false);

  useEffect(() => {
    // Show dialog if no organization exists
    if (!selectedOrganization) {
      setShowOrgDialog(true);
    }
  }, [selectedOrganization]);

  const handleCancel = () => {
    setShowOrgDialog(false);
    router.push("/");
  };

  // If organization exists, render normally
  if (selectedOrganization) {
    return (
      <AppSidebar
        content={
          <>
            <SidebarGroup>
              <SidebarGroupLabel>Job Listings</SidebarGroupLabel>
              <SidebarGroupAction title="Add Job Listing" asChild>
                <Link href={"/employer/job-listings/new"}>
                  <PlusIcon />
                  <span className="sr-only">Add Job Listing</span>
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
        footerButton={<SidebarOrganizationButton />}
      >
        {children}
      </AppSidebar>
    );
  }

  // If no organization, show dialog
  return (
    <>
      <AppSidebar
        content={
          <>
            <SidebarGroup>
              <SidebarGroupLabel>Job Listings</SidebarGroupLabel>
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
        footerButton={<SidebarOrganizationButton />}
      >
        {children}
      </AppSidebar>

      <CustomDialog
        title="Create an Organization"
        description="To post job listings and manage your employer profile, you'll need to create an organization first."
        open={showOrgDialog}
        onOpenChange={setShowOrgDialog}
        onCancel={handleCancel}
        additionalDescTitle="An organization allows you to:"
        additionalDesc={benefits}
        href={"/employer/organizations/new"}
      />
    </>
  );
}
