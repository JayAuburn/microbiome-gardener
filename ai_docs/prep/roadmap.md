# MicrobiomeGardener.ai Development Roadmap

This roadmap is a **feature-based build order** for a solo developer, following the user journey **front-to-back** (landing → auth/onboarding → core features → admin operations → premium + analytics). It intentionally **reuses the existing rag-saas template** (auth, billing, RAG pipeline, chat UI, document processing pipeline) and focuses on domain-driven modifications.

---

## 🚨 Phase 0: Project Setup (MANDATORY FIRST STEP)

**Goal**: Complete template setup and capture project-specific configuration outputs for MicrobiomeGardener.ai.

- [ ] **REQUIRED**: Run `SETUP.md` using **gemini-2.5-pro** on **max mode** for maximum context
- [ ] Capture the key outputs from setup into a short internal note (env vars present, Supabase project ready, GCP bucket + services deployed, Stripe products/price IDs configured)
- [ ] Run dependency installation scripts described in `SETUP.md` (`npm install` at root, then template setup scripts)
- [ ] Run Drizzle scripts only from `apps/web/` (per template safety constraints) when you begin schema work in later phases

### Enable Row Level Security (RLS) Policies
[Goal: Secure all database tables with proper RLS policies before development continues.]

- [ ] Create RLS policies migration from `apps/web/`:
  - [ ] Generate custom migration: `npm run db:generate:custom`
  - [ ] Add RLS policies for all existing tables to the migration file:
    - **users:** Users can only read/update their own record
    - **documents:** Users can only access their own documents
    - **document_chunks:** Users can only access chunks from their documents
    - **document_processing_jobs:** Users can see jobs for their documents; admins see all
    - **conversations:** Users can only access their own conversations
    - **messages:** Users can only access messages in their conversations
    - **user_usage_events:** Users can only read their own usage events
  - [ ] Enable RLS on all tables: `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`
  - [ ] Create down migration for RLS policies (rollback capability)
  - [ ] Apply migration: `npm run db:migrate`
- [ ] Add admin bypass policies where needed (admins can access all data for support)
- [ ] Document RLS policy patterns for new tables added in later phases

### Fix Database Function Security Warnings
[Goal: Harden RPC functions against search_path attacks.]

- [ ] Create security hardening migration from `apps/web/`:
  - [ ] Generate custom migration: `npm run db:generate:custom`
  - [ ] Fix `match_text_chunks` function: Add `SET search_path = public, pg_temp;` to function definition
  - [ ] Fix `match_multimodal_chunks` function: Add `SET search_path = public, pg_temp;` to function definition
  - [ ] Fix `handle_new_user` function: Add `SET search_path = public, pg_temp;` to function definition
  - [ ] Create down migration (restore original functions)
  - [ ] Apply migration: `npm run db:migrate`

### Enable Auth Security Features (Optional but Recommended)
[Goal: Enable additional authentication security features in Supabase.]

- [ ] Navigate to Supabase Dashboard → Authentication → Password Protection
- [ ] Enable "Leaked Password Protection" (checks passwords against HaveIBeenPwned.org)
- [ ] **Note:** This is optional for development but recommended before production launch

- [ ] **🎯 PHASE COMPLETE**: Template runs locally, core services configured, database secured with RLS policies and hardened functions

---

## Phase 1: Public Landing + Legal (Two-Track Messaging)

**Goal**: Update public experience to match MicrobiomeGardener.ai brand and ad-compliant messaging.

### Landing page content & sections
[Goal: Align the public landing page with the "public track" messaging and the 3-tier offer.]

- [ ] Update landing composition in `apps/web/app/(public)/page.tsx` (keep existing section components, update copy and ordering as needed)
- [ ] Update hero copy and CTA in `apps/web/components/landing/HeroSection.tsx`:
  - Headline: "The Missing Link Between Growing Methods and Microbiome Restoration"
  - Subheadline highlighting global accessibility: "Personalized for your climate - Northern or Southern hemisphere"
  - CTA: "Discover Your Growing Knowledge Path"
- [ ] Update problem framing in `apps/web/components/landing/ProblemSection.tsx`:
  - "Why store-bought (even organic) may not restore beneficial microbes"
  - **Key science:** "Plants contain microbes inside them - growing method determines if they help or harm your gut"
  - **Critical insight:** "Even cooking doesn't eliminate the problem - endotoxins from pathogenic microbes persist"
  - Research credibility messaging (Graz study on microbes in plants, studies showing different practices transfer different microbes)
  - Use public-safe, ad-compliant language throughout
- [ ] Add/update the indoor air quality hook in `apps/web/components/landing/FeaturesSection.tsx`:
  - "Plants filter ALL pollutants (PFAS, chemicals, dust, pesticides)"
  - Indoor and outdoor protection messaging
  - Public-safe, no medical claims
- [ ] Update or add complete system teaser in `apps/web/components/landing/RAGDemoSection.tsx`:
  - Visual/text flow: Seed (endophytes) → Soil (4+ families, quorum sensing) → Plant (microbes grow INSIDE plant) → Food (cooked or raw, endotoxins persist) → Gut (beneficial or pathogenic based on growing method)
  - Universal principles message: "Adapted to YOUR climate"
  - Works globally (any hemisphere, any location)
- [ ] Update pricing tiers and plan names in `apps/web/components/landing/PricingSection.tsx`:
  - Discovery (Free) → Implementation (Basic $27–47) → Mastery (Premium $67–97)
  - Feature breakdown per tier matching prep doc specifications
  - Include tier-specific benefits and conversion drivers
- [ ] Update FAQ content in `apps/web/components/landing/FAQSection.tsx`:
  - Microbiome gardening-specific questions
  - HOA/constraint solutions
  - Climate adaptability questions
  - "How is this different from regular gardening?" type questions
- [ ] Update footer in `apps/web/components/landing/Footer.tsx` with correct legal links and branding
- [ ] Update CTA section in `apps/web/components/landing/CTASection.tsx` with assessment-focused messaging

### Brand assets & metadata
[Goal: Make brand consistent across icons, metadata, and navigation.]

- [ ] Replace logo assets in `apps/web/public/` (keep filenames used by code where possible)
- [ ] Update global metadata in `apps/web/lib/metadata.ts` (already branded) and align OpenGraph image paths with assets in `apps/web/public/`
- [ ] Update favicon/apple icon assets in `apps/web/app/favicon.ico` and `apps/web/app/apple-icon.png` if needed

### Legal pages + disclaimers
[Goal: Publish compliant terms and disclaimers for health coaching and educational positioning.]

- [ ] Update privacy policy in `apps/web/app/(public)/privacy/page.tsx`:
  - GDPR compliance sections
  - Health data handling policies
  - Conversion intelligence tracking disclosures
- [ ] Update terms of service in `apps/web/app/(public)/terms/page.tsx`:
  - Health coaching disclaimers ("not medical advice")
  - FDA compliance language ("not intended to diagnose, treat, cure, or prevent")
  - Educational positioning statements
  - Subscription terms and cancellation policies
- [ ] Update cookies policy in `apps/web/app/(public)/cookies/page.tsx`:
  - Tracking and analytics disclosures
  - Usage event tracking explanation
- [ ] Add a reusable disclaimer component in `apps/web/components/disclaimers/HealthDisclaimer.tsx`:
  - "This is educational information, not medical advice"
  - "Consult your healthcare provider for medical decisions"
  - Embed this component in member-facing pages (Discovery Path report, AI Coach, etc.)

### Two-track messaging content stores
[Goal: Centralize messaging for consistency across public and member areas.]

- [ ] Create messaging content stores:
  - [ ] `apps/web/lib/content/public-messaging.ts` (ad-compliant copy for landing/marketing)
  - [ ] `apps/web/lib/content/member-messaging.ts` (stronger education with disclaimers for in-app)
  - [ ] `apps/web/lib/content/conversion-prompts.ts` (upgrade messaging by context)
- [ ] Implement messaging switcher utility that uses appropriate content based on context
- [ ] **🎯 PHASE COMPLETE**: Landing + legal pages match public-track requirements, disclaimer system ready, messaging stores established

---

## Phase 2: Signup Onboarding (Growing Knowledge Path Assessment + Email Infrastructure)

**Goal**: Convert the existing signup flow into MicrobiomeGardener's assessment-driven onboarding and persist answers for personalization and conversion intelligence. Set up email infrastructure for immediate onboarding communications.

### Database foundation (assessment + extended profile)
[Goal: Store onboarding inputs in a normalized way and enrich user profile fields for downstream personalization.]

- [ ] Extend `apps/web/lib/drizzle/schema/users.ts` with growing profile fields:
  - location_city, location_country, location_coordinates (lat,lng as text)
  - hemisphere ("northern" | "southern")
  - climate_type (temperate_maritime, mediterranean, tropical, arid, continental, etc.)
  - hardiness_zone (text, optional, US only)
  - average_frost_dates (text/JSON: {first, last})
  - soil_type ("clay" | "sandy" | "loam" | "unknown")
  - space_type ("none" | "balcony" | "small_yard" | "large_yard")
  - space_size (text description or measurement)
  - constraints (text array: hoa, rental, limited_sun, etc.)
  - has_structures (boolean for tunnel/hoop houses)
  - experience_level ("beginner" | "intermediate" | "advanced")
  - learning_preference ("visual" | "step_by_step" | "science_deep")
  - current_season (text, auto-calculated based on hemisphere and month)
  - pets (text array: dogs, cats, chickens)
  - subscription_tier ("free" | "basic" | "premium" - denormalized cache)
  - subscription_status ("active" | "canceled" | "past_due")
