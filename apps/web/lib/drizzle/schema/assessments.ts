import { pgTable, timestamp, uuid, boolean, index } from "drizzle-orm/pg-core";
import type { InferSelectModel } from "drizzle-orm";
import { users } from "./users";

// Assessments table - tracks Growing Knowledge Path Assessment completion
export const assessments = pgTable(
  "assessments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    user_id: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),

    // Assessment Context
    completed: boolean("completed").default(false).notNull(),
    completion_date: timestamp("completion_date", { withTimezone: true }),

    // Metadata
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("assessments_user_idx").on(t.user_id),
    index("assessments_completed_idx").on(t.completed),
  ],
);

// TypeScript types
export type Assessment = InferSelectModel<typeof assessments>;
export type NewAssessment = Omit<Assessment, "id" | "created_at" | "updated_at">;
