# Task: Build Hero Section for MicrobiomeGardener.ai

## 1. Task Overview

**Title:** Build Hero/Welcome Section for Post-Sale Landing Page

**Goal:** Create simple, professional hero section that confirms visitors are in the right place after sales page conversion and provides clear account creation CTA.

---

## 2. Strategic Analysis & Solution Options

**✅ SKIP STRATEGIC ANALYSIS** - Content and layout approved in landing page planning. Straightforward implementation.

---

## 3. Project Analysis & Current State

### Technology & Architecture
- **Framework:** Next.js 15.5.9 with App Router
- **Component:** `components/landing/HeroSection.tsx`
- **Theme:** Forest Green (142° 71% 45%) from `globals.css`
- **UI Pattern:** Text-centered hero with CTA

### Current State

**Current HeroSection.tsx:**
- Generic RAGI document upload hero
- "Chat with Your Documents Using RAGI" headline
- Document upload demo visuals
- "Start Uploading Documents" CTA

**Approved New Content:**
- **Headline:** "Welcome to MicrobiomeGardener.ai"
- **Subhead:** "Create your account to access your personalized guide and begin replacing the missing microbes in your gut"
- **CTA:** "Create Your Account"
- **Trust Badges:** "Personalized Guidance", "Science-Backed", "Adapts to Your Level"

---

## 4. Implementation Plan

### Component Structure

Replace entire HeroSection component with:

1. **Container:** `max-w-7xl mx-auto` outer, `max-w-4xl mx-auto text-center` inner
2. **Headline:** H1 with proper typography hierarchy
3. **Subhead:** Paragraph with muted foreground
4. **CTA Button:** Primary button linking to `/auth/sign-up`
5. **Trust Badges:** 3 badges with Lucide icons in horizontal row

### Visual Design

- **Background:** Subtle gradient `bg-gradient-to-b from-background to-secondary/30`
- **Padding:** `py-24 sm:py-32` for generous hero spacing
- **Typography:** Clean hierarchy (h1 → p → button → badges)
- **Icons:** Lucide icons (Shield, FlaskConical, Users) with `strokeWidth={2.5}`

---

## 5. Code Implementation

### File: components/landing/HeroSection.tsx

**Replace entire component with:**

```tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Shield, FlaskConical, Users } from "lucide-react";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-secondary/30">
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6">
            Welcome to MicrobiomeGardener.ai
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Create your account to access your personalized guide and begin 
            replacing the missing microbes in your gut
          </p>

          {/* CTA Button */}
          <div className="mb-12">
            <Button
              size="lg"
              asChild
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg"
            >
              <Link href="/auth/sign-up">
                Create Your Account
              </Link>
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" strokeWidth={2.5} />
              <span>Personalized Guidance</span>
            </div>
            <div className="flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-primary" strokeWidth={2.5} />
              <span>Science-Backed</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" strokeWidth={2.5} />
              <span>Adapts to Your Level</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
```

---

## 6. Validation & Testing

**Static Validation:**
```bash
npm run lint
npm run type-check
```

**Visual Testing:**
- Check both light and dark modes
- Verify responsive design (mobile, tablet, desktop)
- Verify CTA button links to `/auth/sign-up`
- Verify trust badges display correctly

---

## 7. Success Criteria

- [ ] Headline shows "Welcome to MicrobiomeGardener.ai"
- [ ] Subhead clearly explains what happens after account creation
- [ ] CTA button links to signup page
- [ ] Three trust badges display with proper icons
- [ ] Clean centered layout with proper spacing
- [ ] Responsive design works on all screen sizes
- [ ] Theme colors work in both light and dark modes
- [ ] No linting errors
- [ ] No type errors
- [ ] Professional, welcoming appearance
