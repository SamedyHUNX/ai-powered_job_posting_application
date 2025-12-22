"use client";

import { Card, CardContent } from "@/components/ui/card";
import { JobListingForm } from "@/features/job-listings/components/JobListingForm";
import { useJobListing } from "@/hooks/use-job-listing";
import { useOrganization } from "@/hooks/use-organization";
import { CreateJobListingFormData } from "@/schemas/job-listings/createJobListingSchema";
import { useErrorHandler } from "@/utils/error-handler";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { toast } from "sonner";

export default function NewJobListingPage() {
  // Translations
  const pageT = useTranslations("jobListings.newJobListing");
  const formT = useTranslations("jobListings.form");
  const optionsT = useTranslations("jobListings.form.options");
  const { getErrorMessage } = useErrorHandler();
  const { selectedOrganization } = useOrganization();

  const { createJobListing, isCreating, createError, createSuccess } =
    useJobListing();

  const translations = {
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
  };

  const handleSubmit = async (data: CreateJobListingFormData) => {
    await createJobListing(data);
  };

  // Error toast state management
  useEffect(() => {
    if (createError) {
      const errorMessage = getErrorMessage(createError);
      toast.error(errorMessage);
    }
  }, [createError, getErrorMessage]);

  if (createSuccess) {
    return (
      <div className="w-[95%] mx-auto px-4 pt-8 h-fit flex flex-col">
        <h1 className="text-4xl font-bold mb-2 shrink-0 tracking-tighter">
          {pageT("successTitle")}
        </h1>
        <p className="text-muted-foreground mb-6 shrink-0 tracking-tighter">
          {pageT("successDescription")}
        </p>
      </div>
    );
  }

  return (
    <div className="w-[95%] mx-auto px-4 pt-8 h-fit flex flex-col">
      <h1 className="text-4xl font-bold mb-2 shrink-0 tracking-tighter">
        {pageT("title")}
      </h1>
      <p className="text-muted-foreground mb-6 shrink-0 tracking-tighter">
        {pageT("description")}
      </p>
      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 min-h-0 p-6">
          <JobListingForm
            onSubmit={handleSubmit}
            translations={translations}
            orgId={selectedOrganization!.id}
          />
        </CardContent>
      </Card>
    </div>
  );
}
