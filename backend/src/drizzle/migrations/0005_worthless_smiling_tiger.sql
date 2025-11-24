ALTER TABLE "users" ADD COLUMN "username" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "image_url" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "first_name" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_name" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "full_name" varchar;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_banned" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_verified" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_disabled" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_admin" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "verification_token" varchar;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "verification_expires" timestamp;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "imageUrl";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "firstName";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "lastName";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "fullName";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "isBanned";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "isVerified";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "isDisabled";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "isAdmin";