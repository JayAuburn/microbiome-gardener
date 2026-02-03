# Wireframe Reference Doc

## ASCII / Markdown Mock-ups

```text
+------------------------------------------------------------------+
| AUTHENTICATED APP LAYOUT (Protected Routes)                      |
+------------------------------------------------------------------+
| Sidebar                |  Main Content Area                       |
|------------------------|------------------------------------------|
| 💬 AI Coach            |  [Page-specific content here]            |
| 📅 Planting Guide      |                                          |
| 🌱 Plant Database      |                                          |
| 📰 Research Feed       |                                          |
| 👤 Profile             |                                          |
|                        |                                          |
| [Premium Features]     |                                          |
| 🏡 My Garden           |                                          |
|                        |                                          |
| [Admin - Role Check]   |                                          |
| 📊 Analytics           |                                          |
| 📚 Research Mgmt       |                                          |
| 👥 Users               |                                          |
| 📝 Content             |                                          |
|------------------------|                                          |
| Usage: 15/100 queries  |                                          |
| (Free tier display)    |                                          |
+------------------------+------------------------------------------+


+------------------------------------------------------------------+
| PUBLIC: Landing Page  `/`                                        |
+------------------------------------------------------------------+
|  [Top Nav: Logo, Login, Sign Up]                                 |
|------------------------------------------------------------------|
|  [Hero Section]                                                  |
|  "The Missing Link Between Growing Methods and                   |
|   Microbiome Restoration"                                        |
|  [CTA: Discover Your Growing Knowledge Path]                     |
|------------------------------------------------------------------|
|  [Problem Hook]                                                  |
|  Why store-bought (even organic) may not restore                 |
|  beneficial microbes - worldwide                                 |
|------------------------------------------------------------------|
|  [Research Credibility Section]                                  |
|  Global research showing different growing practices              |
|  transfer different microbes                                     |
|------------------------------------------------------------------|
|  [Air Filtration Hook]                                           |
|  Plants filter ALL pollutants: PFAS, chemical dust,              |
|  pesticides - indoor and outdoor protection                      |
|  [Works in any climate, any location]                            |
|------------------------------------------------------------------|
|  [Complete System Teaser]                                        |
|  Seed endophytes → Soil (4+ families minimum) →                  |
|  Plant → Food → Gut connection                                   |
|  [Universal principles, adapted to YOUR climate]                 |
|------------------------------------------------------------------|
|  [Global Accessibility]                                          |
|  "Personalized growing guidance for your location -              |
|   Northern or Southern hemisphere, any climate"                  |
|------------------------------------------------------------------|
|  [Subscription Tiers Comparison]                                 |
|  Discovery (Free) | Implementation (Basic $27-47) |              |
|  Mastery (Premium $67-97)                                        |
|------------------------------------------------------------------|
|  [Footer: Privacy, Terms, Cookies]                               |
+------------------------------------------------------------------+


+------------------------------------------------------------------+
| AUTH: Sign Up  `/auth/sign-up`                                   |
+------------------------------------------------------------------+
|  [Centered Card]                                                 |
|  +---------------------------------------------------------+     |
|  | Sign Up                                                 |     |
|  | [Email field]                                           |     |
|  | [Password field]                                        |     |
|  |                                                         |     |
|  | [Growing Knowledge Path Assessment - Integrated]        |     |
|  |                                                         |     |
|  | Question 1: Do you grow any food now?                  |     |
|  | [Yes/No/Used to]                                        |     |
|  |                                                         |     |
|  | Question 2: What brings you here?                      |     |
|  | [Anxiety, IBS, immunity, performance, digestion,        |     |
|  |  longevity, children's health]                          |     |
|  |                                                         |     |
|  | Question 3: What you've tried?                         |     |
|  | [Probiotics, supplements, diet changes...]              |     |
|  |                                                         |     |
|  | Question 4-8: [Health/knowledge questions...]          |     |
|  |                                                         |     |
|  | Question 9: Your location                              |     |
|  | [City, Country] [Hemisphere: N/S auto-detected]        |     |
|  |                                                         |     |
|  | Question 10: Climate context                           |     |
|  | Current season where you are:                          |     |
|  | [Spring/Summer/Fall/Winter]                            |     |
|  | Do you know your average frost dates? [Optional]       |     |
|  |                                                         |     |
|  | Question 11: Space assessment                          |     |
|  | [None, balcony, small yard, large yard]                |     |
|  |                                                         |     |
|  | [Optional: US users only - Hardiness zone if known]    |     |
|  |                                                         |     |
|  | [Create Account button]                                |     |
|  +---------------------------------------------------------+     |
+------------------------------------------------------------------+


+------------------------------------------------------------------+
| AUTH: Login  `/auth/login`                                       |
+------------------------------------------------------------------+
|  [Centered Card]                                                 |
|  +---------------------------------------------------------+     |
|  | Login                                                   |     |
|  | [Email field]                                           |     |
|  | [Password field]                                        |     |
|  | [Forgot password link]                                 |     |
|  | [Login button]                                          |     |
|  |                                                         |     |
|  | Don't have an account? [Sign up]                       |     |
|  +---------------------------------------------------------+     |
+------------------------------------------------------------------+


+------------------------------------------------------------------+
| AUTH: Password Reset  `/auth/forgot-password`                    |
+------------------------------------------------------------------+
|  [Centered Card]                                                 |
|  +---------------------------------------------------------+     |
|  | Forgot Password                                         |     |
|  |                                                         |     |
|  | Enter your email to receive a password reset link       |     |
|  |                                                         |     |
|  | [Email field]                                           |     |
|  | [Send Reset Link button]                               |     |
|  |                                                         |     |
|  | [Back to Login]                                         |     |
|  +---------------------------------------------------------+     |
+------------------------------------------------------------------+


+------------------------------------------------------------------+
| AUTH: Update Password  `/auth/update-password`                   |
+------------------------------------------------------------------+
|  [Centered Card]                                                 |
|  +---------------------------------------------------------+     |
|  | Update Password                                         |     |
|  |                                                         |     |
|  | [New password field]                                    |     |
|  | [Confirm password field]                                |     |
|  | [Update Password button]                                |     |
|  +---------------------------------------------------------+     |
+------------------------------------------------------------------+


+------------------------------------------------------------------+
| PROTECTED: AI Coach  `/coach` or `/coach/[conversationId]`      |
+------------------------------------------------------------------+
| Sidebar                |  Chat Interface                          |
|------------------------|------------------------------------------|
| 💬 AI Coach (active)   |  [Conversation Header]                   |
| 📅 Planting Guide      |  "AI Microbiome Growing Coach"           |
| 🌱 Plant Database      |                                          |
| 📰 Research Feed       |  [Message Thread]                        |
| 👤 Profile             |  ┌────────────────────────────────────┐ |
|                        |  │ User: "What should I plant for     │ |
| [Premium]              |  │ gut health?"                        │ |
| 🏡 My Garden           |  └────────────────────────────────────┘ |
|                        |                                          |
| [Admin]                |  ┌────────────────────────────────────┐ |
| (hidden if not admin)  |  │ AI: "Great question! Let's start   │ |
|                        |  │ with the 4+ plant family principle │ |
|------------------------|  │ (minimum 4, more is better)..."    │ |
| Usage: 3/5 queries     |  │ [Research citation]                 │ |
| (Free tier)            |  └────────────────────────────────────┘ |
|                        |                                          |
|                        |  [Streaming indicator if active]         |
|                        |                                          |
|                        |  [Input Area]                            |
|                        |  [Text input box]                        |
|                        |  [Image upload - Premium] [Send button]  |
|                        |                                          |
|                        |  [Admin: "Report incorrect info" button  |
|                        |   visible to admin for quick fixes]      |
|                        |                                          |
|                        |  [Tier Paywall if Free limit reached]    |
+------------------------+------------------------------------------+


+------------------------------------------------------------------+
| PROTECTED: Planting Guide  `/planting-guide`                     |
+------------------------------------------------------------------+
| Sidebar                |  Climate-Responsive Growing Guide        |
|------------------------|------------------------------------------|
| 💬 AI Coach            |  [Header: Current Season - Your Location]|
| 📅 Planting Guide ✓    |  "What to plant based on YOUR conditions"|
| 🌱 Plant Database      |                                          |
| 📰 Research Feed       |  [Current Conditions - Your Location]    |
| 👤 Profile             |  • Current soil temp: 8°C                |
|                        |  • Last frost: Estimated 3 weeks         |
| [Premium]              |  • Weather trend: Warming                |
| 🏡 My Garden           |  • Hemisphere: Northern/Southern         |
|                        |                                          |
| [Admin]                |  [Plant Family Options (condition-based)]|
| (hidden)               |  ┌──────────────────────────────────┐   |
|                        |  │ ✓ READY NOW: Brassicaceae        │   |
|------------------------|  │   (Cabbage Family)               │   |
| Usage: Basic tier      |  │ • Kale, Cabbage, Broccoli        │   |
| (Unlimited)            |  │ WHY: Cold-tolerant, thrives at   │   |
|                        |  │      current soil temps          │   |
|                        |  │ [View details]                   │   |
|                        |  └──────────────────────────────────┘   |
|                        |                                          |
|                        |  ┌──────────────────────────────────┐   |
|                        |  │ ⏳ WAIT 2-3 WEEKS: Solanaceae    │   |
|                        |  │   (Tomato Family)                │   |
|                        |  │ REASON: Needs warmer soil,       │   |
|                        |  │         frost risk still present │   |
|                        |  └──────────────────────────────────┘   |
|                        |                                          |
|                        |  [Repeat for multiple families...]       |
|                        |                                          |
|                        |  [Reminder: Minimum 4 families planted,  |
|                        |   more is better for microbe diversity]  |
|                        |                                          |
|                        |  [Complete System Context]               |
|                        |  • Beneficial animals active now         |
|                        |  • Seasonal pest management              |
|                        |  • Fermentation opportunities            |
|                        |                                          |
|                        |  [Basic Tier: Climate Education Section] |
|                        |  • Understanding your local climate      |
|                        |  • Hardiness zones (US reference only)   |
|                        |  • Soil temperature monitoring           |
|                        |  • Frost date tracking for your area     |
|                        |                                          |
|                        |  [Premium: Infrastructure strategies]    |
|                        |                                          |
|                        |  [Free Tier: Paywall overlay]            |
+------------------------+------------------------------------------+


+------------------------------------------------------------------+
| PROTECTED: Plant Database  `/plants`                             |
+------------------------------------------------------------------+
| Sidebar                |  Plant Database Browser                  |
|------------------------|------------------------------------------|
| 💬 AI Coach            |  [Search Bar]                            |
| 📅 Planting Guide      |                                          |
| 🌱 Plant Database ✓    |  [Filter Controls]                       |
| 📰 Research Feed       |  By Family | By Health Goal | By Space  |
| 👤 Profile             |  By Climate | By Animals | By Pet Safety |
|                        |                                          |
| [Premium]              |  [Featured Category Highlight]           |
| 🏡 My Garden           |  "Indoor Air Quality Plants - Start Here"|
|                        |                                          |
| [Admin]                |  [Plant Cards Grid]                      |
| (hidden)               |  ┌─────────────┐ ┌─────────────┐        |
|                        |  │ Kale        │ │ Tomato      │        |
|------------------------|  │ Brassicaceae│ │ Solanaceae  │        |
| Usage: Basic tier      |  │             │ │             │        |
| (Unlimited)            |  │ [Microbiome]│ │ [Microbiome]│        |
|                        |  │ • Endophytes│ │ • Beneficial│        |
|                        |  │ • Companions│ │   microbes  │        |
|                        |  │ • Animals   │ │ • Pollinators│       |
|                        |  │             │ │             │        |
|                        |  │ [View] [AI] │ │ [View] [AI] │        |
|                        |  └─────────────┘ └─────────────┘        |
|                        |                                          |
|                        |  [More plant cards...]                   |
|                        |                                          |
|                        |  [Click plant card → Detail page]        |
|                        |                                          |
|                        |  [Free Tier: Paywall overlay]            |
+------------------------+------------------------------------------+


+------------------------------------------------------------------+
| PROTECTED: Plant Detail  `/plants/[plantId]`                     |
+------------------------------------------------------------------+
| Sidebar                |  Plant Profile: Kale (Brassicaceae)      |
|------------------------|------------------------------------------|
| 💬 AI Coach            |  [Hero Image]                            |
| 📅 Planting Guide      |                                          |
| 🌱 Plant Database ✓    |  [Core Information]                      |
| 📰 Research Feed       |  • Family: Brassicaceae                  |
| 👤 Profile             |  • Difficulty: Beginner                  |
|                        |  • Climate adaptability: Wide range      |
| [Premium]              |  • Temperature preference: Cool season   |
| 🏡 My Garden           |  • Soil temp for planting: 4-30°C        |
|                        |  • Frost tolerance: Hardy to -10°C       |
| [Admin]                |                                          |
| (hidden)               |  [Growing Timing for YOUR Location]      |
|                        |  Based on your profile (City, Country):  |
|------------------------|  • Best time: Cool season (spring/fall   |
| Usage: Basic tier      |    in warm climates, summer in cool)     |
|                        |  • Current conditions: Ready to plant    |
|                        |                                          |
|                        |  [Plant-Microbiome Profile]              |
|                        |  • Beneficial microbes via endophytes    |
|                        |  • Optimal companions (4+ families)      |
|                        |  • Root-to-root communication role       |
|                        |  • Endophyte transfer mechanisms         |
|                        |  • Fermentation potential                |
|                        |  • Air filtration (ALL pollutants: PFAS, |
|                        |    chemicals, dust, pesticides)          |
|                        |                                          |
|                        |  [Animal & Ecosystem Context]            |
|                        |  • Beneficial animals attracted          |
|                        |  • Organic pest management               |
|                        |  • Pet context (dog-safe, chicken ok)    |
|                        |  • Wildlife benefits                     |
|                        |                                          |
|                        |  [Premium Features]                      |
|                        |  • Brix target ranges                    |
|                        |  • Heritage/landrace varieties           |
|                        |  • Quality sourcing guidance             |
|                        |  • Seed treatment (autoinducers kickstart|
|                        |    microbe connection - one-time use)    |
|                        |  • Foliar feed protocols                 |
|                        |                                          |
|                        |  [Basic Tier: Climate Education]         |
|                        |  • Understanding hardiness zones (US)    |
|                        |  • Global climate equivalents            |
|                        |  • Soil temp monitoring techniques       |
|                        |                                          |
|                        |  [Quick Actions]                         |
|                        |  [Ask AI Coach] [Add to My Garden]       |
|                        |                                          |
|                        |  [Admin: Quick edit button for corrections]
+------------------------+------------------------------------------+


+------------------------------------------------------------------+
| PROTECTED: Research Feed  `/research`                            |
+------------------------------------------------------------------+
| Sidebar                |  Scientific Research Feed                |
|------------------------|------------------------------------------|
| 💬 AI Coach            |  [Filter Controls]                       |
| 📅 Planting Guide      |  Gut health | Soil microbiome |          |
| 🌱 Plant Database      |  Fermentation | Plant-microbe |          |
| 📰 Research Feed ✓     |  Beneficial animals | More filters...    |
| 👤 Profile             |                                          |
|                        |  [Research Article Cards]                |
| [Premium]              |  ┌────────────────────────────────────┐ |
| 🏡 My Garden           |  │ [PINNED] Study: Growing methods    │ |
|                        |  │ affect microbiome transfer         │ |
| [Admin]                |  │                                    │ |
| (hidden)               |  │ Source: Journal of Soil Science    │ |
|                        |  │ Date: January 2026                 │ |
|------------------------|  │                                    │ |
| Usage: 3/5 articles    |  │ [Summary] Why this matters for     │ |
| (Free tier)            |  │ your garden...                     │ |
|                        |  │                                    │ |
|                        |  │ [Read Full Article] [Bookmark]     │ |
|                        |  └────────────────────────────────────┘ |
|                        |                                          |
|                        |  ┌────────────────────────────────────┐ |
|                        |  │ Study: Endophytes in heritage seeds│ |
|                        |  │ [Summary and actions...]           │ |
|                        |  └────────────────────────────────────┘ |
|                        |                                          |
|                        |  [More research cards...]                |
|                        |                                          |
|                        |  [Premium: Advanced filters, bookmarks]  |
|                        |  [Free Tier: Paywall after 3-5 articles] |
+------------------------+------------------------------------------+


+------------------------------------------------------------------+
| PROTECTED: Profile  `/profile`                                   |
+------------------------------------------------------------------+
| Sidebar                |  Your Profile                            |
|------------------------|------------------------------------------|
| 💬 AI Coach            |  [Tabs: Account | Growing Profile |      |
| 📅 Planting Guide      |         Subscription]                    |
| 🌱 Plant Database      |                                          |
| 📰 Research Feed       |  --- ACCOUNT TAB ---                     |
| 👤 Profile ✓           |  [Email field]                           |
|                        |  [Name field]                            |
| [Premium]              |  [Member since date]                     |
| 🏡 My Garden           |  [Security settings button]              |
|                        |                                          |
| [Admin]                |  --- GROWING PROFILE TAB ---             |
| (hidden)               |  • Location: [City, Country]             |
|                        |  • Hemisphere: Northern/Southern         |
|------------------------|  • Current season: Late Winter           |
| [Current tier display] |  • Climate type: Temperate maritime      |
| Implementation         |  • Average frost dates: [User inputs]    |
| (Basic)                |  • Soil type: Clay/Sandy/Loam            |
|                        |  • Space: Small yard                     |
|                        |  • Constraints: HOA restrictions         |
|                        |  • Pets: Dogs (microbe transfer!)        |
|                        |  • Health goals: Anxiety, immunity       |
|                        |  • Experience: Beginner                  |
|                        |  • Learning style: Visual learner        |
|                        |                                          |
|                        |  [Optional: Hardiness Zone (US only)]    |
|                        |  Zone: [Leave blank or enter if known]   |
|                        |                                          |
|                        |  [Re-take Assessment button]             |
|                        |                                          |
|                        |  --- SUBSCRIPTION TAB ---                |
|                        |  Current Tier: Implementation (Basic)    |
|                        |                                          |
|                        |  [Feature Breakdown by Tier]             |
|                        |  Discovery | Implementation | Mastery    |
|                        |                                          |
|                        |  [Usage Analytics]                       |
|                        |  AI queries: Unlimited                   |
|                        |  Research reads: Unlimited               |
|                        |  Days active: 23                         |
|                        |                                          |
|                        |  [Upgrade to Premium CTA]                |
|                        |  "Unlock advanced climate mastery..."    |
|                        |                                          |
|                        |  [Manage Payment Methods]                |
|                        |  [View Invoices] [Cancel Subscription]   |
+------------------------+------------------------------------------+


+------------------------------------------------------------------+
| PROTECTED: My Garden  `/garden` (PREMIUM ONLY)                   |
+------------------------------------------------------------------+
| Sidebar                |  My Garden Tracker                       |
|------------------------|------------------------------------------|
| 💬 AI Coach            |  [Tabs: Activity Log | Validation |      |
| 📅 Planting Guide      |         Progress | Fermentation]          |
| 🌱 Plant Database      |                                          |
| 📰 Research Feed       |  --- ACTIVITY LOG TAB ---                |
| 👤 Profile             |  [Add New Activity button]               |
|                        |                                          |
| [Premium]              |  [Recent Activities Timeline]            |
| 🏡 My Garden ✓         |  ┌────────────────────────────────────┐ |
|                        |  │ Jan 15: Planted kale (Brassicaceae)│ |
| [Admin]                |  │ Location: Bed 1                    │ |
| (hidden)               |  │ [Photo] [Notes]                    │ |
|                        |  └────────────────────────────────────┘ |
|------------------------|                                          |
| Premium tier           |  ┌────────────────────────────────────┐ |
|                        |  │ Jan 10: Applied autoinducers       │ |
|                        |  │ (seed treatment - kickstart)       │ |
|                        |  │ Plant combo: 3 families            │ |
|                        |  └────────────────────────────────────┘ |
|                        |                                          |
|                        |  --- VALIDATION TAB ---                  |
|                        |  [Plant Family Diversity Score: 5/6]     |
|                        |  [Microbiome Score: 82/100]              |
|                        |                                          |
|                        |  [Brix Tracking Chart]                   |
|                        |  [Graph showing readings over time]      |
|                        |  Achievement: Optimal/Good/Needs work    |
|                        |                                          |
|                        |  [Beneficial Animals Observed]           |
|                        |  • Pollinators: 12 species               |
|                        |  • Predatory insects: 5 species          |
|                        |                                          |
|                        |  --- PROGRESS TAB ---                    |
|                        |  [Photo Gallery with timestamps]         |
|                        |  [Seasonal Review Notes]                 |
|                        |  [Export Journal button]                 |
+------------------------+------------------------------------------+


+------------------------------------------------------------------+
| ADMIN: Analytics  `/admin/analytics`                             |
+------------------------------------------------------------------+
| Sidebar                |  Admin Analytics Dashboard               |
|------------------------|------------------------------------------|
| [Core Features]        |  [Date Range Selector: Last 30 days]     |
| (collapsed/hidden)     |                                          |
|                        |  [KPI Tiles Row]                         |
| [Premium]              |  ┌────────┐ ┌────────┐ ┌────────┐      |
| (collapsed/hidden)     |  │  MRR   │ │Free→Bsc│ │Bsc→Prem│      |
|                        |  │ $12.4k │ │  8.2%  │ │  18.5% │      |
| [Admin] ✓              |  └────────┘ └────────┘ └────────┘      |
| 📊 Analytics (active)  |                                          |
| 📚 Research Mgmt       |  [Subscription & Revenue Metrics]        |
| 👥 Users               |  • Churn rate by tier                    |
| 📝 Content             |  • LTV by cohort                         |
|                        |  • ARPU trends                           |
|------------------------|                                          |
| Admin role             |  [User Engagement Metrics]               |
|                        |  • DAU/MAU ratio                         |
|                        |  • AI coach usage patterns               |
|                        |  • Feature adoption rates                |
|                        |                                          |
|                        |  [Free Tier Conversion Intelligence]     |
|                        |  ┌────────────────────────────────────┐ |
|                        |  │ Top Converting Health Goals:       │ |
|                        |  │ 1. Children's health (12% conv)    │ |
|                        |  │ 2. Anxiety (9.5% conv)             │ |
|                        |  │ 3. Immunity (8.1% conv)            │ |
|                        |  └────────────────────────────────────┘ |
|                        |                                          |
|                        |  [Research topics driving upgrades]      |
|                        |  [AI questions before upgrade themes]    |
|                        |  [A/B test results]                      |
|                        |                                          |
|                        |  [Gap Identification]                    |
|                        |  • Questions AI couldn't answer well     |
|                        |  • Feature requests tracking             |
|                        |  • Content engagement patterns           |
|                        |                                          |
|                        |  [Export Reports button]                 |
+------------------------+------------------------------------------+


+------------------------------------------------------------------+
| ADMIN: Research Management  `/admin/research`                    |
+------------------------------------------------------------------+
| Sidebar                |  Research Feed Management                |
|------------------------|------------------------------------------|
| [Core Features]        |  [Filter: All | Pending Review |         |
| (collapsed)            |          Published | Hidden]             |
|                        |                                          |
| [Premium]              |  [Automated Import Queue]                |
| (collapsed)            |  ┌────────────────────────────────────┐ |
|                        |  │ NEW: Study on soil fungal networks │ |
| [Admin] ✓              |  │ Source: PubMed                     │ |
| 📊 Analytics           |  │ Date: Jan 28, 2026                 │ |
| 📚 Research Mgmt ✓     |  │                                    │ |
| 👥 Users               |  │ [Preview] [Publish] [Edit] [Remove]│ |
| 📝 Content             |  └────────────────────────────────────┘ |
|                        |                                          |
|------------------------|  [Published Articles List]               |
| Admin role             |  ┌────────────────────────────────────┐ |
|                        |  │ [PINNED] Growing methods study     │ |
|                        |  │ Reads: 234 | Bookmarks: 45         │ |
|                        |  │ Tags: gut-health, soil-microbiome  │ |
|                        |  │                                    │ |
|                        |  │ [Edit Tags] [Unpin] [Set Tier]     │ |
|                        |  └────────────────────────────────────┘ |
|                        |                                          |
|                        |  [More articles...]                      |
|                        |                                          |
|                        |  [Add Manual Article button]             |
|                        |                                          |
|                        |  [Engagement Insights Panel]             |
|                        |  • Most-read articles by tier            |
|                        |  • Topic preferences by segment          |
|                        |  • Articles cited by AI coach            |
|                        |                                          |
|                        |  [Manage Scraping Sources button]        |
+------------------------+------------------------------------------+


+------------------------------------------------------------------+
| ADMIN: Users  `/admin/users`                                     |
+------------------------------------------------------------------+
| Sidebar                |  User Management                         |
|------------------------|------------------------------------------|
| [Core Features]        |  [Search: Email, Name]                   |
| (collapsed)            |                                          |
|                        |  [Filters: All Users | Free | Basic |    |
| [Premium]              |          Premium | Active | Churned]     |
| (collapsed)            |                                          |
|                        |  [User List Table]                       |
| [Admin] ✓              |  ┌───────────────────────────────────┐  |
| 📊 Analytics           |  │ Email         │ Tier  │ Status │...│  |
| 📚 Research Mgmt       |  ├───────────────────────────────────┤  |
| 👥 Users ✓             |  │user@email.com │ Basic │ Active │...│  |
| 📝 Content             |  │               │       │        │   │  |
|                        |  │[View Details] [Activity] [Support] │  |
|------------------------|  └───────────────────────────────────┘  |
| Admin role             |                                          |
|                        |  [Click user → Detail View]              |
|                        |                                          |
|                        |  --- USER DETAIL VIEW ---                |
|                        |  [User Profile Info]                     |
|                        |  • Name, email, member since             |
|                        |  • Growing profile data                  |
|                        |  • Assessment responses                  |
|                        |  • Growing Discovery Path Report         |
|                        |                                          |
|                        |  [Usage Stats]                           |
|                        |  • AI queries, research reads, logins    |
|                        |                                          |
|                        |  [Subscription Management]               |
|                        |  • Current tier, payment status          |
|                        |  • Manual adjustments (comps, refunds)   |
|                        |  • Subscription history                  |
|                        |                                          |
|                        |  [Support Tools]                         |
|                        |  • Activity logs                         |
|                        |  • Support notes                         |
|                        |  • Impersonate user button               |
|                        |                                          |
|                        |  [Pattern Analysis]                      |
|                        |  • Engagement patterns                   |
|                        |  • Success/churn indicators              |
+------------------------+------------------------------------------+


+------------------------------------------------------------------+
| ADMIN: Content Management  `/admin/content`                      |
+------------------------------------------------------------------+
| Sidebar                |  Knowledge Base Management               |
|------------------------|  **CRITICAL: Easy correction system**    |
| [Core Features]        |                                          |
| (collapsed)            |  [Quick Search: Find content to correct] |
|                        |                                          |
| [Premium]              |  [Recent User Questions Needing Review]  |
| (collapsed)            |  ┌────────────────────────────────────┐ |
|                        |  │ 🔴 User asked about autoinducers   │ |
| [Admin] ✓              |  │    AI response may need correction  │ |
| 📊 Analytics           |  │ [Review & Edit Knowledge Base]      │ |
| 📚 Research Mgmt       |  └────────────────────────────────────┘ |
| 👥 Users               |                                          |
| 📝 Content ✓           |  [Knowledge Modules Tree]                |
|                        |  ┌────────────────────────────────────┐ |
|------------------------|  │ ▼ Core Principles                  │ |
| Admin role             |  │   • 4+ plant families (min 4, more │ |
|                        |  │     is better) [Edit]              │ |
|                        |  │   • Root-to-root communication     │ |
|                        |  │   • Endophytes [Edit]              │ |
|                        |  │                                    │ |
|                        |  │ ▼ Seed Treatment                   │ |
|                        |  │   • Autoinducers (seed treatment   │ |
|                        |  │     only - kickstart process) [Edit]│
|                        |  │                                    │ |
|                        |  │ ▼ Air Filtration                   │ |
|                        |  │   • ALL pollutants (PFAS, chemicals│ |
|                        |  │     dust, pesticides) [Edit]       │ |
|                        |  │                                    │ |
|                        |  │ ▼ Climate-Responsive Growing       │ |
|                        |  │   • Soil temp based (no rigid dates│ |
|                        |  │     calendar) [Edit]               │ |
|                        |  │                                    │ |
|                        |  │ ▼ Plant Families                   │ |
|                        |  │ ▼ Animal Integration               │ |
|                        |  │ ▼ Design Systems                   │ |
|                        |  │ ▼ Climate Strategies               │ |
|                        |  │                                    │ |
|                        |  │ [+ Add New Module]                 │ |
|                        |  └────────────────────────────────────┘ |
|                        |                                          |
|                        |  [Selected Module View]                  |
|                        |  Module: Autoinducers                    |
|                        |                                          |
|                        |  [Upload Documents button]               |
|                        |  [Add Text Content button]               |
|                        |                                          |
|                        |  [Content Items in Module]               |
|                        |  ┌────────────────────────────────────┐ |
|                        |  │ Document: Autoinducer protocols    │ |
|                        |  │ Tags: seed-treatment, kickstart    │ |
|                        |  │ [Edit] [Preview AI Use] [Archive]  │ |
|                        |  └────────────────────────────────────┘ |
|                        |                                          |
|                        |  [Inline Editing - Click any content]    |
|                        |  [Preview changes immediately]           |
|                        |  [Publish updates without code deploy]   |
|                        |                                          |
|                        |  [Quality Control Tools]                 |
|                        |  • Preview AI responses with new content |
|                        |  • Edit/improve based on usage           |
|                        |  • Version control (track corrections)   |
|                        |  • Rollback if needed                    |
|                        |                                          |
|                        |  [AI Response Testing]                   |
|                        |  • Test questions with updated content   |
|                        |  • See how AI uses corrected info        |
+------------------------+------------------------------------------+


+------------------------------------------------------------------+
| PUBLIC: Legal Pages  `/privacy`, `/terms`, `/cookies`           |
+------------------------------------------------------------------+
|  [Simple Header: Logo, Login, Sign Up]                           |
|------------------------------------------------------------------|
|  [Page Title: Privacy Policy / Terms of Service / Cookies]       |
|                                                                  |
|  [Legal Content]                                                 |
|  • Privacy: GDPR compliance, health data handling                |
|  • Terms: Health coaching disclaimers, FDA disclaimers           |
|  • Cookies: Tracking compliance                                  |
|                                                                  |
|  [Educational disclaimers throughout]                            |
|------------------------------------------------------------------|
|  [Footer]                                                        |
+------------------------------------------------------------------+
```

