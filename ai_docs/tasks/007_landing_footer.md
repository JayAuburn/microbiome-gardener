# Task: Update Footer Section for MicrobiomeGardener.ai

## 1. Task Overview

**Title:** Update Footer with MicrobiomeGardener.ai Branding

**Goal:** Update footer component with correct app name, tagline, and essential links for microbiome gardening platform.

---

## 2. Strategic Analysis & Solution Options

**✅ SKIP STRATEGIC ANALYSIS** - Straightforward footer update with approved structure and content.

---

## 3. Project Analysis & Current State

### Technology & Architecture
- **Framework:** Next.js 15.5.9 with App Router
- **Component:** `components/landing/Footer.tsx`
- **Theme:** Forest Green with muted background
- **UI Pattern:** Multi-column footer

### Current State

**Current Footer.tsx:**
- May have RAGI branding
- Generic links
- Needs content update for MicrobiomeGardener.ai

**Approved Structure:**
- 4 columns: Brand, Product, Legal, Connect
- App name and tagline
- Essential links only
- Professional design

---

## 4. Implementation Plan

### Component Structure

**Column 1 - Brand:**
- Logo + App name
- Tagline: "Personalized growing guidance for microbiome health"

**Column 2 - Product:**
- How It Works
- Pricing  
- Features

**Column 3 - Legal:**
- Privacy Policy
- Terms of Service
- Contact

**Column 4 - Connect:**
- Email: support@microbiomegardener.ai
- (Social icons optional)

**Bottom Bar:**
- Copyright: "© 2026 MicrobiomeGardener.ai. All rights reserved."

### Visual Design

- **Background:** `bg-muted` or `bg-secondary/50`
- **Border Top:** `border-t border-border`
- **Grid:** `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
- **Link Styling:** `text-muted-foreground hover:text-primary`

---

## 5. Code Implementation

### File: components/landing/Footer.tsx

**Update or create footer with:**

```tsx
import Link from "next/link";
import Logo from "../Logo";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Logo className="mb-4" />
            <p className="text-sm text-muted-foreground">
              Personalized growing guidance for microbiome health
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Connect</h3>
            <p className="text-sm text-muted-foreground">
              support@microbiomegardener.ai
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 MicrobiomeGardener.ai. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
```

---

## 6. Validation & Testing

**Static Validation:**
```bash
npm run lint
npm run type-check
```

**Visual Testing:**
- Verify 4 columns display correctly
- Check column stacking on mobile
- Verify all links navigate correctly
- Test both theme modes

---

## 7. Success Criteria

- [ ] Logo and tagline display correctly
- [ ] 4 columns with correct links
- [ ] All anchor links work (Features, How It Works, Pricing)
- [ ] Legal page links included
- [ ] Contact email displayed
- [ ] Copyright shows 2026 MicrobiomeGardener.ai
- [ ] Responsive column stacking works
- [ ] Link hover effects work (to primary color)
- [ ] Theme works in light and dark modes
- [ ] No linting errors
- [ ] No type errors
