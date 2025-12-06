"use client";

import { Card, CardContent } from "@/components/ui/card";
import { JobListingForm } from "@/features/job-listings/components/JobListingForm";
import { useTranslations } from "next-intl";

export default function NewJobListingPage() {
  const pageT = useTranslations("jobListings.newJobListing");
  const formT = useTranslations("jobListings.form");
  const optionsT = useTranslations("jobListings.form.options");

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
                description: formT("description"),
              },
              descriptions: {
                wage: formT("wageDesc"),
                description: formT("description"),
              },
              options: {
                wageIntervals: {
                  yearly: optionsT("wageIntervals.yearly"),
                  hourly: optionsT("wageIntervals.hourly"),
                  monthly: optionsT("wageIntervals.monthly"),
                },
                locationRequirements: {
                  "in-office": optionsT("locationRequirements.inOffice"),
                  remote: optionsT("locationRequirements.remote"),
                  hybrid: optionsT("locationRequirements.hybrid"),
                },
                jobTypes: {
                  "full-time": optionsT("jobTypes.fullTime"),
                  "part-time": optionsT("jobTypes.partTime"),
                  internship: optionsT("jobTypes.internship"),
                  contract: optionsT("jobTypes.contract"),
                  freelance: optionsT("jobTypes.freelance"),
                },
                experienceLevels: {
                  junior: optionsT("experienceLevels.junior"),
                  mid: optionsT("experienceLevels.mid"),
                  senior: optionsT("experienceLevels.senior"),
                  lead: optionsT("experienceLevels.lead"),
                  manager: optionsT("experienceLevels.manager"),
                  ceo: optionsT("experienceLevels.ceo"),
                  director: optionsT("experienceLevels.director"),
                },
              },

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
