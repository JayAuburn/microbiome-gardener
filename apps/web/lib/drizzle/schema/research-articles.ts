import { pgTable, text, timestamp, uuid, date, boolean, integer, index } from "drizzle-orm/pg-core";
import type { InferSelectModel } from "drizzle-orm";
import { documents } from "./documents";
import { users } from "./users";

// Research articles table - curated research with metadata for filtering and display
export const researchArticles = pgTable(
  "research_articles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    document_id: uuid("document_id")
      .references(() => documents.id, { onDelete: "cascade" })
      .notNull(), // Links to RAG chunks

    // Publication Details
    title: text("title").notNull(),
    authors: text("authors").array(),
    journal: text("journal"),
    publication_date: date("publication_date"),
    doi: text("doi"),
    source_url: text("source_url"),

    // Content
    summary: text("summary"), // Admin-written or AI-generated
    key_findings: text("key_findings"),
    garden_relevance: text("garden_relevance"), // "Why this matters for your garden"

    // Curation
    pinned: boolean("pinned").default(false).notNull(),
    tier_access: text("tier_access", {
      enum: ["free", "basic", "premium"],
    })
      .default("free")
      .notNull(),
    admin_approved: boolean("admin_approved").default(false).notNull(),

    // Engagement
    view_count: integer("view_count").default(0).notNull(),
    bookmark_count: integer("bookmark_count").default(0).notNull(),

    // Metadata
    imported_by: uuid("imported_by").references(() => users.id), // Admin who imported
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("research_articles_document_idx").on(t.document_id),
    index("research_articles_pinned_idx").on(t.pinned),
    index("research_articles_tier_access_idx").on(t.tier_access),
    index("research_articles_publication_date_idx").on(t.publication_date),
    index("research_articles_admin_approved_idx").on(t.admin_approved),
  ],
);

// TypeScript types
export type ResearchArticle = InferSelectModel<typeof researchArticles>;
export type NewResearchArticle = Omit<ResearchArticle, "id" | "created_at" | "updated_at" | "view_count" | "bookmark_count">;
