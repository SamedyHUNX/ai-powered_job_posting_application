"use client";

import { Card, CardContent } from "@/components/ui/card";
import { JobListingForm } from "@/features/job-listings/components/JobListingForm";
import { useTranslations } from "next-intl";

export default function NewJobListingPage() {
  const pageT = useTranslations("jobListings.newJobListing");
  const formT = useTranslations("jobListings.form");

  const handleSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <div className="w-[95%] mx-auto p-4 h-[calc(100vh-5rem)] flex flex-col">
      <h1 className="text-2xl font-bold mb-2 shrink-0">{pageT("title")}</h1>
      <p className="text-muted-foreground mb-6 shrink-0">
        {pageT("description")}
      </p>
      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 min-h-0 p-6">
          <JobListingForm
            onSubmit={handleSubmit}
            translations={{
              labels: {
                title: formT("title"),
                wage: formT("wage"),
                city: formT("city"),
                stateAbbreviation: formT("state"),
                type: formT("type"),
                experienceLevel: formT("experienceLevel"),
                locationRequirement: formT("locationRequirement"),
              },
              descriptions: { wage: formT("wageDesc") },
              buttons: {
                submit: formT("buttonText"),
                submitting: formT("creatingText"),
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
