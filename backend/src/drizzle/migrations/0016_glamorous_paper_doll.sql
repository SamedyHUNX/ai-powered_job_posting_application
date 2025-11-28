ALTER TABLE "user_resumes" DROP CONSTRAINT "user_resumes_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "user_resumes" ADD COLUMN "user_id" uuid;--> statement-breakpoint
ALTER TABLE "user_resumes" ADD COLUMN "resume_file_url" varchar;--> statement-breakpoint
ALTER TABLE "user_resumes" ADD COLUMN "resume_file_key" varchar;--> statement-breakpoint
ALTER TABLE "user_resumes" ADD COLUMN "ai_summary" varchar;--> statement-breakpoint
UPDATE "user_resumes" SET "user_id" = "userId";--> statement-breakpoint
UPDATE "user_resumes" SET "resume_file_url" = "resumeFileUrl";--> statement-breakpoint
UPDATE "user_resumes" SET "resume_file_key" = "resumeFileKey";--> statement-breakpoint
UPDATE "user_resumes" SET "ai_summary" = "aiSummary";--> statement-breakpoint
ALTER TABLE "user_resumes" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_resumes" ALTER COLUMN "resume_file_url" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_resumes" ALTER COLUMN "resume_file_key" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_resumes" ADD CONSTRAINT "user_resumes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_resumes" DROP COLUMN "userId";--> statement-breakpoint
ALTER TABLE "user_resumes" DROP COLUMN "resumeFileUrl";--> statement-breakpoint
ALTER TABLE "user_resumes" DROP COLUMN "resumeFileKey";--> statement-breakpoint
ALTER TABLE "user_resumes" DROP COLUMN "aiSummary";