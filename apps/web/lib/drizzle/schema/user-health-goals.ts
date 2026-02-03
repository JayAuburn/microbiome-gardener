import { pgTable, text, timestamp, uuid, boolean, index, unique } from "drizzle-orm/pg-core";
import type { InferSelectModel } from "drizzle-orm";
import { users } from "./users";

// User health goals table - many-to-many relationship for health goals
export const userHealthGoals = pgTable(
  "user_health_goals",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    user_id: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    
    health_goal: text("health_goal", {
      enum: [
        "anxiety",
        "immunity",
        "performance",
        "longevity",
        "children_health",
        "digestion",
        "ibs",
        "autoimmune",
        "weight_management",
        "mental_clarity",
        "energy",
        "sleep",
      ],
    }).notNull(),

    // Priority/Context
    is_primary: boolean("is_primary").default(false).notNull(),

    // Metadata
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("user_health_goals_user_idx").on(t.user_id),
    index("user_health_goals_goal_idx").on(t.health_goal),
    index("user_health_goals_primary_idx").on(t.is_primary),
    unique("user_health_goals_user_goal_unique").on(t.user_id, t.health_goal),
  ],
);

// TypeScript types
export type UserHealthGoal = InferSelectModel<typeof userHealthGoals>;
export type NewUserHealthGoal = Omit<UserHealthGoal, "id" | "created_at">;

// Health goal enum type
export type HealthGoal =
  | "anxiety"
  | "immunity"
  | "performance"
  | "longevity"
  | "children_health"
  | "digestion"
  | "ibs"
  | "autoimmune"
  | "weight_management"
  | "mental_clarity"
  | "energy"
  | "sleep";
