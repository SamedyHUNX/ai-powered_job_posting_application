"use client";

import { Loading } from "@/components/customs/Loading";
import { NoOrganizationDialog } from "@/features/employers/components/NoOrganizationDialog";
import { useOrganization } from "@/hooks/use-organization";
import { useJobListing } from "@/hooks/use-job-listing";
import { useProfile } from "@/hooks/use-profile";
import { useParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

export default function EmployerHomepage() {
  return (
    <Suspense>
      <SuspendedPage />
    </Suspense>
  );
}

function SuspendedPage() {
  const { isLoading, fetchOrganizationsByUser, organizations, selectedOrganization } =
    useOrganization();
  const {
    fetchJobListingsByOrganization,
    jobListings,
    isLoading: isLoadingJobs,
    count,
  } = useJobListing();
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

  // Fetch job listings when selectedOrganization changes
  useEffect(() => {
    if (selectedOrganization?.id) {
      fetchJobListingsByOrganization(selectedOrganization.id);
    }
  }, [selectedOrganization?.id, fetchJobListingsByOrganization]);

  const handleDialogCancel = () => {
    setDialogOpen(false);
    router.push("/");
  };

  if (isLoading) return <Loading />;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          {selectedOrganization?.orgName || organization}
        </h1>
        <p className="text-muted-foreground">
          Manage your organization and job listings
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">
          Job Listings ({count})
        </h2>
        {isLoadingJobs ? (
          <div className="flex items-center justify-center py-8">
            <Loading />
          </div>
        ) : jobListings.length === 0 ? (
          <div className="text-center py-8 border rounded-lg bg-muted/50">
            <p className="text-muted-foreground">
              No job listings yet. Create your first job listing to get started.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {jobListings.map((job) => (
              <div
                key={job.id}
                className="border rounded-lg p-4 hover:bg-accent transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {job.description}
                    </p>
                    <div className="flex gap-2 mt-3 flex-wrap">
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        {job.type}
                      </span>
                      <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        {job.locationRequirement}
                      </span>
                      <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                        {job.experienceLevel}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${job.status === "published"
                            ? "bg-green-50 text-green-700 ring-green-600/20"
                            : job.status === "draft"
                              ? "bg-gray-50 text-gray-700 ring-gray-600/20"
                              : "bg-red-50 text-red-700 ring-red-600/20"
                          }`}
                      >
                        {job.status}
                      </span>
                    </div>
                  </div>
                  {job.wage && (
                    <div className="text-right ml-4">
                      <p className="font-semibold">
                        ${job.wage.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        /{job.wageInterval}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {noOrganizations && (
        <NoOrganizationDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onCancel={handleDialogCancel}
        />
      )}
    </div>
  );
}
