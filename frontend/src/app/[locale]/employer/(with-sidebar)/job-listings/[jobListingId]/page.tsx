import { Badge } from "@/components/ui/badge";
import { formatJobListingStatus } from "@/features/job-listings/lib/formatters";
import { useJobListing } from "@/hooks/use-job-listing";
import { useOrganization } from "@/hooks/use-organizations";
import { notFound } from "next/navigation";

type Props = {
  params: { jobListingId: string };
};

export default async function JobListingPage({ params }: Props) {
  const { selectedOrganization } = useOrganization();
  const { fetchJobListingById } = useJobListing();

  if (!selectedOrganization) {
    return null;
  }

  const { jobListingId } = params;
  const jobListing = await fetchJobListingById(selectedOrganization.id);

  if (jobListing == null) return notFound();

  return (
    <div className="space-y-6 max-w-6xl max-auto p-4 @container">
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
