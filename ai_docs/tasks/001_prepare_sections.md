# Task: Prepare Landing Page Sections

## 1. Task Overview

**Title:** Prepare Landing Page Section Structure

**Goal:** Remove unwanted RAG template sections and update page.tsx with approved MicrobiomeGardener.ai section structure (Hero, Features, HowItWorks, Pricing, CTA).

---

## 2. Strategic Analysis & Solution Options

**✅ SKIP STRATEGIC ANALYSIS** - Straightforward section restructuring with approved section list from landing page planning.

---

## 3. Project Analysis & Current State

### Technology & Architecture
- **Framework:** Next.js 15.5.9 App Router
- **Landing Page:** `app/(public)/page.tsx`
- **Section Components:** `components/landing/` directory

### Current State

**Current Sections in page.tsx:**
- HeroSection ✅ (keep, will update)
- FeaturesSection ✅ (keep, will update)
- ProblemSection ❌ (remove - not needed for post-sale landing)
- RAGDemoSection ❌ (remove - not needed)
- PricingSection ✅ (keep, will update)
- FAQSection ❌ (remove - not in approved sections)
- CTASection ✅ (keep, will update)

**Approved Sections:**
- Hero, Features, HowItWorks (NEW), Pricing, CTA

---

## 4. Implementation Plan

### Step 1: Delete Unwanted Section Components

Delete these files:
- `components/landing/ProblemSection.tsx`
- `components/landing/RAGDemoSection.tsx`
- `components/landing/FAQSection.tsx`

### Step 2: Create HowItWorks Placeholder

Create `components/landing/HowItWorksSection.tsx`:

```tsx
export default function HowItWorksSection() {
  return <div></div>;
}
```

This placeholder will be populated in Task 004.

### Step 3: Update page.tsx

**Current Code:**
```tsx
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import ProblemSection from "@/components/landing/ProblemSection";
import RAGDemoSection from "@/components/landing/RAGDemoSection";
import PricingSection from "@/components/landing/PricingSection";
import FAQSection from "@/components/landing/FAQSection";
import CTASection from "@/components/landing/CTASection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <ProblemSection />
      <RAGDemoSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
```

**Updated Code:**
```tsx
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import PricingSection from "@/components/landing/PricingSection";
import CTASection from "@/components/landing/CTASection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <CTASection />
    </>
  );
}
```

---

## 5. Code Implementation

**Actions:**
1. Delete 3 section component files
2. Create 1 placeholder component file
3. Update page.tsx imports and JSX

---

## 6. Validation & Testing

**Static Validation (Required):**
```bash
npm run lint
npm run type-check
```

**Visual Verification:**
- Navigate to http://localhost:3000
- Verify page renders (empty sections are fine)
- Verify no console errors
- Verify removed sections are gone

---

## 7. Success Criteria

- [ ] ProblemSection.tsx file deleted
- [ ] RAGDemoSection.tsx file deleted
- [ ] FAQSection.tsx file deleted
- [ ] HowItWorksSection.tsx placeholder created (returns empty div)
- [ ] page.tsx imports updated (removed Problem, RAGDemo, FAQ; added HowItWorks)
- [ ] page.tsx section order correct: Hero → Features → HowItWorks → Pricing → CTA
- [ ] Page renders without errors
- [ ] No linting errors: `npm run lint` passes
- [ ] No type errors: `npm run type-check` passes
