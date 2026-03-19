import { Request, Response } from "express";
import Stripe from "stripe";
import { ENV } from "./env";

function getStripeClient(): Stripe {
  if (!ENV.stripeSecretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }

  return new Stripe(ENV.stripeSecretKey, {
    apiVersion: "2026-02-25.clover",
  });
}

export async function createCheckoutSession(req: Request, res: Response) {
  if (!ENV.stripeSecretKey) {
    return res.status(500).json({ success: false, error: "STRIPE_SECRET_KEY is not configured" });
  }

  try {
    const { priceId, quantity = 1 } = req.body as { priceId?: string; quantity?: number };

    if (!priceId) {
      return res.status(400).json({ success: false, error: "priceId is required" });
    }

    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity,
        },
      ],
      success_url: `${req.protocol}://${req.get("host")}/?checkout=success`,
      cancel_url: `${req.protocol}://${req.get("host")}/?checkout=cancel`,
    });

    res.status(200).json({ success: true, url: session.url });
  } catch (error) {
    console.error("[Stripe] createCheckoutSession error", error);
    res.status(500).json({ success: false, error: (error as Error).message || "Stripe checkout creation failed" });
  }
}
