import { describe, expect, it, beforeEach, vi } from "vitest";
import { createCheckoutSession } from "./stripe";
import { ENV } from "./env";

describe("createCheckoutSession", () => {
  beforeEach(() => {
    // Reset config guards between tests
    ENV.stripeSecretKey = "";
  });

  it("returns 500 when STRIPE_SECRET_KEY is not configured", async () => {
    const json = vi.fn();
    const status = vi.fn(() => ({ json }));
    const req = {
      protocol: "http",
      get: vi.fn(() => "localhost:3000"),
      body: {},
    } as any;
    const res = {
      status,
    } as any;

    await createCheckoutSession(req, res);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({ success: false, error: "STRIPE_SECRET_KEY is not configured" });
  });

  it("returns 400 when priceId is missing even when Stripe key is configured", async () => {
    ENV.stripeSecretKey = "sk_test_dummy";

    const json = vi.fn();
    const status = vi.fn(() => ({ json }));
    const req = {
      protocol: "http",
      get: vi.fn(() => "localhost:3000"),
      body: {},
    } as any;
    const res = {
      status,
    } as any;

    await createCheckoutSession(req, res);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ success: false, error: "priceId is required" });
  });
});
