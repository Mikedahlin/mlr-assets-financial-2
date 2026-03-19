/**
 * ML&R Assets LLC - Landing Page with KIRA Nudge Engine
 * Design: Green + Gold (Money Colors)
 * - Deep emerald green (#1B5E3F) for authority, growth
 * - Warm gold (#D4A574) for CTAs and highlights
 * - Clean whites and charcoal for premium feel
 */

import { useState, useRef, useEffect } from "react";
import { Mail, ArrowRight, TrendingUp, AlertCircle, Zap, ChevronRight } from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    title: "Upgrade Prediction",
    description: "Identifies customers likely to upgrade before they do. Get ahead of expansion opportunities.",
    color: "#D4A574",
  },
  {
    icon: AlertCircle,
    title: "Revenue Intelligence Alerts",
    description: "Real-time insights into expansion, churn risk, and hidden revenue opportunities automatically.",
    color: "#1B5E3F",
  },
  {
    icon: Zap,
    title: "Actionable Recommendations",
    description: "Tells businesses exactly what action to take to increase revenue. No guesswork.",
    color: "#E8746B",
  },
];

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [isStripeLoading, setIsStripeLoading] = useState(false);

  const stripePriceId = import.meta.env.VITE_STRIPE_PRICE_ID;
  const isStripeConfigured = Boolean(stripePriceId);

  const handleStripeCheckout = async () => {
    setIsStripeLoading(true);

    try {
      if (!stripePriceId) {
        throw new Error("VITE_STRIPE_PRICE_ID is not set in environment variables");
      }

      const priceId = stripePriceId;
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, quantity: 1 }),
      });
      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Stripe checkout creation failed");
      }

      window.location.href = data.url;
    } catch (error) {
      console.error("Stripe checkout error", error);
      alert(`Stripe checkout failed: ${(error as Error).message}`);
    } finally {
      setIsStripeLoading(false);
    }
  };


  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#050505", color: "#EAE6DC" }}>
      {/* ── Navigation ── */}
      <nav className="sticky top-0 z-50 border-b" style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(8px)", borderColor: "#1B5E3F" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <div className="w-2 h-8 rounded" style={{ background: "#D4A574" }} />
            <span className="text-xl font-bold" style={{ color: "#D4A574" }}>
              ML&R Assets
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm" style={{ color: "#EAE6DC" }}>
            <a href="#features" className="hover:text-green-300 transition-colors">Features</a>
            <a href="#nudge-engine" className="hover:text-green-300 transition-colors">Nudge Engine</a>
            <a href="#contact" className="hover:text-green-300 transition-colors">Contact</a>
          </div>
          <button
            className="px-6 py-2 rounded font-semibold transition-all"
            style={{ background: "#D4A574", color: "white" }}
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section
        ref={heroRef}
        className="relative overflow-hidden py-20 md:py-32"
        style={{
          background: "linear-gradient(135deg, #050505 0%, #09120f 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="text-sm font-semibold mb-4 tracking-wide" style={{ color: "#D4A574" }}>
              REVENUE INTELLIGENCE ENGINE
            </div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6" style={{ color: "#1B5E3F" }}>
              Predict Revenue. Stop Guessing.
            </h1>
            <p className="text-lg leading-relaxed mb-8 max-w-xl" style={{ color: "#555" }}>
              ML&R Assets' nudge engine identifies customer expansion opportunities and churn risks before they happen. Make data-driven revenue decisions automatically.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                className="px-6 py-3 rounded font-semibold transition-all flex items-center justify-center gap-2"
                style={{ background: "#1B5E3F", color: "#EAE6DC" }}
                onClick={() => document.getElementById("nudge-engine")?.scrollIntoView({ behavior: "smooth" })}
              >
                Try KIRA Nudge Engine <ArrowRight size={18} />
              </button>
              <button
                className="px-6 py-3 rounded font-semibold transition-all border"
                style={{
                  borderColor: "#D4A574",
                  color: "#D4A574",
                  background: "rgba(0,0,0,0.4)",
                }}
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              >
                Schedule Demo
              </button>
              <button
                className="px-6 py-3 rounded font-semibold transition-all"
                style={{ background: "#D4A574", color: "#050505" }}
                onClick={handleStripeCheckout}
                disabled={isStripeLoading || !isStripeConfigured}
              >
                {isStripeLoading ? "Redirecting…" : "Checkout with Stripe"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-20 md:py-28 border-b" style={{ borderColor: "#E8E6E1" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <div className="text-sm font-semibold mb-4 tracking-wide" style={{ color: "#D4A574" }}>
              CORE CAPABILITIES
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "#1B5E3F" }}>
              Revenue Intelligence That Works
            </h2>
            <p className="text-lg max-w-2xl" style={{ color: "#555" }}>
              Our nudge engine combines predictive AI with actionable insights to help SaaS and subscription businesses grow faster.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="p-6 rounded border transition-all" style={{ borderColor: "#E8E6E1", background: "#FFF" }}>
                  <div className="mb-4 p-3 rounded-lg w-fit" style={{ background: feature.color + "20" }}>
                    <Icon size={24} style={{ color: feature.color }} />
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: "#1B5E3F" }}>
                    {feature.title}
                  </h3>
                  <p style={{ color: "#666" }}>
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Nudge Engine CTA ── */}
      <section id="nudge-engine" className="py-20 md:py-28 border-b" style={{ borderColor: "#E8E6E1", background: "#F0F8F5" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-sm font-semibold mb-4 tracking-wide" style={{ color: "#D4A574" }}>
              INTERACTIVE TOOL
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "#1B5E3F" }}>
              Try the Nudge Engine
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "#555" }}>
              Upload customer data or connect your Stripe/Chargebee account to see real-time revenue predictions and actionable nudges.
            </p>
          </div>

          <div className="bg-white rounded-lg border p-8" style={{ borderColor: "#E8E6E1" }}>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-4" style={{ color: "#1B5E3F" }}>Demo Mode</h3>
                <p className="mb-6" style={{ color: "#666" }}>
                  Explore with sample customer data to see how the nudge engine identifies upgrade opportunities, churn risks, and revenue impact.
                </p>
                <button
                  className="px-6 py-3 rounded font-semibold transition-all flex items-center gap-2"
                  style={{ background: "#D4A574", color: "white" }}
                  onClick={() => window.location.href = "/kira"}
                >
                  Launch Demo <ChevronRight size={18} />
                </button>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4" style={{ color: "#1B5E3F" }}>Real Integration</h3>
                <p className="mb-6" style={{ color: "#666" }}>
                  Connect your Stripe or Chargebee account for live analysis. The engine learns from your data to provide hyper-personalized recommendations.
                </p>
                <button
                  className="px-6 py-3 rounded font-semibold transition-all border"
                  style={{ borderColor: "#D4A574", color: "#1B5E3F" }}
                  onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Schedule Setup
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="contact" className="py-20 md:py-28 border-b" style={{ borderColor: "#E8E6E1" }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "#1B5E3F" }}>
              Ready to Predict Revenue?
            </h2>
            <p className="text-lg" style={{ color: "#555" }}>
              Schedule a demo with our team. We'll show you how the nudge engine can identify hidden revenue opportunities in your business.
            </p>
          </div>

          <form className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-3 rounded border"
                style={{ borderColor: "#E8E6E1" }}
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="your@company.com"
                className="w-full px-4 py-3 rounded border"
                style={{ borderColor: "#E8E6E1" }}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Company Name"
                className="w-full px-4 py-3 rounded border"
                style={{ borderColor: "#E8E6E1" }}
              />
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 rounded font-semibold transition-all flex items-center justify-center gap-2"
              style={{ background: "#D4A574", color: "white" }}
            >
              Request Demo <Mail size={18} />
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: "#999" }}>
            We'll be in touch within 24 hours. No credit card required.
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 border-t" style={{ borderColor: "#E8E6E1" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-6 rounded" style={{ background: "#D4A574" }} />
                <span className="text-lg font-bold" style={{ color: "#1B5E3F" }}>ML&R Assets</span>
              </div>
              <p className="text-xs" style={{ color: "#999" }}>
                Revenue Intelligence Engine
              </p>
            </div>
            <div className="text-xs" style={{ color: "#999" }}>
              <p className="mb-1">Nudge Engine is a product of ML&amp;R Assets LLC</p>
              <p>© 2026 ML&amp;R Assets LLC. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
