
ALTER TABLE "organizations"
ALTER COLUMN "members_count" TYPE integer
USING members_count::integer;
