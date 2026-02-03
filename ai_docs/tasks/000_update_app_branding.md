# Task: Update App Branding for MicrobiomeGardener.ai

## 1. Task Overview

**Title:** Update App Branding (Navbar, Logo) for MicrobiomeGardener.ai

**Goal:** Transform RAGI template branding to MicrobiomeGardener.ai with proper theme CSS variable usage in navbar. Metadata is already updated correctly.

---

## 2. Strategic Analysis & Solution Options

**✅ SKIP STRATEGIC ANALYSIS** - Straightforward branding update with clear implementation path specified by user.

---

## 3. Project Analysis & Current State

### Technology & Architecture
- **Frameworks:** Next.js 15.5.9, React 19
- **Language:** TypeScript with strict mode
- **UI & Styling:** shadcn/ui components with Tailwind CSS
- **Theme:** Forest Green (142° 71% 45%) CSS variables in `globals.css`
- **Key Components:** Navbar, Logo, Footer

### Current State

**Files to Update:**
1. `components/Logo.tsx` - Still shows "RAGI"
2. `components/landing/Navbar.tsx` - Has hardcoded theme colors
3. `lib/metadata.ts` - ✅ Already updated to MicrobiomeGardener.ai

**Current Issues:**
- Logo text shows "RAGI" instead of "MicrobiomeGardener.ai"
- Navbar uses hardcoded `bg-white/80 dark:bg-gray-900/80` instead of CSS variables
- Navbar uses hardcoded `border-gray-200 dark:border-gray-700` instead of `border-border`

---

## 4. Implementation Plan

### Step 1: Update Logo Component

**File:** `components/Logo.tsx`

**Current Code:**
```tsx
<span className="hidden sm:block text-2xl font-bold text-primary">
  RAGI
</span>
```

**Updated Code:**
```tsx
<span className="hidden sm:block text-2xl font-bold text-primary">
  MicrobiomeGardener.ai
</span>
```

**Also update:**
- Alt text: "RAGI Logo" → "MicrobiomeGardener.ai Logo"

### Step 2: Fix Navbar Theme Compliance

**File:** `components/landing/Navbar.tsx`

**Current Code:**
```tsx
<nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
```

**Updated Code:**
```tsx
<nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
```

**Changes:**
- Replace `bg-white/80 dark:bg-gray-900/80` with `bg-background/80`
- Replace `border-gray-200 dark:border-gray-700` with `border-border`
- Maintains transparency and backdrop blur
- Now uses theme CSS variables for proper theme compliance

### Step 3: Update Navbar Links

**Current Links:**
- Features (keep)
- Pricing (keep)
- FAQ (remove - not in new landing page)

**Updated Links:**
- Features → `/#features`
- Pricing → `/#pricing`

### Step 4: Update CTA Button Text

**Current:** "Get Started Free"  
**Updated:** "Create Account" (matches premium positioning, no free tier)

---

## 5. Code Implementation

### File 1: components/Logo.tsx

**Changes:**
1. Line 19: `alt="RAGI Logo"` → `alt="MicrobiomeGardener.ai Logo"`
2. Line 26: `RAGI` → `MicrobiomeGardener.ai`

### File 2: components/landing/Navbar.tsx

**Changes:**
1. Line 9: Replace hardcoded theme colors with CSS variables
2. Lines 30-34: Remove FAQ link
3. Line 50: Update CTA text to "Create Account"

---

## 6. Validation & Testing

**Static Validation (Required):**
```bash
npm run lint
npm run type-check
```

**Visual Verification:**
- Check navbar in both light and dark modes
- Verify logo text shows "MicrobiomeGardener.ai"
- Verify navbar background uses theme colors correctly
- Verify links work (Features, Pricing)
- Verify CTA button says "Create Account"

---

## 7. Success Criteria

- [ ] Logo text updated to "MicrobiomeGardener.ai"
- [ ] Logo alt text updated
- [ ] Navbar uses `bg-background/80` instead of hardcoded colors
- [ ] Navbar uses `border-border` instead of hardcoded borders
- [ ] FAQ link removed from navbar
- [ ] CTA text updated to "Create Account"
- [ ] Theme works correctly in light and dark modes
- [ ] No linting errors: `npm run lint` passes
- [ ] No type errors: `npm run type-check` passes
- [ ] Navbar transparent background works with backdrop blur
- [ ] All links navigate correctly