- [ ] Add new schema files:
  - [ ] `apps/web/lib/drizzle/schema/assessments.ts`
  - [ ] `apps/web/lib/drizzle/schema/assessment_responses.ts`
  - [ ] `apps/web/lib/drizzle/schema/user_health_goals.ts`
- [ ] Export new tables from `apps/web/lib/drizzle/schema/index.ts`
- [ ] Generate and apply migrations from `apps/web/`:
  - [ ] `npm run db:generate`
  - [ ] **Add RLS policies** to migration file for new tables (assessments, assessment_responses, user_health_goals):
    - Enable RLS on each table
    - Users can only access their own records
    - Admins can access all records for support
  - [ ] Create down migrations in `apps/web/drizzle/migrations/*/down.sql` (per template)
  - [ ] `npm run db:migrate`

### Signup UI (assessment embedded)
[Goal: Embed a public-compliant assessment in signup and persist it after account creation.]

- [ ] Create `apps/web/components/assessment/GrowingKnowledgePathAssessment.tsx` (multi-step UI; public-track language)
- [ ] Implement all 10 assessment questions with public-compliant messaging:
  - Q1: Current growing status (Yes/No/Used to) - captures baseline
  - Q2: Health frustrations (Anxiety, IBS, immunity, performance, digestion, longevity, children's health) - captures conversion drivers
  - Q3: What they've tried (probiotics, supplements, diet changes) - captures failed solutions
  - Q4: Knowledge baseline: "Have you heard that HOW food is grown affects gut microbiome benefits?"
  - Q5: Fermentation use (current probiotic/fermented food use)
  - Q6: Urgency assessment (what outcome matters most)
  - Q7: Space assessment (none, balcony, small yard, large yard)
  - Q8: Constraints (HOA, rental, pets in garden, limited sun)
  - Q9: Climate/location (city, country for hemisphere detection)
  - Q10: Learning preference (visual, step-by-step, science-deep)
- [ ] Integrate the assessment into `apps/web/components/auth/SignUpForm.tsx` (capture answers alongside email/password)
- [ ] Update signup flow in `apps/web/app/(auth)/auth/sign-up/page.tsx` if needed to support a larger form container
- [ ] Add progress indicator for multi-step assessment (step X of 10)

### Server actions (persist assessment + update profile)
[Goal: Save assessment responses and derive initial profile values.]

- [ ] Add `apps/web/app/actions/assessments.ts`:
  - [ ] createAssessmentForUser(userId)
  - [ ] saveAssessmentResponses(assessmentId, responses[])
  - [ ] setInitialUserProfileFromAssessment(userId, derivedFields)
  - [ ] deriveHealthGoalsFromResponses(responses) - create user_health_goals records
- [ ] Implement hemisphere derivation logic:
  - Latitude-based: positive = Northern, negative = Southern
  - Fall back to user selection if coordinates aren't provided
  - Auto-calculate current season based on hemisphere and month
- [ ] Add conversion intelligence tracking:
  - Log assessment completion events to usage_events
  - Track which question responses correlate with later upgrades

### Post-signup "Discovery Path" report
[Goal: Deliver the "member track" report after signup and set up a natural upgrade path.]

- [ ] Add a protected route: `apps/web/app/(protected)/discovery-path/page.tsx`
- [ ] Build report component: `apps/web/components/assessment/DiscoveryPathReport.tsx`
- [ ] Render member-track messaging with educational disclaimers:
  - Welcome: "Here's what you're about to discover that changes everything"
  - **Critical revelation:** "Plants contain microbes inside them (research shows significant portion of plant's microbes are internal, not just on surface)"
  - **Growing method determines beneficial vs pathogenic:** Chemically grown = pathogenic microbes; Organic = beneficial; Better practices = greatly increased beneficial
  - **Cooking revelation:** "Even cooking doesn't solve it - endotoxins and chemical signals from dead pathogenic microbes persist and damage your gut"
  - **Medical field gap:** "This is why 'eat more plants' advice fails - medical researchers don't consider HOW plants were grown; soil microbiologists understand these connections"
  - Three-level problem education (conventional actively harmful via endotoxins, organic mostly beneficial, better practices = greatly increased benefits)
  - Core truth: "You can't replace what you don't have access to"
  - Indoor air quality revelation (ALL pollutants)
  - Complete system overview (seed → soil → plant (microbes IN plant) → food (cooked or raw) → gut)
  - Personalized first step based on their space/constraints
- [ ] Add "Next step" CTAs from the report into Basic tier features (Planting Guide, Plant Database, AI Coach)
- [ ] Include health disclaimer component throughout the report

### Email infrastructure + onboarding sequence
[Goal: Set up email sending immediately so welcome emails work after signup.]

- [ ] Choose email service provider (Resend recommended for Next.js, or SendGrid)
- [ ] Add email service configuration to `apps/web/.env.local`
- [ ] Create email service client: `apps/web/lib/email/client.ts`
- [ ] Build onboarding email templates in `apps/web/lib/email/templates/`:
  - [ ] `welcome.tsx` (Day 0: Welcome + core principle introduction)
  - [ ] `getting-started.tsx` (Day 2: How to maximize app benefits)
  - [ ] `seasonal-action.tsx` (Day 5: Seasonal action reminder based on location)
- [ ] Implement email sending actions in `apps/web/app/actions/email.ts`:
  - sendWelcomeEmail (triggered after signup)
  - sendOnboardingSequence (scheduled emails)
- [ ] Trigger welcome email after assessment completion in signup flow
- [ ] Set up basic email scheduling (use pg_cron or external cron service):
  - Day 2 and Day 5 follow-up emails
- [ ] **🎯 PHASE COMPLETE**: New users complete assessment, land on Discovery Path report, and receive welcome emails

---

## Phase 3: Profile Management (Growing Context + Subscription UX)

**Goal**: Build full profile management UI so users can control their growing context before using core features.

### Profile UI structure
[Goal: Implement tabs and editable fields aligned with the wireframe.]

- [ ] Update `apps/web/app/(protected)/profile/page.tsx` to use enhanced layout
- [ ] Update profile client in `apps/web/components/profile/ProfilePageClient.tsx` to include tabs:
  - Account Information
  - Growing Profile
  - Health Goals
  - Usage & Analytics
  - Subscription Management
- [ ] Build/update components under `apps/web/components/profile/`:
  - [ ] `AccountInfo.tsx` (email, name, member since, security settings, account deletion)
  - [ ] `GrowingProfile.tsx` (editable growing context fields with all user profile extensions)
  - [ ] `HealthGoals.tsx` (manage multi-select health goals with primary goal indicator)
  - [ ] `UsageAnalytics.tsx` (AI queries, research reads, progression metrics)
  - [ ] Update `SubscriptionPlansCard.tsx` with new tier names (Discovery/Implementation/Mastery) and features

### Server actions
[Goal: Persist profile edits and keep AI Coach context up to date.]

- [ ] Extend `apps/web/app/actions/profile.ts`:
  - updateGrowingProfile (all growing context fields)
  - updateAccountInfo (name, etc.)
  - deleteAccount (with confirmation and data cleanup)
- [ ] Add `apps/web/app/actions/health-goals.ts`:
  - addHealthGoal, removeHealthGoal
  - setPrimaryHealthGoal
  - getHealthGoalsForUser
- [ ] Add "Re-take Assessment" flow:
  - Create modal component for re-taking assessment
  - Update all profile fields based on new responses
  - Track knowledge progression over time (store assessment completion history)

### Billing UX alignment
[Goal: Align plan names and in-app upgrade experience to Discovery/Implementation/Mastery.]

- [ ] Update plan copy in billing components:
  - Discovery (Free) feature list
  - Implementation (Basic $27–47) feature list
  - Mastery (Premium $67–97) feature list
- [ ] Add contextual upgrade messaging based on user behavior:
  - Discovery hitting research limit: "Unlock unlimited AI coaching - Basic $27-47/mo"
  - Basic viewing Premium features: "Unlock advanced climate mastery - Premium $67-97/mo"
- [ ] Keep Stripe integration in `apps/web/app/actions/subscriptions.ts`, update messaging and plan labels only
- [ ] Implement usage analytics display:
  - AI Coach queries used (if Discovery tier)
  - Research articles read (Discovery: X of 5 used)
  - Days active, plants learned, techniques explored
- [ ] **🎯 PHASE COMPLETE**: Users have full control over growing context, health goals, and subscriptions before using core features

---

## Phase 4: Admin Knowledge Ingestion (Research + Modules) + RAG Status Monitoring

**Goal**: Create an admin workflow to publish the knowledge base into the existing RAG pipeline and expose processing progress in the UI.

### Database foundation (research metadata + tagging + knowledge taxonomy)
[Goal: Store rich research metadata while continuing to use the template's `documents` + `document_chunks` for embeddings.]

- [ ] Extend `apps/web/lib/drizzle/schema/documents.ts` to support knowledge base scoping:
  - Add `kind` field: "user_upload" | "kb_research" | "kb_module" (knowledge base types)
  - Add `visibility` field: "private" | "published" (controls global access)
  - Add `module_category` field (text, nullable): "core_principles" | "seed_quality" | "advanced_techniques" | etc.
  - Update RLS policies if needed to support admin publishing workflow
- [ ] Add schema files:
  - [ ] `apps/web/lib/drizzle/schema/research_articles.ts` (links to `documents.id`)
  - [ ] `apps/web/lib/drizzle/schema/article_tags.ts`
- [ ] Export from `apps/web/lib/drizzle/schema/index.ts`
- [ ] Generate/apply migrations from `apps/web/`:
  - [ ] `npm run db:generate`
  - [ ] **Add RLS policies** for new tables (research_articles: admins manage, users read based on tier; article_tags: admin-managed)
  - [ ] Create down migrations
  - [ ] `npm run db:migrate`

### Admin routes & navigation
[Goal: Provide admin-only pages aligned with the wireframe.]

- [ ] Add admin routes under `apps/web/app/(protected)/admin/`:
  - [ ] `research/page.tsx` (queue + published list)
  - [ ] `research/new/page.tsx` (upload + metadata)
  - [ ] `research/[id]/edit/page.tsx` (edit article metadata and tags)
  - [ ] `content/page.tsx` (modules tree + uploads)
  - [ ] `content/[module]/page.tsx` (module-specific content management)
  - [ ] `content/zone-templates/page.tsx` (zone planting templates management - **HIGH PRIORITY**)
  - [ ] `equipment/page.tsx` (equipment items management for cost calculator)
  - [ ] `users/page.tsx` (user list/filter)
  - [ ] `users/[id]/page.tsx` (user detail view)
  - [ ] `analytics/page.tsx` (placeholder shell; full metrics in Phase 10)
- [ ] Extend sidebar nav in `apps/web/components/layout/AppSidebar.tsx`:
  - Update user nav: rename "Chat" → "AI Coach"
  - Add nav items (tier-gated later): Planting Guide, Plant Database, Research Feed, Equipment Calculator, My Garden
  - Add admin group links for Analytics, Research Mgmt, Users, Content, Plants, Equipment
  - Hide or repurpose "Documents" nav item (becomes admin-only)
- [ ] Gate admin routes using existing role checks (`users.role = 'admin'`) in middleware/guards used by `(protected)` routes

### Research ingestion (admin upload using existing document pipeline)
[Goal: Reuse the working upload pipeline and attach research metadata + tags.]

- [ ] Create admin upload UI: `apps/web/components/admin/research/ArticleUploadForm.tsx`
- [ ] **Priority research to upload:** Graz study on microbes in plants (apple study showing significant portion of microbes are inside plant, not just surface)
- [ ] Use the existing signed URL upload endpoint and completion flow under `apps/web/app/api/documents/*` for PDF ingestion
- [ ] Create server actions: `apps/web/app/actions/admin/research.ts`
  - [ ] createResearchArticle (creates `documents` row with kind='kb_research' + `research_articles` row, sets tier_access/admin_approved defaults)
  - [ ] updateResearchArticle (metadata, summary, garden_relevance)
  - [ ] setTierAccess, setPinned, setApproved (admin curation actions)
  - [ ] addArticleTag, removeArticleTag (tag management)
  - [ ] deleteResearchArticle (soft or hard delete with cascade consideration)
- [ ] Create data queries in `apps/web/lib/admin/research.ts`:
  - getResearchArticles (with filters: status, tier, approved, pinned)
  - getResearchArticleById
  - getArticlesByTag
  - getPendingReviewArticles (admin queue)

### Content modules management (modular knowledge base)
[Goal: Build a flexible module system for organizing knowledge into categories that can be added without code changes.]

- [ ] Define initial module taxonomy as constants in `apps/web/lib/constants/modules.ts`:
  - **Microbes IN Plants (CRITICAL NEW MODULE - HIGH PRIORITY):**
    - Graz study reference (significant portion of plant's microbes are inside, varies by plant)
    - Growing method determines beneficial vs pathogenic microbes inside plant
    - Chemically grown plants contain pathogenic microbes that persist as endotoxins after cooking
    - Organic plants contain mostly beneficial microbes
    - Better microbial practices greatly increase beneficial microbes inside plants
    - Cooking/heating kills microbes but endotoxins and chemical signaling remain
    - Medical field gap: "eat more plants" advice without considering growing method
    - Soil microbiologist vs medical researcher knowledge gap
  - Core Principles (4+ families, quorum sensing, endophytes, autoinduction mechanisms)
  - Seed Quality (heritage/landrace, sourcing, endophyte richness)
  - Advanced Techniques (autoinducers seed treatment, foliar feeds, Brix as indicator tool)
  - Animal Integration (pollinators, pests, pets, beneficial animals)
  - **Zone Planting & Design Systems** (MAJOR FOCUS):
    - Perimeter protective planting (pollution control, fire protection)
    - Fire-resistant perimeter species and defensible space
    - Flood management and water flow design
    - Hydrology and water harvesting systems
    - Swales design and implementation
    - Rainwater collection infrastructure
    - Natural ponds and water features
    - Ecological zone layouts (protection/production/ecosystem)
    - Plant family spacing for root proximity
  - Local Bylaws & Compliance (front yard gardens, fence requirements, water usage, fire codes)
  - Climate Strategies (adaptive timing, resilience, infrastructure)
  - Growing Methods (composting, seed raising, soil building)
  - **Produce Handling & Storage**:
    - Pick and eat benefits (immediate consumption)
    - Various storage methods (root cellaring, cold storage, drying, freezing)
    - Fermentation (optional - methods, quorum sensing context, autoinduction in ferments)
    - Preservation techniques that maintain microbiome benefits
- [ ] Build content modules UI: `apps/web/components/admin/content/ModulesTree.tsx`
- [ ] Build module upload: `apps/web/components/admin/content/ModuleUploadForm.tsx`
- [ ] Create server actions: `apps/web/app/actions/admin/content.ts`
  - uploadModuleDocument (creates document with kind='kb_module', module_category set)
  - updateModuleDocument
  - archiveModuleDocument
- [ ] Add inline preview/edit capability for quick corrections

### Zone planting templates management (HIGH PRIORITY)
[Goal: Create reusable zone design templates that AI Coach can reference for personalized garden layout guidance.]

- [ ] Build zone templates management UI: `apps/web/components/admin/content/ZoneTemplates.tsx`
- [ ] Create zone template types:
  - **Perimeter Protection Templates** (fire-resistant species, pollution barriers, defensible space)
  - **Water Management Templates** (swales placement, rainwater collection, natural ponds, flood zones)
  - **Production Zone Templates** (main growing areas with 4+ family diversity, spacing guidelines)
  - **Ecosystem Support Templates** (native plants, beneficial animals, pollinators)
- [ ] Add zone template editing:
  - Template name, description, applicable climates
  - Plant recommendations by zone type
  - Spacing and layout guidelines
  - Local bylaw considerations
  - Water flow and hydrology notes
- [ ] Link zone templates to AI Coach knowledge base for personalized recommendations
- [ ] Add server actions for zone template management in `apps/web/app/actions/admin/content.ts`

### Admin content quality control (knowledge correction system)
[Goal: Enable admin to identify and fix AI response issues quickly based on actual user interactions.]

- [ ] Build quality control dashboard: `apps/web/components/admin/content/QualityControl.tsx`
- [ ] Add quick search feature for finding content to correct:
  - Search across modules and documents
  - Filter by category, tags, last updated
  - Jump directly to edit mode
- [ ] Implement "Recent User Questions Needing Review" feed:
  - [ ] Track AI Coach questions where responses may need improvement
  - [ ] Flag questions that couldn't be answered well from knowledge base
  - [ ] Link questions to relevant knowledge modules for editing
  - [ ] Add admin action to mark question as "reviewed"
- [ ] Add AI response preview/testing tools:
  - [ ] `apps/web/components/admin/content/AIResponseTester.tsx`
  - [ ] Input test questions and see how AI uses updated content
  - [ ] Compare before/after responses when editing knowledge
  - [ ] Show which chunks are being retrieved for test questions
- [ ] Implement version control for knowledge updates:
  - [ ] Track edit history for documents and modules
  - [ ] Show "last updated" timestamps in admin UI
  - [ ] Add rollback capability for content changes
  - [ ] Store edit reasons/notes for audit trail
- [ ] Add server actions for quality control:
  - flagQuestionForReview (admin marks AI response as needing improvement)
  - testAIResponse (preview how AI will answer with current knowledge)
  - rollbackContentVersion (restore previous version)
  - getEditHistory (view change log for module/document)

### RAG processing status monitoring (admin-scoped)
[Goal: Show upload/processing progress for admin-ingested research and content modules using `document_processing_jobs`.]

- [ ] Extend polling endpoint `apps/web/app/api/documents/processing-status/route.ts`:
  - Support admin-scoped queries (filter by kind='kb_research' or 'kb_module')
  - Return active + recent jobs for admin pages
- [ ] Build polling hook `apps/web/hooks/useProcessingJobs.ts`:
  - Poll every ~2s while active jobs exist
  - Auto-refresh on completion
  - Handle errors gracefully
- [ ] Add status component `apps/web/components/admin/research/ProcessingStatus.tsx`:
  - Display processing stages: uploading → processing → embeddings → completed / error
  - Show progress indicators (e.g., "Processing page 5 of 12")
  - Retry action for failed jobs
  - Real-time updates via polling
- [ ] Add processing badges in admin lists:
  - Status badges in research article lists (processing, complete, failed)
  - Link each job to its research article or module document record
  - Show estimated completion time if available
- [ ] **🎯 PHASE COMPLETE**: Admin can upload research/module docs, see processing progress, and users can manage complete profiles

---

## Phase 5: Plant Database (Admin Manage + Member Browse)

**Goal**: Build the plant/family database and the member-facing browse + detail experience.

### Database foundation (plants + families)
[Goal: Create the domain database for plants and families, including premium-only fields.]

- [ ] Add schema file `apps/web/lib/drizzle/schema/plant_families.ts`:
  - id, name (scientific), common_name
  - description (educational content)
  - quorum_sensing_role, microbiome_benefits
  - created_at, updated_at
- [ ] Add schema file `apps/web/lib/drizzle/schema/plants.ts`:
  - id, family_id (FK to plant_families)
  - name, scientific_name, common_names (text array)
  - difficulty, climate_adaptability, temperature_preference
  - soil_temp_min, soil_temp_max, frost_tolerance
  - beneficial_microbes_potential (text array - general microbe patterns this plant family tends to support, not fixed profile)
  - endophyte_richness_indicator (text - general indicator of endophyte hosting potential)
  - quorum_sensing_contribution (text - how this plant typically contributes to soil microbe communication)
  - fermentation_potential (text - fermentation options if applicable, with probiotics/prebiotics context)
  - air_filtration_capacity, pollutants_filtered (text array)
  - beneficial_animals (text array), common_pests (text array)
  - organic_pest_management (text)
  - dog_safe, cat_safe, chicken_compatible (booleans)
  - dog_microbe_transfer (text - how dogs help with this plant)
  - companion_families (uuid array - other family IDs for diversity)
  - space_requirements (container_friendly, small_space, large_garden)
  - **image_urls (text array - plant photos for visual identification)**
  - **produce_storage_methods (text - various storage methods: pick-and-eat benefits, root cellaring, freezing, drying, with fermentation as optional method including probiotics/prebiotics content and quorum sensing context)**
  - brix_target_min, brix_target_max (Premium fields - Brix as indicator tool only)
  - heritage_varieties (text array - Premium)
  - seed_sources (text - Premium sourcing guidance)
  - autoinducer_guidance (text - seed treatment only, contextual)
  - foliar_feed_protocol (text)
  - featured_indoor_air_quality (boolean flag)
  - created_at, updated_at
- [ ] Add indexes: family_id, difficulty, climate_adaptability, featured_indoor_air_quality
- [ ] Add GIN indexes on array fields (beneficial_animals, pollutants_filtered, beneficial_microbes_potential, image_urls)
- [ ] Export from `apps/web/lib/drizzle/schema/index.ts`
- [ ] Generate/apply migrations from `apps/web/`:
  - [ ] `npm run db:generate`
  - [ ] **Add RLS policies** for new tables (plant_families and plants: all users can read, admins can write)
  - [ ] Create down migrations
  - [ ] `npm run db:migrate`

### Initial plant database seeding
[Goal: Populate the database with foundational plant families and starter plants.]

- [ ] Create seed data file: `apps/web/lib/seed-data/plant-families.ts`
- [ ] Create seed data file: `apps/web/lib/seed-data/plants.ts`
- [ ] Add seeding script or server action: `apps/web/app/actions/admin/seed.ts`
  - seedPlantFamilies() - insert core families (Brassicaceae, Solanaceae, Fabaceae, Cucurbitaceae, Apiaceae, etc.)
  - seedPlants() - insert starter plants for each family
- [ ] Run seeding from admin UI or via one-time script

### Admin management UI
[Goal: Let admins populate and maintain plant/family records.]

- [ ] Create admin pages:
  - [ ] `apps/web/app/(protected)/admin/plants/page.tsx` (list view with filters)
  - [ ] `apps/web/app/(protected)/admin/plants/new/page.tsx` (create form)
  - [ ] `apps/web/app/(protected)/admin/plants/[id]/page.tsx` (edit form)
  - [ ] `apps/web/app/(protected)/admin/plants/families/page.tsx` (family management)
- [ ] Build components:
  - [ ] `apps/web/components/admin/plants/PlantForm.tsx` (comprehensive form with all fields):
    - **Image upload section** (multiple plant photos to GCS)
    - Basic info fields
    - Growing conditions
    - **Beneficial microbe potential** (general patterns, not fixed profiles - varies by growing conditions)
    - **Produce handling fields** (storage methods, fermentation options, pick-and-eat benefits)
    - Premium fields
  - [ ] `apps/web/components/admin/plants/PlantList.tsx` (filterable list with search and image thumbnails)
  - [ ] `apps/web/components/admin/plants/FamilyForm.tsx` (family creation/editing)
- [ ] Add server actions: `apps/web/app/actions/admin/plants.ts`
  - createPlant, updatePlant, deletePlant
  - uploadPlantImages (upload to GCS and update image_urls array)
  - updateProduceStorageInfo (quick edit for produce handling guidance)
  - createPlantFamily, updatePlantFamily, deletePlantFamily
  - bulkImportPlants (optional: CSV/JSON import)
- [ ] Add quick edit capability for frequently updated fields:
  - Inline editing for produce_storage_methods
  - Quick image management (add/remove/reorder plant photos)
  - Easy updates to fermentation guidance without full form

### Admin equipment management (for cost calculator)
[Goal: Let admins maintain equipment database for member-facing cost calculator.]

- [ ] Create admin equipment pages:
  - [ ] `apps/web/app/(protected)/admin/equipment/page.tsx` (equipment list)
  - [ ] `apps/web/app/(protected)/admin/equipment/new/page.tsx` (add equipment)
  - [ ] `apps/web/app/(protected)/admin/equipment/[id]/page.tsx` (edit equipment)
- [ ] Build components:
  - [ ] `apps/web/components/admin/equipment/EquipmentForm.tsx`
  - [ ] `apps/web/components/admin/equipment/EquipmentList.tsx`
- [ ] Add server actions: `apps/web/app/actions/admin/equipment.ts`:
  - createEquipmentItem, updateEquipmentItem, deleteEquipmentItem
  - updateEquipmentPricing (keep costs current)

### Member browse + detail UI
[Goal: Deliver the `/plants` and `/plants/[id]` experience from the wireframe, with tier gating.]

- [ ] Add member routes:
  - [ ] `apps/web/app/(protected)/plants/page.tsx` (browse/filter/search)
  - [ ] `apps/web/app/(protected)/plants/[id]/page.tsx` (detailed profile)
- [ ] Build components:
  - [ ] `apps/web/components/plants/PlantFilters.tsx` (family, health goals, climate, space, animals, pet safety, featured)
  - [ ] `apps/web/components/plants/PlantCard.tsx` (grid card with key info + plant image)
  - [ ] `apps/web/components/plants/PlantList.tsx` (grid/list view toggle, pagination)
  - [ ] `apps/web/components/plants/PlantProfile.tsx` (comprehensive detail page with tier-gated sections):
    - **Plant image gallery** (display multiple angles/growth stages from image_urls array)
    - Basic info with visual identification
    - **Beneficial microbe potential section** (NOT fixed profile - general patterns):
      - **"Plants contain microbes inside them"** (Graz study: significant portion of plant's microbes are internal)
      - "Plants in this family typically support these beneficial microbe types INSIDE the plant when grown with proper practices"
      - **Growing method impact:** Chemically grown = pathogenic; Organic = beneficial; Better practices = greatly increased beneficial
      - **Cooking note:** "Even cooked, endotoxins and signals from pathogenic microbes persist - growing method matters regardless of preparation"
      - Endophyte hosting potential indicator (varies by growing conditions)
      - Quorum sensing contribution (how this plant contributes to soil microbe communication)
      - Explanation: actual microbes vary by soil, growing method, and conditions
    - **Produce handling section:**
      - Pick and eat benefits (immediate consumption advantages)
      - Storage methods (root cellaring, cold storage, drying, freezing)
      - Fermentation options (if applicable - methods, probiotics/prebiotics potential, with quorum sensing/autoinduction as explanatory context)
      - Which methods preserve microbiome benefits best
    - Growing information and climate requirements
    - Premium fields (Brix targets as indicator tool, heritage varieties, sourcing)
  - [ ] `apps/web/components/plants/CompanionPlants.tsx` (show companion family recommendations)
- [ ] Create data layer: `apps/web/lib/plants.ts`
  - getPlants (filters, pagination, search)
  - getPlantById (with family relationship and companions)
  - getPlantsByFamily
  - getPlantsByHealthGoal (join through families)
  - getFeaturedIndoorAirQualityPlants
  - getCompanionPlants (based on companion_families array)
- [ ] Add server actions: `apps/web/app/actions/plants.ts`
  - openChatWithPlantContext (opens AI Coach with plant pre-loaded)
  - addPlantToGarden (Premium - creates garden_activity record)
- [ ] Implement tier gating: Free → paywall overlay; Basic/Premium → full access
- [ ] **🎯 PHASE COMPLETE**: Admin can manage plants; members can browse and view plant profiles (tier-gated); users have full profile control

---

## Phase 6: Research Feed (Member Experience + Tier Limits)

**Goal**: Deliver the member-facing research feed with tier access rules, tags, bookmarks, and upgrade prompts.

### Member research routes + components
[Goal: Build `/research` and `/research/[id]` using research metadata + tags.]

- [ ] Add member routes:
  - [ ] `apps/web/app/(protected)/research/page.tsx` (main feed with filters)
  - [ ] `apps/web/app/(protected)/research/[id]/page.tsx` (article detail)
  - [ ] `apps/web/app/(protected)/research/bookmarks/page.tsx` (Premium bookmarked articles)
- [ ] Build components:
  - [ ] `apps/web/components/research/ArticleFeed.tsx` (chronological feed with pinned articles at top)
  - [ ] `apps/web/components/research/ResearchFilters.tsx` (tag-based filters with expandable categories)
  - [ ] `apps/web/components/research/ArticleCard.tsx` (summary card with tier badge)
  - [ ] `apps/web/components/research/ArticleDetail.tsx` (full article view with related articles)
  - [ ] `apps/web/components/research/BookmarkButton.tsx` (Premium bookmark functionality)

### Data layer + usage tracking integration
[Goal: Connect research feed to DB and enforce Discovery tier limits using existing usage events infrastructure.]

- [ ] Create `apps/web/lib/research.ts`:
  - listResearchArticles (tier-aware, filters, pagination)
  - getResearchArticleById (tier-aware)
  - getArticlesByTag (filtered by tag category and value)
  - getRelatedArticles (by shared tags)
  - getBookmarkedArticles (Premium only)
  - getPinnedArticles
- [ ] Add `apps/web/app/actions/research.ts`:
  - logResearchRead (writes usage event for Discovery-tier limits)
  - getArticleViewCount (for Discovery tier cap enforcement)
  - bookmarkArticle, unbookmarkArticle (Premium)
  - getBookmarkStatus (for UI state)
- [ ] Implement Discovery tier cap (3–5 reads/month):
  - Use existing `usage_events` patterns
  - Show usage counter in research feed UI
  - Display upgrade prompts when limit reached
  - Track which articles Free users read before hitting limit (conversion intelligence)
- [ ] **🎯 PHASE COMPLETE**: Research feed works end-to-end with tier limits, bookmarks, and tag filtering

---

## Phase 7: AI Coach (RAG Retrieval + Personalization + Tier Limits)

**Goal**: Adapt the existing chat feature into the MicrobiomeGardener AI Coach experience, powered by the curated knowledge base.

### Routing + nav alignment
[Goal: Match wireframe naming while reusing the existing chat implementation.]

- [ ] Add route alias: `apps/web/app/(protected)/coach/[[...conversationId]]/page.tsx`:
  - Re-export or wrap existing chat page component so `/coach` and `/coach/[id]` work
  - Maintain all existing chat functionality (streaming, history, etc.)
- [ ] Update sidebar label and icons in `apps/web/components/layout/AppSidebar.tsx`:
  - Change "Chat" → "AI Coach" with appropriate icon
  - Update active state logic for /coach routes

### Retrieval scoping (global knowledge base + personalization)
[Goal: Retrieve from admin-published knowledge rather than only user-private documents.]

- [ ] Update vector search filtering in `apps/web/lib/rag/search-service.ts`:
  - Filter by visibility='published' (global knowledge base)
  - Filter by kind in ['kb_research', 'kb_module'] (admin-curated content only)
  - Apply tier_access filtering (research articles respect tier)
  - Add personalization ranking:
    - Prioritize content matching user's health goals (join with user_health_goals)
    - Prioritize content matching user's climate/hemisphere
    - Boost content appropriate for user's experience level
- [ ] Update chat API/actions:
  - [ ] Extend `apps/web/app/api/chat/route.ts` to pass user context to retrieval
  - [ ] Update `apps/web/app/actions/chat.ts` to include profile context in embeddings/prompts
- [ ] Build prompt engineering system in `apps/web/lib/chat/prompts.ts`:
  - Base assumption: user knows "plants are healthy" but NOT that growing methods affect microbiome
  - **CRITICAL FOUNDATION:** Plants contain microbes inside them (significant portion, varies by plant type)
  - **Growing method revelation:** Chemically grown = pathogenic microbes; Organic = beneficial; Better practices = greatly increased beneficial
  - **Cooking/endotoxin education:** Even cooked plants carry endotoxins and chemical signals from dead microbes - this is why chemically-grown plants harm gut even when cooked
  - **Medical field gap:** Address why "eat more plants" advice fails without considering growing method
  - Progressive disclosure templates (start simple, go deeper as understanding grows)
  - Member messaging track with disclaimers embedded
  - Complete system education flow (seed → soil → plant (microbes IN plant) → food (cooked or raw, endotoxins persist) → gut)
  - Plant family diversity emphasis in every response (minimum 4, more is better)
  - **Zone planting and design systems emphasis** (major knowledge area)
  - Response templates for common question patterns:
    - "What should I plant?" → Emphasize plant family diversity + spacing for root proximity
    - **"Why does HOW I grow matter?"** → Plants contain microbes inside them; chemically grown = pathogenic (endotoxins persist even when cooked); organic = beneficial; better practices = greatly increased beneficial
    - **"Can I just buy organic?"** → Organic is better (beneficial vs pathogenic) but limited microbe range; growing your own with proper practices greatly increases beneficial microbes inside plants
    - **"What about cooking?"** → Cooking kills microbes but endotoxins and chemical signaling from dead pathogenic microbes remain and damage gut - growing method matters regardless of cooking
    - **"Why hasn't my doctor mentioned this?"** → Medical field gap - researchers recommend "eat more plants" without considering growing method; soil microbiologists understand these connections but medical field generally doesn't
    - "How do I design my garden?" → **Ecological zones (perimeter/production/ecosystem), water management, fire protection**
    - "How do I deal with HOA?" → Compliant solutions maintaining effectiveness + local bylaws navigation
    - "How do I deal with water?" → **Swales, rainwater collection, natural ponds, hydrology design**
    - "Fire protection?" → **Fire-resistant perimeter planting, defensible space design**
    - "Flood issues?" → **Flood management, water flow design, elevation strategies**
    - "Should I grow or buy?" → Growing = control beneficial microbes inside plants; buying = risk of pathogenic microbes and endotoxins (even organic has limited range)
    - "How do I store produce?" → Pick-and-eat benefits, storage methods, optional fermentation
    - Questions about animals → Ecosystem integration (dogs, pollinators, chickens)
    - Questions about techniques → Contextual education (autoinducers seed treatment only, Brix as indicator, etc.)
    - Questions about fermentation → Fermentation methods, probiotics/prebiotics content, with quorum sensing and autoinduction as part of explanation why ferments help gut health

### Tier limits for Discovery
[Goal: Cap Discovery tier chat usage and drive upgrades.]

- [ ] Add usage event logging for AI Coach questions in `apps/web/lib/chat/usage.ts`:
  - Log each chat request to usage_events table
  - Enforce Discovery tier limits (3–5 questions max)
  - Display usage counter for Discovery tier users
- [ ] Build upgrade prompt components:
  - [ ] `apps/web/components/chat/UpgradePrompt.tsx` (shown when limit reached)
  - Display contextual messaging based on questions asked
- [ ] Add conversion tracking:
  - Log question content/themes before hitting paywall
  - Track which question types drive upgrades (for analytics)

### Premium image upload capability
[Goal: Enable image upload to support "garden layout" questions for Premium tier.]

- [ ] Gate existing image upload UI in `apps/web/components/chat/ImageUpload.tsx` by Premium tier
- [ ] Add upgrade prompt for non-Premium users when they attempt image upload
- [ ] Implement multimodal retrieval for images (already supported by template's multimodal embeddings)
- [ ] **🎯 PHASE COMPLETE**: AI Coach works on `/coach`, retrieves from curated knowledge, respects tier access and limits, provides personalized education

---

## Phase 8: Planting Guide (Tier-Gated Guidance)

**Goal**: Build a climate/hemisphere-aware planting guide that helps users act "this month" without relying on fixed US-only hardiness zones.

### Database foundation (planting recommendations)
[Goal: Store structured guide content and connect it to plants and user context.]

- [ ] Add schema file: `apps/web/lib/drizzle/schema/planting_recommendations.ts`:
  - id, climate_type, hemisphere, month (1-12)
  - plant_id (FK to plants)
  - planting_window_description (flexible timing, not rigid dates)
  - climate_adaptation_notes (drought, frost, heat strategies)
  - microbe_activation_notes (why plant now for microbiome)
  - tier_access ("basic" | "premium")
  - created_at, updated_at
- [ ] Add indexes: (climate_type, hemisphere, month) composite, plant_id, tier_access
- [ ] Export from `apps/web/lib/drizzle/schema/index.ts`
- [ ] Generate/apply migrations from `apps/web/`:
  - [ ] `npm run db:generate`
  - [ ] **Add RLS policies** (all users can read, admins can write)
  - [ ] Create down migrations
  - [ ] `npm run db:migrate`

### Initial planting recommendations seeding
[Goal: Populate guide data for core plants and climates.]

- [ ] Create seed data: `apps/web/lib/seed-data/planting-recommendations.ts`
- [ ] Add seeding logic for initial recommendations (at least a few climates × months × key plants)
- [ ] Build admin UI for adding/editing recommendations over time (or include in admin plants management)

### Member routes + components
[Goal: Deliver `/planting-guide` and tier-specific content blocks.]

- [ ] Add route: `apps/web/app/(protected)/planting-guide/page.tsx`
- [ ] Build components:
  - [ ] `apps/web/components/planting-guide/MonthlyGuide.tsx`:
    - Display current month prominently
    - Month-by-month navigation (calendar interface)
    - Filter recommendations by user's climate_type and hemisphere
    - Show plant family breakdown for diversity tracking
  - [ ] `apps/web/components/planting-guide/PlantingCard.tsx`:
    - Plant name with link to plant profile
    - Planting window (flexible timing, not rigid dates)
    - Climate adaptation strategies (tier-appropriate)
    - Microbe activation explanation (why plant now)
    - Plant family indicator for diversity
  - [ ] `apps/web/components/planting-guide/WeatherContext.tsx` (Premium):
    - Display upcoming weather conditions for user's location
    - Adjust timing recommendations based on current conditions
    - Requires weather API integration (e.g., OpenWeatherMap)
  - [ ] `apps/web/components/planting-guide/CompleteSystemContext.tsx`:
    - Beneficial animals expected this month
    - Seasonal pest management
    - Fermentation opportunities for harvest
    - Companion animal integration timing
  - [ ] `apps/web/components/planting-guide/ZonePlantingGuidance.tsx` (Premium):
    - **Perimeter planting strategies** (pollution control, fire protection boundaries)
    - **Water management zones** (swales, rainwater collection points, natural ponds)
    - **Flood-prone area guidance** (appropriate species, elevation strategies)
    - **Fire protection perimeter** (fire-resistant species, defensible space)
    - **Production zones** (main growing areas with family diversity)
    - **Ecosystem support zones** (native plants, beneficial animals, pollinators)
    - Plant family spacing recommendations for each zone type
- [ ] Add data layer: `apps/web/lib/planting-guide.ts`:
  - getMonthlyRecommendations (filtered by climate, hemisphere, month, tier)
  - getCurrentMonthRecommendations (auto-detects from user profile)
  - getWeatherContext (if integrating weather API)
- [ ] Add server actions: `apps/web/app/actions/planting-guide.ts`:
  - addPlantToGarden (Premium - creates garden_activity record from planting card)
  - exportMonthlyGuide (Basic tier - PDF/print export)
- [ ] Gate access:
  - Discovery: paywall overlay with teaser
  - Basic: calendar-based guide with integrated climate strategies
  - Premium: advanced infrastructure strategies + weather integration
- [ ] Implement weather API integration (Premium tier):
  - Add weather API key to environment (OpenWeatherMap or similar)
  - Create `apps/web/lib/weather/api.ts` for fetching conditions
  - Display current conditions and 7-day forecast in guide
- [ ] **🎯 PHASE COMPLETE**: Planting Guide delivers tier-appropriate recommendations with climate/hemisphere awareness and optional weather integration

---

## Phase 9: Premium My Garden + Visual Design Tool + Equipment Calculator

**Goal**: Deliver Premium tracking and validation features, visual garden planning tool, and equipment cost calculator for all tiers.

### Database foundation (garden tracking)
[Goal: Store activities and measurements linked to users and plants.]

- [ ] Add schema file `apps/web/lib/drizzle/schema/garden_activities.ts`:
  - id, user_id, activity_type (planting, harvest, autoinducer_application, foliar_feed, composting)
  - activity_date, plant_id (nullable), plant_family_id (nullable)
  - location (text: "Bed 1", "Container 3")
  - technique_used (text)
  - notes (text)
  - photo_url (text - GCS path)
  - created_at, updated_at
- [ ] Add indexes: user_id, activity_date DESC, plant_id, activity_type
- [ ] Add schema file `apps/web/lib/drizzle/schema/brix_measurements.ts`:
  - id, user_id, plant_id
  - brix_value (decimal 0-30+ range)
  - measurement_date, plant_age_days
  - growing_location, notes
  - target_min, target_max (from plant profile)
  - achievement_level (optimal, good, needs_improvement)
  - created_at
- [ ] Add indexes: user_id, plant_id, measurement_date DESC
- [ ] Export from `apps/web/lib/drizzle/schema/index.ts`
- [ ] Generate/apply migrations from `apps/web/`:
  - [ ] `npm run db:generate`
  - [ ] **Add RLS policies** for new tables (garden_activities, brix_measurements: users can only access their own records; admins can access all)
  - [ ] Create down migrations
  - [ ] `npm run db:migrate`

### Member routes + components (Premium gated)
[Goal: Build `/garden` and dashboards aligned with the wireframe.]

- [ ] Add routes:
  - [ ] `apps/web/app/(protected)/garden/page.tsx` (main dashboard - Premium tier gate)
  - [ ] `apps/web/app/(protected)/garden/log-activity/page.tsx` (activity logging form)
  - [ ] `apps/web/app/(protected)/garden/log-brix/page.tsx` (Brix logging form)
  - [ ] `apps/web/app/(protected)/garden/activities/page.tsx` (activity history/timeline)
- [ ] Build components:
  - [ ] `apps/web/components/garden/GardenDashboard.tsx`:
    - Plant family diversity score widget
    - Microbiome score widget
    - Recent activities summary
    - Brix measurement trends chart
    - Quick action buttons (Log Activity, Log Brix, Add Photo)
  - [ ] `apps/web/components/garden/ActivityLogForm.tsx`:
    - Activity type selector dropdown
    - Date picker
    - Plant/family selector (autocomplete from plants DB)
    - Location field
    - Technique notes
    - Photo upload to GCS
  - [ ] `apps/web/components/garden/BrixLogForm.tsx`:
    - Plant selector (from user's activities or plants DB)
    - Brix value input with validation
    - Auto-calculate achievement level based on plant targets
  - [ ] `apps/web/components/garden/PlantDiversityScore.tsx`:
    - Calculate from garden_activities (unique families planted)
    - Visual indicator for 4+ families guideline
    - Recommendations for increasing diversity
  - [ ] `apps/web/components/garden/MicrobiomeScore.tsx`:
    - **Composite score calculation** (NOT lab testing based):
      - Plant family diversity (primary factor - minimum 4, more is better)
      - Technique adoption (autoinducers, foliar feeds, composting methods)
      - Brix readings as validation indicator (NOT the score itself - just confirms practices working)
      - Ecosystem complexity (beneficial animals, companions)
    - Visual score indicator (0-100 scale)
    - Breakdown showing each component's contribution
    - Clear messaging: "This score reflects your implementation of practices, not lab microbiome testing"
    - Improvement suggestions based on score breakdown
  - [ ] `apps/web/components/garden/BrixTrends.tsx`:
    - Chart showing measurements over time
    - Compare to target ranges (from plant profiles)
    - Achievement indicators (optimal/good/needs improvement)
    - **Clear messaging: "Brix is a validation indicator - shows your practices are working, not a microbiome score"**
    - Explanation: Higher Brix confirms better microbial activity and nutrient density
  - [ ] `apps/web/components/garden/ActivityTimeline.tsx`:
    - Chronological log with photos
    - Filter by activity type
    - Export functionality
- [ ] Create data layer: `apps/web/lib/garden.ts`:
  - getGardenActivities (by user, with filters)
  - getBrixMeasurements (by user, with trends)
  - calculateDiversityScore (from activities)
  - calculateMicrobiomeScore (composite calculation: diversity + Brix validation + technique adoption + ecosystem complexity)
  - getActivityTimeline (formatted for display)
  - getBrixTrendsData (chart-ready format)
- [ ] Add server actions: `apps/web/app/actions/garden.ts`:
  - logGardenActivity (create activity with photo upload to GCS)
  - logBrixMeasurement (create measurement with achievement calculation)
  - updateActivity, deleteActivity
  - exportGardenJournal (PDF export)
- [ ] Gate entire feature by Premium tier:
  - Show upgrade UI for non-Premium users
  - Hide nav item for non-Premium users

### Visual Garden Design Tool (Premium)
[Goal: Provide intuitive visual planning for plant family diversity and spacing.]

- [ ] Add route: `apps/web/app/(protected)/garden/design/page.tsx`
- [ ] Build visual design component: `apps/web/components/garden/VisualGardenPlanner.tsx`:
  - Drag-and-drop interface for placing plants
  - Visual representation of plant family diversity (color-coded by family)
  - Spacing guidelines for root proximity (visual indicators when roots are close enough)
  - Ecological zones overlay (perimeter/production/ecosystem zones)
  - Plant family counter (shows progress toward 4+ families guideline)
  - Grid or free-form layout options
  - Save/load garden designs
  - Export garden plan as image or PDF
- [ ] Add server actions: `apps/web/app/actions/garden-design.ts`:
  - saveGardenDesign (store layout JSON)
  - getGardenDesign (retrieve saved design)
  - exportGardenDesign (generate PDF/image)
- [ ] Add optional schema for storing designs: `apps/web/lib/drizzle/schema/garden_designs.ts`:
  - id, user_id, design_name, layout_data (JSON), created_at, updated_at
  - **RLS policy:** Users can only access their own designs; admins can access all
- [ ] **🎯 PHASE COMPLETE**: Premium users can visually plan gardens with plant family diversity and proper spacing

---

### Equipment Cost Calculator (All Tiers)

**Goal**: Help users understand investment and ROI for growing equipment and setup.

### Equipment cost database
[Goal: Store equipment items with costs and categories for calculator.]

- [ ] Add schema file: `apps/web/lib/drizzle/schema/equipment_items.ts`:
  - id, name, category (tools, infrastructure, measurement, soil_building)
  - description, estimated_cost, required (boolean), optional_upgrade (boolean)
  - buy_vs_rent (text - guidance)
  - diy_alternative (text - cost-effective alternatives)
  - created_at, updated_at
- [ ] Export from schema index and generate migrations:
  - [ ] `npm run db:generate`
  - [ ] **Add RLS policies** (all users can read equipment items, admins can write)
  - [ ] Create down migrations
  - [ ] `npm run db:migrate`

### Calculator UI
[Goal: Build interactive cost calculator and ROI comparison tool.]

- [ ] Add route: `apps/web/app/(protected)/equipment/page.tsx`
- [ ] Build calculator component: `apps/web/components/equipment/CostCalculator.tsx`:
  - Equipment checklist (users select what they need)
  - Cost breakdown by category
  - Required vs optional items
  - Buy vs rent recommendations
  - DIY alternatives section
  - Total investment calculation
- [ ] Build ROI tracker: `apps/web/components/equipment/ROITracker.tsx`:
  - Upfront equipment costs (from selections)
  - Long-term savings estimates:
    - Supplements eliminated (average $50-200/month)
    - Medical costs reduced (estimated impact)
    - Food purchases replaced (grocery savings)
  - Payback period calculator
  - 1-year, 3-year, 5-year ROI projections
- [ ] Add data layer: `apps/web/lib/equipment.ts`:
  - getEquipmentByCategory
  - calculateTotalCost
  - calculateROI (based on user's selected tier and goals)
- [ ] **🎯 PHASE COMPLETE**: Premium users can log activities and Brix readings, view validation scores, visually design gardens with plant family diversity; all users can calculate equipment costs and ROI

---

## Phase 10: Admin Analytics (Conversion Intelligence) + Admin Users

**Goal**: Provide admin dashboards for conversion, engagement, content intelligence, and user support.

### Admin Users feature
[Goal: Build comprehensive user management and support tools.]

- [ ] Build user management UI:
  - [ ] `apps/web/app/(protected)/admin/users/page.tsx` (user list with search/filters)
  - [ ] `apps/web/app/(protected)/admin/users/[id]/page.tsx` (detailed user profile view)
- [ ] Build components:
  - [ ] `apps/web/components/admin/users/UserList.tsx`:
    - Search by email, name
    - Filter by tier, status, signup date, location, health goals
    - Sortable columns
  - [ ] `apps/web/components/admin/users/UserDetail.tsx`:
    - Complete profile info (growing profile, assessment responses, discovery path report)
    - Usage stats (AI queries, research reads, logins)
    - Activity logs
    - Subscription management (manual adjustments, comps, refunds)
    - Support notes field
  - [ ] `apps/web/components/admin/users/ImpersonateButton.tsx` (see app from user's perspective)
- [ ] Create queries: `apps/web/lib/admin/users.ts`:
  - getUsersWithFilters (tier, status, goals, location)
  - getUserDetailById (with profile, assessment, usage stats)
  - getActivityLogsForUser
  - getAssessmentResponsesForUser
- [ ] Add server actions: `apps/web/app/actions/admin/users.ts`:
  - updateUserTier (manual subscription adjustments)
  - addSupportNote
  - impersonateUser (create impersonation session)

### Analytics data model
[Goal: Aggregate metrics without adding heavy infrastructure.]

- [ ] Add `apps/web/lib/admin/analytics.ts` query helpers:
  - **Subscription & Revenue Metrics:**
    - getFreeToBasicConversionRate
    - getBasicToPremiumConversionRate
    - getChurnRateByTier
    - getMRR (Monthly Recurring Revenue)
    - getARPU (Average Revenue Per User)
    - getLTVByCohort
  - **User Engagement Metrics:**
    - getDAUMAU (Daily/Monthly Active Users)
    - getSessionDurationByTier
    - getFeatureAdoptionRates (which features drive upgrades)
    - getAICoachUsagePatterns (popular questions, knowledge gaps)
    - getPlantingGuideEngagement
    - getResearchFeedEngagement
  - **Free Tier Conversion Intelligence:**
    - getHealthGoalConversionCorrelation (which goals drive upgrades)
    - getQuestionThemesBeforeUpgrade (what Free users ask)
    - getResearchTopicsDrivers (which topics drive Free → Basic)
    - getTimeToUpgradeBySegment
  - **Content Intelligence:**
    - getMostReadArticles (by tier)
    - getTopQuestionCategories
    - getContentGaps (unanswered questions, feature requests)
  - **Geographic & Demographic:**
    - getClimateZoneDistribution
    - getConstraintPatterns (HOA, rental, space)
    - getHealthGoalDistributions

### Admin analytics UI
[Goal: Build `/admin/analytics` with comprehensive KPI tiles and drilldowns.]

- [ ] Implement `apps/web/app/(protected)/admin/analytics/page.tsx`:
  - Date range selector (last 7/30/90 days)
  - Export functionality
  - Real-time dashboard updates
- [ ] Build components under `apps/web/components/admin/analytics/`:
  - [ ] `KPITiles.tsx` (MRR, conversion rates, churn, DAU/MAU)
  - [ ] `SubscriptionMetrics.tsx` (funnel visualization, LTV, ARPU)
  - [ ] `EngagementMetrics.tsx` (feature adoption, session duration, usage patterns)
  - [ ] `ConversionIntelligence.tsx`:
    - Health goal correlation table
    - Question themes before upgrade
    - Research topics driving conversions
    - A/B test results (if implemented)
  - [ ] `ContentGaps.tsx` (unanswered questions, feature requests, user feedback themes)
  - [ ] `GeographicBreakdown.tsx` (climate zones, constraints, demographics)

### AI Agents Integration (Flexible Business Operations Communication)
[Goal: Create flexible system for analytics to communicate with various AI agents monitoring different business aspects.]

- [ ] Design flexible agent communication interface:
  - [ ] Define extensible data structures for agent communication in `apps/web/lib/agents/types.ts`:
    - Agent registration system (new agents can be added without code changes)
    - Message format for sending metrics/data to agents
    - Response format for receiving insights from agents
    - Agent capabilities metadata (what each agent monitors)
  - [ ] Create agent API endpoints or message queue for asynchronous communication:
    - POST `/api/agents/send-metrics` (push data to any registered agent)
    - GET `/api/agents/insights` (retrieve insights from agents)
    - POST `/api/agents/trigger-analysis` (request specific analysis from agent)
- [ ] Implement initial agent examples (extensible list):
  - [ ] Research monitoring (curation quality, coverage gaps)
  - [ ] Marketing monitoring (conversion funnels, messaging effectiveness)
  - [ ] Sales monitoring (subscription metrics, churn patterns, upgrade triggers)
  - [ ] Operations monitoring (system health, processing times, error rates)
  - [ ] Customer support monitoring (common issues, FAQ gaps)
  - [ ] Content quality monitoring (AI response accuracy, knowledge gaps)
  - [ ] **Future agents can be added** to this registry without roadmap/code changes
- [ ] Build agent communication actions: `apps/web/app/actions/agents.ts`:
  - registerAgent (add new agent to system with capabilities metadata)
  - sendMetricsToAgent (push analytics data to specific agent or all agents)
  - getAgentInsights (retrieve recommendations from specific agent or all agents)
  - triggerAgentAnalysis (request specific business function analysis from agent)
  - listRegisteredAgents (show all available agents and their capabilities)
- [ ] Add agent insights display to analytics dashboard:
  - [ ] `apps/web/components/admin/analytics/AgentInsights.tsx`:
    - Show agent-generated recommendations grouped by agent type
    - Display automated alerts from agents (e.g., churn risk, content gaps, conversion issues)
    - Agent communication status (last sync, health check)
    - Manual trigger buttons for requesting specific agent analysis
  - [ ] `apps/web/components/admin/analytics/AgentRegistry.tsx`:
    - List all registered agents
    - Show agent capabilities and monitoring areas
    - Add/configure new agents through UI
    - Agent health monitoring
- [ ] Add webhook support for agents to push insights asynchronously:
  - [ ] Create `/api/webhooks/agents` endpoint for agent callbacks
  - [ ] Store agent insights in database for historical tracking
  - [ ] Display real-time agent notifications in admin dashboard
- [ ] **🎯 PHASE COMPLETE**: Admin can view comprehensive metrics and communicate with AI agents monitoring all business aspects

---

## Phase 11: Background Services + Ongoing Communications

**Goal**: Implement automated background jobs for ongoing engagement, notifications, and research curation (NOT including onboarding emails which are in Phase 2).

### Background jobs setup
[Goal: Implement automated tasks for ongoing engagement and content curation.]

- [ ] Set up background job infrastructure (cron jobs or similar):
  - Use pg_cron for database-triggered jobs, or
  - Use external service (Vercel Cron, GitHub Actions, etc.)
- [ ] Implement ongoing email campaigns:
  - [ ] Educational tips emails (weekly for engaged users)
  - [ ] Inactive user re-engagement (7+ days inactive with seasonal opportunities)
- [ ] Build email templates in `apps/web/lib/email/templates/`:
  - [ ] `educational-tips.tsx` (growing tips, seasonal reminders)
  - [ ] `inactive-reengagement.tsx` (seasonal opportunities based on location)
  - [ ] `research-digest.tsx` (Premium: weekly summaries)
  - [ ] `upgrade-prompts.tsx` (contextual upgrade messaging)
- [ ] Implement seasonal notification system (Premium MVP feature):
  - [ ] Create `apps/web/lib/notifications/seasonal.ts`
  - [ ] Build job that checks user's climate zone and sends planting window notifications
  - [ ] Implement push notification infrastructure or email-based notifications
  - [ ] Add user preferences for notification frequency
- [ ] Implement research digest job (Premium):
  - [ ] Weekly summary of new research articles
  - [ ] Personalized based on user's health goals
  - [ ] Filter by tags matching user interests
  - [ ] Send via email to Premium users
- [ ] Add email server actions: `apps/web/app/actions/email.ts`:
  - sendEducationalEmail
  - sendReengagementEmail
  - sendResearchDigest (Premium)
  - sendSeasonalNotification (Premium)
- [ ] **🎯 PHASE COMPLETE**: Background services support ongoing engagement, notifications, and automated communications

---

## Phase 12: Final Implementation Sweep (Polish + Completeness)

**Goal**: Implement remaining UI/UX and operational polish needed for production.

### UX foundations
[Goal: Improve perceived quality across all core pages.]

- [ ] Add shared empty states for all major pages:
  - [ ] Plants database (no plants match filters)
  - [ ] Research feed (no articles)
  - [ ] Planting guide (no recommendations for climate/month)
  - [ ] My Garden (no activities logged)
  - [ ] Chat history (no conversations)
- [ ] Add loading skeletons for async content:
  - [ ] Plant cards skeleton
  - [ ] Research article cards skeleton
  - [ ] Dashboard metrics skeleton
  - [ ] Chat messages skeleton
- [ ] Add error boundary components:
  - [ ] `apps/web/components/error/FeatureErrorBoundary.tsx` (graceful feature failures)
  - [ ] Apply to major feature pages
- [ ] Add standardized toast messaging:
  - Success toasts for create/update/delete actions
  - Error toasts with actionable messages
  - Loading toasts for long-running operations
- [ ] Build reusable tier-gated paywall components:
  - [ ] `apps/web/components/billing/PaywallOverlay.tsx` (Discovery → Basic upgrade)
  - [ ] `apps/web/components/billing/PremiumGate.tsx` (Basic → Premium upgrade)
  - [ ] Apply consistently across gated features

### Navigation & routing polish
[Goal: Ensure smooth navigation experience.]

- [ ] Add breadcrumbs component for nested pages (admin sections, plant details, etc.)
- [ ] Implement proper loading states for route transitions
- [ ] Add "back" navigation where appropriate
- [ ] Ensure mobile navigation works smoothly (collapsible sidebar, bottom nav if needed)

### Performance & maintainability
[Goal: Keep the app fast and easy to extend.]

- [ ] Add database indexes based on observed query patterns:
  - [ ] Plants: composite indexes for common filter combinations
  - [ ] Research: tag filtering indexes
  - [ ] User-goal joins: optimize junction table queries
  - [ ] Activities: date range queries
- [ ] Add pagination support:
  - [ ] Plants database (cursor-based or offset)
  - [ ] Research feed (cursor-based or offset)
  - [ ] Activity timeline (cursor-based)
  - [ ] Admin user list (offset pagination)
- [ ] Implement lightweight caching:
  - [ ] Admin analytics aggregations (cache for 5-15 minutes)
  - [ ] Featured plants queries
  - [ ] Pinned research articles
- [ ] Optimize image loading:
  - Add lazy loading for plant images and photos
  - Implement image compression/optimization
  - Use appropriate image sizes (thumbnails vs full)

### Knowledge base completeness
[Goal: Ensure knowledge base covers all specified topics from prep docs.]

- [ ] Create admin checklist for knowledge coverage:
  - **Microbes IN Plants (CRITICAL FOUNDATION - HIGHEST PRIORITY):**
    - Graz study and similar research (plants contain significant portion of microbes internally)
    - Growing method determines beneficial vs pathogenic microbes inside plants
    - Endotoxins and chemical signaling persist after cooking
    - Medical field gap (eat more plants without considering growing method)
    - Soil microbiologist vs medical researcher knowledge divide
  - Core principles (4+ families, quorum sensing, Brix as indicator tool, endophytes, autoinduction)
  - Seed quality and sourcing
  - Advanced techniques (autoinducers seed treatment, foliar feeds)
  - Animal integration (beneficial animals, pests, pets, ecosystem)
  - Growing methods (composting, vermicompost, seed raising, soil building, no-till)
  - **Zone Planting & Design Systems (MAJOR AREA - HIGH PRIORITY):**
    - Ecological zone design (perimeter/production/ecosystem zones)
    - Perimeter protective planting (pollution control, external boundaries)
    - Fire protection perimeter (fire-resistant species, defensible space design)
    - Flood management strategies (flood-prone species, elevation, water flow)
    - Hydrology and water flow design (swales, water harvesting, drainage)
    - Swales design and construction guidance
    - Rainwater collection systems and infrastructure
    - Natural ponds design and ecosystem benefits
    - Plant family spacing for root proximity and microbe exchange
    - Multi-zone integration strategies
  - Local bylaws navigation (front yard gardens, fences, water usage, fire codes, HOA restrictions)
  - Climate strategies (adaptive timing, structures, resilience)
  - Space solutions (containers, small yards, balconies)
  - Constraint solutions (HOA compliance, rental, urban, aesthetic requirements)
  - **Produce handling and storage:**
    - Pick and eat benefits (immediate consumption)
    - Root cellaring methods
    - Cold storage techniques
    - Drying and preservation
    - Freezing methods
    - Fermentation (optional - fermentation methods, probiotics and prebiotics they contain, with quorum sensing and autoinduction as part of the explanation why ferments help gut health)
  - "Grow vs Buy" decision guidance
  - Native plants and landscaping design (aesthetic appeal, bylaw compliance)
  - Equipment and sourcing information (including Brix refractometer)
- [ ] Add admin UI indicator showing coverage completeness per module
- [ ] Build admin tool for identifying knowledge gaps from AI Coach questions

### Missing features from prep docs
[Goal: Implement any remaining features specified in prep documents.]

- [ ] **✅ RESOLVED: Educational Resource Hub**
  - From `master_idea.md`: "Access educational website/resource hub with guides, tutorials"
  - **Resolution:** Knowledge accessed through AI Coach (personalized, interactive) + Research Feed (scientific articles)
  - **Rationale:** Aligns with core value proposition (personalized coaching vs static docs), drives engagement, simpler MVP
  - **Future consideration:** Can add browsable `/resources` page post-launch if user research shows demand

- [ ] **✅ RESOLVED: "Grow vs Buy" Decision Engine**
  - From `master_idea.md`: "Access 'Grow vs Buy' prioritization engine"
  - **Resolution:** Integrated into AI Coach responses (Phase 7) - AI provides personalized prioritization based on user's space, goals, and context
  - **Implementation:** Included in AI Coach prompt templates as response pattern
  - **No separate UI needed:** Works better as conversational guidance than standalone calculator
- [ ] Add native plants recommendations integration:
  - [ ] Add native_species boolean flag to plants table
  - [ ] Filter for native plants by user's location
  - [ ] Include in planting guide where relevant
- [ ] Add landscaping design guidance:
  - [ ] Include in AI Coach knowledge base
  - [ ] Add aesthetic design examples to plant profiles
  - [ ] Include HOA-compliant design patterns

### Production readiness
[Goal: Prepare app for production deployment.]

- [ ] Add monitoring and logging:
  - [ ] Error tracking (Sentry or similar)
  - [ ] Performance monitoring
  - [ ] Usage analytics tracking
- [ ] Add rate limiting for API routes
- [ ] Implement proper error handling throughout
- [ ] Add security headers and CSP policies
- [ ] Optimize bundle size (code splitting, tree shaking)
- [ ] Add sitemap generation for SEO
- [ ] Configure robots.txt
- [ ] Set up production environment variables
- [ ] Create deployment documentation

### Success criteria (implementation-focused)
[Goal: Define "done" as user-visible completed capabilities.]

- [ ] Discovery users can complete assessment and receive the Discovery Path report
- [ ] Admin can ingest knowledge (research/modules) and see processing status
- [ ] Members can browse plants and research with tier gating
- [ ] AI Coach retrieves from curated knowledge with personalization and progressive education
- [ ] Planting Guide provides tier-gated, climate-adaptive recommendations
- [ ] Premium users can track garden activities and Brix measurements
- [ ] All tier access gates work correctly across features
- [ ] Billing flows work (upgrades, downgrades, cancellations)
- [ ] Background jobs run reliably (emails, notifications)
- [ ] Admin has full visibility into metrics and user management

**🎯 PHASE COMPLETE**: MicrobiomeGardener.ai is feature-complete, polished, and production-ready

---

## 🎯 Development Success Criteria

**MicrobiomeGardener.ai is complete when:**

✅ Users can complete Growing Knowledge Path Assessment during signup  
✅ Discovery Path report delivers member-track education with disclaimers including critical microbes-in-plants science  
✅ Discovery Path explains endotoxins persist after cooking (why chemically-grown plants harm gut even when cooked)  
✅ Onboarding email sequence works (welcome emails sent immediately)  
✅ Users can manage full growing profile and health goals  
✅ AI Coach provides personalized microbiome gardening guidance with RAG context  
✅ AI Coach educates on microbes IN plants (growing method determines beneficial vs pathogenic, endotoxins persist after cooking)  
✅ AI Coach uses progressive education system (seed → soil → plant (microbes IN plant) → food (cooked/raw) → gut)  
✅ AI Coach addresses medical field gap (why "eat more plants" advice fails without considering growing method)  
✅ Users can browse comprehensive plant database with beneficial microbe potential info (general patterns, not fixed profiles) and plant images  
✅ Users can access curated research articles with tier-appropriate limits  
✅ Research bookmarks work for Premium users  
✅ Planting Guide provides climate-adaptive monthly recommendations  
✅ Weather integration works for Premium planting guide users  
✅ Premium users can track garden activities and Brix measurements (Brix as indicator tool)  
✅ Premium users can visually design gardens with plant family diversity and spacing guidelines  
✅ All users can calculate equipment costs and ROI for growing setup  
✅ Microbiome score calculation works (diversity + techniques + Brix validation + ecosystem, NOT lab testing)  
✅ Three-tier subscription system works (Discovery/Implementation/Mastery)  
✅ Tier access gates enforce limits correctly (AI Coach, Research Feed)  
✅ Admins can upload research articles and plants with images that flow through RAG processing  
✅ RAG processing status is visible and works reliably  
✅ Admin can manage users with support tools  
✅ Admin has quality control tools (AI response testing, content corrections, version control)  
✅ Admin analytics show conversion and engagement metrics  
✅ Admin analytics communicate with AI agents monitoring all business operations (flexible agent registration system allows adding new agents without code changes)  
✅ All features respect tier-based access control  
✅ Member messaging with disclaimers displays appropriately  
✅ Background jobs send ongoing emails and notifications  
✅ **Knowledge base covers CRITICAL FOUNDATION: Microbes IN Plants**
  - Graz study on microbes inside plants (uploaded to research feed)
  - Growing method determines beneficial vs pathogenic microbes inside plants
  - Endotoxins and chemical signaling persist after cooking
  - Medical field gap and soil microbiologist knowledge
✅ **Knowledge base covers zone planting and water management extensively (MAJOR FOCUS):**
  - Perimeter planting (fire, flood, pollution protection)
  - Water harvesting (swales, rainwater collection, natural ponds)
  - Hydrology and water flow management
  - Local bylaws compliance (water, fire, front yards, structures)
  - Ecological zone layouts with proper spacing for root proximity
  - Zone templates available in admin for reuse and customization
✅ Knowledge base covers produce handling and storage (pick-and-eat benefits, various storage methods, with fermentation as optional method including probiotics/prebiotics content and quorum sensing/autoinduction as part of explanation)
✅ Knowledge base covers all other specified topics (composting, animal integration, soil building, native plants, equipment and sourcing)  

**Next Action:** Begin with Phase 0 - Run SETUP.md with gemini-2.5-pro on max mode to understand template infrastructure and prepare development environment.
