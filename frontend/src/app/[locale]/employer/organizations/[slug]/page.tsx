"use client";

import { useEffect, useState } from "react";
import { NoOrganizationDialog } from "@/features/employers/components/NoOrganizationDialog";
import { useOrganization } from "@/hooks/use-organizations";
import { useJobListing } from "@/hooks/use-job-listing";
import { useProfile } from "@/hooks/use-profile";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BriefcaseIcon,
  MapPinIcon,
  DollarSignIcon,
  ClockIcon,
  PlusCircleIcon,
  Users2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export default function EmployerHomepage() {
  // Translations
  const orgT = useTranslations("orgPage");
  const jobListingT = useTranslations("orgPage.jobListings");

  const { fetchOrganizationsByUser, organizations, selectedOrganization } =
    useOrganization();
  const { fetchJobListingsByOrganization, jobListings, count } =
    useJobListing();
  const { currentUser } = useProfile();
  const router = useRouter();
  const noOrganizations = organizations.length === 0;
  const [dialogOpen, setDialogOpen] = useState(false);
  const { lastResponse, clearLastResponse } = useOrganization();

  useEffect(() => {
    if (noOrganizations) {
      setDialogOpen(true);
    } else {
      setDialogOpen(false);
    }
  }, [noOrganizations]);

  // After fetching
  useEffect(() => {
    if (lastResponse) {
      toast.success(lastResponse.message);
      clearLastResponse();
    }
  }, [lastResponse]);

  useEffect(() => {
    if (currentUser?.id) fetchOrganizationsByUser(currentUser.id);
  }, [currentUser?.id, fetchOrganizationsByUser]);

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

  const publishedCount = jobListings.filter(
    (j) => j.status === "published"
  ).length;
  const draftCount = jobListings.filter((j) => j.status === "draft").length;

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 w-[95%]">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">
                {selectedOrganization?.orgName}
              </h1>
              <p className="text-muted-foreground text-lg">
                {orgT("titleDesc")}
              </p>
            </div>
            <Button asChild size="lg" className="gap-2">
              <Link href="/employer/job-listings/new">
                <PlusCircleIcon className="h-5 w-5" />
                {orgT("buttonText")}
              </Link>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {orgT("card1.title")}
                </CardTitle>
                <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{count}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {orgT("card1.description")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {orgT("card2.title")}
                </CardTitle>
                <Users2Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {publishedCount}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {orgT("card2.description")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {orgT("card3.title")}
                </CardTitle>
                <ClockIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">
                  {draftCount}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {orgT("card3.description")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Job Listings Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6">{jobListingT("title")}</h2>
          {jobListings.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 px-4">
                <BriefcaseIcon className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {jobListingT("noJobs")}
                </h3>
                <p className="text-muted-foreground text-center mb-6 max-w-md">
                  {jobListingT("noJobsDesc")}
                </p>
                <Button asChild size="lg" className="gap-2">
                  <Link href="/employer/job-listings/new">
                    <PlusCircleIcon className="h-5 w-5" />
                    {jobListingT("buttonText")}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {jobListings.map((job) => (
                <Card
                  key={job.id}
                  className="hover:shadow-lg transition-all duration-200 cursor-pointer group"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                              {job.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                              {job.description}
                            </p>
                          </div>
                          {job.wage && (
                            <div className="text-right ml-4 flex-shrink-0">
                              <div className="flex items-center gap-1 text-lg font-bold text-green-600">
                                <DollarSignIcon className="h-5 w-5" />
                                {job.wage.toLocaleString()}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                per {job.wageInterval}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {/* Type Badge */}
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-950 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300 ring-1 ring-inset ring-blue-700/10 dark:ring-blue-300/20">
                            <BriefcaseIcon className="h-3 w-3" />
                            {job.type}
                          </span>

                          {/* Location Badge */}
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 dark:bg-green-950 px-3 py-1 text-xs font-medium text-green-700 dark:text-green-300 ring-1 ring-inset ring-green-600/20 dark:ring-green-300/20">
                            <MapPinIcon className="h-3 w-3" />
                            {job.locationRequirement}
                          </span>

                          {/* Experience Badge */}
                          <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 dark:bg-purple-950 px-3 py-1 text-xs font-medium text-purple-700 dark:text-purple-300 ring-1 ring-inset ring-purple-700/10 dark:ring-purple-300/20">
                            {job.experienceLevel}
                          </span>

                          {/* Status Badge */}
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
                              job.status === "published"
                                ? "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 ring-green-600/20 dark:ring-green-300/20"
                                : job.status === "draft"
                                ? "bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 ring-gray-600/20 dark:ring-gray-300/20"
                                : "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 ring-red-600/20 dark:ring-red-300/20"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                job.status === "published"
                                  ? "bg-green-600 dark:bg-green-400"
                                  : job.status === "draft"
                                  ? "bg-gray-600 dark:bg-gray-400"
                                  : "bg-red-600 dark:bg-red-400"
                              }`}
                            />
                            {job.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
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
