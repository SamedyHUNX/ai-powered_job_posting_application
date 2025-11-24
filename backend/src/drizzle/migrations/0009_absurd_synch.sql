ALTER TABLE "organizations" ADD COLUMN "org_name" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "organizations" DROP COLUMN "name";