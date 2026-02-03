# Strategic Database Planning Document

## App Summary

**End Goal:** Help people restore gut microbiome diversity through personalized soil-based growing protocols using RAG-powered AI coaching

**Template Used:** rag-saas (RAG-powered SaaS with subscription billing)

**Core Features:**
- RAG-powered AI coaching with progressive knowledge education
- Climate-adaptive planting guide (global, condition-based)
- Comprehensive plant database with microbiome profiles
- Automated research article curation and filtering
- Premium garden tracking with Brix validation
- Three-tier subscriptions (Free/Basic/Premium)
- Admin content management for iterative knowledge base growth

---

## 🗄️ Current Database State

### Existing Tables (rag-saas Template)

**✅ KEEP - Core Infrastructure (No Changes Needed)**

- **`users`** - User accounts synced with Supabase Auth, Stripe integration, role-based access
  - Fields: id, email, full_name, stripe_customer_id, role (member/admin), timestamps
  - **Status:** Needs extension with growing profile fields (see below)

- **`conversations`** - AI Coach chat conversations
  - Fields: id, user_id, title, timestamps
  - **Ready for:** `/coach` and `/coach/[conversationId]` routes

- **`messages`** - Individual chat messages within conversations
  - Fields: id, conversation_id, role (user/assistant), content, timestamps
  - **Ready for:** Streaming AI responses with context

- **`documents`** - Document metadata and processing status
  - Fields: id, user_id, filename, file_size, mime_type, file_category, gcs_bucket, gcs_path, status, chunk_count, processing_error, timestamps
  - **Repurposed for:** Admin research article ingestion (not user uploads)

- **`document_chunks`** - Text chunks with dual embedding support
  - Fields: id, user_id, document_id, content, context, chunk_index, metadata (JSONB), text_embedding (768d), multimodal_embedding (1408d), timestamps
  - Indexes: HNSW vector indexes for both embedding types
  - **Ready for:** RAG retrieval of research articles and growing knowledge

- **`document_processing_jobs`** - Async processing queue
  - **Ready for:** Background research article processing

- **`usage_events`** - Usage tracking for tier limits
  - **Ready for:** Free tier limits (3-5 AI queries, 3-5 research articles)

### Template Assessment

**✅ 60% Perfect Fit:** Your rag-saas template is excellent for RAG-powered coaching

**Key Strengths:**
- Multi-modal RAG pipeline ready (text + multimodal embeddings)
- Conversation system perfect for AI coaching
- Stripe + role system ready for three-tier subscriptions
- Usage tracking infrastructure for Free tier limits
- Admin role support for `/admin` section

**What Works Out of the Box:**
- AI Coach conversations → `conversations` + `messages` ✅
- RAG retrieval → `document_chunks` with vector search ✅
- Research article storage → Repurpose `documents` + `document_chunks` ✅
- Tier enforcement → `users.role` + `usage_events` ✅
- Admin access → `users.role = 'admin'` ✅

**What Needs Addition:**
- User growing profiles (climate, space, health goals, constraints)
- Plant database with families and microbiome profiles
- Assessment system for Growing Knowledge Path
- Research article curation (tagging, pinning, tier access)
- Premium garden tracking (activities, Brix, scores)

---

## ⚡ Feature-to-Schema Mapping

### Core Features (Ready to Build)

**✅ AI Coach Chat (`/coach`, `/coach/[conversationId]`)** → Uses `conversations` + `messages`
- Current state: Fully ready
- RAG context retrieved from `document_chunks` (research + knowledge base)
- User profile data from extended `users` table for personalization

**✅ Document Processing for Research Articles** → Uses `documents` + `document_chunks`
- Current state: Pipeline ready, needs admin-driven ingestion workflow
- Automated scraping agents upload to GCS → triggers processing
- Chunks stored with embeddings for RAG retrieval

**✅ Tier-Based Access Control** → Uses `users.stripe_customer_id` + `usage_events`
- Current state: Infrastructure ready
- Free tier limits tracked in `usage_events`
- Stripe API checks for Premium features

**✅ Admin Dashboard** → Uses `users.role = 'admin'`
- Current state: Role system ready
- Admin routes protected by role check

### Features Needing Schema Changes

**🔧 User Personalization (`/profile`)** → Extend `users` table
- Need: Climate, location, space, constraints, experience, learning preferences
- Impact: Powers all AI personalization and planting guide

**🔧 Plant Database (`/plants`)** → Need new tables
- Need: `plants` + `plant_families` tables
- Impact: Browse/filter plants, companion recommendations, "Add to My Garden"

**🔧 Growing Knowledge Path Assessment (`/auth/sign-up`)** → Need new tables
- Need: `assessments` + `assessment_responses` tables
- Impact: Onboarding personalization, conversion intelligence, Discovery Path Report

