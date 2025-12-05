"use client";

import { Loading } from "@/components/customs/Loading";
import { NoOrganizationDialog } from "@/features/employers/components/NoOrganizationDialog";
import { useOrganization } from "@/hooks/use-organization";
import { useProfile } from "@/hooks/use-profile";
import PrivateRoute from "@/routes/PrivateRoute";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EmployerDashboardPage() {
  const { isLoading, fetchOrganizationsByUser, organizations } =
    useOrganization();
  const { currentUser } = useProfile();
  const router = useRouter();
  const { organization } = useParams() as { organization: string };

  const noOrganizations = organizations.length === 0;
  const [dialogOpen, setDialogOpen] = useState(noOrganizations);

  useEffect(() => {
    if (currentUser?.id) fetchOrganizationsByUser(currentUser.id);
  }, [currentUser?.id, fetchOrganizationsByUser]);

  useEffect(() => {
    setDialogOpen(noOrganizations);
  }, [noOrganizations]);

  const handleDialogCancel = () => {
    setDialogOpen(false);
    router.push("/");
  };

  if (isLoading) return <Loading />;

  return (
    <PrivateRoute>
      <div>
        <h1>Employer page - {organization}</h1>
        {noOrganizations && (
          <NoOrganizationDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onCancel={handleDialogCancel}
          />
        )}
      </div>
    </PrivateRoute>
  );
}
