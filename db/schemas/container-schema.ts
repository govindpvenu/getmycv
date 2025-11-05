import {
  text,
  boolean,
  pgTable,
  timestamp,
  uniqueIndex,
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

export * as containerSchema from "./container-schema";
