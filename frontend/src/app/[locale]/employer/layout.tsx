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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

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

      <Dialog open={showOrgDialog} onOpenChange={setShowOrgDialog}>
        <DialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-slate-50">
              Create an Organization
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400">
              To post job listings and manage your employer profile, you'll need
              to create an organization first.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              An organization allows you to:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400 list-disc list-inside">
              <li>Post and manage job listings</li>
              <li>Track applications</li>
              <li>Build your employer brand</li>
              <li>Collaborate with team members</li>
            </ul>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Maybe Later
            </Button>
            <Button asChild>
              <Link href="/employer/organizations/new">
                Create Organization
              </Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
