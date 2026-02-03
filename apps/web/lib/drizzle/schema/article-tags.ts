import { pgTable, text, timestamp, uuid, index } from "drizzle-orm/pg-core";
import type { InferSelectModel } from "drizzle-orm";
import { researchArticles } from "./research-articles";

// Article tags table - flexible tagging system for research articles
export const articleTags = pgTable(
  "article_tags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    article_id: uuid("article_id")
      .references(() => researchArticles.id, { onDelete: "cascade" })
      .notNull(),
    
    tag_category: text("tag_category").notNull(), // "topic" | "plant_family" | "microbe" | "health_condition"
    tag_value: text("tag_value").notNull(), // "gut_health", "brassicaceae", "lactobacillus", "anxiety"

    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("article_tags_article_idx").on(t.article_id),
    index("article_tags_category_value_idx").on(t.tag_category, t.tag_value),
    index("article_tags_value_idx").on(t.tag_value),
  ],
);

// TypeScript types
export type ArticleTag = InferSelectModel<typeof articleTags>;
export type NewArticleTag = Omit<ArticleTag, "id" | "created_at">;
