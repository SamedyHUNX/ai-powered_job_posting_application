"use client";

import { Loading } from "@/components/customs/loading";
import { Badge } from "@/components/ui/badge";
import { formatJobListingStatus } from "@/features/job-listings/lib/formatters";
import { useJobListings } from "@/hooks/use-job-listing";
import { useOrganizations } from "@/hooks/use-organizations";
import { notFound } from "next/navigation";

type Props = {
  params: { jobListingId: string };
};

export default function JobListingPage({ params }: Props) {
  const { selectedOrganization } = useOrganizations();
  const { useJobListing } = useJobListings();

  if (!selectedOrganization) {
    return null;
  }

  const { jobListingId } = params;
  const { data: jobListing, isLoading, error } = useJobListing(jobListingId);

  if (isLoading) {
    return <Loading />;
  }

  if (error || !jobListing) {
    return notFound();
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 @container">
      <div className="flex items-center justify-between gap-4 @max-4xl:flex-col @max-4xl:items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {jobListing.title}
          </h1>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge>{formatJobListingStatus(jobListing.status)}</Badge>
        </div>
      </div>
    </div>
  );
}
