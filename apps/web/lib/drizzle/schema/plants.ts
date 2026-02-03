import { pgTable, text, timestamp, uuid, integer, decimal, boolean, index } from "drizzle-orm/pg-core";
import type { InferSelectModel } from "drizzle-orm";
import { plantFamilies } from "./plant-families";

// Plants table - individual plant profiles with microbiome and growing information
export const plants = pgTable(
  "plants",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    family_id: uuid("family_id")
      .references(() => plantFamilies.id)
      .notNull(),

    // Basic Info
    name: text("name").notNull(), // "Kale"
    scientific_name: text("scientific_name"), // "Brassica oleracea"
    common_names: text("common_names").array(), // ["Kale", "Borecole"]
    difficulty: text("difficulty", {
      enum: ["beginner", "intermediate", "advanced"],
    }).notNull(),

    // Growing Conditions
    climate_adaptability: text("climate_adaptability", {
      enum: ["wide", "specific"],
    }),
    temperature_preference: text("temperature_preference", {
      enum: ["cool_season", "warm_season", "year_round"],
    }),
    soil_temp_min: integer("soil_temp_min"), // Celsius
    soil_temp_max: integer("soil_temp_max"), // Celsius
    frost_tolerance: integer("frost_tolerance"), // Celsius, can be negative

    // Microbiome Profile
    beneficial_microbes: text("beneficial_microbes").array(), // Endophyte types
    endophyte_richness: text("endophyte_richness", {
      enum: ["high", "medium", "low", "unknown"],
    }),
    quorum_sensing_contribution: text("quorum_sensing_contribution"),
    fermentation_potential: text("fermentation_potential"),

    // Air Filtration
    air_filtration_capacity: text("air_filtration_capacity", {
      enum: ["high", "medium", "low", "unknown"],
    }),
    pollutants_filtered: text("pollutants_filtered").array(), // ["pfas", "vocs", "pesticides"]

    // Ecosystem Context
    beneficial_animals: text("beneficial_animals").array(), // ["bees", "ladybugs"]
    common_pests: text("common_pests").array(),
    organic_pest_management: text("organic_pest_management"),

    // Pet Safety
    dog_safe: boolean("dog_safe").default(true),
    cat_safe: boolean("cat_safe").default(true),
    chicken_compatible: boolean("chicken_compatible").default(true),
    dog_microbe_transfer: text("dog_microbe_transfer"), // How dogs help with this plant

    // Growing Details
    companion_families: uuid("companion_families").array(), // Array of family IDs (4+ diversity)
    space_requirements: text("space_requirements", {
      enum: ["container_friendly", "small_space", "large_garden"],
    }),

    // Premium Fields (optional, can be NULL for basic tier)
    brix_target_min: decimal("brix_target_min", { precision: 4, scale: 2 }),
    brix_target_max: decimal("brix_target_max", { precision: 4, scale: 2 }),
    heritage_varieties: text("heritage_varieties").array(), // Landrace names
    seed_sources: text("seed_sources"), // Where to buy quality seeds
    autoinducer_guidance: text("autoinducer_guidance"), // When/how to use (seed treatment)
    foliar_feed_protocol: text("foliar_feed_protocol"),

    // Nutrient Density (flexible - populate as data becomes available)
    nutrient_data_source: text("nutrient_data_source"), // "bionutrient_association" | "user_contributed" | "research_study"
    nutrient_data_confidence: text("nutrient_data_confidence", {
      enum: ["high", "medium", "estimated"],
    }),

    // Metadata
    featured_indoor_air_quality: boolean("featured_indoor_air_quality").default(false), // Featured category flag
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("plants_family_idx").on(t.family_id),
    index("plants_difficulty_idx").on(t.difficulty),
    index("plants_climate_idx").on(t.climate_adaptability),
    index("plants_featured_air_quality_idx").on(t.featured_indoor_air_quality),
  ],
);

// TypeScript types
export type Plant = InferSelectModel<typeof plants>;
export type NewPlant = Omit<Plant, "id" | "created_at" | "updated_at">;