## Navigation Flow Map

```
PUBLIC FLOW (Unauthenticated)
Landing (/) → Sign Up (/auth/sign-up with Assessment) → Email Verification (/auth/confirm) → Dashboard (/coach)
           ||
           └→ Login (/auth/login) → Dashboard (/coach)
           ||
           └→ Forgot Password (/auth/forgot-password) → Email → Update Password (/auth/update-password) → Login
           ||
           └→ Legal Pages: /privacy, /terms, /cookies

AUTHENTICATED APP FLOW (Protected Routes)
/coach (new conversation) → AI Chat Interface
     ||
     └→ /coach/[conversationId] (resume conversation)

/planting-guide → Climate-responsive planting recommendations (tier-gated content)
                → Plant Family detail cards
                → Climate education section (Basic tier)

/plants → Plant Database Browser
       → Filter by: Family | Health Goal | Space | Climate | Animals | Pet Safety
       → Featured: Indoor Air Quality Plants
       → /plants/[plantId] (Plant Detail Page)
                          → "Ask AI Coach about this plant" → /coach
                          → "Add to My Garden" (Premium) → /garden

/research → Research Feed
         → Filter by: Topics (expandable tag system)
         → Article detail view
         → Bookmark article (Premium)
         → Tier-gated access (Free: 3-5 articles, Basic/Premium: unlimited)

/profile → [Tabs: Account | Growing Profile | Subscription]
        → Account: Email, password, security
        → Growing Profile: Location, hemisphere, climate, space, health goals, pets
                        → Re-take Assessment
        → Subscription: Current tier display
                      → Feature comparison
                      → Usage analytics
                      → Upgrade to Basic/Premium (Stripe Checkout)
                      → Manage payment (Stripe Customer Portal)
                      → View invoices
                      → Cancel subscription

/garden (PREMIUM ONLY) → [Tabs: Activity Log | Validation | Progress | Fermentation]
                       → Activity Log: Add/view growing activities
                       → Validation: Plant family diversity score
                                   → Microbiome score
                                   → Brix tracking chart
                                   → Beneficial animals observed
                       → Progress: Photo gallery, seasonal reviews
                       → Export journal

ADMIN FLOW (Role-gated + Authenticated)
/admin/analytics → Subscription & revenue metrics (MRR, conversion rates, churn)
                → User engagement metrics (DAU/MAU, feature adoption)
                → Free tier conversion intelligence (health goals, topics, questions)
                → Gap identification (unanswered questions, feature requests)
                → Export reports

/admin/research → Automated import queue (review/publish/edit/remove)
               → Published articles list
               → Pin/unpin articles
               → Edit tags and metadata
               → Set tier access (free/basic/premium)
               → Engagement insights
               → Manage scraping sources
               → Add manual articles

/admin/users → User list with search/filters
            → Filter by: Tier | Activity | Signup date | Location | Health goals
            → /admin/users/[userId] (User Detail)
                                  → View profile, assessment, Discovery Path Report
                                  → Usage stats and activity logs
                                  → Subscription management (manual adjustments)
                                  → Support notes
                                  → Impersonate user
                                  → Pattern analysis

/admin/content → Knowledge modules tree (expandable categories)
              → Core Principles (4+ families, endophytes, etc.)
              → Seed Treatment (autoinducers kickstart)
              → Air Filtration (ALL pollutants)
              → Climate-Responsive Growing (condition-based, not dates)
              → [All other modules...]
              → Add new module
              → Click any content → Inline edit
              → Upload documents to modules
              → Tag content for AI retrieval
              → Preview AI responses with new content
              → Version history (track corrections, rollback)
              → AI response testing

CROSS-CUTTING FLOWS
Any page → Admin "Report incorrect info" button (visible to admins) → /admin/content quick edit
Tier limits → Upgrade prompts → /profile (Subscription tab) → Stripe Checkout
AI Coach → Plant mention → "View in database" → /plants/[plantId]
Research articles → Related plants → /plants/[plantId]
```

## Technical Notes

### Global Architecture
- **No zone-locking**: Climate guidance based on actual conditions (soil temp, frost risk, weather trends), not hardiness zones
- **Hemisphere-aware**: System detects Northern/Southern hemisphere and adapts seasonal recommendations
- **Location-based**: Uses City/Country, not US-specific zones
- **Climate education**: Hardiness zones moved to optional educational reference in Basic tier

### Key Corrections
- **Air filtration**: ALL pollutants (PFAS, chemicals, dust, pesticides) - indoor and outdoor
- **Autoinducers**: Seed treatment only - kickstart microbe connection process
- **Plant families**: Minimum 4 families, more is better (not rigid 4-6 range)
- **Planting timing**: Condition-based, not rigid calendar dates
- **Admin flexibility**: Easy inline correction system without code deployment

### Content Management Priority
- Quick search to find content needing correction
- Inline editing with immediate preview
- Version history for tracking all corrections
- AI response testing after updates
- No code deployment needed for knowledge base changes
