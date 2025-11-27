ALTER TABLE "organizations" ADD COLUMN "slug" varchar;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "has_image" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "members_count" varchar DEFAULT '0';--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "pending_invitations_count" varchar DEFAULT '0';--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "admin_delete_enabled" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "max_allowed_memberships" varchar DEFAULT '5';--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "jobs_count" varchar DEFAULT '0';--> statement-breakpoint
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_slug_unique" UNIQUE("slug");