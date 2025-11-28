ALTER TABLE "organizations" ALTER COLUMN "jobs_count" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "jobs_count" SET DATA TYPE integer USING jobs_count::integer;--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "jobs_count" SET DEFAULT 0;