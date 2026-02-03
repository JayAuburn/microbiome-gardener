# Task: Build Pricing Section for MicrobiomeGardener.ai

## 1. Task Overview

**Title:** Build Pricing Section with Education vs Implementation Split

**Goal:** Create 2-tier pricing cards showing Basic $47 (Education/Understanding) vs Premium $127 (Implementation/Responsibility Transfer) with clear value differentiation that drives Premium conversion.

---

## 2. Strategic Analysis & Solution Options

**✅ SKIP STRATEGIC ANALYSIS** - Pricing tiers, amounts, and positioning approved through strategic business planning discussions. Implementation is straightforward.

**Key Framework:** 
- Basic = Understanding (learn what's wrong, get recommendations, manage yourself)
- Premium = Responsibility Transfer (expert oversight, active management, validation)

---

## 3. Project Analysis & Current State

### Technology & Architecture
- **Framework:** Next.js 15.5.9 with App Router
- **Component:** `components/landing/PricingSection.tsx`
- **Theme:** Forest Green
- **UI Pattern:** Side-by-side pricing cards

### Current State

**Current PricingSection.tsx:**
- Generic tier names and pricing
- RAG-focused features
- Needs complete content replacement

**Approved Pricing:**
- **Basic:** $47/month (Education tier)
- **Premium:** $127/month (Implementation tier, highlighted as "Most Popular")

---

## 4. Implementation Plan

### Component Structure

1. **Section Header:** Headline + subhead centered
2. **Pricing Cards:** 2 cards side-by-side
3. **Premium Highlight:** Border and badge emphasis
4. **Feature Lists:** Checkmark icons with clear benefit statements
5. **CTAs:** Clear signup buttons for each tier

### Visual Design

- **Background:** `bg-secondary/30` for visual separation
- **Premium Card:** `border-primary border-2` highlight + "Most Popular" badge
- **Layout:** `grid-cols-1 md:grid-cols-2` for pricing cards

---

## 5. Code Implementation

### File: components/landing/PricingSection.tsx

**Replace entire component with:**

```tsx
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Choose Your Plan
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start your transformation with personalized growing guidance
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Basic Tier */}
          <div className="bg-card border border-border rounded-lg p-8">
            <h3 className="text-2xl font-bold text-foreground mb-2">Basic</h3>
            <p className="text-muted-foreground mb-4">Understand Your Path</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-foreground">$47</span>
              <span className="text-muted-foreground">/month</span>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" strokeWidth={2} />
                <span className="text-sm text-foreground">Personalized growing assessment</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" strokeWidth={2} />
                <span className="text-sm text-foreground">Climate-specific plant recommendations</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" strokeWidth={2} />
                <span className="text-sm text-foreground">Access to guide when you ask</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" strokeWidth={2} />
                <span className="text-sm text-foreground">Plant family diversity guidance</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" strokeWidth={2} />
                <span className="text-sm text-foreground">Research library access</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" strokeWidth={2} />
                <span className="text-sm text-muted-foreground italic">You manage timing and tracking</span>
              </li>
            </ul>

            <Button
              asChild
              variant="outline"
              className="w-full"
            >
              <Link href="/auth/sign-up?tier=basic">
                Start with Basic
              </Link>
            </Button>
          </div>

          {/* Premium Tier */}
          <div className="relative bg-card border-2 border-primary rounded-lg p-8 shadow-lg">
            {/* Most Popular Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
              Most Popular
            </div>

            <h3 className="text-2xl font-bold text-foreground mb-2">Premium</h3>
            <p className="text-muted-foreground mb-4">We Manage It For You</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-foreground">$127</span>
              <span className="text-muted-foreground">/month</span>
            </div>

            <p className="text-sm font-semibold text-foreground mb-4">Everything in Basic PLUS:</p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" strokeWidth={2} />
                <span className="text-sm text-foreground"><strong>Weekly action prompts</strong> - "This week, plant these 3 things"</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" strokeWidth={2} />
                <span className="text-sm text-foreground"><strong>Seasonal timing management</strong> - Never miss optimal windows</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" strokeWidth={2} />
                <span className="text-sm text-foreground"><strong>Progress validation</strong> - Brix tracking confirms it's working</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" strokeWidth={2} />
                <span className="text-sm text-foreground"><strong>Drift prevention</strong> - "You're on track, don't change"</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" strokeWidth={2} />
                <span className="text-sm text-foreground"><strong>Adaptive prioritization</strong> - Best next action for YOUR constraints</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" strokeWidth={2} />
                <span className="text-sm text-foreground"><strong>Expert oversight</strong> - 50 years navigating real conditions</span>
              </li>
            </ul>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
              <p className="text-sm text-foreground italic text-center">
                "Stop wondering if you're doing it right—we manage the timing and validate the results"
              </p>
            </div>

            <Button
              asChild
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Link href="/auth/sign-up?tier=premium">
                Start with Premium
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
```

---

## 6. Validation & Testing

**Static Validation:**
```bash
npm run lint
npm run type-check
```

**Visual Testing:**
- Verify 2 cards display side-by-side on desktop
- Check "Most Popular" badge on Premium
- Verify Premium border highlight
- Check responsive stacking on mobile
- Test CTA buttons link correctly with tier parameter

---

## 7. Success Criteria

- [ ] 2 pricing cards display correctly
- [ ] Premium card highlighted with border and badge
- [ ] Clear feature differentiation (Basic vs Premium)
- [ ] Premium relief statement included and emphasized
- [ ] Prices display correctly ($47 and $127)
- [ ] CTAs link to signup with tier parameter
- [ ] Responsive layout (stack on mobile)
- [ ] Theme works in light and dark modes
- [ ] No linting errors
- [ ] No type errors
- [ ] Premium positioning feels compelling
