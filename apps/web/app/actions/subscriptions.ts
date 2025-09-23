"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { stripe, STRIPE_CONFIG } from "@/lib/stripe";
import { db } from "@/lib/drizzle/db";
import { users } from "@/lib/drizzle/schema";
import { env } from "@/lib/env";
import { requireUserId, getCurrentUserId } from "@/lib/auth";

// Create Stripe checkout session for subscription
export async function createCheckoutSession(priceId: string) {
  try {
    const userId = await requireUserId();

    // Get or create user in our database
    const [dbUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!dbUser) {
      throw new Error("User not found");
    }

    let customerId = dbUser.stripe_customer_id;

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: dbUser.email,
        name: dbUser.full_name || undefined,
        metadata: {
          user_id: userId,
        },
      });

      customerId = customer.id;

      // Update user with Stripe customer ID
      await db
        .update(users)
        .set({ stripe_customer_id: customerId })
        .where(eq(users.id, userId));
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }${STRIPE_CONFIG.SUCCESS_URL}`,
      cancel_url: `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }${STRIPE_CONFIG.CANCEL_URL}`,
      allow_promotion_codes: true,
      billing_address_collection: "required",
      customer_update: {
        address: "auto",
        name: "auto",
      },
    });

    if (!session.url) {
      throw new Error("Failed to create checkout session");
    }

    redirect(session.url);
  } catch (error) {
    // Check if this is a Next.js redirect (which is expected behavior)
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      // Re-throw redirect errors so they work properly
      throw error;
    }

    console.error("Error creating checkout session:", error);
    throw new Error("Failed to create checkout session");
  }
}

// Create customer portal session for billing management
export async function createCustomerPortalSession(): Promise<{
  success: boolean;
  portalUrl?: string;
  fallbackUrl?: string;
  error?: string;
}> {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return { success: false, error: "Authentication required" };
    }

    const [dbUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!dbUser?.stripe_customer_id) {
      return { success: false, error: "No Stripe customer found" };
    }

    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: dbUser.stripe_customer_id,
        return_url: `${
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
        }/profile`,
      });

      // Return the portal URL for client-side redirect
      return {
        success: true,
        portalUrl: session.url,
      };
    } catch (stripeError: unknown) {
      console.error("Stripe customer portal error:", stripeError);

      // Check if customer portal is not configured
      const isStripeError = (
        err: unknown
      ): err is { code?: string; message?: string } => {
        return typeof err === "object" && err !== null;
      };

      if (
        isStripeError(stripeError) &&
        (stripeError.code === "customer_portal_not_enabled" ||
          stripeError.message?.includes("customer portal") ||
          stripeError.message?.includes("not enabled"))
      ) {
        // If we have a fallback URL configured, return it
        if (env.STRIPE_CUSTOMER_PORTAL_URL) {
          return {
            success: false,
            fallbackUrl: env.STRIPE_CUSTOMER_PORTAL_URL,
            error: "Customer portal not configured - using fallback",
          };
        }

        return {
          success: false,
          error:
            "Customer portal not configured. Please enable it in your Stripe Dashboard under Settings → Billing → Customer Portal.",
        };
      }

      // Other Stripe errors
      return {
        success: false,
        error: "Failed to create customer portal session",
      };
    }
  } catch (error) {
    console.error("Error creating customer portal session:", error);
    return {
      success: false,
      error: "Failed to create customer portal session",
    };
  }
}

/**
 * Create checkout session for Basic plan ($9.99)
 */
export async function createBasicCheckoutSession() {
  return createCheckoutSession(STRIPE_CONFIG.BASIC_PRICE_ID);
}

/**
 * Create checkout session for Pro plan ($19.99)
 */
export async function createProCheckoutSession() {
  return createCheckoutSession(STRIPE_CONFIG.PRO_PRICE_ID);
}

/**
 * Redirect to Customer Portal for subscription management
 * This handles upgrades, downgrades, cancellations, and all other subscription changes
 */
export async function redirectToCustomerPortal(): Promise<void> {
  const result = await createCustomerPortalSession();

  if (result.success && result.portalUrl) {
    redirect(result.portalUrl);
  } else if (result.fallbackUrl) {
    redirect(result.fallbackUrl);
  } else {
    // Redirect back to profile with error
    redirect("/profile?error=portal_unavailable");
  }
}