**🔧 Research Feed (`/research`)** → Need new table
- Need: `research_articles` table (extends documents with curation metadata)
- Impact: Pinning, tier-based visibility, engagement tracking, filtering

**🔧 My Garden Tracking (`/garden` - Premium)** → Need new tables
- Need: `garden_activities` + `brix_measurements` tables
- Impact: Premium validation, progress tracking, microbiome score

**🔧 Health Goal Filtering** → Need junction table
- Need: `user_health_goals` table (many-to-many)
- Impact: Analytics, user filtering, personalized content

---

## 📋 Recommended Changes

**Bottom Line:** You need to make **3 categories of changes**:

### Change Category 1: Extend Users Table (High Priority)

**Problem:** Template has basic user data but your app needs rich growing profiles queried on every AI request

**Action:** Add growing profile fields to `users` table

**New Fields to Add:**
```typescript
// Location & Climate
location_city: text
location_country: text
location_coordinates: text // "lat,lng" for weather API
hemisphere: text // "northern" | "southern"
climate_type: text // "temperate_maritime" | "mediterranean" | etc
hardiness_zone: text // Optional, US only
average_frost_dates: text // JSON: {first: "date", last: "date"}
soil_type: text // "clay" | "sandy" | "loam"

// Space & Constraints
space_type: text // "none" | "balcony" | "small_yard" | "large_yard"
space_size: text // Description or measurement
constraints: text[] // ["hoa", "rental", "limited_sun"]
has_structures: boolean // Tunnel houses, hoop houses

// Growing Context
experience_level: text // "beginner" | "intermediate" | "advanced"
learning_preference: text // "visual" | "step_by_step" | "science_deep"
current_season: text // Auto-calculated based on hemisphere

// Pets & Animals (for microbe transfer context)
pets: text[] // ["dogs", "cats", "chickens"]

// Subscription Tier (denormalized for fast queries)
subscription_tier: text // "free" | "basic" | "premium"
subscription_status: text // "active" | "canceled" | "past_due"
```

**Impact:** Powers AI personalization, planting guide, plant recommendations, HOA compliance

**Implementation:** Add via Drizzle migration, populate from assessment responses

---

### Change Category 2: Plant Database (High Priority)

**Problem:** No plant knowledge structure exists

**Action:** Create normalized plant database

**New Table: `plant_families`**
```typescript
{
  id: uuid (primary key)
  name: text // "Brassicaceae"
  common_name: text // "Cabbage Family"
  description: text // Rich educational content
  quorum_sensing_role: text // How this family contributes
  microbiome_benefits: text // General family benefits
  created_at: timestamp
  updated_at: timestamp
}
```

**New Table: `plants`**
```typescript
{
  id: uuid (primary key)
  family_id: uuid → plant_families.id

  // Basic Info
  name: text // "Kale"
  scientific_name: text // "Brassica oleracea"
  common_names: text[] // ["Kale", "Borecole"]
  difficulty: text // "beginner" | "intermediate" | "advanced"

  // Growing Conditions
  climate_adaptability: text // "wide" | "specific"
  temperature_preference: text // "cool_season" | "warm_season"
  soil_temp_min: integer // Celsius
  soil_temp_max: integer
  frost_tolerance: integer // Celsius, can be negative

  // Microbiome Profile
  beneficial_microbes: text[] // Endophyte types
  endophyte_richness: text // "high" | "medium" | "low"
  quorum_sensing_contribution: text
  fermentation_potential: text

  // Air Filtration
  air_filtration_capacity: text // "high" | "medium" | "low"
  pollutants_filtered: text[] // ["pfas", "vocs", "pesticides"]

  // Ecosystem Context
  beneficial_animals: text[] // ["bees", "ladybugs"]
  common_pests: text[]
  organic_pest_management: text

  // Pet Safety
  dog_safe: boolean
  cat_safe: boolean
  chicken_compatible: boolean
  dog_microbe_transfer: text // How dogs help with this plant

  // Growing Details
  companion_families: uuid[] // Array of family IDs (4+ diversity)
  space_requirements: text // "container_friendly" | "small_space" | "large_garden"

  // Premium Fields
  brix_target_min: decimal
  brix_target_max: decimal
  heritage_varieties: text[] // Landrace names
  seed_sources: text // Where to buy quality seeds
  autoinducer_guidance: text // When/how to use (seed treatment)
  foliar_feed_protocol: text

  // Metadata
  featured_indoor_air_quality: boolean // Featured category flag
  created_at: timestamp
  updated_at: timestamp
}

// Indexes:
- family_id
- difficulty
- climate_adaptability
- featured_indoor_air_quality
- GIN index on beneficial_animals, pollutants_filtered for array queries
```

**Impact:** Powers `/plants` browsing, filtering, companion recommendations, AI suggestions

---

### Change Category 3: Assessment System (High Priority)

