"use client";

import { NoOrganizationDialog } from "@/features/employers/components/NoOrganizationDialog";
import { useOrganization } from "@/hooks/use-organization";
import { useProfile } from "@/hooks/use-profile";
import PrivateRoute from "@/routes/PrivateRoute";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EmployerDashbordPage() {
  const { isLoading, error, fetchOrganizationsByUser, organizations } =
    useOrganization();
  const { currentUser } = useProfile();
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (currentUser?.id) {
      fetchOrganizationsByUser(currentUser.id);
    }
  }, [currentUser?.id, fetchOrganizationsByUser]);

  // Auto-open dialog when no organizations
  useEffect(() => {
    if (!isLoading && organizations.length === 0) {
      setDialogOpen(true);
    }
  }, [isLoading, organizations.length]);

  const handleDialogCancel = () => {
    setDialogOpen(false);
    router.push("/");
  };

  return (
    <PrivateRoute>
      <div>
        <h1>Employer page</h1>

        {isLoading && <p>Loading organizations...</p>}

        {error && <p className="error">Error: {error}</p>}

        {!isLoading && organizations.length === 0 && (
          <NoOrganizationDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onCancel={handleDialogCancel}
          />
        )}

        {!isLoading && organizations.length > 0 && (
          <div>
            <h2>Your Organizations ({organizations.length})</h2>
            <ul>
              {organizations.map((org) => (
                <li key={org.id}>{org.orgName}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </PrivateRoute>
  );
}
