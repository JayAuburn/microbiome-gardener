import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Choose Your Plan
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-2">
            Select the level of support that fits how much responsibility you want to carry.
          </p>
          <p className="text-sm text-primary font-semibold">
            🎉 Founding Member Pricing — Lock in your rate permanently
          </p>
        </div>

        {/* Three-Tier Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Basic Tier */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-xl font-bold text-foreground mb-1">Basic</h3>
            <p className="text-sm text-muted-foreground mb-4">Understand Your Path</p>
            
            <div className="mb-4">
              <div className="flex items-baseline gap-2">
                <span className="text-lg text-muted-foreground line-through">$67</span>
                <span className="text-3xl font-bold text-foreground">$47</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-xs text-primary mt-1">Save $240/year</p>
            </div>

            <p className="text-xs font-semibold text-muted-foreground mb-3">Best for: Apartments, small spaces</p>

            <ul className="space-y-2 mb-6 min-h-[280px]">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" strokeWidth={2} />
                <span className="text-xs text-foreground">Personalized growing protocols</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" strokeWidth={2} />
                <span className="text-xs text-foreground">Buying guidance (food quality context)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" strokeWidth={2} />
                <span className="text-xs text-foreground">Environmental protection guidance</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" strokeWidth={2} />
                <span className="text-xs text-foreground">Lifestyle optimization context</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" strokeWidth={2} />
                <span className="text-xs text-foreground">Unlimited system access</span>
              </li>
              <li className="flex items-start gap-2 pt-2 mt-2 border-t border-border">
                <span className="text-xs text-muted-foreground italic">You manage timing and decisions</span>
              </li>
            </ul>

            <Button asChild variant="outline" className="w-full border-primary/50 hover:bg-primary/10 hover:border-primary">
              <Link href="/assessment?tier=basic">Start with Basic</Link>
            </Button>
          </div>

          {/* Premium Tier - Highlighted */}
          <div className="relative bg-card border-2 border-primary rounded-lg p-6 shadow-lg">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
              Most Popular
            </div>

            <h3 className="text-xl font-bold text-foreground mb-1">Premium</h3>
            <p className="text-sm text-muted-foreground mb-4">We Hold the Line for You</p>
            
            <div className="mb-4">
              <div className="flex items-baseline gap-2">
                <span className="text-lg text-muted-foreground line-through">$497</span>
                <span className="text-3xl font-bold text-foreground">$397</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-xs text-primary mt-1">Save $1,200/year</p>
            </div>

            <p className="text-xs font-semibold text-muted-foreground mb-3">Best for: Homeowners with yards (0.25-5 acres)</p>

            <p className="text-xs font-semibold text-foreground mb-2">Everything in Basic PLUS:</p>

            <ul className="space-y-2 mb-4 min-h-[280px]">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" strokeWidth={2} />
                <span className="text-xs text-foreground"><strong>Property design guidance:</strong> Water harvesting, swale placement, food forest layout</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" strokeWidth={2} />
                <span className="text-xs text-foreground">Progress tracking & system monitoring</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" strokeWidth={2} />
                <span className="text-xs text-foreground">Weekly action prompts</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" strokeWidth={2} />
                <span className="text-xs text-foreground">Seasonal timing management</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" strokeWidth={2} />
                <span className="text-xs text-foreground">Drift prevention (system flags misalignment)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" strokeWidth={2} />
                <span className="text-xs text-foreground">Expert oversight with decades of experience</span>
              </li>
            </ul>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-4">
              <p className="text-xs text-foreground italic text-center">
                "Stop wondering if you're doing it right — we manage the timing and direction"
              </p>
            </div>

            <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/assessment?tier=premium">Start with Premium</Link>
            </Button>
          </div>

          {/* Ultra-Premium Tier */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-xl font-bold text-foreground mb-1">Ultra-Premium</h3>
            <p className="text-sm text-muted-foreground mb-4">White-Glove Service</p>
            
            <div className="mb-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-foreground">$2,497</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </div>

            <p className="text-xs font-semibold text-muted-foreground mb-3">Best for: Large properties (2-20+ acres)</p>

            <p className="text-xs font-semibold text-foreground mb-2">Everything in Premium PLUS:</p>

            <ul className="space-y-2 mb-4 min-h-[280px]">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" strokeWidth={2} />
                <span className="text-xs text-foreground"><strong>Digital property mapping</strong> (CAD plans, GIS integration)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" strokeWidth={2} />
                <span className="text-xs text-foreground"><strong>Monthly 1:1 video calls</strong> (60-90 min)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" strokeWidth={2} />
                <span className="text-xs text-foreground">Expert protocol review</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" strokeWidth={2} />
                <span className="text-xs text-foreground">Custom troubleshooting</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" strokeWidth={2} />
                <span className="text-xs text-foreground">Professional deliverables (material lists, timelines)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" strokeWidth={2} />
                <span className="text-xs text-foreground">Priority support (2-hour response)</span>
              </li>
            </ul>

            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mb-4">
              <p className="text-xs text-foreground font-semibold text-center">
                Limited to 30 clients
              </p>
            </div>

            <Button asChild variant="outline" className="w-full border-primary/50 hover:bg-primary/10 hover:border-primary">
              <Link href="/assessment?tier=ultra">Apply for Ultra</Link>
            </Button>
          </div>
        </div>

        {/* Guarantee */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            30-day money-back guarantee • Upgrade anytime • Founding members grandfathered forever
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