**Problem:** Growing Knowledge Path Assessment has no storage for personalization and conversion intelligence

**Action:** Create assessment tracking with normalized responses

**New Table: `assessments`**
```typescript
{
  id: uuid (primary key)
  user_id: uuid → users.id

  // Assessment Context
  completed: boolean
  completion_date: timestamp

  // Metadata
  created_at: timestamp
  updated_at: timestamp
}
```

**New Table: `assessment_responses`**
```typescript
{
  id: uuid (primary key)
  assessment_id: uuid → assessments.id
  user_id: uuid → users.id

  // Question & Answer
  question_key: text // "current_growing_status"
  question_text: text // Full question for analytics
  answer_value: text // User's answer
  answer_type: text // "single_choice" | "multiple_choice" | "text"

  // Metadata
  created_at: timestamp
}

// Indexes:
- assessment_id
- user_id
- question_key (for conversion analytics)
- (question_key, answer_value) composite for filtering
```

**Impact:**
- Powers Discovery Path Report personalization
- Conversion intelligence: "Which health goals drive upgrades?"
- User filtering: "Show me all users struggling with anxiety"
- A/B testing: "Which problem revelations resonate most?"

---

### Change Category 4: Research Article Curation (High Priority)

**Problem:** Need research-specific metadata (pinning, tier access, tagging) that doesn't fit documents table

**Action:** Create dedicated research articles table

**New Table: `research_articles`**
```typescript
{
  id: uuid (primary key)
  document_id: uuid → documents.id // Links to RAG chunks

  // Publication Details
  title: text
  authors: text[]
  journal: text
  publication_date: date
  doi: text
  source_url: text

  // Content
  summary: text // Admin-written or AI-generated
  key_findings: text
  garden_relevance: text // "Why this matters for your garden"

  // Curation
  pinned: boolean // Show at top of feed
  tier_access: text // "free" | "basic" | "premium"
  admin_approved: boolean

  // Engagement
  view_count: integer
  bookmark_count: integer

  // Metadata
  imported_by: uuid → users.id (admin)
  created_at: timestamp
  updated_at: timestamp
}

// Indexes:
- document_id
- pinned
- tier_access
- publication_date (descending for "latest")
- admin_approved
```

**New Table: `article_tags`** (many-to-many)
```typescript
{
  id: uuid (primary key)
  article_id: uuid → research_articles.id
  tag_category: text // "topic" | "plant_family" | "microbe" | "health_condition"
  tag_value: text // "gut_health", "brassicaceae", "lactobacillus", "anxiety"

  created_at: timestamp
}

// Indexes:
- article_id
- (tag_category, tag_value) composite for filtering
- tag_value for autocomplete
```

**Impact:**
- Powers `/research` filtering and discovery
- Admin curation via `/admin/research`
- Conversion tracking: "Which topics drive Free → Basic upgrades?"
- Flexible tagging without schema changes

---

### Change Category 5: Health Goals Junction Table (Medium Priority)

**Problem:** Users have multiple health goals; need clean queries for analytics and filtering

**Action:** Create many-to-many junction table

**New Table: `user_health_goals`**
```typescript
{
  id: uuid (primary key)
  user_id: uuid → users.id
  health_goal: text // "anxiety" | "immunity" | "performance" | "longevity" | "children_health" | "digestion" | "ibs"

  // Priority/Context
  is_primary: boolean // Their main goal

  // Metadata
  created_at: timestamp
}

// Indexes:
- user_id
- health_goal
- (user_id, health_goal) unique constraint
- is_primary
```

**Impact:**
- Analytics: "Which health goals correlate with Premium upgrades?"
- User filtering: "Show all users targeting children's health"
- Personalized content: Recommend research articles matching their goals
- A/B testing: Test messaging per health goal segment

---

### Change Category 6: Premium Garden Tracking (Medium Priority - Post-Launch OK)

**Problem:** Premium tier validation features need tracking infrastructure

**Action:** Create garden activity and Brix measurement tables

**New Table: `garden_activities`**
```typescript
{
  id: uuid (primary key)
  user_id: uuid → users.id

  // Activity Details
  activity_type: text // "planting" | "harvest" | "autoinducer_application" | "foliar_feed" | "composting"
  activity_date: date

  // Planting Specifics
  plant_id: uuid → plants.id (nullable)
  plant_family_id: uuid → plant_families.id (nullable)
  location: text // "Bed 1", "Container 3"

  // Technique Tracking
  technique_used: text // "autoinducers", "foliar_feed", "companion_planting"

  // Notes & Documentation
  notes: text
  photo_url: text // GCS path

  // Metadata
  created_at: timestamp
  updated_at: timestamp
}

// Indexes:
- user_id
- activity_date (descending for timeline)
- plant_id
- activity_type
```

