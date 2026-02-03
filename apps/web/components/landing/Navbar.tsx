"use client";

import { Button } from "@/components/ui/button";
import Logo from "../Logo";
import Link from "next/link";
import { NavbarThemeSwitcher } from "@/components/NavbarThemeSwitcher";
const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 md:grid md:grid-cols-3">
          <div className="flex items-center justify-self-start">
            <Logo />
          </div>

          <div className="hidden md:flex items-center justify-center space-x-8 justify-self-center">
            <Link
              href="/#features"
              className="text-lg text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="/#pricing"
              className="text-lg text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
            >
              Pricing
            </Link>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4 justify-self-end">
            <NavbarThemeSwitcher />
            <Button
              variant="outlinePrimary"
              asChild
              className="text-sm sm:text-base"
            >
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button
              asChild
              className="hidden sm:inline-flex bg-primary hover:bg-primary/90 text-primary-foreground text-sm sm:text-base"
            >
              <Link href="/assessment">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
