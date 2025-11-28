ALTER TABLE "user_notification_settings" DROP CONSTRAINT "user_notification_settings_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "user_notification_settings" ADD COLUMN "user_id" uuid;--> statement-breakpoint
ALTER TABLE "user_notification_settings" ADD COLUMN "new_job_email_notifications" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "user_notification_settings" ADD COLUMN "ai_prompt" varchar;--> statement-breakpoint
UPDATE "user_notification_settings" SET "user_id" = "userId";--> statement-breakpoint
UPDATE "user_notification_settings" SET "new_job_email_notifications" = COALESCE("newJobEmailNotifications", false);--> statement-breakpoint
UPDATE "user_notification_settings" SET "ai_prompt" = "aiPrompt";--> statement-breakpoint
ALTER TABLE "user_notification_settings" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_notification_settings" ALTER COLUMN "new_job_email_notifications" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_notification_settings" ADD CONSTRAINT "user_notification_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_notification_settings" DROP COLUMN "userId";--> statement-breakpoint
ALTER TABLE "user_notification_settings" DROP COLUMN "newJobEmailNotifications";--> statement-breakpoint
ALTER TABLE "user_notification_settings" DROP COLUMN "aiPrompt";