**New Table: `brix_measurements`**
```typescript
{
  id: uuid (primary key)
  user_id: uuid → users.id
  plant_id: uuid → plants.id

  // Measurement
  brix_value: decimal // 0-30+ range
  measurement_date: date

  // Context
  plant_age_days: integer
  growing_location: text
  notes: text

  // Achievement Tracking
  target_min: decimal // From plant profile
  target_max: decimal
  achievement_level: text // "optimal" | "good" | "needs_improvement"

  // Metadata
  created_at: timestamp
}

// Indexes:
- user_id
- plant_id
- measurement_date (descending for trends)
```

**Impact:**
- Powers `/garden` Premium tracking
- Microbiome score calculation based on diversity + Brix + techniques
- Progress validation and gamification
- Success pattern identification

---

## 🎯 Implementation Priority

### Phase 1: MVP Launch (Build These First)

**Week 1-2: Core Personalization**
1. ✅ **Extend users table** - Add growing profile fields
2. ✅ **Create user_health_goals** - Junction table for multi-goal support
3. ✅ **Create assessments + assessment_responses** - Onboarding data capture

**Week 3-4: Content Infrastructure**
4. ✅ **Create plant_families** - Family taxonomy
5. ✅ **Create plants** - Plant database with microbiome profiles
6. ✅ **Create research_articles + article_tags** - Curated research system

**Impact:** AI Coach can now personalize, users can browse plants, research feed works

### Phase 2: Premium Features (Post-Launch Growth)

**Month 2:**
7. ✅ **Create garden_activities** - Premium activity tracking
8. ✅ **Create brix_measurements** - Premium validation metrics

**Impact:** Premium tier has full validation and tracking features

### Phase 3: Analytics & Optimization (Ongoing)

**As Needed:**
- Add indexes based on query performance
- Add computed columns for frequently calculated values (e.g., microbiome_score)
- Add materialized views for complex analytics queries
- Add caching tables for expensive aggregations

---

## 🎯 Strategic Advantage

**Template Assessment:** Your **rag-saas template was an excellent choice** for this app.

**Key Strengths:**
- ✅ Multi-modal RAG pipeline ready (text-embedding-004 + multimodalembedding@001)
- ✅ Conversation system perfect for progressive knowledge coaching
- ✅ Vector search with HNSW indexes for fast retrieval
- ✅ Stripe integration ready for three-tier subscriptions
- ✅ Usage tracking infrastructure for Free tier limits
- ✅ Role-based admin access ready
- ✅ Document processing pipeline ready for research automation

**Perfect Alignment:**
- **AI Coach** uses existing conversations/messages with RAG context from document_chunks ✅
- **Research Feed** repurposes document pipeline for automated article ingestion ✅
- **Tier enforcement** uses existing Stripe + usage_events infrastructure ✅
- **Admin section** uses existing role system ✅

**Strategic Additions:**
- **Domain tables** (plants, assessments, garden tracking) layer perfectly on top of template foundation
- **User profile extension** enhances existing users table without breaking template patterns
- **Research curation** extends documents with domain-specific metadata
- **Health goals junction** enables analytics without template modification

**Next Steps:**
1. Create Drizzle migration to extend users table
2. Create migrations for new domain tables (plants, assessments, research, garden)
3. Seed plant_families with core plant families
4. Build plant database population workflow
5. Start building features with confidence - your schema supports all planned features

**Development Approach:**
- **Phase 1:** Build core features (AI Coach, Plant Database, Research Feed) using extended schema
- **Phase 2:** Add Premium features (Garden tracking, Brix measurements) when user base grows
- **Iterative:** Use `/admin/content` to add knowledge without schema changes
- **Flexible:** article_tags system allows new research categories without migrations

**Confidence Level:** 🟢 **HIGH** - This schema supports your entire MVP and growth roadmap. Template choice was strategic and correct.

---

## 📝 Quick Reference: Schema Changes Summary

**Tables to Keep (7):**
- users (extend with fields)
- conversations
- messages
- documents
- document_chunks
- document_processing_jobs
- usage_events

**Tables to Add (9):**
- plant_families
- plants
- assessments
- assessment_responses
- research_articles
- article_tags
- user_health_goals
- garden_activities (Phase 2)
- brix_measurements (Phase 2)

**Total Tables:** 16 (7 existing + 9 new)

**Critical Indexes to Add:**
- plant_families: name
- plants: family_id, difficulty, featured_indoor_air_quality, GIN on arrays
- assessments: user_id, completed
- assessment_responses: assessment_id, question_key, (question_key, answer_value)
- research_articles: document_id, pinned, tier_access, publication_date DESC
- article_tags: article_id, (tag_category, tag_value)
- user_health_goals: user_id, health_goal, (user_id, health_goal) unique
- garden_activities: user_id, activity_date DESC, plant_id
- brix_measurements: user_id, plant_id, measurement_date DESC
