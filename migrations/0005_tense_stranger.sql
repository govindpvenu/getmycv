CREATE TABLE "container_event" (
	"id" serial PRIMARY KEY NOT NULL,
	"container_id" text NOT NULL,
	"event_type" text NOT NULL,
	"occurred_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "container_event" ADD CONSTRAINT "container_event_container_id_container_id_fk" FOREIGN KEY ("container_id") REFERENCES "public"."container"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "container_event_container_id_idx" ON "container_event" USING btree ("container_id");--> statement-breakpoint
CREATE INDEX "container_event_type_idx" ON "container_event" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "container_event_occurred_at_idx" ON "container_event" USING btree ("occurred_at");