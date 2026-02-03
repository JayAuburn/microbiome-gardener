# Task: Build Features Section for MicrobiomeGardener.ai

## 1. Task Overview

**Title:** Build Brief Features Section

**Goal:** Create 4-card feature overview that reinforces purchase decision with key benefits focused on personalization, microbial optimization, systems approach, and adaptive guidance.

---

## 2. Strategic Analysis & Solution Options

**✅ SKIP STRATEGIC ANALYSIS** - Content and layout approved in landing page planning. Simple icon card grid implementation.

---

## 3. Project Analysis & Current State

### Technology & Architecture
- **Framework:** Next.js 15.5.9 with App Router
- **Component:** `components/landing/FeaturesSection.tsx`
- **Theme:** Forest Green CSS variables
- **UI Pattern:** Icon card grid (4 cards)

### Current State

**Current FeaturesSection.tsx:**
- Generic RAG document processing features
- Multiple feature cards about file types, AI capabilities
- Needs complete content replacement

**Approved New Content:**
- 4 brief features (Personalized, Microbial-Optimized, Systems Approach, Adaptive)
- Lucide icons with Forest Green primary
- Scannable, minimal text

---

## 4. Implementation Plan

### Component Structure

1. **Section Header:** Headline centered
2. **Feature Grid:** 4 cards in responsive grid
3. **Each Card:** Icon + Short headline + Brief description
4. **Layout:** `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`

### Content Implementation

**Feature 1 - Personalized to Your Reality:**
- Icon: MapPin
- Description: "Climate, space, and experience-adapted guidance"

**Feature 2 - Microbial-Optimized Growing:**
- Icon: Sprout
- Description: "Every recommendation prioritizes microbial function—seed to soil to plant to microbiome to health"

**Feature 3 - Complete Systems Approach:**
- Icon: Network
- Description: "Whole-system perspective connecting soil microbes to your health and family"

**Feature 4 - Adaptive Expert Guidance:**
- Icon: Compass
- Description: "Navigate real-world constraints with experienced oversight"

---

## 5. Code Implementation

### File: components/landing/FeaturesSection.tsx

**Replace entire component with:**

```tsx
import { MapPin, Sprout, Network, Compass } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: MapPin,
      title: "Personalized to Your Reality",
      description: "Climate, space, and experience-adapted guidance",
    },
    {
      icon: Sprout,
      title: "Microbial-Optimized Growing",
      description: "Every recommendation prioritizes microbial function—seed to soil to plant to microbiome to health",
    },
    {
      icon: Network,
      title: "Complete Systems Approach",
      description: "Whole-system perspective connecting soil microbes to your health and family",
    },
    {
      icon: Compass,
      title: "Adaptive Expert Guidance",
      description: "Navigate real-world constraints with experienced oversight",
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            What You Get
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 bg-card border border-border rounded-lg hover:-translate-y-1 transition-transform duration-200"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" strokeWidth={2.5} />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
```

---

## 6. Validation & Testing

**Static Validation:**
```bash
npm run lint
npm run type-check
```

**Visual Testing:**
- Verify 4 features display correctly
- Check responsive grid (1 col mobile, 2 col tablet, 4 col desktop)
- Verify hover effects work smoothly
- Check both light and dark modes

---

## 7. Success Criteria

- [ ] 4 features display with correct icons and content
- [ ] Icons use Forest Green primary color
- [ ] Icon strokeWidth is 2.5
- [ ] Responsive grid works across all screen sizes
- [ ] Gentle hover lift effect works
- [ ] Theme colors work in light and dark modes
- [ ] Content is brief and scannable
- [ ] No linting errors
- [ ] No type errors
- [ ] Cards have proper spacing and alignment
