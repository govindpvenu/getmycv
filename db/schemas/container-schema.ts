import {
  text,
  boolean,
  pgTable,
  timestamp,
  uniqueIndex,
  serial,
  index,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const container = pgTable(
  "container",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    isPrivate: boolean("is_private").default(false).notNull(),
    resumeUrl: text("resume_url").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },

  (t) => [
    // ensure each user can reuse slugs, but not duplicate their own
    uniqueIndex("container_user_slug_unique").on(t.userId, t.slug),
  ],
);

export interface ContainerEventAttributes {
  containerId: string;
  eventType: "view" | "download";
  occurredAt: Date;
}

export const containerEvent = pgTable(
  "container_event",
  {
    id: serial("id").primaryKey(),
    containerId: text("container_id")
      .notNull()
      .references(() => container.id, { onDelete: "cascade" }),
    eventType: text("event_type")
      .$type<ContainerEventAttributes["eventType"]>()
      .notNull(),
    occurredAt: timestamp("occurred_at").defaultNow().notNull(),
  },
  (t) => [
    index("container_event_container_id_idx").on(t.containerId),
    index("container_event_type_idx").on(t.eventType),
    index("container_event_occurred_at_idx").on(t.occurredAt),
  ],
);

export * as containerSchema from "./container-schema";
