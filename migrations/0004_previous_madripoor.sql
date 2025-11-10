ALTER TABLE "container" DROP CONSTRAINT "container_slug_unique";--> statement-breakpoint
ALTER TABLE "container" ADD COLUMN "views" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "container" ADD COLUMN "downloads" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "container_user_slug_unique" ON "container" USING btree ("user_id","slug");