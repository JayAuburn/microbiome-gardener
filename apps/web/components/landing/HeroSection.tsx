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
            Welcome to Rewild.bio
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Restore what modern life takes away — from container gardens to complete property ecosystems.
          </p>

          {/* Supporting line */}
          <p className="text-base text-muted-foreground mb-8 max-w-2xl mx-auto">
            Expert growing guidance and a complete systems approach to food, land, and daily life.
          </p>

          {/* CTA Button */}
          <div className="mb-12">
            <Button
              size="lg"
              asChild
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg"
            >
              <Link href="/assessment">
                Take Free Assessment
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
              <span>Science-Informed Systems</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" strokeWidth={2.5} />
              <span>Adapts to Your Reality</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
