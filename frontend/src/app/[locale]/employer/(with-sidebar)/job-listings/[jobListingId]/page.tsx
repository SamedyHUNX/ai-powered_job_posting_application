import { Badge } from "@/components/ui/badge";
import { formatJobListingStatus } from "@/features/job-listings/lib/formatters";
import { useJobListing } from "@/hooks/use-job-listing";
import { useOrganization } from "@/hooks/use-organizations";
import { notFound } from "next/navigation";

type Props = {
  params: { jobListingId: string };
};

/**
 * Renders the job listing page for the provided jobListingId within the currently selected organization.
 *
 * If no organization is selected the component returns `null`. If the job listing cannot be found it triggers Next.js's `notFound()` (rendering a 404).
 *
 * @param params - Route parameters containing the `jobListingId` to fetch
 * @returns A React element for the job listing page, `null` when no organization is selected, or a 404 via `notFound()` when the job listing is not found
 */
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