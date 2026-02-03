# Task: Build How It Works Section for MicrobiomeGardener.ai

## 1. Task Overview

**Title:** Build Brief How It Works Section

**Goal:** Create simple 3-step process overview showing what happens after signup to reassure visitors and reinforce their decision.

---

## 2. Strategic Analysis & Solution Options

**✅ SKIP STRATEGIC ANALYSIS** - Content and layout approved. Simple numbered steps implementation.

---

## 3. Project Analysis & Current State

### Technology & Architecture
- **Framework:** Next.js 15.5.9 with App Router  
- **Component:** `components/landing/HowItWorksSection.tsx`
- **Theme:** Forest Green with secondary background
- **UI Pattern:** Numbered step cards

### Current State

**Current HowItWorksSection.tsx:**
- Empty placeholder component (created in Task 001)
- Returns `<div></div>`

**Approved Content:**
- 3 steps: Assessment → Plan → Growing
- Numbered badges with Lucide icons
- Brief, reassuring descriptions

---

## 4. Implementation Plan

### Component Structure

1. **Section Header:** Headline centered
2. **Steps Grid:** 3 cards in responsive grid
3. **Each Card:** Numbered badge + Icon + Headline + Description
4. **Layout:** `grid-cols-1 md:grid-cols-3`

### Content Implementation

**Step 1 - Complete Your Assessment:**
- Number: 1
- Icon: ClipboardCheck
- Description: "Tell us about your climate, space, and health goals"

**Step 2 - Get Your Personalized Plan:**
- Number: 2
- Icon: FileText
- Description: "Receive growing recommendations optimized for microbial function in your reality"

**Step 3 - Start Growing with Guidance:**
- Number: 3
- Icon: Sprout
- Description: "Access your guide anytime for adaptive support through changing conditions"

---

## 5. Code Implementation

### File: components/landing/HowItWorksSection.tsx

**Replace placeholder with:**

```tsx
import { ClipboardCheck, FileText, Sprout } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      number: 1,
      icon: ClipboardCheck,
      title: "Complete Your Assessment",
      description: "Tell us about your climate, space, and health goals",
    },
    {
      number: 2,
      icon: FileText,
      title: "Get Your Personalized Plan",
      description: "Receive growing recommendations optimized for microbial function in your reality",
    },
    {
      number: 3,
      icon: Sprout,
      title: "Start Growing with Guidance",
      description: "Access your guide anytime for adaptive support through changing conditions",
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            How It Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative flex flex-col items-center text-center p-6 bg-card border border-border rounded-lg"
            >
              {/* Number Badge */}
              <div className="absolute -top-4 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                {step.number}
              </div>
              
              {/* Icon */}
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mt-2">
                <step.icon className="w-6 h-6 text-primary" strokeWidth={2.5} />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
```

---

## 6. Validation & Testing

**Static Validation:**
```bash
npm run lint
npm run type-check
```

**Visual Testing:**
- Verify 3 steps display with numbered badges
- Check responsive grid
- Verify icons and colors
- Test both theme modes

---

## 7. Success Criteria

- [ ] 3 steps display clearly with numbered progression
- [ ] Numbered badges positioned correctly above cards
- [ ] Icons use Forest Green primary color
- [ ] Responsive grid (1 col mobile, 3 col desktop)
- [ ] Brief, reassuring content
- [ ] Theme works in light and dark modes
- [ ] No linting errors
- [ ] No type errors
- [ ] Clear visual progression through steps
