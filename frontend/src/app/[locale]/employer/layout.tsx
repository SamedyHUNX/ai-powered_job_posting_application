"use client";

import { ReactNode, Suspense, useEffect, useMemo, useState } from "react";
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
import { useTranslations } from "next-intl";
import { useProfile } from "@/hooks/use-profile";
import { Loading } from "@/components/customs/Loading";

export default function EmployerLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense>
      <LayoutSuspense>{children}</LayoutSuspense>
    </Suspense>
  );
}

function LayoutSuspense({ children }: { children: ReactNode }) {
  const t = useTranslations("employer");
  const router = useRouter();
  const { currentUser } = useProfile();
  const {
    organizations,
    selectedOrganization,
    fetchOrganizationsByUser,
    isFetchingOrganizationsError,
    isFetchingOrganizations,
  } = useOrganization();
  const [showOrgDialog, setShowOrgDialog] = useState(false);
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);

  const benefits = useMemo(
    () => [
      "Post and manage job listings",
      "Track applications",
      "Build your employer brand",
      "Collaborate with team members",
    ],
    [t]
  );

  // Fetch organizations when current user is available
  useEffect(() => {
    if (currentUser?.id) {
      fetchOrganizationsByUser(currentUser.id);
    }
  }, [currentUser?.id]);

  // Track when initial load is complete
  useEffect(() => {
    if (!isFetchingOrganizations && !hasInitiallyLoaded) {
      setHasInitiallyLoaded(true);
    }
  }, [isFetchingOrganizations, hasInitiallyLoaded]);

  // Show dialog only after initial load is complete
  useEffect(() => {
    if (
      hasInitiallyLoaded &&
      !selectedOrganization &&
      organizations.length === 0
    ) {
      setShowOrgDialog(true);
    }
  }, [hasInitiallyLoaded, selectedOrganization, organizations.length]);

  const handleCancel = () => {
    setShowOrgDialog(false);
    router.push("/");
  };

  if (isFetchingOrganizations) {
    return <Loading />;
  }

  if (isFetchingOrganizationsError) {
    return <div className="error">Error: {isFetchingOrganizationsError}</div>;
  }

  return (
    <>
      <AppSidebar
        content={
          selectedOrganization ? (
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
          ) : undefined
        }
        footerButton={<SidebarOrganizationButton />}
      >
        {children}
      </AppSidebar>

      {hasInitiallyLoaded &&
        !selectedOrganization &&
        organizations.length === 0 && (
          <CustomDialog
            title="Organization not found"
            description="To post job listings and manage your employer profile, you'll need to create an organization first."
            open={showOrgDialog}
            onOpenChange={setShowOrgDialog}
            onCancel={handleCancel}
            additionalDescTitle="An organization allows you to:"
            additionalDesc={benefits}
            buttonText={"Create Organization"}
            href={"/employer/organizations/new"}
          />
        )}
    </>
  );
}
