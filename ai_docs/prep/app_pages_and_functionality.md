# App Pages & Functionality Blueprint

## App Summary

**End Goal:** Help people who've lost microbiome diversity (parents, biohackers, health-conscious individuals, longevity seekers, athletes) restore and rebuild their gut microbiome through personalized soil-based growing protocols using RAG-powered AI coaching.

**Core Value Proposition:** Provide the ONLY access point to truly replace missing beneficial microbes through specific growing methods - you can't replace what you don't have access to.

**Core Foundational Truth:**
- Most people have lost significant microbiome diversity
- Probiotics/supplements can't restore missing microbes (they only contain microbes you likely already have)
- Conventional/chemical growing is actively harmful (carries pathogenic microbes, introduces endotoxins that NEGATE beneficial effects of plant foods)
- Organic is better but limited (stops harm, but monoculture limits beneficial microbe range)
- **This growing method may be the ONLY way to access missing beneficial microbes** (seeds contain microbiomes via endophytes, specific practices unlock transfer)

**Target Users:** Parents (children's health), biohackers (performance optimization), health-conscious individuals (IBS, anxiety, immunity), longevity seekers, athletes (endurance, recovery)

**Template Type:** rag-saas (RAG-powered SaaS with subscription billing)

**Key Differentiators:**
- Core principle: Plant family diversity (minimum 4, more is better) for root-to-root microbe exchange via soil fungal networks
- Complete system education: Quorum sensing in soil → plants → ferments → gut
- Seed quality and endophyte transfer as foundation
- Climate-adaptive growing strategies (not fixed calendars)
- Scientific credibility through automated research curation
- Progressive mastery: Discovery → Implementation → Advanced Design Mastery

---

## 🎯 Two-Track Messaging System

### Track 1: Public-Facing (Ad-Compliant)

**Used On:** Landing page, ads, public marketing materials

**Messaging Level - Option B (Medium Edge):**
- "The missing link between growing methods and microbiome restoration"
- "Why store-bought (even organic) may not restore beneficial microbes"
- "Access beneficial microbes through personalized growing protocols"
- "Research shows different growing practices transfer different beneficial microbes"
- "Learn science-backed growing for gut health optimization"

**Compliance Requirements:**
- Educational positioning
- Research-based framing
- No disease treatment claims
- No FDA-unapproved health claims

### Track 2: Member-Facing (Post-Opt-In)

**Used On:** Inside app after signup, member content, Growing Knowledge Path Report

**Stronger Truth Education (With Disclaimers):**
- "Chemically grown food carries pathogenic microbes" (cite grapes/apple study)
- "Plant-based endotoxins are as harmful as animal-based and negate benefits of eating plants"
- "Organic stops harm but has limited beneficial microbe range"
- "This method may be the ONLY way to restore access to missing beneficial microbes"
- "You can't replace what you don't have access to"

**Required Disclaimers:**
- "This is educational information, not medical advice"
- "Consult your healthcare provider for medical decisions"
- "These statements have not been evaluated by the FDA"
- "Not intended to diagnose, treat, cure, or prevent any disease"

**Transition Point:** Gradual
- Assessment uses public-compliant messaging
- "Your Growing Discovery Path" Report (delivered inside app after signup) uses member messaging with disclaimers
- All in-app content uses member messaging with disclaimers

---

## 🌐 Universal SaaS Foundation

### Public Marketing Pages

**Landing Page** — `/`

**Public Messaging Track (Ad-Compliant):**
- Hero: "The Missing Link Between Growing Methods and Microbiome Restoration"
- Problem Hook: "Why store-bought (even organic) may not restore beneficial microbes"
- Access Positioning: "Access beneficial microbes through personalized growing protocols"
- Research Credibility: Studies showing different growing practices transfer different microbes
- Indoor Air Quality Hook: Plants filter ALL pollutants (PFAS, chemicals, dust, pesticides) - indoor and outdoor protection (no specific plant names in public messaging)
- Complete System Teaser: Visual of soil → plant → food → gut connection (conceptual only)
- Subscription Tiers: Discovery (Free) → Implementation (Basic $27-47) → Mastery (Premium $67-97)
- CTA: "Discover Your Growing Knowledge Path" (assessment-focused)

**Legal Pages** — `/privacy`, `/terms`, `/cookies`
- Privacy Policy (GDPR compliance, health data handling)
- Terms of Service (health coaching disclaimers, not medical advice, FDA disclaimers)
- Cookie Policy (tracking compliance)
- Educational disclaimers throughout

### Authentication Flow

**Sign Up** — `/auth/sign-up`
- Account creation with email verification
- **Growing Knowledge Path Assessment** integrated (public-compliant messaging during assessment)

**Login** — `/auth/login`
- Email/password authentication with Supabase

**Password Flows** — `/auth/forgot-password`, `/auth/update-password`
- Standard password reset and update flows

**Confirmation Pages** — `/auth/sign-up-success`, `/auth/confirm`, `/auth/error`
- Email verification handling and error states

---

## ⚡ Core Application Pages

### Growing Knowledge Path Assessment
**Embedded in** `/auth/sign-up` flow

**Purpose:** Understand user knowledge baseline, capture conversion drivers, establish personalization context

**Assessment Questions (Public-Compliant Messaging):**
1. Current situation: Do you grow any food now? (Yes/No/Used to)
2. Health frustrations: What brings you here? (Anxiety, IBS, immunity, performance, digestion, longevity, children's health)
3. What you've tried: Have you tried probiotics, supplements, diet changes? Results?
4. Knowledge baseline: "Have you heard that HOW food is grown affects gut microbiome benefits?" (Most will say No)
5. Fermentation use: Do you use fermented foods or probiotics currently?
6. Urgency assessment: What outcome would matter most to you?
7. Space assessment: What growing space do you have? (None, balcony, small yard, large yard)
8. Constraints: HOA restrictions? Rental limitations? Pets in garden?
9. Climate: Location for climate-specific guidance
10. Learning preference: Visual learner? Step-by-step? Science-deep?

**Data Captured (Backend Analytics):**
- Specific health goals and frustrations
- What solutions have already failed
- Urgency level (desperate vs curious)
- Implementation barriers (space, constraints)
- Learning stage and preferences
- Conversion driver identification

**"Your Growing Discovery Path" Report (Member Messaging Track):**

**Delivered:** Inside app after signup with educational disclaimers

**Content (Stronger Member Messaging):**
- Welcome: "Here's what you're about to discover that changes everything"
- **Three-Level Problem Education:**
  1. Conventional growing is actively harmful (pathogenic microbes, endotoxins negate plant benefits)
  2. Organic stops harm but is limited (monoculture restricts beneficial microbe range)
  3. This method provides access (may be the ONLY way to restore missing microbes)
- **Core Truth:** "You can't replace what you don't have access to - probiotics/supplements lack the missing microbes because they don't have access to them either"
- **Indoor Air Quality Revelation:** Plants filter ALL pollutants (PFAS, chemicals, dust, pesticides) - indoor and outdoor protection, affects microbiome
- **Complete System Overview:** Seed endophytes → soil quorum sensing → plant microbiome → food → ferment quorum sensing → gut quorum sensing
- **Personalized First Step:** Based on their space/constraints (indoor plants, container garden, small plot)
- Educational disclaimers present

---

### AI Coach Chat — `/coach` or `/coach/[conversationId]`

**Core Purpose:** RAG-powered growing guidance with progressive knowledge education adapted to user's learning stage

**Key Functionality:**

**Tier Access:**
- **Free:** Limited preview (3-5 questions max) with conversion prompts
- **Basic:** Unlimited AI coaching
- **Premium:** Unlimited with advanced context

**Knowledge-Level Adaptation:**
- Assume baseline: User knows "plants are healthy" but NOT that growing methods affect microbiome
- Progressive disclosure: Start simple, go deeper as understanding grows
- Track learning progression for adaptive responses (Backend)
- Member messaging track with disclaimers throughout (Backend)

**Complete System Education (Integrated into Responses):**
- Seed quality and endophytes (microbiomes living in seeds that transfer when eaten) (Backend)
- Quorum sensing in soil (minimum 4 plant families, more is better - root communication) (Backend)
- Autoinducers (seed treatment only - one-time use to kickstart seed-soil microbiome connection, not ongoing application) (Backend)
- Foliar feeds (maintain production while system microbiome improves) (Backend)
- Fermentation quorum sensing (beneficial microbe dominance in ferments) (Backend)
- Gut quorum sensing (how beneficial microbes establish dominance) (Backend)
- Three-level problem (conventional harmful, organic limited, this = only access) (Backend)

**Animal & Ecosystem Guidance:**
- Beneficial animals (pollinators, predatory insects, soil organisms) (Backend)
- Dogs as microbe transfer helpers (not just pet safety) (Backend)
- Organic pest management preserving beneficial microbes (Backend)
- Composting animals (worms, chickens, black soldier flies) (Backend)
- Wildlife ecosystem support (Backend)

**Core Features:**
- Real-time chat with Google Gemini using RAG context (Frontend + Backend)
- Climate-specific advice based on user location/zone (Backend)
- Research citations ("Recent 2026 study shows...") (Backend Process)
- Plant family diversity recommendations in every answer (Backend)
- HOA/bylaw-compliant solutions (Backend)
- "Grow vs Buy" guidance within conversation (Backend)
- Conversation auto-save and history (Backend)
- Usage tracking by tier (Backend)
- Streaming responses with thinking indicators (Frontend)
- Image upload for garden layout feedback (Premium) (Frontend + Backend)
- Multi-turn context for complex questions (Backend Process)

**Flexible Content Integration:**
- RAG database pulls from modular knowledge base (Backend Process)
- New content areas automatically available without code changes (Backend Process)
- Admin can add topics/modules via /admin/content (Backend Process)

**Conversion Intelligence (Free Tier):**
- Track what questions users ask before hitting paywall (Backend)
- Identify conversion patterns by question type (Backend Analytics)
- Optimize upgrade prompts based on question intent (Backend)

---

### Planting Guide — `/planting-guide`

**Core Purpose:** Climate-adaptive "what to plant in YOUR location" with progressive sophistication by tier

**Note:** NOT a fixed monthly calendar - climate-responsive guidance

**Tier Progression:**

**Free Tier:** No Access
- Paywall with teaser: "Want to know what to plant this month? Upgrade to Basic"

**Basic Tier:** Calendar-Based with Integrated Climate Strategies
- Current month optimal plantings for user's climate zone (Frontend)
- Month-by-month view showing seasonal windows (Frontend)
- Plant family breakdown maintaining diversity (minimum 4, more is better) (Frontend)
- WHY plant now: Climate timing, microbe activation, endophyte colonization (Frontend)
- **Built-in climate adaptation:**
  - "This month plant X, but if experiencing drought, here's how to adapt" (Frontend)
  - "If late frost risk, use row covers" (Frontend)
  - "If unseasonably warm, watch for early pest emergence" (Frontend)
- Plant family selections that handle variability better (Frontend)
- Simple protective measures (row covers, basic season extension) (Frontend)
- Flexible planting windows: "Ideal window is 2-4 weeks depending on soil temp" (Frontend)
- Real-time weather context for user's area (Backend Process)

**Premium Tier:** Advanced Climate Mastery
- All Basic features PLUS:
- **Comprehensive infrastructure strategies:**
  - Tunnel houses, hoop houses for weather buffering (Frontend)
  - Season extension techniques (Frontend)
  - Protective structure recommendations based on climate challenges (Frontend)
- **Advanced climate resilience:**
  - Sophisticated wet/dry adaptation protocols (Frontend)
  - Real-time adaptive timing: "Soil temp monitoring suggests plant in 10 days" (Frontend)
  - Multi-season planning with variability built in (Frontend)
- **Perennial systems for climate resilience** (Frontend)
- **Advanced protective plantings for extreme weather** (Frontend)

**Complete System Context (All Tiers with Access):**
- Which beneficial animals to expect this month (pollinators, insects) (Frontend)
- Seasonal pest management appropriate for this month (Frontend)
- Fermentation opportunities: Which plants to ferment as you harvest (Frontend)
- Companion animal integration timing (chickens, worms) (Frontend)

**Contextual Advanced Guidance (Premium):**
- "These families planted together - here's how autoinducers as seed treatment kickstart seed-soil microbiome connection" (Frontend)
- Quorum sensing timing: When microbe sharing peaks (Frontend)
- Heritage/landrace variety recommendations for season (Frontend)

**Action Features:**
- Direct links to plant profiles (Frontend)
- "Add to My Garden" for Premium tracking (Frontend + Backend)
- Weather integration for upcoming conditions (Backend Process)
- Push notifications for optimal windows (Premium) (Background Job)
- Export/print monthly guide (Basic tier) (Frontend)

**Flexible Structure:**
- Modular content blocks for easy additions (Backend)
- New seasonal considerations added without restructuring (Backend)

---

### Plant Database — `/plants`

**Core Purpose:** Complete plant profiles with microbiome benefits, ecosystem context, and practical implementation

**Tier Access:**
- **Free:** No access (paywall)
- **Basic:** Full access
- **Premium:** Full access + advanced features

**Core Plant Information:**
- Organized by plant family (Brassicaceae, Solanaceae, Fabaceae, etc.) (Frontend)
- Plant-microbiome profiles: Which beneficial microbes this plant hosts via endophytes (Frontend)
- Optimal companions from other families for diversity (minimum 4, more is better) (Frontend)
- Growing difficulty (beginner, intermediate, advanced) (Frontend)
- Climate compatibility zones (Frontend)

**Complete System Integration:**
- **Seed quality importance:** Why heritage/landrace seeds matter for endophyte richness (Frontend)
- **Quorum sensing role:** How this plant contributes to soil microbe communication (Frontend)
- **Endophyte transfer:** How microbes in seeds transfer to soil and to you when eaten (Frontend)
- **Fermentation potential:** How to ferment this plant, which microbes it supports in ferments (Frontend)

**Animal & Ecosystem Context:**
- Beneficial animals attracted (specific pollinators, predatory insects) (Frontend)
- Common pests and organic management strategies (Frontend)
- Pet context: Safe for dogs/cats? Dogs help transfer microbes from this plant? Chicken-compatible? (Frontend)
- Wildlife benefits (birds, beneficial insects, soil organism support) (Frontend)
- Companion animals: Works with chickens? Worm composting? (Frontend)

**Filtering & Discovery:**
- Filter by plant family (Frontend)
- Filter by health goals (anxiety, immunity, performance, longevity) (Frontend)
- Filter by climate compatibility (Frontend)
- Filter by space (container-friendly, small space, large garden) (Frontend)
- Filter by beneficial animals (attracts pollinators, pest predators) (Frontend)
- Filter by pet context (dog-safe, cat-safe, chicken-compatible) (Frontend)
- **Featured Category:** "Indoor Air Quality Plants" - Start here for beginners (Frontend)

**Premium Features:**
- Brix target ranges for validation (Frontend)
- Heritage/landrace variety recommendations with specific sourcing (Frontend)
- Quality sourcing: Where to buy, what quality markers matter for endophyte richness (Frontend)
- Advanced technique integration: Autoinducer seed treatment to kickstart this plant's seed-soil connection (Frontend)
- Foliar feed protocols for this plant during system transition (Frontend)

**Quick Actions:**
- "Ask AI Coach about this plant" (Frontend + Backend)
- "Add to My Garden plan" (Premium) (Frontend + Backend)

**Flexible Database Structure:**
- Modular plant data allows easy addition of new attributes (Backend)
- New filter categories added as knowledge expands (Backend)
- Plant profiles enhanced with new research findings (Backend)

---

### Research Feed — `/research`

**Core Purpose:** Scientific credibility through curated research discoveries validating methodology

**Tier Access:**
- **Free:** 3-5 articles/month with engagement tracking
- **Basic:** Unlimited access with basic filtering
- **Premium:** Advanced filtering, bookmarks, notifications

**Research Display:**
- Curated articles from automated scraping (PubMed, gut health journals, soil science, regenerative agriculture) (Frontend)
- Article summaries with key findings (Frontend)
- "Why this matters for your garden" translation of complex science (Frontend)
- Source journal and publication date (Frontend)

**Filtering Categories (Expandable):**

**Current Categories:**
- Gut health and microbiome research
- Soil microbiome and fungal networks
- Regenerative agriculture
- Plant-microbe interactions (endophytes)
- Quorum sensing research
- Fermentation and probiotics
- Beneficial animals and pollinators
- Organic pest management
- Climate adaptation
- Seed quality and heritage varieties

**Future Categories (Easy to Add via Admin Content):**
- Specific health conditions (IBS, anxiety, immunity)
- Performance optimization
- Longevity research
- Specific plant families
- Specific microbe species
- Urban growing
- Container systems
- (Any new category as knowledge evolves)

**Premium Features:**
- Filter by specific microbes or plant families (Frontend)
- Filter by health conditions (Frontend)
- Bookmark articles for personal library (Frontend + Backend)
- Research digest email summaries (Weekly) (Background Job)
- Push notifications for breakthrough research relevant to user goals (Background Job)

**Engagement Tracking:**
- Track which articles users read most (Backend)
- Track which topics drive Free → Basic upgrades (Backend Analytics)
- Inform AI coach context with popular research (Backend Process)

**Conversion Intelligence (Free Tier):**
- Track which research topics Free users engage with (Backend Analytics)
- Identify content that drives conversions (Backend Analytics)
- Optimize research curation for conversion (Backend)

**Flexible Structure:**
- Unlimited tagging system for new categories (Backend)
- New research areas added without code changes (Backend)
- Admin creates new filters via /admin/research (Backend)

---

### My Garden — `/garden` (Premium Only)

**Core Purpose:** Track advanced implementation, validate mastery, gamify progress

**Tier Access:**
- **Free:** No access
- **Basic:** No access (upgrade prompt)
- **Premium:** Full access

**Implementation Tracking:**
- Growing activity log: What planted, when, where, which plant families (Frontend + Backend)
- Plant family diversity score: Validate family implementation (minimum 4, more is better) (Frontend + Backend)
- Ecological zone tracker: Visual garden layout with family spacing (Frontend)
- Growing technique adoption: Which methods implemented (Frontend + Backend)
- Autoinducer usage log: Seed treatment applications, which plant combinations (Frontend + Backend)
- Foliar feed tracking: Application timing during system transition (Frontend + Backend)

**Validation Metrics:**
- **Brix measurement tracking:** Log readings over time, see trends, compare to targets (Frontend + Backend)
- **Brix achievement indicators:** Optimal/good/needs improvement based on targets (Frontend)
- **Microbiome score:** Based on plant diversity + Brix levels + technique adoption (NOT body testing) (Backend Process)
- **Fermentation log:** What you've fermented from garden, which microbes supported (Frontend + Backend)

**Animal & Ecosystem Tracking:**
- Beneficial animals observed (pollinators, predators, wildlife) (Frontend + Backend)
- Dogs' role in microbe transfer (observations, interactions) (Frontend + Backend)
- Pet integration notes (chickens, composting animals) (Frontend + Backend)
- Pest management log (organic methods used, effectiveness) (Frontend + Backend)

**Health Validation (Optional):**
- Symptom tracking: Secondary validation that practices work (Frontend + Backend)
- Energy/performance notes (Frontend + Backend)
- Connection between growing activities and wellness changes (Frontend)

**Documentation:**
- Progress photos with timestamps (Frontend + Backend)
- Growing notes and observations (Frontend + Backend)
- Seasonal review: What worked, what to adjust next season (Frontend)
- Success patterns identification (Frontend)

**Export & Sharing:**
- Export growing journal (Frontend)
- Share success anonymously to community (future feature) (Frontend + Backend)

**Flexible Tracking Structure:**
- Modular tracking categories allow new metrics easily (Backend)
- Custom tracking fields for user experiments (Backend)
- New validation methods added as science evolves (Backend)

---

### Profile — `/profile`

**Core Purpose:** Unified account management, growing context, health goals, subscription

**Account Information:**
- Email, member since date, subscription status (Frontend)
- Update name, security settings (Frontend + Backend)

**Growing Profile (Expandable):**

**Current Fields:**
- Climate zone and location (Frontend + Backend)
- Available space and size (Frontend + Backend)
- Constraints: HOA, rental, space limitations (Frontend + Backend)
- Pets in garden: Dogs (microbe transfer!), cats, chickens, other (Frontend + Backend)
- Health goals: Anxiety, immunity, performance, longevity, children's health, digestion (Frontend + Backend)
- Experience level: Beginner, intermediate, advanced (Frontend + Backend)
- Learning preference: Visual, step-by-step, science-deep (Frontend + Backend)

**Future Fields (Easy to Add):**
- Fermentation interests
- Specific microbe targets (if testing available)
- Advanced technique interests
- Community engagement preferences

**Re-Assessment:**
- Re-take Growing Knowledge Path Assessment anytime (Frontend)
- Track knowledge progression over time (Backend)
- Update learning stage as user advances (Frontend + Backend)

**Usage Analytics:**
- AI coach queries used (if tier limits exist) (Frontend)
- Research articles read (Free tier: X of 5 used) (Frontend)
- Progression metrics: Days active, plants learned, techniques explored (Frontend)

**Subscription Management:**
- Current tier display: Discovery/Implementation/Mastery (Frontend)
- Feature breakdown by tier (Frontend)
- Contextual upgrade messaging based on behavior:
  - Free hitting research limit: "Unlock unlimited AI coaching - Basic $27-47/mo" (Frontend)
  - Basic viewing Premium features: "Unlock advanced climate mastery - Premium $67-97/mo" (Frontend)
- Stripe Checkout integration for upgrades (Frontend + Backend)
- Link to Stripe Customer Portal (payment methods, invoices, billing history) (Frontend)
- Cancellation flow with retention messaging (Frontend + Backend)
- Usage-based upgrade prompts (Frontend)

**Flexible Profile System:**
- Modular profile fields allow easy additions (Backend)
- Custom fields for unique situations (Backend)
- Profile data automatically available to AI for personalization (Backend Process)

---

## 👑 Admin Section (Phase 1 - All Essential)

### Admin Analytics — `/admin/analytics`

**Core Purpose:** Data-driven marketing decisions, retention optimization, gap identification

**Subscription & Revenue Metrics:**
- Free → Basic conversion rate (Frontend)
- Basic → Premium conversion rate (Frontend)
- Time to upgrade analysis by user segment (Frontend)
- Churn rate by tier (Frontend)
- MRR (Monthly Recurring Revenue) (Frontend)
- ARPU (Average Revenue Per User) (Frontend)
- LTV (Lifetime Value) by cohort (Frontend)
- Churn impact on revenue (Frontend)

**User Engagement Metrics:**
- DAU/MAU (Daily/Monthly Active Users) (Frontend)
- Session duration by tier (Frontend)
- Feature adoption rates (which features drive upgrades) (Frontend)
- AI coach usage patterns (popular questions, knowledge gaps revealed) (Frontend)
- Planting Guide engagement (which months/plants drive action) (Frontend)
- Research feed engagement (most-read articles, topic preferences) (Frontend)
- Premium feature usage rates (My Garden, Brix tracking, advanced techniques) (Frontend)

**Retention Insights:**
- At-risk user identification (behavior patterns predicting churn) (Frontend)
- Success patterns (what makes users stick and upgrade) (Frontend)
- Drop-off points in user journey (where users get stuck) (Frontend)
- Cohort analysis: Behavior by signup date (Frontend)

**Free Tier Conversion Intelligence:**
- Which health goals correlate with upgrades (anxiety, immunity, children's health, etc.) (Frontend)
- Which problem revelations resonate most (conventional harmful, organic limited, access) (Frontend)
- Which research topics drive engagement before upgrade (Frontend)
- What questions do Free users ask AI before upgrading (Frontend)
- Which upgrade messages work best by segment (Frontend)
- Time to upgrade by user type (Frontend)
- A/B test results on conversion messaging (Frontend)

**Geographic & Demographic:**
- Climate zone distribution (Frontend)
- Constraint patterns (HOA, rental, space limitations) (Frontend)
- Health goal distributions (Frontend)
- Learning stage distribution (beginner, intermediate, advanced) (Frontend)

**Gap Identification (Critical for Iteration):**
- AI questions that couldn't be answered well (reveals knowledge gaps) (Frontend)
- User feedback themes (what's confusing, what's missing) (Frontend)
- Feature requests tracking (what users ask for) (Frontend)
- Content engagement patterns (what content users want more of) (Frontend)

**Export & Reporting:**
- Export analytics reports (Frontend)
- Custom date ranges (Frontend)
- Segment by user attributes (Frontend)

**Flexible Analytics:**
- New metrics easily added as product evolves (Backend)
- Custom events for tracking new features (Backend)

---

### Admin Research — `/admin/research`

**Core Purpose:** Quality control and strategic content curation for research feed

**Research Management:**
- Review automated imports from scraping agents (Frontend)
- Pin breakthrough studies to feed top (Frontend + Backend)
- Remove low-quality or irrelevant articles (Frontend + Backend)
- Manually add important research missed by automation (Frontend + Backend)
- Edit article metadata: topics, plant families, microbes, health conditions (Frontend + Backend)
- Set article visibility by tier (free preview vs premium exclusive) (Frontend + Backend)

**Engagement Insights:**
- Which articles users read most (by tier) (Frontend)
- Which research AI cites in coach responses (Frontend)
- Bookmark and library statistics (Frontend)
- Topic preferences by user segment (Frontend)

**Content Strategy:**
- Research source management (add/remove scraping sources) (Frontend + Backend)
- Topic gap identification (what research areas are missing) (Frontend)
- Seasonal research priorities (Frontend)
- Conversion correlation (which research topics drive upgrades) (Frontend)

**Flexible Tagging System (Key for Growth):**
- Unlimited tag categories (Backend)
- Create new research categories on-the-fly (Frontend + Backend)
- Tags automatically available in feed filters without code changes (Backend Process)
- Hierarchical tagging (parent/child categories) (Backend)

---

### Admin Users — `/admin/users`

**Core Purpose:** Support, account management, pattern identification

**User Management:**
- User list with search (email, name) (Frontend)
- Filter by: subscription tier, activity status, signup date, location, health goals (Frontend)
- View user details: profile, usage stats, growing data, activity logs (Frontend)
- View user's Growing Knowledge Path Assessment responses (Frontend)
- View user's Growing Discovery Path Report (Frontend)

**Support Tools:**
- Manual subscription adjustments (comps, refunds, tier changes for edge cases) (Frontend + Backend)
- Activity logs: Logins, AI queries, research reads, garden activities (Frontend)
- User notes for support tracking (Frontend + Backend)
- Impersonate user for troubleshooting (see app from their perspective) (Frontend + Backend)
- View subscription history and payment status (Frontend)

**Pattern Identification:**
- Success patterns: What makes users stick and upgrade (Frontend)
- Churn patterns: Where do users struggle and leave (Frontend)
- Feature usage by user segment (Frontend)
- Conversion behavior analysis (Frontend)

---

### Admin Content — `/admin/content` (NEW - Critical for Iterative Growth)

**Core Purpose:** Add new knowledge areas to RAG database as gaps emerge without code changes

**Knowledge Base Management:**
- Add new topic modules to RAG database (Frontend + Backend)
- Upload documents/guides for AI context (Frontend + Backend)
- Organize knowledge into modular categories (Frontend + Backend)
- Tag content for AI retrieval optimization (Frontend + Backend)
- Preview how AI uses new content in responses (Frontend + Backend)

**Content Categories (Current & Expandable):**
- **Core Principles:** Plant family diversity (minimum 4, more is better), quorum sensing, endophytes
- **Seed Quality:** Heritage/landrace selection, sourcing, endophyte richness
- **Advanced Techniques:** Autoinducers (seed treatment only - kickstart seed-soil connection), foliar feeds (system transition), Brix optimization
- **Plant Families:** Profiles, microbiome benefits, companions
- **Growing Methods:** Composting, seed raising, soil building
- **Animal Integration:** Pollinators, pests, pets (dogs as microbe transfer!), beneficial animals
- **Fermentation:** Methods, plant-specific protocols, quorum sensing in ferments
- **Climate Strategies:** Adaptive timing, resilience, infrastructure
- **Space Solutions:** Containers, small yards, balconies
- **Constraint Solutions:** HOA compliance, rental, urban
- **Design Systems:** Water management, fire protection, ecosystem protection, perimeter strategies
- **NEW categories added here as knowledge evolves**

**Quality Control:**
- Review AI responses using new content (Frontend)
- Edit/improve content based on user questions (Frontend + Backend)
- Archive outdated information (Frontend + Backend)
- Version control for knowledge updates (Backend)

**Flexible Knowledge System (Essential):**
- Modular content blocks (Backend)
- No code changes needed for new topics (Backend)
- AI automatically incorporates new knowledge via RAG (Backend Process)
- Admin can respond to knowledge gaps immediately (Backend)

---

## 💰 Business Model Integration

### Subscription Tiers & Access

**Free Tier: Discovery (Concept Revelation Only)**

**Purpose:** Reveal the growing-gut connection exists, prove it's real, capture conversion intelligence

**Access:**
- Growing Knowledge Path Assessment (captures health goals, frustrations, urgency, conversion drivers)
- "Your Growing Discovery Path" Report (member messaging: three-level problem, core truth, indoor air quality revelation)
- Research Feed (3-5 articles/month showing scientific evidence connection exists)
- Limited AI Coach preview (3-5 questions capturing what they want to know, then paywall)
- Indoor Air Quality concept education (filters ALL pollutants - PFAS, chemicals, dust, pesticides, no specific plant list in Free tier)

**What They Learn:**
- Growing method → gut microbiome connection EXISTS
- Three-level problem: Conventional harmful (endotoxins), organic limited (range), this = only access
- Core truth: "You can't replace what you don't have access to"
- That a solution exists

**What They DON'T Get:**
- ❌ HOW the methodology works (no plant families, quorum sensing details, techniques)
- ❌ WHAT to do (no plant recommendations, no implementation)
- ❌ Planting Guide access
- ❌ Plant Database access
- ❌ Full AI Coach access
- ❌ Any implementation guidance

**Conversion Intelligence Captured:**
- Which health goals drive upgrades
- Which problem revelations resonate
- Which research topics engage them
- What questions they ask AI
- Time to upgrade patterns
- A/B test upgrade messaging

**Conversion Message:** "You now know the connection exists and why current solutions fail. Want to learn HOW to implement and WHAT to grow? Upgrade to Basic."

---

**Basic Tier: Implementation ($27-47/month)**

**Purpose:** Learn fundamentals, implement core principle successfully

**Everything in Free, Plus:**
- **Unlimited AI Coach** - RAG-powered growing guidance adapted to knowledge level
- **Full Planting Guide** - Calendar-based with integrated climate strategies (not fixed - adaptive timing)
- **Complete Plant Database** - Browse by family, microbiome profiles, filtering, indoor air quality plants (ALL pollutants - PFAS, chemicals, dust, pesticides)
- **Unlimited Research Feed** - Basic filtering by topic
- **Core Growing Techniques Library** - Composting, seed raising, basic soil building
- **"Grow vs Buy" Decision Engine** - Prioritize growing efforts
- **Plant Mix Recommendations** - Personalized family diversity combinations (minimum 4, more is better)
- **HOA/Bylaw Basic Compliance** - Simple compliant designs maintaining effectiveness
- **Basic Container Growing** - Space-constrained solutions with root proximity
- **Animal Integration Basics** - Beneficial animals, pest management, pet context (dogs as microbe transfer)
- **Fermentation Basics** - How to ferment garden produce

**What They Can Do:**
- Implement core principle: Plant family diversity (minimum 4, more is better)
- Get climate-specific guidance: What to plant this month
- Understand complete system: Seed endophytes → soil quorum sensing → gut
- Handle basic constraints and challenges
- Start growing for microbiome restoration

**Upgrade Trigger:** "Ready for comprehensive design systems and advanced climate mastery? Unlock Premium."

---

**Premium Tier: Advanced Mastery ($67-97/month)**

**Purpose:** Master comprehensive system design, advanced techniques, climate resilience

**Everything in Basic, Plus:**

**Comprehensive Design Systems:**
- **Complete Garden Design** - Ecological zone planning, plant family spacing optimization
- **Water Management Strategies** - Drought adaptation, water harvesting, irrigation design, wet condition handling
- **Fire Protection Plantings** - Perimeter fire-resistant species, defensible space design
- **Ecosystem Protection Plantings** - Windbreaks, erosion control, biodiversity corridors
- **Perimeter Protective Strategies** - Pollution control boundaries, external defense systems
- **Multi-Zone System Integration** - Protection zones + production zones + ecosystem zones

**Advanced Infrastructure & Climate Mastery:**
- **Climate Infrastructure** - Tunnel houses, hoop houses, season extension structures
- **Advanced Planting Guide** - Real-time adaptive timing, sophisticated resilience protocols
- **Seasonal Planning** - Multi-season planning with climate variability built in
- **Perennial Systems** - Climate-resilient long-term plantings

**Expert-Level Techniques:**
- **Autoinducer Protocols** - Seed treatment only to kickstart seed-soil microbiome connection (one-time use, contextual teaching)
- **Foliar Feed Strategies** - Maintain production during system transition
- **Brix Measurement** - Training, tracking, optimization for validation
- **Soil Fungal Network Optimization** - Advanced microbe-sharing techniques
- **Quorum Sensing Manipulation** - Expert strategies for tipping communities beneficial

**Advanced Sourcing & Materials:**
- **Heritage/Landrace Seed Selection** - Expert guidance on genetic diversity for superior endophytes
- **Quality Plant Material Sourcing** - Where to buy, quality markers, why sources matter for microbiome transfer
- **Native Plant Integration** - Strategic biodiversity enhancement

**Complex Implementations:**
- **Advanced HOA/Bylaw Solutions** - Sophisticated compliant designs maintaining microbial effectiveness
- **Container Microbiology Mastery** - Advanced root proximity optimization in constrained spaces
- **Urban Growing Systems** - Space-maximizing techniques

**Tracking & Validation:**
- **My Garden Access** (`/garden` route unlocked)
- **Growing Activity Logs** - Track implementations
- **Brix Tracking** - Measurement logs, trends, validation
- **Plant Family Diversity Score** - Gamified implementation validation
- **Microbiome Score** - Based on growing practices, technique adoption (not body testing)
- **Progress Documentation** - Photos, notes, seasonal reviews

**Premium Support & Research:**
- **Seasonal Push Notifications** - Never miss optimal planting windows
- **Advanced Research Filtering** - By specific microbes, plant families, health conditions
- **Research Digest Emails** - Weekly summaries of breakthrough studies
- **Research Bookmarking** - Personal library of relevant research
- **Priority AI Context** - Deeper personalization in responses

**Value Justification:** Users implementing advanced techniques see $1,000-3,000+ annual value (supplement elimination, reduced medical costs, food cost savings, performance gains)

---

### Subscription Management (Unified with Profile)

**Profile Page Integration** — `/profile`
- Display current subscription tier with feature breakdown
- Tier comparison: Discovery → Implementation → Mastery progression
- Usage tracking by tier displayed
- Contextual upgrade CTAs based on behavior
- Stripe Checkout integration for upgrades
- Link to Stripe Customer Portal (payment methods, invoices, billing history)
- Cancellation flow with retention messaging

**Real-Time Subscription Verification:**
- Check Stripe API before protected actions (Backend)
- Verify tier access for Premium features (`/garden`, advanced planting guide content) (Backend)
- Enforce usage limits (Free: 3-5 research articles, limited AI queries) (Backend)
- Graceful upgrade prompts when hitting limits (Frontend)

**Minimal Webhook Usage:**
- `/api/webhooks/stripe` handles critical events only:
  - New subscription created → Update user tier (Backend)
  - Subscription canceled → Mark cancellation date (Backend)
  - Payment failed → Flag for retention (Backend)
- Stripe as single source of truth for subscription status (Backend)

---

## 📱 Navigation Structure

### Main Sidebar (Responsive)

**Core Features (Tier-Based Access):**
- 💬 **AI Coach** - Chat with personalized microbiome restoration coach
  - Free: Limited preview (3-5 questions)
  - Basic/Premium: Unlimited access
- 📅 **Planting Guide** - Climate-adaptive growing guidance
  - Free: No access (paywall)
  - Basic: Calendar with integrated climate strategies
  - Premium: Advanced climate mastery
- 🌱 **Plant Database** - Browse plants by family and microbiome benefits
  - Free: No access (paywall)
  - Basic/Premium: Full access
  - Premium: Advanced sourcing and techniques
- 📰 **Research Feed** - Latest scientific discoveries
  - Free: 3-5 articles/month
  - Basic: Unlimited with basic filtering
  - Premium: Advanced filtering, bookmarks, notifications
- 👤 **Profile** - Account, growing context, subscription
  - All users: Full access

**Premium Features (Premium Tier Only):**
- 🏡 **My Garden** - Track growing activities, Brix measurements, progress validation

**Admin Features (Admin Role Only):**
- 📊 **Analytics** - User engagement, retention, conversion intelligence
- 📚 **Research** - Curate and manage research feed quality
- 👥 **Users** - Support and account management
- 📝 **Content** - Knowledge base management (add topics as gaps emerge)

**Role-Based Access:**

**All Authenticated Users:**
- AI Coach (tier-gated access levels)
- Planting Guide (tier-gated access levels)
- Plant Database (tier-gated access levels)
- Research Feed (tier-gated access levels)
- Profile (full access)

**Premium Users (Additional Access):**
- My Garden (tracking and validation features)

**Admin Users (Additional Access):**
- Analytics, Research management, User management, Content management

**Mobile Navigation:**
- Collapsible sidebar with icon-only mode for small screens
- Bottom navigation option for thumb-friendly mobile access
- Primary features (AI Coach, Planting Guide) accessible in collapsed state
- Touch-optimized spacing for garden planning on mobile

---

## 🔧 Next.js App Router Structure

### Layout Groups

```
app/
├── (public)/          # Marketing and legal pages with public layout
├── (auth)/            # Authentication flow with centered auth layout
├── (protected)/       # Main authenticated app with sidebar layout
├── (admin)/           # Admin section with admin layout and role checks
└── api/               # Backend API endpoints (webhooks only)
```

### Complete Route Mapping

**🌐 Public Routes (Public Messaging Track)**
- `/` → Landing page (ad-compliant messaging, value proposition, subscription tiers)
- `/privacy` → Privacy policy (GDPR compliance, health data handling)
- `/terms` → Terms of service (health coaching disclaimers, FDA disclaimers)
- `/cookies` → Cookie policy (tracking compliance)

**🔐 Auth Routes**
- `/auth/login` → User login with Supabase Auth
- `/auth/sign-up` → User registration with Growing Knowledge Path Assessment (public-compliant)
- `/auth/forgot-password` → Password reset flow
- `/auth/update-password` → Secure password change
- `/auth/sign-up-success` → Registration confirmation page
- `/auth/confirm` → Email verification handler
- `/auth/error` → Authentication error handling

**🛡️ Protected Routes (Require Authentication) (Member Messaging Track)**
- `/coach` → New AI coaching conversation
- `/coach/[conversationId]` → Resume specific coaching conversation
- `/planting-guide` → Climate-adaptive planting guidance (tier-gated content)
- `/plants` → Plant database (browse by family, filter by goals)
- `/research` → Curated scientific research feed (tier-gated access)
- `/profile` → Unified profile, growing context, subscription management
- `/garden` → Growing tracking and validation (Premium only)

**👑 Admin Routes (Role + Auth Check)**
- `/admin/analytics` → User engagement, retention, conversion intelligence
- `/admin/research` → Research feed curation and quality control
- `/admin/users` → User support and pattern identification
- `/admin/content` → Knowledge base management (add new topics without code changes)

---

### Backend Architecture

**🔧 API Endpoints (External Communication Only)**
- `/api/webhooks/stripe/route.ts` → Stripe subscription webhook handling (new subscription, cancellation, payment failed)
- `/api/integrations/[service]/route.ts` → Future external integrations (weather APIs, microbiome testing, etc.)

**⚡ Server Actions (Internal App Functionality)**
- `app/actions/chat.ts` → AI coach interactions, RAG retrieval, conversation management
- `app/actions/calendar.ts` → Climate-specific planting guide generation
- `app/actions/assessment.ts` → Growing Knowledge Path assessment processing, report generation
- `app/actions/garden.ts` → Growing activity tracking, Brix logging, score calculations
- `app/actions/research.ts` → Research feed interactions, bookmarking
- `app/actions/profile.ts` → User profile updates, growing context management
- `app/actions/subscription.ts` → Subscription management, tier verification
- `app/actions/admin.ts` → Admin operations (analytics, research curation, user management, content)

**📚 Lib Queries (Database & Business Logic)**
- `lib/queries/users.ts` → User data access and management
- `lib/queries/plants.ts` → Plant database queries, filtering
- `lib/queries/research.ts` → Research article queries, tagging
- `lib/queries/garden.ts` → Garden tracking queries, score calculations
- `lib/queries/knowledge-base.ts` → RAG content management (modular for easy additions)
- `lib/queries/analytics.ts` → Analytics data aggregation, conversion intelligence
- `lib/queries/subscriptions.ts` → Subscription and tier logic, Stripe integration

**🤖 Background Jobs**
- Research scraping agent (daily/weekly automated monitoring of PubMed, journals, regenerative agriculture sources)
- Seasonal notification scheduler (climate-based push notifications for optimal planting windows)
- Research digest emails (Premium: weekly summaries of breakthrough studies)
- Engagement emails (inactive user re-engagement with seasonal opportunities)
- Microbiome score calculations (nightly for Premium users based on growing activities)
- Analytics aggregation (daily metrics processing)
- Conversion intelligence processing (track patterns, optimize messaging)

**Architecture Flow:**
- Frontend → Server Actions → Lib Queries → Database (Internal operations)
- Frontend → `/api/integrations/[service]` → External Services (External communication)
- External Services → `/api/webhooks/stripe` → Server Actions → Lib Queries (Webhook processing)

**Modular RAG System (Critical for Flexibility):**
- Knowledge organized by topic modules (seeds, autoinducers seed treatment, foliar feeds, animals, design systems, etc.)
- New modules added via `/admin/content` without code changes
- AI retrieval adapts to new content automatically via RAG
- Version tracking for knowledge evolution
- Admin can respond to knowledge gaps immediately

---

## 🎯 Technical Implementation Details

### Two-Track Messaging Implementation

**Public Track (Landing Page, Ads):**
- Copy stored in: `lib/content/public-messaging.ts`
- Ad-compliant language
- Educational positioning
- Research-based framing
- No disease treatment claims

**Member Track (Inside App):**
- Copy stored in: `lib/content/member-messaging.ts`
- Stronger truth education
- Three-level problem explanation
- Core truth emphasis
- Educational disclaimers component: `components/disclaimers/health-disclaimer.tsx`

**Transition Implementation:**
- Assessment uses public messaging
- Report (delivered inside app after signup) uses member messaging with disclaimers
- All in-app content includes disclaimer component

### Free Tier Conversion Intelligence

**Tracking Events:**
- Assessment completion with answers stored
- Research article reads (which topics)
- AI Coach questions asked (what problems they want solved)
- Feature interactions (what they click on)
- Upgrade prompt views (which messages shown)
- Upgrade attempts (which prompts triggered action)

**Analytics Dashboard:**
- Conversion patterns by health goal
- Content engagement by converters vs non-converters
- Question themes before upgrade
- A/B test results on upgrade messaging
- Time to upgrade by user segment

### Tier Access Enforcement

**Route Guards:**
- Middleware checks authentication
- Server Actions check tier access via Stripe API
- Graceful paywall components for feature access
- Contextual upgrade prompts based on attempted action

**Usage Limits:**
- Free: 3-5 research articles/month, 3-5 AI questions (tracked in database)
- Basic: Unlimited AI and research, no premium features
- Premium: All features unlocked

### Knowledge Base Modularity

**Structure:**
```
knowledge-base/
├── core-principles/
├── seed-quality/
├── advanced-techniques/
├── plant-families/
├── animal-integration/
├── design-systems/
├── climate-strategies/
└── [new-modules-added-via-admin]/
```

**Admin Content Management:**
- Upload documents to specific modules
- Tag content for AI retrieval
- Preview AI responses using new content
- No code deployment needed for new topics

---

## 📊 Success Metrics & KPIs

**Subscription Metrics:**
- Free → Basic conversion rate (target: 5-10%)
- Basic → Premium conversion rate (target: 15-25%)
- Monthly churn rate by tier (target: <5% Basic, <3% Premium)
- Time to upgrade (track by user segment)
- MRR growth month-over-month

**Engagement Metrics:**
- DAU/MAU ratio
- AI Coach queries per user per month
- Planting Guide views per user per month
- Research articles read per user per month
- My Garden activity frequency (Premium users)

**Retention Metrics:**
- 30/60/90-day retention by tier
- Feature adoption rates
- Success patterns (what makes users stick)
- At-risk user early identification

**Conversion Intelligence Metrics:**
- Free tier engagement patterns that predict upgrade
- Content types that drive conversions
- Questions asked before upgrade
- A/B test conversion lift

---

## 🚀 MVP Functionality Summary

This blueprint delivers: **The ONLY access point to truly replace missing beneficial microbes through personalized, RAG-powered growing guidance with progressive mastery from discovery to advanced design.**

**Phase 1 (Launch Ready):**
- ✅ Two-track messaging system (public compliant, member direct truth)
- ✅ Three-tier subscription with clear value progression
- ✅ Free tier conversion intelligence and problem revelation
- ✅ Universal SaaS foundation (auth, legal, responsive design)
- ✅ RAG-powered AI coaching adapted to knowledge level
- ✅ Climate-adaptive planting guide (not fixed calendar)
- ✅ Complete plant database with microbiome profiles and ecosystem context
- ✅ Automated research feed with curation and filtering
- ✅ Premium tracking and validation (My Garden, Brix, scores)
- ✅ Admin analytics, research management, user support, content management
- ✅ Flexible knowledge base for iterative additions
- ✅ Complete system education: Seeds → soil → plants → ferments → gut
- ✅ Animal integration (dogs as microbe transfer, beneficial animals, pests)
- ✅ Premium design systems (water, fire, ecosystem protection)
- ✅ Mobile-responsive throughout

**Phase 2 (Growth Features - Future):**
- 🔄 Visual garden design tool (drag-and-drop layout with family spacing)
- 🔄 Microbiome test integration (upload results, AI maps missing microbes to plant families)
- 🔄 Community success stories and photo gallery
- 🔄 Equipment cost calculator and ROI tracker
- 🔄 Family/household multi-user profiles
- 🔄 Local climate alerts and real-time adaptations
- 🔄 Video tutorials and step-by-step walkthroughs
- 🔄 "Ask an Expert" premium feature (human expert review)

> **Status:** Complete implementation blueprint ready for wireframe design and database modeling.

**Next Step:** Proceed to wireframe sketches and navigation flow mapping.
