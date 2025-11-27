"use client";

import { NoOrganizationDialog } from "@/features/employers/components/NoOrganizationDialog";
import { useOrganization } from "@/hooks/use-organization";
import { useProfile } from "@/hooks/use-profile";
import PrivateRoute from "@/routes/PrivateRoute";
import { useEffect } from "react";

export default function EmployerDashbordPage() {
  const { isLoading, error, fetchOrganizationsByUser } = useOrganization();
  const { currentUser } = useProfile();

  const organizations = [] as string[];

  useEffect(() => {
    if (currentUser?.id) {
      fetchOrganizationsByUser(currentUser.id);
    }
  }, [currentUser?.id]);

  return (
    <PrivateRoute>
      <div>
        <h1>Employer page</h1>

        {isLoading && <p>Loading organizations...</p>}

        {error && <p className="error">Error: {error}</p>}

        {!isLoading && organizations.length === 0 && <NoOrganizationDialog />}

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
