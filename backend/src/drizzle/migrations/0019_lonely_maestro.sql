ALTER TABLE "job-listings" DROP CONSTRAINT "job-listings_organizationId_organizations_id_fk";
--> statement-breakpoint
DROP INDEX "job-listings_stateAbbreviation_index";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_resumes" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "user_resumes" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "user_notification_settings" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "user_notification_settings" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "organization_user_settings" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "organization_user_settings" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "job-listings" ADD COLUMN "organization_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "job-listings" ADD COLUMN "wage_interval" "job_listings_wage_interval";--> statement-breakpoint
ALTER TABLE "job-listings" ADD COLUMN "state_abbreviation" varchar;--> statement-breakpoint
ALTER TABLE "job-listings" ADD COLUMN "is_featured" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "job-listings" ADD COLUMN "localRequirement" "job_listings_location_requirement" NOT NULL;--> statement-breakpoint
ALTER TABLE "job-listings" ADD COLUMN "experience_level" "job_listings_experience_level" NOT NULL;--> statement-breakpoint
ALTER TABLE "job-listings" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "job-listings" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "job_listing_applications" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "job_listing_applications" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "job-listings" ADD CONSTRAINT "job-listings_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "job-listings_state_abbreviation_index" ON "job-listings" USING btree ("state_abbreviation");--> statement-breakpoint
ALTER TABLE "user_resumes" DROP COLUMN "createdAt";--> statement-breakpoint
ALTER TABLE "user_resumes" DROP COLUMN "updatedAt";--> statement-breakpoint
ALTER TABLE "user_notification_settings" DROP COLUMN "createdAt";--> statement-breakpoint
ALTER TABLE "user_notification_settings" DROP COLUMN "updatedAt";--> statement-breakpoint
ALTER TABLE "organization_user_settings" DROP COLUMN "createdAt";--> statement-breakpoint
ALTER TABLE "organization_user_settings" DROP COLUMN "updatedAt";--> statement-breakpoint
ALTER TABLE "job-listings" DROP COLUMN "organizationId";--> statement-breakpoint
ALTER TABLE "job-listings" DROP COLUMN "wageInterval";--> statement-breakpoint
ALTER TABLE "job-listings" DROP COLUMN "stateAbbreviation";--> statement-breakpoint
ALTER TABLE "job-listings" DROP COLUMN "isFeatured";--> statement-breakpoint
ALTER TABLE "job-listings" DROP COLUMN "locationRequirement";--> statement-breakpoint
ALTER TABLE "job-listings" DROP COLUMN "experienceLevel";--> statement-breakpoint
ALTER TABLE "job-listings" DROP COLUMN "createdAt";--> statement-breakpoint
ALTER TABLE "job-listings" DROP COLUMN "updatedAt";--> statement-breakpoint
ALTER TABLE "job_listing_applications" DROP COLUMN "createdAt";--> statement-breakpoint
ALTER TABLE "job_listing_applications" DROP COLUMN "updatedAt";