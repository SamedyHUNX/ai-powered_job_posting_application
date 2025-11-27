ALTER TABLE "organization_user_settings" DROP CONSTRAINT "organization_user_settings_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "organization_user_settings" DROP CONSTRAINT "organization_user_settings_organizationId_organizations_id_fk";
--> statement-breakpoint
ALTER TABLE "organization_user_settings" DROP CONSTRAINT "organization_user_settings_userId_organizationId_pk";-->statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "members_count" DROP DEFAULT;-->statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "pending_invitations_count" DROP DEFAULT;-->statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "max_allowed_memberships" DROP DEFAULT;-->statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "members_count" SET DATA TYPE integer USING members_count::integer;-->statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "pending_invitations_count" SET DATA TYPE integer USING pending_invitations_count::integer;-->statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "max_allowed_memberships" SET DATA TYPE integer USING max_allowed_memberships::integer;-->statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "members_count" SET DEFAULT 0;-->statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "pending_invitations_count" SET DEFAULT 0;-->statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "max_allowed_memberships" SET DEFAULT 5;-->statement-breakpoint
ALTER TABLE "organization_user_settings" ADD COLUMN "user_id" uuid;--> statement-breakpoint
ALTER TABLE "organization_user_settings" ADD COLUMN "organization_id" uuid;--> statement-breakpoint
ALTER TABLE "organization_user_settings" ADD COLUMN "new_application_email_notifications" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "organization_user_settings" ADD COLUMN "minimum_rating" integer;--> statement-breakpoint
UPDATE "organization_user_settings" SET "user_id" = "userId", "organization_id" = "organizationId";--> statement-breakpoint
UPDATE "organization_user_settings" SET "new_application_email_notifications" = COALESCE("newApplicationEmailNotifications", false);--> statement-breakpoint
UPDATE "organization_user_settings" SET "minimum_rating" = "minimumRating";--> statement-breakpoint
ALTER TABLE "organization_user_settings" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "organization_user_settings" ALTER COLUMN "organization_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "organization_user_settings" ADD CONSTRAINT "organization_user_settings_user_id_organization_id_pk" PRIMARY KEY("user_id","organization_id");--> statement-breakpoint
ALTER TABLE "organization_user_settings" ADD CONSTRAINT "organization_user_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_user_settings" ADD CONSTRAINT "organization_user_settings_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizations" DROP COLUMN IF EXISTS "user_role";--> statement-breakpoint
ALTER TABLE "organization_user_settings" DROP COLUMN "userId";--> statement-breakpoint
ALTER TABLE "organization_user_settings" DROP COLUMN "organizationId";--> statement-breakpoint
ALTER TABLE "organization_user_settings" DROP COLUMN "newApplicationEmailNotifications";--> statement-breakpoint
ALTER TABLE "organization_user_settings" DROP COLUMN "minimumRating";