import { pgTable, text, timestamp, uuid, index } from "drizzle-orm/pg-core";
import type { InferSelectModel } from "drizzle-orm";
import { assessments } from "./assessments";
import { users } from "./users";

// Assessment responses table - stores individual question responses for analytics
export const assessmentResponses = pgTable(
  "assessment_responses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    assessment_id: uuid("assessment_id")
      .references(() => assessments.id, { onDelete: "cascade" })
      .notNull(),
    user_id: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),

    // Question & Answer
    question_key: text("question_key").notNull(), // "current_growing_status"
    question_text: text("question_text").notNull(), // Full question for analytics
    answer_value: text("answer_value").notNull(), // User's answer
    answer_type: text("answer_type", {
      enum: ["single_choice", "multiple_choice", "text"],
    }).notNull(),

    // Metadata
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("assessment_responses_assessment_idx").on(t.assessment_id),
    index("assessment_responses_user_idx").on(t.user_id),
    index("assessment_responses_question_key_idx").on(t.question_key),
    index("assessment_responses_question_answer_idx").on(t.question_key, t.answer_value),
  ],
);

// TypeScript types
export type AssessmentResponse = InferSelectModel<typeof assessmentResponses>;
export type NewAssessmentResponse = Omit<AssessmentResponse, "id" | "created_at">;
