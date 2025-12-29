ALTER TABLE "job-listings" ADD COLUMN "location_requirement" "job_listings_location_requirement" NOT NULL;--> statement-breakpoint
ALTER TABLE "job-listings" DROP COLUMN "localRequirement";