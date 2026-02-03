import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import type { InferSelectModel } from "drizzle-orm";

// Plant families table - taxonomy and family-level microbiome information
export const plantFamilies = pgTable("plant_families", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Basic Info
  name: text("name").notNull().unique(), // "Brassicaceae"
  common_name: text("common_name").notNull(), // "Cabbage Family"
  description: text("description"), // Rich educational content
  
  // Microbiome Profile
  quorum_sensing_role: text("quorum_sensing_role"), // How this family contributes
  microbiome_benefits: text("microbiome_benefits"), // General family benefits
  
  // Metadata
  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// TypeScript types
export type PlantFamily = InferSelectModel<typeof plantFamilies>;
export type NewPlantFamily = Omit<PlantFamily, "id" | "created_at" | "updated_at">;
