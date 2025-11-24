ALTER TABLE "organizations" ADD COLUMN "image_url" varchar;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "is_verified" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "is_banned" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "organizations" DROP COLUMN "imageUrl";--> statement-breakpoint
ALTER TABLE "organizations" DROP COLUMN "isVerified";--> statement-breakpoint
ALTER TABLE "organizations" DROP COLUMN "isBanned";--> statement-breakpoint
ALTER TABLE "organizations" DROP COLUMN "createdAt";--> statement-breakpoint
ALTER TABLE "organizations" DROP COLUMN "updatedAt";