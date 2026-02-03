import { pgTable, text, timestamp, uuid, index, boolean } from "drizzle-orm/pg-core";
import type { InferSelectModel } from "drizzle-orm";

// Users table - for application user data (references auth.users.id)
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey(), // References auth.users.id from Supabase
    email: text("email").notNull().unique(), // Synced from auth.users
    full_name: text("full_name"),

    // Metadata
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),

    // Stripe integration fields - only essential data for querying Stripe
    stripe_customer_id: text("stripe_customer_id"),

    // Role-based access control
    role: text("role", {
      enum: ["member", "admin"],
    })
      .default("member")
      .notNull(),

    // Location & Climate
    location_city: text("location_city"),
    location_country: text("location_country"),
    location_coordinates: text("location_coordinates"), // "lat,lng" for weather API
    hemisphere: text("hemisphere", {
      enum: ["northern", "southern"],
    }),
    climate_type: text("climate_type"), // "temperate_maritime" | "mediterranean" | etc
    hardiness_zone: text("hardiness_zone"), // Optional, US only
    average_frost_dates: text("average_frost_dates"), // JSON: {first: "date", last: "date"}
    soil_type: text("soil_type", {
      enum: ["clay", "sandy", "loam", "silt", "chalky", "peat", "unknown"],
    }),

    // Space & Constraints
    space_type: text("space_type", {
      enum: ["none", "balcony", "small_yard", "large_yard", "farm"],
    }),
    space_size: text("space_size"), // Description or measurement
    constraints: text("constraints").array(), // ["hoa", "rental", "limited_sun"]
    has_structures: boolean("has_structures").default(false), // Tunnel houses, hoop houses

    // Growing Context
    experience_level: text("experience_level", {
      enum: ["beginner", "intermediate", "advanced"],
    }),
    learning_preference: text("learning_preference", {
      enum: ["visual", "step_by_step", "science_deep"],
    }),

    // Pets & Animals (for microbe transfer context)
    pets: text("pets").array(), // ["dogs", "cats", "chickens"]

    // Subscription Tier (denormalized for fast queries)
    subscription_tier: text("subscription_tier", {
      enum: ["free", "basic", "premium"],
    })
      .default("free")
      .notNull(),
    subscription_status: text("subscription_status", {
      enum: ["active", "canceled", "past_due", "trialing"],
    }),
  },
  (t) => [
    // Add index for role-based queries
    index("role_idx").on(t.role),
    // Add index for subscription tier queries
    index("subscription_tier_idx").on(t.subscription_tier),
    // Add index for climate-based queries
    index("climate_type_idx").on(t.climate_type),
    // Add index for hemisphere-based queries
    index("hemisphere_idx").on(t.hemisphere),
  ],
);

// TypeScript types
export type User = InferSelectModel<typeof users>;
export type UpdateUser = Partial<User>;

// Role-related types
export type UserRole = "member" | "admin";
export type AdminUser = User & { role: "admin" };

// Subscription-related types
export type SubscriptionTier = "free" | "basic" | "premium";
export type SubscriptionStatus = "active" | "canceled" | "past_due" | "trialing";
