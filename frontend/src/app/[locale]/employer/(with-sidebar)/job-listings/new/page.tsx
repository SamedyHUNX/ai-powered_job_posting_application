import { Card, CardContent } from "@/components/ui/card";
import { JobListingForm } from "@/features/job-listings/components/JobListingForm";

export default function NewJobListingPage() {
  return (
    <div className="w-[95%] mx-auto p-4 h-[calc(100vh-5rem)] flex flex-col">
      <h1 className="text-2xl font-bold mb-2 shrink-0">New Job Listing</h1>
      <p className="text-muted-foreground mb-6 shrink-0">
        This does not post the listing yet. It just saves a draft.
      </p>
      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 min-h-0 p-6">
          <JobListingForm />
        </CardContent>
      </Card>
    </div>
  );
}
