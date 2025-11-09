ALTER TABLE "users" ADD COLUMN "reset_password_token" varchar;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "reset_password_expires" timestamp;