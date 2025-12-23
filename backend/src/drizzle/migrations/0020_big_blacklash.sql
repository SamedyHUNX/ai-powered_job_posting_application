ALTER TYPE "public"."job_listings_type" ADD VALUE 'freelance';--> statement-breakpoint
ALTER TYPE "public"."job_listings_type" ADD VALUE 'contract';--> statement-breakpoint
ALTER TYPE "public"."job_listings_wage_interval" ADD VALUE 'monthly';--> statement-breakpoint
ALTER TABLE "job-listings" ALTER COLUMN "experience_level" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."job_listings_experience_level";--> statement-breakpoint
CREATE TYPE "public"."job_listings_experience_level" AS ENUM('junior', 'mid', 'senior', 'lead', 'ceo', 'director');--> statement-breakpoint
ALTER TABLE "job-listings" ALTER COLUMN "experience_level" SET DATA TYPE "public"."job_listings_experience_level" USING "experience_level"::"public"."job_listings_experience_level";--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "slug" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "organizations" DROP COLUMN "has_image";